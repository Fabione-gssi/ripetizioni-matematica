import { choice, frac, int, m, mc, nz, pick, shuffle } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

/** Angoli notevoli: gradi, radianti (LaTeX), seno, coseno, tangente (LaTeX; '' = non definita). */
export const NOTABLE: readonly (readonly [number, string, string, string, string])[] = [
  [0, '0', '0', '1', '0'],
  [30, R`\dfrac{\pi}{6}`, R`\dfrac12`, R`\dfrac{\sqrt3}{2}`, R`\dfrac{\sqrt3}{3}`],
  [45, R`\dfrac{\pi}{4}`, R`\dfrac{\sqrt2}{2}`, R`\dfrac{\sqrt2}{2}`, '1'],
  [60, R`\dfrac{\pi}{3}`, R`\dfrac{\sqrt3}{2}`, R`\dfrac12`, R`\sqrt3`],
  [90, R`\dfrac{\pi}{2}`, '1', '0', ''],
  [120, R`\dfrac{2\pi}{3}`, R`\dfrac{\sqrt3}{2}`, R`-\dfrac12`, R`-\sqrt3`],
  [135, R`\dfrac{3\pi}{4}`, R`\dfrac{\sqrt2}{2}`, R`-\dfrac{\sqrt2}{2}`, '-1'],
  [150, R`\dfrac{5\pi}{6}`, R`\dfrac12`, R`-\dfrac{\sqrt3}{2}`, R`-\dfrac{\sqrt3}{3}`],
  [180, R`\pi`, '0', '-1', '0'],
  [210, R`\dfrac{7\pi}{6}`, R`-\dfrac12`, R`-\dfrac{\sqrt3}{2}`, R`\dfrac{\sqrt3}{3}`],
  [225, R`\dfrac{5\pi}{4}`, R`-\dfrac{\sqrt2}{2}`, R`-\dfrac{\sqrt2}{2}`, '1'],
  [240, R`\dfrac{4\pi}{3}`, R`-\dfrac{\sqrt3}{2}`, R`-\dfrac12`, R`\sqrt3`],
  [270, R`\dfrac{3\pi}{2}`, '-1', '0', ''],
  [300, R`\dfrac{5\pi}{3}`, R`-\dfrac{\sqrt3}{2}`, R`\dfrac12`, R`-\sqrt3`],
  [315, R`\dfrac{7\pi}{4}`, R`-\dfrac{\sqrt2}{2}`, R`\dfrac{\sqrt2}{2}`, '-1'],
  [330, R`\dfrac{11\pi}{6}`, R`-\dfrac12`, R`\dfrac{\sqrt3}{2}`, R`-\dfrac{\sqrt3}{3}`],
];
const neg = (t: string) => (t === '0' ? '0' : t.startsWith('-') ? t.slice(1) : `-${t}`);
const VALUES = ['0', '1', '-1', R`\dfrac12`, R`-\dfrac12`, R`\dfrac{\sqrt2}{2}`, R`-\dfrac{\sqrt2}{2}`, R`\dfrac{\sqrt3}{2}`, R`-\dfrac{\sqrt3}{2}`, R`\sqrt3`, R`-\sqrt3`, R`\dfrac{\sqrt3}{3}`, R`-\dfrac{\sqrt3}{3}`];

