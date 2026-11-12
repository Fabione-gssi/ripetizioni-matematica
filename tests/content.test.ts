// Controlli automatici sui contenuti: ogni formula deve essere LaTeX valido,
// ogni esercizio generato deve essere ben formato (una sola risposta corretta,
// opzioni distinte, soluzione presente) per molti semi casuali diversi.
import { describe, expect, it } from 'vitest';
import { units } from '../src/content';
import { buildTest, grade, instantiate, numericOk, parseNumber, TEST_QUESTIONS } from '../src/lib/exercise';
import { frac, poly, sqrtTex } from '../src/lib/gen';
import { renderMd } from '../src/lib/md';
import type { Exercise, Option } from '../src/lib/types';

const strict = (src: string, where: string) => {
  try {
    renderMd(src, true);
  } catch (e) {
    throw new Error(`LaTeX non valido in ${where}: ${(e as Error).message}\n${src}`);
  }
  if (/undefined|NaN|Infinity|\[object/.test(src)) throw new Error(`Testo sospetto in ${where}: ${src}`);
};

const checkOptions = (opts: Option[], where: string) => {
  expect(opts.length, where).toBeGreaterThanOrEqual(3);
  expect(opts.filter((o) => o.ok).length, `${where}: una sola corretta`).toBe(1);
  expect(new Set(opts.map((o) => o.md)).size, `${where}: opzioni distinte`).toBe(opts.length);
  for (const o of opts) {
    strict(o.md, where);
    if (o.why) strict(o.why, where);
  }
};

function checkExercise(ex: Exercise, where: string) {
  strict(ex.text, where);
  expect(!!ex.options !== (ex.answer !== undefined), `${where}: scelta multipla oppure numerica`).toBe(true);
  if (ex.options) checkOptions(ex.options, where);
  else expect(Number.isFinite(ex.answer), `${where}: risposta finita`).toBe(true);
  expect(ex.hints.length, `${where}: suggerimenti`).toBeGreaterThan(0);
  expect(ex.solution.length, `${where}: soluzione`).toBeGreaterThan(0);
  ex.hints.forEach((h) => strict(h, where));
  ex.solution.forEach((s) => strict(s, where));
  ex.steps?.forEach((s, i) => {
    strict(s.ask, `${where} passo ${i}`);
    strict(s.explain, `${where} passo ${i}`);
    checkOptions(s.options, `${where} passo ${i}`);
  });
}

describe('struttura dei contenuti', () => {
  it('identificatori unici', () => {
    const ids = [...units.map((u) => u.id), ...units.flatMap((u) => u.lessons.map((l) => l.id))];
    expect(new Set(ids).size).toBe(ids.length);
    for (const u of units) {
      const g = u.exercises.map((e) => e.id);
      expect(new Set(g).size, u.id).toBe(g.length);
    }
  });
  it('ogni unità ha lezioni ed esercizi sufficienti per una verifica', () => {
    for (const u of units) {
      expect(u.lessons.length, u.id).toBeGreaterThanOrEqual(2);
      expect(u.exercises.length, u.id).toBeGreaterThanOrEqual(TEST_QUESTIONS);
      for (const lvl of [1, 2, 3]) expect(u.exercises.some((e) => e.level === lvl), `${u.id} livello ${lvl}`).toBe(true);
    }
  });
});

describe.each(units.map((u) => [u.id, u] as const))('unità %s', (_id, u) => {
  it('lezioni: LaTeX valido e blocchi ben formati', () => {
    for (const l of u.lessons) {
      expect(l.blocks.length, l.id).toBeGreaterThanOrEqual(4);
      l.blocks.forEach((b, i) => {
        const where = `${l.id} blocco ${i}`;
        if ('md' in b) strict(b.md, where);
        if (b.t === 'thm') b.proof?.forEach((s) => strict(s, where));
        if (b.t === 'ex') {
          strict(b.title, where);
          b.steps.forEach((s) => strict(s, where));
        }
        if (b.t === 'quiz') {
          strict(b.q, where);
          expect(b.options.filter((o) => o.ok).length, where).toBe(1);
          b.options.forEach((o) => {
            strict(o.md, where);
            if (o.why) strict(o.why, where);
          });
        }
        if (b.t === 'plot') {
          const combos = [Object.fromEntries((b.params ?? []).map((p) => [p.name, p.value])), Object.fromEntries((b.params ?? []).map((p) => [p.name, p.min])), Object.fromEntries((b.params ?? []).map((p) => [p.name, p.max]))];
          for (const p of combos) {
            expect(b.draw(p).length, where).toBeGreaterThan(0);
            if (b.readout) strict(b.readout(p), where);
          }
          if (b.caption) strict(b.caption, where);
        }
      });
    }
  });
  it('esercizi: ben formati per 150 semi', () => {
    for (const g of u.exercises) for (let seed = 1; seed <= 150; seed++) checkExercise(instantiate(g, seed * 7919), `${u.id}/${g.id} seme ${seed * 7919}`);
  });
  it('verifica componibile', () => {
    for (let s = 1; s <= 20; s++) expect(buildTest(u, s).length).toBe(TEST_QUESTIONS);
  });
});

describe('strumenti', () => {
  it('parseNumber', () => {
    expect(parseNumber('3/4')).toBe(0.75);
    expect(parseNumber('-1,5')).toBe(-1.5);
    expect(parseNumber(' 2 ')).toBe(2);
    expect(parseNumber('1/0')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('')).toBeNull();
  });
  it('numericOk rispetta la tolleranza', () => {
    const ex = { id: 'x', level: 1, text: '', answer: 2, tol: 0, hints: [], solution: [] } as Exercise;
    expect(numericOk(ex, 2)).toBe(true);
    expect(numericOk(ex, 2.01)).toBe(false);
    expect(numericOk({ ...ex, tol: undefined, answer: 0.333 }, 1 / 3)).toBe(true);
  });
  it('formattazione', () => {
    expect(frac(6, -4)).toBe('-\\dfrac{3}{2}');
    expect(frac(4, 2)).toBe('2');
    expect(poly([1, -3, 2])).toBe('x^2-3x+2');
    expect(poly([-1, 0, 1])).toBe('-x^2+1');
    expect(sqrtTex(12)).toBe('2\\sqrt{3}');
    expect(sqrtTex(16)).toBe('4');
    expect(sqrtTex(7)).toBe('\\sqrt{7}');
  });
  it('voto', () => {
    expect(grade(0, 10)).toBe(2);
    expect(grade(10, 10)).toBe(10);
    expect(grade(5, 10)).toBe(6);
  });
});
