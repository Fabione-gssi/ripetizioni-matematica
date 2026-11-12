import { choice, dec, frac, int, m, mc, nz, pick, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const P = (x: number | string, y: number | string) => `(${x};\\ ${y})`;
/** x^2/A + y^2/B = 1 */
const ell = (A: number, B: number) => `\\dfrac{x^2}{${A}}+\\dfrac{y^2}{${B}}=1`;
/** Terne (semiasse maggiore, semiasse minore, semidistanza focale). */
const TRIPLES = [[5, 4, 3], [5, 3, 4], [13, 12, 5], [13, 5, 12], [10, 8, 6], [10, 6, 8], [17, 15, 8]] as const;

export const ellisse: Unit = {
  id: 'a3-ellisse',
  year: 3,
  title: 'Ellisse',
  summary: 'Luogo geometrico, equazione canonica, fuochi, eccentricità, tangenti.',
  lessons: [
    {
      id: 'a3-ell-1',
      title: 'Definizione ed equazione canonica',
      blocks: [
        { t: 'idea', md: R`Fissa due puntine su un foglio, legaci un filo lasco e tendilo con la matita: muovendola disegni un'ellisse. Il filo ha lunghezza fissa, quindi **la somma delle distanze** della matita dalle due puntine non cambia mai. Le orbite dei pianeti sono ellissi con il Sole in uno dei fuochi.` },
        { t: 'def', title: 'Ellisse', md: R`Dati due punti $F_1$ e $F_2$ (**fuochi**), l'**ellisse** è il luogo dei punti $P$ del piano per i quali è costante la somma delle distanze dai fuochi: $$\overline{PF_1}+\overline{PF_2}=2a$$ con $2a>\overline{F_1F_2}=2c$.` },
        {
          t: 'thm',
          title: 'Equazione canonica (fuochi sull\'asse x)',
          md: R`Con i fuochi in $F_1(-c;0)$ e $F_2(c;0)$ l'ellisse ha equazione $$\frac{x^2}{a^2}+\frac{y^2}{b^2}=1\qquad\text{con}\quad b^2=a^2-c^2,\ a>b>0$$`,
          proof: [
            R`La condizione $\overline{PF_1}+\overline{PF_2}=2a$ diventa $\sqrt{(x+c)^2+y^2}+\sqrt{(x-c)^2+y^2}=2a$.`,
            R`Isoliamo un radicale ed eleviamo al quadrato: $(x+c)^2+y^2=4a^2-4a\sqrt{(x-c)^2+y^2}+(x-c)^2+y^2$.`,
            R`Semplificando: $4cx-4a^2=-4a\sqrt{(x-c)^2+y^2}$, cioè $a\sqrt{(x-c)^2+y^2}=a^2-cx$.`,
            R`Eleviamo ancora al quadrato: $a^2x^2-2a^2cx+a^2c^2+a^2y^2=a^4-2a^2cx+c^2x^2$, da cui $(a^2-c^2)x^2+a^2y^2=a^2(a^2-c^2)$.`,
            R`Poiché $a>c$ poniamo $b^2=a^2-c^2>0$: $b^2x^2+a^2y^2=a^2b^2$. Dividendo per $a^2b^2$ si ottiene $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$.`,
          ],
        },
        { t: 'def', title: 'Elementi dell\'ellisse', md: R`Per $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ con $a>b$:
- **vertici:** $(\pm a;0)$ e $(0;\pm b)$
- **asse maggiore** $2a$ (sull'asse $x$), **asse minore** $2b$
- **fuochi:** $F(\pm c;0)$ con $c=\sqrt{a^2-b^2}$
- **eccentricità:** $e=\dfrac ca$, con $0\le e<1$

Se invece $b>a$ i fuochi sono sull'asse $y$: $F(0;\pm c)$ con $c=\sqrt{b^2-a^2}$ ed $e=\dfrac cb$.

L'ellisse è simmetrica rispetto agli assi e all'origine. L'area racchiusa è $\pi ab$.` },
        {
          t: 'plot',
          title: 'Semiassi, fuochi ed eccentricità',
          caption: R`Modifica i semiassi: i fuochi stanno sempre sull'asse maggiore. Quando $a=b$ i fuochi coincidono nel centro e l'ellisse diventa una circonferenza ($e=0$).`,
          view: [-7.8, 7.8, -6, 6],
          params: [
            { name: 'a', label: 'a', min: 1, max: 7, step: 0.5, value: 5 },
            { name: 'b', label: 'b', min: 1, max: 5.5, step: 0.5, value: 3 },
          ],
          draw: (p) => {
            const c = Math.sqrt(Math.abs(p.a * p.a - p.b * p.b));
            const onX = p.a >= p.b;
            return [
              { k: 'param', x: (t) => p.a * Math.cos(t), y: (t) => p.b * Math.sin(t), t0: 0, t1: 2 * Math.PI },
              { k: 'pt', x: onX ? c : 0, y: onX ? 0 : c, label: 'F₂' },
              { k: 'pt', x: onX ? -c : 0, y: onX ? 0 : -c, label: 'F₁' },
            ];
          },
          readout: (p) => {
            const c = Math.sqrt(Math.abs(p.a * p.a - p.b * p.b));
            return `$c=${d(c)}$, $e=${d(c / Math.max(p.a, p.b))}$ — fuochi sull'asse $${p.a >= p.b ? 'x' : 'y'}$`;
          },
        },
        {
          t: 'ex',
          title: R`Studia l'ellisse $9x^2+25y^2=225$.`,
          steps: [R`Dividiamo per $225$ per ottenere la forma canonica: $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$.`, R`$a^2=25$, $b^2=9$: $a=5$, $b=3$. Poiché $a>b$ i fuochi sono sull'asse $x$.`, R`$c=\sqrt{25-9}=4$: fuochi $F(\pm4;0)$.`, R`Eccentricità $e=\dfrac45=0{,}8$; vertici $(\pm5;0)$ e $(0;\pm3)$.`],
        },
        { t: 'warn', md: R`Nell'ellisse $c^2=a^2-b^2$ (differenza), nell'iperbole $c^2=a^2+b^2$ (somma). E attenzione: $a$ e $b$ sono le **radici** dei denominatori, non i denominatori stessi.` },
        {
          t: 'quiz',
          q: R`Nell'ellisse $\dfrac{x^2}{4}+\dfrac{y^2}{9}=1$ i fuochi si trovano:`,
          options: [
            { md: 'sull\'asse $y$', ok: true, why: 'Esatto: il denominatore maggiore è sotto $y^2$, quindi l\'asse maggiore è verticale.' },
            { md: 'sull\'asse $x$', why: 'I fuochi stanno sull\'asse maggiore: confronta i due denominatori.' },
            { md: 'nell\'origine', why: 'Accadrebbe solo se i denominatori fossero uguali (circonferenza).' },
          ],
        },
      ],
    },
    {
      id: 'a3-ell-2',
      title: 'Proprietà, rette tangenti, ellisse traslata',
      blocks: [
        { t: 'idea', md: R`L'**eccentricità** dice quanto un'ellisse è "schiacciata": vicino a $0$ è quasi una circonferenza, vicino a $1$ è molto allungata. L'orbita della Terra ha $e\approx0{,}017$: è quasi circolare.` },
        {
          t: 'plot',
          title: 'La somma delle distanze è costante',
          caption: R`Ellisse con $a=5$, $b=3$ (fuochi in $(\pm4;0)$). Muovi $P$ lungo la curva: $\overline{PF_1}+\overline{PF_2}$ resta sempre uguale a $2a=10$.`,
          view: [-7.8, 7.8, -6, 6],
          params: [{ name: 't', label: 'posizione di P (gradi)', min: 0, max: 360, step: 5, value: 50 }],
          draw: (p) => {
            const t = (p.t * Math.PI) / 180, x = 5 * Math.cos(t), y = 3 * Math.sin(t);
            return [
              { k: 'param', x: (u) => 5 * Math.cos(u), y: (u) => 3 * Math.sin(u), t0: 0, t1: 2 * Math.PI },
              { k: 'seg', x1: x, y1: y, x2: -4, y2: 0, color: 'var(--plot-2)' },
              { k: 'seg', x1: x, y1: y, x2: 4, y2: 0, color: 'var(--plot-3)' },
              { k: 'pt', x: -4, y: 0, label: 'F₁' },
              { k: 'pt', x: 4, y: 0, label: 'F₂' },
              { k: 'pt', x, y, label: 'P' },
            ];
          },
          readout: (p) => {
            const t = (p.t * Math.PI) / 180, x = 5 * Math.cos(t), y = 3 * Math.sin(t);
            const d1 = Math.hypot(x + 4, y), d2 = Math.hypot(x - 4, y);
            return `$\\overline{PF_1}=${d(d1)}$, $\\overline{PF_2}=${d(d2)}$, somma $=${d(d1 + d2)}$`;
          },
        },
        { t: 'def', title: 'Retta ed ellisse', md: R`Mettendo a sistema una retta con l'ellisse si ottiene un'equazione di secondo grado: la retta è **secante** se $\Delta>0$, **tangente** se $\Delta=0$, **esterna** se $\Delta<0$.

**Tangente in un punto $P(x_0;y_0)$ dell'ellisse** (formula di sdoppiamento): $$\frac{x_0\,x}{a^2}+\frac{y_0\,y}{b^2}=1$$` },
        {
          t: 'ex',
          title: R`Trova la tangente all'ellisse $x^2+4y^2=8$ nel suo punto $P(2;1)$.`,
          steps: [R`Verifichiamo che $P$ appartiene all'ellisse: $4+4=8$ ✓.`, R`Forma canonica: $\dfrac{x^2}{8}+\dfrac{y^2}{2}=1$.`, R`Sdoppiamento: $\dfrac{2x}{8}+\dfrac{1\cdot y}{2}=1$, cioè $\dfrac x4+\dfrac y2=1$.`, R`Moltiplicando per $4$: $x+2y-4=0$. Coefficiente angolare $-\dfrac12$.`],
        },
        { t: 'def', title: 'Come determinare l\'equazione', md: R`Nell'equazione canonica compaiono due parametri ($a^2$ e $b^2$): servono **due condizioni**, per esempio
- un fuoco e un vertice;
- l'eccentricità e un semiasse;
- il passaggio per due punti (si pone $\frac{1}{a^2}=p$, $\frac{1}{b^2}=q$ e si risolve un sistema lineare).` },
        { t: 'def', title: 'Ellisse traslata', md: R`Un'ellisse con centro $C(x_C;y_C)$ e assi paralleli agli assi cartesiani ha equazione $$\frac{(x-x_C)^2}{a^2}+\frac{(y-y_C)^2}{b^2}=1$$ Si riconosce da un'equazione $px^2+qy^2+rx+sy+t=0$ con $p$ e $q$ **concordi e diversi**, completando i quadrati.` },
        {
          t: 'ex',
          title: R`Riconosci la curva $4x^2+y^2-8x+2y+1=0$.`,
          steps: [R`Raggruppiamo: $4(x^2-2x)+(y^2+2y)=-1$.`, R`Completiamo i quadrati: $4(x^2-2x+1)+(y^2+2y+1)=-1+4+1$.`, R`$4(x-1)^2+(y+1)^2=4$, cioè $(x-1)^2+\dfrac{(y+1)^2}{4}=1$.`, R`È un'ellisse di centro $(1;-1)$, semiassi $a=1$ e $b=2$, con i fuochi su una retta verticale.`],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'ell-asse',
      level: 1,
      title: 'Asse maggiore',
      make: (r) => {
        const a = int(r, 2, 9), b = int(r, 1, a - 1), swap = r() < 0.5;
        return {
          text: `Quanto misura l'asse maggiore dell'ellisse ${m(swap ? ell(b * b, a * a) : ell(a * a, b * b))}?`,
          answer: 2 * a,
          tol: 0,
          hints: ['I semiassi sono le **radici** dei denominatori.', 'L\'asse maggiore è il doppio del semiasse più grande.'],
          solution: [`Semiassi: ${m(`\\sqrt{${a * a}}=${a}`)} e ${m(`\\sqrt{${b * b}}=${b}`)}.`, `Asse maggiore: ${m(`2\\cdot${a}=${2 * a}`)} (sull'asse $${swap ? 'y' : 'x'}$).`],
        };
      },
    },
    {
      id: 'ell-fuochi',
      level: 1,
      title: 'Fuochi',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLES), onY = r() < 0.4;
        const F = (x: string, y: string) => m(`F${P(x, y)}`);
        const good = onY ? F('0', `\\pm${c}`) : F(`\\pm${c}`, '0');
        return {
          text: `Determina i fuochi dell'ellisse ${m(onY ? ell(b * b, a * a) : ell(a * a, b * b))}.`,
          options: mc(r, good, [
            [onY ? F(`\\pm${c}`, '0') : F('0', `\\pm${c}`), 'I fuochi stanno sull\'asse **maggiore**: confronta i denominatori.'],
            [onY ? F('0', `\\pm\\sqrt{${a * a + b * b}}`) : F(`\\pm\\sqrt{${a * a + b * b}}`, '0'), R`Nell'ellisse $c^2=a^2-b^2$; la somma vale per l'iperbole.`],
            [onY ? F('0', `\\pm${a * a - b * b}`) : F(`\\pm${a * a - b * b}`, '0'), 'Hai dimenticato di estrarre la radice quadrata.'],
          ]),
          hints: [R`$c^2$ è la differenza tra il denominatore maggiore e quello minore.`, 'I fuochi stanno sull\'asse maggiore.'],
          steps: [
            { ask: 'Su quale asse si trovano i fuochi?', options: choice(r, [[onY ? 'Asse $y$' : 'Asse $x$', 'Giusto: è l\'asse su cui si trova il denominatore maggiore.'], [onY ? 'Asse $x$' : 'Asse $y$', 'I fuochi stanno sull\'asse maggiore, quello con il denominatore più grande.'], ['Dipende dal punto', 'I fuochi sono punti fissi, determinati dall\'equazione.']]), explain: `Il denominatore maggiore (${m(a * a)}) è sotto $${onY ? 'y' : 'x'}^2$: fuochi sull'asse $${onY ? 'y' : 'x'}$.` },
            { ask: 'Quanto vale $c$?', options: mc(r, m(c), [[m(`\\sqrt{${a * a + b * b}}`), 'Per l\'ellisse si sottrae, non si somma.'], [m(a * a - b * b), 'Manca la radice quadrata.']], [m(c + 1), m(a - b)]), explain: `${m(`c=\\sqrt{${a * a}-${b * b}}=${c}`)}, quindi ${good}.` },
          ],
          solution: [`${m(`a^2=${a * a}`)} e ${m(`b^2=${b * b}`)} (semiasse maggiore ${m(a)} lungo l'asse $${onY ? 'y' : 'x'}$).`, `${m(`c=\\sqrt{${a * a}-${b * b}}=${c}`)}`, good],
        };
      },
    },
    {
      id: 'ell-distanze',
      level: 1,
      title: 'Somma delle distanze dai fuochi',
      make: (r) => {
        const a = int(r, 3, 9), b = int(r, 1, a - 1);
        return {
          text: `Un punto $P$ appartiene all'ellisse ${m(ell(a * a, b * b))}. Quanto vale ${m('\\overline{PF_1}+\\overline{PF_2}')}?`,
          answer: 2 * a,
          tol: 0,
          hints: ['Per definizione la somma delle distanze dai fuochi è costante e uguale all\'asse maggiore.'],
          solution: [`Per ogni punto dell'ellisse ${m('\\overline{PF_1}+\\overline{PF_2}=2a')}.`, `Qui ${m(`a=${a}`)}: la somma vale ${m(2 * a)}.`],
        };
      },
    },
    {
      id: 'ell-equazione',
      level: 1,
      title: 'Equazione dai vertici',
      make: (r) => {
        const a = int(r, 2, 8), b = int(r, 1, 7);
        const bb = b === a ? b + 1 : b;
        return {
          text: `Scrivi l'equazione dell'ellisse con centro nell'origine e vertici ${m(P(`\\pm${a}`, 0))} e ${m(P(0, `\\pm${bb}`))}.`,
          options: mc(r, m(ell(a * a, bb * bb)), [
            [m(ell(a, bb)), 'Ai denominatori vanno i **quadrati** dei semiassi.'],
            [m(ell(bb * bb, a * a)), 'Hai scambiato i semiassi: sotto $x^2$ va il quadrato del semiasse lungo l\'asse $x$.'],
            [m(`\\dfrac{x^2}{${a * a}}-\\dfrac{y^2}{${bb * bb}}=1`), 'Con il segno meno si ottiene un\'iperbole.'],
          ]),
          hints: [R`$\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ con $a$ semiasse lungo $x$ e $b$ lungo $y$.`],
          solution: [`Semiasse lungo $x$: ${m(a)}; lungo $y$: ${m(bb)}.`, `${m(ell(a * a, bb * bb))}`],
        };
      },
    },
    {
      id: 'ell-eccentricita',
      level: 2,
      title: 'Eccentricità',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLES), onY = r() < 0.4;
        return {
          text: `Calcola l'eccentricità dell'ellisse ${m(onY ? ell(b * b, a * a) : ell(a * a, b * b))}.`,
          options: mc(r, m(frac(c, a)), [
            [m(frac(b, a)), 'Questo è il rapporto tra i semiassi: l\'eccentricità è $c$ diviso il semiasse **maggiore**.'],
            [m(frac(c, b)), 'Si divide per il semiasse maggiore, non per il minore.'],
            [m(frac(a, c)), 'Rapporto invertito: nell\'ellisse $e<1$.'],
          ], [m(frac(c * c, a * a))]),
          hints: [R`$e=\dfrac{c}{a}$ con $a$ semiasse maggiore e $c=\sqrt{a^2-b^2}$.`],
          solution: [`Semiasse maggiore ${m(a)}, minore ${m(b)}.`, `${m(`c=\\sqrt{${a * a}-${b * b}}=${c}`)}`, `${m(`e=\\dfrac{${c}}{${a}}=${frac(c, a)}\\approx${dec(c / a)}`)}`],
        };
      },
    },
    {
      id: 'ell-canonica',
      level: 2,
      title: 'Riduzione a forma canonica',
      make: (r) => {
        const a = int(r, 2, 6), b = nz(r, 1, 5, a);
        // b^2 x^2 + a^2 y^2 = a^2 b^2
        return {
          text: `Scrivi in forma canonica l'ellisse ${m(`${b * b === 1 ? '' : b * b}x^2+${a * a}y^2=${a * a * b * b}`)}.`,
          options: mc(r, m(ell(a * a, b * b)), [
            [m(ell(b * b, a * a)), 'Hai scambiato i denominatori: sotto $x^2$ va il termine noto diviso per il coefficiente di $x^2$.'],
            [m(ell(a, b)), 'I denominatori sono $a^2$ e $b^2$: non bisogna estrarre la radice.'],
            [m(ell(a * a * b * b, a * a * b * b)), 'Devi dividere ogni termine per il termine noto e semplificare.'],
          ]),
          hints: ['Dividi entrambi i membri per il termine noto, così a destra ottieni $1$.', 'Semplifica le frazioni.'],
          solution: [`Dividiamo per ${m(a * a * b * b)}: ${m(`\\dfrac{${b * b}x^2}{${a * a * b * b}}+\\dfrac{${a * a}y^2}{${a * a * b * b}}=1`)}.`, `Semplificando: ${m(ell(a * a, b * b))}.`],
        };
      },
    },
    {
      id: 'ell-b2',
      level: 2,
      title: 'Ellisse dati fuoco e vertice',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLES);
        return {
          text: `Un'ellisse con centro nell'origine ha un fuoco in ${m(`F${P(c, 0)}`)} e un vertice in ${m(`A${P(a, 0)}`)}. Quanto vale $b^2$?`,
          answer: b * b,
          tol: 0,
          hints: [R`Fuochi sull'asse $x$: $c^2=a^2-b^2$.`, `Quindi ${m('b^2=a^2-c^2')}.`],
          solution: [`${m(`a=${a}`)}, ${m(`c=${c}`)}.`, `${m(`b^2=a^2-c^2=${a * a}-${c * c}=${b * b}`)}`, `Equazione: ${m(ell(a * a, b * b))}.`],
        };
      },
    },
    {
      id: 'ell-area',
      level: 2,
      title: 'Area racchiusa',
      make: (r) => {
        const a = int(r, 2, 7), b = nz(r, 1, 6, a);
        return {
          text: `Calcola l'area della regione racchiusa dall'ellisse ${m(ell(a * a, b * b))}.`,
          options: mc(r, m(`${a * b}\\pi`), [
            [m(`${a * a * b * b}\\pi`), 'Nella formula compaiono i semiassi $a$ e $b$, non i loro quadrati.'],
            [m(`${a * a}\\pi`), R`$\pi r^2$ vale per il cerchio; per l'ellisse l'area è $\pi ab$.`],
            [m(`${2 * (a + b)}\\pi`), 'Questa non è una formula di area.'],
          ], [m(`${a + b}\\pi`), m(`${2 * a * b}\\pi`)]),
          hints: [R`L'area racchiusa da un'ellisse è $\pi ab$.`],
          solution: [`${m(`a=${a}`)}, ${m(`b=${b}`)}.`, `${m(`A=\\pi ab=${a * b}\\pi`)}`],
        };
      },
    },
    {
      id: 'ell-tangente',
      level: 3,
      title: 'Tangente in un punto',
      make: (r) => {
        const p = int(r, 1, 3), q = nz(r, 1, 4, p), x0 = nz(r, -3, 3), y0 = nz(r, -3, 3);
        const K = p * x0 * x0 + q * y0 * y0;
        const eq = `${p === 1 ? '' : p}x^2+${q === 1 ? '' : q}y^2=${K}`;
        return {
          text: `Calcola il coefficiente angolare della tangente all'ellisse ${m(eq)} nel suo punto ${m(`P${P(x0, y0)}`)}.`,
          options: mc(r, m(frac(-p * x0, q * y0)), [
            [m(frac(p * x0, q * y0)), 'Errore di segno nel ricavare $y$ dall\'equazione della tangente.'],
            [m(frac(-q * y0, p * x0)), 'Hai invertito il rapporto.'],
            [m(frac(-x0, y0)), 'Hai dimenticato i coefficienti di $x^2$ e $y^2$ (questa sarebbe la pendenza per una circonferenza).'],
          ], [m(frac(y0, x0)), m(frac(-p * x0 + 1, q * y0))]),
          hints: ['Usa la formula di sdoppiamento: sostituisci $x^2$ con $x_0x$ e $y^2$ con $y_0y$.', 'Poi ricava $y$ per leggere il coefficiente angolare.'],
          solution: [`Sdoppiamento: ${m(`${p}\\cdot(${x0})\\,x+${q}\\cdot(${y0})\\,y=${K}`)}, cioè ${m(`${p * x0}x${sg(q * y0, 'y')}=${K}`)}.`, `Ricavando $y$: ${m(`m=-\\dfrac{${p * x0}}{${q * y0}}=${frac(-p * x0, q * y0)}`)}.`],
        };
      },
    },
    {
      id: 'ell-corda-focale',
      level: 3,
      title: 'Corda per il fuoco',
      make: (r) => {
        const [a, b, c] = pick(r, [[5, 4, 3], [5, 3, 4], [10, 8, 6], [10, 6, 8]] as const);
        const len = (2 * b * b) / a;
        return {
          text: `Nell'ellisse ${m(ell(a * a, b * b))} calcola la lunghezza della corda perpendicolare all'asse maggiore passante per un fuoco.`,
          answer: len,
          tol: 0.01,
          hints: [`Il fuoco è ${m(`F${P(c, 0)}`)}: la corda sta sulla retta ${m(`x=${c}`)}.`, 'Sostituisci nell\'equazione e ricava le due ordinate.'],
          solution: [`${m(`c=\\sqrt{${a * a}-${b * b}}=${c}`)}: retta ${m(`x=${c}`)}.`, `${m(`\\dfrac{${c * c}}{${a * a}}+\\dfrac{y^2}{${b * b}}=1\\Rightarrow y^2=${b * b}\\cdot\\dfrac{${a * a - c * c}}{${a * a}}\\Rightarrow y=\\pm${frac(b * b, a)}`)}`, `Lunghezza della corda: ${m(`2\\cdot${frac(b * b, a)}=${dec(len)}`)}.`],
        };
      },
    },
    {
      id: 'ell-due-punti',
      level: 3,
      title: 'Ellisse per un punto',
      make: (r) => {
        const a = pick(r, [2, 3, 4, 5]), k = pick(r, [1, 2, 3]);
        // P(a; 3k) con semiasse 2a: 1/4 + 9k^2/b^2 = 1  =>  b^2 = 12 k^2
        const b2 = 12 * k * k;
        return {
          text: `Un'ellisse con centro nell'origine e assi sugli assi cartesiani ha un vertice in ${m(`A${P(2 * a, 0)}`)} e passa per ${m(`P${P(a, 3 * k)}`)}. Quanto vale $b^2$?`,
          answer: b2,
          tol: 0,
          hints: [`Dal vertice: ${m(`a^2=${4 * a * a}`)}.`, 'Sostituisci le coordinate di $P$ nell\'equazione canonica e ricava $b^2$.'],
          solution: [`${m(`\\dfrac{x^2}{${4 * a * a}}+\\dfrac{y^2}{b^2}=1`)}`, `Passaggio per $P$: ${m(`\\dfrac{${a * a}}{${4 * a * a}}+\\dfrac{${9 * k * k}}{b^2}=1\\Rightarrow\\dfrac{${9 * k * k}}{b^2}=\\dfrac34`)}`, `${m(`b^2=\\dfrac{4\\cdot${9 * k * k}}{3}=${b2}`)}`],
        };
      },
    },
  ],
};
