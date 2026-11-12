import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '../../components/ui';
import { unitById } from '../../content';
import { api, useLoad, useMe } from '../../lib/app';

export function UnitPage() {
  const { unitId = '' } = useParams();
  const me = useMe();
  const unit = unitById(unitId);
  const progress = useLoad(() => api.listProgress(me.id), [me.id]);
  if (!unit) return <Navigate to="/" replace />;
  const done = new Set((progress.data ?? []).map((r) => r.lesson_id));

  return (
    <>
      <Header title={unit.title} back="/" />
      <p className="muted">{unit.summary}</p>
      <h2>Lezioni</h2>
      <div className="list">
        {unit.lessons.map((l, i) => (
          <Link key={l.id} to={`/u/${unit.id}/l/${l.id}`} className="card row-card">
            <span className={`check-dot ${done.has(l.id) ? 'on' : ''}`} aria-label={done.has(l.id) ? 'Completata' : 'Da fare'}>
              {done.has(l.id) ? '✓' : i + 1}
            </span>
            <span>{l.title}</span>
          </Link>
        ))}
      </div>
      <h2>Allenati</h2>
      <div className="list">
        <Link to={`/u/${unit.id}/esercizi`} className="card row-card">
          <span className="check-dot">✎</span>
          <span>
            <b>Esercizi</b>
            <br />
            <span className="muted small">Guidati, con suggerimenti o in autonomia</span>
          </span>
        </Link>
        <Link to={`/u/${unit.id}/verifica`} className="card row-card">
          <span className="check-dot">⏱</span>
          <span>
            <b>Simulazione di verifica</b>
            <br />
            <span className="muted small">Come un compito in classe, con voto finale</span>
          </span>
        </Link>
      </div>
    </>
  );
}
