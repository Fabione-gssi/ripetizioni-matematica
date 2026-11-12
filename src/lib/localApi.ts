// Modalità demo: tutti i dati restano nel dispositivo (localStorage).
// Serve a provare l'app senza backend: più account sullo stesso dispositivo
// simulano studente e professore. NON è pensata per l'uso reale.
import { UserError, type Api, type SignUpData } from './api';
import type { AiMessage, Attempt, Link, Message, Profile, Submission, TestResult, Verdict } from './types';

interface Db {
  users: (Profile & { email: string; pass: string })[];
  session: string | null;
  links: Link[];
  progress: { student_id: string; lesson_id: string; completed_at: string }[];
  attempts: Attempt[];
  tests: TestResult[];
  messages: Message[];
  ai: AiMessage[];
  subs: Submission[];
  images: Record<string, string>;
}

const KEY = 'ripetizioni-demo-v1';
const empty = (): Db => ({ users: [], session: null, links: [], progress: [], attempts: [], tests: [], messages: [], ai: [], subs: [], images: {} });
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const now = () => new Date().toISOString();

async function digest(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const toDataUrl = (b: Blob) =>
  new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(b);
  });

export class LocalApi implements Api {
  readonly demo = true;
  private listeners = new Set<() => void>();
  private msgListeners = new Set<() => void>();

