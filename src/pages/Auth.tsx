import { useState, type FormEvent } from 'react';
import { ErrorText, useAction } from '../components/ui';
import { api, useAuth } from '../lib/app';
import { UserError } from '../lib/api';
import type { Role } from '../lib/types';

export function AuthPage() {
  const { refresh } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [year, setYear] = useState(3);
  const [consent, setConsent] = useState(false);
  const [info, setInfo] = useState('');
  const act = useAction();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setInfo('');
    void act.run(async () => {
      if (mode === 'login') {
        await api.signIn(email, password);
      } else {
        if (fullName.trim().length < 2) throw new UserError('Inserisci nome e cognome.');
        if (password.length < 8) throw new UserError('La password deve avere almeno 8 caratteri.');
        if (!consent) throw new UserError('Per registrarti devi accettare l\'informativa.');
        const { needsEmailConfirm } = await api.signUp({ email, password, fullName, role, schoolYear: role === 'student' ? year : null });
        if (needsEmailConfirm) {
          setInfo('Ti abbiamo inviato una email: apri il link di conferma, poi accedi.');
          setMode('login');
          return;
        }
      }
      await refresh();
    });
  };

  return (
    <main className="page auth">
      <img src="./icon.svg" alt="" width={72} height={72} />
      <h1>Ripetizioni di Matematica</h1>
      <p className="muted">Lezioni, esercizi guidati e verifiche per il liceo scientifico, seguiti dal tuo professore.</p>
      {api.demo && <p className="demo-note">Modalità demo: gli account creati qui esistono solo su questo dispositivo.</p>}
      <form className="card" onSubmit={submit}>
        {mode === 'signup' && (
          <>
            <div className="seg">
              <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>
                Sono uno studente
              </button>
              <button type="button" className={role === 'teacher' ? 'active' : ''} onClick={() => setRole('teacher')}>
                Sono un professore
              </button>
            </div>
            <label>
              Nome e cognome
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} autoComplete="name" required />
            </label>
            {role === 'student' && (
              <label>
                Anno di corso
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  <option value={3}>3° liceo scientifico</option>
                  <option value={4}>4° liceo scientifico</option>
                </select>
              </label>
            )}
          </>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 8 : undefined} required />
        </label>
        {mode === 'signup' && (
          <label className="check">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              Ho letto l'informativa: i miei progressi, le chat (anche con il tutor AI) e le foto inviate sono visibili al professore che scelgo. Se ho meno di 14 anni mi registro con il consenso di un genitore.
            </span>
          </label>
        )}
        <ErrorText>{act.error}</ErrorText>
        {info && <p className="info">{info}</p>}
        <button className="btn block-btn" disabled={act.busy}>
          {act.busy ? 'Attendi…' : mode === 'login' ? 'Accedi' : 'Crea account'}
        </button>
      </form>
      <button
        className="btn link"
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          act.setError(null);
        }}
      >
        {mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
      </button>
    </main>
  );
}
