import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Chat } from '../../components/Chat';
import { Submissions } from '../../components/Submissions';
import { TeacherChat } from '../../components/TeacherChat';
import { Empty, ErrorText, Header, Loadable, Md, Progress, Tabs, fmtDate, useAction } from '../../components/ui';
import { unitById, units } from '../../content';
import { api, useLoad, useMe } from '../../lib/app';
import type { Attempt, Mode, TestResult } from '../../lib/types';

type Tab = 'panoramica' | 'esercizi' | 'verifiche' | 'ai' | 'foto' | 'messaggi';
const MODE_LABEL: Record<Mode, string> = { guided: 'guidato', hints: 'con suggerimenti', solo: 'autonomo', test: 'verifica' };
const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : '—');

function Overview({ studentId }: { studentId: string }) {
  const data = useLoad(async () => {
    const [progress, attempts, tests] = await Promise.all([api.listProgress(studentId), api.listAttempts(studentId), api.listTestResults(studentId)]);
    return { progress, attempts, tests };
  }, [studentId]);
  return (
    <Loadable state={data}>
      {({ progress, attempts, tests }) => {
        const done = new Set(progress.map((p) => p.lesson_id));
        const practice = attempts.filter((a) => a.mode !== 'test');
        const active = units.filter((u) => u.lessons.some((l) => done.has(l.id)) || practice.some((a) => a.unit_id === u.id) || tests.some((t) => t.unit_id === u.id));
        const avg = tests.length ? tests.reduce((s, t) => s + Number(t.grade), 0) / tests.length : null;
        const last = [...progress.map((p) => p.completed_at), ...attempts.map((a) => a.created_at ?? ''), ...tests.map((t) => t.created_at ?? '')].sort().pop();
        return (
          <>
            <div className="stats">
              <div>
                <b>{done.size}</b>
                <span>lezioni completate</span>
              </div>
              <div>
                <b>{pct(practice.filter((a) => a.correct).length, practice.length)}</b>
                <span>esercizi corretti ({practice.length})</span>
              </div>
              <div>
                <b>{avg === null ? '—' : avg.toFixed(1).replace('.', ',')}</b>
                <span>media verifiche ({tests.length})</span>
              </div>
            </div>
            <p className="muted small">Ultima attività: {last ? fmtDate(last) : 'nessuna'}</p>
            {active.length === 0 ? (
              <Empty>Lo studente non ha ancora iniziato.</Empty>
            ) : (
              <div className="list">
                {active.map((u) => {
                  const n = u.lessons.filter((l) => done.has(l.id)).length;
                  const att = practice.filter((a) => a.unit_id === u.id);
                  const ut = tests.filter((t) => t.unit_id === u.id);
                  // Tipi di esercizio con più errori: indicano dove intervenire.
                  const weak = Object.entries(
                    att.reduce<Record<string, { n: number; ko: number }>>((acc, a) => {
                      const k = (acc[a.exercise_id] ??= { n: 0, ko: 0 });
                      k.n++;
                      if (!a.correct) k.ko++;
                      return acc;
                    }, {}),
                  )
                    .filter(([, v]) => v.ko >= 2 && v.ko / v.n >= 0.5)
                    .map(([id]) => u.exercises.find((g) => g.id === id)?.title ?? id);
                  return (
                    <div className="card" key={u.id}>
                      <b>
                        {u.year}° · {u.title}
                      </b>
                      <Progress value={n} max={u.lessons.length} />
                      <p className="small muted">
                        Lezioni {n}/{u.lessons.length} · Esercizi corretti {pct(att.filter((a) => a.correct).length, att.length)} ({att.length})
                        {ut.length > 0 && ` · Verifiche: ${ut.map((t) => String(t.grade).replace('.', ',')).join(', ')}`}
                      </p>
                      {weak.length > 0 && <p className="small warn-text">Difficoltà ricorrenti: {weak.join('; ')}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      }}
    </Loadable>
  );
}

function Attempts({ studentId }: { studentId: string }) {
  const data = useLoad(() => api.listAttempts(studentId), [studentId]);
  const [onlyWrong, setOnlyWrong] = useState(false);
  return (
    <Loadable state={data}>
      {(all) => {
        const list = [...all].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')).filter((a: Attempt) => !onlyWrong || !a.correct);
        return (
          <>
            <label className="check">
              <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} />
              <span>Mostra solo gli errori</span>
            </label>
            {list.length === 0 ? (
              <Empty>Nessun esercizio da mostrare.</Empty>
            ) : (
              <div className="list">
                {list.slice(0, 100).map((a, i) => (
                  <details className="card" key={a.id ?? i}>
                    <summary>
                      <span className={`pill ${a.correct ? 'ok' : 'ko'}`}>{a.correct ? '✓' : '✗'}</span> {unitById(a.unit_id)?.title ?? a.unit_id}
                      <span className="muted small">
                        {' '}
                        · {MODE_LABEL[a.mode]} · {fmtDate(a.created_at)}
                        {a.hints_used > 0 && ` · ${a.hints_used} sugg.`}
                      </span>
                    </summary>
                    <Md src={a.question} />
                    <Md src={`**Risposta data:** ${a.given}`} />
                  </details>
                ))}
              </div>
            )}
          </>
        );
      }}
    </Loadable>
  );
}

function Tests({ studentId }: { studentId: string }) {
  const data = useLoad(() => api.listTestResults(studentId), [studentId]);
  return (
    <Loadable state={data}>
      {(all) => {
        const list = [...all].sort((a: TestResult, b: TestResult) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
        return list.length === 0 ? (
          <Empty>Nessuna simulazione di verifica svolta.</Empty>
        ) : (
          <div className="list">
            {list.map((t, i) => (
              <details className="card" key={t.id ?? i}>
                <summary>
                  <span className={`pill ${Number(t.grade) >= 6 ? 'ok' : 'ko'}`}>{String(t.grade).replace('.', ',')}</span> {unitById(t.unit_id)?.title ?? t.unit_id}
                  <span className="muted small">
                    {' '}
                    · {t.score}/{t.total} · {Math.round(t.duration_s / 60)} min · {fmtDate(t.created_at)}
                  </span>
                </summary>
                {t.details.map((d, k) => (
                  <div className={`feedback ${d.correct ? 'ok' : 'ko'}`} key={k}>
                    <Md src={d.question} />
                    <Md src={`**Risposta data:** ${d.given}`} />
                  </div>
                ))}
              </details>
            ))}
          </div>
        );
      }}
    </Loadable>
  );
}

function AiLog({ studentId }: { studentId: string }) {
  const data = useLoad(() => api.listAiMessages(studentId), [studentId]);
  return (
    <Loadable state={data}>
      {(list) => (
        <Chat
          bubbles={list.map((m) => ({ id: m.id, mine: m.role === 'user', body: m.body, at: m.created_at, author: m.role === 'user' ? 'Studente' : 'Tutor AI' }))}
          empty="Lo studente non ha ancora usato il tutor AI."
        />
      )}
    </Loadable>
  );
}

export function StudentDetail() {
  const { studentId = '' } = useParams();
  const me = useMe();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('panoramica');
  const [confirm, setConfirm] = useState(false);
  const links = useLoad(() => api.teacherLinks(), [me.id]);
  const unread = useLoad(() => api.unreadCounts(), [me.id, tab]);
  const act = useAction();

  return (
    <Loadable state={links}>
      {(list) => {
        const link = list.find((l) => l.student_id === studentId && l.status === 'accepted');
        if (!link) return <Navigate to="/" replace />;
        return (
          <>
            <Header title={link.other?.full_name ?? 'Studente'} back="/" />
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: 'panoramica', label: 'Panoramica' },
                { id: 'esercizi', label: 'Esercizi' },
                { id: 'verifiche', label: 'Verifiche' },
                { id: 'foto', label: 'Foto' },
                { id: 'messaggi', label: 'Messaggi', badge: tab === 'messaggi' ? 0 : unread.data?.[studentId] },
                { id: 'ai', label: 'Chat AI' },
              ]}
            />
            {tab === 'panoramica' && <Overview studentId={studentId} />}
            {tab === 'esercizi' && <Attempts studentId={studentId} />}
            {tab === 'verifiche' && <Tests studentId={studentId} />}
            {tab === 'foto' && <Submissions studentId={studentId} canReview />}
            {tab === 'messaggi' && <TeacherChat studentId={studentId} teacherId={me.id} />}
            {tab === 'ai' && <AiLog studentId={studentId} />}
            {tab === 'panoramica' && (
              <>
                <ErrorText>{act.error}</ErrorText>
                {confirm ? (
                  <div className="feedback ko">
                    <p>Non vedrai più i dati di questo studente. Confermi?</p>
                    <div className="row">
                      <button
                        className="btn danger"
                        disabled={act.busy}
                        onClick={() =>
                          void act.run(async () => {
                            await api.removeLink(link.id);
                            nav('/');
                          })
                        }
                      >
                        Sì, rimuovi
                      </button>
                      <button className="btn ghost" onClick={() => setConfirm(false)}>
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="btn link danger" onClick={() => setConfirm(true)}>
                    Rimuovi studente
                  </button>
                )}
              </>
            )}
          </>
        );
      }}
    </Loadable>
  );
}
