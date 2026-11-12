// Approfondimenti dell'unità "Ellisse".
import { choice, frac, int, mc, nz, pick, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;
const TRIPLE = [[3, 5, 4], [4, 5, 3], [5, 13, 12], [12, 13, 5], [6, 10, 8], [8, 10, 6]] as const; // cateto, ipotenusa, altro cateto
/** Coefficiente davanti a un termine, senza scrivere 1. */
const co = (n: number, term: string) => (n === 1 ? term : n === -1 ? `-${term}` : `${n}${term}`);
/** (x - h)^2 scritto correttamente anche per h negativo o nullo. */
const sq = (v: string, h: number) => (h === 0 ? `${v}^2` : `(${v}${sg(-h)})^2`);

export const ellissePiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-ell-3',
      title: 'Fuochi sull\'asse y ed ellisse traslata',
      blocks: [
        { t: 'idea', md: R`L'equazione $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ descrive un'ellisse qualunque sia il maggiore tra $a$ e $b$. Se è più grande il denominatore di $y^2$ l'ellisse è "in piedi": l'asse maggiore e i fuochi stanno sull'asse $y$. Spostando poi il centro fuori dall'origine si ottiene l'ellisse traslata.` },
        { t: 'def', title: 'Ellisse con i fuochi sull\'asse y', md: R`Se $b>a$ nell'equazione $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$:
- l'asse maggiore è verticale e misura $2b$; l'asse minore misura $2a$;
- i fuochi sono $F_{1,2}(0;\pm c)$ con $c^2=b^2-a^2$;
- l'eccentricità è $e=\dfrac{c}{b}$;
- la somma delle distanze di ogni punto dai fuochi vale $2b$.

**Regola unica:** l'asse maggiore sta sull'asse della variabile con il denominatore più grande; $c^2$ è la differenza tra il denominatore maggiore e il minore; $e$ è il rapporto tra $c$ e il semiasse maggiore.` },
        {
          t: 'plot',
          title: 'Ellisse orizzontale o verticale',
          caption: R`Muovi i semiassi $a$ (lungo $x$) e $b$ (lungo $y$). I fuochi passano dall'asse $x$ all'asse $y$ quando $b$ supera $a$; per $a=b$ l'ellisse è una circonferenza e i fuochi coincidono con il centro.`,
          view: [-7, 7, -6, 6],
          params: [
            { name: 'a', label: 'a', min: 1, max: 6, step: 0.5, value: 3 },
            { name: 'b', label: 'b', min: 1, max: 5, step: 0.5, value: 5 },
          ],
          draw: (p) => {
            const c = Math.sqrt(Math.abs(p.a * p.a - p.b * p.b));
            const f = p.a >= p.b ? [[c, 0], [-c, 0]] : [[0, c], [0, -c]];
            return [
              { k: 'param', x: (t) => p.a * Math.cos(t), y: (t) => p.b * Math.sin(t), t0: 0, t1: 2 * Math.PI },
              ...f.map(([x, y]) => ({ k: 'pt' as const, x, y, label: 'F' })),
            ];
          },
          readout: (p) => {
            const c = Math.sqrt(Math.abs(p.a * p.a - p.b * p.b));
            const e = c / Math.max(p.a, p.b);
            return `Fuochi sull'asse ${p.a >= p.b ? '$x$' : '$y$'}; eccentricità $e\\approx${e.toFixed(2).replace('.', '{,}')}$`;
          },
        },
        { t: 'def', title: 'Ellisse traslata', md: R`L'ellisse con centro $C(x_0;y_0)$ e assi paralleli agli assi cartesiani ha equazione
$$\dfrac{(x-x_0)^2}{a^2}+\dfrac{(y-y_0)^2}{b^2}=1$$
Vertici e fuochi si ottengono da quelli dell'ellisse con centro nell'origine sommando $(x_0;y_0)$.

Sviluppando si ottiene un'equazione del tipo $Ax^2+Cy^2+Dx+Ey+F=0$ con $A$ e $C$ **concordi e diversi**. Per tornare alla forma canonica si usa il **completamento dei quadrati**.` },
        {
          t: 'ex',
          title: R`Riconosci la curva $4x^2+9y^2-8x-36y+4=0$.`,
          steps: [
            R`Raggruppiamo: $4(x^2-2x)+9(y^2-4y)+4=0$.`,
            R`Completiamo i quadrati: $4(x^2-2x+1)+9(y^2-4y+4)=-4+4+36$.`,
            R`$4(x-1)^2+9(y-2)^2=36$; dividendo per $36$: $\dfrac{(x-1)^2}{9}+\dfrac{(y-2)^2}{4}=1$.`,
            R`Ellisse di centro $C(1;2)$, semiassi $a=3$ e $b=2$; $c=\sqrt5$, fuochi $(1\pm\sqrt5;\,2)$.`,
          ],
        },
        { t: 'warn', md: R`Quando completi il quadrato dentro una parentesi moltiplicata per un coefficiente, a secondo membro devi aggiungere il termine **moltiplicato per quel coefficiente**: aggiungere $4$ dentro $9(\dots)$ significa aggiungere $36$.` },
        {
          t: 'quiz',
          q: R`Dove si trovano i fuochi dell'ellisse $\dfrac{x^2}{9}+\dfrac{y^2}{25}=1$?`,
          options: [
            { md: R`$(0;\pm4)$`, ok: true, why: R`Giusto: $25>9$, fuochi sull'asse $y$ con $c^2=25-9=16$.` },
            { md: R`$(\pm4;0)$`, why: R`Il denominatore più grande è quello di $y^2$: l'asse maggiore è verticale.` },
            { md: R`$(0;\pm5)$`, why: R`Questi sono i vertici sull'asse maggiore, non i fuochi.` },
          ],
        },
      ],
    },
    {
      id: 'a3-ell-4',
      title: 'Retta ed ellisse; l\'ellisse come circonferenza dilatata',
      blocks: [
        { t: 'idea', md: R`Un'ellisse è una circonferenza "schiacciata" in una direzione. Questa idea spiega la formula dell'area e permette di capire molte proprietà dell'ellisse a partire da quelle, più semplici, della circonferenza.` },
        { t: 'def', title: 'Posizione di una retta rispetto all\'ellisse', md: R`Si mette a sistema la retta con l'ellisse e si studia il discriminante dell'equazione risolvente:
- $\Delta>0$: retta **secante** (due punti);
- $\Delta=0$: retta **tangente** (un punto doppio);
- $\Delta<0$: retta **esterna**.` },
        { t: 'thm', title: 'Condizione di tangenza', md: R`La retta $y=mx+q$ è tangente all'ellisse $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ se e solo se
$$q^2=a^2m^2+b^2$$`, proof: [
          R`Sostituiamo $y=mx+q$: $b^2x^2+a^2(mx+q)^2=a^2b^2$.`,
          R`Ordiniamo: $(b^2+a^2m^2)x^2+2a^2mq\,x+a^2(q^2-b^2)=0$.`,
          R`$\dfrac\Delta4=a^4m^2q^2-a^2(b^2+a^2m^2)(q^2-b^2)=a^2b^2\,(a^2m^2+b^2-q^2)$.`,
          R`$\Delta=0$ se e solo se $q^2=a^2m^2+b^2$.`,
        ] },
        { t: 'thm', title: 'Tangente in un punto dell\'ellisse (sdoppiamento)', md: R`Se $P(x_0;y_0)$ appartiene all'ellisse, la tangente in $P$ è
$$\dfrac{x_0x}{a^2}+\dfrac{y_0y}{b^2}=1$$` },
        {
          t: 'ex',
          title: R`Trova le tangenti all'ellisse $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ parallele alla bisettrice $y=x$.`,
          steps: [
            R`Le rette parallele a $y=x$ hanno equazione $y=x+q$, cioè $m=1$.`,
            R`Condizione di tangenza: $q^2=a^2m^2+b^2=16+9=25$.`,
            R`$q=\pm5$: le tangenti sono $y=x+5$ e $y=x-5$.`,
          ],
        },
        { t: 'thm', title: 'Dilatazione e area', md: R`L'ellisse $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ si ottiene dalla circonferenza $X^2+Y^2=1$ con la dilatazione $x=aX$, $y=bY$. Una dilatazione moltiplica le aree per $a\cdot b$, quindi l'area racchiusa dall'ellisse è
$$\mathcal A=\pi ab$$
Per $a=b=r$ si ritrova l'area del cerchio $\pi r^2$.` },
        { t: 'warn', md: R`Per l'ellisse **non** vale il metodo "distanza del centro dalla retta uguale al raggio": non esiste un raggio. Si usa il discriminante oppure la condizione $q^2=a^2m^2+b^2$.` },
        {
          t: 'quiz',
          q: R`La retta $x=4$ rispetto all'ellisse $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ è:`,
          options: [
            { md: 'tangente', ok: true, why: R`Passa per il vertice $(4;0)$ ed è perpendicolare all'asse maggiore: tocca l'ellisse in un solo punto.` },
            { md: 'secante', why: R`Sostituendo $x=4$ si ottiene $y^2=0$: un solo punto.` },
            { md: 'esterna', why: R`Il punto $(4;0)$ appartiene sia alla retta sia all'ellisse.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'ell-asse-focale',
      level: 1,
      title: 'Su quale asse stanno i fuochi',
      make: (r) => {
        const u = int(r, 1, 6), v = nz(r, 1, 7, u);
        const onX = u > v;
        return {
          text: R`I fuochi dell'ellisse $\dfrac{x^2}{${u * u}}+\dfrac{y^2}{${v * v}}=1$ si trovano:`,
          options: choice(r, [
            [`sull'asse $${onX ? 'x' : 'y'}$`],
            [`sull'asse $${onX ? 'y' : 'x'}$`, 'I fuochi stanno sull\'asse maggiore, quello della variabile con il denominatore più grande.'],
            ['nel centro, perché coincidono', 'I fuochi coincidono con il centro solo se i due denominatori sono uguali (circonferenza).'],
          ]),
          hints: ['Confronta i due denominatori.'],
          solution: [R`Il denominatore maggiore è quello di $${onX ? 'x' : 'y'}^2$: l'asse maggiore, e quindi i fuochi, stanno sull'asse $${onX ? 'x' : 'y'}$.`],
        };
      },
    },
    {
      id: 'ell-fuochi-y',
      level: 2,
      title: 'Fuochi sull\'asse y',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLE);
        return {
          text: R`Trova i fuochi dell'ellisse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$.`,
          options: mc(r, R`$(0;\,\pm${c})$`, [
            [R`$(\pm${c};\,0)$`, R`Il denominatore maggiore è quello di $y^2$: i fuochi stanno sull'asse $y$.`],
            [R`$(0;\,\pm${b})$`, 'Questi sono i vertici sull\'asse maggiore.'],
            [R`$(0;\,\pm${a})$`, R`$c^2$ è la differenza dei denominatori: $c^2=${b * b}-${a * a}$.`],
          ]),
          hints: [R`$c^2=b^2-a^2$ quando $b>a$.`, 'I fuochi stanno sull\'asse maggiore.'],
          solution: [R`$b^2=${b * b}>a^2=${a * a}$: asse maggiore sull'asse $y$.`, R`$c^2=${b * b}-${a * a}=${c * c}$, $c=${c}$: fuochi $(0;\pm${c})$.`],
        };
      },
    },
    {
      id: 'ell-eccentricita-y',
      level: 2,
      title: 'Eccentricità (asse maggiore verticale)',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLE);
        return {
          text: R`Calcola l'eccentricità dell'ellisse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$.`,
          options: mc(r, `$${frac(c, b)}$`, [
            [`$${frac(c, a)}$`, 'L\'eccentricità è il rapporto tra $c$ e il semiasse **maggiore**; inoltre per un\'ellisse deve risultare minore di $1$.'],
            [`$${frac(a, b)}$`, 'Questo è il rapporto tra i semiassi, non l\'eccentricità.'],
            [`$${frac(b, c)}$`, 'Hai invertito il rapporto: per un\'ellisse $e<1$.'],
          ]),
          hints: [R`Calcola $c=\sqrt{b^2-a^2}$.`, R`$e=\dfrac{c}{\text{semiasse maggiore}}$.`],
          solution: [R`$c=\sqrt{${b * b}-${a * a}}=${c}$; il semiasse maggiore è $b=${b}$.`, R`$e=\dfrac{c}{b}=${frac(c, b)}$.`],
        };
      },
    },
    {
      id: 'ell-da-eccentricita',
      level: 3,
      title: 'Ellisse dati semiasse ed eccentricità',
      make: (r) => {
        const [c, a, b] = pick(r, TRIPLE);
        return {
          text: R`Un'ellisse con i fuochi sull'asse $x$ ha semiasse maggiore $a=${a}$ ed eccentricità $e=${frac(c, a)}$. Quanto misura il semiasse minore $b$?`,
          answer: b,
          tol: 0,
          hints: [R`Da $e=\dfrac ca$ ricava $c$.`, R`Poi $b^2=a^2-c^2$.`],
          solution: [R`$c=e\cdot a=${c}$.`, R`$b^2=a^2-c^2=${a * a}-${c * c}=${b * b}$, quindi $b=${b}$.`],
        };
      },
    },
    {
      id: 'ell-traslata-centro',
      level: 1,
      title: 'Centro di un\'ellisse traslata',
      make: (r) => {
        const h = nz(r, -6, 6), k = nz(r, -6, 6, h), a = int(r, 2, 6), b = nz(r, 1, 6, a);
        return {
          text: R`Qual è il centro dell'ellisse $\dfrac{${sq('x', h)}}{${a * a}}+\dfrac{${sq('y', k)}}{${b * b}}=1$?`,
          options: mc(r, `$${P(h, k)}$`, [
            [`$${P(-h, -k)}$`, R`Attenzione ai segni: l'equazione contiene $(x-x_0)$ e $(y-y_0)$.`],
            [`$${P(k, h)}$`, 'Hai scambiato ascissa e ordinata.'],
            [`$${P(a, b)}$`, 'Questi sono i semiassi, non le coordinate del centro.'],
          ], [`$${P(h, -k)}$`]),
          hints: [R`Confronta con $\dfrac{(x-x_0)^2}{a^2}+\dfrac{(y-y_0)^2}{b^2}=1$.`],
          solution: [R`$x-x_0=x${sg(-h)}\Rightarrow x_0=${h}$; $y-y_0=y${sg(-k)}\Rightarrow y_0=${k}$.`, R`Centro $${P(h, k)}$.`],
        };
      },
    },
    {
      id: 'ell-completa-quadrati',
      level: 3,
      title: 'Completamento dei quadrati',
      make: (r) => {
        const [A, B] = pick(r, [[4, 9], [9, 4], [1, 4], [4, 1], [9, 16], [16, 9], [1, 9], [9, 1]] as const);
        const h = nz(r, -3, 3), k = nz(r, -3, 3, h);
        const F = B * h * h + A * k * k - A * B;
        const eq = `${co(B, 'x^2')}+${co(A, 'y^2')}${sg(-2 * B * h, 'x')}${sg(-2 * A * k, 'y')}${sg(F)}=0`;
        return {
          text: R`Trova il centro dell'ellisse $${eq}$.`,
          options: mc(r, `$${P(h, k)}$`, [
            [`$${P(-h, -k)}$`, 'Segni sbagliati: completando il quadrato si ottengono $(x-x_0)^2$ e $(y-y_0)^2$.'],
            [`$${P(k, h)}$`, 'Hai scambiato le coordinate.'],
            [`$${P(B * h, A * k)}$`, R`Prima di completare il quadrato raccogli il coefficiente di $x^2$ e quello di $y^2$.`],
          ], [`$${P(h, -k)}$`, `$${P(-h, k)}$`]),
          hints: [R`Raccogli $${B}$ dai termini in $x$ e $${A}$ dai termini in $y$.`, 'Completa i quadrati dentro le parentesi.'],
          solution: [
            R`$${co(B, `(x^2${sg(-2 * h, 'x')})`)}+${co(A, `(y^2${sg(-2 * k, 'y')})`)}${sg(F)}=0$.`,
            R`Completando i quadrati: $${co(B, sq('x', h))}+${co(A, sq('y', k))}=${A * B}$.`,
            R`$\dfrac{${sq('x', h)}}{${A}}+\dfrac{${sq('y', k)}}{${B}}=1$: centro $${P(h, k)}$.`,
          ],
        };
      },
    },
    {
      id: 'ell-punto-posizione',
      level: 2,
      title: 'Posizione di un punto',
      make: (r) => {
        const a = int(r, 2, 5), b = nz(r, 2, 5, a);
        const kind = int(r, 0, 2);
        const [x0, y0] = kind === 0 ? pick(r, [[a, 0], [-a, 0], [0, b], [0, -b]] as const) : kind === 1 ? [int(r, 1, a - 1) * pick(r, [1, -1]), int(r, 0, 1) * pick(r, [1, -1])] : [a * pick(r, [1, -1]), int(r, 1, b) * pick(r, [1, -1])];
        const lhs = x0 * x0 * b * b + y0 * y0 * a * a, rhs = a * a * b * b;
        const lab = lhs === rhs ? 'appartiene all\'ellisse' : lhs < rhs ? 'è interno all\'ellisse' : 'è esterno all\'ellisse';
        const all = ['appartiene all\'ellisse', 'è interno all\'ellisse', 'è esterno all\'ellisse'];
        return {
          text: R`Rispetto all'ellisse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$, il punto $P${P(x0, y0)}$:`,
          options: choice(r, [[lab], ...all.filter((x) => x !== lab).map((x): [string, string] => [x, R`Sostituisci le coordinate nel primo membro e confronta il risultato con $1$.`])]),
          hints: [R`Calcola $\dfrac{x_0^2}{a^2}+\dfrac{y_0^2}{b^2}$.`, R`Se il risultato è $<1$ il punto è interno, se è $=1$ appartiene all'ellisse, se è $>1$ è esterno.`],
          solution: [R`$\dfrac{${x0 * x0}}{${a * a}}+\dfrac{${y0 * y0}}{${b * b}}=${frac(lhs, rhs)}$.`, `Il valore è ${lhs === rhs ? 'uguale a' : lhs < rhs ? 'minore di' : 'maggiore di'} $1$: il punto ${lab}.`],
        };
      },
    },
    {
      id: 'ell-retta-verticale',
      level: 1,
      title: 'Retta verticale ed ellisse',
      make: (r) => {
        const a = int(r, 2, 7), b = int(r, 1, 6);
        const kind = int(r, 0, 2);
        const k = (kind === 0 ? int(r, 0, a - 1) : kind === 1 ? a : a + int(r, 1, 4)) * pick(r, [1, -1]);
        const lab = ['secante', 'tangente', 'esterna'][kind];
        return {
          text: R`La retta $x=${k}$ rispetto all'ellisse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$ è:`,
          options: choice(r, [[lab], ...['secante', 'tangente', 'esterna'].filter((x) => x !== lab).map((x): [string, string] => [x, R`Confronta $|${k}|$ con il semiasse $a=${a}$.`])]),
          hints: [R`L'ellisse occupa la striscia $-${a}\le x\le${a}$.`],
          solution: [R`Il semiasse lungo $x$ è $a=${a}$ e $|${k}|=${Math.abs(k)}$.`, `${Math.abs(k) < a ? 'La retta attraversa l\'ellisse: secante.' : Math.abs(k) === a ? 'La retta passa per un vertice: tangente.' : 'La retta non incontra l\'ellisse: esterna.'}`],
        };
      },
    },
    {
      id: 'ell-tangente-m',
      level: 3,
      title: 'Condizione di tangenza',
      make: (r) => {
        const [a, b, m, q] = pick(r, [[4, 3, 1, 5], [3, 4, 1, 5], [12, 5, 1, 13], [5, 12, 1, 13], [2, 3, 2, 5], [4, 6, 2, 10], [6, 8, 1, 10], [1, 3, 4, 5], [1, 4, 3, 5]] as const);
        const s = pick(r, [1, -1]);
        return {
          text: R`Per quale valore **positivo** di $q$ la retta $y=${co(m * s, 'x')}+q$ è tangente all'ellisse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$?`,
          answer: q,
          tol: 0,
          hints: [R`Condizione di tangenza: $q^2=a^2m^2+b^2$.`, R`$a^2=${a * a}$, $b^2=${b * b}$, $m=${m * s}$.`],
          solution: [R`$q^2=a^2m^2+b^2=${a * a}\cdot${m * m}+${b * b}=${q * q}$.`, R`$q=\pm${q}$; il valore positivo è $${q}$.`],
        };
      },
    },
  ],
};
