// Stato globale minimo: istanza dell'API e profilo dell'utente corrente.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type DependencyList, type ReactNode } from 'react';
import { errorMessage, type Api } from './api';
import { LocalApi } from './localApi';
import { SupabaseApi } from './supabaseApi';
import type { Profile } from './types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Con le variabili d'ambiente configurate si usa Supabase, altrimenti la modalità demo locale. */
export const api: Api = url && key ? new SupabaseApi(url, key) : new LocalApi();

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
}
const AuthCtx = createContext<AuthState>({ profile: null, loading: true, refresh: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      setProfile(await api.currentProfile());
    } catch {
      /* offline: si mantiene l'ultimo profilo noto */
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    return api.onAuthChange(() => void refresh());
  }, [refresh]);
  return <AuthCtx.Provider value={{ profile, loading, refresh }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

/** Profilo dell'utente autenticato (da usare solo nelle pagine protette). */
export function useMe(): Profile {
  const { profile } = useAuth();
  if (!profile) throw new Error('useMe fuori da una pagina protetta');
  return profile;
}

/** Carica dati asincroni con stato di caricamento/errore e funzione di ricarica. */
export function useLoad<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const seq = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const reload = useCallback(async (silent = false) => {
    const id = ++seq.current;
    if (!silent) setLoading(true);
    try {
      const d = await fnRef.current();
      if (id === seq.current) {
        setData(d);
        setError(null);
      }
    } catch (e) {
      if (id === seq.current && !silent) setError(errorMessage(e));
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, error, loading, reload };
}
