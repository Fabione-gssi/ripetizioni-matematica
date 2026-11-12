// Svolgimento di un singolo esercizio nei tre livelli di autonomia:
//  - guided: l'esercizio è scomposto in passi, ognuno con una mini-domanda;
//  - hints:  domanda completa, suggerimenti a richiesta, un secondo tentativo;
//  - solo:   un solo tentativo, poi correzione con spiegazione dell'errore.
import { useState } from 'react';
import { correctText, numericOk, parseNumber } from '../lib/exercise';
import type { Exercise, Mode } from '../lib/types';
import { OptionList } from './Blocks';
import { Md } from './ui';

export interface Outcome {
  correct: boolean;
  hintsUsed: number;
  given: string;
}

/** Campo di risposta (scelta multipla o numerica), usato anche nelle verifiche. */
export function AnswerInput({ ex, value, onChange, disabled }: { ex: Exercise; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  if (ex.options) {
    const chosen = value === '' ? null : Number(value);
    return <OptionList options={ex.options} chosen={chosen} onChoose={(i) => !disabled && onChange(String(i))} reveal={false} />;
  }
  return (
    <label className="num-answer">
      <span>La tua risposta (numero o frazione, es. 3/4 oppure -1,5)</span>
      <input inputMode="text" autoComplete="off" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="Risposta" />
    </label>
  );
}

/** Valuta una risposta espressa come stringa (indice dell'opzione o numero). */
export function evaluate(ex: Exercise, value: string): { valid: boolean; correct: boolean; given: string; why?: string } {
  if (ex.options) {
    const o = value === '' ? undefined : ex.options[Number(value)];
    if (!o) return { valid: false, correct: false, given: '' };
    return { valid: true, correct: !!o.ok, given: o.md, why: o.why };
  }
  const n = parseNumber(value);
  if (n === null) return { valid: false, correct: false, given: value };
  return { valid: true, correct: numericOk(ex, n), given: value.trim() };
}

function Solution({ ex }: { ex: Exercise }) {
  return (
    <div className="solution">
      <div className="block-tag">Soluzione passo per passo</div>
      {ex.solution.map((s, i) => (
        <div className="step" key={i}>
          <span className="step-n">{i + 1}</span>
          <Md src={s} />
        </div>
      ))}
    </div>
  );
}

function GuidedSteps({ ex, onDone }: { ex: Exercise; onDone: (o: Outcome) => void }) {
  const steps = ex.steps!;
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [finished, setFinished] = useState(false);
  const step = steps[i];
  const picked = chosen === null ? null : step.options[chosen];

  const choose = (k: number) => {
    setChosen(k);
    if (!step.options[k].ok) setErrors((e) => e + 1);
  };
  const next = () => {
    if (i + 1 < steps.length) {
      setI(i + 1);
      setChosen(null);
    } else {
      setFinished(true);
      onDone({ correct: errors === 0, hintsUsed: 0, given: errors === 0 ? 'Tutti i passi corretti' : `${errors} errori nei passi guidati` });
    }
  };

  return (
    <>
      <Md src={ex.text} className="question" />
      {steps.slice(0, i).map((s, k) => (
        <div className="step done" key={k}>
          <span className="step-n">{k + 1}</span>
          <Md src={s.explain} />
        </div>
      ))}
      {!finished ? (
        <div className="guided-step">
          <div className="block-tag">
            Passo {i + 1} di {steps.length}
          </div>
          <Md src={step.ask} />
          <OptionList options={step.options} chosen={chosen} onChoose={choose} reveal={!!picked?.ok} />
          {picked && !picked.ok && (
            <div className="feedback ko">
              <Md src={picked.why ?? 'Non è corretto: rifletti e riprova.'} />
            </div>
          )}
          {picked?.ok && (
            <>
              <div className="feedback ok">
                <Md src={step.explain} />
              </div>
              <button className="btn" onClick={next}>
                {i + 1 < steps.length ? 'Passo successivo' : 'Concludi'}
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="step done">
            <span className="step-n">{steps.length}</span>
            <Md src={steps[steps.length - 1].explain} />
          </div>
          <div className={`feedback ${errors === 0 ? 'ok' : 'warn'}`}>
            <Md src={errors === 0 ? '**Ottimo!** Hai svolto correttamente tutti i passi. Prova ora un esercizio simile con meno aiuto.' : `Esercizio completato con **${errors}** ${errors === 1 ? 'errore' : 'errori'} lungo il percorso. Rileggi i passi e riprova con un esercizio simile.`} />
          </div>
        </>
      )}
    </>
  );
}

export function ExerciseCard({ ex, mode, onDone }: { ex: Exercise; mode: Exclude<Mode, 'test'>; onDone: (o: Outcome) => void }) {
  const [value, setValue] = useState('');
  const [hints, setHints] = useState(mode === 'guided' ? 1 : 0);
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof evaluate> | null>(null);
  const [closed, setClosed] = useState(false);
  const [invalid, setInvalid] = useState(false);

  if (mode === 'guided' && ex.steps?.length) return <GuidedSteps ex={ex} onDone={onDone} />;

  const maxTries = mode === 'solo' ? 1 : 2;
  const submit = () => {
    const res = evaluate(ex, value);
    if (!res.valid) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setResult(res);
    const t = tries + 1;
    setTries(t);
    // Si registra l'esito del primo tentativo; il secondo serve solo per imparare.
    if (t === 1) onDone({ correct: res.correct, hintsUsed: hints, given: res.given });
    if (res.correct || t >= maxTries) setClosed(true);
  };
  const retry = () => {
    setResult(null);
    setValue('');
  };

  return (
    <>
      <Md src={ex.text} className="question" />
      {mode !== 'solo' &&
        ex.hints.slice(0, hints).map((h, i) => (
          <div className="hint" key={i}>
            <span>Suggerimento {i + 1}</span>
            <Md src={h} />
          </div>
        ))}
      {!result && (
        <>
          <AnswerInput ex={ex} value={value} onChange={setValue} />
          {invalid && <p className="error">{ex.options ? 'Scegli una risposta.' : 'Scrivi un numero valido (es. 2, -1,5 oppure 3/4).'}</p>}
          <div className="row">
            <button className="btn" onClick={submit} disabled={value === ''}>
              Verifica
            </button>
            {mode !== 'solo' && hints < ex.hints.length && (
              <button className="btn ghost" onClick={() => setHints(hints + 1)}>
                {mode === 'guided' ? 'Altro aiuto' : 'Suggerimento'}
              </button>
            )}
          </div>
        </>
      )}
      {result && (
        <>
          <div className={`feedback ${result.correct ? 'ok' : 'ko'}`}>
            <strong>{result.correct ? 'Corretto!' : 'Non è corretto.'}</strong>
            {result.why && <Md src={result.why} />}
            {!result.correct && closed && <Md src={`La risposta corretta è ${correctText(ex)}.`} />}
          </div>
          {!closed && (
            <div className="row">
              <button className="btn" onClick={retry}>
                Riprova
              </button>
              <button className="btn ghost" onClick={() => setClosed(true)}>
                Mostra la soluzione
              </button>
            </div>
          )}
          {closed && <Solution ex={ex} />}
        </>
      )}
    </>
  );
}
