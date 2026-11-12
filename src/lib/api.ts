// Interfaccia unica verso i dati. Due implementazioni:
//  - SupabaseApi: backend reale (account, sincronizzazione, chat, foto, tutor AI)
//  - LocalApi:    modalità demo, tutto nel dispositivo (per provare l'app senza backend)
import type { AiMessage, Attempt, Link, Message, Profile, Role, Submission, TestResult, Verdict } from './types';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  schoolYear: number | null;
}

export interface Api {
  readonly demo: boolean;

  // Autenticazione e profilo
  currentProfile(): Promise<Profile | null>;
  onAuthChange(cb: () => void): () => void;
  signUp(d: SignUpData): Promise<{ needsEmailConfirm: boolean }>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  updateProfile(patch: Partial<Pick<Profile, 'full_name' | 'school_year' | 'accepting'>>): Promise<void>;
  /** Cancella definitivamente l'account e tutti i dati collegati. */
  deleteAccount(): Promise<void>;

  // Associazione studente-professore
  listTeachers(): Promise<Pick<Profile, 'id' | 'full_name'>[]>;
  /** Studente: la propria richiesta attiva (in attesa o accettata) o l'ultima rifiutata. */
  myLink(): Promise<Link | null>;
  requestLink(teacherId: string): Promise<void>;
  removeLink(linkId: string): Promise<void>;
  /** Professore: richieste in attesa e studenti accettati. */
  teacherLinks(): Promise<Link[]>;
  decideLink(linkId: string, accept: boolean): Promise<void>;

  // Progressi
  listProgress(studentId: string): Promise<{ lesson_id: string; completed_at: string }[]>;
  completeLesson(lessonId: string): Promise<void>;
  addAttempt(a: Omit<Attempt, 'student_id'>): Promise<void>;
  listAttempts(studentId: string): Promise<Attempt[]>;
  addTestResult(t: Omit<TestResult, 'student_id'>): Promise<void>;
  listTestResults(studentId: string): Promise<TestResult[]>;

  // Chat con il professore
  listMessages(studentId: string, teacherId: string): Promise<Message[]>;
  sendMessage(studentId: string, teacherId: string, body: string): Promise<void>;
  markRead(studentId: string, teacherId: string): Promise<void>;
  /** Numero di messaggi non letti, per studente (chiave = student_id). */
  unreadCounts(): Promise<Record<string, number>>;
  onNewMessage(cb: () => void): () => void;

  // Tutor AI
  listAiMessages(studentId: string): Promise<AiMessage[]>;
  askAi(text: string, context: string): Promise<void>;

  // Esercizi fotografati, corretti dal professore
  createSubmission(image: Blob, note: string, unitId: string | null): Promise<void>;
  listSubmissions(studentId: string): Promise<Submission[]>;
  reviewSubmission(id: string, verdict: Verdict, feedback: string): Promise<void>;
  imageUrl(path: string): Promise<string>;
}

/** Errore con messaggio già adatto a essere mostrato all'utente. */
export class UserError extends Error {}

export function errorMessage(e: unknown): string {
  if (e instanceof UserError) return e.message;
  const msg = e instanceof Error ? e.message : String(e);
  if (/Failed to fetch|NetworkError|network/i.test(msg)) return 'Connessione assente. Controlla la rete e riprova.';
  if (/Invalid login credentials/i.test(msg)) return 'Email o password non corretti.';
  if (/already registered|already been registered/i.test(msg)) return 'Esiste già un account con questa email.';
  if (/Email not confirmed/i.test(msg)) return 'Devi prima confermare la tua email (controlla la posta).';
  if (/rate limit/i.test(msg)) return 'Troppi tentativi ravvicinati. Riprova tra qualche minuto.';
  if (/Password should be/i.test(msg)) return 'La password deve avere almeno 8 caratteri.';
  return 'Si è verificato un errore. Riprova.';
}
