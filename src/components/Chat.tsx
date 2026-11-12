// Conversazione a fumetti, usata per la chat con il professore e per il tutor AI.
import { useEffect, useRef, useState } from 'react';
import { ErrorText, Md, fmtDate } from './ui';

export interface Bubble {
  id: string;
  mine: boolean;
  body: string;
  at: string;
  author?: string;
}

interface Props {
  bubbles: Bubble[];
  onSend?: (text: string) => Promise<boolean>;
  placeholder?: string;
  empty: string;
  busyLabel?: string;
  maxLength?: number;
}

export function Chat({ bubbles, onSend, placeholder, empty, busyLabel, maxLength = 2000 }: Props) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [bubbles.length, busy]);

  const send = async () => {
    const t = text.trim();
    if (!t || busy || !onSend) return;
    setBusy(true);
    setError('');
    const ok = await onSend(t);
    setBusy(false);
    if (ok) setText('');
    else setError('Messaggio non inviato. Riprova.');
  };

  return (
    <div className="chat">
      <div className="chat-list">
        {bubbles.length === 0 && <p className="empty">{empty}</p>}
        {bubbles.map((b) => (
          <div key={b.id} className={`bubble ${b.mine ? 'mine' : 'theirs'}`}>
            {b.author && <div className="bubble-author">{b.author}</div>}
            <Md src={b.body} />
            <time>{fmtDate(b.at)}</time>
          </div>
        ))}
        {busy && busyLabel && <div className="bubble theirs typing">{busyLabel}</div>}
        <div ref={end} />
      </div>
      {onSend && (
        <>
          <ErrorText>{error}</ErrorText>
          <div className="chat-input">
            <textarea
              rows={2}
              value={text}
              maxLength={maxLength}
              placeholder={placeholder}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void send();
              }}
            />
            <button className="btn" disabled={busy || !text.trim()} onClick={() => void send()} aria-label="Invia">
              Invia
            </button>
          </div>
        </>
      )}
    </div>
  );
}
