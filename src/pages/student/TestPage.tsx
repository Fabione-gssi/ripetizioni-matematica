import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AnswerInput, evaluate } from '../../components/ExerciseCard';
import { Header, Md } from '../../components/ui';
import { unitById } from '../../content';
import { api } from '../../lib/app';
import { buildTest, correctText, grade, newSeed, TEST_MINUTES, TEST_QUESTIONS } from '../../lib/exercise';
import type { Exercise } from '../../lib/types';

const WEIGHT: Record<number, number> = { 1: 1, 2: 1.5, 3: 2 };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

interface Report {
  grade: number;
  score: number;
  rows: { ex: Exercise; given: string; correct: boolean; why?: string }[];
  saved: boolean;
}

export function TestPage() {
  const { unitId = '' } = useParams();
  const unit = unitById(unitId);
  const [exs, setExs] = useState<Exercise[] | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [left, setLeft] = useState(TEST_MINUTES * 60);
  const [report, setReport] = useState<Report | null>(null);
  const [confirm, setConfirm] = useState(false);
  const startedAt = useRef(0);
  const submitted = useRef(false);

  const finish = async () => {
    if (!exs || !unit || submitted.current) return;
    submitted.current = true;
    const rows = exs.map((ex, i) => {
      const r = evaluate(ex, answers[i] ?? '');
      return { ex, given: r.valid ? r.given : '(nessuna risposta)', correct: r.valid && r.correct, why: r.valid ? r.why : undefined };
    });
    const max = exs.reduce((s, e) => s + WEIGHT[e.level], 0);
    const pts = rows.reduce((s, r) => s + (r.correct ? WEIGHT[r.ex.level] : 0), 0);
    const score = rows.filter((r) => r.correct).length;
    const g = grade(pts, max);
    const duration = Math.round((Date.now() - startedAt.current) / 1000);
    let saved = true;
    try {
      await api.addTestResult({
        unit_id: unit.id,
        score,
        total: exs.length,
        grade: g,
        duration_s: duration,
        details: rows.map((r) => ({ question: r.ex.text.slice(0, 1500), given: r.given.slice(0, 300), correct: r.correct })),
      });
    } catch {
      saved = false;
    }
    setReport({ grade: g, score, rows, saved });
    window.scrollTo(0, 0);
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (!exs || report) return;
    const t = window.setInterval(() => {
      const remaining = TEST_MINUTES * 60 - Math.round((Date.now() - startedAt.current) / 1000);
      setLeft(Math.max(0, remaining));
      if (remaining <= 0) void finishRef.current();
    }, 1000);
    return () => window.clearInterval(t);
  }, [exs, report]);

  if (!unit) return <Navigate to="/" replace />;

  const start = () => {
    const test = buildTest(unit, newSeed());
    submitted.current = false;
    startedAt.current = Date.now();
    setAnswers(test.map(() => ''));
    setLeft(TEST_MINUTES * 60);
    setReport(null);
    setConfirm(false);
    setExs(test);
  };

  if (!exs) {
    return (
      <>
        <Header title="Simulazione di verifica" back={`/u/${unit.id}`} />
        <div className="card">
          <h3>{unit.title}</h3>
          <ul>
            <li>{TEST_QUESTIONS} quesiti di difficoltà crescente</li>
            <li>{TEST_MINUTES} minuti di tempo</li>
            <li>Nessun suggerimento: correzione e voto solo alla consegna</li>
            <li>Tieni carta e penna: svolgi i calcoli come in classe</li>
          </ul>
          <p className="muted small">I quesiti cambiano a ogni simulazione. Il risultato sarà visibile anche al tuo professore.</p>
          <button className="btn block-btn" onClick={start}>
            Inizia la verifica
          </button>
        </div>
      </>
    );
  }

  if (report) {
    return (
      <>
        <Header title="Esito della verifica" back={`/u/${unit.id}`} />
        <div className="card center">
          <div className={`grade ${report.grade >= 6 ? 'pass' : 'fail'}`}>{String(report.grade).replace('.', ',')}</div>
          <p>
            {report.score} risposte corrette su {report.rows.length}
          </p>
          {!report.saved && <p className="error">Risultato non salvato (connessione assente).</p>}
          <div className="row">
            <button className="btn" onClick={start}>
              Nuova simulazione
            </button>
            <Link className="btn ghost" to="/prof">
              Invia lo svolgimento al prof
            </Link>
          </div>
        </div>
        {report.rows.map((r, i) => (
          <div className="card exercise" key={i}>
            <div className="ex-head">
              <span className="block-tag">Quesito {i + 1}</span>
              <span className={`pill ${r.correct ? 'ok' : 'ko'}`}>{r.correct ? 'Corretto' : 'Errato'}</span>
            </div>
            <Md src={r.ex.text} className="question" />
            <div className={`feedback ${r.correct ? 'ok' : 'ko'}`}>
              <Md src={`La tua risposta: ${r.given}`} />
              {r.why && !r.correct && <Md src={r.why} />}
              {!r.correct && <Md src={`Risposta corretta: ${correctText(r.ex)}`} />}
            </div>
            <details>
              <summary>Soluzione passo per passo</summary>
              {r.ex.solution.map((s, k) => (
                <div className="step" key={k}>
                  <span className="step-n">{k + 1}</span>
                  <Md src={s} />
                </div>
              ))}
            </details>
          </div>
        ))}
      </>
    );
  }

  const missing = answers.filter((a) => a.trim() === '').length;
  return (
    <>
      <Header title="Verifica" right={<span className={`pill ${left < 300 ? 'ko' : ''}`}>⏱ {clock(left)}</span>} />
      {exs.map((ex, i) => (
        <div className="card exercise" key={i}>
          <div className="ex-head">
            <span className="block-tag">Quesito {i + 1}</span>
          </div>
          <Md src={ex.text} className="question" />
          <AnswerInput ex={ex} value={answers[i]} onChange={(v) => setAnswers((a) => a.map((x, k) => (k === i ? v : x)))} />
        </div>
      ))}
      {confirm ? (
        <div className="card">
          <p>{missing ? `Hai ancora ${missing} ${missing === 1 ? 'quesito' : 'quesiti'} senza risposta. ` : ''}Vuoi consegnare?</p>
          <div className="row">
            <button className="btn" onClick={() => void finish()}>
              Sì, consegna
            </button>
            <button className="btn ghost" onClick={() => setConfirm(false)}>
              Continua
            </button>
          </div>
        </div>
      ) : (
        <button className="btn block-btn" onClick={() => setConfirm(true)}>
          Consegna
        </button>
      )}
    </>
  );
}
