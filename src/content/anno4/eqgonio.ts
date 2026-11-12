import { choice, m, mc, pick } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

/** Voce di una banca di quesiti a risposta chiusa: testo, risposta, distrattori con spiegazione, suggerimenti, soluzione. */
type Item = readonly [text: string, ok: string, wrong: readonly (readonly [string, string])[], hints: readonly string[], sol: readonly string[]];
const K = R`\quad(k\in\mathbb Z)`;
const FILL = [R`x=k\pi`, R`x=\dfrac\pi2+k\pi`, R`x=2k\pi`, R`x=\dfrac\pi4+2k\pi`, 'Impossibile'].map((s) => (s === 'Impossibile' ? s : `$${s}$`));

function bank(items: readonly Item[]) {
  return (r: () => number) => {
    const [text, ok, wrong, hints, sol] = pick(r, items);
    return { text, options: mc(r, ok, wrong.map(([a, b]) => [a, b] as [string, string]), FILL), hints: [...hints], solution: [...sol] };
  };
}

export const eqgonio: Unit = {
  id: 'a4-eqgonio',
  year: 4,
  title: 'Equazioni e disequazioni goniometriche',
  summary: 'Equazioni elementari, riconducibili, lineari, omogenee; disequazioni.',
  lessons: [
    {
      id: 'a4-eqg-1',
      title: 'Equazioni goniometriche elementari',
      blocks: [
        { t: 'idea', md: R`Chiedere "per quali angoli il seno vale $\frac12$?" significa cercare i punti della circonferenza goniometrica con ordinata $\frac12$. Sono **due** in ogni giro, e poiché le funzioni sono periodiche, le soluzioni sono **infinite**: si ripetono a ogni giro.` },
        { t: 'def', title: 'Equazioni elementari', md: R`Con $k\in\mathbb Z$ e $\alpha$ un angolo che verifica l'equazione:
- $\sin x=a$ (con $|a|\le1$): $\ x=\alpha+2k\pi\ \lor\ x=\pi-\alpha+2k\pi$
- $\cos x=a$ (con $|a|\le1$): $\ x=\pm\alpha+2k\pi$
- $\tan x=a$ (per ogni $a$): $\ x=\alpha+k\pi$

Se $|a|>1$ le equazioni in seno e coseno sono **impossibili**.` },
        {
          t: 'plot',
          title: 'Le soluzioni di sin x = a',
          caption: R`La retta $y=a$ taglia la sinusoide in infiniti punti: due per ogni periodo (uno solo se $a=\pm1$, nessuno se $|a|>1$).`,
          view: [-7, 7, -1.6, 1.6],
          params: [{ name: 'a', label: 'a', min: -1.25, max: 1.25, step: 0.05, value: 0.5 }],
          draw: (p) => {
            const pts: { k: 'pt'; x: number; y: number }[] = [];
            if (Math.abs(p.a) <= 1) {
              const al = Math.asin(p.a);
              for (let k = -2; k <= 1; k++) for (const x of [al + 2 * k * Math.PI, Math.PI - al + 2 * k * Math.PI]) if (Math.abs(x) < 7) pts.push({ k: 'pt', x, y: p.a });
            }
            return [{ k: 'fn', f: Math.sin }, { k: 'fn', f: () => p.a, dash: true }, ...pts];
          },
          readout: (p) => (Math.abs(p.a) > 1 ? `$|a|>1$: equazione **impossibile**` : `$\\alpha=\\arcsin(${d(p.a)})\\approx${d(Math.asin(p.a))}$: $x=\\alpha+2k\\pi\\ \\lor\\ x=\\pi-\\alpha+2k\\pi$`),
        },
        {
          t: 'ex',
          title: R`Risolvi $2\cos x+1=0$.`,
          steps: [R`Isoliamo il coseno: $\cos x=-\dfrac12$.`, R`Un angolo con coseno $-\dfrac12$ è $\alpha=\dfrac{2\pi}{3}$.`, R`Soluzioni: $x=\pm\dfrac{2\pi}{3}+2k\pi$.`],
        },
        {
          t: 'ex',
          title: R`Risolvi $\sin2x=\dfrac{\sqrt3}{2}$.`,
          steps: [R`Poniamo $t=2x$: $\sin t=\dfrac{\sqrt3}{2}$ dà $t=\dfrac\pi3+2k\pi\ \lor\ t=\dfrac{2\pi}{3}+2k\pi$.`, R`Torniamo a $x$ dividendo **tutto** per $2$ (anche il periodo!): $x=\dfrac\pi6+k\pi\ \lor\ x=\dfrac\pi3+k\pi$.`],
        },
        { t: 'def', title: 'Equazioni riconducibili a elementari', md: R`- **Di secondo grado in una funzione:** si pone $t=\sin x$ (o $\cos x$, $\tan x$), si risolve in $t$ e si scartano i valori non accettabili ($|t|>1$ per seno e coseno).
- **Con funzioni diverse:** si usano le identità ($\sin^2x=1-\cos^2x$, formule di duplicazione…) per ridursi a una sola funzione.
- **Scomponibili:** si porta tutto a primo membro e si usa l'annullamento del prodotto.` },
        { t: 'warn', md: R`Non dividere per $\sin x$ o $\cos x$ senza prima controllare se possono annullarsi: in $\sin x\cos x=\sin x$ dividendo per $\sin x$ si perdono le soluzioni $x=k\pi$. Si raccoglie: $\sin x(\cos x-1)=0$.` },
      ],
    },
    {
      id: 'a4-eqg-2',
      title: 'Equazioni lineari, omogenee e disequazioni',
      blocks: [
        { t: 'idea', md: R`Quando seno e coseno compaiono insieme servono tecniche dedicate. Per le disequazioni, invece, la via più sicura è sempre **guardare la circonferenza goniometrica** (o il grafico) e leggere su quali archi la condizione è soddisfatta.` },
        { t: 'def', title: 'Equazioni lineari in seno e coseno', md: R`$a\sin x+b\cos x=c$. Metodi:
- **angolo aggiunto:** si riscrive il primo membro come $r\sin(x+\varphi)$ e si risolve l'equazione elementare $\sin(x+\varphi)=\dfrac cr$;
- **metodo grafico/algebrico:** si pone $X=\cos x$, $Y=\sin x$ e si risolve il sistema con $X^2+Y^2=1$;
- **formule parametriche** con $t=\tan\dfrac x2$ (controllando a parte $x=\pi+2k\pi$).

Se $c=0$ basta dividere per $\cos x$ (che non può annullarsi insieme a $\sin x$): $\tan x=-\dfrac ba$.` },
        {
          t: 'ex',
          title: R`Risolvi $\sin x+\cos x=1$.`,
          steps: [R`Angolo aggiunto: $\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)$.`, R`$\sin\left(x+\dfrac\pi4\right)=\dfrac{1}{\sqrt2}=\dfrac{\sqrt2}{2}$.`, R`$x+\dfrac\pi4=\dfrac\pi4+2k\pi\ \lor\ x+\dfrac\pi4=\dfrac{3\pi}{4}+2k\pi$.`, R`$x=2k\pi\ \lor\ x=\dfrac\pi2+2k\pi$.`],
        },
        { t: 'def', title: 'Equazioni omogenee di secondo grado', md: R`$a\sin^2x+b\sin x\cos x+c\cos^2x=0$. Se $a\neq0$, $\cos x=0$ non è soluzione: si divide per $\cos^2x$ e si ottiene $$a\tan^2x+b\tan x+c=0$$ Se il secondo membro è un numero $d\neq0$, lo si scrive come $d(\sin^2x+\cos^2x)$.` },
        { t: 'def', title: 'Disequazioni goniometriche', md: R`1. Si risolve l'**equazione associata** per trovare gli angoli di confine.
2. Sulla circonferenza goniometrica (o sul grafico) si individua l'arco in cui la disequazione è verificata.
3. Si aggiunge la periodicità.

Esempio: $\sin x>\dfrac12$ è verificata dove l'ordinata supera $\frac12$: $\dfrac\pi6+2k\pi<x<\dfrac{5\pi}{6}+2k\pi$.` },
        {
          t: 'plot',
          title: 'Disequazione sin x > a',
          caption: R`La parte di sinusoide sopra la retta $y=a$ individua gli intervalli soluzione.`,
          view: [-0.5, 6.8, -1.6, 1.6],
          params: [{ name: 'a', label: 'a', min: -0.95, max: 0.95, step: 0.05, value: 0.5 }],
          draw: (p) => {
            const al = Math.asin(p.a);
            const x1 = al >= 0 ? al : al + 2 * Math.PI, x2 = Math.PI - al;
            return [{ k: 'fn', f: Math.sin }, { k: 'fn', f: () => p.a, dash: true }, { k: 'pt', x: x1, y: p.a }, { k: 'pt', x: x2, y: p.a }];
          },
          readout: (p) => {
            const al = Math.asin(p.a);
            return p.a >= 0 ? `In $[0;2\\pi]$: $${d(al)}<x<${d(Math.PI - al)}$` : `In $[0;2\\pi]$: $0\\le x<${d(Math.PI - al)}\\ \\lor\\ ${d(al + 2 * Math.PI)}<x\\le2\\pi$`;
          },
        },
        {
          t: 'ex',
          title: R`Risolvi $2\cos x-1\le0$ in $[0;2\pi]$.`,
          steps: [R`$\cos x\le\dfrac12$. Equazione associata: $\cos x=\dfrac12$ per $x=\dfrac\pi3$ e $x=\dfrac{5\pi}{3}$.`, R`Il coseno (ascissa) è minore o uguale a $\dfrac12$ sull'arco che va da $\dfrac\pi3$ a $\dfrac{5\pi}{3}$ passando per $\pi$.`, R`Soluzione: $\dfrac\pi3\le x\le\dfrac{5\pi}{3}$.`],
        },
        { t: 'warn', md: R`Per la **tangente** ricordati degli asintoti: $\tan x>1$ in $[0;\pi)$ dà $\dfrac\pi4<x<\dfrac\pi2$, con $\dfrac\pi2$ **escluso** perché lì la tangente non esiste.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'eqg-seno',
      level: 1,
      title: 'Equazione elementare in seno',
      make: (r) => {
        const [v, a, b] = pick(r, [
          [R`\dfrac12`, R`\dfrac\pi6`, R`\dfrac{5\pi}{6}`],
          [R`\dfrac{\sqrt2}{2}`, R`\dfrac\pi4`, R`\dfrac{3\pi}{4}`],
          [R`\dfrac{\sqrt3}{2}`, R`\dfrac\pi3`, R`\dfrac{2\pi}{3}`],
          [R`-\dfrac12`, R`-\dfrac\pi6`, R`\dfrac{7\pi}{6}`],
          [R`-\dfrac{\sqrt3}{2}`, R`-\dfrac\pi3`, R`\dfrac{4\pi}{3}`],
        ] as const);
        const good = `$x=${a}+2k\\pi\\ \\lor\\ x=${b}+2k\\pi$`;
        const pm = `$x=\\pm${a.replace('-', '')}+2k\\pi$`;
        return {
          text: `Risolvi l'equazione ${m(`\\sin x=${v}`)}.`,
          options: mc(r, good, [
            [`$x=${a}+2k\\pi$`, 'Manca una famiglia di soluzioni: in ogni giro ci sono **due** angoli con lo stesso seno (supplementari).'],
            [pm, 'Il $\\pm$ vale per il **coseno**. Per il seno la seconda soluzione è $\\pi-\\alpha$.'],
            [`$x=${a}+k\\pi\\ \\lor\\ x=${b}+k\\pi$`, 'Il periodo del seno è $2\\pi$, non $\\pi$.'],
          ], FILL),
          hints: ['Trova un angolo $\\alpha$ con quel seno.', R`Le soluzioni sono $x=\alpha+2k\pi$ e $x=\pi-\alpha+2k\pi$.`],
          steps: [
            { ask: `Qual è un angolo $\\alpha$ con ${m(`\\sin\\alpha=${v}`)}?`, options: mc(r, m(a), [], [R`\dfrac\pi6`, R`\dfrac\pi4`, R`\dfrac\pi3`, R`-\dfrac\pi6`, R`-\dfrac\pi3`, R`\dfrac\pi2`].map((x) => m(x))), explain: `${m(`\\alpha=${a}`)}.` },
            { ask: 'Qual è l\'altra soluzione nello stesso giro?', options: choice(r, [[R`$\pi-\alpha$`, 'Giusto: angoli supplementari hanno lo stesso seno.'], [R`$-\alpha$`, 'L\'opposto ha lo stesso **coseno**, non lo stesso seno.'], [R`$\pi+\alpha$`, R`$\sin(\pi+\alpha)=-\sin\alpha$.`]]), explain: `${m(`\\pi-\\alpha=${b}`)}. Soluzioni: ${good}.` },
          ],
          solution: [`Un angolo con seno ${m(v)} è ${m(a)}.`, `L'altro è il supplementare: ${m(b)}.`, `${good}${K ? '' : ''}, con $k\\in\\mathbb Z$.`],
        };
      },
    },
    {
      id: 'eqg-coseno',
      level: 1,
      title: 'Equazione elementare in coseno',
      make: (r) => {
        const [v, a] = pick(r, [
          [R`\dfrac12`, R`\dfrac\pi3`],
          [R`\dfrac{\sqrt2}{2}`, R`\dfrac\pi4`],
          [R`\dfrac{\sqrt3}{2}`, R`\dfrac\pi6`],
          [R`-\dfrac12`, R`\dfrac{2\pi}{3}`],
          [R`-\dfrac{\sqrt2}{2}`, R`\dfrac{3\pi}{4}`],
          [R`-\dfrac{\sqrt3}{2}`, R`\dfrac{5\pi}{6}`],
        ] as const);
        const good = `$x=\\pm${a}+2k\\pi$`;
        return {
          text: `Risolvi l'equazione ${m(`\\cos x=${v}`)}.`,
          options: mc(r, good, [
            [`$x=${a}+2k\\pi$`, 'Manca la soluzione opposta: angoli opposti hanno lo stesso coseno.'],
            [`$x=${a}+2k\\pi\\ \\lor\\ x=\\pi-${a}+2k\\pi$`, 'Questa è la regola del **seno**. Per il coseno le soluzioni sono $\\pm\\alpha$.'],
            [`$x=\\pm${a}+k\\pi$`, 'Il periodo del coseno è $2\\pi$.'],
          ], FILL),
          hints: ['Trova un angolo $\\alpha$ con quel coseno.', R`Le soluzioni sono $x=\pm\alpha+2k\pi$.`],
          solution: [`Un angolo con coseno ${m(v)} è ${m(a)}.`, `Angoli opposti hanno lo stesso coseno: ${good}, con $k\\in\\mathbb Z$.`],
        };
      },
    },
    {
      id: 'eqg-tangente',
      level: 1,
      title: 'Equazione elementare in tangente',
      make: (r) => {
        const [v, a] = pick(r, [
          ['1', R`\dfrac\pi4`],
          [R`\sqrt3`, R`\dfrac\pi3`],
          [R`\dfrac{\sqrt3}{3}`, R`\dfrac\pi6`],
          ['-1', R`-\dfrac\pi4`],
          [R`-\sqrt3`, R`-\dfrac\pi3`],
        ] as const);
        const good = `$x=${a}+k\\pi$`;
        return {
          text: `Risolvi l'equazione ${m(`\\tan x=${v}`)}.`,
          options: mc(r, good, [
            [`$x=${a}+2k\\pi$`, 'La tangente ha periodo $\\pi$: così perdi metà delle soluzioni.'],
            [`$x=\\pm${a.replace('-', '')}+k\\pi$`, 'Il $\\pm$ non serve (e qui introduce soluzioni false): la tangente è dispari.'],
          ], FILL),
          hints: ['Trova un angolo con quella tangente.', 'La tangente ha periodo $\\pi$.'],
          solution: [`${m(`\\tan\\left(${a}\\right)=${v}`)}.`, `Periodo $\\pi$: ${good}, con $k\\in\\mathbb Z$.`],
        };
      },
    },
    {
      id: 'eqg-numero',
      level: 1,
      title: 'Numero di soluzioni',
      make: (r) => {
        const [eq, n, why] = pick(r, [
          [R`\sin x=\dfrac13`, 2, 'la retta $y=\\frac13$ taglia la sinusoide due volte in un periodo'],
          [R`\cos x=-0{,}7`, 2, 'ci sono due punti della circonferenza con ascissa $-0{,}7$'],
          [R`\sin x=1`, 1, R`solo $x=\dfrac\pi2$`],
          [R`\cos x=-1`, 1, R`solo $x=\pi$`],
          [R`\sin x=2`, 0, 'il seno non supera mai $1$'],
          [R`\cos x=-\dfrac32`, 0, 'il coseno è sempre compreso tra $-1$ e $1$'],
          [R`\tan x=5`, 2, 'la tangente assume ogni valore una volta per ogni periodo $\\pi$'],
          [R`\sin x=0`, 2, R`$x=0$ e $x=\pi$`],
        ] as const);
        return {
          text: `Quante soluzioni ha l'equazione ${m(eq)} nell'intervallo ${m('[0;2\\pi)')}?`,
          answer: n,
          tol: 0,
          hints: ['Pensa alla circonferenza goniometrica o al grafico della funzione.', 'Controlla prima se il valore è raggiungibile.'],
          solution: [`Le soluzioni sono ${m(n)}: ${why}.`],
        };
      },
    },
    {
      id: 'eqg-argomento',
      level: 2,
      title: 'Equazione con argomento multiplo',
      make: bank([
        [R`Risolvi l'equazione $\sin2x=1$.`, R`$x=\dfrac\pi4+k\pi$`, [[R`$x=\dfrac\pi2+2k\pi$`, 'Questa è la soluzione per $2x$: bisogna ancora dividere per $2$.'], [R`$x=\dfrac\pi4+2k\pi$`, 'Dividendo per $2$ va diviso anche il periodo.']], ['Poni $t=2x$ e risolvi $\\sin t=1$.', 'Poi dividi tutto per $2$, periodo compreso.'], [R`$2x=\dfrac\pi2+2k\pi$`, R`$x=\dfrac\pi4+k\pi$`]],
        [R`Risolvi l'equazione $\cos3x=0$.`, R`$x=\dfrac\pi6+k\dfrac\pi3$`, [[R`$x=\dfrac\pi2+k\pi$`, 'Questa è la soluzione per $3x$: bisogna dividere per $3$.'], [R`$x=\dfrac\pi6+k\pi$`, 'Va diviso per $3$ anche il periodo.']], ['$\\cos t=0$ per $t=\\frac\\pi2+k\\pi$.', 'Dividi tutto per $3$.'], [R`$3x=\dfrac\pi2+k\pi$`, R`$x=\dfrac\pi6+k\dfrac\pi3$`]],
        [R`Risolvi l'equazione $\tan2x=1$.`, R`$x=\dfrac\pi8+k\dfrac\pi2$`, [[R`$x=\dfrac\pi4+k\pi$`, 'Questa è la soluzione per $2x$.'], [R`$x=\dfrac\pi8+k\pi$`, 'Anche il periodo va diviso per $2$.']], ['$\\tan t=1$ per $t=\\frac\\pi4+k\\pi$.'], [R`$2x=\dfrac\pi4+k\pi$`, R`$x=\dfrac\pi8+k\dfrac\pi2$`]],
        [R`Risolvi l'equazione $\sin\dfrac x2=1$.`, R`$x=\pi+4k\pi$`, [[R`$x=\dfrac\pi2+2k\pi$`, 'Questa è la soluzione per $\\frac x2$: bisogna moltiplicare per $2$.'], [R`$x=\pi+2k\pi$`, 'Moltiplicando per $2$ raddoppia anche il periodo.']], ['Poni $t=\\frac x2$.', 'Poi moltiplica tutto per $2$.'], [R`$\dfrac x2=\dfrac\pi2+2k\pi$`, R`$x=\pi+4k\pi$`]],
        [R`Risolvi l'equazione $\cos2x=1$.`, R`$x=k\pi$`, [[R`$x=2k\pi$`, 'Questa è la soluzione per $2x$.'], [R`$x=\dfrac\pi2+k\pi$`, 'Controlla: $\\cos t=1$ per $t=2k\\pi$.']], ['$\\cos t=1$ per $t=2k\\pi$.'], [R`$2x=2k\pi$`, R`$x=k\pi$`]],
      ]),
    },
    {
      id: 'eqg-secondo',
      level: 2,
      title: 'Equazione di secondo grado in una funzione',
      make: bank([
        [R`Risolvi in $[0;2\pi)$ l'equazione $2\sin^2x-3\sin x+1=0$.`, R`$x=\dfrac\pi6,\ \dfrac\pi2,\ \dfrac{5\pi}{6}$`, [[R`$x=\dfrac\pi6,\ \dfrac\pi2$`, R`$\sin x=\frac12$ ha due soluzioni nel giro: manca $\frac{5\pi}{6}$.`], [R`$x=\dfrac12,\ 1$`, 'Questi sono i valori di $\\sin x$, non gli angoli.']], ['Poni $t=\\sin x$: $2t^2-3t+1=0$.', 'Risolvi $\\sin x=1$ e $\\sin x=\\frac12$.'], [R`$t=\sin x$: $2t^2-3t+1=0\Rightarrow t=1\ \lor\ t=\dfrac12$.`, R`$\sin x=1\Rightarrow x=\dfrac\pi2$; $\ \sin x=\dfrac12\Rightarrow x=\dfrac\pi6,\dfrac{5\pi}{6}$.`]],
        [R`Risolvi in $[0;2\pi)$ l'equazione $2\cos^2x-\cos x-1=0$.`, R`$x=0,\ \dfrac{2\pi}{3},\ \dfrac{4\pi}{3}$`, [[R`$x=0,\ \dfrac{2\pi}{3}$`, R`$\cos x=-\frac12$ ha due soluzioni nel giro: manca $\frac{4\pi}{3}$.`], [R`$x=0,\ \dfrac{\pi}{3},\ \dfrac{5\pi}{3}$`, 'Attenzione al segno: la seconda radice è $-\\frac12$.']], ['Poni $t=\\cos x$: $2t^2-t-1=0$.'], [R`$t=1\ \lor\ t=-\dfrac12$.`, R`$\cos x=1\Rightarrow x=0$; $\ \cos x=-\dfrac12\Rightarrow x=\dfrac{2\pi}{3},\dfrac{4\pi}{3}$.`]],
        [R`Risolvi in $[0;2\pi)$ l'equazione $\sin^2x-\sin x-2=0$.`, R`$x=\dfrac{3\pi}{2}$`, [[R`$x=\dfrac\pi2$`, 'La radice accettabile è $t=-1$, non $t=1$.'], ['Impossibile', 'Una delle due radici, $t=-1$, è accettabile.']], ['Poni $t=\\sin x$ e scarta i valori con $|t|>1$.'], [R`$t^2-t-2=0\Rightarrow t=2\ \lor\ t=-1$.`, R`$t=2$ non è accettabile; $\sin x=-1\Rightarrow x=\dfrac{3\pi}{2}$.`]],
        [R`Risolvi in $[0;2\pi)$ l'equazione $2\cos^2x+\sin x-1=0$.`, R`$x=\dfrac\pi2,\ \dfrac{7\pi}{6},\ \dfrac{11\pi}{6}$`, [[R`$x=\dfrac\pi2,\ \dfrac{\pi}{6},\ \dfrac{5\pi}{6}$`, 'Errore di segno: la seconda radice è $\\sin x=-\\frac12$.'], [R`$x=\dfrac\pi2$`, 'Mancano le soluzioni di $\\sin x=-\\frac12$.']], ['Usa $\\cos^2x=1-\\sin^2x$ per avere solo il seno.'], [R`$2(1-\sin^2x)+\sin x-1=0\Rightarrow2\sin^2x-\sin x-1=0$.`, R`$\sin x=1\ \lor\ \sin x=-\dfrac12$: $x=\dfrac\pi2,\dfrac{7\pi}{6},\dfrac{11\pi}{6}$.`]],
        [R`Risolvi in $[0;2\pi)$ l'equazione $\tan^2x-1=0$.`, R`$x=\dfrac\pi4,\ \dfrac{3\pi}{4},\ \dfrac{5\pi}{4},\ \dfrac{7\pi}{4}$`, [[R`$x=\dfrac\pi4,\ \dfrac{5\pi}{4}$`, 'Hai considerato solo $\\tan x=1$: c\'è anche $\\tan x=-1$.'], [R`$x=\dfrac\pi4,\ \dfrac{3\pi}{4}$`, 'La tangente ha periodo $\\pi$: nel giro ogni valore è assunto due volte.']], ['$\\tan x=\\pm1$.'], [R`$\tan x=1\Rightarrow x=\dfrac\pi4,\dfrac{5\pi}{4}$; $\ \tan x=-1\Rightarrow x=\dfrac{3\pi}{4},\dfrac{7\pi}{4}$.`]],
      ]),
    },
    {
      id: 'eqg-scomponibile',
      level: 2,
      title: 'Equazione scomponibile',
      make: bank([
        [R`Risolvi l'equazione $\sin x\cos x=\sin x$.`, R`$x=k\pi$`, [[R`$x=2k\pi$`, 'Hai diviso per $\\sin x$ perdendo le soluzioni di $\\sin x=0$.'], [R`$x=\dfrac\pi2+k\pi$`, 'Raccogli $\\sin x$: i fattori sono $\\sin x$ e $\\cos x-1$.']], ['Porta tutto a primo membro e raccogli $\\sin x$.'], [R`$\sin x(\cos x-1)=0$.`, R`$\sin x=0\Rightarrow x=k\pi$; $\cos x=1\Rightarrow x=2k\pi$ (già comprese).`, R`Soluzione: $x=k\pi$.`]],
        [R`Risolvi l'equazione $\sin2x=\cos x$ in $[0;2\pi)$.`, R`$x=\dfrac\pi6,\ \dfrac\pi2,\ \dfrac{5\pi}{6},\ \dfrac{3\pi}{2}$`, [[R`$x=\dfrac\pi6,\ \dfrac{5\pi}{6}$`, 'Hai diviso per $\\cos x$ perdendo le soluzioni di $\\cos x=0$.'], [R`$x=\dfrac\pi2,\ \dfrac{3\pi}{2}$`, 'Manca il fattore $2\\sin x-1=0$.']], ['Usa $\\sin2x=2\\sin x\\cos x$ e raccogli $\\cos x$.'], [R`$2\sin x\cos x-\cos x=0\Rightarrow\cos x(2\sin x-1)=0$.`, R`$\cos x=0\Rightarrow x=\dfrac\pi2,\dfrac{3\pi}{2}$; $\ \sin x=\dfrac12\Rightarrow x=\dfrac\pi6,\dfrac{5\pi}{6}$.`]],
        [R`Risolvi l'equazione $2\sin^2x=\sin x$ in $[0;2\pi)$.`, R`$x=0,\ \dfrac\pi6,\ \dfrac{5\pi}{6},\ \pi$`, [[R`$x=\dfrac\pi6,\ \dfrac{5\pi}{6}$`, 'Hai diviso per $\\sin x$ perdendo $x=0$ e $x=\\pi$.'], [R`$x=0,\ \pi$`, 'Manca il fattore $2\\sin x-1=0$.']], ['Porta tutto a primo membro e raccogli $\\sin x$.'], [R`$\sin x(2\sin x-1)=0$.`, R`$\sin x=0\Rightarrow x=0,\pi$; $\ \sin x=\dfrac12\Rightarrow x=\dfrac\pi6,\dfrac{5\pi}{6}$.`]],
      ]),
    },
    {
      id: 'eqg-omogenea',
      level: 2,
      title: 'Equazione omogenea',
      make: bank([
        [R`Risolvi l'equazione $\sin x-\sqrt3\cos x=0$.`, R`$x=\dfrac\pi3+k\pi$`, [[R`$x=\dfrac\pi3+2k\pi$`, 'La tangente ha periodo $\\pi$.'], [R`$x=\dfrac\pi6+k\pi$`, R`$\tan x=\sqrt3$ corrisponde a $\dfrac\pi3$.`]], ['Dividi per $\\cos x$ (che qui non può essere nullo).'], [R`$\tan x=\sqrt3$.`, R`$x=\dfrac\pi3+k\pi$.`]],
        [R`Risolvi l'equazione $\sin x+\cos x=0$.`, R`$x=-\dfrac\pi4+k\pi$`, [[R`$x=\dfrac\pi4+k\pi$`, 'Errore di segno: $\\tan x=-1$.'], [R`$x=-\dfrac\pi4+2k\pi$`, 'La tangente ha periodo $\\pi$.']], ['Dividi per $\\cos x$.'], [R`$\tan x=-1$.`, R`$x=-\dfrac\pi4+k\pi$.`]],
        [R`Risolvi l'equazione $\sin^2x-3\cos^2x=0$.`, R`$x=\pm\dfrac\pi3+k\pi$`, [[R`$x=\dfrac\pi3+k\pi$`, R`$\tan^2x=3$ dà $\tan x=\pm\sqrt3$: manca il caso negativo.`], [R`$x=\pm\dfrac\pi6+k\pi$`, R`$\tan x=\sqrt3$ corrisponde a $\dfrac\pi3$.`]], ['Dividi per $\\cos^2x$.'], [R`$\tan^2x=3\Rightarrow\tan x=\pm\sqrt3$.`, R`$x=\pm\dfrac\pi3+k\pi$.`]],
        [R`Risolvi l'equazione $\sin^2x-\sin x\cos x=0$.`, R`$x=k\pi\ \lor\ x=\dfrac\pi4+k\pi$`, [[R`$x=\dfrac\pi4+k\pi$`, 'Dividendo per $\\sin x$ hai perso le soluzioni di $\\sin x=0$.'], [R`$x=k\pi$`, 'Manca il fattore $\\sin x-\\cos x=0$.']], ['Raccogli $\\sin x$.'], [R`$\sin x(\sin x-\cos x)=0$.`, R`$\sin x=0\Rightarrow x=k\pi$; $\ \tan x=1\Rightarrow x=\dfrac\pi4+k\pi$.`]],
      ]),
    },
    {
      id: 'eqg-diseq',
      level: 2,
      title: 'Disequazione elementare',
      make: bank([
        [R`Risolvi in $[0;2\pi]$ la disequazione $\sin x>\dfrac12$.`, R`$\dfrac\pi6<x<\dfrac{5\pi}{6}$`, [[R`$x>\dfrac\pi6$`, 'Il seno non è crescente su tutto l\'intervallo: guarda la circonferenza.'], [R`$0\le x<\dfrac\pi6\ \lor\ \dfrac{5\pi}{6}<x\le2\pi$`, 'Questa è la soluzione di $\\sin x<\\frac12$.']], ['Risolvi $\\sin x=\\frac12$ e guarda dove l\'ordinata è maggiore.'], [R`$\sin x=\dfrac12$ per $x=\dfrac\pi6$ e $x=\dfrac{5\pi}{6}$.`, R`L'ordinata supera $\dfrac12$ sull'arco compreso: $\dfrac\pi6<x<\dfrac{5\pi}{6}$.`]],
        [R`Risolvi in $[0;2\pi]$ la disequazione $\cos x<\dfrac12$.`, R`$\dfrac\pi3<x<\dfrac{5\pi}{3}$`, [[R`$0\le x<\dfrac\pi3\ \lor\ \dfrac{5\pi}{3}<x\le2\pi$`, 'Questa è la soluzione di $\\cos x>\\frac12$.'], [R`$x<\dfrac\pi3$`, 'Il coseno è decrescente solo fino a $\\pi$: usa la circonferenza.']], ['Risolvi $\\cos x=\\frac12$ e guarda dove l\'ascissa è minore.'], [R`$\cos x=\dfrac12$ per $x=\dfrac\pi3$ e $x=\dfrac{5\pi}{3}$.`, R`L'ascissa è minore di $\dfrac12$ sull'arco che passa per $\pi$: $\dfrac\pi3<x<\dfrac{5\pi}{3}$.`]],
        [R`Risolvi in $[0;2\pi]$ la disequazione $\sin x\le-\dfrac{\sqrt2}{2}$.`, R`$\dfrac{5\pi}{4}\le x\le\dfrac{7\pi}{4}$`, [[R`$\dfrac{\pi}{4}\le x\le\dfrac{3\pi}{4}$`, 'Questi sono gli angoli con seno **positivo** maggiore di $\\frac{\\sqrt2}{2}$.'], [R`$x\le\dfrac{5\pi}{4}$`, 'Guarda la circonferenza: serve un arco nel terzo e quarto quadrante.']], ['Gli angoli di confine sono nel terzo e quarto quadrante.'], [R`$\sin x=-\dfrac{\sqrt2}{2}$ per $x=\dfrac{5\pi}{4}$ e $x=\dfrac{7\pi}{4}$.`, R`L'ordinata è minore o uguale sull'arco compreso: $\dfrac{5\pi}{4}\le x\le\dfrac{7\pi}{4}$.`]],
        [R`Risolvi in $[0;2\pi]$ la disequazione $2\cos x+1\ge0$.`, R`$0\le x\le\dfrac{2\pi}{3}\ \lor\ \dfrac{4\pi}{3}\le x\le2\pi$`, [[R`$\dfrac{2\pi}{3}\le x\le\dfrac{4\pi}{3}$`, 'Questa è la soluzione di $\\cos x\\le-\\frac12$.'], [R`$0\le x\le\dfrac{2\pi}{3}$`, 'Manca l\'arco del quarto (e terzo) quadrante vicino a $2\\pi$.']], ['Isola: $\\cos x\\ge-\\frac12$.'], [R`$\cos x=-\dfrac12$ per $x=\dfrac{2\pi}{3}$ e $x=\dfrac{4\pi}{3}$.`, R`L'ascissa è maggiore o uguale a $-\dfrac12$ fuori dall'arco che passa per $\pi$.`]],
      ]),
    },
    {
      id: 'eqg-diseq-tan',
      level: 3,
      title: 'Disequazione con la tangente',
      make: bank([
        [R`Risolvi in $[0;\pi)$ la disequazione $\tan x>1$.`, R`$\dfrac\pi4<x<\dfrac\pi2$`, [[R`$x>\dfrac\pi4$`, R`Oltre $\dfrac\pi2$ la tangente è negativa.`], [R`$\dfrac\pi4<x\le\dfrac\pi2$`, R`In $\dfrac\pi2$ la tangente non esiste: va escluso.`]], ['Nel primo quadrante la tangente è crescente; ricorda l\'asintoto.'], [R`$\tan x=1$ per $x=\dfrac\pi4$.`, R`La tangente cresce fino all'asintoto $x=\dfrac\pi2$: $\dfrac\pi4<x<\dfrac\pi2$.`]],
        [R`Risolvi in $[0;\pi)$ la disequazione $\tan x\le\sqrt3$.`, R`$0\le x\le\dfrac\pi3\ \lor\ \dfrac\pi2<x<\pi$`, [[R`$0\le x\le\dfrac\pi3$`, 'Nel secondo quadrante la tangente è negativa, quindi minore di $\\sqrt3$: manca quell\'intervallo.'], [R`$\dfrac\pi3\le x<\dfrac\pi2$`, 'Questa è la soluzione di $\\tan x\\ge\\sqrt3$.']], ['Considera separatamente primo e secondo quadrante.'], [R`Nel primo quadrante: $0\le x\le\dfrac\pi3$.`, R`Nel secondo quadrante la tangente è negativa: tutto $\dfrac\pi2<x<\pi$ è soluzione.`]],
        [R`Risolvi in $[0;\pi)$ la disequazione $\tan x<-1$.`, R`$\dfrac\pi2<x<\dfrac{3\pi}{4}$`, [[R`$\dfrac{3\pi}{4}<x<\pi$`, 'In questo intervallo la tangente è compresa tra $-1$ e $0$.'], [R`$x<\dfrac{3\pi}{4}$`, 'Nel primo quadrante la tangente è positiva.']], ['$\\tan x=-1$ per $x=\\frac{3\\pi}{4}$.'], [R`$\tan x=-1$ per $x=\dfrac{3\pi}{4}$.`, R`Subito dopo l'asintoto la tangente parte da $-\infty$ e cresce: $\dfrac\pi2<x<\dfrac{3\pi}{4}$.`]],
      ]),
    },
    {
      id: 'eqg-lineare',
      level: 3,
      title: 'Equazione lineare in seno e coseno',
      make: bank([
        [R`Risolvi l'equazione $\sin x+\cos x=1$.`, R`$x=2k\pi\ \lor\ x=\dfrac\pi2+2k\pi$`, [[R`$x=\dfrac\pi4+2k\pi$`, 'Dopo l\'angolo aggiunto bisogna ancora sottrarre $\\frac\\pi4$.'], [R`$x=\dfrac\pi2+2k\pi$`, 'Manca una famiglia di soluzioni: verifica $x=0$.']], [R`Scrivi il primo membro come $\sqrt2\sin\left(x+\frac\pi4\right)$.`], [R`$\sin\left(x+\dfrac\pi4\right)=\dfrac{\sqrt2}{2}$.`, R`$x+\dfrac\pi4=\dfrac\pi4+2k\pi\ \lor\ x+\dfrac\pi4=\dfrac{3\pi}{4}+2k\pi$.`, R`$x=2k\pi\ \lor\ x=\dfrac\pi2+2k\pi$.`]],
        [R`Risolvi l'equazione $\sqrt3\sin x+\cos x=2$.`, R`$x=\dfrac\pi3+2k\pi$`, [[R`$x=\dfrac\pi2+2k\pi$`, 'Questa è la soluzione per $x+\\frac\\pi6$.'], [R`$x=\dfrac\pi6+2k\pi$`, 'Controlla l\'angolo aggiunto: $\\varphi=\\frac\\pi6$ va sottratto da $\\frac\\pi2$.']], [R`$\sqrt3\sin x+\cos x=2\sin\left(x+\frac\pi6\right)$.`], [R`$2\sin\left(x+\dfrac\pi6\right)=2\Rightarrow\sin\left(x+\dfrac\pi6\right)=1$.`, R`$x+\dfrac\pi6=\dfrac\pi2+2k\pi\Rightarrow x=\dfrac\pi3+2k\pi$.`]],
        [R`Risolvi l'equazione $\sin x-\cos x=\sqrt2$.`, R`$x=\dfrac{3\pi}{4}+2k\pi$`, [[R`$x=\dfrac\pi2+2k\pi$`, 'Questa è la soluzione per $x-\\frac\\pi4$.'], [R`$x=\dfrac{\pi}{4}+2k\pi$`, 'L\'angolo aggiunto è $-\\frac\\pi4$: va **sommato** $\\frac\\pi4$ a $\\frac\\pi2$.']], [R`$\sin x-\cos x=\sqrt2\sin\left(x-\frac\pi4\right)$.`], [R`$\sin\left(x-\dfrac\pi4\right)=1$.`, R`$x-\dfrac\pi4=\dfrac\pi2+2k\pi\Rightarrow x=\dfrac{3\pi}{4}+2k\pi$.`]],
        [R`Risolvi l'equazione $\sin x+\cos x=2$.`, 'Impossibile', [[R`$x=\dfrac\pi4+2k\pi$`, R`In $\dfrac\pi4$ la somma vale $\sqrt2\approx1{,}41$, non $2$.`], [R`$x=\dfrac\pi2+2k\pi$`, 'Lì la somma vale $1$.']], [R`Il massimo di $\sin x+\cos x$ è $\sqrt2$.`], [R`$\sin x+\cos x=\sqrt2\sin\left(x+\dfrac\pi4\right)\le\sqrt2<2$.`, 'L\'equazione è impossibile.']],
      ]),
    },
  ],
};
