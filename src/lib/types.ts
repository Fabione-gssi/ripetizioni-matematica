// Tipi condivisi: contenuti didattici e dati applicativi.

// ---------- Contenuti ----------

/** Parametro regolabile con uno slider in un grafico interattivo. */
export interface PlotParam {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export type P = Record<string, number>;

export type Shape =
  | { k: 'fn'; f: (x: number) => number; color?: string; dash?: boolean }
  | { k: 'param'; x: (t: number) => number; y: (t: number) => number; t0: number; t1: number; color?: string; dash?: boolean }
  | { k: 'pt'; x: number; y: number; label?: string; color?: string }
  | { k: 'seg'; x1: number; y1: number; x2: number; y2: number; color?: string; dash?: boolean }
  | { k: 'vline'; x: number; color?: string; dash?: boolean };

export type Block =
  /** Spiegazione discorsiva. */
  | { t: 'text'; md: string }
  /** Spiegazione divulgativa ("In parole semplici"). */
  | { t: 'idea'; md: string }
  /** Definizione o regola formale. */
  | { t: 'def'; title: string; md: string }
  /** Teorema con dimostrazione guidata passo per passo (facoltativa). */
  | { t: 'thm'; title: string; md: string; proof?: string[] }
  /** Esempio svolto passo per passo. */
  | { t: 'ex'; title: string; steps: string[] }
  /** Attenzione: errore tipico. */
  | { t: 'warn'; md: string }
  /** Grafico interattivo. */
  | {
      t: 'plot';
      title: string;
      caption?: string;
      view: [number, number, number, number];
      params?: PlotParam[];
      draw: (p: P) => Shape[];
      readout?: (p: P) => string;
    }
  /** Domanda di verifica rapida della comprensione. */
  | { t: 'quiz'; q: string; options: Option[] };

export interface Option {
  md: string;
  ok?: boolean;
  /** Perché questa risposta è sbagliata (errore tipico) o giusta. */
  why?: string;
}

/** Passo di un esercizio in modalità guidata: una mini-domanda. */
export interface Step {
  ask: string;
  options: Option[];
  /** Spiegazione mostrata dopo la risposta. */
  explain: string;
}

export interface Exercise {
  /** Identificatore del generatore che l'ha prodotto. */
  id: string;
  level: 1 | 2 | 3;
  text: string;
  /** Risposta a scelta multipla… */
  options?: Option[];
  /** …oppure numerica. */
  answer?: number;
  tol?: number;
  /** Suggerimenti progressivi (modalità "con suggerimenti"). */
  hints: string[];
  /** Passi guidati (modalità "guidata"). Se assenti si usa la soluzione svelata a passi. */
  steps?: Step[];
  /** Soluzione completa, passo per passo. */
  solution: string[];
}

export type Rng = () => number;

export interface ExerciseGen {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  make: (r: Rng) => Omit<Exercise, 'id' | 'level'>;
}

export interface Lesson {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Unit {
  id: string;
  year: 3 | 4;
  title: string;
  summary: string;
  lessons: Lesson[];
  exercises: ExerciseGen[];
}

// ---------- Dati applicativi ----------

export type Role = 'student' | 'teacher';

export interface Profile {
  id: string;
  role: Role;
  full_name: string;
  school_year: number | null;
  accepting: boolean;
}

export type LinkStatus = 'pending' | 'accepted' | 'rejected';

export interface Link {
  id: string;
  student_id: string;
  teacher_id: string;
  status: LinkStatus;
  created_at: string;
  /** Profilo della controparte (professore per lo studente, studente per il professore). */
  other?: Pick<Profile, 'id' | 'full_name' | 'school_year'>;
}

export type Mode = 'guided' | 'hints' | 'solo' | 'test';

export interface Attempt {
  id?: string;
  student_id: string;
  unit_id: string;
  exercise_id: string;
  mode: Mode;
  level: number;
  correct: boolean;
  hints_used: number;
  question: string;
  given: string;
  created_at?: string;
}

export interface TestResult {
  id?: string;
  student_id: string;
  unit_id: string;
  score: number;
  total: number;
  grade: number;
  duration_s: number;
  details: { question: string; given: string; correct: boolean }[];
  created_at?: string;
}

export interface Message {
  id: string;
  student_id: string;
  teacher_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface AiMessage {
  id: string;
  student_id: string;
  role: 'user' | 'assistant';
  body: string;
  created_at: string;
}

export type Verdict = 'correct' | 'partial' | 'wrong';

export interface Submission {
  id: string;
  student_id: string;
  teacher_id: string;
  image_path: string;
  note: string;
  unit_id: string | null;
  status: 'pending' | 'reviewed';
  verdict: Verdict | null;
  feedback: string | null;
  created_at: string;
  reviewed_at: string | null;
}

/** Lezioni ed esercizi aggiuntivi di un'unità, tenuti in un file separato (vedi content/index.ts). */
export type UnitExtra = Pick<Unit, 'lessons' | 'exercises'> & { summary?: string };
