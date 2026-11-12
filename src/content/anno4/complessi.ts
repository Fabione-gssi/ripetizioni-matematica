import { choice, int, m, mc, nz, pick } from '../../lib/gen';
import type { Shape, Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

/** Numero complesso a + bi in LaTeX. */
function cx(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const im = `${b === 1 ? '' : b === -1 ? '-' : b}i`;
  if (a === 0) return im;
  return `${a}${b > 0 ? '+' : ''}${im}`;
}
const par = (a: number, b: number) => `(${cx(a, b)})`;

export const complessi: Unit = {
  id: 'a4-complessi',
  year: 4,
  title: 'Numeri complessi',
  summary: 'Forma algebrica e trigonometrica, piano di Gauss, potenze e radici, equazioni.',
  lessons: [
    {
      id: 'a4-com-1',
      title: 'Forma algebrica e piano di Gauss',
      blocks: [
        { t: 'idea', md: R`L'equazione $x^2=-1$ non ha soluzioni reali. I matematici del Cinquecento, per risolvere le equazioni di terzo grado, provarono a far finta che una soluzione esistesse e la chiamarono $i$. Quel numero "immaginario" si è rivelato indispensabile: oggi descrive correnti alternate, onde, segnali e la meccanica quantistica.` },
        { t: 'def', title: 'Numeri complessi', md: R`L'**unità immaginaria** $i$ è definita da $i^2=-1$. Un **numero complesso** in forma algebrica è $$z=a+bi\qquad a,b\in\mathbb R$$ dove $a=\text{Re}(z)$ è la **parte reale** e $b=\text{Im}(z)$ il coefficiente della **parte immaginaria**. Se $b=0$ il numero è reale; se $a=0$ è immaginario puro.

Due numeri complessi sono uguali se hanno uguali parte reale e parte immaginaria. In $\mathbb C$ **non** esiste una relazione d'ordine: non ha senso dire $z_1<z_2$.` },
        { t: 'def', title: 'Operazioni', md: R`Si calcola come con i binomi, ricordando che $i^2=-1$:
- **somma:** $(a+bi)+(c+di)=(a+c)+(b+d)i$
- **prodotto:** $(a+bi)(c+di)=(ac-bd)+(ad+bc)i$
- **coniugato:** $\bar z=a-bi$; vale $z\cdot\bar z=a^2+b^2$
- **modulo:** $|z|=\sqrt{a^2+b^2}$
- **quoziente:** si moltiplicano numeratore e denominatore per il coniugato del denominatore: $$\frac{a+bi}{c+di}=\frac{(a+bi)(c-di)}{c^2+d^2}$$
- **potenze di $i$:** $i^1=i,\ i^2=-1,\ i^3=-i,\ i^4=1$, e poi si ripetono con periodo $4$.` },
        {
          t: 'plot',
          title: 'Il piano di Gauss',
          caption: R`Ogni numero complesso $z=a+bi$ è il punto $(a;b)$: l'asse orizzontale è l'asse reale, quello verticale l'asse immaginario. Il coniugato $\bar z$ è il simmetrico rispetto all'asse reale; il modulo è la distanza dall'origine.`,
          view: [-6.5, 6.5, -5, 5],
          params: [
            { name: 'a', label: 'a = Re(z)', min: -5, max: 5, step: 0.5, value: 3 },
            { name: 'b', label: 'b = Im(z)', min: -4, max: 4, step: 0.5, value: 2 },
          ],
          draw: (p) => [
            { k: 'seg', x1: 0, y1: 0, x2: p.a, y2: p.b, color: 'var(--plot-1)' },
            { k: 'seg', x1: 0, y1: 0, x2: p.a, y2: -p.b, color: 'var(--muted)', dash: true },
            { k: 'pt', x: p.a, y: p.b, label: 'z' },
            { k: 'pt', x: p.a, y: -p.b, label: 'z̄', color: 'var(--plot-3)' },
          ],
          readout: (p) => `$z=${d(p.a)}${p.b >= 0 ? '+' : ''}${d(p.b)}i$, $\\ |z|=${d(Math.hypot(p.a, p.b))}$, $\\ \\arg z\\approx${d((Math.atan2(p.b, p.a) * 180) / Math.PI)}°$`,
        },
        {
          t: 'ex',
          title: R`Calcola $\dfrac{3+2i}{1-i}$.`,
          steps: [R`Moltiplichiamo numeratore e denominatore per il coniugato del denominatore, $1+i$.`, R`Numeratore: $(3+2i)(1+i)=3+3i+2i+2i^2=3+5i-2=1+5i$.`, R`Denominatore: $(1-i)(1+i)=1-i^2=2$.`, R`Risultato: $\dfrac{1+5i}{2}=\dfrac12+\dfrac52i$.`],
        },
        { t: 'warn', md: R`Attenzione a $i^2$: vale $-1$, quindi in un prodotto il termine $bd\,i^2$ diventa $-bd$ e va nella **parte reale**. E il modulo è $\sqrt{a^2+b^2}$, senza $i$: è un numero reale non negativo.` },
        {
          t: 'quiz',
          q: R`Quanto vale $i^{10}$?`,
          options: [
            { md: '$-1$', ok: true, why: R`Esatto: $10=4\cdot2+2$, quindi $i^{10}=i^2=-1$.` },
            { md: '$1$', why: R`$i^4=1$, ma $10$ non è multiplo di $4$: il resto della divisione è $2$.` },
            { md: '$i$', why: R`Il resto di $10:4$ è $2$, non $1$.` },
          ],
        },
      ],
    },
    {
      id: 'a4-com-2',
      title: 'Forma trigonometrica, potenze, radici, equazioni',
      blocks: [
        { t: 'idea', md: R`Un punto del piano si può individuare anche con **distanza dall'origine e angolo**. In questa forma moltiplicare due numeri complessi diventa semplicissimo: si **moltiplicano le distanze** e si **sommano gli angoli**. Moltiplicare per $i$, per esempio, è ruotare di $90°$.` },
        { t: 'def', title: 'Forma trigonometrica', md: R`$$z=\rho\,(\cos\theta+i\sin\theta)$$ con $\rho=|z|=\sqrt{a^2+b^2}$ (**modulo**) e $\theta$ (**argomento**) tale che $\cos\theta=\dfrac a\rho$, $\sin\theta=\dfrac b\rho$. Viceversa $a=\rho\cos\theta$, $b=\rho\sin\theta$.

In **forma esponenziale** (formula di Eulero): $z=\rho\,e^{i\theta}$, con $e^{i\theta}=\cos\theta+i\sin\theta$.` },
        {
          t: 'thm',
          title: 'Prodotto, quoziente e formula di De Moivre',
          md: R`Se $z_1=\rho_1(\cos\theta_1+i\sin\theta_1)$ e $z_2=\rho_2(\cos\theta_2+i\sin\theta_2)$: $$z_1z_2=\rho_1\rho_2\,[\cos(\theta_1+\theta_2)+i\sin(\theta_1+\theta_2)]$$ $$\frac{z_1}{z_2}=\frac{\rho_1}{\rho_2}\,[\cos(\theta_1-\theta_2)+i\sin(\theta_1-\theta_2)]$$ $$z^n=\rho^n\,(\cos n\theta+i\sin n\theta)\qquad\text{(De Moivre)}$$`,
          proof: [
            R`$z_1z_2=\rho_1\rho_2(\cos\theta_1+i\sin\theta_1)(\cos\theta_2+i\sin\theta_2)$.`,
            R`Sviluppiamo: $\rho_1\rho_2[(\cos\theta_1\cos\theta_2-\sin\theta_1\sin\theta_2)+i(\sin\theta_1\cos\theta_2+\cos\theta_1\sin\theta_2)]$.`,
            R`Riconosciamo le formule di addizione: $\rho_1\rho_2[\cos(\theta_1+\theta_2)+i\sin(\theta_1+\theta_2)]$.`,
            R`Applicando ripetutamente il prodotto a $z\cdot z\cdots z$ ($n$ volte) si ottiene la formula di De Moivre.`,
          ],
        },
        {
          t: 'ex',
          title: R`Calcola $(1+i)^8$.`,
          steps: [R`Forma trigonometrica: $\rho=\sqrt2$, $\theta=\dfrac\pi4$, quindi $1+i=\sqrt2\left(\cos\dfrac\pi4+i\sin\dfrac\pi4\right)$.`, R`De Moivre: $(1+i)^8=(\sqrt2)^8\,(\cos2\pi+i\sin2\pi)$.`, R`$(\sqrt2)^8=16$ e $\cos2\pi+i\sin2\pi=1$: il risultato è $16$.`],
        },
        { t: 'def', title: 'Radici n-esime', md: R`Ogni numero complesso $z=\rho(\cos\theta+i\sin\theta)\neq0$ ha esattamente $n$ radici $n$-esime distinte: $$w_k=\sqrt[n]{\rho}\left(\cos\frac{\theta+2k\pi}{n}+i\sin\frac{\theta+2k\pi}{n}\right)\qquad k=0,1,\dots,n-1$$ Nel piano di Gauss sono i vertici di un **poligono regolare** di $n$ lati inscritto nella circonferenza di raggio $\sqrt[n]{\rho}$.` },
        {
          t: 'plot',
          title: 'Le radici n-esime dell\'unità',
          caption: R`Le soluzioni di $z^n=1$ sono $n$ punti equidistanti sulla circonferenza di raggio $1$.`,
          view: [-2, 2, -1.5, 1.5],
          params: [{ name: 'n', label: 'n', min: 2, max: 12, step: 1, value: 5 }],
          draw: (p) => [{ k: 'param', x: Math.cos, y: Math.sin, t0: 0, t1: 2 * Math.PI, color: 'var(--muted)', dash: true }, ...Array.from({ length: p.n }, (_, k): Shape => ({ k: 'pt', x: Math.cos((2 * Math.PI * k) / p.n), y: Math.sin((2 * Math.PI * k) / p.n) }))],
          readout: (p) => `$z^{${p.n}}=1$ ha $${p.n}$ soluzioni, con argomenti multipli di $\\dfrac{360°}{${p.n}}=${d(360 / p.n)}°$`,
        },
        { t: 'def', title: 'Equazioni in campo complesso', md: R`In $\mathbb C$ ogni equazione di secondo grado ha soluzioni. Se $\Delta<0$: $$x=\frac{-b\pm i\sqrt{|\Delta|}}{2a}$$ due soluzioni **complesse coniugate**. Più in generale (**teorema fondamentale dell'algebra**) ogni equazione polinomiale di grado $n$ ha esattamente $n$ soluzioni complesse, contate con la loro molteplicità.` },
        {
          t: 'ex',
          title: R`Risolvi in $\mathbb C$ l'equazione $x^2-4x+13=0$.`,
          steps: [R`$\Delta=16-52=-36$, quindi $\sqrt\Delta=6i$.`, R`$x=\dfrac{4\pm6i}{2}=2\pm3i$.`, R`Verifica: somma $4=-\dfrac ba$ ✓, prodotto $(2+3i)(2-3i)=4+9=13=\dfrac ca$ ✓.`],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'com-somma',
      level: 1,
      title: 'Somma e differenza',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -6, 6), c = nz(r, -6, 6), e = nz(r, -6, 6), plus = r() < 0.5;
        const s = plus ? 1 : -1;
        return {
          text: `Calcola ${m(`${par(a, b)}${plus ? '+' : '-'}${par(c, e)}`)}.`,
          options: mc(r, m(cx(a + s * c, b + s * e)), [
            [m(cx(a - s * c, b - s * e)), plus ? 'Hai sottratto invece di sommare.' : 'Hai sommato invece di sottrarre.'],
            [m(cx(a + s * c, b - s * e)), plus ? 'Errore di segno nella parte immaginaria.' : 'Il segno meno va distribuito anche sulla parte immaginaria del secondo numero.'],
            [m(cx(a + s * c + b + s * e, 0)), 'Parte reale e parte immaginaria non si sommano tra loro.'],
          ], [m(cx(a + s * c + 1, b + s * e)), m(cx(a + s * c, b + s * e + 1))]),
          hints: ['Somma (o sottrai) separatamente le parti reali e le parti immaginarie.'],
          solution: [`Parte reale: ${m(`${a}${plus ? '+' : '-'}(${c})=${a + s * c}`)}; parte immaginaria: ${m(`${b}${plus ? '+' : '-'}(${e})=${b + s * e}`)}.`, `${m(cx(a + s * c, b + s * e))}`],
        };
      },
    },
    {
      id: 'com-potenze-i',
      level: 1,
      title: 'Potenze di i',
      make: (r) => {
        const n = int(r, 5, 60), vals = ['1', 'i', '-1', '-i'];
        return {
          text: `Quanto vale ${m(`i^{${n}}`)}?`,
          options: choice(r, [[m(vals[n % 4]), 'Corretto.'], ...vals.filter((_, k) => k !== n % 4).map((v): [string, string] => [m(v), `Dividi l'esponente per $4$: il resto è ${m(n % 4)}.`])]),
          hints: ['Le potenze di $i$ si ripetono ogni $4$: conta il resto della divisione dell\'esponente per $4$.'],
          solution: [`${m(`${n}=4\\cdot${Math.floor(n / 4)}+${n % 4}`)}`, `${m(`i^{${n}}=i^{${n % 4}}=${vals[n % 4]}`)}`],
        };
      },
    },
    {
      id: 'com-modulo',
      level: 1,
      title: 'Modulo',
      make: (r) => {
        const [a, b, c] = pick(r, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 15, 17]]);
        const s1 = pick(r, [1, -1]), s2 = pick(r, [1, -1]);
        return {
          text: `Calcola il modulo di ${m(`z=${cx(s1 * a, s2 * b)}`)}.`,
          answer: c,
          tol: 0,
          hints: [R`$|z|=\sqrt{a^2+b^2}$.`],
          solution: [`${m(`|z|=\\sqrt{(${s1 * a})^2+(${s2 * b})^2}=\\sqrt{${a * a + b * b}}=${c}`)}`],
        };
      },
    },
    {
      id: 'com-coniugato',
      level: 1,
      title: 'Coniugato e prodotto',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -6, 6);
        return {
          text: `Dato ${m(`z=${cx(a, b)}`)}, calcola ${m('z\\cdot\\bar z')}.`,
          answer: a * a + b * b,
          tol: 0,
          hints: [R`Il coniugato è $\bar z=a-bi$.`, R`$z\cdot\bar z=a^2+b^2$ (è sempre un numero reale non negativo).`],
          solution: [`${m(`\\bar z=${cx(a, -b)}`)}`, `${m(`z\\bar z=${par(a, b)}${par(a, -b)}=${a * a}-${b * b}i^2=${a * a}+${b * b}=${a * a + b * b}`)}`],
        };
      },
    },
    {
      id: 'com-prodotto',
      level: 1,
      title: 'Prodotto',
      make: (r) => {
        const a = nz(r, -4, 4), b = nz(r, -4, 4), c = nz(r, -4, 4), e = nz(r, -4, 4);
        const re = a * c - b * e, im = a * e + b * c;
        return {
          text: `Calcola ${m(`${par(a, b)}${par(c, e)}`)}.`,
          options: mc(r, m(cx(re, im)), [
            [m(cx(a * c + b * e, im)), R`$i^2=-1$: il termine $bd\,i^2$ cambia segno.`],
            [m(cx(a * c, b * e)), 'Non si moltiplicano separatamente parti reali e immaginarie: servono tutti e quattro i prodotti.'],
            [m(cx(re, a * e - b * c)), 'Errore di segno nella parte immaginaria.'],
          ], [m(cx(re + 1, im)), m(cx(re, im + 1))]),
          hints: ['Sviluppa come il prodotto di due binomi.', 'Sostituisci $i^2$ con $-1$ e raccogli parte reale e parte immaginaria.'],
          steps: [
            { ask: 'Quanto vale la somma dei due termini con $i$ (i prodotti "misti")?', options: mc(r, m(cx(0, im)), [[m(cx(0, a * e - b * c)), 'Controlla i segni dei due prodotti misti.']], [m(cx(0, im + 1)), m(cx(0, im - 1)), m(cx(0, im + 2))]), explain: `${m(`${a}\\cdot(${e}i)+(${b}i)\\cdot${c}=${cx(0, im) === '0' ? '0' : cx(0, im)}`)}.`.replace('=0i', '=0') },
            { ask: `Quanto vale ${m(`(${b}i)(${e}i)`)}?`, options: mc(r, m(-b * e), [[m(b * e), R`$i\cdot i=i^2=-1$: il segno cambia.`], [m(cx(0, b * e)), R`$i^2$ non è $i$: vale $-1$.`]], [m(-b * e + 1), m(-b * e - 1)]), explain: `${m(`${b * e}\\,i^2=${-b * e}`)}; sommando ad ${m(`${a}\\cdot${c < 0 ? `(${c})` : c}=${a * c}`)} la parte reale è ${m(re)}. Risultato: ${m(cx(re, im))}.` },
          ],
          solution: [`${m(`${a * c}${a * e >= 0 ? '+' : ''}${a * e}i${b * c >= 0 ? '+' : ''}${b * c}i${b * e >= 0 ? '+' : ''}${b * e}i^2`)}`, `Con ${m('i^2=-1')}: parte reale ${m(`${a * c}-(${b * e})=${re}`)}, parte immaginaria ${m(im)}.`, `${m(cx(re, im))}`],
        };
      },
    },
    {
      id: 'com-quoziente',
      level: 2,
      title: 'Quoziente',
      make: (r) => {
        const p = nz(r, -3, 3), q = nz(r, -3, 3), c = nz(r, -2, 2), e = pick(r, [1, -1, 2, -2]);
        const a = p * c - q * e, b = p * e + q * c; // (p+qi)(c+ei) = a+bi
        const n2 = c * c + e * e;
        return {
          text: `Calcola ${m(`\\dfrac{${cx(a, b)}}{${cx(c, e)}}`)}.`,
          options: mc(r, m(cx(p, q)), [
            [m(cx(p, -q)), 'Bisogna moltiplicare per il coniugato del **denominatore**, non del numeratore.'],
            [m(cx(q, p)), 'Hai scambiato parte reale e parte immaginaria.'],
            [m(cx(-p, q)), 'Errore di segno nella parte reale.'],
          ], [m(cx(p + 1, q)), m(cx(p, q + 1)), m(cx(-p, -q))]),
          hints: ['Moltiplica numeratore e denominatore per il coniugato del denominatore.', `Il denominatore diventa ${m(`${c * c}+${e * e}=${n2}`)}.`],
          solution: [`${m(`\\dfrac{${par(a, b)}${par(c, -e)}}{${par(c, e)}${par(c, -e)}}`)}`, `Numeratore: ${m(cx(a * c + b * e, b * c - a * e))}; denominatore: ${m(n2)}.`, `${m(`\\dfrac{${cx(a * c + b * e, b * c - a * e)}}{${n2}}=${cx(p, q)}`)}`],
        };
      },
    },
    {
      id: 'com-equazione',
      level: 2,
      title: 'Equazione con discriminante negativo',
      make: (r) => {
        const p = int(r, -4, 4), q = int(r, 1, 5);
        const b = -2 * p, c = p * p + q * q;
        const eq = `x^2${b === 0 ? '' : `${b > 0 ? '+' : '-'}${Math.abs(b)}x`}+${c}=0`;
        const sol = (re: number, im: number) => m(`x=${re === 0 ? '' : re}\\pm ${im === 1 ? '' : im}i`);
        return {
          text: `Risolvi in $\\mathbb C$ l'equazione ${m(eq)}.`,
          options: mc(r, sol(p, q), [
            [sol(-p, q), 'Errore di segno nella parte reale: nella formula compare $-b$.'],
            [sol(p, 2 * q), 'Hai dimenticato di dividere per $2$ anche la parte immaginaria.'],
            ['Nessuna soluzione', 'In $\\mathbb C$ ogni equazione di secondo grado ha soluzioni.'],
          ], [sol(p, q + 1), sol(p + 1, q)]),
          hints: [R`Calcola $\Delta$: è negativo, quindi $\sqrt\Delta=i\sqrt{|\Delta|}$.`, R`$x=\dfrac{-b\pm i\sqrt{|\Delta|}}{2a}$.`],
          solution: [`${m(`\\Delta=${b * b}-${4 * c}=${b * b - 4 * c}`)}, quindi ${m(`\\sqrt\\Delta=${2 * q}i`)}.`, `${m(`x=\\dfrac{${-b}\\pm${2 * q}i}{2}`)}, cioè ${sol(p, q)}.`],
        };
      },
    },
    {
      id: 'com-trigonometrica',
      level: 2,
      title: 'Forma trigonometrica',
      make: (r) => {
        const [z, rho, th] = pick(r, [
          ['1+i', R`\sqrt2`, R`\dfrac\pi4`],
          [R`\sqrt3+i`, '2', R`\dfrac\pi6`],
          [R`1+\sqrt3\,i`, '2', R`\dfrac\pi3`],
          ['-1+i', R`\sqrt2`, R`\dfrac{3\pi}{4}`],
          ['2i', '2', R`\dfrac\pi2`],
          ['-3', '3', R`\pi`],
          ['1-i', R`\sqrt2`, R`\dfrac{7\pi}{4}`],
          [R`-1-\sqrt3\,i`, '2', R`\dfrac{4\pi}{3}`],
        ] as const);
        const f = (a: string, b: string) => m(`\\rho=${a},\\ \\theta=${b}`);
        const ths = [R`\dfrac\pi4`, R`\dfrac\pi6`, R`\dfrac\pi3`, R`\dfrac{3\pi}{4}`, R`\dfrac\pi2`, R`\pi`, R`\dfrac{7\pi}{4}`, R`\dfrac{4\pi}{3}`];
        return {
          text: `Determina modulo e argomento (in ${m('[0;2\\pi)')}) di ${m(`z=${z}`)}.`,
          options: mc(r, f(rho, th), [[f(rho === '2' ? '4' : rho === R`\sqrt2` ? '2' : '9', th), 'Il modulo è la **radice** di $a^2+b^2$.']], ths.filter((t) => t !== th).map((t) => f(rho, t))),
          hints: [R`$\rho=\sqrt{a^2+b^2}$.`, R`L'argomento soddisfa $\cos\theta=\dfrac a\rho$ e $\sin\theta=\dfrac b\rho$: individua prima il quadrante.`],
          solution: [`${m(`\\rho=${rho}`)}`, `Dal quadrante in cui si trova il punto e dai valori di seno e coseno: ${m(`\\theta=${th}`)}.`, `${m(`z=${rho}\\left(\\cos${th}+i\\sin${th}\\right)`)}`],
        };
      },
    },
    {
      id: 'com-prodotto-trig',
      level: 2,
      title: 'Prodotto in forma trigonometrica',
      make: (r) => {
        const r1 = int(r, 2, 5), r2 = int(r, 2, 5), t1 = pick(r, [20, 30, 45, 60, 100]), t2 = pick(r, [10, 15, 40, 50, 80]);
        const quot = r() < 0.4 && r1 % r2 === 0 && t1 > t2;
        const f = (a: number, b: number) => m(`\\rho=${a},\\ \\theta=${b}°`);
        const good = quot ? f(r1 / r2, t1 - t2) : f(r1 * r2, t1 + t2);
        const z = (rr: number, t: number) => `${rr}(\\cos${t}°+i\\sin${t}°)`;
        return {
          text: `Dati ${m(`z_1=${z(r1, t1)}`)} e ${m(`z_2=${z(r2, t2)}`)}, determina modulo e argomento di ${m(quot ? '\\dfrac{z_1}{z_2}' : 'z_1\\cdot z_2')}.`,
          options: mc(r, good, [
            [quot ? f(r1 - r2, t1 - t2) : f(r1 + r2, t1 + t2), quot ? 'I moduli si **dividono**, non si sottraggono.' : 'I moduli si **moltiplicano**, non si sommano.'],
            [quot ? f(r1 / r2, t1 / t2) : f(r1 * r2, t1 * t2), quot ? 'Gli argomenti si **sottraggono**.' : 'Gli argomenti si **sommano**, non si moltiplicano.'],
            [quot ? f(r1 * r2, t1 + t2) : f(r1 * r2, Math.abs(t1 - t2)), quot ? 'Questo è il prodotto.' : 'Nel prodotto gli argomenti si sommano.'],
          ], [f(r1 * r2 + 1, t1 + t2), f(r1 + r2, Math.abs(t1 - t2) + 5)]),
          hints: [quot ? 'Quoziente: si dividono i moduli e si sottraggono gli argomenti.' : 'Prodotto: si moltiplicano i moduli e si sommano gli argomenti.'],
          solution: quot ? [`${m(`\\rho=\\dfrac{${r1}}{${r2}}=${r1 / r2}`)}, ${m(`\\theta=${t1}°-${t2}°=${t1 - t2}°`)}.`] : [`${m(`\\rho=${r1}\\cdot${r2}=${r1 * r2}`)}, ${m(`\\theta=${t1}°+${t2}°=${t1 + t2}°`)}.`],
        };
      },
    },
    {
      id: 'com-demoivre',
      level: 3,
      title: 'Formula di De Moivre',
      make: (r) => {
        const [expr, ans, how] = pick(r, [
          ['(1+i)^4', '-4', R`$(\sqrt2)^4(\cos\pi+i\sin\pi)=4\cdot(-1)$`],
          ['(1+i)^8', '16', R`$(\sqrt2)^8(\cos2\pi+i\sin2\pi)=16$`],
          ['(1-i)^4', '-4', R`$(\sqrt2)^4(\cos7\pi+i\sin7\pi)=4\cdot(-1)$`],
          [R`(\sqrt3+i)^3`, '8i', R`$2^3\left(\cos\dfrac\pi2+i\sin\dfrac\pi2\right)=8i$`],
          [R`(\sqrt3+i)^6`, '-64', R`$2^6(\cos\pi+i\sin\pi)=-64$`],
          [R`(1+\sqrt3\,i)^3`, '-8', R`$2^3(\cos\pi+i\sin\pi)=-8$`],
          ['(1+i)^2', '2i', R`$(\sqrt2)^2\left(\cos\dfrac\pi2+i\sin\dfrac\pi2\right)=2i$`],
          ['(1+i)^6', '-8i', R`$(\sqrt2)^6\left(\cos\dfrac{3\pi}{2}+i\sin\dfrac{3\pi}{2}\right)=-8i$`],
        ] as const);
        return {
          text: `Calcola ${m(expr)}.`,
          options: mc(r, m(ans), [[m(ans.startsWith('-') ? ans.slice(1) : `-${ans}`), 'Il modulo è giusto ma l\'argomento no: ricontrolla $n\\theta$.']], ['4', '-4', '8', '-8', '8i', '-8i', '16', '-64', '2i', '4i'].map((x) => m(x))),
          hints: ['Scrivi la base in forma trigonometrica.', R`Applica $z^n=\rho^n(\cos n\theta+i\sin n\theta)$.`],
          solution: [`In forma trigonometrica e con De Moivre: ${how}.`, `Risultato: ${m(ans)}.`],
        };
      },
    },
    {
      id: 'com-radici',
      level: 3,
      title: 'Radici n-esime',
      make: (r) => {
        const n = pick(r, [2, 3, 4]), k = pick(r, [2, 3]);
        const rho = k ** n;
        const ask = pick(r, ['num', 'mod'] as const);
        return ask === 'num'
          ? {
              text: `Quante soluzioni complesse distinte ha l'equazione ${m(`z^{${n + 2}}=${rho}i`)}?`,
              answer: n + 2,
              tol: 0,
              hints: ['Un numero complesso non nullo ha esattamente $n$ radici $n$-esime distinte.'],
              solution: [`Le radici ${n + 2}-esime di un numero complesso non nullo sono esattamente ${m(n + 2)}, disposte ai vertici di un poligono regolare.`],
            }
          : {
              text: `Qual è il modulo di ciascuna soluzione dell'equazione ${m(`z^{${n}}=-${rho}`)}?`,
              answer: k,
              tol: 0,
              hints: [R`Le radici $n$-esime hanno tutte modulo $\sqrt[n]{\rho}$.`, `Qui ${m(`\\rho=|-${rho}|=${rho}`)}.`],
              solution: [`${m(`|z|^{${n}}=${rho}\\Rightarrow|z|=\\sqrt[${n}]{${rho}}=${k}`)}`, `Le ${n} soluzioni stanno sulla circonferenza di raggio ${m(k)}.`],
            };
      },
    },
    {
      id: 'com-radici-quadrate',
      level: 3,
      title: 'Radici quadrate in C',
      make: (r) => {
        const k = int(r, 2, 9), im = r() < 0.5;
        // z^2 = -k^2  →  ±ki ;  z^2 = 2k^2 i → ±k(1+i)
        const good = im ? m(`z=\\pm${k}(1+i)`) : m(`z=\\pm${k}i`);
        return {
          text: `Risolvi in $\\mathbb C$ l'equazione ${m(im ? `z^2=${2 * k * k}i` : `z^2=-${k * k}`)}.`,
          options: mc(r, good, [
            [im ? m(`z=\\pm${k}i`) : m(`z=\\pm${k}`), im ? `${m(`(${k}i)^2=-${k * k}`)}, che è reale.` : `${m(`(\\pm${k})^2=+${k * k}`)}: il segno è sbagliato.`],
            ['Nessuna soluzione', 'In $\\mathbb C$ ogni numero non nullo ha due radici quadrate.'],
            [im ? m(`z=\\pm${k}(1-i)`) : m(`z=${k}i`), im ? `${m(`(1-i)^2=-2i`)}: il segno è sbagliato.` : 'Le radici quadrate sono sempre due, opposte.'],
          ]),
          hints: [im ? R`Scrivi il secondo membro in forma trigonometrica: argomento $\dfrac\pi2$; le radici hanno argomento $\dfrac\pi4$ e $\dfrac{5\pi}{4}$.` : R`$-k^2=k^2\cdot i^2$.`],
          solution: im ? [`${m(`${2 * k * k}i`)} ha modulo ${m(2 * k * k)} e argomento ${m('\\dfrac\\pi2')}.`, `Le radici hanno modulo ${m(`${k}\\sqrt2`)} e argomenti ${m('\\dfrac\\pi4')} e ${m('\\dfrac{5\\pi}{4}')}: ${good}.`, `Verifica: ${m(`[${k}(1+i)]^2=${k * k}\\cdot2i`)} ✓`] : [`${m(`z^2=${k * k}\\,i^2\\Rightarrow z=\\pm${k}i`)}`],
        };
      },
    },
  ],
};
