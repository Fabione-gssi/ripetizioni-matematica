// Registro dei contenuti. Per aggiungere un'unità: crea il file, importalo e
// inseriscilo nell'elenco nell'ordine in cui deve comparire.
import type { Lesson, Unit } from '../lib/types';
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
import { esponenziali } from './anno3/esponenziali';
import { funzioni } from './anno3/funzioni';
import { iperbole } from './anno3/iperbole';
import { logaritmi } from './anno3/logaritmi';
import { parabola } from './anno3/parabola';
import { retta } from './anno3/retta';
import { statistica } from './anno3/statistica';
import { successioni } from './anno3/successioni';

export const units: Unit[] = [equazioni, funzioni, successioni, retta, parabola, circonferenza, ellisse, iperbole, esponenziali, logaritmi, statistica, goniometria, formule, eqgonio, trigonometria, complessi, spazio, combinatoria, probabilita];

const byId = new Map(units.map((u) => [u.id, u]));
export const unitById = (id: string): Unit | undefined => byId.get(id);

export function lessonById(id: string): { unit: Unit; lesson: Lesson } | undefined {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return { unit, lesson };
  }
  return undefined;
}