  private load(): Db {
    try {
      return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
    } catch {
      return empty();
    }
  }
  private save(db: Db) {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
      throw new UserError('Memoria del dispositivo piena (modalità demo).');
    }
  }
  private me(db: Db): Profile {
    const u = db.users.find((x) => x.id === db.session);
    if (!u) throw new UserError('Sessione scaduta: accedi di nuovo.');
    return u;
  }
  private pub = (u: Profile): Profile => ({ id: u.id, role: u.role, full_name: u.full_name, school_year: u.school_year, accepting: u.accepting });

  async currentProfile() {
    const db = this.load();
    const u = db.users.find((x) => x.id === db.session);
    return u ? this.pub(u) : null;
  }
  onAuthChange(cb: () => void) {
    this.listeners.add(cb);
    return () => void this.listeners.delete(cb);
  }
  private emit() {
    this.listeners.forEach((l) => l());
  }

  async signUp(d: SignUpData) {
    const db = this.load();
    const email = d.email.trim().toLowerCase();
    if (db.users.some((u) => u.email === email)) throw new UserError('Esiste già un account con questa email.');
    const id = uid();
    db.users.push({ id, email, pass: await digest(d.password), role: d.role, full_name: d.fullName.trim(), school_year: d.schoolYear, accepting: true });
    db.session = id;
    this.save(db);
    this.emit();
    return { needsEmailConfirm: false };
  }
  async signIn(email: string, password: string) {
    const db = this.load();
    const h = await digest(password);
    const u = db.users.find((x) => x.email === email.trim().toLowerCase() && x.pass === h);
    if (!u) throw new UserError('Email o password non corretti.');
    db.session = u.id;
    this.save(db);
    this.emit();
  }
  async signOut() {
    const db = this.load();
    db.session = null;
    this.save(db);
    this.emit();
  }
  async updateProfile(patch: Partial<Pick<Profile, 'full_name' | 'school_year' | 'accepting'>>) {
    const db = this.load();
    Object.assign(this.me(db), patch);
    this.save(db);
    this.emit();
  }

  async deleteAccount() {
    const db = this.load();
    const id = this.me(db).id;
    const mine = (x: { student_id: string; teacher_id?: string }) => x.student_id === id || x.teacher_id === id;
    for (const s of db.subs.filter(mine)) delete db.images[s.image_path];
    db.users = db.users.filter((u) => u.id !== id);
    db.links = db.links.filter((x) => !mine(x));
    db.progress = db.progress.filter((x) => !mine(x));
    db.attempts = db.attempts.filter((x) => !mine(x));
    db.tests = db.tests.filter((x) => !mine(x));
    db.messages = db.messages.filter((x) => !mine(x));
    db.ai = db.ai.filter((x) => !mine(x));
    db.subs = db.subs.filter((x) => !mine(x));
    db.session = null;
    this.save(db);
    this.emit();
  }

  async listTeachers() {
    return this.load()
      .users.filter((u) => u.role === 'teacher' && u.accepting)
      .map((u) => ({ id: u.id, full_name: u.full_name }));
  }
  private withOther(db: Db, l: Link, otherId: string): Link {
    const o = db.users.find((u) => u.id === otherId);
    return { ...l, other: o ? { id: o.id, full_name: o.full_name, school_year: o.school_year } : undefined };
  }
  async myLink() {
    const db = this.load();
    const me = this.me(db);
    const mine = db.links.filter((l) => l.student_id === me.id).sort((a, b) => b.created_at.localeCompare(a.created_at));
    const l = mine.find((x) => x.status !== 'rejected') ?? mine[0];
    return l ? this.withOther(db, l, l.teacher_id) : null;
  }
  async requestLink(teacherId: string) {
    const db = this.load();
    const me = this.me(db);
    if (db.links.some((l) => l.student_id === me.id && l.status !== 'rejected')) throw new UserError('Hai già una richiesta attiva.');
    db.links.push({ id: uid(), student_id: me.id, teacher_id: teacherId, status: 'pending', created_at: now() });
    this.save(db);
  }
  async removeLink(linkId: string) {
    const db = this.load();
    const me = this.me(db);
    db.links = db.links.filter((l) => !(l.id === linkId && (l.student_id === me.id || l.teacher_id === me.id)));
    this.save(db);
  }
  async teacherLinks() {
    const db = this.load();
    const me = this.me(db);
    return db.links.filter((l) => l.teacher_id === me.id && l.status !== 'rejected').map((l) => this.withOther(db, l, l.student_id));
  }
  async decideLink(linkId: string, accept: boolean) {
    const db = this.load();
    const me = this.me(db);
    const l = db.links.find((x) => x.id === linkId && x.teacher_id === me.id);
    if (l) l.status = accept ? 'accepted' : 'rejected';
    this.save(db);
  }

  async listProgress(studentId: string) {
    return this.load().progress.filter((p) => p.student_id === studentId);
  }
  async completeLesson(lessonId: string) {
    const db = this.load();
    const me = this.me(db);
    if (!db.progress.some((p) => p.student_id === me.id && p.lesson_id === lessonId)) {
      db.progress.push({ student_id: me.id, lesson_id: lessonId, completed_at: now() });
      this.save(db);
    }
  }
  async addAttempt(a: Omit<Attempt, 'student_id'>) {
    const db = this.load();
    db.attempts.push({ ...a, id: uid(), student_id: this.me(db).id, created_at: now() });
    this.save(db);
  }
  async listAttempts(studentId: string) {
    return this.load().attempts.filter((a) => a.student_id === studentId);
  }
  async addTestResult(t: Omit<TestResult, 'student_id'>) {
    const db = this.load();
    db.tests.push({ ...t, id: uid(), student_id: this.me(db).id, created_at: now() });
    this.save(db);
  }
  async listTestResults(studentId: string) {
    return this.load().tests.filter((t) => t.student_id === studentId);
  }

  async listMessages(studentId: string, teacherId: string) {
    return this.load().messages.filter((m) => m.student_id === studentId && m.teacher_id === teacherId);
  }
  async sendMessage(studentId: string, teacherId: string, body: string) {
    const db = this.load();
    db.messages.push({ id: uid(), student_id: studentId, teacher_id: teacherId, sender_id: this.me(db).id, body, created_at: now(), read_at: null });
    this.save(db);
    this.msgListeners.forEach((l) => l());
  }
  async markRead(studentId: string, teacherId: string) {
    const db = this.load();
    const me = this.me(db);
    let changed = false;
    for (const m of db.messages)
      if (m.student_id === studentId && m.teacher_id === teacherId && m.sender_id !== me.id && !m.read_at) {
        m.read_at = now();
        changed = true;
      }
    if (changed) this.save(db);
  }
  async unreadCounts() {
    const db = this.load();
    const me = this.me(db);
    const out: Record<string, number> = {};
    for (const m of db.messages)
      if ((m.student_id === me.id || m.teacher_id === me.id) && m.sender_id !== me.id && !m.read_at) out[m.student_id] = (out[m.student_id] ?? 0) + 1;
    return out;
  }
  onNewMessage(cb: () => void) {
    this.msgListeners.add(cb);
    return () => void this.msgListeners.delete(cb);
  }

  async listAiMessages(studentId: string) {
    return this.load().ai.filter((m) => m.student_id === studentId);
  }
  async askAi(text: string) {
    const db = this.load();
    const me = this.me(db);
    db.ai.push({ id: uid(), student_id: me.id, role: 'user', body: text, created_at: now() });
    db.ai.push({
      id: uid(),
      student_id: me.id,
      role: 'assistant',
      body: 'In modalità demo il tutor AI non è collegato. Con il backend configurato, qui riceverai una spiegazione passo per passo. Per esempio, una formula verrebbe mostrata così: $x_{1,2}=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.',
      created_at: now(),
    });
    this.save(db);
  }

  async createSubmission(image: Blob, note: string, unitId: string | null) {
    const db = this.load();
    const me = this.me(db);
    const link = db.links.find((l) => l.student_id === me.id && l.status === 'accepted');
    if (!link) throw new UserError('Per inviare un esercizio devi prima essere associato a un professore.');
    const path = `${me.id}/${uid()}.jpg`;
    db.images[path] = await toDataUrl(image);
    db.subs.push({ id: uid(), student_id: me.id, teacher_id: link.teacher_id, image_path: path, note, unit_id: unitId, status: 'pending', verdict: null, feedback: null, created_at: now(), reviewed_at: null });
    this.save(db);
  }
  async listSubmissions(studentId: string) {
    return this.load().subs.filter((s) => s.student_id === studentId);
  }
  async reviewSubmission(id: string, verdict: Verdict, feedback: string) {
    const db = this.load();
    const me = this.me(db);
    const s = db.subs.find((x) => x.id === id && x.teacher_id === me.id);
    if (s) Object.assign(s, { verdict, feedback, status: 'reviewed', reviewed_at: now() });
    this.save(db);
  }
  async imageUrl(path: string) {
    return this.load().images[path] ?? '';
  }
}
