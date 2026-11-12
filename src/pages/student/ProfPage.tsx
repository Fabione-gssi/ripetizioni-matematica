import { useState } from 'react';
import { Submissions } from '../../components/Submissions';
import { TeacherChat } from '../../components/TeacherChat';
import { Empty, ErrorText, Header, Loadable, Tabs, useAction } from '../../components/ui';
import { api, useLoad, useMe } from '../../lib/app';
import type { Link } from '../../lib/types';

function ChooseTeacher({ rejected, onChanged }: { rejected?: Link; onChanged: () => void }) {
  const teachers = useLoad(() => api.listTeachers(), []);
  const act = useAction();
  return (
    <>
      {rejected && <p className="feedback warn">La tua richiesta a {rejected.other?.full_name ?? 'un professore'} non è stata accettata. Puoi sceglierne un altro.</p>}
      <p className="muted">Scegli il professore che ti seguirà. Dopo la sua accettazione potrà vedere i tuoi progressi, correggere i tuoi esercizi e scriverti.</p>
      <ErrorText>{act.error}</ErrorText>
      <Loadable state={teachers}>
        {(list) =>
          list.length === 0 ? (
            <Empty>Al momento non ci sono professori disponibili.</Empty>
          ) : (
            <div className="list">
              {list.map((t) => (
                <div className="card row-card" key={t.id}>
                  <span className="check-dot">🎓</span>
                  <span className="grow">{t.full_name}</span>
                  <button
                    className="btn"
                    disabled={act.busy}
                    onClick={() =>
                      void act.run(async () => {
                        await api.requestLink(t.id);
                        onChanged();
                      })
                    }
                  >
                    Richiedi
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </Loadable>
    </>
  );
}

export function ProfPage() {
  const me = useMe();
  const link = useLoad(() => api.myLink(), [me.id]);
  const [tab, setTab] = useState<'chat' | 'foto'>('chat');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const act = useAction();

  const remove = (id: string) =>
    act.run(async () => {
      await api.removeLink(id);
      setConfirmLeave(false);
      await link.reload(true);
    });

  return (
    <>
      <Header title="Il mio professore" />
      <Loadable state={link}>
        {(l) => {
          if (!l || l.status === 'rejected') return <ChooseTeacher rejected={l ?? undefined} onChanged={() => void link.reload(true)} />;
          if (l.status === 'pending')
            return (
              <div className="card center">
                <p>
                  Richiesta inviata a <b>{l.other?.full_name ?? 'professore'}</b>.<br />
                  In attesa di accettazione.
                </p>
                <ErrorText>{act.error}</ErrorText>
                <div className="row">
                  <button className="btn ghost" onClick={() => void link.reload()}>
                    Aggiorna
                  </button>
                  <button className="btn link danger" disabled={act.busy} onClick={() => void remove(l.id)}>
                    Annulla richiesta
                  </button>
                </div>
              </div>
            );
          return (
            <>
              <p>
                Sei seguito da <b>{l.other?.full_name ?? 'professore'}</b>
              </p>
              <Tabs
                value={tab}
                onChange={setTab}
                tabs={[
                  { id: 'chat', label: 'Messaggi' },
                  { id: 'foto', label: 'Esercizi fotografati' },
                ]}
              />
              {tab === 'chat' ? <TeacherChat studentId={me.id} teacherId={l.teacher_id} /> : <Submissions studentId={me.id} canUpload />}
              <ErrorText>{act.error}</ErrorText>
              {confirmLeave ? (
                <div className="feedback ko">
                  <p>Il professore non potrà più vedere i tuoi dati né scriverti. Confermi?</p>
                  <div className="row">
                    <button className="btn danger" disabled={act.busy} onClick={() => void remove(l.id)}>
                      Sì, interrompi
                    </button>
                    <button className="btn ghost" onClick={() => setConfirmLeave(false)}>
                      Annulla
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn link danger" onClick={() => setConfirmLeave(true)}>
                  Interrompi l'associazione
                </button>
              )}
            </>
          );
        }}
      </Loadable>
    </>
  );
}
