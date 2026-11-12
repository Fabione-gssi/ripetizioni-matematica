// Approfondimenti dell'unità "Iperbole" e visione d'insieme sulle coniche.
import { choice, frac, int, mc, nz, pick, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;
const TRIPLE = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]] as const; // a, b, c con c² = a² + b²
const sq = (v: string, h: number) => (h === 0 ? `${v}^2` : `(${v}${sg(-h)})^2`);

export const iperbolePiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-ipe-3',
      title: 'Fuochi sull\'asse y, iperbole traslata, iperbole riferita agli asintoti',
      blocks: [
        { t: 'idea', md: R`Come l'ellisse, anche l'iperbole può avere i fuochi sull'asse $y$ oppure il centro fuori dall'origine. In più, quando è equilatera, conviene spesso usare come assi cartesiani i suoi stessi asintoti: si ottiene la semplicissima equazione $xy=k$ della proporzionalità inversa.` },
        { t: 'def', title: 'Iperbole con i fuochi sull\'asse y', md: R`L'equazione
$$\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=-1$$
rappresenta un'iperbole con i fuochi sull'asse $y$:
- vertici reali $(0;\pm b)$; l'iperbole non incontra l'asse $x$;
- fuochi $F_{1,2}(0;\pm c)$ con $c^2=a^2+b^2$;
- eccentricità $e=\dfrac{c}{b}$;
- asintoti $y=\pm\dfrac{b}{a}x$ (gli stessi dell'iperbole con secondo membro $+1$).

Le due iperboli $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=\pm1$ si dicono **coniugate**: hanno gli stessi asintoti e occupano le due coppie di angoli opposti che essi formano.` },
        {
          t: 'plot',
          title: 'Iperboli coniugate',
          caption: R`In blu $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ (fuochi sull'asse $x$), in rosso la coniugata con secondo membro $-1$ (fuochi sull'asse $y$). Le rette tratteggiate sono gli asintoti comuni.`,
          view: [-8, 8, -7, 7],
          params: [
            { name: 'a', label: 'a', min: 1, max: 4, step: 0.5, value: 2 },
            { name: 'b', label: 'b', min: 1, max: 4, step: 0.5, value: 1.5 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => (p.b / p.a) * x, dash: true },
            { k: 'fn', f: (x) => -(p.b / p.a) * x, dash: true },
            { k: 'param', x: (t) => p.a * Math.cosh(t), y: (t) => p.b * Math.sinh(t), t0: -2.5, t1: 2.5 },
            { k: 'param', x: (t) => -p.a * Math.cosh(t), y: (t) => p.b * Math.sinh(t), t0: -2.5, t1: 2.5 },
            { k: 'param', x: (t) => p.a * Math.sinh(t), y: (t) => p.b * Math.cosh(t), t0: -2.5, t1: 2.5, color: '#c0392b' },
            { k: 'param', x: (t) => p.a * Math.sinh(t), y: (t) => -p.b * Math.cosh(t), t0: -2.5, t1: 2.5, color: '#c0392b' },
          ],
        },
        { t: 'def', title: 'Iperbole traslata', md: R`L'iperbole di centro $C(x_0;y_0)$ con assi paralleli agli assi cartesiani ha equazione
$$\dfrac{(x-x_0)^2}{a^2}-\dfrac{(y-y_0)^2}{b^2}=\pm1$$
Gli asintoti passano per il centro: $y-y_0=\pm\dfrac ba(x-x_0)$. Sviluppando si ottiene $Ax^2+Cy^2+Dx+Ey+F=0$ con $A$ e $C$ **discordi**; per tornare alla forma canonica si completano i quadrati.` },
        {
          t: 'ex',
          title: R`Riconosci la curva $x^2-4y^2-2x-16y-19=0$.`,
          steps: [
            R`Raggruppiamo: $(x^2-2x)-4(y^2+4y)=19$.`,
            R`Completiamo i quadrati: $(x^2-2x+1)-4(y^2+4y+4)=19+1-16$.`,
            R`$(x-1)^2-4(y+2)^2=4$, cioè $\dfrac{(x-1)^2}{4}-(y+2)^2=1$.`,
            R`Iperbole di centro $C(1;-2)$, $a=2$, $b=1$, fuochi sulla retta $y=-2$; asintoti $y+2=\pm\dfrac12(x-1)$.`,
          ],
        },
        { t: 'thm', title: 'Iperbole equilatera riferita agli asintoti', md: R`L'equazione $xy=k$ ($k\neq0$) rappresenta un'iperbole equilatera che ha per asintoti gli **assi cartesiani**.
- Se $k>0$ i rami stanno nel I e III quadrante; i vertici sono $(\sqrt k;\sqrt k)$ e $(-\sqrt k;-\sqrt k)$, i fuochi $(\pm\sqrt{2k};\pm\sqrt{2k})$.
- Se $k<0$ i rami stanno nel II e IV quadrante.

L'asse trasverso è la bisettrice $y=x$ (per $k>0$) e l'eccentricità vale sempre $\sqrt2$.` },
        {
          t: 'quiz',
          q: R`Quali sono i vertici dell'iperbole $\dfrac{x^2}{9}-\dfrac{y^2}{16}=-1$?`,
          options: [
            { md: R`$(0;\pm4)$`, ok: true, why: R`Giusto: con secondo membro $-1$ i vertici stanno sull'asse $y$, a distanza $b=4$ dal centro.` },
            { md: R`$(\pm3;0)$`, why: R`Per $y=0$ si avrebbe $x^2=-9$: l'iperbole non incontra l'asse $x$.` },
            { md: R`$(0;\pm5)$`, why: R`Questi sono i fuochi: $c=\sqrt{9+16}=5$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-ipe-4',
      title: 'Retta e iperbole; le coniche in uno sguardo',
      blocks: [
        { t: 'idea', md: R`Circonferenza, ellisse, parabola e iperbole sono membri di una stessa famiglia: si ottengono tutte tagliando un cono con un piano, e per questo si chiamano **coniche**. Un solo numero, l'eccentricità, dice di quale curva si tratta.` },
        { t: 'def', title: 'Retta e iperbole', md: R`Mettendo a sistema una retta con un'iperbole:
- se la risolvente è di secondo grado, $\Delta>0$ dà una retta **secante**, $\Delta=0$ una **tangente**, $\Delta<0$ una retta **esterna**;
- se la retta è **parallela a un asintoto** la risolvente si abbassa al primo grado: la retta incontra l'iperbole in **un solo punto**, ma non è tangente;
- gli asintoti non hanno punti in comune con l'iperbole.

**Condizione di tangenza** per $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ e la retta $y=mx+q$: $\ q^2=a^2m^2-b^2$.

**Sdoppiamento:** la tangente nel punto $P(x_0;y_0)$ dell'iperbole è $\dfrac{x_0x}{a^2}-\dfrac{y_0y}{b^2}=1$.` },
        {
          t: 'ex',
          title: R`Trova le tangenti all'iperbole $\dfrac{x^2}{25}-\dfrac{y^2}{9}=1$ parallele alla retta $y=x$.`,
          steps: [
            R`Rette $y=x+q$, con $m=1$.`,
            R`Condizione di tangenza: $q^2=a^2m^2-b^2=25-9=16$.`,
            R`$q=\pm4$: tangenti $y=x+4$ e $y=x-4$.`,
            R`Osserva che esistono perché $|m|=1$ è maggiore della pendenza degli asintoti, $\dfrac35$: con $|m|<\dfrac ba$ si avrebbe $q^2<0$ e nessuna tangente.`,
          ],
        },
        { t: 'warn', md: R`"Un solo punto in comune" **non** significa sempre "tangente". Per l'iperbole (e per la parabola, con le rette parallele all'asse) esistono rette che attraversano la curva in un unico punto. La tangenza corrisponde a un'intersezione **doppia**, cioè a $\Delta=0$ in un'equazione di secondo grado.` },
        { t: 'def', title: 'Le coniche come luoghi: fuoco, direttrice, eccentricità', md: R`Una conica è il luogo dei punti $P$ per cui è costante il rapporto tra la distanza da un punto fisso $F$ (fuoco) e la distanza da una retta fissa $d$ (direttrice):
$$\dfrac{\overline{PF}}{\overline{Pd}}=e$$
- $0<e<1$: **ellisse**;
- $e=1$: **parabola**;
- $e>1$: **iperbole**.

La circonferenza è il caso limite $e=0$. Per ellisse e iperbole $e=\dfrac ca$, con $a$ semiasse sull'asse focale.` },
        { t: 'def', title: 'Riconoscere una conica dall\'equazione', md: R`Un'equazione $Ax^2+Cy^2+Dx+Ey+F=0$ (senza termine in $xy$), se rappresenta una curva non degenere, è:
- una **circonferenza** se $A=C$;
- un'**ellisse** se $A$ e $C$ sono concordi e diversi;
- un'**iperbole** se $A$ e $C$ sono discordi;
- una **parabola** se uno solo tra $A$ e $C$ è nullo.

Geometricamente: tagliando un cono a due falde con un piano si ottiene un'ellisse se il piano incontra tutte le generatrici di una falda, una parabola se è parallelo a una generatrice, un'iperbole se taglia entrambe le falde.` },
        {
          t: 'quiz',
          q: R`Quanti punti ha in comune la retta $y=x+1$ con l'iperbole $x^2-y^2=1$?`,
          options: [
            { md: 'Uno', ok: true, why: R`La retta è parallela all'asintoto $y=x$: sostituendo si ottiene $-2x-1=1$, cioè solo $x=-1$.` },
            { md: 'Due', why: R`Sostituendo, i termini $x^2$ si eliminano: l'equazione è di primo grado.` },
            { md: 'Nessuno', why: R`Solo gli asintoti stessi non incontrano l'iperbole; una parallela diversa la incontra in un punto.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'ipe-vertici-y',
      level: 1,
      title: 'Vertici (fuochi sull\'asse y)',
      make: (r) => {
        const a = int(r, 1, 6), b = nz(r, 2, 7, a);
        return {
          text: R`Quali sono i vertici dell'iperbole $\dfrac{x^2}{${a * a}}-\dfrac{y^2}{${b * b}}=-1$?`,
          options: mc(r, R`$(0;\,\pm${b})$`, [
            [R`$(\pm${a};\,0)$`, R`Questi sarebbero i vertici se il secondo membro fosse $+1$: con $-1$ l'iperbole non incontra l'asse $x$.`],
            [R`$(0;\,\pm${b * b})$`, R`Il denominatore è $b^2$: bisogna estrarre la radice.`],
            [R`$(\pm${b};\,0)$`, 'I vertici stanno sull\'asse $y$.'],
          ]),
          hints: [R`Poni $x=0$ nell'equazione.`],
          solution: [R`Per $x=0$: $-\dfrac{y^2}{${b * b}}=-1\Rightarrow y^2=${b * b}\Rightarrow y=\pm${b}$.`, R`Vertici $(0;\pm${b})$.`],
        };
      },
    },
    {
      id: 'ipe-fuochi-y',
      level: 2,
      title: 'Fuochi sull\'asse y',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLE);
        return {
          text: R`Trova i fuochi dell'iperbole $\dfrac{x^2}{${a * a}}-\dfrac{y^2}{${b * b}}=-1$.`,
          options: mc(r, R`$(0;\,\pm${c})$`, [
            [R`$(\pm${c};\,0)$`, R`Con secondo membro $-1$ i fuochi stanno sull'asse $y$.`],
            [R`$(0;\,\pm${b})$`, 'Questi sono i vertici, non i fuochi.'],
            [R`$(0;\,\pm${a})$`, R`Per l'iperbole $c^2=a^2+b^2$.`],
          ]),
          hints: [R`$c^2=a^2+b^2$.`, R`Il secondo membro è $-1$: asse focale verticale.`],
          solution: [R`$c^2=${a * a}+${b * b}=${c * c}$, $c=${c}$.`, R`Fuochi sull'asse $y$: $(0;\pm${c})$.`],
        };
      },
    },
    {
      id: 'ipe-traslata-centro',
      level: 2,
      title: 'Centro di un\'iperbole traslata',
      make: (r) => {
        const h = nz(r, -6, 6), k = nz(r, -6, 6, h), a = int(r, 1, 5), b = int(r, 1, 5);
        return {
          text: R`In quale punto si intersecano gli asintoti dell'iperbole $\dfrac{${sq('x', h)}}{${a * a}}-\dfrac{${sq('y', k)}}{${b * b}}=1$?`,
          options: mc(r, `$${P(h, k)}$`, [
            [`$${P(-h, -k)}$`, R`Attenzione ai segni: l'equazione contiene $(x-x_0)$ e $(y-y_0)$.`],
            [`$${P(0, 0)}$`, 'Gli asintoti passano per l\'origine solo se il centro è l\'origine.'],
            [`$${P(k, h)}$`, 'Hai scambiato ascissa e ordinata.'],
          ]),
          hints: ['Gli asintoti si incontrano nel centro dell\'iperbole.', R`Confronta con $\dfrac{(x-x_0)^2}{a^2}-\dfrac{(y-y_0)^2}{b^2}=1$.`],
          solution: [R`Il centro è $${P(h, k)}$: gli asintoti $y${sg(-k)}=\pm${frac(b, a)}(x${sg(-h)})$ passano entrambi per quel punto.`],
        };
      },
    },
    {
      id: 'ipe-xy-vertici',
      level: 2,
      title: 'Vertici di xy = k',
      make: (r) => {
        const s = int(r, 2, 7), k = s * s;
        return {
          text: R`Quali sono i vertici dell'iperbole equilatera $xy=${k}$?`,
          options: mc(r, R`$(${s};${s})$ e $(-${s};-${s})$`, [
            [R`$(${k};${k})$ e $(-${k};-${k})$`, R`Sulla bisettrice $y=x$ si ha $x^2=${k}$: bisogna estrarre la radice.`],
            [R`$(${s};-${s})$ e $(-${s};${s})$`, R`Con $k>0$ le coordinate hanno lo stesso segno: i rami stanno nel I e III quadrante.`],
            [R`$(${s};0)$ e $(-${s};0)$`, 'Gli assi cartesiani sono gli asintoti: l\'iperbole non li incontra.'],
          ]),
          hints: [R`I vertici sono le intersezioni con l'asse trasverso, la bisettrice $y=x$.`],
          solution: [R`Con $y=x$: $x^2=${k}\Rightarrow x=\pm${s}$.`, R`Vertici $(${s};${s})$ e $(-${s};-${s})$.`],
        };
      },
    },
    {
      id: 'ipe-xy-fuochi',
      level: 3,
      title: 'Fuochi di xy = k',
      make: (r) => {
        const s = int(r, 1, 6);
        return {
          text: R`Qual è l'ascissa del fuoco che si trova nel primo quadrante per l'iperbole equilatera $xy=${2 * s * s}$?`,
          answer: 2 * s,
          tol: 0,
          hints: [R`Per $xy=k$ con $k>0$ i fuochi sono $(\pm\sqrt{2k};\pm\sqrt{2k})$.`],
          solution: [R`$\sqrt{2k}=\sqrt{${4 * s * s}}=${2 * s}$.`, R`Fuochi $(${2 * s};${2 * s})$ e $(-${2 * s};-${2 * s})$.`],
        };
      },
    },
    {
      id: 'ipe-equilatera-fuoco',
      level: 2,
      title: 'Fuochi dell\'iperbole equilatera',
      make: (r) => {
        const s = int(r, 1, 6);
        return {
          text: R`Qual è l'ascissa **positiva** dei fuochi dell'iperbole equilatera $x^2-y^2=${2 * s * s}$?`,
          answer: 2 * s,
          tol: 0,
          hints: [R`Nell'iperbole equilatera $a=b$, quindi $c^2=2a^2$.`, R`Qui $a^2=${2 * s * s}$.`],
          solution: [R`$a^2=b^2=${2 * s * s}$.`, R`$c^2=a^2+b^2=${4 * s * s}$, $c=${2 * s}$: fuochi $(\pm${2 * s};0)$.`],
        };
      },
    },
    {
      id: 'ipe-parallela-asintoto',
      level: 2,
      title: 'Retta parallela a un asintoto',
      make: (r) => {
        const a = int(r, 1, 5), b = int(r, 1, 5), q = nz(r, -6, 6), s = pick(r, [1, -1]);
        const slope = frac(s * b, a);
        const mx = slope === '1' ? 'x' : slope === '-1' ? '-x' : `${slope}x`;
        return {
          text: R`Quanti punti ha in comune la retta $y=${mx}${sg(q)}$ con l'iperbole $\dfrac{x^2}{${a * a}}-\dfrac{y^2}{${b * b}}=1$?`,
          options: choice(r, [
            ['Uno', R`Corretto: la retta è parallela all'asintoto $y=${mx}$ e la risolvente è di primo grado.`],
            ['Due', R`Sostituendo, i termini in $x^2$ si eliminano: l'equazione risolvente è di primo grado.`],
            ['Nessuno', 'Solo l\'asintoto stesso non incontra l\'iperbole; una sua parallela la incontra in un punto.'],
            ['Uno, perché è tangente', 'Il punto comune è uno, ma la retta attraversa la curva: non è tangente.'],
          ]),
          hints: [R`Gli asintoti sono $y=\pm${a === b ? ' ' : frac(b, a)}x$: confronta i coefficienti angolari.`, 'Una retta parallela a un asintoto incontra l\'iperbole in un solo punto.'],
          solution: [R`Gli asintoti hanno coefficiente angolare $\pm${frac(b, a)}$: la retta è parallela a uno di essi.`, R`La risolvente è di primo grado: un solo punto in comune, senza tangenza.`],
        };
      },
    },
    {
      id: 'ipe-tangente-m',
      level: 3,
      title: 'Condizione di tangenza',
      make: (r) => {
        const [a, b, m, q] = pick(r, [[5, 3, 1, 4], [5, 4, 1, 3], [13, 5, 1, 12], [13, 12, 1, 5], [10, 6, 1, 8], [10, 8, 1, 6], [5, 6, 2, 8], [5, 8, 2, 6]] as const);
        const s = pick(r, [1, -1]);
        const mx = m * s === 1 ? 'x' : m * s === -1 ? '-x' : `${m * s}x`;
        return {
          text: R`Per quale valore **positivo** di $q$ la retta $y=${mx}+q$ è tangente all'iperbole $\dfrac{x^2}{${a * a}}-\dfrac{y^2}{${b * b}}=1$?`,
          answer: q,
          tol: 0,
          hints: [R`Condizione di tangenza: $q^2=a^2m^2-b^2$.`, R`$a^2=${a * a}$, $b^2=${b * b}$, $m=${m * s}$.`],
          solution: [R`$q^2=a^2m^2-b^2=${a * a}\cdot${m * m}-${b * b}=${q * q}$.`, R`$q=\pm${q}$; il valore positivo è $${q}$.`],
        };
      },
    },
    {
      id: 'ipe-da-asintoti',
      level: 3,
      title: 'Iperbole dati asintoti e fuoco',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLE);
        return {
          text: R`Un'iperbole con centro nell'origine ha un fuoco in $F(${c};0)$ e asintoti $y=\pm${frac(b, a)}x$. Quanto vale il semiasse trasverso $a$?`,
          answer: a,
          tol: 0,
          hints: [R`Dagli asintoti: $\dfrac ba=${frac(b, a)}$. Dal fuoco: $a^2+b^2=${c * c}$.`, R`Sostituisci $b=${frac(b, a)}a$ nella seconda relazione.`],
          solution: [R`$b=${frac(b, a)}a$ e $a^2+b^2=${c * c}$.`, R`$a^2+${frac(b * b, a * a)}a^2=${c * c}\Rightarrow ${frac(a * a + b * b, a * a)}a^2=${c * c}\Rightarrow a^2=${a * a}$.`, R`$a=${a}$ (e $b=${b}$).`],
        };
      },
    },
    {
      id: 'conica-eccentricita',
      level: 1,
      title: 'Classificare una conica dall\'eccentricità',
      make: (r) => {
        const kind = int(r, 0, 2);
        const e = kind === 0 ? frac(int(r, 1, 4), int(r, 5, 9)) : kind === 1 ? '1' : frac(int(r, 5, 9), int(r, 2, 4));
        const names = ['Un\'ellisse', 'Una parabola', 'Un\'iperbole'];
        return {
          text: R`Una conica ha eccentricità $e=${e}$. Di quale curva si tratta?`,
          options: choice(r, [[names[kind]], ...names.filter((_, i) => i !== kind).map((n): [string, string] => [n, R`Ricorda: $0<e<1$ ellisse, $e=1$ parabola, $e>1$ iperbole.`]), ['Una circonferenza', R`La circonferenza corrisponde al caso limite $e=0$.`]]),
          hints: [R`Confronta $e$ con $1$.`],
          solution: [`${kind === 0 ? '$0<e<1$' : kind === 1 ? '$e=1$' : '$e>1$'}: la conica è ${names[kind].toLowerCase()}.`],
        };
      },
    },
  ],
};
