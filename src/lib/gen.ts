// Strumenti per scrivere generatori di esercizi: numeri casuali riproducibili,
// formattazione LaTeX di frazioni e polinomi, costruzione di scelte multiple.
import type { Option, Rng } from './types';

/** Generatore pseudo-casuale deterministico (mulberry32). */
export function rng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const int = (r: Rng, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));

/** Intero in [lo, hi] diverso da zero (e dagli eventuali valori esclusi). */
export function nz(r: Rng, lo: number, hi: number, ...not: number[]): number {
  for (let i = 0; i < 200; i++) {
    const v = int(r, lo, hi);
    if (v !== 0 && !not.includes(v)) return v;
  }
  throw new Error('nz: intervallo senza valori ammessi');
}

export const pick = <T,>(r: Rng, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];

export function shuffle<T>(r: Rng, xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Frazione n/d ridotta, in LaTeX. */
export function frac(n: number, d: number): string {
  if (d === 0) throw new Error('frac: denominatore nullo');
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  n /= g;
  d /= g;
  if (d === 1) return `${n}`;
  return `${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n)}}{${d}}`;
}

/** Numero decimale all'italiana, senza zeri inutili. */
export function dec(x: number, digits = 2): string {
  const s = (Math.round(x * 10 ** digits) / 10 ** digits).toFixed(digits).replace(/\.?0+$/, '');
  return (s === '-0' ? '0' : s).replace('.', '{,}');
}

/** Coefficiente con segno davanti a un termine: sg(3,'x') = "+3x", sg(-1,'x') = "-x". */
export function sg(c: number, term = ''): string {
  if (c === 0) return '';
  const abs = Math.abs(c);
  const body = term && abs === 1 ? term : `${abs}${term}`;
  return `${c < 0 ? '-' : '+'}${body}`;
}

/** Polinomio in LaTeX dai coefficienti in ordine decrescente: poly([1,-3,2]) = "x^2-3x+2". */
export function poly(coefs: number[], v = 'x'): string {
  const n = coefs.length - 1;
  let s = '';
  coefs.forEach((c, i) => {
    const e = n - i;
    const term = e === 0 ? '' : e === 1 ? v : `${v}^${e}`;
    s += sg(c, term);
  });
  if (!s) return '0';
  return s.startsWith('+') ? s.slice(1) : s;
}

/** Numero tra parentesi se negativo, per sostituzioni: par(-3) = "(-3)". */
export const par = (x: number | string) => (`${x}`.startsWith('-') ? `(${x})` : `${x}`);

/** Radice quadrata semplificata in LaTeX: sqrtTex(12) = "2\\sqrt{3}". */
export function sqrtTex(n: number): string {
  if (n < 0) throw new Error('sqrtTex: radicando negativo');
  if (n === 0) return '0';
  let out = 1;
  let inside = n;
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    if (inside % (k * k) === 0) {
      out = k;
      inside = n / (k * k);
      break;
    }
  }
  if (inside === 1) return `${out}`;
  return `${out === 1 ? '' : out}\\sqrt{${inside}}`;
}

/**
 * Costruisce le opzioni di una scelta multipla: la risposta corretta più i
 * distrattori (errori tipici con spiegazione), senza duplicati, mescolati.
 * `fill` fornisce alternative di riserva se i distrattori coincidono tra loro.
 */
export function mc(
  r: Rng,
  correct: string,
  wrong: [md: string, why: string][],
  fill: string[] = [],
  why = 'Risposta corretta.',
): Option[] {
  const seen = new Set([correct]);
  const opts: Option[] = [{ md: correct, ok: true, why }];
  for (const [md, w] of wrong) {
    if (opts.length >= 4 || seen.has(md)) continue;
    seen.add(md);
    opts.push({ md, why: w });
  }
  for (const md of fill) {
    if (opts.length >= 4 || seen.has(md)) continue;
    seen.add(md);
    opts.push({ md, why: 'Ricontrolla i passaggi: questo risultato non si ottiene dal procedimento corretto.' });
  }
  if (opts.length < 3) throw new Error(`mc: troppe poche opzioni distinte per "${correct}"`);
  return shuffle(r, opts);
}

/** Scelta multipla a risposte fisse (non generate), mescolate. La prima è quella corretta. */
export function choice(r: Rng, items: [md: string, why?: string][]): Option[] {
  return shuffle(
    r,
    items.map(([md, why], i) => ({ md, ok: i === 0, why: why ?? (i === 0 ? 'Risposta corretta.' : undefined) })),
  );
}

/** Shorthand per scrivere LaTeX in linea. */
export const m = (s: string | number) => `$${s}$`;
