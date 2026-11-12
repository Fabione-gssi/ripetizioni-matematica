// Visualizza i blocchi di una lezione: testo, definizioni, teoremi con
// dimostrazione guidata, esempi svolti a passi, grafici interattivi, quiz.
import { useState } from 'react';
import type { Block, Option } from '../lib/types';
import { Plot } from './Plot';
import { Md } from './ui';

/** Elenco di passaggi svelati uno alla volta. */
export function Stepper({ steps, label }: { steps: string[]; label: string }) {
  const [n, setN] = useState(0);
  return (
    <div className="stepper">
      {steps.slice(0, n).map((s, i) => (
        <div className="step" key={i}>
          <span className="step-n">{i + 1}</span>
          <Md src={s} />
        </div>
      ))}
      {n < steps.length ? (
        <button className="btn ghost" onClick={() => setN(n + 1)}>
          {n === 0 ? label : `Passo successivo (${n + 1}/${steps.length})`}
        </button>
      ) : (
        <button className="btn link" onClick={() => setN(0)}>
          Nascondi
        </button>
      )}
    </div>
  );
}

export function OptionList({ options, chosen, onChoose, reveal }: { options: Option[]; chosen: number | null; onChoose: (i: number) => void; reveal: boolean }) {
  return (
    <div className="options">
      {options.map((o, i) => {
        const cls = reveal ? (o.ok ? 'ok' : i === chosen ? 'ko' : '') : i === chosen ? 'sel' : '';
        return (
          <button key={i} className={`option ${cls}`} disabled={reveal} onClick={() => onChoose(i)}>
            <Md src={o.md} />
          </button>
        );
      })}
    </div>
  );
}

function Quiz({ q, options }: { q: string; options: Option[] }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const picked = chosen === null ? null : options[chosen];
  return (
    <div className="block quiz">
      <div className="block-tag">Hai capito?</div>
      <Md src={q} />
      <OptionList options={options} chosen={chosen} onChoose={setChosen} reveal={!!picked?.ok} />
      {picked && (
        <div className={`feedback ${picked.ok ? 'ok' : 'ko'}`}>
          <Md src={picked.why ?? (picked.ok ? 'Esatto!' : 'Non è corretto: riprova.')} />
        </div>
      )}
    </div>
  );
}

export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'text':
      return <Md src={b.md} className="block" />;
    case 'idea':
      return (
        <div className="block idea">
          <div className="block-tag">In parole semplici</div>
          <Md src={b.md} />
        </div>
      );
    case 'def':
      return (
        <div className="block def">
          <div className="block-tag">{b.title}</div>
          <Md src={b.md} />
        </div>
      );
    case 'thm':
      return (
        <div className="block thm">
          <div className="block-tag">{b.title}</div>
          <Md src={b.md} />
          {b.proof && <Stepper steps={b.proof} label="Dimostrazione guidata" />}
        </div>
      );
    case 'ex':
      return (
        <div className="block example">
          <div className="block-tag">Esempio</div>
          <Md src={b.title} />
          <Stepper steps={b.steps} label="Mostra lo svolgimento" />
        </div>
      );
    case 'warn':
      return (
        <div className="block warn">
          <div className="block-tag">Attenzione</div>
          <Md src={b.md} />
        </div>
      );
    case 'plot':
      return (
        <div className="block">
          <div className="block-tag">{b.title}</div>
          <Plot view={b.view} params={b.params} draw={b.draw} readout={b.readout} />
          {b.caption && <Md src={b.caption} className="caption" />}
        </div>
      );
    case 'quiz':
      return <Quiz q={b.q} options={b.options} />;
  }
}
