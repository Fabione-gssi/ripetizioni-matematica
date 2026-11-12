// Piccoli componenti di interfaccia riutilizzabili.
import { memo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from '../lib/api';
import { renderMd } from '../lib/md';

/** Testo Markdown + LaTeX. L'HTML prodotto da renderMd è già sanificato (escape completo). */
export const Md = memo(function Md({ src, className }: { src: string; className?: string }) {
  return <div className={`md ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: renderMd(src) }} />;
});

export function Header({ title, back, right }: { title: string; back?: string | true; right?: ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="topbar">
      {back && (
        <button className="icon-btn" aria-label="Indietro" onClick={() => (back === true ? nav(-1) : nav(back))}>
          ‹
        </button>
      )}
      <h1>{title}</h1>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

export const Spinner = () => <div className="spinner" role="status" aria-label="Caricamento" />;

export function Loadable<T>({ state, children }: { state: { data: T | undefined; error: string | null; loading: boolean; reload: () => void }; children: (d: T) => ReactNode }) {
  if (state.data !== undefined) return <>{children(state.data)}</>;
  if (state.loading) return <Spinner />;
  return (
    <div className="card center">
      <p>{state.error ?? 'Impossibile caricare i dati.'}</p>
      <button className="btn" onClick={() => state.reload()}>
        Riprova
      </button>
    </div>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="empty">{children}</p>;

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; badge?: number }[]; value: T; onChange: (t: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={value === t.id ? 'active' : ''} onClick={() => onChange(t.id)}>
          {t.label}
          {!!t.badge && <span className="badge">{t.badge}</span>}
        </button>
      ))}
    </div>
  );
}

/** Esegue un'azione asincrona mostrando stato di attesa ed eventuale errore. */
export function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<void>) => {
    if (busy) return false;
    setBusy(true);
    setError(null);
    try {
      await fn();
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run, setError };
}

export const ErrorText = ({ children }: { children: ReactNode }) => (children ? <p className="error" role="alert">{children}</p> : null);

export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
