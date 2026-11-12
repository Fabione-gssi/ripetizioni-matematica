import { choice, int, m, mc, pick, sqrtTex } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const pi = (k: number) => m(`${k === 1 ? '' : k}\\pi`);

type Item = readonly [text: string, ok: string, wrong: readonly (readonly [string, string])[], sol: string];

export const spazio: Unit = {
  id: 'a4-spazio',
  year: 4,
  title: 'Geometria nello spazio',
  summary: 'Rette e piani, perpendicolarità, poliedri, solidi di rotazione, aree e volumi.',
  lessons: [
    {
      id: 'a4-spa-1',
      title: 'Rette e piani nello spazio',
      blocks: [
        { t: 'idea', md: R`Nel piano due rette o si incontrano o sono parallele. Nello spazio c'è una terza possibilità: pensa a un cavalcavia e alla strada che gli passa sotto. Non si incontrano, ma non sono nemmeno parallele: sono **sghembe**.` },
        { t: 'def', title: 'Posizioni reciproche', md: R`**Due rette** nello spazio possono essere:
- **complanari** (esiste un piano che le contiene): incidenti, parallele o coincidenti;
- **sghembe**: non esiste alcun piano che le contenga entrambe (non hanno punti comuni e non sono parallele).

**Una retta e un piano:** la retta può essere **incidente** (un punto comune), **parallela** (nessun punto comune) o **giacente** sul piano.

**Due piani:** **incidenti** (hanno in comune una retta), **paralleli** o coincidenti.` },
        { t: 'def', title: 'Perpendicolarità', md: R`Una retta è **perpendicolare a un piano** se è perpendicolare a **tutte** le rette del piano passanti per il suo piede. Basta verificarlo per **due** rette distinte del piano passanti per il piede.

La **distanza** di un punto da un piano è la lunghezza del segmento di perpendicolare condotto dal punto al piano.

L'**angolo tra una retta e un piano** è l'angolo acuto che la retta forma con la sua proiezione ortogonale sul piano.` },
        {
          t: 'thm',
          title: 'Teorema delle tre perpendicolari',
          md: R`Se dal piede $H$ di una perpendicolare $PH$ a un piano $\alpha$ si conduce la perpendicolare $HK$ a una retta $r$ del piano, allora la retta $PK$ è perpendicolare a $r$.`,
          proof: [
            R`Sia $K$ il piede della perpendicolare da $H$ a $r$. Prendiamo su $r$ due punti $A$ e $B$ simmetrici rispetto a $K$: $KA=KB$.`,
            R`I triangoli rettangoli $HKA$ e $HKB$ sono congruenti (cateti uguali), quindi $HA=HB$.`,
            R`Anche i triangoli rettangoli $PHA$ e $PHB$ sono congruenti ($PH$ in comune, $HA=HB$), quindi $PA=PB$.`,
            R`Il triangolo $PAB$ è isoscele e $K$ è il punto medio della base: la mediana $PK$ è anche altezza, cioè $PK\perp r$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Retta inclinata su un piano',
          caption: R`Vista di profilo: il segmento $PA$ lungo $l$ forma l'angolo $\theta$ con il piano. La distanza di $P$ dal piano è $l\sin\theta$, la proiezione è $l\cos\theta$.`,
          view: [-1, 11, -1, 8],
          params: [
            { name: 'l', label: 'l', min: 2, max: 9, step: 0.5, value: 8 },
            { name: 't', label: 'θ (gradi)', min: 5, max: 85, step: 5, value: 30 },
          ],
          draw: (p) => {
            const t = (p.t * Math.PI) / 180, x = p.l * Math.cos(t), y = p.l * Math.sin(t);
            return [
              { k: 'seg', x1: -1, y1: 0, x2: 11, y2: 0, color: 'var(--muted)' },
              { k: 'seg', x1: 0, y1: 0, x2: x, y2: y, color: 'var(--plot-1)' },
              { k: 'seg', x1: x, y1: y, x2: x, y2: 0, color: 'var(--plot-2)', dash: true },
              { k: 'seg', x1: 0, y1: 0, x2: x, y2: 0, color: 'var(--plot-3)' },
              { k: 'pt', x: 0, y: 0, label: 'A' },
              { k: 'pt', x, y, label: 'P' },
              { k: 'pt', x, y: 0, label: 'H' },
            ];
          },
          readout: (p) => {
            const t = (p.t * Math.PI) / 180;
            return `$PH=l\\sin\\theta=${d(p.l * Math.sin(t))}$, $\\ AH=l\\cos\\theta=${d(p.l * Math.cos(t))}$`;
          },
        },
        { t: 'def', title: 'Diedri e piani perpendicolari', md: R`Un **diedro** è ciascuna delle due parti di spazio delimitate da due semipiani con la stessa origine (lo **spigolo**). La sua ampiezza è quella della **sezione normale**: l'angolo ottenuto tagliando il diedro con un piano perpendicolare allo spigolo.

Due piani sono **perpendicolari** se formano diedri retti. **Teorema di Talete nello spazio:** un fascio di piani paralleli taglia su due rette trasversali segmenti proporzionali.` },
        {
          t: 'quiz',
          q: R`In un cubo, uno spigolo della base superiore e uno spigolo della base inferiore non paralleli tra loro sono:`,
          options: [
            { md: 'sghembi', ok: true, why: 'Esatto: stanno su piani paralleli distinti e non sono paralleli, quindi nessun piano li contiene entrambi.' },
            { md: 'incidenti', why: 'Stanno su due facce parallele: non possono avere punti comuni.' },
            { md: 'paralleli', why: 'Per ipotesi hanno direzioni diverse.' },
          ],
        },
      ],
    },
    {
      id: 'a4-spa-2',
      title: 'Poliedri e solidi di rotazione: aree e volumi',
      blocks: [
        { t: 'idea', md: R`Un bicchiere cilindrico e un cono con la stessa base e la stessa altezza: quanti coni d'acqua servono per riempire il bicchiere? Esattamente **tre**. È lo stesso rapporto che c'è tra un prisma e una piramide.` },
        { t: 'def', title: 'Poliedri', md: R`- **Prisma retto** (base di area $A_b$ e perimetro $2p$, altezza $h$): $A_l=2p\cdot h$, $\ V=A_b\cdot h$
- **Parallelepipedo rettangolo** di dimensioni $a,b,c$: $V=abc$, diagonale $d=\sqrt{a^2+b^2+c^2}$
- **Cubo** di spigolo $l$: $V=l^3$, $A_t=6l^2$, diagonale $d=l\sqrt3$
- **Piramide retta** (apotema $a$): $A_l=p\cdot a$, $\ V=\dfrac13A_b\cdot h$

**Relazione di Eulero** per i poliedri convessi: $F+V=S+2$ (facce, vertici, spigoli).

I **poliedri regolari** sono solo cinque: tetraedro (4 facce), cubo (6), ottaedro (8), dodecaedro (12), icosaedro (20).` },
        { t: 'def', title: 'Solidi di rotazione', md: R`- **Cilindro** (raggio $r$, altezza $h$): $A_l=2\pi rh$, $\ A_t=2\pi r(r+h)$, $\ V=\pi r^2h$
- **Cono** (raggio $r$, altezza $h$, apotema $a=\sqrt{r^2+h^2}$): $A_l=\pi ra$, $\ A_t=\pi r(r+a)$, $\ V=\dfrac13\pi r^2h$
- **Sfera** (raggio $r$): $A=4\pi r^2$, $\ V=\dfrac43\pi r^3$` },
        {
          t: 'thm',
          title: 'Principio di Cavalieri e volume della sfera',
          md: R`**Principio di Cavalieri:** se due solidi, tagliati da ogni piano parallelo a un piano fissato, danno sezioni di **uguale area**, allora hanno lo stesso volume. Con questo principio si dimostra che $V_{sfera}=\dfrac43\pi r^3$.`,
          proof: [
            R`Confrontiamo una **semisfera** di raggio $r$ con il solido ottenuto togliendo da un **cilindro** (raggio $r$, altezza $r$) un **cono** con la stessa base e il vertice nel centro della base opposta ("scodella di Galileo").`,
            R`Tagliamo con un piano a distanza $x$ dal piano di base. Nella semisfera la sezione è un cerchio di raggio $\sqrt{r^2-x^2}$: area $\pi(r^2-x^2)$.`,
            R`Nell'altro solido la sezione è una corona circolare di raggi $r$ e $x$ (nel cono il raggio della sezione è uguale alla distanza dal vertice): area $\pi r^2-\pi x^2$.`,
            R`Le aree sono uguali per ogni $x$: per Cavalieri i volumi coincidono. $V_{semisfera}=\pi r^3-\dfrac13\pi r^3=\dfrac23\pi r^3$, quindi $V_{sfera}=\dfrac43\pi r^3$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Sezione di una sfera',
          caption: R`Vista di profilo: un piano a distanza $x$ dal centro taglia la sfera di raggio $5$ lungo un cerchio di raggio $\sqrt{25-x^2}$.`,
          view: [-7.8, 7.8, -6, 6],
          params: [{ name: 'x', label: 'x', min: 0, max: 5, step: 0.25, value: 3 }],
          draw: (p) => {
            const s = Math.sqrt(25 - p.x * p.x);
            return [
              { k: 'param', x: (t) => 5 * Math.cos(t), y: (t) => 5 * Math.sin(t), t0: 0, t1: 2 * Math.PI },
              { k: 'seg', x1: -s, y1: p.x, x2: s, y2: p.x, color: 'var(--plot-2)' },
              { k: 'seg', x1: 0, y1: 0, x2: 0, y2: p.x, dash: true },
              { k: 'seg', x1: 0, y1: 0, x2: s, y2: p.x, dash: true },
              { k: 'pt', x: 0, y: 0, label: 'O' },
            ];
          },
          readout: (p) => `Raggio della sezione: $\\sqrt{25-${d(p.x * p.x)}}=${d(Math.sqrt(25 - p.x * p.x))}$ — area $\\approx${d(Math.PI * (25 - p.x * p.x))}$`,
        },
        {
          t: 'ex',
          title: R`Un cono ha raggio di base $6$ cm e altezza $8$ cm. Calcola apotema, area totale e volume.`,
          steps: [R`Apotema: $a=\sqrt{6^2+8^2}=10$ cm.`, R`Area laterale: $\pi ra=60\pi$ cm²; area di base: $36\pi$ cm²; area totale: $96\pi$ cm².`, R`Volume: $V=\dfrac13\pi\cdot36\cdot8=96\pi$ cm³.`],
        },
        { t: 'warn', md: R`Nel cono e nella piramide non confondere **altezza** e **apotema**: l'altezza serve per il volume, l'apotema per l'area laterale. Sono legati dal teorema di Pitagora.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'spa-posizioni',
      level: 1,
      title: 'Posizioni reciproche',
      make: (r) => {
        const items: Item[] = [
          ['Due rette dello spazio che non hanno punti in comune e non sono parallele si dicono:', 'sghembe', [['incidenti', 'Le rette incidenti hanno un punto in comune.'], ['complanari', 'Due rette complanari senza punti comuni sarebbero parallele.'], ['perpendicolari', 'La perpendicolarità riguarda l\'angolo, non l\'assenza di punti comuni.']], 'Non esiste alcun piano che le contenga entrambe: sono sghembe.'],
          ['Due piani distinti che hanno un punto in comune hanno in comune:', 'una retta', [['solo quel punto', 'Due piani non possono incontrarsi in un solo punto.'], ['nessun altro punto', 'Se hanno un punto comune, hanno comune tutta una retta per quel punto.'], ['un piano', 'Sono distinti: non possono coincidere.']], 'Due piani incidenti si intersecano lungo una retta.'],
          ['Quante rette perpendicolari a un piano passano per un punto dato?', 'Una sola', [['Nessuna', 'La perpendicolare esiste sempre.'], ['Due', 'La perpendicolare è unica.'], ['Infinite', 'Infinite sono le rette per il punto, ma una sola è perpendicolare al piano.']], 'Per un punto passa una e una sola retta perpendicolare a un piano dato.'],
          ['Una retta è perpendicolare a un piano se è perpendicolare a:', 'due rette distinte del piano passanti per il suo piede', [['una retta del piano', 'Una sola retta non basta: la retta potrebbe essere obliqua.'], ['una retta parallela al piano', 'Non è sufficiente.'], ['un altro piano', 'Non è questa la condizione.']], 'Bastano due rette incidenti del piano passanti per il piede.'],
          ['Due rette perpendicolari a uno stesso piano sono tra loro:', 'parallele', [['perpendicolari', 'Hanno la stessa direzione, quella normale al piano.'], ['sghembe', 'Sono complanari e hanno la stessa direzione.'], ['incidenti', 'Non si incontrano mai.']], 'Rette perpendicolari allo stesso piano hanno la stessa direzione: sono parallele.'],
          ['Se una retta è parallela a un piano, la sua distanza dal piano è:', 'la stessa per tutti i suoi punti', [['nulla', 'Sarebbe nulla solo se la retta giacesse sul piano.'], ['variabile da punto a punto', 'Varierebbe se la retta fosse incidente.'], ['non definita', 'È definita: è la distanza di un suo punto qualsiasi dal piano.']], 'Tutti i punti di una retta parallela a un piano hanno la stessa distanza da esso.'],
        ];
        const [text, ok, wrong, sol] = pick(r, items);
        return { text, options: choice(r, [[ok, 'Corretto.'], ...wrong.map(([a, b]): [string, string] => [a, b])]), hints: ['Aiutati visualizzando spigoli e facce di un cubo o di una stanza.'], solution: [sol] };
      },
    },
    {
      id: 'spa-eulero',
      level: 1,
      title: 'Relazione di Eulero',
      make: (r) => {
        const [name, F, V, S] = pick(r, [['tetraedro', 4, 4, 6], ['cubo', 6, 8, 12], ['ottaedro', 8, 6, 12], ['dodecaedro', 12, 20, 30], ['icosaedro', 20, 12, 30], ['prisma a base pentagonale', 7, 10, 15], ['piramide a base esagonale', 7, 7, 12]] as const);
        const ask = pick(r, ['F', 'V', 'S'] as const);
        const txt = { F: `ha ${V} vertici e ${S} spigoli. Quante facce ha?`, V: `ha ${F} facce e ${S} spigoli. Quanti vertici ha?`, S: `ha ${F} facce e ${V} vertici. Quanti spigoli ha?` }[ask];
        return {
          text: `Un poliedro convesso (${name}) ${txt}`,
          answer: { F, V, S }[ask],
          tol: 0,
          hints: [R`Relazione di Eulero: $F+V=S+2$.`],
          solution: [`${m('F+V=S+2')}`, ask === 'S' ? `${m(`S=${F}+${V}-2=${S}`)}` : ask === 'F' ? `${m(`F=${S}+2-${V}=${F}`)}` : `${m(`V=${S}+2-${F}=${V}`)}`],
        };
      },
    },
    {
      id: 'spa-parallelepipedo',
      level: 1,
      title: 'Parallelepipedo: volume',
      make: (r) => {
        const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9);
        return {
          text: `Un parallelepipedo rettangolo ha dimensioni ${m(a)} cm, ${m(b)} cm e ${m(c)} cm. Calcola il volume in cm³.`,
          answer: a * b * c,
          tol: 0,
          hints: ['Il volume è il prodotto delle tre dimensioni.'],
          solution: [`${m(`V=${a}\\cdot${b}\\cdot${c}=${a * b * c}`)} cm³.`],
        };
      },
    },
    {
      id: 'spa-diagonale',
      level: 2,
      title: 'Diagonale del parallelepipedo',
      make: (r) => {
        const [a, b, c, dg] = pick(r, [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9], [2, 4, 4, 6], [3, 4, 12, 13], [6, 6, 7, 11]]);
        return {
          text: `Calcola la diagonale di un parallelepipedo rettangolo di dimensioni ${m(a)}, ${m(b)} e ${m(c)}.`,
          answer: dg,
          tol: 0,
          hints: [R`$d=\sqrt{a^2+b^2+c^2}$ (Pitagora applicato due volte).`],
          steps: [
            { ask: 'Quanto vale la diagonale della base (rettangolo di lati $a$ e $b$) al quadrato?', options: mc(r, m(a * a + b * b), [[m((a + b) ** 2), R`$(a+b)^2\neq a^2+b^2$.`], [m(a * b), 'Questa è l\'area della base.']], [m(a * a + b * b + 1), m(a + b)]), explain: `${m(`d_b^2=${a * a}+${b * b}=${a * a + b * b}`)}.` },
            { ask: 'La diagonale del solido è l\'ipotenusa del triangolo rettangolo con cateti la diagonale di base e l\'altezza $c$. Quanto vale?', options: mc(r, m(dg), [[m(dg * dg), 'Manca la radice quadrata.'], [m(a + b + c), 'Non si sommano le dimensioni.']], [m(dg + 1), m(dg - 1)]), explain: `${m(`d=\\sqrt{${a * a + b * b}+${c * c}}=\\sqrt{${dg * dg}}=${dg}`)}.` },
          ],
          solution: [`${m(`d=\\sqrt{${a * a}+${b * b}+${c * c}}=\\sqrt{${dg * dg}}=${dg}`)}`],
        };
      },
    },
    {
      id: 'spa-cubo',
      level: 1,
      title: 'Cubo',
      make: (r) => {
        const l = int(r, 2, 9), ask = pick(r, ['d', 'A'] as const);
        return ask === 'd'
          ? {
              text: `Quanto misura la diagonale di un cubo di spigolo ${m(l)}?`,
              options: mc(r, m(`${l}\\sqrt3`), [[m(`${l}\\sqrt2`), 'Questa è la diagonale di una **faccia**.'], [m(3 * l), R`$\sqrt{3l^2}=l\sqrt3$, non $3l$.`], [m(l ** 3), 'Questo è il volume.']]),
              hints: [R`$d=\sqrt{l^2+l^2+l^2}$.`],
              solution: [`${m(`d=\\sqrt{3\\cdot${l * l}}=${l}\\sqrt3`)}`],
            }
          : {
              text: `Calcola l'area totale di un cubo di spigolo ${m(l)}.`,
              answer: 6 * l * l,
              tol: 0,
              hints: ['Il cubo ha $6$ facce quadrate uguali.'],
              solution: [`${m(`A_t=6\\cdot${l}^2=${6 * l * l}`)}`],
            };
      },
    },
    {
      id: 'spa-piramide',
      level: 2,
      title: 'Piramide retta a base quadrata',
      make: (r) => {
        const [half, h, ap] = pick(r, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17]]);
        const side = 2 * half, ask = pick(r, ['V', 'Al'] as const);
        return {
          text: `Una piramide retta ha per base un quadrato di lato ${m(side)} cm e altezza ${m(h)} cm. Calcola ${ask === 'V' ? 'il volume in cm³' : 'l\'area laterale in cm²'}.`,
          answer: ask === 'V' ? (side * side * h) / 3 : 2 * side * ap,
          tol: 0.01,
          hints: ask === 'V' ? [R`$V=\dfrac13A_b\cdot h$.`] : ['Serve l\'apotema: è l\'ipotenusa del triangolo con cateti l\'altezza e metà del lato di base.', R`$A_l=p\cdot a$ (semiperimetro per apotema).`],
          solution: ask === 'V' ? [`${m(`V=\\dfrac13\\cdot${side}^2\\cdot${h}=${(side * side * h) / 3}`)} cm³.`] : [`Apotema: ${m(`a=\\sqrt{${h}^2+${half}^2}=${ap}`)} cm.`, `${m(`A_l=\\dfrac{4\\cdot${side}}{2}\\cdot${ap}=${2 * side * ap}`)} cm².`],
        };
      },
    },
    {
      id: 'spa-cilindro',
      level: 1,
      title: 'Cilindro',
      make: (r) => {
        const rr = int(r, 2, 7), h = int(r, 2, 10), ask = pick(r, ['V', 'Al'] as const);
        const good = ask === 'V' ? rr * rr * h : 2 * rr * h;
        return {
          text: `Un cilindro ha raggio di base ${m(rr)} e altezza ${m(h)}. Calcola ${ask === 'V' ? 'il volume' : 'l\'area laterale'}.`,
          options: mc(r, pi(good), [
            [pi(ask === 'V' ? 2 * rr * h : rr * rr * h), ask === 'V' ? 'Questa è l\'area laterale.' : 'Questo è il volume.'],
            [pi(ask === 'V' ? rr * h : rr * h), ask === 'V' ? 'Il raggio va elevato al quadrato.' : 'La circonferenza di base è $2\\pi r$.'],
            [m(`${good}`), 'Manca il fattore $\\pi$.'],
          ], [pi(good + rr), pi(good * 2)]),
          hints: [ask === 'V' ? R`$V=\pi r^2h$.` : R`$A_l=2\pi rh$.`],
          solution: [ask === 'V' ? `${m(`V=\\pi\\cdot${rr}^2\\cdot${h}=${good}\\pi`)}` : `${m(`A_l=2\\pi\\cdot${rr}\\cdot${h}=${good}\\pi`)}`],
        };
      },
    },
    {
      id: 'spa-cono',
      level: 2,
      title: 'Cono',
      make: (r) => {
        const [rr, h, ap] = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 5, 13]]);
        const ask = pick(r, ['V', 'Al'] as const);
        const good = ask === 'V' ? (rr * rr * h) / 3 : rr * ap;
        return {
          text: `Un cono ha raggio di base ${m(rr)} e altezza ${m(h)}. Calcola ${ask === 'V' ? 'il volume' : 'l\'area laterale'}.`,
          options: mc(r, pi(good), [
            [pi(ask === 'V' ? rr * rr * h : rr * h), ask === 'V' ? R`Manca il fattore $\dfrac13$: questo è il volume del cilindro.` : 'Nell\'area laterale compare l\'**apotema**, non l\'altezza.'],
            [pi(ask === 'V' ? rr * ap : (rr * rr * h) / 3), ask === 'V' ? 'Questa è l\'area laterale.' : 'Questo è il volume.'],
            [pi(ask === 'V' ? (rr * h) / 3 || 1 : 2 * rr * ap), ask === 'V' ? 'Il raggio va elevato al quadrato.' : R`$A_l=\pi ra$, senza il fattore $2$.`],
          ], [pi(good + 1), pi(good + rr)]),
          hints: ask === 'V' ? [R`$V=\dfrac13\pi r^2h$.`] : [R`$A_l=\pi ra$ con $a=\sqrt{r^2+h^2}$.`],
          solution: ask === 'V' ? [`${m(`V=\\dfrac13\\pi\\cdot${rr}^2\\cdot${h}=${good}\\pi`)}`] : [`Apotema: ${m(`a=\\sqrt{${rr * rr}+${h * h}}=${ap}`)}.`, `${m(`A_l=\\pi\\cdot${rr}\\cdot${ap}=${good}\\pi`)}`],
        };
      },
    },
    {
      id: 'spa-sfera',
      level: 2,
      title: 'Sfera',
      make: (r) => {
        const rr = 3 * int(r, 1, 3), ask = pick(r, ['V', 'A'] as const);
        const good = ask === 'V' ? (4 * rr ** 3) / 3 : 4 * rr * rr;
        return {
          text: `Calcola ${ask === 'V' ? 'il volume' : 'l\'area della superficie'} di una sfera di raggio ${m(rr)}.`,
          options: mc(r, pi(good), [
            [pi(ask === 'V' ? 4 * rr * rr : (4 * rr ** 3) / 3), ask === 'V' ? 'Questa è l\'area della superficie.' : 'Questo è il volume.'],
            [pi(ask === 'V' ? 4 * rr ** 3 : rr * rr), ask === 'V' ? R`Manca la divisione per $3$: $V=\dfrac43\pi r^3$.` : 'Questa è l\'area di un cerchio massimo: la superficie sferica è quattro volte tanto.'],
            [pi(ask === 'V' ? rr ** 3 : 2 * rr * rr), 'Ricontrolla il coefficiente della formula.'],
          ]),
          hints: [ask === 'V' ? R`$V=\dfrac43\pi r^3$.` : R`$A=4\pi r^2$.`],
          solution: [ask === 'V' ? `${m(`V=\\dfrac43\\pi\\cdot${rr}^3=${good}\\pi`)}` : `${m(`A=4\\pi\\cdot${rr}^2=${good}\\pi`)}`],
        };
      },
    },
    {
      id: 'spa-sezione',
      level: 3,
      title: 'Sezione di una sfera',
      make: (r) => {
        const [rr, dist, s] = pick(r, [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15]]);
        return {
          text: `Una sfera di raggio ${m(rr)} è tagliata da un piano che dista ${m(dist)} dal centro. Quanto misura il raggio del cerchio sezione?`,
          answer: s,
          tol: 0,
          hints: ['Raggio della sfera, distanza del piano dal centro e raggio della sezione formano un triangolo rettangolo.'],
          solution: [`${m(`r_s=\\sqrt{${rr}^2-${dist}^2}=\\sqrt{${rr * rr - dist * dist}}=${s}`)}`],
        };
      },
    },
    {
      id: 'spa-inclinata',
      level: 3,
      title: 'Retta inclinata su un piano',
      make: (r) => {
        const k = int(r, 2, 9), ang = pick(r, [30, 60]), ask = pick(r, ['dist', 'proj'] as const);
        const l = 2 * k;
        const short = (ang === 30) === (ask === 'dist');
        const good = short ? `${k}` : sqrtTex(3 * k * k);
        return {
          text: `Un segmento $PA$ lungo ${m(l)} ha l'estremo $A$ su un piano e forma con esso un angolo di ${m(`${ang}°`)}. Quanto misura ${ask === 'dist' ? 'la distanza di $P$ dal piano' : 'la proiezione di $PA$ sul piano'}?`,
          options: mc(r, m(good), [
            [m(short ? sqrtTex(3 * k * k) : `${k}`), ask === 'dist' ? 'Hai calcolato la proiezione: la distanza usa il **seno**.' : 'Hai calcolato la distanza: la proiezione usa il **coseno**.'],
            [m(sqrtTex(2 * k * k)), 'Questo valore corrisponde a un angolo di $45°$.'],
            [m(`${l}`), 'Sarebbe così solo se il segmento fosse perpendicolare (o parallelo) al piano.'],
          ]),
          hints: ['Il segmento, la sua proiezione e la distanza formano un triangolo rettangolo.', ask === 'dist' ? R`Distanza $=l\sin\theta$.` : R`Proiezione $=l\cos\theta$.`],
          solution: [ask === 'dist' ? `${m(`PH=${l}\\cdot\\sin${ang}°=${good}`)}` : `${m(`AH=${l}\\cdot\\cos${ang}°=${good}`)}`],
        };
      },
    },
    {
      id: 'spa-rapporti',
      level: 3,
      title: 'Rapporti tra volumi',
      make: (r) => {
        const items: Item[] = [
          ['Un cilindro e un cono hanno la stessa base e la stessa altezza. Qual è il rapporto tra il volume del cilindro e quello del cono?', '$3$', [[R`$\dfrac13$`, 'Hai invertito il rapporto.'], ['$2$', R`$V_{cono}=\dfrac13V_{cilindro}$.`]], R`$\dfrac{\pi r^2h}{\frac13\pi r^2h}=3$.`],
          ['Una sfera è inscritta in un cilindro (stesso raggio, altezza uguale al diametro). Qual è il rapporto tra il volume della sfera e quello del cilindro?', R`$\dfrac23$`, [[R`$\dfrac43$`, 'La sfera è contenuta nel cilindro: il rapporto è minore di $1$.'], [R`$\dfrac12$`, R`$V_{cil}=\pi r^2\cdot2r=2\pi r^3$.`]], R`$\dfrac{\frac43\pi r^3}{2\pi r^3}=\dfrac23$ (risultato di Archimede).`],
          ['Se il raggio di una sfera raddoppia, il suo volume viene moltiplicato per:', '$8$', [['$2$', 'Il volume dipende dal **cubo** del raggio.'], ['$4$', 'Per $4$ viene moltiplicata la superficie.']], R`$(2r)^3=8r^3$: il volume diventa $8$ volte.`],
          ['Se lo spigolo di un cubo triplica, la sua area totale viene moltiplicata per:', '$9$', [['$3$', 'L\'area dipende dal **quadrato** dello spigolo.'], ['$27$', 'Per $27$ viene moltiplicato il volume.']], R`$(3l)^2=9l^2$: l'area diventa $9$ volte.`],
          ['Una piramide e un prisma hanno basi equivalenti e la stessa altezza. Il volume della piramide è:', 'un terzo di quello del prisma', [['uguale a quello del prisma', R`$V_{pir}=\dfrac13A_bh$.`], ['la metà di quello del prisma', 'Il rapporto è $1:3$.']], R`$V_{piramide}=\dfrac13A_b\,h=\dfrac13V_{prisma}$.`],
        ];
        const [text, ok, wrong, sol] = pick(r, items);
        return { text, options: mc(r, ok, wrong.map(([a, b]): [string, string] => [a, b])), hints: ['Scrivi le due formule e fai il rapporto: molti fattori si semplificano.'], solution: [sol] };
      },
    },
  ],
};
