import { choice, frac, int, m, mc, pick } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const TR = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]] as const;

export const formule: Unit = {
  id: 'a4-formule',
  year: 4,
  title: 'Formule goniometriche',
  summary: 'Addizione e sottrazione, duplicazione, bisezione, parametriche, angolo aggiunto.',
  lessons: [
    {
      id: 'a4-for-1',
      title: 'Addizione, sottrazione e duplicazione',
      blocks: [
        { t: 'idea', md: R`Conosciamo seno e coseno di $30°$ e $45°$: quanto vale $\sin75°$? Verrebbe da dire $\sin30°+\sin45°$, ma è **falso** (darebbe più di $1$!). Le formule di addizione dicono come si calcolano davvero le funzioni goniometriche di una somma di angoli.` },
        {
          t: 'thm',
          title: 'Formule di addizione e sottrazione',
          md: R`$$\cos(\alpha\mp\beta)=\cos\alpha\cos\beta\pm\sin\alpha\sin\beta$$ $$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$$ $$\tan(\alpha\pm\beta)=\frac{\tan\alpha\pm\tan\beta}{1\mp\tan\alpha\tan\beta}$$`,
          proof: [
            R`Dimostriamo $\cos(\alpha-\beta)$. Sulla circonferenza goniometrica consideriamo $A(\cos\alpha;\sin\alpha)$ e $B(\cos\beta;\sin\beta)$: l'angolo $A\widehat OB$ è $\alpha-\beta$.`,
            R`Calcoliamo $\overline{AB}^2$ con la formula della distanza: $(\cos\alpha-\cos\beta)^2+(\sin\alpha-\sin\beta)^2=2-2(\cos\alpha\cos\beta+\sin\alpha\sin\beta)$.`,
            R`Ruotiamo la figura portando $B$ in $(1;0)$: $A$ va in $(\cos(\alpha-\beta);\sin(\alpha-\beta))$ e la distanza non cambia: $\overline{AB}^2=(\cos(\alpha-\beta)-1)^2+\sin^2(\alpha-\beta)=2-2\cos(\alpha-\beta)$.`,
            R`Uguagliando: $\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta$.`,
            R`Le altre seguono da questa: sostituendo $\beta$ con $-\beta$ si ottiene $\cos(\alpha+\beta)$; usando $\sin x=\cos\left(\frac\pi2-x\right)$ si ottengono le formule del seno.`,
          ],
        },
        {
          t: 'ex',
          title: R`Calcola $\sin75°$.`,
          steps: [R`$75°=45°+30°$.`, R`$\sin75°=\sin45°\cos30°+\cos45°\sin30°=\dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2}+\dfrac{\sqrt2}{2}\cdot\dfrac12$.`, R`$\sin75°=\dfrac{\sqrt6+\sqrt2}{4}\approx0{,}966$.`],
        },
        {
          t: 'thm',
          title: 'Formule di duplicazione',
          md: R`$$\sin2\alpha=2\sin\alpha\cos\alpha$$ $$\cos2\alpha=\cos^2\alpha-\sin^2\alpha=1-2\sin^2\alpha=2\cos^2\alpha-1$$ $$\tan2\alpha=\frac{2\tan\alpha}{1-\tan^2\alpha}$$`,
          proof: [R`Basta porre $\beta=\alpha$ nelle formule di addizione: $\sin(\alpha+\alpha)=\sin\alpha\cos\alpha+\cos\alpha\sin\alpha=2\sin\alpha\cos\alpha$.`, R`$\cos(\alpha+\alpha)=\cos^2\alpha-\sin^2\alpha$. Sostituendo $\cos^2\alpha=1-\sin^2\alpha$ si ha $1-2\sin^2\alpha$; sostituendo $\sin^2\alpha=1-\cos^2\alpha$ si ha $2\cos^2\alpha-1$.`],
        },
        {
          t: 'plot',
          title: 'sin 2x non è 2 sin x',
          caption: R`In colore $y=\sin2x$, tratteggiata $y=2\sin x$: sono funzioni completamente diverse (periodo e ampiezza). Il punto mostra invece che $\sin2x=2\sin x\cos x$.`,
          view: [-6.5, 6.5, -2.5, 2.5],
          params: [{ name: 'x', label: 'x', min: -6, max: 6, step: 0.25, value: 1 }],
          draw: (p) => [{ k: 'fn', f: (x) => Math.sin(2 * x) }, { k: 'fn', f: (x) => 2 * Math.sin(x), dash: true, color: 'var(--muted)' }, { k: 'pt', x: p.x, y: 2 * Math.sin(p.x) * Math.cos(p.x) }],
          readout: (p) => `$\\sin2x=${d(Math.sin(2 * p.x))}$, $\\ 2\\sin x\\cos x=${d(2 * Math.sin(p.x) * Math.cos(p.x))}$, $\\ 2\\sin x=${d(2 * Math.sin(p.x))}$`,
        },
        { t: 'warn', md: R`Nelle formule del **coseno** il segno si inverte: $\cos(\alpha+\beta)$ ha il **meno**, $\cos(\alpha-\beta)$ ha il **più**. Nelle formule del seno il segno resta lo stesso.` },
        {
          t: 'quiz',
          q: R`A che cosa è uguale $\cos x\cos y-\sin x\sin y$?`,
          options: [
            { md: R`$\cos(x+y)$`, ok: true, why: 'Esatto: nel coseno della somma compare il segno meno.' },
            { md: R`$\cos(x-y)$`, why: R`$\cos(x-y)=\cos x\cos y+\sin x\sin y$, con il più.` },
            { md: R`$\sin(x-y)$`, why: 'Nelle formule del seno i prodotti sono "misti": seno per coseno.' },
          ],
        },
      ],
    },
    {
      id: 'a4-for-2',
      title: 'Bisezione, parametriche, angolo aggiunto',
      blocks: [
        { t: 'idea', md: R`Le formule di duplicazione, lette al contrario, permettono di passare dall'angolo alla sua **metà**, di abbassare il grado delle espressioni e di riscrivere $a\sin x+b\cos x$ come **un'unica sinusoide**: è ciò che accade quando due onde si sommano.` },
        { t: 'def', title: 'Formule di bisezione', md: R`$$\sin\frac\alpha2=\pm\sqrt{\frac{1-\cos\alpha}{2}}\qquad\cos\frac\alpha2=\pm\sqrt{\frac{1+\cos\alpha}{2}}\qquad\tan\frac\alpha2=\frac{\sin\alpha}{1+\cos\alpha}=\frac{1-\cos\alpha}{\sin\alpha}$$ Il segno dipende dal quadrante di $\dfrac\alpha2$. Derivano da $\cos\alpha=1-2\sin^2\dfrac\alpha2=2\cos^2\dfrac\alpha2-1$.

Utili anche come **formule di linearizzazione**: $\sin^2x=\dfrac{1-\cos2x}{2}$, $\ \cos^2x=\dfrac{1+\cos2x}{2}$.` },
        { t: 'def', title: 'Formule parametriche', md: R`Posto $t=\tan\dfrac\alpha2$ (con $\alpha\neq\pi+2k\pi$): $$\sin\alpha=\frac{2t}{1+t^2}\qquad\cos\alpha=\frac{1-t^2}{1+t^2}\qquad\tan\alpha=\frac{2t}{1-t^2}$$ Trasformano un'espressione goniometrica in una espressione razionale in $t$.` },
        {
          t: 'thm',
          title: 'Angolo aggiunto',
          md: R`$$a\sin x+b\cos x=r\,\sin(x+\varphi)\qquad\text{con}\quad r=\sqrt{a^2+b^2},\quad \cos\varphi=\frac ar,\ \ \sin\varphi=\frac br$$ Quindi $a\sin x+b\cos x$ è una sinusoide di **ampiezza** $\sqrt{a^2+b^2}$.`,
          proof: [R`Raccogliamo $r=\sqrt{a^2+b^2}$: $a\sin x+b\cos x=r\left(\dfrac ar\sin x+\dfrac br\cos x\right)$.`, R`Poiché $\left(\dfrac ar\right)^2+\left(\dfrac br\right)^2=1$, esiste un angolo $\varphi$ con $\cos\varphi=\dfrac ar$ e $\sin\varphi=\dfrac br$.`, R`Allora l'espressione diventa $r(\sin x\cos\varphi+\cos x\sin\varphi)=r\sin(x+\varphi)$.`],
        },
        {
          t: 'plot',
          title: 'Somma di seno e coseno',
          caption: R`Tratteggiate $a\sin x$ e $b\cos x$; in colore la loro somma, che è ancora una sinusoide.`,
          view: [-6.5, 6.5, -5.5, 5.5],
          params: [
            { name: 'a', label: 'a', min: -3, max: 3, step: 0.5, value: 1 },
            { name: 'b', label: 'b', min: -3, max: 3, step: 0.5, value: 2 },
          ],
          draw: (p) => [{ k: 'fn', f: (x) => p.a * Math.sin(x) + p.b * Math.cos(x) }, { k: 'fn', f: (x) => p.a * Math.sin(x), dash: true, color: 'var(--muted)' }, { k: 'fn', f: (x) => p.b * Math.cos(x), dash: true, color: 'var(--plot-3)' }],
          readout: (p) => `Ampiezza $r=\\sqrt{${d(p.a * p.a)}+${d(p.b * p.b)}}\\approx${d(Math.hypot(p.a, p.b))}$`,
        },
        {
          t: 'ex',
          title: R`Scrivi $\sin x+\sqrt3\cos x$ nella forma $r\sin(x+\varphi)$.`,
          steps: [R`$r=\sqrt{1+3}=2$.`, R`$\cos\varphi=\dfrac12$, $\sin\varphi=\dfrac{\sqrt3}{2}$: $\varphi=\dfrac\pi3$.`, R`$\sin x+\sqrt3\cos x=2\sin\left(x+\dfrac\pi3\right)$: massimo $2$, minimo $-2$.`],
        },
        { t: 'def', title: 'Angolo tra due rette', md: R`Poiché $m=\tan\alpha$, dalla formula di sottrazione della tangente segue che l'angolo acuto $\theta$ tra due rette di coefficienti angolari $m_1$ e $m_2$ (non perpendicolari) soddisfa $$\tan\theta=\left|\frac{m_1-m_2}{1+m_1m_2}\right|$$ Se $1+m_1m_2=0$ le rette sono perpendicolari.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'for-riconosci',
      level: 1,
      title: 'Riconoscere una formula',
      make: (r) => {
        const [expr, ans] = pick(r, [
          [R`\sin x\cos y+\cos x\sin y`, R`\sin(x+y)`],
          [R`\sin x\cos y-\cos x\sin y`, R`\sin(x-y)`],
          [R`\cos x\cos y-\sin x\sin y`, R`\cos(x+y)`],
          [R`\cos x\cos y+\sin x\sin y`, R`\cos(x-y)`],
        ] as const);
        const all = [R`\sin(x+y)`, R`\sin(x-y)`, R`\cos(x+y)`, R`\cos(x-y)`];
        return {
          text: `A che cosa è uguale ${m(expr)}?`,
          options: choice(r, [[m(ans), 'Corretto.'], ...all.filter((x) => x !== ans).map((x): [string, string] => [m(x), 'Nel seno i prodotti sono misti e il segno si conserva; nel coseno i prodotti sono "omogenei" e il segno si inverte.'])]),
          hints: ['Prodotti misti (seno per coseno) → formula del seno; prodotti omogenei → formula del coseno.', 'Nel coseno il segno è opposto a quello dell\'angolo.'],
          solution: [`${m(`${expr}=${ans}`)}`],
        };
      },
    },
    {
      id: 'for-sin2',
      level: 1,
      title: 'Duplicazione del seno',
      make: (r) => {
        const [a, b, c] = pick(r, TR);
        return {
          text: `Sapendo che ${m(`\\sin\\alpha=${frac(a, c)}`)} con ${m('0<\\alpha<\\dfrac\\pi2')}, calcola ${m('\\sin2\\alpha')}.`,
          options: mc(r, m(frac(2 * a * b, c * c)), [
            [m(frac(2 * a, c)), R`$\sin2\alpha\neq2\sin\alpha$: la formula è $2\sin\alpha\cos\alpha$.`],
            [m(frac(a * b, c * c)), 'Hai dimenticato il fattore $2$.'],
            [m(frac(b * b - a * a, c * c)), 'Questo è $\\cos2\\alpha$.'],
          ], [m(frac(2 * a * b + 1, c * c))]),
          hints: [R`$\sin2\alpha=2\sin\alpha\cos\alpha$: serve prima $\cos\alpha$.`, `Nel primo quadrante ${m(`\\cos\\alpha=${frac(b, c)}`)}.`],
          steps: [
            { ask: 'Quanto vale $\\cos\\alpha$?', options: mc(r, m(frac(b, c)), [[m(frac(-b, c)), 'Nel primo quadrante il coseno è positivo.'], [m(frac(c - a, c)), 'La relazione fondamentale riguarda i quadrati.']], [m(frac(b * b, c * c)), m(frac(a, b))]), explain: `${m(`\\cos\\alpha=\\sqrt{1-\\dfrac{${a * a}}{${c * c}}}=${frac(b, c)}`)}.` },
            { ask: 'Applica $\\sin2\\alpha=2\\sin\\alpha\\cos\\alpha$:', options: mc(r, m(frac(2 * a * b, c * c)), [[m(frac(a * b, c * c)), 'Manca il fattore $2$.'], [m(frac(2 * a, c)), 'Non basta raddoppiare il seno.']], [m(frac(2 * a * b + 1, c * c))]), explain: `${m(`2\\cdot${frac(a, c)}\\cdot${frac(b, c)}=${frac(2 * a * b, c * c)}`)}.` },
          ],
          solution: [`${m(`\\cos\\alpha=${frac(b, c)}`)} (primo quadrante).`, `${m(`\\sin2\\alpha=2\\cdot${frac(a, c)}\\cdot${frac(b, c)}=${frac(2 * a * b, c * c)}`)}`],
        };
      },
    },
    {
      id: 'for-cos2',
      level: 1,
      title: 'Duplicazione del coseno',
      make: (r) => {
        const n = int(r, 1, 4), dn = int(r, n + 1, 6), useSin = r() < 0.5;
        const num = useSin ? dn * dn - 2 * n * n : 2 * n * n - dn * dn;
        return {
          text: `Sapendo che ${m(`\\${useSin ? 'sin' : 'cos'}\\alpha=${frac(n, dn)}`)}, calcola ${m('\\cos2\\alpha')}.`,
          options: mc(r, m(frac(num, dn * dn)), [
            [m(frac(-num, dn * dn)), useSin ? R`Con il seno la formula è $1-2\sin^2\alpha$.` : R`Con il coseno la formula è $2\cos^2\alpha-1$.`],
            [m(frac(2 * n, dn)), R`$\cos2\alpha\neq2\cos\alpha$.`],
            [m(frac(dn * dn - n * n, dn * dn)), 'Manca il fattore $2$ davanti al quadrato.'],
          ], [m(frac(num + 1, dn * dn)), m(frac(num - 1, dn * dn))]),
          hints: [useSin ? R`$\cos2\alpha=1-2\sin^2\alpha$.` : R`$\cos2\alpha=2\cos^2\alpha-1$.`],
          solution: [useSin ? `${m(`\\cos2\\alpha=1-2\\cdot\\dfrac{${n * n}}{${dn * dn}}=${frac(num, dn * dn)}`)}` : `${m(`\\cos2\\alpha=2\\cdot\\dfrac{${n * n}}{${dn * dn}}-1=${frac(num, dn * dn)}`)}`],
        };
      },
    },
    {
      id: 'for-notevoli',
      level: 2,
      title: 'Angoli di 15° e 75°',
      make: (r) => {
        const plus = R`\dfrac{\sqrt6+\sqrt2}{4}`, minus = R`\dfrac{\sqrt6-\sqrt2}{4}`;
        const [fn, ans, how] = pick(r, [
          [R`\sin75°`, plus, R`$\sin(45°+30°)=\dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2}+\dfrac{\sqrt2}{2}\cdot\dfrac12$`],
          [R`\cos15°`, plus, R`$\cos(45°-30°)=\dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2}+\dfrac{\sqrt2}{2}\cdot\dfrac12$`],
          [R`\sin15°`, minus, R`$\sin(45°-30°)=\dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2}-\dfrac{\sqrt2}{2}\cdot\dfrac12$`],
          [R`\cos75°`, minus, R`$\cos(45°+30°)=\dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2}-\dfrac{\sqrt2}{2}\cdot\dfrac12$`],
        ] as const);
        return {
          text: `Calcola il valore esatto di ${m(fn)}.`,
          options: choice(r, [
            [m(ans), 'Corretto.'],
            [m(ans === plus ? minus : plus), 'Segno sbagliato tra i due termini: ricontrolla la formula (nel coseno il segno si inverte).'],
            [m(ans === plus ? R`\dfrac{\sqrt2+1}{2}` : R`\dfrac{\sqrt2-1}{2}`), 'Non si sommano i valori delle funzioni dei singoli angoli: serve la formula di addizione/sottrazione.'],
            [m(R`\dfrac{\sqrt6}{4}`), 'Manca il secondo prodotto della formula.'],
          ]),
          hints: ['Scrivi l\'angolo come $45°\\pm30°$.', 'Applica la formula di addizione o sottrazione.'],
          solution: [`${m(fn)} $=$ ${how}`, `${m(`=${ans}`)}`],
        };
      },
    },
    {
      id: 'for-addizione',
      level: 2,
      title: 'Seno della somma',
      make: (r) => {
        const [a, b, c] = pick(r, [[3, 4, 5], [4, 3, 5]] as const), [p, q, s] = pick(r, [[5, 12, 13], [12, 5, 13]] as const);
        const sum = r() < 0.5;
        const num = sum ? a * q + b * p : a * q - b * p;
        return {
          text: `Gli angoli $\\alpha$ e $\\beta$ sono acuti, con ${m(`\\sin\\alpha=${frac(a, c)}`)} e ${m(`\\sin\\beta=${frac(p, s)}`)}. Calcola ${m(`\\sin(\\alpha${sum ? '+' : '-'}\\beta)`)}.`,
          options: mc(r, m(frac(num, c * s)), [
            [m(frac(sum ? a * q - b * p : a * q + b * p, c * s)), 'Segno sbagliato: nel seno il segno tra i due prodotti è lo stesso che c\'è tra gli angoli.'],
            [m(frac(sum ? a * s + p * c : a * s - p * c, c * s)), R`$\sin(\alpha\pm\beta)\neq\sin\alpha\pm\sin\beta$.`],
            [m(frac(sum ? b * q - a * p : b * q + a * p, c * s)), 'Questo è il **coseno** della somma/differenza.'],
          ]),
          hints: [R`$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$.`, `Servono i coseni: ${m(`\\cos\\alpha=${frac(b, c)}`)}, ${m(`\\cos\\beta=${frac(q, s)}`)}.`],
          solution: [`${m(`\\cos\\alpha=${frac(b, c)}`)}, ${m(`\\cos\\beta=${frac(q, s)}`)} (angoli acuti).`, `${m(`\\sin(\\alpha${sum ? '+' : '-'}\\beta)=${frac(a, c)}\\cdot${frac(q, s)}${sum ? '+' : '-'}${frac(b, c)}\\cdot${frac(p, s)}=${frac(num, c * s)}`)}`],
        };
      },
    },
    {
      id: 'for-tan2',
      level: 2,
      title: 'Duplicazione della tangente',
      make: (r) => {
        const [n, dn] = pick(r, [[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 1], [3, 1], [3, 2]]);
        // tan 2a = 2t/(1-t^2) = 2 n dn / (dn^2 - n^2)
        return {
          text: `Sapendo che ${m(`\\tan\\alpha=${frac(n, dn)}`)}, calcola ${m('\\tan2\\alpha')}.`,
          options: mc(r, m(frac(2 * n * dn, dn * dn - n * n)), [
            [m(frac(2 * n, dn)), R`$\tan2\alpha\neq2\tan\alpha$.`],
            [m(frac(2 * n * dn, dn * dn + n * n)), 'Al denominatore c\'è $1-\\tan^2\\alpha$, con il meno (questo è $\\sin2\\alpha$).'],
            [m(frac(n * n, dn * dn)), 'Questo è il quadrato della tangente.'],
          ], [m(frac(2 * n * dn + 1, dn * dn - n * n))]),
          hints: [R`$\tan2\alpha=\dfrac{2\tan\alpha}{1-\tan^2\alpha}$.`],
          solution: [`${m(`\\tan2\\alpha=\\dfrac{2\\cdot${frac(n, dn)}}{1-${frac(n * n, dn * dn)}}=\\dfrac{${frac(2 * n, dn)}}{${frac(dn * dn - n * n, dn * dn)}}=${frac(2 * n * dn, dn * dn - n * n)}`)}`],
        };
      },
    },
    {
      id: 'for-identita',
      level: 2,
      title: 'Semplificare un\'espressione',
      make: (r) => {
        const [expr, ans, how, w1, w2] = pick(r, [
          [R`(\sin x+\cos x)^2`, R`1+\sin2x`, R`$\sin^2x+\cos^2x+2\sin x\cos x=1+\sin2x$`, R`1`, R`1+\cos2x`],
          [R`(\sin x-\cos x)^2`, R`1-\sin2x`, R`$\sin^2x+\cos^2x-2\sin x\cos x=1-\sin2x$`, R`1`, R`1+\sin2x`],
          [R`\cos^4x-\sin^4x`, R`\cos2x`, R`$(\cos^2x-\sin^2x)(\cos^2x+\sin^2x)=\cos2x\cdot1$`, R`1`, R`\cos^22x`],
          [R`2\sin x\cos x\cos2x`, R`\dfrac12\sin4x`, R`$\sin2x\cos2x=\dfrac12\sin4x$`, R`\sin4x`, R`\sin2x`],
          [R`1-2\sin^2\dfrac x2`, R`\cos x`, R`è la formula di duplicazione del coseno applicata all'angolo $\dfrac x2$`, R`\cos2x`, R`\sin x`],
          [R`\dfrac{\sin2x}{1+\cos2x}`, R`\tan x`, R`$\dfrac{2\sin x\cos x}{2\cos^2x}=\tan x$`, R`\tan2x`, R`\cot x`],
        ] as const);
        return {
          text: `Semplifica l'espressione ${m(expr)}.`,
          options: choice(r, [[m(ans), 'Corretto.'], [m(w1), 'Ricontrolla lo sviluppo: applica con cura le formule di duplicazione.'], [m(w2), 'Controlla quale formula di duplicazione stai usando.'], [m(R`2\sin x`), 'Sviluppa e usa la relazione fondamentale e le formule di duplicazione.']]),
          hints: [R`Ricorda $\sin^2x+\cos^2x=1$, $\ 2\sin x\cos x=\sin2x$, $\ \cos^2x-\sin^2x=\cos2x$.`],
          solution: [how, `Risultato: ${m(ans)}.`],
        };
      },
    },
    {
      id: 'for-ampiezza',
      level: 2,
      title: 'Ampiezza di a sin x + b cos x',
      make: (r) => {
        const [a, b, c] = pick(r, TR), s1 = pick(r, [1, -1]), s2 = pick(r, [1, -1]);
        return {
          text: `Qual è il valore massimo della funzione ${m(`y=${s1 * a}\\sin x${s2 > 0 ? '+' : '-'}${b}\\cos x`)}?`,
          answer: c,
          tol: 0,
          hints: [R`$a\sin x+b\cos x=r\sin(x+\varphi)$ con $r=\sqrt{a^2+b^2}$.`, 'Il massimo di una sinusoide è la sua ampiezza.'],
          solution: [`${m(`r=\\sqrt{${a * a}+${b * b}}=${c}`)}`, `La funzione è ${m(`y=${c}\\sin(x+\\varphi)`)}: il massimo vale ${m(c)} (non ${m(a + b)}).`],
        };
      },
    },
    {
      id: 'for-bisezione',
      level: 3,
      title: 'Bisezione',
      make: (r) => {
        const [cn, cd, sn, sd] = pick(r, [[7, 25, 3, 5], [-7, 25, 4, 5], [1, 9, 2, 3], [7, 9, 1, 3], [1, 2, 1, 2], [17, 25, 2, 5]]);
        return {
          text: `Sapendo che ${m(`\\cos\\alpha=${frac(cn, cd)}`)} con ${m('0<\\alpha<\\pi')}, calcola ${m('\\sin\\dfrac\\alpha2')}.`,
          options: mc(r, m(frac(sn, sd)), [
            [m(frac(-sn, sd)), R`Se $0<\alpha<\pi$ allora $0<\dfrac\alpha2<\dfrac\pi2$: il seno è positivo.`],
            [m(frac(cd - cn, 2 * cd)), 'Hai dimenticato la radice quadrata.'],
            [m(frac(cn, 2 * cd)), R`$\sin\dfrac\alpha2$ non è la metà del coseno (né del seno) di $\alpha$.`],
          ], [m(frac(sn + 1, sd + 1))]),
          hints: [R`$\sin\dfrac\alpha2=\pm\sqrt{\dfrac{1-\cos\alpha}{2}}$.`, 'Stabilisci il segno dal quadrante di $\\alpha/2$.'],
          solution: [`${m(`\\dfrac{1-\\cos\\alpha}{2}=\\dfrac{1-${cn < 0 ? `\\left(${frac(cn, cd)}\\right)` : frac(cn, cd)}}{2}=${frac(cd - cn, 2 * cd)}`)}`, `${m('\\dfrac\\alpha2')} è nel primo quadrante: ${m(`\\sin\\dfrac\\alpha2=\\sqrt{${frac(cd - cn, 2 * cd)}}=${frac(sn, sd)}`)}.`],
        };
      },
    },
    {
      id: 'for-aggiunto',
      level: 3,
      title: 'Angolo aggiunto',
      make: (r) => {
        const [expr, ans, how] = pick(r, [
          [R`\sin x+\sqrt3\cos x`, R`2\sin\left(x+\dfrac\pi3\right)`, R`$r=2$, $\cos\varphi=\dfrac12$, $\sin\varphi=\dfrac{\sqrt3}{2}$: $\varphi=\dfrac\pi3$`],
          [R`\sqrt3\sin x+\cos x`, R`2\sin\left(x+\dfrac\pi6\right)`, R`$r=2$, $\cos\varphi=\dfrac{\sqrt3}{2}$, $\sin\varphi=\dfrac12$: $\varphi=\dfrac\pi6$`],
          [R`\sin x+\cos x`, R`\sqrt2\sin\left(x+\dfrac\pi4\right)`, R`$r=\sqrt2$, $\cos\varphi=\sin\varphi=\dfrac{\sqrt2}{2}$: $\varphi=\dfrac\pi4$`],
          [R`\sin x-\cos x`, R`\sqrt2\sin\left(x-\dfrac\pi4\right)`, R`$r=\sqrt2$, $\cos\varphi=\dfrac{\sqrt2}{2}$, $\sin\varphi=-\dfrac{\sqrt2}{2}$: $\varphi=-\dfrac\pi4$`],
          [R`\sin x-\sqrt3\cos x`, R`2\sin\left(x-\dfrac\pi3\right)`, R`$r=2$, $\cos\varphi=\dfrac12$, $\sin\varphi=-\dfrac{\sqrt3}{2}$: $\varphi=-\dfrac\pi3$`],
        ] as const);
        const pool = [R`2\sin\left(x+\dfrac\pi3\right)`, R`2\sin\left(x+\dfrac\pi6\right)`, R`\sqrt2\sin\left(x+\dfrac\pi4\right)`, R`\sqrt2\sin\left(x-\dfrac\pi4\right)`, R`2\sin\left(x-\dfrac\pi3\right)`, R`2\sin\left(x-\dfrac\pi6\right)`];
        return {
          text: `Scrivi ${m(expr)} nella forma ${m('r\\sin(x+\\varphi)')}.`,
          options: mc(r, m(ans), [], pool.map((x) => m(x))),
          hints: [R`$r=\sqrt{a^2+b^2}$.`, R`Poi $\cos\varphi=\dfrac ar$ e $\sin\varphi=\dfrac br$.`],
          solution: [how, `${m(`${expr}=${ans}`)}`],
        };
      },
    },
    {
      id: 'for-angolo-rette',
      level: 3,
      title: 'Angolo tra due rette',
      make: (r) => {
        // Coppie con m1 ≠ m2 e 1 + m1·m2 ≠ 0 (rette né parallele né perpendicolari).
        const [m1, safe] = pick(r, [[2, 1], [3, 1], [1, -2], [3, -2], [2, -3], [4, 1], [-1, 3], [-2, -1], [3, 2], [-3, 1], [4, -2], [-4, -1]]);
        const D = 1 + m1 * safe, N = m1 - safe;
        const ans = frac(Math.abs(N), Math.abs(D));
        return {
          text: `Calcola la tangente dell'angolo acuto formato dalle rette di coefficienti angolari ${m(`m_1=${m1}`)} e ${m(`m_2=${safe}`)}.`,
          options: mc(r, m(ans), [
            [m(frac(Math.abs(m1 + safe) || 1, Math.abs(1 - m1 * safe) || 1)), 'Segni scambiati: al numeratore la differenza, al denominatore $1+m_1m_2$.'],
            [m(`${Math.abs(N)}`), 'Hai dimenticato il denominatore $1+m_1m_2$.'],
            [m(frac(Math.abs(D), Math.abs(N))), 'Rapporto invertito.'],
          ], [m(frac(Math.abs(N) + 1, Math.abs(D))), m(frac(Math.abs(N), Math.abs(D) + 1))]),
          hints: [R`$\tan\theta=\left|\dfrac{m_1-m_2}{1+m_1m_2}\right|$.`],
          solution: [`${m(`\\tan\\theta=\\left|\\dfrac{${m1}-(${safe})}{1+(${m1})(${safe})}\\right|=\\left|\\dfrac{${N}}{${D}}\\right|=${ans}`)}`],
        };
      },
    },
  ],
};
