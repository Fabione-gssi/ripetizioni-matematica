import { choice, frac, int, m, mc, nz, par, pick, sg } from '../../lib/gen';
import type { Shape, Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const P = (x: number | string, y: number | string) => `(${x};\\ ${y})`;

/** Equazione x^2+y^2+ax+by+c=0 in LaTeX. */
const canon = (a: number, b: number, c: number) => `x^2+y^2${sg(a, 'x')}${sg(b, 'y')}${sg(c)}=0`;
/** Equazione (x-α)^2+(y-β)^2=r2 in LaTeX. */
const centered = (al: number, be: number, r2: number) => `${al === 0 ? 'x^2' : `(x${sg(-al)})^2`}+${be === 0 ? 'y^2' : `(y${sg(-be)})^2`}=${r2}`;
const circle = (cx: number, cy: number, r: number, extra: Partial<Shape> = {}): Shape => ({ k: 'param', x: (t) => cx + r * Math.cos(t), y: (t) => cy + r * Math.sin(t), t0: 0, t1: 2 * Math.PI, ...extra }) as Shape;

export const circonferenza: Unit = {
  id: 'a3-circonferenza',
  year: 3,
  title: 'Circonferenza',
  summary: 'Equazione, centro e raggio, rette tangenti, posizioni reciproche.',
  lessons: [
    {
      id: 'a3-cir-1',
      title: 'L\'equazione della circonferenza',
      blocks: [
        { t: 'idea', md: R`Pianta un picchetto, lega una corda e cammina tenendola tesa: disegni una circonferenza. È l'insieme dei punti che si trovano tutti **alla stessa distanza** da un punto fisso.` },
        { t: 'def', title: 'Circonferenza', md: R`La **circonferenza** di centro $C(\alpha;\beta)$ e raggio $r>0$ è il luogo dei punti $P(x;y)$ del piano tali che $\overline{PC}=r$.` },
        {
          t: 'thm',
          title: 'Equazione della circonferenza',
          md: R`$$(x-\alpha)^2+(y-\beta)^2=r^2$$ Sviluppando si ottiene la **forma canonica** $$x^2+y^2+ax+by+c=0$$ con $a=-2\alpha$, $b=-2\beta$, $c=\alpha^2+\beta^2-r^2$.`,
          proof: [
            R`Per definizione $\overline{PC}=r$, cioè $\sqrt{(x-\alpha)^2+(y-\beta)^2}=r$.`,
            R`Entrambi i membri sono non negativi: elevando al quadrato si ottiene l'equazione equivalente $(x-\alpha)^2+(y-\beta)^2=r^2$.`,
            R`Sviluppiamo i quadrati: $x^2-2\alpha x+\alpha^2+y^2-2\beta y+\beta^2-r^2=0$.`,
            R`Ponendo $a=-2\alpha$, $b=-2\beta$, $c=\alpha^2+\beta^2-r^2$ si ha $x^2+y^2+ax+by+c=0$.`,
          ],
        },
        { t: 'def', title: 'Dall\'equazione a centro e raggio', md: R`Data $x^2+y^2+ax+by+c=0$: $$C\left(-\frac a2;\ -\frac b2\right)\qquad r=\sqrt{\frac{a^2}{4}+\frac{b^2}{4}-c}$$ L'equazione rappresenta una circonferenza reale solo se $\dfrac{a^2}{4}+\dfrac{b^2}{4}-c>0$.

**Come riconoscerla:** è un'equazione di secondo grado in $x$ e $y$ in cui i coefficienti di $x^2$ e $y^2$ sono **uguali** e **manca il termine** $xy$.` },
        {
          t: 'plot',
          title: 'Centro e raggio',
          caption: R`Muovi centro e raggio e osserva come cambia l'equazione.`,
          view: [-8, 8, -6, 6],
          params: [
            { name: 'a', label: 'α', min: -4, max: 4, step: 1, value: 1 },
            { name: 'b', label: 'β', min: -3, max: 3, step: 1, value: 1 },
            { name: 'r', label: 'r', min: 1, max: 5, step: 0.5, value: 3 },
          ],
          draw: (p) => [circle(p.a, p.b, p.r), { k: 'pt', x: p.a, y: p.b, label: 'C' }, { k: 'seg', x1: p.a, y1: p.b, x2: p.a + p.r, y2: p.b, dash: true }],
          readout: (p) => `$x^2+y^2${sg(-2 * p.a, 'x')}${sg(-2 * p.b, 'y')}${p.a * p.a + p.b * p.b - p.r * p.r === 0 ? '' : (p.a * p.a + p.b * p.b - p.r * p.r > 0 ? '+' : '') + d(p.a * p.a + p.b * p.b - p.r * p.r)}=0$`,
        },
        {
          t: 'ex',
          title: R`Determina centro e raggio di $x^2+y^2-4x+6y-3=0$.`,
          steps: [R`$a=-4$, $b=6$, $c=-3$.`, R`Centro: $C\left(-\dfrac{-4}{2};-\dfrac{6}{2}\right)=(2;-3)$.`, R`Raggio: $r=\sqrt{4+9+3}=\sqrt{16}=4$.`, R`In alternativa, **completando i quadrati**: $(x^2-4x+4)+(y^2+6y+9)=3+4+9$, cioè $(x-2)^2+(y+3)^2=16$.`],
        },
        { t: 'warn', md: R`Prima di leggere $a,b,c$ controlla che i coefficienti di $x^2$ e $y^2$ valgano $1$. In $2x^2+2y^2-8x+4=0$ bisogna prima dividere tutto per $2$.` },
        {
          t: 'quiz',
          q: R`Quale di queste equazioni rappresenta una circonferenza?`,
          options: [
            { md: R`$x^2+y^2-2x-3=0$`, ok: true, why: R`Esatto: $\frac{a^2}{4}+\frac{b^2}{4}-c=1+0+3=4>0$, raggio $2$.` },
            { md: R`$x^2-y^2-2x-3=0$`, why: 'I coefficienti di $x^2$ e $y^2$ sono opposti: è un\'iperbole.' },
            { md: R`$x^2+y^2+4=0$`, why: R`$\frac{a^2}{4}+\frac{b^2}{4}-c=-4<0$: nessun punto reale soddisfa l'equazione.` },
          ],
        },
      ],
    },
    {
      id: 'a3-cir-2',
      title: 'Retta e circonferenza: tangenti',
      blocks: [
        { t: 'idea', md: R`Per sapere se una retta taglia, sfiora o evita una circonferenza basta confrontare **la distanza del centro dalla retta con il raggio**: un'idea geometrica che spesso evita lunghi calcoli.` },
        { t: 'def', title: 'Posizione di una retta rispetto a una circonferenza', md: R`Detta $d$ la distanza del centro $C$ dalla retta:
- $d<r$: retta **secante** (due punti comuni);
- $d=r$: retta **tangente** (un punto comune);
- $d>r$: retta **esterna**.

In modo equivalente si studia il discriminante dell'equazione risolvente del sistema retta–circonferenza.` },
        {
          t: 'plot',
          title: 'Distanza del centro dalla retta',
          caption: R`Circonferenza di centro l'origine e raggio $3$; retta $y=mx+q$. In tratteggio la distanza del centro dalla retta.`,
          view: [-8, 8, -6, 6],
          params: [
            { name: 'm', label: 'm', min: -2, max: 2, step: 0.25, value: 0.5 },
            { name: 'q', label: 'q', min: -6, max: 6, step: 0.25, value: 2 },
          ],
          draw: (p) => {
            const k = p.q / (p.m * p.m + 1); // piede della perpendicolare: (-m k, k)
            return [circle(0, 0, 3), { k: 'fn', f: (x) => p.m * x + p.q }, { k: 'seg', x1: 0, y1: 0, x2: -p.m * k, y2: k, dash: true }, { k: 'pt', x: 0, y: 0, label: 'C' }, { k: 'pt', x: -p.m * k, y: k, label: 'H' }];
          },
          readout: (p) => {
            const dist = Math.abs(p.q) / Math.sqrt(p.m * p.m + 1);
            return `$d=${d(dist)}$, $r=3$: retta **${Math.abs(dist - 3) < 0.02 ? 'tangente (circa)' : dist < 3 ? 'secante' : 'esterna'}**`;
          },
        },
        { t: 'def', title: 'Rette tangenti', md: R`**Da un punto esterno $P$** (due tangenti): si scrive il fascio per $P$, $y-y_0=m(x-x_0)$, e si impone che la distanza del centro dalla retta sia uguale al raggio (oppure $\Delta=0$).

**In un punto $P$ della circonferenza** (una tangente): la tangente è **perpendicolare al raggio** $CP$, quindi $m_t=-\dfrac{1}{m_{CP}}$. Si può usare anche la formula di sdoppiamento: $$x_0x+y_0y+a\,\frac{x+x_0}{2}+b\,\frac{y+y_0}{2}+c=0$$` },
        {
          t: 'ex',
          title: R`Trova la tangente a $x^2+y^2=25$ nel suo punto $P(3;4)$.`,
          steps: [R`Il centro è $O(0;0)$. Il raggio $OP$ ha coefficiente angolare $m_{OP}=\dfrac43$.`, R`La tangente è perpendicolare al raggio: $m_t=-\dfrac34$.`, R`$y-4=-\dfrac34(x-3)$, cioè $3x+4y-25=0$.`, R`Controllo con lo sdoppiamento: $3x+4y=25$ ✓.`],
        },
        {
          t: 'ex',
          title: R`Trova le tangenti a $x^2+y^2=5$ condotte da $P(5;0)$.`,
          steps: [R`Fascio per $P$: $y=m(x-5)$, in forma implicita $mx-y-5m=0$.`, R`Distanza del centro $O$ dalla retta uguale al raggio: $\dfrac{|-5m|}{\sqrt{m^2+1}}=\sqrt5$.`, R`Elevando al quadrato: $25m^2=5(m^2+1)\Rightarrow 20m^2=5\Rightarrow m=\pm\dfrac12$.`, R`Tangenti: $y=\dfrac12(x-5)$ e $y=-\dfrac12(x-5)$.`],
        },
        { t: 'warn', md: R`Se cercando le tangenti da un punto esterno trovi un solo valore di $m$, non hai sbagliato: la seconda tangente è la retta **verticale** $x=x_0$, che il fascio $y-y_0=m(x-x_0)$ non contiene.` },
      ],
    },
    {
      id: 'a3-cir-3',
      title: 'Determinare l\'equazione; due circonferenze',
      blocks: [
        { t: 'idea', md: R`L'equazione di una circonferenza contiene tre parametri ($a,b,c$ oppure $\alpha,\beta,r$): servono **tre condizioni** indipendenti. Per tre punti non allineati passa una e una sola circonferenza.` },
        { t: 'def', title: 'Condizioni tipiche', md: R`- **Centro e raggio noti:** si scrive subito $(x-\alpha)^2+(y-\beta)^2=r^2$.
- **Centro e un punto $P$:** il raggio è $r=\overline{CP}$.
- **Estremi di un diametro $AB$:** il centro è il punto medio di $AB$, il raggio è $\dfrac{\overline{AB}}{2}$.
- **Tre punti:** si sostituiscono le coordinate in $x^2+y^2+ax+by+c=0$ e si risolve il sistema; oppure il centro è l'intersezione degli assi di due corde.
- **Centro e retta tangente:** il raggio è la distanza del centro dalla retta.` },
        {
          t: 'ex',
          title: R`Trova la circonferenza passante per $O(0;0)$, $A(4;0)$, $B(0;2)$.`,
          steps: [R`Passaggio per $O$: $c=0$.`, R`Passaggio per $A$: $16+4a=0\Rightarrow a=-4$.`, R`Passaggio per $B$: $4+2b=0\Rightarrow b=-2$.`, R`Equazione: $x^2+y^2-4x-2y=0$, con centro $(2;1)$ e raggio $\sqrt5$. (Il triangolo $OAB$ è rettangolo in $O$: infatti il centro è il punto medio dell'ipotenusa $AB$.)`],
        },
        { t: 'def', title: 'Posizioni reciproche di due circonferenze', md: R`Dette $d$ la distanza tra i centri e $r_1\ge r_2$ i raggi:
- $d>r_1+r_2$: **esterne**
- $d=r_1+r_2$: **tangenti esternamente**
- $r_1-r_2<d<r_1+r_2$: **secanti**
- $d=r_1-r_2$: **tangenti internamente**
- $d<r_1-r_2$: una **interna** all'altra (concentriche se $d=0$)` },
        {
          t: 'plot',
          title: 'Due circonferenze',
          caption: R`Una circonferenza fissa di raggio $3$ e una di raggio $2$ con il centro a distanza $d$.`,
          view: [-5, 9, -5, 5],
          params: [{ name: 'd', label: 'd', min: 0, max: 7, step: 0.25, value: 4 }],
          draw: (p) => [circle(0, 0, 3), circle(p.d, 0, 2), { k: 'pt', x: 0, y: 0 }, { k: 'pt', x: p.d, y: 0 }],
          readout: (p) => `$d=${d(p.d)}$, $r_1+r_2=5$, $r_1-r_2=1$: ${p.d > 5 ? 'esterne' : p.d === 5 ? 'tangenti esternamente' : p.d > 1 ? 'secanti' : p.d === 1 ? 'tangenti internamente' : 'una interna all\'altra'}`,
        },
        { t: 'def', title: 'Asse radicale', md: R`Sottraendo membro a membro le equazioni di due circonferenze (non concentriche) si ottiene un'equazione di primo grado: è una retta, l'**asse radicale**, perpendicolare alla retta dei centri. Se le circonferenze sono secanti passa per i loro due punti comuni; se sono tangenti è la tangente comune.` },
        {
          t: 'quiz',
          q: R`Due circonferenze hanno raggi $5$ e $2$ e i centri distano $3$. Sono:`,
          options: [
            { md: 'tangenti internamente', ok: true, why: R`Esatto: $d=r_1-r_2=3$.` },
            { md: 'tangenti esternamente', why: R`Sarebbero tangenti esternamente se $d=r_1+r_2=7$.` },
            { md: 'secanti', why: R`Per essere secanti serve $3<d<7$, con disuguaglianze strette.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'cir-centro',
      level: 1,
      title: 'Centro della circonferenza',
      make: (r) => {
        const al = nz(r, -5, 5), be = nz(r, -5, 5, al), rr = int(r, 1, 6);
        const a = -2 * al, b = -2 * be, c = al * al + be * be - rr * rr;
        const C = (x: number, y: number) => m(`C${P(x, y)}`);
        return {
          text: `Determina il centro della circonferenza ${m(canon(a, b, c))}.`,
          options: mc(r, C(al, be), [
            [C(-al, -be), R`Errore di segno: $C\left(-\dfrac a2;-\dfrac b2\right)$.`],
            [C(a, b), 'I coefficienti di $x$ e $y$ vanno divisi per $2$ e cambiati di segno.'],
            [C(be, al), 'Hai scambiato ascissa e ordinata.'],
          ], [C(-a, -b)]),
          hints: [R`Il centro è $C\left(-\dfrac a2;-\dfrac b2\right)$.`],
          solution: [`${m(`a=${a},\\ b=${b}`)}`, `${m(`C\\left(-\\dfrac{${a}}{2};\\ -\\dfrac{${b}}{2}\\right)=${P(al, be)}`)}`],
        };
      },
    },
    {
      id: 'cir-raggio',
      level: 1,
      title: 'Raggio della circonferenza',
      make: (r) => {
        const al = int(r, -5, 5), be = int(r, -5, 5), rr = int(r, 2, 8);
        const a = -2 * al, b = -2 * be, c = al * al + be * be - rr * rr;
        return {
          text: `Calcola il raggio della circonferenza ${m(canon(a, b, c))}.`,
          answer: rr,
          tol: 0,
          hints: [R`$r=\sqrt{\dfrac{a^2}{4}+\dfrac{b^2}{4}-c}$, oppure $r=\sqrt{\alpha^2+\beta^2-c}$ con $(\alpha;\beta)$ centro.`, `Il centro è ${m(P(al, be))}.`],
          steps: [
            { ask: 'Qual è il centro?', options: mc(r, m(P(al, be)), [[m(P(-al, -be)), 'Errore di segno: le coordinate del centro sono $-a/2$ e $-b/2$.'], [m(P(a, b)), 'Bisogna dividere per $2$ e cambiare segno.']], [m(P(al + 1, be)), m(P(al, be - 1)), m(P(al + 1, be + 1))]), explain: `${m(`C${P(al, be)}`)}.` },
            { ask: `Quanto vale ${m('r^2=\\alpha^2+\\beta^2-c')}?`, options: mc(r, m(rr * rr), [[m(al * al + be * be + c), 'Il termine noto va **sottratto**: attenzione al suo segno.'], [m(rr), 'Questo è $r$, non $r^2$... oppure controlla i calcoli.']], [m(rr * rr + 1), m(rr * rr - 2)]), explain: `${m(`r^2=${al * al}+${be * be}-${par(c)}=${rr * rr}`)}, quindi ${m(`r=${rr}`)}.` },
          ],
          solution: [`Centro ${m(P(al, be))}.`, `${m(`r=\\sqrt{${al * al}+${be * be}-${par(c)}}=\\sqrt{${rr * rr}}=${rr}`)}`],
        };
      },
    },
    {
      id: 'cir-equazione',
      level: 1,
      title: 'Equazione dati centro e raggio',
      make: (r) => {
        const al = nz(r, -5, 5), be = nz(r, -5, 5), rr = int(r, 2, 6);
        return {
          text: `Scrivi l'equazione della circonferenza di centro ${m(`C${P(al, be)}`)} e raggio ${m(rr)}.`,
          options: mc(r, m(centered(al, be, rr * rr)), [
            [m(centered(-al, -be, rr * rr)), 'Segni sbagliati: nelle parentesi compaiono $x-\\alpha$ e $y-\\beta$.'],
            [m(centered(al, be, rr)), 'Al secondo membro va il **quadrato** del raggio.'],
            [m(centered(be, al, rr * rr)), 'Hai scambiato le coordinate del centro.'],
          ]),
          hints: [R`$(x-\alpha)^2+(y-\beta)^2=r^2$.`],
          solution: [`${m(centered(al, be, rr * rr))}`, `In forma canonica: ${m(canon(-2 * al, -2 * be, al * al + be * be - rr * rr))}.`],
        };
      },
    },
    {
      id: 'cir-punto',
      level: 1,
      title: 'Posizione di un punto',
      make: (r) => {
        const [x, y] = pick(r, [[3, 4], [4, 3], [0, 5], [5, 0], [1, 2], [2, 2], [3, 3], [4, 4], [5, 2], [1, 6], [-3, 4], [-4, -4], [2, -3]]);
        const d2 = x * x + y * y;
        const kind = d2 === 25 ? 'su' : d2 < 25 ? 'in' : 'es';
        const lab = { su: 'Appartiene alla circonferenza', in: 'È interno alla circonferenza', es: 'È esterno alla circonferenza' };
        return {
          text: `Il punto ${m(`P${P(x, y)}`)} rispetto alla circonferenza ${m('x^2+y^2=25')}:`,
          options: choice(r, [[lab[kind], `Corretto: ${m(`\\overline{OP}^2=${d2}`)}.`], ...(['su', 'in', 'es'] as const).filter((k) => k !== kind).map((k): [string, string] => [lab[k], `Confronta ${m(`\\overline{OP}^2=${x * x}+${y * y}=${d2}`)} con ${m('r^2=25')}.`])]),
          hints: ['Confronta la distanza del punto dal centro con il raggio.', 'Basta sostituire le coordinate nel primo membro e confrontare con $25$.'],
          solution: [`${m(`\\overline{OP}^2=${par(x)}^2+${par(y)}^2=${d2}`)}`, `${d2 === 25 ? '$=25$: il punto appartiene alla circonferenza.' : d2 < 25 ? '$<25$: il punto è interno.' : '$>25$: il punto è esterno.'}`],
        };
      },
    },
    {
      id: 'cir-centro-punto',
      level: 2,
      title: 'Circonferenza dati centro e punto',
      make: (r) => {
        const al = int(r, -4, 4), be = int(r, -4, 4), dx = nz(r, -4, 4), dy = nz(r, -4, 4);
        const r2 = dx * dx + dy * dy;
        return {
          text: `Una circonferenza ha centro ${m(`C${P(al, be)}`)} e passa per ${m(`P${P(al + dx, be + dy)}`)}. Quanto vale $r^2$?`,
          answer: r2,
          tol: 0,
          hints: ['Il raggio è la distanza tra il centro e il punto.', R`$r^2=(x_P-x_C)^2+(y_P-y_C)^2$.`],
          solution: [`${m(`r^2=\\overline{CP}^2=(${al + dx}-${par(al)})^2+(${be + dy}-${par(be)})^2`)}`, `${m(`r^2=${dx * dx}+${dy * dy}=${r2}`)}`, `Equazione: ${m(centered(al, be, r2))}.`],
        };
      },
    },
    {
      id: 'cir-diametro',
      level: 2,
      title: 'Circonferenza di diametro dato',
      make: (r) => {
        const al = int(r, -3, 3), be = int(r, -3, 3), hx = nz(r, -3, 3), hy = nz(r, -3, 3);
        const A = [al - hx, be - hy], B = [al + hx, be + hy], r2 = hx * hx + hy * hy;
        return {
          text: `Scrivi l'equazione della circonferenza che ha per diametro il segmento di estremi ${m(`A${P(A[0], A[1])}`)} e ${m(`B${P(B[0], B[1])}`)}.`,
          options: mc(r, m(centered(al, be, r2)), [
            [m(centered(al, be, 4 * r2)), R`Hai usato come raggio l'intero diametro: $r=\dfrac{\overline{AB}}{2}$.`],
            [m(centered(-al, -be, r2)), 'Segni sbagliati nelle parentesi.'],
            [m(centered(A[0], A[1], r2)), 'Il centro è il **punto medio** del diametro, non un suo estremo.'],
          ], [m(centered(al, be, r2 + 1)), m(centered(al, be, 2 * r2))]),
          hints: ['Il centro è il punto medio di $AB$.', 'Il raggio è metà della lunghezza di $AB$ (oppure la distanza del centro da $A$).'],
          solution: [`Centro (punto medio): ${m(`C${P(al, be)}`)}.`, `${m(`r^2=\\overline{CA}^2=${hx * hx}+${hy * hy}=${r2}`)}`, `${m(centered(al, be, r2))}`],
        };
      },
    },
    {
      id: 'cir-reale',
      level: 2,
      title: 'Condizione di esistenza',
      make: (r) => {
        const al = int(r, -4, 4), be = nz(r, -4, 4);
        const a = -2 * al, b = -2 * be, lim = al * al + be * be;
        return {
          text: `Per quali valori di $k$ l'equazione ${m(`x^2+y^2${sg(a, 'x')}${sg(b, 'y')}+k=0`)} rappresenta una circonferenza reale (con raggio positivo)?`,
          options: mc(r, m(`k<${lim}`), [
            [m(`k>${lim}`), 'Verso sbagliato: il termine noto compare con il segno meno sotto radice.'],
            [m(`k<${-lim}`), R`Attenzione al segno: la condizione è $\dfrac{a^2}{4}+\dfrac{b^2}{4}-k>0$.`],
            [m(`k\\le${lim}`), `Per ${m(`k=${lim}`)} il raggio è nullo: la "circonferenza" si riduce a un punto.`],
          ]),
          hints: [R`Serve $\dfrac{a^2}{4}+\dfrac{b^2}{4}-c>0$.`],
          solution: [`${m(`\\dfrac{a^2}{4}+\\dfrac{b^2}{4}-k=${al * al}+${be * be}-k>0`)}`, `${m(`k<${lim}`)}`],
        };
      },
    },
    {
      id: 'cir-retta',
      level: 2,
      title: 'Posizione retta-circonferenza',
      make: (r) => {
        const rr = int(r, 1, 6), kind = pick(r, ['sec', 'tan', 'est'] as const);
        const dist = kind === 'tan' ? rr : kind === 'sec' ? int(r, 0, rr - 1) : rr + int(r, 1, 3);
        const [a, b] = pick(r, [[3, 4], [4, 3], [3, -4], [4, -3]]);
        const c = 5 * dist * pick(r, [1, -1]);
        const lab = { sec: 'Secante', tan: 'Tangente', est: 'Esterna' };
        const line = `${a}x${sg(b, 'y')}${sg(c)}=0`;
        return {
          text: `Stabilisci la posizione della retta ${m(line)} rispetto alla circonferenza ${m(`x^2+y^2=${rr * rr}`)}.`,
          options: choice(r, [[lab[kind], `Corretto: la distanza del centro dalla retta è ${m(dist)}, il raggio è ${m(rr)}.`], ...(['sec', 'tan', 'est'] as const).filter((k) => k !== kind).map((k): [string, string] => [lab[k], `Calcola la distanza del centro $O$ dalla retta: ${m(`d=\\dfrac{|${c}|}{5}=${dist}`)}, e confrontala con ${m(`r=${rr}`)}.`])]),
          hints: ['Calcola la distanza del centro (l\'origine) dalla retta.', R`$d=\dfrac{|c|}{\sqrt{a^2+b^2}}$ e confronta con il raggio.`],
          solution: [`Centro $O(0;0)$, raggio ${m(`r=${rr}`)}.`, `${m(`d=\\dfrac{|${c}|}{\\sqrt{${a * a}+${b * b}}}=\\dfrac{${Math.abs(c)}}{5}=${dist}`)}`, `${dist < rr ? `$d<r$: secante.` : dist === rr ? `$d=r$: tangente.` : `$d>r$: esterna.`}`],
        };
      },
    },
    {
      id: 'cir-tangente-punto',
      level: 3,
      title: 'Tangente in un punto',
      make: (r) => {
        const al = int(r, -3, 3), be = int(r, -3, 3);
        const [dx, dy] = pick(r, [[3, 4], [4, 3], [-3, 4], [4, -3], [1, 2], [2, 1], [-2, 1], [1, -3], [2, 3]]);
        const px = al + dx, py = be + dy;
        return {
          text: `La circonferenza di centro ${m(`C${P(al, be)}`)} passa per ${m(`P${P(px, py)}`)}. Qual è il coefficiente angolare della retta tangente in $P$?`,
          options: mc(r, m(frac(-dx, dy)), [
            [m(frac(dy, dx)), 'Questo è il coefficiente angolare del **raggio** $CP$: la tangente è perpendicolare al raggio.'],
            [m(frac(dx, dy)), R`Manca il segno meno: $m_t=-\dfrac{1}{m_{CP}}$.`],
            [m(frac(-dy, dx)), 'Hai cambiato il segno ma non hai fatto il reciproco.'],
          ]),
          hints: ['La tangente in $P$ è perpendicolare al raggio $CP$.', R`Calcola $m_{CP}$ e prendi l'antireciproco.`],
          solution: [`${m(`m_{CP}=\\dfrac{${py}-${par(be)}}{${px}-${par(al)}}=${frac(dy, dx)}`)}`, `${m(`m_t=-\\dfrac{1}{m_{CP}}=${frac(-dx, dy)}`)}`, `Tangente: ${m(`y${sg(-py)}=${frac(-dx, dy)}\\,(x${sg(-px)})`)}.`],
        };
      },
    },
    {
      id: 'cir-corda',
      level: 3,
      title: 'Lunghezza di una corda',
      make: (r) => {
        const [rr, dist, half] = pick(r, [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15]]);
        const horiz = r() < 0.5, s = pick(r, [1, -1]);
        return {
          text: `Calcola la lunghezza della corda che la retta ${m(`${horiz ? 'y' : 'x'}=${s * dist}`)} stacca sulla circonferenza ${m(`x^2+y^2=${rr * rr}`)}.`,
          answer: 2 * half,
          tol: 0,
          hints: ['La distanza del centro dalla retta, metà corda e il raggio formano un triangolo rettangolo.', R`Metà corda $=\sqrt{r^2-d^2}$.`],
          solution: [`Distanza del centro dalla retta: ${m(`d=${dist}`)}; raggio ${m(`r=${rr}`)}.`, `Metà corda: ${m(`\\sqrt{${rr * rr}-${dist * dist}}=${half}`)}.`, `Corda: ${m(`2\\cdot${half}=${2 * half}`)}.`],
        };
      },
    },
    {
      id: 'cir-tangente-lunghezza',
      level: 3,
      title: 'Segmento di tangente',
      make: (r) => {
        const [rr, t, dist] = pick(r, [[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 5, 13]]);
        const [ux, uy] = pick(r, [[1, 0], [0, 1], [-1, 0], [0, -1]]);
        return {
          text: `Dal punto ${m(`P${P(ux * dist, uy * dist)}`)} si conducono le tangenti alla circonferenza ${m(`x^2+y^2=${rr * rr}`)}. Quanto misura il segmento di tangente (da $P$ al punto di contatto)?`,
          answer: t,
          tol: 0,
          hints: ['Il raggio nel punto di contatto è perpendicolare alla tangente.', R`Triangolo rettangolo: $\overline{PT}=\sqrt{\overline{PO}^2-r^2}$.`],
          solution: [`${m(`\\overline{PO}=${dist}`)}, ${m(`r=${rr}`)}.`, `Il triangolo $OTP$ è rettangolo in $T$: ${m(`\\overline{PT}=\\sqrt{${dist * dist}-${rr * rr}}=${t}`)}.`],
        };
      },
    },
    {
      id: 'cir-due',
      level: 3,
      title: 'Posizione di due circonferenze',
      make: (r) => {
        const r1 = int(r, 3, 6), r2 = int(r, 1, r1 - 1);
        const kind = pick(r, ['est', 'te', 'sec', 'ti', 'int'] as const);
        const dist = kind === 'est' ? r1 + r2 + int(r, 1, 3) : kind === 'te' ? r1 + r2 : kind === 'ti' ? r1 - r2 : kind === 'int' ? 0 : r1;
        const lab = { est: 'Esterne', te: 'Tangenti esternamente', sec: 'Secanti', ti: 'Tangenti internamente', int: 'Concentriche (una interna all\'altra)' };
        const others = (['est', 'te', 'sec', 'ti', 'int'] as const).filter((k) => k !== kind).slice(0, 3);
        return {
          text: `Stabilisci la posizione reciproca delle circonferenze ${m(`x^2+y^2=${r1 * r1}`)} e ${m(centered(dist, 0, r2 * r2))}.`,
          options: choice(r, [[lab[kind], `Corretto: ${m(`d=${dist}`)}, ${m(`r_1+r_2=${r1 + r2}`)}, ${m(`r_1-r_2=${r1 - r2}`)}.`], ...others.map((k): [string, string] => [lab[k], `Confronta la distanza tra i centri ${m(`d=${dist}`)} con ${m(`r_1+r_2=${r1 + r2}`)} e ${m(`r_1-r_2=${r1 - r2}`)}.`])]),
          hints: ['Trova centri e raggi, poi calcola la distanza tra i centri.', 'Confronta $d$ con la somma e con la differenza dei raggi.'],
          solution: [`Centri ${m(P(0, 0))} e ${m(P(dist, 0))}: ${m(`d=${dist}`)}. Raggi ${m(`r_1=${r1}`)}, ${m(`r_2=${r2}`)}.`, `${m(`r_1+r_2=${r1 + r2}`)}, ${m(`r_1-r_2=${r1 - r2}`)}.`, `Quindi: ${lab[kind].toLowerCase()}.`],
        };
      },
    },
  ],
};
