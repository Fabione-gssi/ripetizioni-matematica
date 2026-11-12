import { choice, frac, int, m, mc, nz, pick, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

export const esponenziali: Unit = {
  id: 'a3-esponenziali',
  year: 3,
  title: 'Esponenziali',
  summary: 'Potenze a esponente reale, funzione esponenziale, equazioni e disequazioni.',
  lessons: [
    {
      id: 'a3-esp-1',
      title: 'Potenze e funzione esponenziale',
      blocks: [
        { t: 'idea', md: R`Piega un foglio a metà: 2 strati. Ancora: 4, poi 8, 16… Dopo 42 pieghe (se fosse possibile!) lo spessore supererebbe la distanza Terra–Luna. È la **crescita esponenziale**: a ogni passo la quantità viene **moltiplicata** per un fattore fisso. Così crescono batteri, epidemie e capitali; così decadono le sostanze radioattive.` },
        { t: 'def', title: 'Potenze con esponente reale', md: R`Per $a>0$:
- $a^0=1$, $\quad a^{-n}=\dfrac{1}{a^n}$
- $a^{\frac mn}=\sqrt[n]{a^m}$ (esponente razionale)
- per un esponente irrazionale la potenza si definisce per approssimazioni successive con esponenti razionali.

**Proprietà** (valgono per ogni esponente reale): $$a^x\cdot a^y=a^{x+y}\qquad \frac{a^x}{a^y}=a^{x-y}\qquad (a^x)^y=a^{xy}\qquad (ab)^x=a^xb^x$$` },
        { t: 'def', title: 'Funzione esponenziale', md: R`Si chiama **funzione esponenziale** di base $a$ (con $a>0$, $a\neq1$) la funzione $$y=a^x$$
- **Dominio:** $\mathbb R$. **Immagine:** $y>0$ (il grafico sta tutto sopra l'asse $x$).
- Passa sempre per $(0;1)$ e per $(1;a)$.
- Se $a>1$ è **crescente**; se $0<a<1$ è **decrescente**.
- L'asse $x$ è **asintoto orizzontale**.
- È iniettiva: $a^{x_1}=a^{x_2}\iff x_1=x_2$.` },
        {
          t: 'plot',
          title: 'La base decide tutto',
          caption: R`Grafico di $y=a^x$ (in tratteggio $y=\left(\frac1a\right)^x$, simmetrico rispetto all'asse $y$). Passa sempre per $(0;1)$.`,
          view: [-4, 4, -1, 9],
          params: [{ name: 'a', label: 'a', min: 0.25, max: 4, step: 0.25, value: 2 }],
          draw: (p) => [
            { k: 'fn', f: (x) => p.a ** x },
            { k: 'fn', f: (x) => p.a ** -x, dash: true, color: 'var(--muted)' },
            { k: 'pt', x: 0, y: 1 },
            { k: 'pt', x: 1, y: p.a, label: '(1; a)' },
          ],
          readout: (p) => (p.a === 1 ? 'Con $a=1$ la funzione è costante: $y=1$ (non è un\'esponenziale).' : `$a=${d(p.a)}$: funzione **${p.a > 1 ? 'crescente' : 'decrescente'}**`),
        },
        { t: 'def', title: 'Il numero e', md: R`La base più importante è il **numero di Nepero** $e\approx2{,}71828\dots$, irrazionale. È il valore a cui si avvicina $\left(1+\dfrac1n\right)^n$ quando $n$ diventa sempre più grande. La funzione $y=e^x$ descrive i fenomeni in cui la velocità di crescita è proporzionale alla quantità presente.` },
        {
          t: 'ex',
          title: R`Calcola $8^{\frac23}$, $\ 25^{-\frac12}$, $\ \left(\dfrac{1}{27}\right)^{-\frac13}$.`,
          steps: [R`$8^{\frac23}=\sqrt[3]{8^2}=\left(\sqrt[3]{8}\right)^2=2^2=4$.`, R`$25^{-\frac12}=\dfrac{1}{25^{\frac12}}=\dfrac{1}{\sqrt{25}}=\dfrac15$.`, R`$\left(\dfrac{1}{27}\right)^{-\frac13}=27^{\frac13}=\sqrt[3]{27}=3$.`],
        },
        { t: 'warn', md: R`$a^x$ è **sempre positivo**: l'equazione $2^x=-4$ non ha soluzioni. E attenzione: $2^{-3}=\frac18$, non $-8$; un esponente negativo non rende negativa la potenza.` },
        {
          t: 'quiz',
          q: R`La funzione $y=\left(\dfrac13\right)^x$ è:`,
          options: [
            { md: 'decrescente', ok: true, why: 'Esatto: la base è compresa tra $0$ e $1$.' },
            { md: 'crescente', why: 'Con base compresa tra $0$ e $1$ la funzione decresce: prova con $x=1$ e $x=2$.' },
            { md: 'negativa per $x>0$', why: 'Un\'esponenziale è sempre positiva.' },
          ],
        },
      ],
    },
    {
      id: 'a3-esp-2',
      title: 'Equazioni e disequazioni esponenziali',
      blocks: [
        { t: 'idea', md: R`In un'equazione esponenziale l'incognita è **all'esponente**. Il trucco è scrivere entrambi i membri come potenze **della stessa base**: a quel punto, poiché l'esponenziale è iniettiva, basta uguagliare gli esponenti.` },
        { t: 'def', title: 'Equazioni esponenziali', md: R`- **Stessa base:** $a^{f(x)}=a^{g(x)}\iff f(x)=g(x)$.
- **Basi riconducibili:** si scompongono in potenze della stessa base, es. $4^x=8\Rightarrow2^{2x}=2^3$.
- **Con sostituzione:** se compaiono $a^{2x}$ e $a^x$ si pone $t=a^x$ (con $t>0$) e si risolve un'equazione di secondo grado.
- **Basi non riconducibili:** servono i logaritmi, $a^x=b\iff x=\log_ab$ (con $b>0$).` },
        {
          t: 'ex',
          title: R`Risolvi $9^{x-1}=27^{x}$.`,
          steps: [R`Scriviamo tutto in base $3$: $(3^2)^{x-1}=(3^3)^x$, cioè $3^{2x-2}=3^{3x}$.`, R`Uguagliamo gli esponenti: $2x-2=3x$.`, R`$x=-2$. Verifica: $9^{-3}=\dfrac{1}{729}$ e $27^{-2}=\dfrac{1}{729}$ ✓.`],
        },
        {
          t: 'ex',
          title: R`Risolvi $4^x-6\cdot2^x+8=0$.`,
          steps: [R`Poiché $4^x=(2^x)^2$, poniamo $t=2^x$ con $t>0$: $t^2-6t+8=0$.`, R`Soluzioni: $t=2$ e $t=4$, entrambe positive e quindi accettabili.`, R`$2^x=2\Rightarrow x=1$; $2^x=4\Rightarrow x=2$.`],
        },
        { t: 'def', title: 'Disequazioni esponenziali', md: R`Tutto dipende dalla monotonia:
- se $a>1$ (funzione crescente): $a^{f(x)}>a^{g(x)}\iff f(x)>g(x)$ — il verso **si conserva**;
- se $0<a<1$ (funzione decrescente): $a^{f(x)}>a^{g(x)}\iff f(x)<g(x)$ — il verso **si inverte**.` },
        {
          t: 'plot',
          title: 'Perché il verso si inverte',
          caption: R`Confronto tra $y=a^x$ e la retta $y=k$. Se $a>1$ la curva supera $k$ a **destra** del punto di intersezione; se $a<1$ a **sinistra**.`,
          view: [-4, 4, -1, 9],
          params: [
            { name: 'a', label: 'a', min: 0.25, max: 3, step: 0.25, value: 0.5 },
            { name: 'k', label: 'k', min: 0.5, max: 8, step: 0.5, value: 4 },
          ],
          draw: (p) => (p.a === 1 ? [{ k: 'fn', f: () => 1 }] : [{ k: 'fn', f: (x) => p.a ** x }, { k: 'fn', f: () => p.k, dash: true }, { k: 'pt', x: Math.log(p.k) / Math.log(p.a), y: p.k }]),
          readout: (p) => (p.a === 1 ? 'Scegli una base diversa da $1$.' : `$${d(p.a)}^x>${d(p.k)}\\iff x${p.a > 1 ? '>' : '<'}${d(Math.log(p.k) / Math.log(p.a))}$`),
        },
        {
          t: 'ex',
          title: R`Risolvi $\left(\dfrac12\right)^{x+1}\le\dfrac18$.`,
          steps: [R`Stessa base: $\dfrac18=\left(\dfrac12\right)^3$, quindi $\left(\dfrac12\right)^{x+1}\le\left(\dfrac12\right)^3$.`, R`La base è minore di $1$: il verso si **inverte** passando agli esponenti: $x+1\ge3$.`, R`$x\ge2$.`],
        },
        { t: 'warn', md: R`Nelle equazioni con sostituzione $t=a^x$ scarta sempre i valori $t\le0$: per esempio $2^x=-3$ è impossibile.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'esp-potenza',
      level: 1,
      title: 'Potenze a esponente razionale',
      make: (r) => {
        const [tex, n, dn, how] = pick(r, [
          [R`8^{\frac23}`, 4, 1, R`$\left(\sqrt[3]{8}\right)^2=2^2$`],
          [R`27^{\frac23}`, 9, 1, R`$\left(\sqrt[3]{27}\right)^2=3^2$`],
          [R`16^{\frac34}`, 8, 1, R`$\left(\sqrt[4]{16}\right)^3=2^3$`],
          [R`4^{\frac32}`, 8, 1, R`$\left(\sqrt4\right)^3=2^3$`],
          [R`25^{-\frac12}`, 1, 5, R`$\dfrac{1}{\sqrt{25}}$`],
          [R`8^{-\frac13}`, 1, 2, R`$\dfrac{1}{\sqrt[3]{8}}$`],
          [R`9^{\frac32}`, 27, 1, R`$\left(\sqrt9\right)^3=3^3$`],
          [R`32^{\frac25}`, 4, 1, R`$\left(\sqrt[5]{32}\right)^2=2^2$`],
          [R`4^{-\frac32}`, 1, 8, R`$\dfrac{1}{\left(\sqrt4\right)^3}$`],
          [R`\left(\dfrac14\right)^{-\frac12}`, 2, 1, R`$4^{\frac12}=\sqrt4$`],
        ] as const);
        return {
          text: `Calcola ${m(tex)}.`,
          answer: n / dn,
          tol: 0.001,
          hints: [R`$a^{\frac mn}=\left(\sqrt[n]{a}\right)^m$.`, R`Un esponente negativo indica il reciproco: $a^{-x}=\dfrac{1}{a^x}$.`],
          solution: [`${m(tex)} $=$ ${how} ${m(`=${frac(n, dn)}`)}`],
        };
      },
    },
    {
      id: 'esp-proprieta',
      level: 1,
      title: 'Proprietà delle potenze',
      make: (r) => {
        const b = pick(r, [2, 3, 5]), p = int(r, 1, 4), q = int(r, -3, 3), e = p - q;
        const ee = e === 0 ? 1 : e;
        const qq = p - ee;
        return {
          text: `Semplifica ${m(`\\dfrac{${b}^{x${sg(p)}}}{${b}^{x${sg(qq) || '+0'}}}`.replace('+0', ''))} (il risultato è un numero).`,
          answer: b ** ee,
          tol: 0.0005,
          hints: [R`$\dfrac{a^m}{a^n}=a^{m-n}$: si sottraggono gli esponenti.`, 'La $x$ si semplifica.'],
          solution: [`${m(`${b}^{(x${sg(p)})-(x${sg(qq)})}=${b}^{${ee}}`)}`, `${m(`=${frac(ee > 0 ? b ** ee : 1, ee > 0 ? 1 : b ** -ee)}`)}`],
        };
      },
    },
    {
      id: 'esp-monotonia',
      level: 1,
      title: 'Crescente o decrescente',
      make: (r) => {
        const [f, inc, why] = pick(r, [
          [R`y=3^x`, true, 'la base $3$ è maggiore di $1$'],
          [R`y=\left(\dfrac25\right)^x`, false, R`la base $\frac25$ è compresa tra $0$ e $1$`],
          [R`y=2^{-x}`, false, R`$2^{-x}=\left(\frac12\right)^x$, con base minore di $1$`],
          [R`y=\left(\dfrac13\right)^{-x}`, true, R`$\left(\frac13\right)^{-x}=3^x$, con base maggiore di $1$`],
          [R`y=(1{,}05)^x`, true, 'la base $1{,}05$ è maggiore di $1$'],
          [R`y=(0{,}9)^x`, false, 'la base $0{,}9$ è minore di $1$'],
          [R`y=e^x`, true, R`la base $e\approx2{,}718$ è maggiore di $1$`],
        ] as const);
        return {
          text: `La funzione ${m(f)} è crescente o decrescente?`,
          options: choice(r, [[inc ? 'Crescente' : 'Decrescente', `Corretto: ${why}.`], [inc ? 'Decrescente' : 'Crescente', `Riscrivi la funzione nella forma $a^x$: ${why}.`], ['Né crescente né decrescente', 'Ogni funzione esponenziale è strettamente monotòna.']]),
          hints: ['Riscrivi nella forma $y=a^x$ e confronta la base con $1$.'],
          solution: [`Si ha che ${why}.`, `Quindi la funzione è **${inc ? 'crescente' : 'decrescente'}**.`],
        };
      },
    },
    {
      id: 'esp-eq-base',
      level: 1,
      title: 'Equazione con la stessa base',
      make: (r) => {
        const b = pick(r, [2, 3, 5]), k = int(r, 2, 4), a = nz(r, -5, 5), p = pick(r, [1, 2]);
        // b^(p x + a) = b^k
        const lhs = `${b}^{${p === 1 ? '' : p}x${sg(a)}}`;
        return {
          text: `Risolvi l'equazione ${m(`${lhs}=${b ** k}`)}.`,
          options: mc(r, m(`x=${frac(k - a, p)}`), [
            [m(`x=${frac(b ** k - a, p)}`), `Devi prima scrivere ${m(b ** k)} come potenza di ${m(b)}, poi uguagliare gli **esponenti**.`],
            [m(`x=${frac(k + a, p)}`), 'Errore di segno nel portare il termine noto a secondo membro.'],
            [m(`x=${frac(k, p)}`), 'Hai dimenticato il termine noto nell\'esponente.'],
          ], [m(`x=${frac(k - a + 1, p)}`)]),
          hints: [`Scrivi ${m(b ** k)} come potenza di ${m(b)}.`, 'Con la stessa base, uguaglia gli esponenti.'],
          steps: [
            { ask: `Scrivi ${m(b ** k)} come potenza di ${m(b)}:`, options: mc(r, m(`${b}^{${k}}`), [[m(`${b}^{${k + 1}}`), `${m(`${b}^{${k + 1}}=${b ** (k + 1)}`)}.`], [m(`${b}^{${k - 1}}`), `${m(`${b}^{${k - 1}}=${b ** (k - 1)}`)}.`]], [m(`${k}^{${b}}`)]), explain: `${m(`${b ** k}=${b}^{${k}}`)}.` },
            { ask: `Uguagliando gli esponenti si ottiene ${m(`${p === 1 ? '' : p}x${sg(a)}=${k}`)}. Quanto vale $x$?`, options: mc(r, m(frac(k - a, p)), [[m(frac(k + a, p)), 'Errore di segno.']], [m(frac(k - a + 1, p)), m(frac(k - a - 1, p)), m(frac(k - a + 2, p))]), explain: `${m(`x=${frac(k - a, p)}`)}.` },
          ],
          solution: [`${m(`${lhs}=${b}^{${k}}`)}`, `${m(`${p === 1 ? '' : p}x${sg(a)}=${k}`)}`, `${m(`x=${frac(k - a, p)}`)}`],
        };
      },
    },
    {
      id: 'esp-eq-neg',
      level: 1,
      title: 'Esponente negativo',
      make: (r) => {
        const b = pick(r, [2, 3, 5]), k = int(r, 2, 4);
        return {
          text: `Risolvi l'equazione ${m(`${b}^x=\\dfrac{1}{${b ** k}}`)}.`,
          answer: -k,
          tol: 0,
          hints: [R`$\dfrac{1}{a^n}=a^{-n}$.`],
          solution: [`${m(`\\dfrac{1}{${b ** k}}=\\dfrac{1}{${b}^{${k}}}=${b}^{-${k}}`)}`, `${m(`${b}^x=${b}^{-${k}}\\Rightarrow x=-${k}`)}`],
        };
      },
    },
    {
      id: 'esp-eq-basi',
      level: 2,
      title: 'Basi riconducibili',
      make: (r) => {
        const b = pick(r, [2, 3]), i = pick(r, [2, 3]), j = nz(r, 1, 5, i, 2 * i), a = nz(r, -2, 2);
        // (b^i)^(x+a) = b^j  =>  i(x+a) = j  =>  x = j/i - a
        return {
          text: `Risolvi l'equazione ${m(`${b ** i}^{x${sg(a)}}=${b ** j}`)}.`,
          options: mc(r, m(`x=${frac(j - a * i, i)}`), [
            [m(`x=${frac(j + a * i, i)}`), 'Errore di segno isolando $x$.'],
            [m(`x=${frac(i - a * j, j)}`), 'Hai invertito il rapporto tra gli esponenti.'],
            [m(`x=${j - a}`), `Devi scrivere anche ${m(b ** i)} come potenza di ${m(b)}: l'esponente va moltiplicato.`],
          ], [m(`x=${frac(j - a * i + 1, i)}`), m(`x=${frac(j - a * i - 1, i)}`)]),
          hints: [`Scrivi entrambi i membri come potenze di ${m(b)}.`, R`Ricorda $(a^m)^n=a^{mn}$.`],
          solution: [`${m(`(${b}^{${i}})^{x${sg(a)}}=${b}^{${j}}`)}, cioè ${m(`${b}^{${i}(x${sg(a)})}=${b}^{${j}}`)}.`, `${m(`${i}(x${sg(a)})=${j}`)}`, `${m(`x=${frac(j, i)}${sg(-a)}=${frac(j - a * i, i)}`)}`],
        };
      },
    },
    {
      id: 'esp-diseq',
      level: 2,
      title: 'Disequazione esponenziale',
      make: (r) => {
        const b = pick(r, [2, 3, 5]), k = int(r, 1, 4), a = nz(r, -4, 4), small = r() < 0.5, gt = r() < 0.5;
        const base = small ? `\\left(\\dfrac{1}{${b}}\\right)` : `${b}`;
        const rhs = small ? `\\dfrac{1}{${b ** k}}` : `${b ** k}`;
        const dir = gt !== small ? '>' : '<'; // verso finale per x
        const good = m(`x${dir}${k - a}`);
        return {
          text: `Risolvi la disequazione ${m(`${base}^{x${sg(a)}}${gt ? '>' : '<'}${rhs}`)}.`,
          options: mc(r, good, [
            [m(`x${dir === '>' ? '<' : '>'}${k - a}`), small ? 'La base è minore di $1$: passando agli esponenti il verso **si inverte**.' : 'La base è maggiore di $1$: il verso **si conserva**.'],
            [m(`x${dir}${k + a}`), 'Errore di segno isolando $x$.'],
            [m(`x${dir}${small ? -k - a : b ** k - a}`), 'Scrivi il secondo membro come potenza della stessa base prima di confrontare gli esponenti.'],
          ], [m(`x${dir}${k - a + 1}`)]),
          hints: ['Scrivi il secondo membro come potenza della stessa base.', small ? 'Base tra $0$ e $1$: il verso si inverte.' : 'Base maggiore di $1$: il verso si conserva.'],
          steps: [
            { ask: 'La funzione esponenziale con questa base è:', options: choice(r, [[small ? 'decrescente' : 'crescente'], [small ? 'crescente' : 'decrescente', 'Confronta la base con $1$.'], ['costante', 'Solo la base $1$ darebbe una funzione costante.']]), explain: small ? 'Base compresa tra $0$ e $1$: funzione decrescente, il verso si inverte.' : 'Base maggiore di $1$: funzione crescente, il verso si conserva.' },
            { ask: `Il secondo membro è ${m(`${base}^{${k}}`)}. Qual è la disequazione tra gli esponenti?`, options: mc(r, m(`x${sg(a)}${dir}${k}`), [[m(`x${sg(a)}${dir === '>' ? '<' : '>'}${k}`), small ? 'Con base minore di $1$ il verso va invertito.' : 'Con base maggiore di $1$ il verso resta lo stesso.']], [m(`x${sg(a)}${dir}${k + 1}`), m(`x${sg(a)}${dir}${b ** k}`)]), explain: `${m(`x${sg(a)}${dir}${k}`)}, quindi ${good}.` },
          ],
          solution: [`${m(`${rhs}=${base}^{${k}}`)}`, `${small ? 'Base minore di $1$: il verso si inverte.' : 'Base maggiore di $1$: il verso si conserva.'} ${m(`x${sg(a)}${dir}${k}`)}`, good],
        };
      },
    },
    {
      id: 'esp-modello',
      level: 2,
      title: 'Crescita esponenziale',
      make: (r) => {
        const n0 = pick(r, [100, 200, 500, 1000]), T = pick(r, [2, 3, 4, 6]), k = int(r, 2, 5);
        const dimezza = r() < 0.4;
        const n00 = dimezza ? n0 * 2 ** k : n0;
        return {
          text: dimezza
            ? `Una sostanza radioattiva ha tempo di dimezzamento di ${m(T)} anni. Se inizialmente sono presenti ${m(n00)} grammi, quanti grammi restano dopo ${m(T * k)} anni?`
            : `Una colonia di ${m(n0)} batteri raddoppia ogni ${m(T)} ore. Quanti batteri ci sono dopo ${m(T * k)} ore?`,
          answer: dimezza ? n0 : n0 * 2 ** k,
          tol: 0,
          hints: [`In ${T * k} ${dimezza ? 'anni' : 'ore'} avvengono ${k} ${dimezza ? 'dimezzamenti' : 'raddoppi'}.`, dimezza ? R`$N(t)=N_0\cdot\left(\dfrac12\right)^{t/T}$` : R`$N(t)=N_0\cdot2^{\,t/T}$`],
          solution: dimezza ? [`Numero di dimezzamenti: ${m(`\\dfrac{${T * k}}{${T}}=${k}`)}.`, `${m(`N=${n00}\\cdot\\left(\\dfrac12\\right)^{${k}}=\\dfrac{${n00}}{${2 ** k}}=${n0}`)} grammi.`] : [`Numero di raddoppi: ${m(`\\dfrac{${T * k}}{${T}}=${k}`)}.`, `${m(`N=${n0}\\cdot2^{${k}}=${n0 * 2 ** k}`)} batteri.`],
        };
      },
    },
    {
      id: 'esp-eq-sostituzione',
      level: 3,
      title: 'Equazione con sostituzione',
      make: (r) => {
        const b = pick(r, [2, 3]), i = int(r, 0, 2), j = int(r, i + 1, 3), neg = r() < 0.4;
        const t1 = b ** j, t2 = neg ? -(b ** i) : b ** i; // radici in t
        const S = t1 + t2, Pr = t1 * t2;
        const eq = `${b * b}^x${sg(-S, `\\cdot${b}^x`)}${sg(Pr)}=0`.replace(/([+-])\\cdot/, '$1');
        const good = neg ? m(`x=${j}`) : m(`x=${i}\\ \\lor\\ x=${j}`);
        return {
          text: `Risolvi l'equazione ${m(eq)}.`,
          options: mc(r, good, [
            [neg ? m(`x=${i}\\ \\lor\\ x=${j}`) : m(`x=${b ** i}\\ \\lor\\ x=${b ** j}`), neg ? `Il valore ${m(`t=${t2}`)} è negativo: ${m(`${b}^x`)} non può essere negativo, quindi va scartato.` : `Questi sono i valori di ${m(`t=${b}^x`)}: devi ancora ricavare $x$.`],
            [neg ? m(`x=${t1}`) : m(`x=${j}`), neg ? `Questo è il valore di $t$, non di $x$.` : 'Manca una soluzione: entrambi i valori di $t$ sono positivi.'],
            ['Impossibile', 'Almeno un valore di $t$ è positivo: una soluzione esiste.'],
          ], [m(`x=${j + 1}`)]),
          hints: [`Osserva che ${m(`${b * b}^x=(${b}^x)^2`)}: poni ${m(`t=${b}^x`)} con $t>0$.`, 'Risolvi l\'equazione di secondo grado in $t$ e scarta i valori non positivi.'],
          solution: [`Con ${m(`t=${b}^x>0`)}: ${m(`t^2${sg(-S, 't')}${sg(Pr)}=0`)}.`, `${m(`t=${t1}`)} oppure ${m(`t=${t2}`)}${neg ? ' (non accettabile)' : ''}.`, neg ? `${m(`${b}^x=${t1}\\Rightarrow x=${j}`)}` : `${m(`${b}^x=${t2}\\Rightarrow x=${i}`)}; ${m(`${b}^x=${t1}\\Rightarrow x=${j}`)}.`],
        };
      },
    },
    {
      id: 'esp-diseq-sostituzione',
      level: 3,
      title: 'Disequazione con sostituzione',
      make: (r) => {
        const b = pick(r, [2, 3]), i = int(r, 0, 1), j = int(r, i + 1, 3);
        const t1 = b ** i, t2 = b ** j;
        const eq = `${b * b}^x-${t1 + t2}\\cdot${b}^x+${t1 * t2}<0`;
        return {
          text: `Risolvi la disequazione ${m(eq)}.`,
          options: mc(r, m(`${i}<x<${j}`), [
            [m(`${t1}<x<${t2}`), `Questi sono i valori di ${m(`t=${b}^x`)}: devi tornare alla $x$.`],
            [m(`x<${i}\\ \\lor\\ x>${j}`), 'Il trinomio in $t$ è negativo per valori **interni** alle radici.'],
            [m(`x<${j}`), 'Servono entrambe le limitazioni.'],
          ]),
          hints: [`Poni ${m(`t=${b}^x`)}: ottieni una disequazione di secondo grado in $t$.`, `Poi risolvi ${m(`${t1}<${b}^x<${t2}`)}.`],
          solution: [`Con ${m(`t=${b}^x`)}: ${m(`t^2-${t1 + t2}t+${t1 * t2}<0`)}, verificata per ${m(`${t1}<t<${t2}`)}.`, `${m(`${b}^{${i}}<${b}^x<${b}^{${j}}`)}`, `Base maggiore di $1$: ${m(`${i}<x<${j}`)}.`],
        };
      },
    },
    {
      id: 'esp-eq-somma',
      level: 3,
      title: 'Equazione con raccoglimento',
      make: (r) => {
        const b = pick(r, [2, 3]), k = int(r, 1, 3), x0 = int(r, -1, 3);
        // b^(x+k) + b^x = (b^k + 1) b^x0
        const rhsNum = (b ** k + 1) * b ** Math.max(x0, 0), rhsDen = x0 < 0 ? b ** -x0 : 1;
        return {
          text: `Risolvi l'equazione ${m(`${b}^{x+${k}}+${b}^x=${frac(rhsNum, rhsDen)}`)}.`,
          answer: x0,
          tol: 0,
          hints: [`Scrivi ${m(`${b}^{x+${k}}=${b ** k}\\cdot${b}^x`)} e raccogli ${m(`${b}^x`)}.`],
          solution: [`${m(`${b ** k}\\cdot${b}^x+${b}^x=${frac(rhsNum, rhsDen)}`)}`, `${m(`${b}^x\\,(${b ** k}+1)=${frac(rhsNum, rhsDen)}\\Rightarrow${b}^x=${frac(b ** Math.max(x0, 0), rhsDen)}`)}`, `${m(`x=${x0}`)}`],
        };
      },
    },
  ],
};