export const goniometria: Unit = {
  id: 'a4-goniometria',
  year: 4,
  title: 'Funzioni goniometriche',
  summary: 'Radianti, circonferenza goniometrica, seno, coseno, tangente, grafici.',
  lessons: [
    {
      id: 'a4-gon-1',
      title: 'Angoli, radianti e circonferenza goniometrica',
      blocks: [
        { t: 'idea', md: R`Una ruota panoramica gira: l'altezza della tua cabina sale e scende con regolarità. Seno e coseno descrivono proprio questo: le **coordinate di un punto che gira su una circonferenza**. Per questo compaiono in tutti i fenomeni periodici: onde, suoni, correnti alternate, maree.` },
        { t: 'def', title: 'Misura in radianti', md: R`La misura in **radianti** di un angolo è il rapporto tra la lunghezza dell'arco e il raggio: $\alpha=\dfrac{l}{r}$. L'angolo giro misura $2\pi$ radianti, quindi $$180°=\pi\ \text{rad}\qquad \alpha_{rad}=\alpha°\cdot\frac{\pi}{180}\qquad \alpha°=\alpha_{rad}\cdot\frac{180}{\pi}$$ Con gli angoli in radianti: lunghezza dell'arco $l=\alpha\,r$, area del settore $A=\dfrac12\alpha\,r^2$.

Gli angoli sono **orientati**: positivi in senso antiorario, negativi in senso orario.` },
        { t: 'def', title: 'Seno, coseno, tangente', md: R`Sulla **circonferenza goniometrica** (centro nell'origine, raggio $1$) all'angolo $\alpha$ corrisponde il punto $P$. Si definiscono: $$\cos\alpha=x_P\qquad \sin\alpha=y_P\qquad \tan\alpha=\frac{\sin\alpha}{\cos\alpha}\ \ \left(\alpha\neq\frac\pi2+k\pi\right)$$ Quindi $-1\le\sin\alpha\le1$ e $-1\le\cos\alpha\le1$, mentre la tangente può assumere qualsiasi valore reale. Geometricamente $\tan\alpha$ è l'ordinata del punto in cui la retta $OP$ incontra la tangente alla circonferenza in $(1;0)$.` },
        {
          t: 'plot',
          title: 'La circonferenza goniometrica',
          caption: R`Muovi l'angolo: il coseno è l'ascissa di $P$ (segmento verde), il seno è l'ordinata (segmento rosso).`,
          view: [-1.73, 1.73, -1.3, 1.3],
          params: [{ name: 'a', label: 'α (gradi)', min: 0, max: 360, step: 5, value: 40 }],
          draw: (p) => {
            const t = (p.a * Math.PI) / 180, x = Math.cos(t), y = Math.sin(t);
            return [
              { k: 'param', x: Math.cos, y: Math.sin, t0: 0, t1: 2 * Math.PI },
              { k: 'seg', x1: 0, y1: 0, x2: x, y2: y, color: 'var(--muted)' },
              { k: 'seg', x1: 0, y1: 0, x2: x, y2: 0, color: 'var(--plot-3)' },
              { k: 'seg', x1: x, y1: 0, x2: x, y2: y, color: 'var(--plot-2)' },
              { k: 'pt', x, y, label: 'P' },
            ];
          },
          readout: (p) => {
            const t = (p.a * Math.PI) / 180;
            const tan = Math.abs(Math.cos(t)) < 1e-9 ? 'non definita' : `$${d(Math.tan(t))}$`;
            return `$\\alpha=${p.a}°\\approx${d(t)}$ rad — $\\cos\\alpha=${d(Math.cos(t))}$, $\\sin\\alpha=${d(Math.sin(t))}$, $\\tan\\alpha=$ ${tan}`;
          },
        },
        {
          t: 'thm',
          title: 'Relazioni fondamentali',
          md: R`$$\sin^2\alpha+\cos^2\alpha=1\qquad\qquad\tan\alpha=\frac{\sin\alpha}{\cos\alpha}$$`,
          proof: [
            R`Il punto $P(\cos\alpha;\sin\alpha)$ appartiene alla circonferenza goniometrica, di equazione $x^2+y^2=1$.`,
            R`Sostituendo le coordinate di $P$: $\cos^2\alpha+\sin^2\alpha=1$. (È il teorema di Pitagora nel triangolo rettangolo con cateti $|\cos\alpha|$, $|\sin\alpha|$ e ipotenusa $1$.)`,
            R`Dalla prima relazione si ricava $\cos\alpha=\pm\sqrt{1-\sin^2\alpha}$: il **segno** si sceglie in base al quadrante in cui si trova l'angolo.`,
          ],
        },
        { t: 'def', title: 'Valori notevoli', md: R`Per gli angoli $0$, $\frac\pi6$ (30°), $\frac\pi4$ (45°), $\frac\pi3$ (60°), $\frac\pi2$ (90°), nell'ordine:

- **seno:** $0,\ \ \dfrac12,\ \ \dfrac{\sqrt2}{2},\ \ \dfrac{\sqrt3}{2},\ \ 1$
- **coseno:** $1,\ \ \dfrac{\sqrt3}{2},\ \ \dfrac{\sqrt2}{2},\ \ \dfrac12,\ \ 0$
- **tangente:** $0,\ \ \dfrac{\sqrt3}{3},\ \ 1,\ \ \sqrt3,\ \ $ non definita

**Segni nei quadranti:** I tutte positive; II solo il seno; III solo la tangente; IV solo il coseno.` },
        {
          t: 'ex',
          title: R`Sapendo che $\sin\alpha=\dfrac35$ e che $\dfrac\pi2<\alpha<\pi$, calcola $\cos\alpha$ e $\tan\alpha$.`,
          steps: [R`$\cos^2\alpha=1-\sin^2\alpha=1-\dfrac{9}{25}=\dfrac{16}{25}$.`, R`$\alpha$ è nel **secondo quadrante**, dove il coseno è negativo: $\cos\alpha=-\dfrac45$.`, R`$\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}=\dfrac{3/5}{-4/5}=-\dfrac34$.`],
        },
        {
          t: 'quiz',
          q: R`A quanti radianti corrispondono $120°$?`,
          options: [
            { md: R`$\dfrac{2\pi}{3}$`, ok: true, why: R`Esatto: $120\cdot\dfrac{\pi}{180}=\dfrac{2\pi}{3}$.` },
            { md: R`$\dfrac{3\pi}{2}$`, why: R`$\dfrac{3\pi}{2}$ corrisponde a $270°$: hai invertito la frazione.` },
            { md: R`$\dfrac{\pi}{3}$`, why: R`$\dfrac\pi3$ corrisponde a $60°$.` },
          ],
        },
      ],
    },
    {
      id: 'a4-gon-2',
      title: 'Grafici, periodicità e angoli associati',
      blocks: [
        { t: 'idea', md: R`Dopo un giro completo il punto sulla circonferenza torna dov'era: seno e coseno **si ripetono** ogni $2\pi$. Srotolando il giro lungo l'asse $x$ nasce l'onda: la **sinusoide**.` },
        { t: 'def', title: 'Le funzioni goniometriche', md: R`- $y=\sin x$: dominio $\mathbb R$, immagine $[-1;1]$, periodo $2\pi$, **dispari** ($\sin(-x)=-\sin x$).
- $y=\cos x$: dominio $\mathbb R$, immagine $[-1;1]$, periodo $2\pi$, **pari** ($\cos(-x)=\cos x$). Il suo grafico è la sinusoide traslata di $\frac\pi2$ verso sinistra.
- $y=\tan x$: dominio $x\neq\frac\pi2+k\pi$, immagine $\mathbb R$, periodo $\pi$, dispari; ha asintoti verticali in $x=\frac\pi2+k\pi$.` },
        {
          t: 'plot',
          title: 'Ampiezza, pulsazione e fase',
          caption: R`Grafico di $y=A\sin(\omega x+\varphi)$ (tratteggiata: $y=\sin x$). L'ampiezza è $|A|$, il periodo è $T=\dfrac{2\pi}{|\omega|}$.`,
          view: [-6.5, 6.5, -3.5, 3.5],
          params: [
            { name: 'A', label: 'A', min: 0.5, max: 3, step: 0.5, value: 2 },
            { name: 'w', label: 'ω', min: 0.5, max: 3, step: 0.5, value: 2 },
            { name: 'f', label: 'φ', min: -3, max: 3, step: 0.25, value: 0 },
          ],
          draw: (p) => [{ k: 'fn', f: Math.sin, dash: true, color: 'var(--muted)' }, { k: 'fn', f: (x) => p.A * Math.sin(p.w * x + p.f) }],
          readout: (p) => `Ampiezza $${d(p.A)}$, periodo $T=\\dfrac{2\\pi}{${d(p.w)}}\\approx${d((2 * Math.PI) / p.w)}$`,
        },
        { t: 'def', title: 'Angoli associati', md: R`- **Opposti:** $\sin(-\alpha)=-\sin\alpha$, $\ \cos(-\alpha)=\cos\alpha$
- **Supplementari:** $\sin(\pi-\alpha)=\sin\alpha$, $\ \cos(\pi-\alpha)=-\cos\alpha$
- **Che differiscono di $\pi$:** $\sin(\pi+\alpha)=-\sin\alpha$, $\ \cos(\pi+\alpha)=-\cos\alpha$
- **Esplementari:** $\sin(2\pi-\alpha)=-\sin\alpha$, $\ \cos(2\pi-\alpha)=\cos\alpha$
- **Complementari:** $\sin\left(\frac\pi2-\alpha\right)=\cos\alpha$, $\ \cos\left(\frac\pi2-\alpha\right)=\sin\alpha$

Per la tangente basta fare il rapporto. Tutte si ricavano dalle simmetrie della circonferenza goniometrica.` },
        {
          t: 'ex',
          title: R`Calcola $\sin\dfrac{7\pi}{6}$ e $\cos\dfrac{5\pi}{3}$.`,
          steps: [R`$\dfrac{7\pi}{6}=\pi+\dfrac\pi6$: $\sin\left(\pi+\dfrac\pi6\right)=-\sin\dfrac\pi6=-\dfrac12$.`, R`$\dfrac{5\pi}{3}=2\pi-\dfrac\pi3$: $\cos\left(2\pi-\dfrac\pi3\right)=\cos\dfrac\pi3=\dfrac12$.`],
        },
        { t: 'def', title: 'Funzioni goniometriche inverse', md: R`Restringendo il dominio a un intervallo in cui la funzione è biiettiva si definiscono:
- $y=\arcsin x$: dominio $[-1;1]$, immagine $\left[-\frac\pi2;\frac\pi2\right]$
- $y=\arccos x$: dominio $[-1;1]$, immagine $[0;\pi]$
- $y=\arctan x$: dominio $\mathbb R$, immagine $\left(-\frac\pi2;\frac\pi2\right)$

Esempio: $\arcsin\dfrac12=\dfrac\pi6$ (e non $\dfrac{5\pi}{6}$, che è fuori dall'immagine).` },
        { t: 'warn', md: R`$\sin2x$ **non** è $2\sin x$, e $\sin(\alpha+\beta)$ **non** è $\sin\alpha+\sin\beta$: le funzioni goniometriche non sono lineari. Controlla inoltre che la calcolatrice sia impostata nell'unità giusta (DEG o RAD).` },
      ],
    },
  ],
  exercises: [
    {
      id: 'gon-radianti',
      level: 1,
      title: 'Da gradi a radianti',
      make: (r) => {
        const row = pick(r, NOTABLE.filter((n) => n[0] !== 0));
        const others = NOTABLE.filter((n) => n[0] !== 0 && n[0] !== row[0]);
        const inv = NOTABLE.find((n) => n[0] === 360 - row[0] && n[0] !== row[0]);
        return {
          text: `Esprimi in radianti l'angolo di ${m(`${row[0]}°`)}.`,
          options: mc(r, m(row[1]), inv ? [[m(inv[1]), `Questo angolo corrisponde a ${m(`${inv[0]}°`)}.`]] : [], shuffle(r, others).slice(0, 4).map((n) => m(n[1]))),
          hints: [R`Moltiplica i gradi per $\dfrac{\pi}{180}$ e semplifica.`],
          solution: [`${m(`${row[0]}\\cdot\\dfrac{\\pi}{180}=${row[1]}`)}`],
        };
      },
    },
    {
      id: 'gon-gradi',
      level: 1,
      title: 'Da radianti a gradi',
      make: (r) => {
        const row = pick(r, NOTABLE.filter((n) => n[0] !== 0));
        return {
          text: `A quanti gradi corrisponde l'angolo di ${m(row[1])} radianti?`,
          answer: row[0],
          tol: 0,
          hints: [R`Moltiplica per $\dfrac{180}{\pi}$, oppure sostituisci $\pi$ con $180°$.`],
          solution: [`Sostituendo $\\pi$ con $180°$: ${m(`${row[1]}=${row[0]}°`)}.`],
        };
      },
    },
    {
      id: 'gon-segno',
      level: 1,
      title: 'Segno nei quadranti',
      make: (r) => {
        const q = int(r, 2, 4);
        const pos = { 2: 'seno', 3: 'tangente', 4: 'coseno' }[q]!;
        const names = ['seno', 'coseno', 'tangente'];
        const lab = (n: string) => (n === 'tangente' ? 'La tangente' : `Il ${n}`);
        const ord = { 2: 'secondo', 3: 'terzo', 4: 'quarto' }[q]!;
        return {
          text: `Quale funzione goniometrica è **positiva** per un angolo del ${ord} quadrante?`,
          options: choice(r, [[lab(pos), 'Corretto.'], ...names.filter((n) => n !== pos).map((n): [string, string] => [lab(n), 'Pensa al segno di ascissa (coseno) e ordinata (seno) del punto sulla circonferenza; la tangente è il loro rapporto.']), ['Tutte e tre', 'Accade solo nel primo quadrante.']]),
          hints: ['Il coseno è l\'ascissa del punto sulla circonferenza goniometrica, il seno è l\'ordinata.', 'La tangente è positiva quando seno e coseno hanno lo stesso segno.'],
          solution: [`Nel ${ord} quadrante: ${q === 2 ? 'ascissa negativa, ordinata positiva' : q === 3 ? 'ascissa e ordinata negative' : 'ascissa positiva, ordinata negativa'}.`, `Quindi è positiv${pos === 'tangente' ? 'a la tangente' : `o il ${pos}`}.`],
        };
      },
    },
    {
      id: 'gon-notevoli',
      level: 1,
      title: 'Valori notevoli (primo quadrante)',
      make: (r) => {
        const row = pick(r, NOTABLE.slice(1, 4)), fi = int(r, 0, 2);
        const fn = ['\\sin', '\\cos', '\\tan'][fi], val = row[2 + fi] as string;
        const other = row[2 + ((fi + 1) % 3)];
        return {
          text: `Quanto vale ${m(`${fn}${row[1]}`)}?`,
          options: mc(r, m(val), [[m(other), 'Hai confuso questa funzione con un\'altra: ripassa la tabella dei valori notevoli.']], VALUES.filter((v) => !v.startsWith('-') && v !== '0').map((v) => m(v))),
          hints: [`${m(row[1])} corrisponde a ${m(`${row[0]}°`)}.`, R`Ricorda: seno di $30°,45°,60°$ vale $\frac12,\frac{\sqrt2}{2},\frac{\sqrt3}{2}$; il coseno ha gli stessi valori in ordine inverso.`],
          solution: [`${m(`${fn}${row[1]}=${fn}${row[0]}°=${val}`)}`],
        };
      },
    },
    {
      id: 'gon-notevoli-q',
      level: 2,
      title: 'Valori notevoli (altri quadranti)',
      make: (r) => {
        const row = pick(r, NOTABLE.filter((n) => n[0] > 90 && n[0] % 90 !== 0)), fi = int(r, 0, 2);
        const fn = ['\\sin', '\\cos', '\\tan'][fi], val = row[2 + fi] as string;
        const ref = row[0] < 180 ? 180 - row[0] : row[0] < 270 ? row[0] - 180 : 360 - row[0];
        return {
          text: `Quanto vale ${m(`${fn}${row[1]}`)}?`,
          options: mc(r, m(val), [[m(neg(val)), 'Il valore assoluto è giusto ma il **segno** no: controlla in quale quadrante si trova l\'angolo.'], [m(row[2 + ((fi + 1) % 3)]), 'Hai usato un\'altra funzione goniometrica.']], VALUES.map((v) => m(v))),
          hints: [`L'angolo vale ${m(`${row[0]}°`)}: in quale quadrante si trova?`, `L'angolo di riferimento nel primo quadrante è ${m(`${ref}°`)}; poi scegli il segno.`],
          solution: [`${m(row[1])} corrisponde a ${m(`${row[0]}°`)}, nel ${row[0] < 180 ? 'secondo' : row[0] < 270 ? 'terzo' : 'quarto'} quadrante, con angolo di riferimento ${m(`${ref}°`)}.`, `${m(`${fn}${row[1]}=${val}`)}`],
        };
      },
    },
    {
      id: 'gon-fondamentale',
      level: 2,
      title: 'Relazione fondamentale',
      make: (r) => {
        const [a, b, c] = pick(r, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]]);
        const q = int(r, 1, 4), given = r() < 0.5 ? 'sin' : 'cos';
        const sSin = q <= 2 ? 1 : -1, sCos = q === 1 || q === 4 ? 1 : -1;
        const quad = ['0<\\alpha<\\dfrac\\pi2', '\\dfrac\\pi2<\\alpha<\\pi', '\\pi<\\alpha<\\dfrac{3\\pi}{2}', '\\dfrac{3\\pi}{2}<\\alpha<2\\pi'][q - 1];
        const gv = given === 'sin' ? frac(sSin * a, c) : frac(sCos * a, c);
        const ans = given === 'sin' ? frac(sCos * b, c) : frac(sSin * b, c);
        const want = given === 'sin' ? '\\cos' : '\\sin';
        return {
          text: `Sapendo che ${m(`\\${given}\\alpha=${gv}`)} e che ${m(quad)}, calcola ${m(`${want}\\alpha`)}.`,
          options: mc(r, m(ans), [
            [m(neg(ans)), 'Il **segno** è sbagliato: controlla il quadrante indicato.'],
            [m(frac(c - a, c)), R`Non è $1-\sin\alpha$: la relazione riguarda i **quadrati**, $\sin^2\alpha+\cos^2\alpha=1$.`],
            [m(frac(b * b, c * c)), 'Hai dimenticato di estrarre la radice quadrata.'],
          ], [m(frac(a, b))]),
          hints: [R`Usa $\sin^2\alpha+\cos^2\alpha=1$.`, 'Il segno dipende dal quadrante.'],
          steps: [
            { ask: `Quanto vale ${m(`${want}^2\\alpha`)}?`, options: mc(r, m(frac(b * b, c * c)), [[m(frac(c - a, c)), 'Devi sottrarre il **quadrato** del valore dato.'], [m(frac(c * c + a * a, c * c)), 'Si sottrae da $1$, non si somma.']], [m(frac(b, c))]), explain: `${m(`1-\\dfrac{${a * a}}{${c * c}}=\\dfrac{${b * b}}{${c * c}}`)}.` },
            { ask: `In questo quadrante ${m(`${want}\\alpha`)} è positivo o negativo?`, options: choice(r, [[ans.startsWith('-') ? 'Negativo' : 'Positivo'], [ans.startsWith('-') ? 'Positivo' : 'Negativo', 'Guarda il segno della coordinata corrispondente sulla circonferenza goniometrica.'], ['Può essere entrambi', 'Il quadrante è assegnato: il segno è determinato.']]), explain: `Quindi ${m(`${want}\\alpha=${ans}`)}.` },
          ],
          solution: [`${m(`${want}^2\\alpha=1-\\dfrac{${a * a}}{${c * c}}=\\dfrac{${b * b}}{${c * c}}`)}`, `Nel quadrante indicato il ${given === 'sin' ? 'coseno' : 'seno'} è ${ans.startsWith('-') ? 'negativo' : 'positivo'}: ${m(`${want}\\alpha=${ans}`)}.`],
        };
      },
    },
    {
      id: 'gon-tangente',
      level: 2,
      title: 'Tangente da seno e coseno',
      make: (r) => {
        const [a, b, c] = pick(r, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17]]);
        const s1 = pick(r, [1, -1]), s2 = pick(r, [1, -1]);
        return {
          text: `Se ${m(`\\sin\\alpha=${frac(s1 * a, c)}`)} e ${m(`\\cos\\alpha=${frac(s2 * b, c)}`)}, quanto vale ${m('\\tan\\alpha')}?`,
          options: mc(r, m(frac(s1 * a, s2 * b)), [
            [m(frac(s2 * b, s1 * a)), R`Rapporto invertito: $\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}$ (questa è la cotangente).`],
            [m(frac(-s1 * a, s2 * b)), 'Attenzione ai segni di seno e coseno.'],
            [m(frac(s1 * a * s2 * b, c * c)), 'Hai moltiplicato invece di dividere.'],
          ]),
          hints: [R`$\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}$.`],
          solution: [`${m(`\\tan\\alpha=\\dfrac{${frac(s1 * a, c)}}{${frac(s2 * b, c)}}=${frac(s1 * a, s2 * b)}`)}`],
        };
      },
    },
    {
      id: 'gon-associati',
      level: 2,
      title: 'Angoli associati',
      make: (r) => {
        const [expr, ans, why] = pick(r, [
          [R`\sin(\pi-\alpha)`, R`\sin\alpha`, 'angoli supplementari hanno lo stesso seno'],
          [R`\cos(\pi-\alpha)`, R`-\cos\alpha`, 'angoli supplementari hanno coseni opposti'],
          [R`\sin(\pi+\alpha)`, R`-\sin\alpha`, 'il punto è il simmetrico rispetto all\'origine'],
          [R`\cos(\pi+\alpha)`, R`-\cos\alpha`, 'il punto è il simmetrico rispetto all\'origine'],
          [R`\sin(-\alpha)`, R`-\sin\alpha`, 'il seno è una funzione dispari'],
          [R`\cos(-\alpha)`, R`\cos\alpha`, 'il coseno è una funzione pari'],
          [R`\sin\left(\dfrac\pi2-\alpha\right)`, R`\cos\alpha`, 'angoli complementari si scambiano seno e coseno'],
          [R`\cos\left(\dfrac\pi2-\alpha\right)`, R`\sin\alpha`, 'angoli complementari si scambiano seno e coseno'],
          [R`\cos(2\pi-\alpha)`, R`\cos\alpha`, 'il punto è il simmetrico rispetto all\'asse $x$'],
          [R`\sin(2\pi-\alpha)`, R`-\sin\alpha`, 'il punto è il simmetrico rispetto all\'asse $x$'],
        ] as const);
        const all = [R`\sin\alpha`, R`-\sin\alpha`, R`\cos\alpha`, R`-\cos\alpha`];
        return {
          text: `Semplifica ${m(expr)}.`,
          options: choice(r, [[m(ans), `Corretto: ${why}.`], ...all.filter((x) => x !== ans).map((x): [string, string] => [m(x), `Disegna i due angoli sulla circonferenza goniometrica: ${why}.`])]),
          hints: ['Rappresenta i due angoli sulla circonferenza goniometrica e confronta le coordinate dei punti.'],
          solution: [`${m(`${expr}=${ans}`)}: ${why}.`],
        };
      },
    },
    {
      id: 'gon-periodo',
      level: 2,
      title: 'Periodo',
      make: (r) => {
        const w = pick(r, [2, 3, 4, 6]), A = int(r, 2, 5), fn = pick(r, ['\\sin', '\\cos']);
        const per = (n: number, dn: number) => {
          const f = frac(n, dn);
          return m(f === '1' ? '\\pi' : f.includes('frac') ? f.replace(/\\dfrac\{(\d+)\}/, (_, k) => `\\dfrac{${k === '1' ? '' : k}\\pi}`) : `${f}\\pi`);
        };
        return {
          text: `Qual è il periodo della funzione ${m(`y=${A}${fn}(${w}x)`)}?`,
          options: mc(r, per(2, w), [
            [per(2 * w, 1), R`Il periodo si **divide** per $\omega$: $T=\dfrac{2\pi}{\omega}$.`],
            [per(2, 1), `Il coefficiente ${m(w)} di $x$ "comprime" il grafico: il periodo cambia.`],
            [per(2 * A, 1), 'Il coefficiente davanti alla funzione è l\'**ampiezza**, non influisce sul periodo.'],
          ], [per(1, w), per(4, w)]),
          hints: [R`Per $y=A\sin(\omega x)$ il periodo è $T=\dfrac{2\pi}{|\omega|}$.`],
          solution: [`${m(`T=\\dfrac{2\\pi}{${w}}`)}, cioè ${per(2, w)}.`, `L'ampiezza ${m(A)} non modifica il periodo.`],
        };
      },
    },
    {
      id: 'gon-massimo',
      level: 2,
      title: 'Massimo e minimo',
      make: (r) => {
        const a = int(r, -4, 6), b = nz(r, -5, 5), max = r() < 0.5, fn = pick(r, ['\\sin x', '\\cos x']);
        return {
          text: `Qual è il valore **${max ? 'massimo' : 'minimo'}** della funzione ${m(`y=${a === 0 ? '' : a}${b > 0 && a !== 0 ? '+' : ''}${b === 1 ? '' : b === -1 ? '-' : b}${fn}`)}?`,
          answer: max ? a + Math.abs(b) : a - Math.abs(b),
          tol: 0,
          hints: ['Seno e coseno assumono tutti i valori tra $-1$ e $1$.', 'Se il coefficiente è negativo, il massimo si ottiene quando la funzione goniometrica vale $-1$.'],
          solution: [`${m(`-1\\le${fn}\\le1`)}, quindi ${m(`${b}${fn}`)} varia tra ${m(-Math.abs(b))} e ${m(Math.abs(b))}.`, `La funzione varia tra ${m(a - Math.abs(b))} e ${m(a + Math.abs(b))}: il ${max ? 'massimo' : 'minimo'} è ${m(max ? a + Math.abs(b) : a - Math.abs(b))}.`],
        };
      },
    },
    {
      id: 'gon-espressione',
      level: 3,
      title: 'Espressione con valori notevoli',
      make: (r) => {
        const [expr, val, sol] = pick(r, [
          [R`\sin\dfrac{5\pi}{6}+\cos\dfrac{2\pi}{3}`, 0, R`$\dfrac12+\left(-\dfrac12\right)=0$`],
          [R`2\sin\dfrac{7\pi}{6}-\cos\pi`, 0, R`$2\cdot\left(-\dfrac12\right)-(-1)=0$`],
          [R`\tan\dfrac{3\pi}{4}+2\cos\dfrac{5\pi}{3}`, 0, R`$-1+2\cdot\dfrac12=0$`],
          [R`4\sin\dfrac{\pi}{6}\cos\dfrac{\pi}{3}+\tan\dfrac{5\pi}{4}`, 2, R`$4\cdot\dfrac12\cdot\dfrac12+1=2$`],
          [R`\sin^2\dfrac{\pi}{3}-\cos^2\dfrac{\pi}{3}`, 0.5, R`$\dfrac34-\dfrac14=\dfrac12$`],
          [R`2\cos\dfrac{4\pi}{3}+\sin\dfrac{3\pi}{2}`, -2, R`$2\cdot\left(-\dfrac12\right)+(-1)=-2$`],
          [R`\tan^2\dfrac{\pi}{3}-4\sin^2\dfrac{3\pi}{4}`, 1, R`$3-4\cdot\dfrac12=1$`],
          [R`6\sin\dfrac{11\pi}{6}+4\cos\dfrac{5\pi}{3}`, -1, R`$6\cdot\left(-\dfrac12\right)+4\cdot\dfrac12=-1$`],
        ] as const);
        return {
          text: `Calcola il valore dell'espressione ${m(expr)}.`,
          answer: val,
          tol: 0.001,
          hints: ['Riconduci ogni angolo al primo quadrante con gli angoli associati.', 'Attenzione ai segni nei vari quadranti.'],
          solution: [`Sostituendo i valori notevoli: ${sol}.`],
        };
      },
    },
    {
      id: 'gon-inverse',
      level: 3,
      title: 'Funzioni inverse',
      make: (r) => {
        const [expr, ans, wrong, why] = pick(r, [
          [R`\arcsin\dfrac12`, R`\dfrac\pi6`, R`\dfrac{5\pi}{6}`, R`anche $\sin\frac{5\pi}{6}=\frac12$, ma l'arcoseno ha valori solo in $\left[-\frac\pi2;\frac\pi2\right]$`],
          [R`\arccos\left(-\dfrac12\right)`, R`\dfrac{2\pi}{3}`, R`-\dfrac{\pi}{3}`, R`l'arcocoseno ha valori in $[0;\pi]$`],
          [R`\arctan(-1)`, R`-\dfrac\pi4`, R`\dfrac{3\pi}{4}`, R`l'arcotangente ha valori in $\left(-\frac\pi2;\frac\pi2\right)$`],
          [R`\arcsin\left(-\dfrac{\sqrt3}{2}\right)`, R`-\dfrac\pi3`, R`\dfrac{4\pi}{3}`, R`l'arcoseno ha valori solo in $\left[-\frac\pi2;\frac\pi2\right]$`],
          [R`\arccos\dfrac{\sqrt2}{2}`, R`\dfrac\pi4`, R`-\dfrac{\pi}{4}`, R`l'arcocoseno ha valori in $[0;\pi]$`],
          [R`\arctan\sqrt3`, R`\dfrac\pi3`, R`\dfrac{4\pi}{3}`, R`l'arcotangente ha valori in $\left(-\frac\pi2;\frac\pi2\right)$`],
        ] as const);
        return {
          text: `Quanto vale ${m(expr)}?`,
          options: mc(r, m(ans), [[m(wrong), `Attenzione: ${why}.`]], [R`\dfrac\pi2`, R`\dfrac{\pi}{12}`, R`\pi`, '0'].map((x) => m(x))),
          hints: ['Cerca l\'angolo che ha quel valore di seno/coseno/tangente...', '...ma solo nell\'intervallo dei valori della funzione inversa.'],
          solution: [`${m(`${expr}=${ans}`)}: ${why}.`],
        };
      },
    },
  ],
};
