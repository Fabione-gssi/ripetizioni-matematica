// Esercizi fotografati: lo studente li invia, il professore li corregge.
import { useEffect, useRef, useState } from 'react';
import { unitById, units } from '../content';
import { api, useLoad } from '../lib/app';
import { compressImage } from '../lib/image';
import type { Submission, Verdict } from '../lib/types';
import { Empty, ErrorText, Loadable, Md, fmtDate, useAction } from './ui';

const VERDICTS: Record<Verdict, string> = { correct: 'Corretto', partial: 'Parzialmente corretto', wrong: 'Da rivedere' };
const VERDICT_CLASS: Record<Verdict, string> = { correct: 'ok', partial: 'warn', wrong: 'ko' };

function Photo({ path }: { path: string }) {
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    api
      .imageUrl(path)
      .then((u) => alive && setUrl(u))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [path]);
  if (!url) return <div className="photo placeholder">Caricamento foto…</div>;
  return (
    <>
      <img className="photo" src={url} alt="Esercizio fotografato" onClick={() => setOpen(true)} />
      {open && (
        <div className="lightbox" onClick={() => setOpen(false)} role="dialog" aria-label="Foto ingrandita">
          <img src={url} alt="Esercizio fotografato ingrandito" />
        </div>
      )}
    </>
  );
}

function ReviewForm({ sub, onSaved }: { sub: Submission; onSaved: () => void }) {
  const [verdict, setVerdict] = useState<Verdict | null>(sub.verdict);
  const [feedback, setFeedback] = useState(sub.feedback ?? '');
  const act = useAction();
  return (
    <div className="review">
      <div className="seg">
        {(Object.keys(VERDICTS) as Verdict[]).map((v) => (
          <button key={v} className={verdict === v ? 'active' : ''} onClick={() => setVerdict(v)}>
            {VERDICTS[v]}
          </button>
        ))}
      </div>
      <textarea rows={3} maxLength={4000} placeholder="Commento per lo studente (puoi usare formule tra $…$)" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      <ErrorText>{act.error}</ErrorText>
      <button
        className="btn"
        disabled={!verdict || act.busy}
        onClick={() =>
          void act.run(async () => {
            await api.reviewSubmission(sub.id, verdict!, feedback.trim());
            onSaved();
          })
        }
      >
        Salva correzione
      </button>
    </div>
  );
}

export function Submissions({ studentId, canUpload, canReview }: { studentId: string; canUpload?: boolean; canReview?: boolean }) {
  const subs = useLoad(() => api.listSubmissions(studentId), [studentId]);
  const [note, setNote] = useState('');
  const [unitId, setUnitId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const act = useAction();

  const upload = () =>
    act.run(async () => {
      if (!file) return;
      const blob = await compressImage(file);
      await api.createSubmission(blob, note.trim(), unitId || null);
      setFile(null);
      setNote('');
      if (input.current) input.current.value = '';
      await subs.reload(true);
    });

  return (
    <>
      {canUpload && (
        <div className="card">
          <h3>Invia un esercizio da correggere</h3>
          <p className="muted small">Fotografa lo svolgimento su carta: lo correggerà direttamente il tuo professore.</p>
          <div className="row">
            <label className="btn ghost file-btn">
              Scatta una foto
              <input ref={input} type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <label className="btn ghost file-btn">
              Scegli dalla galleria
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          {file && <p className="small">Foto selezionata: {file.name}</p>}
          <label>
            Argomento (facoltativo)
            <select value={unitId} onChange={(e) => setUnitId(e.target.value)}>
              <option value="">—</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.year}° · {u.title}
                </option>
              ))}
            </select>
          </label>
          <textarea rows={2} maxLength={2000} placeholder="Nota per il professore (es. testo dell'esercizio, dove hai dubbi)" value={note} onChange={(e) => setNote(e.target.value)} />
          <ErrorText>{act.error}</ErrorText>
          <button className="btn block-btn" disabled={!file || act.busy} onClick={() => void upload()}>
            {act.busy ? 'Invio in corso…' : 'Invia al professore'}
          </button>
        </div>
      )}
      <Loadable state={subs}>
        {(list) =>
          list.length === 0 ? (
            <Empty>Nessun esercizio inviato.</Empty>
          ) : (
            <div className="list">
              {list.map((s) => (
                <div className="card" key={s.id}>
                  <div className="ex-head">
                    <span className="muted small">
                      {fmtDate(s.created_at)}
                      {s.unit_id && unitById(s.unit_id) ? ` · ${unitById(s.unit_id)!.title}` : ''}
                    </span>
                    <span className={`pill ${s.verdict ? VERDICT_CLASS[s.verdict] : ''}`}>{s.verdict ? VERDICTS[s.verdict] : 'In attesa di correzione'}</span>
                  </div>
                  <Photo path={s.image_path} />
                  {s.note && <Md src={s.note} />}
                  {s.status === 'reviewed' && editing !== s.id && s.feedback && (
                    <div className={`feedback ${VERDICT_CLASS[s.verdict!]}`}>
                      <strong>Commento del professore</strong>
                      <Md src={s.feedback} />
                    </div>
                  )}
                  {canReview &&
                    (s.status === 'pending' || editing === s.id ? (
                      <ReviewForm
                        sub={s}
                        onSaved={() => {
                          setEditing(null);
                          void subs.reload(true);
                        }}
                      />
                    ) : (
                      <button className="btn link" onClick={() => setEditing(s.id)}>
                        Modifica correzione
                      </button>
                    ))}
                </div>
              ))}
            </div>
          )
        }
      </Loadable>
    </>
  );
}
