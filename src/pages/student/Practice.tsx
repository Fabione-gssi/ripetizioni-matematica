import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ExerciseCard, type Outcome } from '../../components/ExerciseCard';
import { Header } from '../../components/ui';
import { unitById } from '../../content';
import { api } from '../../lib/app';
import { instantiate, newSeed } from '../../lib/exercise';
import { rng, shuffle } from '../../lib/gen';
import type { ExerciseGen, Mode } from '../../lib/types';

type PMode = Exclude<Mode, 'test'>;

const MODES: { id: PMode; title: string; desc: string }[] = [
  { id: 'guided', title: 'Guidato', desc: 'Ti accompagno passo per passo: ogni passaggio è una piccola domanda.' },
  { id: 'hints', title: 'Con suggerimenti', desc: 'Provi da solo; se ti blocchi chiedi un suggerimento e hai un secondo tentativo.' },
  { id: 'solo', title: 'In autonomia', desc: 'Un solo tentativo, come in verifica. Poi correzione e spiegazione dell\'errore.' },
];
const LEVELS = ['Tutti', 'Base', 'Intermedio', 'Avanzato'];

export function Practice() {
  const { unitId = '' } = useParams();
  const unit = unitById(unitId);
  const [mode, setMode] = useState<PMode | null>(null);
  const [level, setLevel] = useState(0);
  const [queue, setQueue] = useState<ExerciseGen[]>([]);
  const [n, setN] = useState(0);
  const [seed, setSeed] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [stats, setStats] = useState({ done: 0, ok: 0 });

  const gen = queue.length ? queue[n % queue.length] : undefined;
  const ex = useMemo(() => (gen ? instantiate(gen, seed) : undefined), [gen, seed]);
  if (!unit) return <Navigate to="/" replace />;

  const start = (m: PMode) => {
    let pool = unit.exercises.filter((g) => level === 0 || g.level === level);
    if (m === 'guided') {
      // In modalità guidata si preferiscono gli esercizi scomposti in passi.
      const withSteps = pool.filter((g) => instantiate(g, 1).steps?.length);
      if (withSteps.length >= 2) pool = withSteps;
    }
    if (!pool.length) pool = unit.exercises;
    setQueue(shuffle(rng(newSeed()), pool).sort((a, b) => (level === 0 ? a.level - b.level : 0)));
    setN(0);
    setSeed(newSeed());
    setAnswered(false);
    setStats({ done: 0, ok: 0 });
    setMode(m);
  };

  const onDone = (o: Outcome) => {
    if (!ex || !mode) return;
    setAnswered(true);
    setStats((s) => ({ done: s.done + 1, ok: s.ok + (o.correct ? 1 : 0) }));
    void api
      .addAttempt({ unit_id: unit.id, exercise_id: ex.id, mode, level: ex.level, correct: o.correct, hints_used: o.hintsUsed, question: ex.text, given: o.given })
      .catch(() => {});
  };

  const nextEx = () => {
    setN(n + 1);
    setSeed(newSeed());
    setAnswered(false);
    window.scrollTo(0, 0);
  };

  if (!mode || !ex || !gen) {
    return (
      <>
        <Header title="Esercizi" back={`/u/${unit.id}`} />
        <p className="muted">{unit.title}</p>
        <h2>Difficoltà</h2>
        <div className="seg">
          {LEVELS.map((l, i) => (
            <button key={l} className={level === i ? 'active' : ''} onClick={() => setLevel(i)}>
              {l}
            </button>
          ))}
        </div>
        <h2>Quanto aiuto vuoi?</h2>
        <div className="list">
          {MODES.map((m) => (
            <button key={m.id} className="card row-card" onClick={() => start(m.id)}>
              <span>
                <b>{m.title}</b>
                <br />
                <span className="muted small">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={MODES.find((m) => m.id === mode)!.title}
        back={`/u/${unit.id}`}
        right={
          <span className="pill">
            {stats.ok}/{stats.done} corretti
          </span>
        }
      />
      <div className="card exercise" key={`${n}-${seed}`}>
        <div className="ex-head">
          <span className="block-tag">{gen.title}</span>
          <span className={`lvl lvl-${ex.level}`}>{LEVELS[ex.level]}</span>
        </div>
        <ExerciseCard ex={ex} mode={mode} onDone={onDone} />
      </div>
      <div className="row">
        <button className={`btn ${answered ? '' : 'ghost'}`} onClick={nextEx}>
          {answered ? 'Prossimo esercizio' : 'Salta'}
        </button>
        <button className="btn ghost" onClick={() => setMode(null)}>
          Cambia modalità
        </button>
      </div>
    </>
  );
}
