import { useState } from 'react';
import { ErrorText, Header, useAction } from '../components/ui';
import { api, useAuth, useMe } from '../lib/app';

export function ProfilePage() {
  const me = useMe();
  const { refresh } = useAuth();
  const [name, setName] = useState(me.full_name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const act = useAction();

  const save = (patch: Parameters<typeof api.updateProfile>[0]) =>
    act.run(async () => {
      await api.updateProfile(patch);
      await refresh();
    });

  return (
    <>
      <Header title="Profilo" />
      <section className="card">
        <label>
          Nome e cognome
          <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
        </label>
        {name.trim() !== me.full_name && name.trim().length >= 2 && (
          <button className="btn" disabled={act.busy} onClick={() => void save({ full_name: name.trim() })}>
            Salva nome
          </button>
        )}
        <p className="muted">Ruolo: {me.role === 'student' ? 'studente' : 'professore'}</p>
        {me.role === 'student' ? (
          <label>
            Anno di corso
            <select value={me.school_year ?? 3} disabled={act.busy} onChange={(e) => void save({ school_year: Number(e.target.value) })}>
              <option value={3}>3° liceo scientifico</option>
              <option value={4}>4° liceo scientifico</option>
            </select>
          </label>
        ) : (
          <label className="check">
            <input type="checkbox" checked={me.accepting} disabled={act.busy} onChange={(e) => void save({ accepting: e.target.checked })} />
            <span>Accetto nuove richieste (il mio nome compare nell'elenco dei professori disponibili)</span>
          </label>
        )}
        <ErrorText>{act.error}</ErrorText>
      </section>
      <section className="card">
        <button className="btn ghost block-btn" disabled={act.busy} onClick={() => void act.run(() => api.signOut())}>
          Esci
        </button>
        {!confirmDelete ? (
          <button className="btn link danger" onClick={() => setConfirmDelete(true)}>
            Elimina il mio account
          </button>
        ) : (
          <div className="feedback ko">
            <p>Verranno eliminati definitivamente account, progressi, chat e foto. L'operazione non è reversibile.</p>
            <div className="row">
              <button className="btn danger" disabled={act.busy} onClick={() => void act.run(() => api.deleteAccount())}>
                Elimina definitivamente
              </button>
              <button className="btn ghost" onClick={() => setConfirmDelete(false)}>
                Annulla
              </button>
            </div>
          </div>
        )}
      </section>
      <p className="muted center small">Ripetizioni di Matematica · versione 1.0.0</p>
    </>
  );
}
