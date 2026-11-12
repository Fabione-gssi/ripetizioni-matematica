// Implementazione reale su Supabase. La sicurezza NON dipende da questo codice:
// è garantita dalle regole RLS del database (vedi supabase/migrations).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { UserError, type Api, type SignUpData } from './api';
import type { AiMessage, Attempt, Link, Message, Profile, Submission, TestResult, Verdict } from './types';

const BUCKET = 'submissions';
const OUTBOX = 'ripetizioni-outbox-v1';

/** Scritture rimandate quando manca la rete (progressi ed esercizi svolti). */
type Pending = { table: 'progress' | 'attempts' | 'test_results'; row: Record<string, unknown> };

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export class SupabaseApi implements Api {
  readonly demo = false;
  private sb: SupabaseClient;
  private uidCache: string | null = null;

  constructor(url: string, anonKey: string) {
    this.sb = createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
    window.addEventListener('online', () => void this.flush());
  }

  private async uid(): Promise<string> {
    if (this.uidCache) return this.uidCache;
    const { data } = await this.sb.auth.getSession();
    const id = data.session?.user.id;
    if (!id) throw new UserError('Sessione scaduta: accedi di nuovo.');
    this.uidCache = id;
    return id;
  }

  // ---------- coda offline ----------
  private readOutbox(): Pending[] {
    try {
      return JSON.parse(localStorage.getItem(OUTBOX) ?? '[]');
    } catch {
      return [];
    }
  }
  private writeOutbox(items: Pending[]) {
    try {
      localStorage.setItem(OUTBOX, JSON.stringify(items.slice(-500)));
    } catch {
      /* memoria piena: si perde solo la coda */
    }
  }
  private async insertRow(p: Pending): Promise<boolean> {
    const q = p.table === 'progress' ? this.sb.from(p.table).upsert(p.row, { onConflict: 'student_id,lesson_id', ignoreDuplicates: true }) : this.sb.from(p.table).insert(p.row);
    const { error } = await q;
    if (!error) return true;
    // Errori di rete: si riprova più tardi. Altri errori (dati rifiutati): si scarta.
    return !/fetch|network/i.test(error.message);
  }
  private flushing = false;
  private async flush() {
    if (this.flushing) return;
    this.flushing = true;
    try {
      let items = this.readOutbox();
      while (items.length) {
        if (!(await this.insertRow(items[0]))) break;
        items = items.slice(1);
        this.writeOutbox(items);
      }
    } finally {
      this.flushing = false;
    }
  }
  private async write(p: Pending) {
    await this.flush();
    let done = false;
    try {
      done = this.readOutbox().length === 0 && (await this.insertRow(p));
    } catch {
      done = false;
    }
    if (!done) this.writeOutbox([...this.readOutbox(), p]);
  }

  // ---------- autenticazione ----------
  async currentProfile(): Promise<Profile | null> {
    const { data } = await this.sb.auth.getSession();
    const user = data.session?.user;
    this.uidCache = user?.id ?? null;
    if (!user) return null;
    const res = await this.sb.from('profiles').select('id, role, full_name, school_year, accepting').eq('id', user.id).maybeSingle();
    void this.flush();
    return check(res) as Profile | null;
  }
  onAuthChange(cb: () => void) {
    const { data } = this.sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        this.uidCache = null;
        // setTimeout: evita di chiamare Supabase dentro il suo stesso callback.
        setTimeout(cb, 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }
  async signUp(d: SignUpData) {
    const { data, error } = await this.sb.auth.signUp({
      email: d.email.trim(),
      password: d.password,
      options: { data: { full_name: d.fullName.trim(), role: d.role, school_year: d.schoolYear } },
    });
    if (error) throw new Error(error.message);
    return { needsEmailConfirm: !data.session };
  }
  async signIn(email: string, password: string) {
    const { error } = await this.sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(error.message);
  }
  async signOut() {
    await this.sb.auth.signOut();
    localStorage.removeItem(OUTBOX);
  }
  async updateProfile(patch: Partial<Pick<Profile, 'full_name' | 'school_year' | 'accepting'>>) {
    check(await this.sb.from('profiles').update(patch).eq('id', await this.uid()));
  }
  async deleteAccount() {
    const id = await this.uid();
    // Prima le foto (lo storage non si cancella a cascata), poi l'account.
    const { data: files } = await this.sb.storage.from(BUCKET).list(id, { limit: 1000 });
    if (files?.length) await this.sb.storage.from(BUCKET).remove(files.map((f) => `${id}/${f.name}`));
    check(await this.sb.rpc('delete_my_account'));
    await this.sb.auth.signOut({ scope: 'local' });
    localStorage.removeItem(OUTBOX);
  }

  // ---------- associazione ----------
  async listTeachers() {
    const res = await this.sb.from('profiles').select('id, full_name').eq('role', 'teacher').eq('accepting', true).order('full_name');
    return check(res) as Pick<Profile, 'id' | 'full_name'>[];
  }
  async myLink(): Promise<Link | null> {
    const res = await this.sb
      .from('links')
      .select('*, other:profiles!links_teacher_id_fkey(id, full_name, school_year)')
      .eq('student_id', await this.uid())
      .order('created_at', { ascending: false });
    const rows = check(res) as Link[];
    return rows.find((l) => l.status !== 'rejected') ?? rows[0] ?? null;
  }
  async requestLink(teacherId: string) {
    const { error } = await this.sb.from('links').insert({ student_id: await this.uid(), teacher_id: teacherId });
    if (error) throw /links_one_active|duplicate/i.test(error.message) ? new UserError('Hai già una richiesta attiva.') : new Error(error.message);
  }
  async removeLink(linkId: string) {
    check(await this.sb.from('links').delete().eq('id', linkId));
  }
  async teacherLinks() {
    const res = await this.sb
      .from('links')
      .select('*, other:profiles!links_student_id_fkey(id, full_name, school_year)')
      .eq('teacher_id', await this.uid())
      .in('status', ['pending', 'accepted'])
      .order('created_at', { ascending: false });
    return check(res) as Link[];
  }
  async decideLink(linkId: string, accept: boolean) {
    check(await this.sb.from('links').update({ status: accept ? 'accepted' : 'rejected' }).eq('id', linkId));
  }

  // ---------- progressi ----------
  async listProgress(studentId: string) {
    const rows = check(await this.sb.from('progress').select('lesson_id, completed_at').eq('student_id', studentId)) as { lesson_id: string; completed_at: string }[];
    // Include ciò che è ancora in coda, così lo studente vede subito i propri progressi.
    const queued = this.readOutbox()
      .filter((p) => p.table === 'progress' && p.row.student_id === studentId)
      .map((p) => ({ lesson_id: p.row.lesson_id as string, completed_at: new Date().toISOString() }));
    return [...rows, ...queued.filter((q) => !rows.some((r) => r.lesson_id === q.lesson_id))];
  }
  async completeLesson(lessonId: string) {
    await this.write({ table: 'progress', row: { student_id: await this.uid(), lesson_id: lessonId } });
  }
  async addAttempt(a: Omit<Attempt, 'student_id'>) {
    await this.write({ table: 'attempts', row: { ...a, question: a.question.slice(0, 4000), given: a.given.slice(0, 1000), student_id: await this.uid(), created_at: new Date().toISOString() } });
  }
  async listAttempts(studentId: string) {
    const res = await this.sb.from('attempts').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(1000);
    return check(res) as Attempt[];
  }
  async addTestResult(t: Omit<TestResult, 'student_id'>) {
    await this.write({ table: 'test_results', row: { ...t, student_id: await this.uid(), created_at: new Date().toISOString() } });
  }
  async listTestResults(studentId: string) {
    const res = await this.sb.from('test_results').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(200);
    return check(res) as TestResult[];
  }

  // ---------- chat con il professore ----------
  async listMessages(studentId: string, teacherId: string) {
    const res = await this.sb.from('messages').select('*').eq('student_id', studentId).eq('teacher_id', teacherId).order('created_at', { ascending: false }).limit(300);
    return (check(res) as Message[]).reverse();
  }
  async sendMessage(studentId: string, teacherId: string, body: string) {
    check(await this.sb.from('messages').insert({ student_id: studentId, teacher_id: teacherId, sender_id: await this.uid(), body: body.slice(0, 4000) }));
  }
  async markRead(studentId: string, teacherId: string) {
    check(await this.sb.rpc('mark_thread_read', { p_student: studentId, p_teacher: teacherId }));
  }
  async unreadCounts() {
    const me = await this.uid();
    const res = await this.sb.from('messages').select('student_id').is('read_at', null).neq('sender_id', me).limit(1000);
    const out: Record<string, number> = {};
    for (const r of check(res) as { student_id: string }[]) out[r.student_id] = (out[r.student_id] ?? 0) + 1;
    return out;
  }
  onNewMessage(cb: () => void) {
    // Realtime (rispetta le RLS) + controllo periodico di riserva.
    const ch = this.sb
      .channel(`messages-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => cb())
      .subscribe();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') cb();
    }, 30000);
    return () => {
      window.clearInterval(timer);
      void this.sb.removeChannel(ch);
    };
  }

  // ---------- tutor AI ----------
  async listAiMessages(studentId: string) {
    const res = await this.sb.from('ai_messages').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(200);
    return (check(res) as AiMessage[]).reverse();
  }
  async askAi(text: string, context: string) {
    const { data, error } = await this.sb.functions.invoke(import.meta.env.VITE_AI_FUNCTION || 'ai-tutor', { body: { text, context } });
    if (error) {
      // Il messaggio per l'utente è nel corpo della risposta della funzione.
      let msg = '';
      try {
        msg = (await (error as { context?: Response }).context?.json())?.error ?? '';
      } catch {
        /* corpo non JSON */
      }
      throw new UserError(msg || 'Il tutor AI non è al momento disponibile. Puoi scrivere al tuo professore.');
    }
    if (!data?.reply) throw new UserError('Il tutor AI non ha saputo rispondere. Prova a riformulare la domanda.');
  }

  // ---------- esercizi fotografati ----------
  async createSubmission(image: Blob, note: string, unitId: string | null) {
    const me = await this.uid();
    const link = await this.myLink();
    if (!link || link.status !== 'accepted') throw new UserError('Per inviare un esercizio devi prima essere associato a un professore.');
    const path = `${me}/${crypto.randomUUID()}.jpg`;
    const up = await this.sb.storage.from(BUCKET).upload(path, image, { contentType: 'image/jpeg', upsert: false });
    if (up.error) throw new Error(up.error.message);
    const { error } = await this.sb.from('submissions').insert({ student_id: me, teacher_id: link.teacher_id, image_path: path, note: note.slice(0, 2000), unit_id: unitId });
    if (error) {
      await this.sb.storage.from(BUCKET).remove([path]);
      throw new Error(error.message);
    }
  }
  async listSubmissions(studentId: string) {
    const res = await this.sb.from('submissions').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(200);
    return check(res) as Submission[];
  }
  async reviewSubmission(id: string, verdict: Verdict, feedback: string) {
    check(await this.sb.from('submissions').update({ verdict, feedback: feedback.slice(0, 4000) }).eq('id', id));
  }
  async imageUrl(path: string) {
    const { data, error } = await this.sb.storage.from(BUCKET).createSignedUrl(path, 3600);
    if (error) throw new Error(error.message);
    return data.signedUrl;
  }
}
