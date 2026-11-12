import { choice, int, m, mc, pick, sqrtTex } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
/** k·√n in LaTeX, semplificato (k intero positivo). */
const kr = (k: number, n: number) => sqrtTex(k * k * n);

export const trigonometria: Unit = {
  id: 'a4-trigonometria',
  year: 4,
  title: 'Trigonometria',
  summary: 'Triangoli rettangoli, teorema dei seni e del coseno, area, applicazioni.',
  lessons: [
    {
      id: 'a4-tri-1',
      title: 'Triangoli rettangoli',
      blocks: [
        { t: 'idea', md: R`Come si misura l'altezza di un campanile senza salirci? Basta misurare una distanza a terra e un angolo: la trigonometria ("misura dei triangoli") nasce proprio per ricavare lati e angoli **inaccessibili** da quelli che si possono misurare.` },
        {
          t: 'thm',
          title: 'Teoremi sui triangoli rettangoli',
          md: R`In un triangolo rettangolo di ipotenusa $c$, cateti $a$ e $b$, con $\alpha$ angolo opposto ad $a$ e $\beta$ opposto a $b$:
- **un cateto** è uguale all'ipotenusa per il **seno dell'angolo opposto** (o per il coseno dell'angolo adiacente): $$a=c\,\sin\alpha=c\,\cos\beta$$
- **un cateto** è uguale all'altro cateto per la **tangente dell'angolo opposto**: $$a=b\,\tan\alpha$$`,
          proof: [
            R`Poniamo il vertice dell'angolo $\alpha$ nell'origine, con il cateto $b$ sul semiasse positivo delle $x$. Il vertice opposto ha coordinate $(b;a)$ e dista $c$ dall'origine.`,
            R`Il punto della circonferenza goniometrica sulla stessa semiretta è $(\cos\alpha;\sin\alpha)$. I due triangoli rettangoli sono **simili** con rapporto $c$.`,
            R`Quindi $b=c\cos\alpha$ e $a=c\sin\alpha$. Dividendo membro a membro: $\dfrac ab=\tan\alpha$, cioè $a=b\tan\alpha$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Risolvere un triangolo rettangolo',
          caption: R`Ipotenusa $c$ e angolo $\alpha$ determinano i due cateti: $a=c\sin\alpha$ (verticale), $b=c\cos\alpha$ (orizzontale).`,
          view: [-1, 11, -1, 8.2],
          params: [
            { name: 'c', label: 'c', min: 2, max: 10, step: 0.5, value: 8 },
            { name: 'al', label: 'α (gradi)', min: 5, max: 85, step: 5, value: 30 },
          ],
          draw: (p) => {
            const t = (p.al * Math.PI) / 180, b = p.c * Math.cos(t), a = p.c * Math.sin(t);
            return [
              { k: 'seg', x1: 0, y1: 0, x2: b, y2: 0, color: 'var(--plot-3)' },
              { k: 'seg', x1: b, y1: 0, x2: b, y2: a, color: 'var(--plot-2)' },
              { k: 'seg', x1: 0, y1: 0, x2: b, y2: a, color: 'var(--plot-1)' },
              { k: 'pt', x: 0, y: 0, label: 'α' },
            ];
          },
          readout: (p) => {
            const t = (p.al * Math.PI) / 180;
            return `$a=${d(p.c)}\\cdot\\sin${p.al}°=${d(p.c * Math.sin(t))}$, $\\ b=${d(p.c)}\\cdot\\cos${p.al}°=${d(p.c * Math.cos(t))}$`;
          },
        },
        {
          t: 'ex',
          title: R`Da un punto a $50$ m dalla base, la cima di una torre si vede sotto un angolo di elevazione di $30°$. Quanto è alta la torre?`,
          steps: [R`La torre e la distanza a terra sono i cateti di un triangolo rettangolo; l'angolo di $30°$ è opposto alla torre.`, R`$h=50\cdot\tan30°=50\cdot\dfrac{\sqrt3}{3}$.`, R`$h=\dfrac{50\sqrt3}{3}\approx28{,}9$ m.`],
        },
        { t: 'def', title: 'Applicazioni', md: R`- **Area di un triangolo:** $A=\dfrac12\,a\,b\,\sin\gamma$ (semiprodotto di due lati per il seno dell'angolo compreso).
- **Teorema della corda:** in una circonferenza di raggio $R$, una corda misura $2R\sin\alpha$, dove $\alpha$ è un angolo alla circonferenza che insiste sulla corda.
- **Coefficiente angolare:** $m=\tan\alpha$, con $\alpha$ angolo tra la retta e il semiasse positivo delle $x$.` },
        { t: 'warn', md: R`"Seno = opposto su ipotenusa, coseno = adiacente su ipotenusa, tangente = opposto su adiacente" vale **solo nei triangoli rettangoli**. Per gli altri triangoli servono i teoremi dei seni e del coseno.` },
        {
          t: 'quiz',
          q: R`In un triangolo rettangolo l'ipotenusa misura $10$ e un angolo acuto $30°$. Il cateto opposto a quell'angolo misura:`,
          options: [
            { md: '$5$', ok: true, why: R`Esatto: $10\cdot\sin30°=10\cdot\dfrac12$.` },
            { md: R`$5\sqrt3$`, why: R`Questo è il cateto **adiacente**: $10\cos30°$.` },
            { md: '$20$', why: 'Un cateto non può essere più lungo dell\'ipotenusa.' },
          ],
        },
      ],
    },
    {
      id: 'a4-tri-2',
      title: 'Triangoli qualunque: teorema dei seni e del coseno',
      blocks: [
        { t: 'idea', md: R`Un triangolo è determinato da tre elementi (di cui almeno un lato). Per "risolverlo", cioè trovare gli altri tre, bastano due strumenti: il **teorema dei seni**, che lega ogni lato all'angolo opposto, e il **teorema del coseno**, che generalizza Pitagora.` },
        {
          t: 'thm',
          title: 'Teorema dei seni',
          md: R`In ogni triangolo i lati sono proporzionali ai seni degli angoli opposti, e il rapporto è il **diametro della circonferenza circoscritta**: $$\frac{a}{\sin\alpha}=\frac{b}{\sin\beta}=\frac{c}{\sin\gamma}=2R$$`,
          proof: [
            R`Inscriviamo il triangolo nella sua circonferenza circoscritta di raggio $R$. Il lato $a$ è una corda e $\alpha$ è un angolo alla circonferenza che insiste su di essa.`,
            R`Per il teorema della corda $a=2R\sin\alpha$, cioè $\dfrac{a}{\sin\alpha}=2R$.`,
            R`Lo stesso vale per gli altri lati: $\dfrac{b}{\sin\beta}=2R$ e $\dfrac{c}{\sin\gamma}=2R$. I tre rapporti sono quindi uguali.`,
          ],
        },
        {
          t: 'thm',
          title: 'Teorema del coseno (di Carnot)',
          md: R`In ogni triangolo il quadrato di un lato è uguale alla somma dei quadrati degli altri due, diminuita del doppio prodotto di questi per il coseno dell'angolo compreso: $$c^2=a^2+b^2-2ab\cos\gamma$$ Se $\gamma=90°$ si ritrova il teorema di Pitagora.`,
          proof: [
            R`Poniamo il vertice $C$ nell'origine e il lato $a$ sul semiasse positivo delle $x$: $B(a;0)$ e $A(b\cos\gamma;\ b\sin\gamma)$.`,
            R`$c^2=\overline{AB}^2=(b\cos\gamma-a)^2+(b\sin\gamma)^2=b^2\cos^2\gamma-2ab\cos\gamma+a^2+b^2\sin^2\gamma$.`,
            R`Poiché $\cos^2\gamma+\sin^2\gamma=1$: $c^2=a^2+b^2-2ab\cos\gamma$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Dal teorema di Pitagora al teorema del coseno',
          caption: R`Due lati fissi $a=6$ e $b=4$; varia l'angolo compreso $\gamma$. Il terzo lato $c$ cresce con $\gamma$: per $\gamma=90°$ vale Pitagora.`,
          view: [-5, 8, -1, 5.5],
          params: [{ name: 'g', label: 'γ (gradi)', min: 10, max: 170, step: 5, value: 60 }],
          draw: (p) => {
            const t = (p.g * Math.PI) / 180, x = 4 * Math.cos(t), y = 4 * Math.sin(t);
            return [
              { k: 'seg', x1: 0, y1: 0, x2: 6, y2: 0, color: 'var(--plot-3)' },
              { k: 'seg', x1: 0, y1: 0, x2: x, y2: y, color: 'var(--plot-2)' },
              { k: 'seg', x1: 6, y1: 0, x2: x, y2: y, color: 'var(--plot-1)' },
              { k: 'pt', x: 0, y: 0, label: 'C' },
              { k: 'pt', x: 6, y: 0, label: 'B' },
              { k: 'pt', x, y, label: 'A' },
            ];
          },
          readout: (p) => {
            const t = (p.g * Math.PI) / 180;
            return `$c=\\sqrt{36+16-48\\cos${p.g}°}\\approx${d(Math.sqrt(52 - 48 * Math.cos(t)))}$ — Area $=\\frac12\\cdot6\\cdot4\\cdot\\sin${p.g}°\\approx${d(12 * Math.sin(t))}$`;
          },
        },
        { t: 'def', title: 'Quale teorema usare', md: R`- **Due angoli e un lato:** il terzo angolo si trova per differenza da $180°$, poi **teorema dei seni**.
- **Due lati e l'angolo compreso:** **teorema del coseno** per il terzo lato.
- **Tre lati:** **teorema del coseno** per gli angoli: $\cos\gamma=\dfrac{a^2+b^2-c^2}{2ab}$.
- **Due lati e un angolo non compreso:** teorema dei seni, facendo attenzione: possono esistere due triangoli, uno o nessuno.` },
        {
          t: 'ex',
          title: R`Due lati di un triangolo misurano $5$ e $8$ e formano un angolo di $60°$. Trova il terzo lato e l'area.`,
          steps: [R`Teorema del coseno: $c^2=25+64-2\cdot5\cdot8\cdot\cos60°=89-40=49$.`, R`$c=7$.`, R`Area: $A=\dfrac12\cdot5\cdot8\cdot\sin60°=20\cdot\dfrac{\sqrt3}{2}=10\sqrt3\approx17{,}3$.`],
        },
        { t: 'warn', md: R`Nel teorema del coseno l'angolo deve essere quello **compreso** tra i due lati usati, e opposto al lato che si calcola. Con un angolo ottuso il coseno è negativo: il termine $-2ab\cos\gamma$ diventa positivo.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'tri-cateto-seno',
      level: 1,
      title: 'Cateto dall\'ipotenusa',
      make: (r) => {
        const k = int(r, 2, 9), ang = pick(r, [30, 60]), opp = r() < 0.5;
        // ipotenusa 2k: lato opposto a 30° = k, opposto a 60° = k√3
        const short = (ang === 30) === opp;
        const good = short ? `${k}` : kr(k, 3);
        return {
          text: `In un triangolo rettangolo l'ipotenusa misura ${m(2 * k)} e un angolo acuto ${m(`${ang}°`)}. Quanto misura il cateto ${opp ? 'opposto' : 'adiacente'} a quell'angolo?`,
          options: mc(r, m(good), [
            [m(short ? kr(k, 3) : `${k}`), opp ? 'Hai usato il coseno: il cateto **opposto** richiede il seno.' : 'Hai usato il seno: il cateto **adiacente** richiede il coseno.'],
            [m(kr(k, 2)), R`$\dfrac{\sqrt2}{2}$ è il valore per $45°$.`],
            [m(4 * k), 'Un cateto non può superare l\'ipotenusa: si moltiplica, non si divide, per seno o coseno.'],
          ]),
          hints: [opp ? 'Cateto opposto $=$ ipotenusa $\\cdot$ seno dell\'angolo.' : 'Cateto adiacente $=$ ipotenusa $\\cdot$ coseno dell\'angolo.'],
          steps: [
            { ask: `Quale funzione lega il cateto ${opp ? 'opposto' : 'adiacente'} all'ipotenusa?`, options: choice(r, [[opp ? 'Seno' : 'Coseno'], [opp ? 'Coseno' : 'Seno', opp ? 'Il coseno dà il cateto adiacente.' : 'Il seno dà il cateto opposto.'], ['Tangente', 'La tangente lega tra loro i due cateti.']]), explain: opp ? R`$a=c\sin\alpha$.` : R`$b=c\cos\alpha$.` },
            { ask: `Quanto vale ${m(`${opp ? '\\sin' : '\\cos'}${ang}°`)}?`, options: choice(r, [[short ? R`$\dfrac12$` : R`$\dfrac{\sqrt3}{2}$`], [short ? R`$\dfrac{\sqrt3}{2}$` : R`$\dfrac12$`, 'Hai scambiato i valori di $30°$ e $60°$.'], [R`$\dfrac{\sqrt2}{2}$`, 'Questo è il valore per $45°$.']]), explain: `Quindi il cateto misura ${m(`${2 * k}\\cdot${short ? '\\dfrac12' : '\\dfrac{\\sqrt3}{2}'}=${good}`)}.` },
          ],
          solution: [`Cateto ${opp ? 'opposto' : 'adiacente'} $=$ ${m(`${2 * k}\\cdot${opp ? '\\sin' : '\\cos'}${ang}°`)}`, `${m(`=${2 * k}\\cdot${short ? '\\dfrac12' : '\\dfrac{\\sqrt3}{2}'}=${good}`)}`],
        };
      },
    },
    {
      id: 'tri-ipotenusa',
      level: 1,
      title: 'Ipotenusa da un cateto',
      make: (r) => {
        const k = int(r, 2, 12);
        return {
          text: `In un triangolo rettangolo un cateto misura ${m(k)} e l'angolo acuto a esso **adiacente** è di ${m('60°')}. Quanto misura l'ipotenusa?`,
          answer: 2 * k,
          tol: 0,
          hints: [R`Cateto adiacente $=$ ipotenusa $\cdot\cos\alpha$.`, 'Ricava l\'ipotenusa dividendo il cateto per il coseno.'],
          solution: [`${m(`${k}=c\\cdot\\cos60°=c\\cdot\\dfrac12`)}`, `${m(`c=${2 * k}`)}`],
        };
      },
    },
    {
      id: 'tri-tangente',
      level: 1,
      title: 'Altezza con la tangente',
      make: (r) => {
        const k = int(r, 2, 8) * 3, ang = pick(r, [30, 45, 60]);
        const good = ang === 45 ? `${k}` : ang === 60 ? kr(k, 3) : kr(k / 3, 3);
        return {
          text: `Da un punto a ${m(k)} m dalla base di un albero, la cima si vede sotto un angolo di elevazione di ${m(`${ang}°`)}. Quanti metri è alto l'albero?`,
          options: mc(r, m(good), [
            [m(ang === 60 ? kr(k / 3, 3) : ang === 30 ? kr(k, 3) : kr(k, 2)), 'Hai usato il valore della tangente di un altro angolo.'],
            [m(`${3 * k}`), 'Tra i due **cateti** la relazione è la tangente: ricontrolla il valore usato.'],
            [m(`${2 * k}`), 'Controlla: l\'altezza è distanza per tangente dell\'angolo.'],
          ], [m(kr(k, 2)), m(`${k + 3}`)]),
          hints: ['Altezza e distanza sono i due cateti di un triangolo rettangolo.', R`$h=d\cdot\tan\alpha$.`],
          solution: [`${m(`h=${k}\\cdot\\tan${ang}°`)}`, `${m(`h=${k}\\cdot${ang === 45 ? '1' : ang === 60 ? '\\sqrt3' : '\\dfrac{\\sqrt3}{3}'}=${good}`)} m.`],
        };
      },
    },
    {
      id: 'tri-area',
      level: 1,
      title: 'Area con due lati e l\'angolo compreso',
      make: (r) => {
        const a = int(r, 2, 10), b = 2 * int(r, 1, 6), ang = pick(r, [30, 150, 90]);
        const area = ang === 90 ? (a * b) / 2 : (a * b) / 4;
        return {
          text: `Due lati di un triangolo misurano ${m(a)} e ${m(b)} e formano un angolo di ${m(`${ang}°`)}. Calcola l'area.`,
          answer: area,
          tol: 0.001,
          hints: [R`$A=\dfrac12\,a\,b\,\sin\gamma$.`, ang === 150 ? R`$\sin150°=\sin30°=\dfrac12$.` : 'Usa il valore notevole del seno.'],
          solution: [`${m(`A=\\dfrac12\\cdot${a}\\cdot${b}\\cdot\\sin${ang}°`)}`, `${m(`=\\dfrac12\\cdot${a * b}\\cdot${ang === 90 ? '1' : '\\dfrac12'}=${`${area}`.replace('.', '{,}')}`)}`],
        };
      },
    },
    {
      id: 'tri-seni',
      level: 2,
      title: 'Teorema dei seni',
      make: (r) => {
        const k = int(r, 2, 9);
        const [al, be] = pick(r, [[30, 45], [45, 30], [30, 60], [60, 30], [45, 60], [30, 90]] as const);
        // a opposto ad α, cerchiamo b = a·sinβ/sinα
        const sinTex: Record<number, string> = { 30: '\\dfrac12', 45: '\\dfrac{\\sqrt2}{2}', 60: '\\dfrac{\\sqrt3}{2}', 90: '1' };
        const a = al === 45 && be === 30 ? 2 * k : al === 60 && be === 30 ? 3 * k : al === 45 && be === 60 ? 2 * k : k;
        const good = al === 30 && be === 45 ? kr(k, 2) : al === 45 && be === 30 ? kr(k, 2) : al === 30 && be === 60 ? kr(k, 3) : al === 60 && be === 30 ? kr(k, 3) : al === 45 && be === 60 ? kr(k, 6) : `${2 * k}`;
        return {
          text: `In un triangolo il lato $a$ misura ${m(a)}, l'angolo opposto ${m(`\\alpha=${al}°`)} e l'angolo ${m(`\\beta=${be}°`)}. Quanto misura il lato $b$ opposto a $\\beta$?`,
          options: mc(r, m(good), [
            [m(`${a}`), 'Lati opposti ad angoli diversi sono diversi.'],
            [m(kr(a, 2)), 'Ricontrolla i valori dei seni e il rapporto.'],
            [m(kr(a, 3)), 'Ricontrolla i valori dei seni e il rapporto.'],
          ], [m(`${2 * a}`), m(kr(a, 6)), m(`${a + 1}`)]),
          hints: [R`$\dfrac{a}{\sin\alpha}=\dfrac{b}{\sin\beta}$.`, R`Quindi $b=\dfrac{a\,\sin\beta}{\sin\alpha}$.`],
          solution: [`${m(`b=\\dfrac{a\\sin\\beta}{\\sin\\alpha}=\\dfrac{${a}\\cdot${sinTex[be]}}{${sinTex[al]}}`)}`, `${m(`b=${good}`)}`],
        };
      },
    },
    {
      id: 'tri-coseno',
      level: 2,
      title: 'Teorema del coseno',
      make: (r) => {
        const [a, b, g, c] = pick(r, [[3, 8, 60, 7], [5, 8, 60, 7], [7, 15, 60, 13], [8, 15, 60, 13], [3, 5, 120, 7], [7, 8, 120, 13], [5, 16, 120, 19], [6, 10, 120, 14], [6, 16, 60, 14]] as const);
        const prod = g === 60 ? -a * b : a * b;
        return {
          text: `Due lati di un triangolo misurano ${m(a)} e ${m(b)} e l'angolo tra essi compreso è di ${m(`${g}°`)}. Quanto misura il terzo lato?`,
          answer: c,
          tol: 0,
          hints: [R`$c^2=a^2+b^2-2ab\cos\gamma$.`, g === 60 ? R`$\cos60°=\dfrac12$.` : R`$\cos120°=-\dfrac12$: il doppio prodotto diventa positivo.`],
          steps: [
            { ask: `Quanto vale ${m(`\\cos${g}°`)}?`, options: choice(r, [[g === 60 ? R`$\dfrac12$` : R`$-\dfrac12$`], [g === 60 ? R`$-\dfrac12$` : R`$\dfrac12$`, g === 60 ? 'Un angolo acuto ha coseno positivo.' : 'Un angolo ottuso ha coseno negativo.'], [R`$\dfrac{\sqrt3}{2}$`, 'Questo è il seno dell\'angolo.']]), explain: `${m(`\\cos${g}°=${g === 60 ? '' : '-'}\\dfrac12`)}.` },
            { ask: `Quanto vale ${m('c^2=a^2+b^2-2ab\\cos\\gamma')}?`, options: mc(r, m(c * c), [[m(a * a + b * b), 'Hai dimenticato il termine $-2ab\\cos\\gamma$ (questo è Pitagora).'], [m(a * a + b * b - prod), 'Segno sbagliato nel doppio prodotto.'], [m(a * a + b * b + 2 * prod), R`$2ab\cdot\dfrac12=ab$: hai dimenticato di moltiplicare per il coseno.`]]), explain: `${m(`c^2=${a * a}+${b * b}${prod < 0 ? '-' : '+'}${a * b}=${c * c}`)}, quindi ${m(`c=${c}`)}.` },
          ],
          solution: [`${m(`c^2=${a * a}+${b * b}-2\\cdot${a}\\cdot${b}\\cdot\\cos${g}°`)}`, `${m(`c^2=${a * a + b * b}${prod < 0 ? '-' : '+'}${a * b}=${c * c}`)}`, `${m(`c=${c}`)}`],
        };
      },
    },
    {
      id: 'tri-circoscritta',
      level: 2,
      title: 'Raggio della circonferenza circoscritta',
      make: (r) => {
        const k = int(r, 2, 12), ang = pick(r, [30, 150, 90]);
        const a = ang === 90 ? 2 * k : k; // 2R = a / sin α
        return {
          text: `In un triangolo un lato misura ${m(a)} e l'angolo opposto ${m(`${ang}°`)}. Quanto misura il raggio della circonferenza circoscritta?`,
          answer: k,
          tol: 0,
          hints: [R`$\dfrac{a}{\sin\alpha}=2R$.`],
          solution: [`${m(`2R=\\dfrac{${a}}{\\sin${ang}°}=\\dfrac{${a}}{${ang === 90 ? '1' : '1/2'}}=${2 * k}`)}`, `${m(`R=${k}`)}`],
        };
      },
    },
    {
      id: 'tri-corda',
      level: 2,
      title: 'Teorema della corda',
      make: (r) => {
        const R0 = int(r, 2, 10), ang = pick(r, [30, 45, 60, 90]);
        const good = ang === 30 ? `${R0}` : ang === 90 ? `${2 * R0}` : ang === 45 ? kr(R0, 2) : kr(R0, 3);
        return {
          text: `In una circonferenza di raggio ${m(R0)}, quanto misura una corda su cui insiste un angolo alla circonferenza di ${m(`${ang}°`)}?`,
          options: mc(r, m(good), [], [`${R0}`, `${2 * R0}`, kr(R0, 2), kr(R0, 3), `${R0 * 3}`].map((x) => m(x))),
          hints: [R`Corda $=2R\sin\alpha$, con $\alpha$ angolo alla circonferenza.`],
          solution: [`${m(`\\text{corda}=2\\cdot${R0}\\cdot\\sin${ang}°=${good}`)}`],
        };
      },
    },
    {
      id: 'tri-angolo',
      level: 3,
      title: 'Angolo dai tre lati',
      make: (r) => {
        const [a, b, c, g] = pick(r, [[3, 5, 7, 120], [7, 8, 13, 120], [3, 8, 7, 60], [5, 8, 7, 60], [3, 4, 5, 90], [5, 12, 13, 90], [7, 15, 13, 60], [5, 16, 19, 120]] as const);
        return {
          text: `Un triangolo ha i lati di misura ${m(a)}, ${m(b)} e ${m(c)}. Quanti gradi misura l'angolo opposto al lato ${m(c)}?`,
          answer: g,
          tol: 0,
          hints: [R`Dal teorema del coseno: $\cos\gamma=\dfrac{a^2+b^2-c^2}{2ab}$.`, 'Riconosci l\'angolo dal valore del coseno.'],
          solution: [`${m(`\\cos\\gamma=\\dfrac{${a * a}+${b * b}-${c * c}}{2\\cdot${a}\\cdot${b}}=\\dfrac{${a * a + b * b - c * c}}{${2 * a * b}}=${g === 90 ? '0' : g === 60 ? '\\dfrac12' : '-\\dfrac12'}`)}`, `${m(`\\gamma=${g}°`)}`],
        };
      },
    },
    {
      id: 'tri-navi',
      level: 3,
      title: 'Problema: distanza tra due punti',
      make: (r) => {
        const [a, b, g, c] = pick(r, [[3, 5, 120, 7], [7, 8, 120, 13], [3, 8, 60, 7], [5, 8, 60, 7], [6, 10, 120, 14], [8, 15, 60, 13]] as const);
        return {
          text: `Due navi partono dallo stesso porto lungo rotte rettilinee che formano un angolo di ${m(`${g}°`)}. Quando la prima ha percorso ${m(a)} km e la seconda ${m(b)} km, quanti chilometri distano tra loro?`,
          answer: c,
          tol: 0,
          hints: ['Porto e navi sono i vertici di un triangolo: conosci due lati e l\'angolo compreso.', 'Applica il teorema del coseno.'],
          solution: [`${m(`d^2=${a * a}+${b * b}-2\\cdot${a}\\cdot${b}\\cdot\\cos${g}°`)}`, `${m(`d^2=${a * a + b * b}${g === 60 ? '-' : '+'}${a * b}=${c * c}`)}`, `${m(`d=${c}`)} km.`],
        };
      },
    },
    {
      id: 'tri-parallelogramma',
      level: 3,
      title: 'Area di un parallelogramma',
      make: (r) => {
        const a = int(r, 3, 10), b = 2 * int(r, 2, 6), ang = pick(r, [30, 150]);
        return {
          text: `Un parallelogramma ha i lati di ${m(a)} cm e ${m(b)} cm e un angolo di ${m(`${ang}°`)}. Calcola la sua area in cm².`,
          answer: (a * b) / 2,
          tol: 0,
          hints: ['Una diagonale divide il parallelogramma in due triangoli uguali.', R`Area $=a\,b\,\sin\gamma$.`],
          solution: [`Ogni triangolo ha area ${m(`\\dfrac12\\cdot${a}\\cdot${b}\\cdot\\sin${ang}°`)}; il parallelogramma è il doppio.`, `${m(`A=${a}\\cdot${b}\\cdot\\dfrac12=${(a * b) / 2}`)} cm².`],
        };
      },
    },
  ],
};
