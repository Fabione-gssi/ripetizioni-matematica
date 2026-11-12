import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Empty, ErrorText, Header, Loadable, fmtDate, useAction } from '../../components/ui';
import { api, useLoad, useMe } from '../../lib/app';

export function Dashboard() {
  const me = useMe();
  const links = useLoad(() => api.teacherLinks(), [me.id]);
  const unread = useLoad(() => api.unreadCounts(), [me.id]);
  const act = useAction();
  const reloadUnread = unread.reload;

  useEffect(() => api.onNewMessage(() => void reloadUnread(true)), [reloadUnread]);

  const decide = (id: string, accept: boolean) =>
    act.run(async () => {
      await api.decideLink(id, accept);
      await links.reload(true);
    });

  return (
    <>
      <Header
        title="I miei studenti"
        right={
          <button className="icon-btn" aria-label="Aggiorna" onClick={() => void Promise.all([links.reload(), unread.reload(true)])}>
            ↻
          </button>
        }
      />
      {!me.accepting && <p className="feedback warn">Non stai accettando nuove richieste (puoi cambiarlo dal Profilo).</p>}
      <ErrorText>{act.error}</ErrorText>
      <Loadable state={links}>
        {(list) => {
          const pending = list.filter((l) => l.status === 'pending');
          const accepted = list.filter((l) => l.status === 'accepted');
          return (
            <>
              {pending.length > 0 && (
                <>
                  <h2>Richieste in attesa</h2>
                  <div className="list">
                    {pending.map((l) => (
                      <div className="card" key={l.id}>
                        <b>{l.other?.full_name ?? 'Studente'}</b>
                        <p className="muted small">
                          {l.other?.school_year ? `${l.other.school_year}° anno · ` : ''}richiesta del {fmtDate(l.created_at)}
                        </p>
                        <div className="row">
                          <button className="btn" disabled={act.busy} onClick={() => void decide(l.id, true)}>
                            Accetta
                          </button>
                          <button className="btn ghost" disabled={act.busy} onClick={() => void decide(l.id, false)}>
                            Rifiuta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <h2>Studenti seguiti ({accepted.length})</h2>
              {accepted.length === 0 ? (
                <Empty>Nessuno studente ancora. Gli studenti ti trovano nell'elenco dei professori dalla sezione «Il mio prof» e ti inviano una richiesta.</Empty>
              ) : (
                <div className="list">
                  {accepted.map((l) => (
                    <RouterLink key={l.id} to={`/s/${l.student_id}`} className="card row-card">
                      <span className="check-dot">{(l.other?.full_name ?? '?').charAt(0).toUpperCase()}</span>
                      <span className="grow">
                        <b>{l.other?.full_name ?? 'Studente'}</b>
                        <br />
                        <span className="muted small">{l.other?.school_year ? `${l.other.school_year}° anno` : ''}</span>
                      </span>
                      {!!unread.data?.[l.student_id] && <span className="badge">{unread.data[l.student_id]}</span>}
                    </RouterLink>
                  ))}
                </div>
              )}
            </>
          );
        }}
      </Loadable>
    </>
  );
}
