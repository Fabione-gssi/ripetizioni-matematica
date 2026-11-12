// Registro dei contenuti. Per aggiungere un'unità: crea il file, importalo e
// inseriscilo nell'elenco nell'ordine in cui deve comparire.
import type { Lesson, Unit, UnitExtra } from '../lib/types';
import { combinatoria } from './anno4/combinatoria';
import { complessi } from './anno4/complessi';
import { eqgonio } from './anno4/eqgonio';
import { formule } from './anno4/formule';
import { goniometria } from './anno4/goniometria';
import { probabilita } from './anno4/probabilita';
import { spazio } from './anno4/spazio';
import { trigonometria } from './anno4/trigonometria';
import { circonferenza } from './anno3/circonferenza';
import { ellisse } from './anno3/ellisse';
import { equazioni } from './anno3/equazioni';
import { equazioniPiu } from './anno3/equazioni.piu';
import { esponenziali } from './anno3/esponenziali';
import { funzioni } from './anno3/funzioni';
import { funzioniPiu } from './anno3/funzioni.piu';
import { iperbole } from './anno3/iperbole';
import { logaritmi } from './anno3/logaritmi';
import { parabola } from './anno3/parabola';
import { retta } from './anno3/retta';
import { rettaPiu } from './anno3/retta.piu';
import { parabolaPiu } from './anno3/parabola.piu';
import { circonferenzaPiu } from './anno3/circonferenza.piu';
import { ellissePiu } from './anno3/ellisse.piu';
import { iperbolePiu } from './anno3/iperbole.piu';
import { esponenzialiPiu } from './anno3/esponenziali.piu';
import { logaritmiPiu } from './anno3/logaritmi.piu';
import { statisticaPiu } from './anno3/statistica.piu';
import { polinomi } from './anno3/polinomi';
import { trasformazioni } from './anno3/trasformazioni';
import { statistica } from './anno3/statistica';
import { successioni } from './anno3/successioni';
import { successioniPiu } from './anno3/successioni.piu';

/** Unisce a un'unità le lezioni e gli esercizi di approfondimento scritti in un file a parte. */
const con = (u: Unit, e: UnitExtra): Unit => ({ ...u, summary: e.summary ?? u.summary, lessons: [...u.lessons, ...e.lessons], exercises: [...u.exercises, ...e.exercises] });

export const units: Unit[] = [polinomi, con(equazioni, equazioniPiu), con(funzioni, funzioniPiu), con(successioni, successioniPiu), con(retta, rettaPiu), con(parabola, parabolaPiu), con(circonferenza, circonferenzaPiu), con(ellisse, ellissePiu), con(iperbole, iperbolePiu), trasformazioni, con(esponenziali, esponenzialiPiu), con(logaritmi, logaritmiPiu), con(statistica, statisticaPiu), goniometria, formule, eqgonio, trigonometria, complessi, spazio, combinatoria, probabilita];

const byId = new Map(units.map((u) => [u.id, u]));
export const unitById = (id: string): Unit | undefined => byId.get(id);

export function lessonById(id: string): { unit: Unit; lesson: Lesson } | undefined {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return { unit, lesson };
  }
  return undefined;
}
