// Logica degli esercizi indipendente dall'interfaccia: generazione, controllo
// delle risposte, composizione delle verifiche e calcolo del voto.
import { rng, shuffle } from './gen';
import type { Exercise, ExerciseGen, Unit } from './types';

export const newSeed = () => (Math.floor(Math.random() * 2 ** 31) ^ Date.now()) >>> 0;

export function instantiate(g: ExerciseGen, seed: number): Exercise {
  return { ...g.make(rng(seed)), id: g.id, level: g.level };
}

/** Interpreta una risposta numerica: accetta virgola o punto decimale e frazioni "a/b". */
export function parseNumber(raw: string): number | null {
  const s = raw.trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/−/g, '-');
  if (!s) return null;
  const fr = /^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/.exec(s);
  if (fr) {
    const d = Number(fr[2]);
    return d === 0 ? null : Number(fr[1]) / d;
  }
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)) return null;
  return Number(s);
}

/** Tolleranza: quella indicata dall'esercizio, altrimenti 0,5% (minimo 0,005). */
export function numericOk(ex: Exercise, value: number): boolean {
  if (ex.answer === undefined) return false;
  const tol = ex.tol ?? Math.max(0.005, Math.abs(ex.answer) * 0.005);
  return Math.abs(value - ex.answer) <= tol + 1e-12;
}

/** Testo leggibile della risposta corretta. */
export function correctText(ex: Exercise): string {
  if (ex.options) return ex.options.find((o) => o.ok)?.md ?? '';
  return `$${`${Math.round((ex.answer ?? 0) * 1000) / 1000}`.replace('.', '{,}')}$`;
}

export const TEST_QUESTIONS = 8;
export const TEST_MINUTES = 50;

/** Compone una verifica: domande di difficoltà crescente, senza ripetere un generatore finché possibile. */
export function buildTest(unit: Unit, seed: number): Exercise[] {
  const r = rng(seed);
  const pool = shuffle(r, unit.exercises);
  const picked: ExerciseGen[] = [];
  // Distribuzione indicativa: 3 facili, 3 medi, 2 difficili.
  const want: Record<number, number> = { 1: 3, 2: 3, 3: 2 };
  for (const lvl of [1, 2, 3]) picked.push(...pool.filter((g) => g.level === lvl).slice(0, want[lvl]));
  for (const g of pool) if (picked.length < TEST_QUESTIONS && !picked.includes(g)) picked.push(g);
  let i = 0;
  while (picked.length < TEST_QUESTIONS && pool.length) picked.push(pool[i++ % pool.length]);
  return picked
    .slice(0, TEST_QUESTIONS)
    .sort((a, b) => a.level - b.level)
    .map((g) => instantiate(g, Math.floor(r() * 2 ** 31)));
}

/** Voto in decimi (da 2 a 10, a mezzi voti), proporzionale al punteggio pesato per difficoltà. */
export function grade(points: number, maxPoints: number): number {
  if (maxPoints <= 0) return 2;
  return Math.round((2 + (8 * points) / maxPoints) * 2) / 2;
}
