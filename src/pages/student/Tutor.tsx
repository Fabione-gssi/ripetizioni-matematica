import { useLocation } from 'react-router-dom';
import { Chat } from '../../components/Chat';
import { Header, Loadable } from '../../components/ui';
import { api, useLoad, useMe } from '../../lib/app';
import { errorMessage } from '../../lib/api';
import { useState } from 'react';

export function Tutor() {
  const me = useMe();
  const context = (useLocation().state as { context?: string } | null)?.context ?? '';
  const msgs = useLoad(() => api.listAiMessages(me.id), [me.id]);
  const [error, setError] = useState('');

  const send = async (text: string) => {
    setError('');
    try {
      await api.askAi(text, context);
      await msgs.reload(true);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    }
  };

  return (
    <>
      <Header title="Tutor AI" />
      <p className="muted small">
        Chiedi chiarimenti e approfondimenti di matematica{context ? ` (stai studiando: ${context})` : ''}. Il tutor è un'intelligenza artificiale e può sbagliare: per conferme scrivi al tuo professore, che può rileggere queste conversazioni.
      </p>
      {error && <p className="error">{error}</p>}
      <Loadable state={msgs}>
        {(list) => (
          <Chat
            bubbles={list.map((m) => ({ id: m.id, mine: m.role === 'user', body: m.body, at: m.created_at }))}
            onSend={send}
            placeholder="Scrivi la tua domanda…"
            empty="Nessuna domanda ancora. Per esempio: «Perché il discriminante negativo significa nessuna soluzione reale?»"
            busyLabel="Il tutor sta scrivendo…"
          />
        )}
      </Loadable>
    </>
  );
}
