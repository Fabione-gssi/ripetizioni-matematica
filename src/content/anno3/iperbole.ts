import { choice, frac, int, m, mc, nz, pick, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const P = (x: number | string, y: number | string) => `(${x};\\ ${y})`;
/** x^2/A - y^2/B = s (s = 1 fuochi su x, s = -1 fuochi su y) */
const hyp = (A: number, B: number, s = 1) => `\\dfrac{x^2}{${A}}-\\dfrac{y^2}{${B}}=${s}`;
/** Terne (a, b, c) con c^2 = a^2 + b^2. */
const TRIPLES = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17]] as const;

export const iperbole: Unit = {
  id: 'a3-iperbole',
  year: 3,
  title: 'Iperbole',
  summary: 'Equazione canonica, fuochi e asintoti, iperbole equilatera, funzione omografica.',
  lessons: [
    {
      id: 'a3-ipe-1',
      title: 'Definizione, equazione, asintoti',
      blocks: [
        { t: 'idea', md: R`L'iperbole è la "cugina" dell'ellisse: invece della somma, è costante la **differenza** delle distanze da due punti fissi. È formata da due rami separati che, allontanandosi, si avvicinano sempre più a due rette: gli **asintoti**.` },
        { t: 'def', title: 'Iperbole', md: R`Dati due punti $F_1$ e $F_2$ (**fuochi**), l'**iperbole** è il luogo dei punti $P$ per i quali è costante il valore assoluto della differenza delle distanze dai fuochi: $$\left|\overline{PF_1}-\overline{PF_2}\right|=2a$$ con $0<2a<\overline{F_1F_2}=2c$.` },
        {
          t: 'thm',
          title: 'Equazione canonica (fuochi sull\'asse x)',
          md: R`Con i fuochi in $F(\pm c;0)$: $$\frac{x^2}{a^2}-\frac{y^2}{b^2}=1\qquad\text{con}\quad b^2=c^2-a^2$$`,
          proof: [
            R`La condizione è $\sqrt{(x+c)^2+y^2}-\sqrt{(x-c)^2+y^2}=\pm2a$.`,
            R`Procedendo come per l'ellisse (si isola un radicale e si eleva al quadrato due volte) si arriva a $(c^2-a^2)x^2-a^2y^2=a^2(c^2-a^2)$.`,
            R`Questa volta $c>a$, quindi poniamo $b^2=c^2-a^2>0$: $b^2x^2-a^2y^2=a^2b^2$.`,
            R`Dividendo per $a^2b^2$: $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$.`,
          ],
        },
        { t: 'def', title: 'Elementi dell\'iperbole', md: R`Per $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$:
- **vertici reali:** $(\pm a;0)$; l'asse $x$ è l'**asse trasverso**. Non ci sono intersezioni con l'asse $y$.
- **fuochi:** $F(\pm c;0)$ con $c=\sqrt{a^2+b^2}$
- **asintoti:** $y=\pm\dfrac ba\,x$
- **eccentricità:** $e=\dfrac ca>1$

Se l'equazione è $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=-1$ i fuochi sono sull'asse $y$: vertici $(0;\pm b)$, fuochi $(0;\pm c)$, $e=\dfrac cb$; gli asintoti restano $y=\pm\dfrac ba x$.` },
        {
          t: 'plot',
          title: 'Rami, fuochi e asintoti',
          caption: R`Iperbole $\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$ con i suoi asintoti (tratteggiati). Gli asintoti sono le diagonali del rettangolo di lati $2a$ e $2b$.`,
          view: [-10, 10, -7.5, 7.5],
          params: [
            { name: 'a', label: 'a', min: 1, max: 5, step: 0.5, value: 3 },
            { name: 'b', label: 'b', min: 1, max: 5, step: 0.5, value: 2 },
          ],
          draw: (p) => {
            const c = Math.hypot(p.a, p.b);
            const branch = (s: number) => ({ k: 'param' as const, x: (t: number) => s * p.a * Math.cosh(t), y: (t: number) => p.b * Math.sinh(t), t0: -2.5, t1: 2.5, color: 'var(--plot-1)' });
            return [
              branch(1),
              branch(-1),
              { k: 'fn', f: (x) => (p.b / p.a) * x, dash: true, color: 'var(--plot-3)' },
              { k: 'fn', f: (x) => (-p.b / p.a) * x, dash: true, color: 'var(--plot-3)' },
              { k: 'pt', x: c, y: 0, label: 'F₂' },
              { k: 'pt', x: -c, y: 0, label: 'F₁' },
            ];
          },
          readout: (p) => `$c=${d(Math.hypot(p.a, p.b))}$, $e=${d(Math.hypot(p.a, p.b) / p.a)}$, asintoti $y=\\pm${d(p.b / p.a)}\\,x$`,
        },
        {
          t: 'ex',
          title: R`Studia l'iperbole $16x^2-9y^2=144$.`,
          steps: [R`Dividiamo per $144$: $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$. Quindi $a=3$, $b=4$.`, R`Vertici: $(\pm3;0)$. $c=\sqrt{9+16}=5$: fuochi $(\pm5;0)$.`, R`Asintoti: $y=\pm\dfrac43x$. Eccentricità: $e=\dfrac53$.`],
        },
        { t: 'warn', md: R`Nell'iperbole **non** è detto che $a>b$: è il **segno** davanti ai termini (non la grandezza dei denominatori) a stabilire su quale asse stanno i fuochi.` },
        {
          t: 'quiz',
          q: R`Quali sono gli asintoti dell'iperbole $\dfrac{x^2}{4}-\dfrac{y^2}{25}=1$?`,
          options: [
            { md: R`$y=\pm\dfrac52x$`, ok: true, why: R`Esatto: $a=2$, $b=5$, asintoti $y=\pm\dfrac ba x$.` },
            { md: R`$y=\pm\dfrac25x$`, why: R`Hai invertito: il coefficiente angolare è $\dfrac ba$, con $b$ sotto $y^2$.` },
            { md: R`$y=\pm\dfrac{25}{4}x$`, why: 'Servono $a$ e $b$, cioè le radici dei denominatori.' },
          ],
        },
      ],
    },
    {
      id: 'a3-ipe-2',
      title: 'Iperbole equilatera e funzione omografica',
      blocks: [
        { t: 'idea', md: R`Quando $a=b$ gli asintoti sono perpendicolari e l'iperbole si dice **equilatera**. Ruotandola di $45°$ gli asintoti diventano gli assi cartesiani e l'equazione diventa semplicissima: $xy=k$. È la legge della **proporzionalità inversa**: se una grandezza raddoppia, l'altra si dimezza.` },
        { t: 'def', title: 'Iperbole equilatera', md: R`- **Riferita agli assi di simmetria:** $x^2-y^2=a^2$. Asintoti $y=\pm x$, fuochi $(\pm a\sqrt2;0)$, eccentricità $e=\sqrt2$.
- **Riferita agli asintoti:** $xy=k$ con $k\neq0$. Gli asintoti sono gli assi cartesiani. Se $k>0$ i rami sono nel I e III quadrante, con vertici $(\sqrt k;\sqrt k)$ e $(-\sqrt k;-\sqrt k)$; se $k<0$ nel II e IV quadrante.` },
        {
          t: 'plot',
          title: 'Proporzionalità inversa',
          caption: R`Grafico di $xy=k$, cioè $y=\frac kx$. Per ogni punto del grafico, il rettangolo con vertici nell'origine e nel punto ha area $|k|$.`,
          view: [-8, 8, -6, 6],
          params: [
            { name: 'k', label: 'k', min: -8, max: 8, step: 1, value: 4 },
            { name: 'x', label: 'x di P', min: 0.5, max: 7, step: 0.5, value: 2 },
          ],
          draw: (p) =>
            p.k === 0
              ? [{ k: 'fn', f: () => 0 }]
              : [
                  { k: 'fn', f: (x) => (Math.abs(x) < 0.02 ? NaN : p.k / x) },
                  { k: 'seg', x1: p.x, y1: 0, x2: p.x, y2: p.k / p.x, dash: true },
                  { k: 'seg', x1: 0, y1: p.k / p.x, x2: p.x, y2: p.k / p.x, dash: true },
                  { k: 'pt', x: p.x, y: p.k / p.x, label: 'P' },
                ],
          readout: (p) => (p.k === 0 ? 'Con $k=0$ la curva degenera negli assi.' : `$P(${d(p.x)};\\ ${d(p.k / p.x)})$: $x\\cdot y=${d(p.k)}$`),
        },
        { t: 'def', title: 'Funzione omografica', md: R`La funzione $$y=\frac{ax+b}{cx+d}\qquad(c\neq0,\ ad-bc\neq0)$$ ha per grafico un'**iperbole equilatera traslata**, con
- asintoto **verticale** $x=-\dfrac dc$ (dove si annulla il denominatore)
- asintoto **orizzontale** $y=\dfrac ac$ (rapporto dei coefficienti di $x$)
- centro di simmetria $C\left(-\dfrac dc;\ \dfrac ac\right)$` },
        {
          t: 'ex',
          title: R`Studia $y=\dfrac{2x+1}{x-3}$.`,
          steps: [R`Asintoto verticale: $x-3=0\Rightarrow x=3$.`, R`Asintoto orizzontale: $y=\dfrac21=2$. Centro $C(3;2)$.`, R`Intersezioni con gli assi: per $x=0$, $y=-\dfrac13$; per $y=0$, $x=-\dfrac12$.`, R`Il grafico è un'iperbole equilatera con asintoti $x=3$ e $y=2$.`],
        },
        { t: 'def', title: 'Retta e iperbole; tangenti', md: R`Come per le altre coniche, il sistema retta–iperbole porta a un'equazione risolvente: secante, tangente o esterna a seconda del segno di $\Delta$. Fanno eccezione le rette **parallele a un asintoto**, che incontrano l'iperbole in un solo punto senza essere tangenti (la risolvente è di primo grado).

**Tangente in $P(x_0;y_0)$** dell'iperbole $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$: $\dfrac{x_0x}{a^2}-\dfrac{y_0y}{b^2}=1$.` },
        { t: 'def', title: 'Riconoscere una conica', md: R`In $px^2+qy^2+rx+sy+t=0$ (senza termine $xy$), in assenza di casi degeneri:
- $p=q$: **circonferenza**
- $p$ e $q$ concordi e diversi: **ellisse**
- $p$ e $q$ discordi: **iperbole**
- uno solo tra $p$ e $q$ è nullo: **parabola**` },
        {
          t: 'quiz',
          q: R`Qual è l'asintoto orizzontale di $y=\dfrac{3x-1}{2x+5}$?`,
          options: [
            { md: R`$y=\dfrac32$`, ok: true, why: 'Esatto: è il rapporto tra i coefficienti di $x$.' },
            { md: R`$y=-\dfrac52$`, why: R`$x=-\dfrac52$ è l'asintoto **verticale**.` },
            { md: R`$y=-\dfrac15$`, why: 'Questo è il valore della funzione per $x=0$.' },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'ipe-vertici',
      level: 1,
      title: 'Vertici',
      make: (r) => {
        const a = int(r, 1, 7), b = nz(r, 1, 7, a), onY = r() < 0.4;
        const good = onY ? m(P(0, `\\pm${b}`)) : m(P(`\\pm${a}`, 0));
        return {
          text: `Determina i vertici (reali) dell'iperbole ${m(hyp(a * a, b * b, onY ? -1 : 1))}.`,
          options: mc(r, good, [
            [onY ? m(P(`\\pm${a}`, 0)) : m(P(0, `\\pm${b}`)), onY ? 'Con $-1$ al secondo membro l\'iperbole interseca l\'asse $y$, non l\'asse $x$.' : 'Questa iperbole non interseca l\'asse $y$: ponendo $x=0$ si ottiene $y^2<0$.'],
            [onY ? m(P(0, `\\pm${b * b}`)) : m(P(`\\pm${a * a}`, 0)), 'Bisogna estrarre la radice del denominatore.'],
            [onY ? m(P(0, `\\pm${a}`)) : m(P(`\\pm${b}`, 0)), 'Hai usato il denominatore dell\'altra variabile.'],
          ]),
          hints: [onY ? 'Poni $x=0$ e ricava $y$.' : 'Poni $y=0$ e ricava $x$.'],
          solution: [onY ? `Per $x=0$: ${m(`-\\dfrac{y^2}{${b * b}}=-1\\Rightarrow y=\\pm${b}`)}.` : `Per $y=0$: ${m(`\\dfrac{x^2}{${a * a}}=1\\Rightarrow x=\\pm${a}`)}.`, `Vertici: ${good}.`],
        };
      },
    },
    {
      id: 'ipe-fuochi',
      level: 1,
      title: 'Fuochi',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLES);
        const F = (x: string) => m(`F${P(x, 0)}`);
        return {
          text: `Determina i fuochi dell'iperbole ${m(hyp(a * a, b * b))}.`,
          options: mc(r, F(`\\pm${c}`), [
            [F(`\\pm\\sqrt{${Math.abs(a * a - b * b)}}`), R`Nell'iperbole $c^2=a^2+b^2$ (somma); la differenza vale per l'ellisse.`],
            [F(`\\pm${a * a + b * b}`), 'Hai dimenticato di estrarre la radice.'],
            [m(`F${P(0, `\\pm${c}`)}`), 'Il termine positivo è quello in $x^2$: i fuochi sono sull\'asse $x$.'],
          ]),
          hints: [R`$c=\sqrt{a^2+b^2}$.`, 'Il secondo membro è $+1$: fuochi sull\'asse $x$.'],
          steps: [
            { ask: 'Quale relazione lega $a$, $b$ e $c$ nell\'iperbole?', options: choice(r, [[R`$c^2=a^2+b^2$`], [R`$c^2=a^2-b^2$`, 'Questa è la relazione dell\'**ellisse**.'], [R`$c=a+b$`, 'La relazione riguarda i quadrati.']]), explain: R`$c^2=a^2+b^2$.` },
            { ask: 'Quanto vale $c$?', options: mc(r, m(c), [[m(a * a + b * b), 'Manca la radice quadrata.'], [m(a + b), R`$\sqrt{a^2+b^2}\neq a+b$.`]], [m(c + 1), m(c - 1)]), explain: `${m(`c=\\sqrt{${a * a}+${b * b}}=${c}`)}, quindi ${F(`\\pm${c}`)}.` },
          ],
          solution: [`${m(`a^2=${a * a}`)}, ${m(`b^2=${b * b}`)}.`, `${m(`c=\\sqrt{${a * a}+${b * b}}=${c}`)}`, F(`\\pm${c}`)],
        };
      },
    },
    {
      id: 'ipe-asintoti',
      level: 1,
      title: 'Asintoti',
      make: (r) => {
        const a = int(r, 1, 6), b = nz(r, 1, 7, a);
        const as = (n: number, dn: number) => {
          const f = frac(n, dn);
          return m(`y=\\pm${f === '1' ? '' : f}x`);
        };
        return {
          text: `Determina gli asintoti dell'iperbole ${m(hyp(a * a, b * b))}.`,
          options: mc(r, as(b, a), [
            [as(a, b), R`Rapporto invertito: gli asintoti sono $y=\pm\dfrac ba x$.`],
            [as(b * b, a * a), 'Servono $a$ e $b$, non i loro quadrati.'],
            [m(`x=\\pm${a}`), 'Queste sono le rette verticali per i vertici, non gli asintoti.'],
          ], [as(a + b, a), as(b, a + 1)]),
          hints: [R`Asintoti: $y=\pm\dfrac ba x$.`, `Qui ${m(`a=${a}`)} e ${m(`b=${b}`)}.`],
          solution: [`${m(`a=\\sqrt{${a * a}}=${a}`)}, ${m(`b=\\sqrt{${b * b}}=${b}`)}.`, `Asintoti: ${as(b, a)}.`],
        };
      },
    },
    {
      id: 'ipe-distanze',
      level: 1,
      title: 'Differenza delle distanze dai fuochi',
      make: (r) => {
        const a = int(r, 1, 8), b = int(r, 1, 8);
        return {
          text: `Un punto $P$ appartiene all'iperbole ${m(hyp(a * a, b * b))}. Quanto vale ${m('|\\overline{PF_1}-\\overline{PF_2}|')}?`,
          answer: 2 * a,
          tol: 0,
          hints: ['Per definizione la differenza delle distanze dai fuochi è costante e vale $2a$.'],
          solution: [`Per ogni punto dell'iperbole ${m('|\\overline{PF_1}-\\overline{PF_2}|=2a')}.`, `Qui ${m(`a=${a}`)}: la differenza vale ${m(2 * a)}.`],
        };
      },
    },
    {
      id: 'ipe-eccentricita',
      level: 2,
      title: 'Eccentricità',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLES);
        return {
          text: `Calcola l'eccentricità dell'iperbole ${m(hyp(a * a, b * b))}.`,
          options: mc(r, m(frac(c, a)), [
            [m(frac(a, c)), 'Rapporto invertito: nell\'iperbole l\'eccentricità è maggiore di $1$.'],
            [m(frac(c, b)), 'Si divide per $a$ (semiasse trasverso), che qui è sotto $x^2$.'],
            [m(frac(b, a)), 'Questo è il coefficiente angolare degli asintoti.'],
          ], [m(frac(c * c, a * a))]),
          hints: [R`$e=\dfrac ca$ con $c=\sqrt{a^2+b^2}$.`],
          solution: [`${m(`c=\\sqrt{${a * a}+${b * b}}=${c}`)}`, `${m(`e=\\dfrac ca=${frac(c, a)}`)} (maggiore di $1$, come sempre per un'iperbole).`],
        };
      },
    },
    {
      id: 'ipe-b2',
      level: 2,
      title: 'Iperbole dati fuoco e vertice',
      make: (r) => {
        const [a, b, c] = pick(r, TRIPLES);
        return {
          text: `Un'iperbole con centro nell'origine ha un fuoco in ${m(`F${P(c, 0)}`)} e un vertice in ${m(`A${P(a, 0)}`)}. Quanto vale $b^2$?`,
          answer: b * b,
          tol: 0,
          hints: [R`Nell'iperbole $c^2=a^2+b^2$.`, 'Quindi $b^2=c^2-a^2$.'],
          solution: [`${m(`a=${a}`)}, ${m(`c=${c}`)}.`, `${m(`b^2=c^2-a^2=${c * c}-${a * a}=${b * b}`)}`, `Equazione: ${m(hyp(a * a, b * b))}.`],
        };
      },
    },
    {
      id: 'ipe-equilatera',
      level: 1,
      title: 'Iperbole equilatera per un punto',
      make: (r) => {
        const x0 = nz(r, -6, 6), y0 = nz(r, -6, 6);
        return {
          text: `L'iperbole equilatera $xy=k$ passa per il punto ${m(`P${P(x0, y0)}`)}. Quanto vale $k$?`,
          answer: x0 * y0,
          tol: 0,
          hints: ['Sostituisci le coordinate del punto nell\'equazione.'],
          solution: [`${m(`k=x_0\\cdot y_0=${x0}\\cdot(${y0})=${x0 * y0}`)}`, `I rami sono nel ${x0 * y0 > 0 ? 'I e III' : 'II e IV'} quadrante.`],
        };
      },
    },
    {
      id: 'ipe-omografica',
      level: 2,
      title: 'Asintoti della funzione omografica',
      make: (r) => {
        const a = nz(r, -4, 4), b = int(r, -5, 5), dd = nz(r, -5, 5);
        const b2 = a * dd - b === 0 ? b + 1 : b; // garantisce ad - bc ≠ 0 (c = 1)
        const f = `y=\\dfrac{${a === 1 ? '' : a === -1 ? '-' : a}x${sg(b2)}}{x${sg(dd)}}`;
        const as = (x: number, y: number) => m(`x=${x},\\ y=${y}`);
        return {
          text: `Determina gli asintoti della funzione omografica ${m(f)}.`,
          options: mc(r, as(-dd, a), [
            [as(dd, a), 'L\'asintoto verticale è dove il denominatore si **annulla**: attenzione al segno.'],
            [as(a, -dd), 'Hai scambiato asintoto verticale e orizzontale.'],
            [as(-dd, b2), 'L\'asintoto orizzontale è il rapporto tra i coefficienti di $x$, non il termine noto.'],
          ], [as(-dd, -a), as(dd, -a)]),
          hints: ['Asintoto verticale: annulla il denominatore.', 'Asintoto orizzontale: rapporto tra i coefficienti di $x$ a numeratore e denominatore.'],
          solution: [`Denominatore nullo per ${m(`x=${-dd}`)}: asintoto verticale.`, `Rapporto dei coefficienti di $x$: ${m(`y=\\dfrac{${a}}{1}=${a}`)}: asintoto orizzontale.`, `Centro di simmetria ${m(`C${P(-dd, a)}`)}.`],
        };
      },
    },
    {
      id: 'ipe-riconosci',
      level: 2,
      title: 'Riconoscere una conica',
      make: (r) => {
        const p = int(r, 2, 6), q = nz(r, 2, 7, p), k = int(r, 1, 9) * 4;
        const [eq, kind] = pick(r, [
          [`${p}x^2+${p}y^2=${k}`, 'Circonferenza'],
          [`${p}x^2+${q}y^2=${k}`, 'Ellisse'],
          [`${p}x^2-${q}y^2=${k}`, 'Iperbole'],
          [`y=${p}x^2-${q}x`, 'Parabola'],
          [`${q}y^2-${p}x^2=${k}`, 'Iperbole'],
          [`x^2+y^2-${p}x-${k}=0`, 'Circonferenza'],
        ] as const);
        const why: Record<string, string> = {
          Circonferenza: 'i coefficienti di $x^2$ e $y^2$ sono uguali',
          Ellisse: 'i coefficienti di $x^2$ e $y^2$ sono concordi ma diversi',
          Iperbole: 'i coefficienti di $x^2$ e $y^2$ sono discordi',
          Parabola: 'compare al secondo grado una sola delle due variabili',
        };
        return {
          text: `Che tipo di curva rappresenta l'equazione ${m(eq)}?`,
          options: choice(r, [[kind, `Corretto: ${why[kind]}.`], ...Object.keys(why).filter((x) => x !== kind).map((x): [string, string] => [x, `Osserva i termini di secondo grado: ${why[kind]}.`])]),
          hints: ['Guarda i coefficienti di $x^2$ e $y^2$: sono uguali, concordi, discordi, o ne manca uno?'],
          solution: [`Nell'equazione ${why[kind]}.`, `Si tratta quindi di: ${kind.toLowerCase()}.`],
        };
      },
    },
    {
      id: 'ipe-tangente',
      level: 3,
      title: 'Tangente in un punto',
      make: (r) => {
        const p = int(r, 1, 4), q = int(r, 1, 3), x0 = nz(r, -4, 4), y0 = nz(r, -3, 3);
        const K0 = p * x0 * x0 - q * y0 * y0;
        const xx = K0 === 0 ? x0 + (x0 > 0 ? 1 : -1) : x0; // evita il caso degenere K = 0
        const K = p * xx * xx - q * y0 * y0;
        const eq = `${p === 1 ? '' : p}x^2-${q === 1 ? '' : q}y^2=${K}`;
        return {
          text: `Calcola il coefficiente angolare della tangente all'iperbole ${m(eq)} nel suo punto ${m(`P${P(xx, y0)}`)}.`,
          options: mc(r, m(frac(p * xx, q * y0)), [
            [m(frac(-p * xx, q * y0)), 'Errore di segno: nell\'iperbole il termine in $y$ ha il segno meno.'],
            [m(frac(q * y0, p * xx)), 'Hai invertito il rapporto.'],
            [m(frac(xx, y0)), 'Hai dimenticato i coefficienti di $x^2$ e $y^2$.'],
          ], [m(frac(y0, xx)), m(frac(p * xx + 1, q * y0))]),
          hints: ['Usa lo sdoppiamento: $x^2\\to x_0x$, $y^2\\to y_0y$.', 'Poi ricava $y$ e leggi il coefficiente angolare.'],
          solution: [`Sdoppiamento: ${m(`${p * xx}x${sg(-q * y0, 'y')}=${K}`)}.`, `Ricavando $y$: ${m(`m=\\dfrac{${p * xx}}{${q * y0}}=${frac(p * xx, q * y0)}`)}.`],
        };
      },
    },
    {
      id: 'ipe-intersezioni',
      level: 3,
      title: 'Intersezioni con una retta',
      make: (r) => {
        const u = int(r, 1, 5), v = -int(r, 1, 5);
        // xy = k e y = x + dd: x^2 + dd x - k = 0 con radici u, v
        const dd = -(u + v), k = -u * v;
        const pts = (a: number, b: number, c: number, e: number) => m(`${P(a, b)}\\ \\text{e}\\ ${P(c, e)}`);
        const line = `y=x${sg(dd)}`;
        return {
          text: `Trova i punti di intersezione tra l'iperbole ${m(`xy=${k}`)} e la retta ${m(line)}.`,
          options: mc(r, pts(v, v + dd, u, u + dd), [
            [pts(v, 0, u, 0), 'Hai trovato solo le ascisse: le ordinate si ottengono sostituendo nella retta.'],
            [pts(-u, -u + dd, -v, -v + dd), 'Le ascisse hanno il segno sbagliato: ricontrolla l\'equazione risolvente.'],
            [pts(v, u, u, v), 'Controlla le ordinate sostituendo le ascisse nell\'equazione della retta.'],
          ], [pts(v, v + dd + 1, u, u + dd + 1), pts(v - 1, v + dd, u + 1, u + dd)]),
          hints: ['Sostituisci l\'espressione di $y$ data dalla retta nell\'equazione dell\'iperbole.', `Ottieni ${m(`x(x${sg(dd)})=${k}`)}: risolvi l'equazione di secondo grado.`],
          solution: [`${m(`x(x${sg(dd)})=${k}\\Rightarrow x^2${sg(dd, 'x')}-${k}=0`)}`, `Soluzioni: ${m(`x=${v}`)} e ${m(`x=${u}`)}.`, `Ordinate: ${m(`y=${v + dd}`)} e ${m(`y=${u + dd}`)}. Punti: ${pts(v, v + dd, u, u + dd)}.`],
        };
      },
    },
    {
      id: 'ipe-asintoto-b',
      level: 3,
      title: 'Iperbole dati vertice e asintoto',
      make: (r) => {
        const a = int(r, 1, 5), k = int(r, 2, 4);
        return {
          text: `Un'iperbole con centro nell'origine e fuochi sull'asse $x$ ha un vertice in ${m(P(a, 0))} e un asintoto di equazione ${m(`y=${k}x`)}. Quanto vale $b^2$?`,
          answer: (a * k) ** 2,
          tol: 0,
          hints: [R`L'asintoto è $y=\dfrac ba x$.`, `Quindi ${m(`\\dfrac ba=${k}`)} con ${m(`a=${a}`)}.`],
          solution: [`Dal vertice: ${m(`a=${a}`)}.`, `Dall'asintoto: ${m(`\\dfrac{b}{${a}}=${k}\\Rightarrow b=${a * k}`)}.`, `${m(`b^2=${(a * k) ** 2}`)}; equazione ${m(hyp(a * a, (a * k) ** 2))}.`],
        };
      },
    },
  ],
};
