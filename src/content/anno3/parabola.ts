import { choice, frac, int, m, mc, nz, par, pick, poly, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const P = (x: number | string, y: number | string) => `(${x};\\ ${y})`;

/** y = ±(1/4)x^2 + bx + c in LaTeX (a = s/4 con s = ±1). */
const quarter = (s: number, b: number, c: number) => `y=${s < 0 ? '-' : ''}\\dfrac{1}{4}x^2${sg(b, 'x')}${sg(c)}`;

export const parabola: Unit = {
  id: 'a3-parabola',
  year: 3,
  title: 'Parabola',
  summary: 'Luogo geometrico, vertice, fuoco e direttrice, rette tangenti.',
  lessons: [
    {
      id: 'a3-par-1',
      title: 'La parabola come luogo geometrico',
      blocks: [
        { t: 'idea', md: R`Un getto d'acqua, la traiettoria di un pallone, la sezione di un'antenna satellitare: sono tutte parabole. La parabola è l'insieme dei punti che hanno **la stessa distanza da un punto fisso e da una retta fissa**.` },
        { t: 'def', title: 'Parabola', md: R`Dati un punto $F$ (**fuoco**) e una retta $d$ (**direttrice**) non passante per $F$, la **parabola** è il luogo dei punti $P$ del piano equidistanti da $F$ e da $d$: $$\overline{PF}=\overline{PH}$$ dove $H$ è il piede della perpendicolare da $P$ a $d$. La retta per $F$ perpendicolare a $d$ è l'**asse** di simmetria; il punto della parabola sull'asse è il **vertice**.` },
        {
          t: 'thm',
          title: 'Equazione con asse parallelo all\'asse y',
          md: R`Una parabola con asse parallelo all'asse $y$ ha equazione $$y=ax^2+bx+c\qquad(a\neq0)$$`,
          proof: [
            R`Partiamo dal caso più semplice: fuoco $F(0;p)$ e direttrice $y=-p$ (con $p\neq0$). Il vertice è nell'origine.`,
            R`Per un punto $P(x;y)$: $\overline{PF}=\sqrt{x^2+(y-p)^2}$ e $\overline{PH}=|y+p|$.`,
            R`Imponiamo $\overline{PF}=\overline{PH}$ ed eleviamo al quadrato: $x^2+y^2-2py+p^2=y^2+2py+p^2$.`,
            R`Semplificando: $x^2=4py$, cioè $y=\dfrac{1}{4p}x^2$. Posto $a=\dfrac{1}{4p}$ si ha $y=ax^2$.`,
            R`Traslando il vertice in un punto qualsiasi $V(x_V;y_V)$ si ottiene $y-y_V=a(x-x_V)^2$, che sviluppata è della forma $y=ax^2+bx+c$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Fuoco, direttrice e punti equidistanti',
          caption: R`Il punto $P$ si muove sulla parabola $y=\frac{1}{4p}x^2$: il segmento $PF$ e il segmento $PH$ (verso la direttrice) hanno sempre la stessa lunghezza.`,
          view: [-6, 6, -3, 6],
          params: [
            { name: 'p', label: 'p', min: 0.5, max: 2, step: 0.25, value: 1 },
            { name: 't', label: 'x di P', min: -5, max: 5, step: 0.5, value: 3 },
          ],
          draw: (p) => {
            const y = (p.t * p.t) / (4 * p.p);
            return [
              { k: 'fn', f: (x) => (x * x) / (4 * p.p) },
              { k: 'fn', f: () => -p.p, dash: true, color: 'var(--plot-3)' },
              { k: 'seg', x1: p.t, y1: y, x2: 0, y2: p.p, color: 'var(--plot-2)' },
              { k: 'seg', x1: p.t, y1: y, x2: p.t, y2: -p.p, color: 'var(--plot-2)' },
              { k: 'pt', x: 0, y: p.p, label: 'F' },
              { k: 'pt', x: p.t, y, label: 'P' },
              { k: 'pt', x: p.t, y: -p.p, label: 'H' },
            ];
          },
          readout: (p) => {
            const y = (p.t * p.t) / (4 * p.p);
            return `$\\overline{PF}=${d(Math.hypot(p.t, y - p.p))}$, $\\overline{PH}=${d(y + p.p)}$`;
          },
        },
        { t: 'def', title: 'Elementi caratteristici', md: R`Per $y=ax^2+bx+c$, posto $\Delta=b^2-4ac$:
- **asse:** $x=-\dfrac{b}{2a}$
- **vertice:** $V\left(-\dfrac{b}{2a};\ -\dfrac{\Delta}{4a}\right)$
- **fuoco:** $F\left(-\dfrac{b}{2a};\ \dfrac{1-\Delta}{4a}\right)$
- **direttrice:** $y=-\dfrac{1+\Delta}{4a}$

Se $a>0$ la concavità è rivolta verso l'alto, se $a<0$ verso il basso. Più $|a|$ è grande, più la parabola è "stretta".` },
        {
          t: 'ex',
          title: R`Determina vertice, fuoco e direttrice di $y=x^2-4x+3$.`,
          steps: [R`$a=1,\ b=-4,\ c=3$; $\Delta=16-12=4$.`, R`Asse: $x=-\dfrac{-4}{2}=2$. Ordinata del vertice: $-\dfrac{4}{4}=-1$ (oppure si sostituisce $x=2$: $4-8+3=-1$). $V(2;-1)$.`, R`Fuoco: $y_F=\dfrac{1-4}{4}=-\dfrac34$, quindi $F\left(2;-\frac34\right)$.`, R`Direttrice: $y=-\dfrac{1+4}{4}=-\dfrac54$. Controllo: vertice a metà tra fuoco e direttrice ✓.`],
        },
        { t: 'warn', md: R`Per l'ordinata del vertice non serve ricordare $-\frac{\Delta}{4a}$: basta sostituire $x_V$ nell'equazione. È il metodo più sicuro.` },
        {
          t: 'quiz',
          q: R`La parabola $y=-2x^2+8x-1$ ha la concavità rivolta:`,
          options: [
            { md: 'verso il basso', ok: true, why: 'Esatto: $a=-2<0$.' },
            { md: 'verso l\'alto', why: 'La concavità dipende dal segno di $a$, che qui è negativo.' },
            { md: 'verso destra', why: 'Le parabole $y=ax^2+bx+c$ hanno asse verticale: la concavità è verso l\'alto o verso il basso.' },
          ],
        },
      ],
    },
    {
      id: 'a3-par-2',
      title: 'Grafico e ricerca dell\'equazione',
      blocks: [
        { t: 'idea', md: R`Per disegnare una parabola bastano pochi elementi: il vertice, la concavità e le intersezioni con gli assi. Viceversa, per **trovare** l'equazione servono tre condizioni, perché i coefficienti $a,b,c$ sono tre.` },
        {
          t: 'plot',
          title: 'Come cambiano vertice, fuoco e direttrice',
          caption: R`Muovi i coefficienti di $y=ax^2+bx+c$ e osserva vertice $V$, fuoco $F$ e direttrice (tratteggiata).`,
          view: [-6, 6, -6, 8],
          params: [
            { name: 'a', label: 'a', min: -1.5, max: 1.5, step: 0.25, value: 0.5 },
            { name: 'b', label: 'b', min: -4, max: 4, step: 0.5, value: -1 },
            { name: 'c', label: 'c', min: -4, max: 4, step: 0.5, value: -2 },
          ],
          draw: (p) => {
            if (p.a === 0) return [{ k: 'fn', f: (x) => p.b * x + p.c }];
            const xv = -p.b / (2 * p.a), dl = p.b * p.b - 4 * p.a * p.c;
            return [
              { k: 'fn', f: (x) => p.a * x * x + p.b * x + p.c },
              { k: 'fn', f: () => -(1 + dl) / (4 * p.a), dash: true, color: 'var(--plot-3)' },
              { k: 'vline', x: xv, dash: true, color: 'var(--muted)' },
              { k: 'pt', x: xv, y: -dl / (4 * p.a), label: 'V' },
              { k: 'pt', x: xv, y: (1 - dl) / (4 * p.a), label: 'F', color: 'var(--plot-3)' },
            ];
          },
          readout: (p) => (p.a === 0 ? 'Con $a=0$ la curva è una retta.' : `$V(${d(-p.b / (2 * p.a))};\\ ${d(-(p.b * p.b - 4 * p.a * p.c) / (4 * p.a))})$ — concavità verso ${p.a > 0 ? "l'alto" : 'il basso'}`),
        },
        { t: 'def', title: 'Intersezioni con gli assi', md: R`- Con l'**asse $y$**: si pone $x=0$ e si ottiene il punto $(0;c)$.
- Con l'**asse $x$**: si pone $y=0$ e si risolve $ax^2+bx+c=0$. Ci sono due punti se $\Delta>0$, uno (il vertice, parabola tangente all'asse) se $\Delta=0$, nessuno se $\Delta<0$.` },
        { t: 'def', title: 'Trovare l\'equazione', md: R`Ogni informazione fornisce un'equazione nelle incognite $a,b,c$:
- **passaggio per un punto** $P(x_0;y_0)$: $y_0=ax_0^2+bx_0+c$;
- **vertice noto** $V(x_V;y_V)$: conviene la forma $y=a(x-x_V)^2+y_V$, in cui resta da trovare solo $a$;
- **asse noto**: $-\dfrac{b}{2a}=x_V$;
- **fuoco o direttrice noti**: si usano le formule corrispondenti.` },
        {
          t: 'ex',
          title: R`Trova la parabola con vertice $V(1;-2)$ passante per $P(3;6)$.`,
          steps: [R`Usiamo la forma con il vertice: $y=a(x-1)^2-2$.`, R`Imponiamo il passaggio per $P$: $6=a(3-1)^2-2\Rightarrow 4a=8\Rightarrow a=2$.`, R`Equazione: $y=2(x-1)^2-2=2x^2-4x$.`],
        },
        {
          t: 'ex',
          title: R`Trova la parabola passante per $A(0;1)$, $B(1;0)$, $C(2;3)$.`,
          steps: [R`Passaggio per $A$: $c=1$.`, R`Passaggio per $B$: $a+b+1=0$; per $C$: $4a+2b+1=3$.`, R`Dal sistema: $b=-1-a$, quindi $4a-2-2a=2\Rightarrow a=2$, $b=-3$.`, R`Equazione: $y=2x^2-3x+1$.`],
        },
        { t: 'def', title: 'Parabola con asse parallelo all\'asse x', md: R`Scambiando i ruoli di $x$ e $y$ si ottiene $x=ay^2+by+c$: asse orizzontale $y=-\dfrac{b}{2a}$, vertice $V\left(-\dfrac{\Delta}{4a};-\dfrac{b}{2a}\right)$, concavità verso destra se $a>0$, verso sinistra se $a<0$. Non è il grafico di una funzione $y=f(x)$.` },
      ],
    },
    {
      id: 'a3-par-3',
      title: 'Retta e parabola: tangenti',
      blocks: [
        { t: 'idea', md: R`Una retta può attraversare una parabola in due punti, sfiorarla in uno solo o non incontrarla affatto. Il sistema tra le due equazioni porta a un'equazione di secondo grado: è il suo **discriminante** a decidere.` },
        { t: 'def', title: 'Posizione di una retta rispetto a una parabola', md: R`Sostituendo $y=mx+q$ in $y=ax^2+bx+c$ si ottiene l'**equazione risolvente** $ax^2+(b-m)x+(c-q)=0$:
- $\Delta>0$: retta **secante** (due punti comuni);
- $\Delta=0$: retta **tangente** (due intersezioni coincidenti);
- $\Delta<0$: retta **esterna**.

Fanno eccezione le rette parallele all'asse, che incontrano la parabola in un solo punto senza essere tangenti.` },
        {
          t: 'plot',
          title: 'Secante, tangente, esterna',
          caption: R`Parabola $y=x^2$ e retta $y=mx+q$. Abbassa $q$ fino a quando i due punti di intersezione si fondono: la retta è diventata tangente.`,
          view: [-4, 4, -4, 8],
          params: [
            { name: 'm', label: 'm', min: -3, max: 3, step: 0.5, value: 1 },
            { name: 'q', label: 'q', min: -4, max: 4, step: 0.25, value: 2 },
          ],
          draw: (p) => {
            const dl = p.m * p.m + 4 * p.q;
            const xs = dl >= 0 ? [(p.m - Math.sqrt(dl)) / 2, (p.m + Math.sqrt(dl)) / 2] : [];
            return [{ k: 'fn', f: (x) => x * x }, { k: 'fn', f: (x) => p.m * x + p.q }, ...xs.map((x) => ({ k: 'pt' as const, x, y: x * x }))];
          },
          readout: (p) => {
            const dl = p.m * p.m + 4 * p.q;
            return `Risolvente $x^2-${par(d(p.m))}x-${par(d(p.q))}=0$, $\\Delta=${d(dl)}$: retta **${dl > 0 ? 'secante' : dl === 0 ? 'tangente' : 'esterna'}**`;
          },
        },
        { t: 'def', title: 'Rette tangenti condotte da un punto', md: R`Per trovare le tangenti da $P(x_0;y_0)$:
1. si scrive il fascio di rette per $P$: $y-y_0=m(x-x_0)$;
2. si fa sistema con la parabola e si ottiene l'equazione risolvente;
3. si impone $\Delta=0$ e si ricava $m$.

Se $P$ è esterno alla parabola si trovano due tangenti, se appartiene alla parabola una, se è interno nessuna.` },
        {
          t: 'thm',
          title: 'Tangente in un punto della parabola',
          md: R`Se $P(x_0;y_0)$ appartiene alla parabola $y=ax^2+bx+c$, la tangente in $P$ ha coefficiente angolare $$m=2ax_0+b$$ (Si ottiene anche con la **formula di sdoppiamento**: $\dfrac{y+y_0}{2}=ax_0x+b\,\dfrac{x+x_0}{2}+c$.)`,
          proof: [
            R`Retta per $P$: $y=y_0+m(x-x_0)$. Sistema con la parabola: $ax^2+bx+c=y_0+m(x-x_0)$.`,
            R`Poiché $y_0=ax_0^2+bx_0+c$, sottraendo: $a(x^2-x_0^2)+b(x-x_0)=m(x-x_0)$.`,
            R`Raccogliamo $(x-x_0)$: $(x-x_0)\,[a(x+x_0)+b-m]=0$. Le soluzioni sono $x=x_0$ e $x=\dfrac{m-b}{a}-x_0$.`,
            R`La retta è tangente quando le due soluzioni coincidono: $\dfrac{m-b}{a}-x_0=x_0$, cioè $m=2ax_0+b$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Trova le tangenti alla parabola $y=x^2$ condotte da $P(0;-4)$.`,
          steps: [R`Fascio per $P$: $y=mx-4$.`, R`Sistema: $x^2=mx-4$, cioè $x^2-mx+4=0$.`, R`Tangenza: $\Delta=m^2-16=0\Rightarrow m=\pm4$.`, R`Tangenti: $y=4x-4$ e $y=-4x-4$ (punti di contatto $(2;4)$ e $(-2;4)$).`],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'par-vertice',
      level: 1,
      title: 'Vertice della parabola',
      make: (r) => {
        const a = pick(r, [1, 2, -1, -2, 3]), xv = nz(r, -4, 4), yv = int(r, -5, 5);
        const b = -2 * a * xv, c = a * xv * xv + yv;
        const eq = `y=${poly([a, b, c])}`;
        const V = (x: number | string, y: number | string) => m(`V${P(x, y)}`);
        return {
          text: `Determina il vertice della parabola ${m(eq)}.`,
          options: mc(r, V(xv, yv), [
            [V(-xv, a * xv * xv + b * -xv + c), R`Errore di segno nell'ascissa: $x_V=-\dfrac{b}{2a}$.`],
            [V(2 * xv, a * 4 * xv * xv + b * 2 * xv + c), R`Hai calcolato $-\dfrac ba$: al denominatore serve $2a$.`],
            [V(xv, c), 'L\'ordinata del vertice non è $c$: sostituisci $x_V$ nell\'equazione.'],
          ], [V(xv, yv + 1), V(xv + 1, yv)]),
          hints: [R`L'ascissa del vertice è $x_V=-\dfrac{b}{2a}$.`, 'Per l\'ordinata sostituisci $x_V$ nell\'equazione.'],
          steps: [
            { ask: R`Quanto vale $x_V=-\dfrac{b}{2a}$?`, options: mc(r, m(xv), [[m(-xv), 'Hai dimenticato il segno meno davanti alla frazione.'], [m(2 * xv), 'Al denominatore c\'è $2a$, non $a$.']], [m(xv + 1), m(xv - 2)]), explain: `${m(`x_V=-\\dfrac{${b}}{2\\cdot${par(a)}}=${xv}`)}.` },
            { ask: `Sostituisci ${m(`x=${xv}`)} nell'equazione. Quanto vale $y_V$?`, options: mc(r, m(yv), [[m(c), 'Questo è il valore per $x=0$.'], [m(-a * xv * xv + b * xv + c), `Attenzione al segno di ${m(`${a}\\cdot${par(xv)}^2`)}: il quadrato è positivo.`]], [m(yv + 2), m(yv - 1)]), explain: `${m(`y_V=${a}\\cdot${par(xv)}^2${sg(b)}\\cdot${par(xv)}${sg(c)}=${yv}`)}, quindi ${V(xv, yv)}.` },
          ],
          solution: [`${m(`x_V=-\\dfrac{b}{2a}=-\\dfrac{${b}}{${2 * a}}=${xv}`)}`, `${m(`y_V=${a}\\cdot${par(xv)}^2${sg(b)}\\cdot${par(xv)}${sg(c)}=${yv}`)}`, `${V(xv, yv)}`],
        };
      },
    },
    {
      id: 'par-asse',
      level: 1,
      title: 'Asse di simmetria',
      make: (r) => {
        const a = pick(r, [1, 2, -1, -2, 4]), xv = nz(r, -5, 5), c = int(r, -6, 6);
        const b = -2 * a * xv;
        return {
          text: `L'asse di simmetria della parabola ${m(`y=${poly([a, b, c])}`)} è la retta $x=k$. Quanto vale $k$?`,
          answer: xv,
          tol: 0,
          hints: [R`L'asse ha equazione $x=-\dfrac{b}{2a}$.`],
          solution: [`${m(`x=-\\dfrac{b}{2a}=-\\dfrac{${b}}{2\\cdot${par(a)}}=${xv}`)}`],
        };
      },
    },
    {
      id: 'par-zeri',
      level: 1,
      title: 'Intersezioni con l\'asse x',
      make: (r) => {
        const p = int(r, -5, 2), q = int(r, p + 1, 6), a = pick(r, [1, -1, 2]);
        const eq = `y=${poly([a, -a * (p + q), a * p * q])}`;
        const pts = (u: number, v: number) => m(`${P(u, 0)}\\ \\text{e}\\ ${P(v, 0)}`);
        return {
          text: `In quali punti la parabola ${m(eq)} interseca l'asse $x$?`,
          options: mc(r, pts(p, q), [
            [pts(-q, -p), 'Le ascisse hanno il segno sbagliato: risolvi con attenzione l\'equazione $y=0$.'],
            [m(`${P(0, p)}\\ \\text{e}\\ ${P(0, q)}`), 'Sull\'asse $x$ è l\'**ordinata** a essere nulla.'],
            [m(P(0, a * p * q)), 'Questa è l\'intersezione con l\'asse $y$.'],
          ], [pts(p - 1, q + 1), pts(p, q + 1)]),
          hints: ['Sull\'asse $x$ si ha $y=0$.', `Risolvi ${m(`${poly([a, -a * (p + q), a * p * q])}=0`)}.`],
          solution: [`Poniamo $y=0$: ${m(`${poly([a, -a * (p + q), a * p * q])}=0`)}${a !== 1 ? `, cioè ${m(`${poly([1, -(p + q), p * q])}=0`)}` : ''}.`, `Soluzioni: ${m(`x=${p}`)} e ${m(`x=${q}`)}.`, `Punti: ${pts(p, q)}.`],
        };
      },
    },
    {
      id: 'par-riconosci',
      level: 1,
      title: 'Riconoscere una parabola',
      make: (r) => {
        const h = nz(r, -4, 4), k = nz(r, -4, 4, h, -h), up = r() < 0.5;
        const eq = (s: number, hh: number, kk: number) => m(`y=${s < 0 ? '-' : ''}(x${sg(-hh)})^2${sg(kk)}`);
        return {
          text: `Quale parabola ha vertice ${m(`V${P(h, k)}`)} e concavità rivolta verso ${up ? "l'alto" : 'il basso'}?`,
          options: choice(r, [
            [eq(up ? 1 : -1, h, k), R`Corretto: $y=a(x-x_V)^2+y_V$ con il segno di $a$ che decide la concavità.`],
            [eq(up ? -1 : 1, h, k), 'Il vertice è giusto, ma la concavità è opposta: guarda il segno davanti alla parentesi.'],
            [eq(up ? 1 : -1, -h, k), `L'ascissa del vertice è il valore che annulla la parentesi: qui sarebbe ${m(-h)}.`],
            [eq(up ? 1 : -1, k, h), 'Hai scambiato le coordinate del vertice.'],
          ]),
          hints: [R`Usa la forma $y=a(x-x_V)^2+y_V$.`, 'La concavità è verso l\'alto se $a>0$.'],
          solution: [`Forma con il vertice: ${m('y=a(x-x_V)^2+y_V')}.`, `Con ${m(`x_V=${h}`)}, ${m(`y_V=${k}`)} e ${m(up ? 'a>0' : 'a<0')}: ${eq(up ? 1 : -1, h, k)}.`],
        };
      },
    },
    {
      id: 'par-fuoco',
      level: 2,
      title: 'Fuoco',
      make: (r) => {
        const s = pick(r, [1, -1]), xv = 2 * nz(r, -2, 2), yv = int(r, -4, 4);
        const b = (-s * xv) / 2, c = (s * xv * xv) / 4 + yv;
        const F = (x: number, y: number) => m(`F${P(x, y)}`);
        return {
          text: `Determina il fuoco della parabola ${m(quarter(s, b, c))}.`,
          options: mc(r, F(xv, yv + s), [
            [F(xv, yv), 'Questo è il **vertice**. Il fuoco si trova sull\'asse, a distanza $\\frac{1}{4|a|}$ dal vertice, dalla parte della concavità.'],
            [F(xv, yv - s), 'Il fuoco sta dalla parte della concavità (all\'interno della parabola), non dalla parte opposta.'],
            [F(-xv, yv + s), R`Errore di segno nell'ascissa: $x_F=-\dfrac{b}{2a}$.`],
          ]),
          hints: [R`Il fuoco ha la stessa ascissa del vertice: $x_F=-\dfrac{b}{2a}$.`, R`$y_F=\dfrac{1-\Delta}{4a}$, oppure $y_F=y_V+\dfrac{1}{4a}$.`],
          solution: [`${m(`x_V=-\\dfrac{b}{2a}=${xv}`)}; sostituendo, ${m(`y_V=${yv}`)}.`, `${m(`\\dfrac{1}{4a}=${s}`)}, quindi ${m(`y_F=y_V+\\dfrac{1}{4a}=${yv + s}`)}.`, `${F(xv, yv + s)}`],
        };
      },
    },
    {
      id: 'par-direttrice',
      level: 2,
      title: 'Direttrice',
      make: (r) => {
        const s = pick(r, [1, -1]), xv = 2 * nz(r, -2, 2), yv = int(r, -4, 4);
        const b = (-s * xv) / 2, c = (s * xv * xv) / 4 + yv;
        return {
          text: `La direttrice della parabola ${m(quarter(s, b, c))} è la retta $y=k$. Quanto vale $k$?`,
          answer: yv - s,
          tol: 0,
          hints: [R`La direttrice è $y=-\dfrac{1+\Delta}{4a}$, oppure $y=y_V-\dfrac{1}{4a}$.`, 'Il vertice è il punto medio tra il fuoco e la direttrice (lungo l\'asse).'],
          solution: [`Vertice: ${m(`V${P(xv, yv)}`)}.`, `${m(`\\dfrac{1}{4a}=${s}`)}: la direttrice è ${m(`y=y_V-\\dfrac{1}{4a}=${yv}-${par(s)}=${yv - s}`)}.`],
        };
      },
    },
    {
      id: 'par-vertice-punto',
      level: 2,
      title: 'Parabola dati vertice e punto',
      make: (r) => {
        const a = pick(r, [1, 2, 3, -1, -2, -3]), xv = int(r, -3, 3), yv = int(r, -4, 4), dx = pick(r, [1, 2, -1, -2]);
        const px = xv + dx, py = yv + a * dx * dx;
        return {
          text: `Una parabola con asse parallelo all'asse $y$ ha vertice ${m(`V${P(xv, yv)}`)} e passa per ${m(`P${P(px, py)}`)}. Quanto vale il coefficiente $a$?`,
          answer: a,
          tol: 0,
          hints: [R`Usa la forma $y=a(x-x_V)^2+y_V$.`, 'Sostituisci le coordinate di $P$ e ricava $a$.'],
          steps: [
            { ask: 'Qual è la forma più comoda quando si conosce il vertice?', options: mc(r, m(`y=a(x${sg(-xv)})^2${sg(yv)}`), [[m(`y=a(x${sg(xv)})^2${sg(yv)}`), 'Nella parentesi compare $x-x_V$: attenzione al segno.'], [m(`y=a(x${sg(-yv)})^2${sg(xv)}`), 'Hai scambiato le coordinate del vertice.']], [m(`y=a(x${sg(-xv - 1)})^2${sg(yv)}`), m(`y=a(x${sg(-xv)})^2${sg(yv + 1)}`), m(`y=a(x${sg(-xv + 2)})^2${sg(yv - 2)}`)]), explain: `${m(`y=a(x${sg(-xv)})^2${sg(yv)}`)}` },
            { ask: `Imponendo il passaggio per $P$: ${m(`${py}=a\\cdot${par(dx)}^2${sg(yv)}`)}. Quanto vale $a$?`, options: mc(r, m(a), [[m(-a), 'Errore di segno nel portare $y_V$ a primo membro.'], [m(frac(py - yv, dx)), 'Devi dividere per il **quadrato** della differenza delle ascisse.']], [m(a + 1), m(a - 1)]), explain: `${m(`${dx * dx}a=${py - yv}\\Rightarrow a=${a}`)}.` },
          ],
          solution: [`${m(`y=a(x${sg(-xv)})^2${sg(yv)}`)}`, `Passaggio per $P$: ${m(`${py}=a\\,(${px}${sg(-xv)})^2${sg(yv)}`)}`, `${m(`${dx * dx}a=${py - yv}\\Rightarrow a=${a}`)}`],
        };
      },
    },
    {
      id: 'par-posizione',
      level: 2,
      title: 'Posizione retta-parabola',
      make: (r) => {
        const mm = 2 * int(r, -2, 2), kind = pick(r, [1, 0, -1]);
        // y = x^2 e y = mm x + q: risolvente x^2 - mm x - q = 0, Δ/4 = (mm/2)^2 + q
        const q = -((mm / 2) ** 2) + (kind === 0 ? 0 : kind * int(r, 1, 4));
        const lab = { 1: 'Secante (due punti comuni)', 0: 'Tangente', [-1]: 'Esterna (nessun punto comune)' } as Record<number, string>;
        const delta = mm * mm + 4 * q;
        const line = `y=${mm === 0 ? '' : `${mm}x`}${mm === 0 ? q : sg(q)}`;
        return {
          text: `Stabilisci la posizione della retta ${m(line)} rispetto alla parabola ${m('y=x^2')}.`,
          options: choice(r, [[lab[kind], `Corretto: il discriminante dell'equazione risolvente vale ${m(delta)}.`], ...[1, 0, -1].filter((k) => k !== kind).map((k): [string, string] => [lab[k], `Calcola il discriminante della risolvente ${m(`${poly([1, -mm, -q])}=0`)}: vale ${m(delta)}.`])]),
          hints: ['Metti a sistema retta e parabola: ottieni un\'equazione di secondo grado.', 'Il segno del discriminante decide: positivo secante, nullo tangente, negativo esterna.'],
          solution: [`Sistema: ${m(`x^2=${line.slice(2)}`)}, cioè ${m(`${poly([1, -mm, -q])}=0`)}.`, `${m(`\\Delta=${mm * mm}${sg(4 * q)}=${delta}`)}`, `${delta > 0 ? 'Δ > 0: retta secante.' : delta === 0 ? 'Δ = 0: retta tangente.' : 'Δ < 0: retta esterna.'}`],
        };
      },
    },
    {
      id: 'par-intersezioni',
      level: 2,
      title: 'Intersezioni retta-parabola',
      make: (r) => {
        const p = int(r, -3, 1), q = int(r, p + 1, 4);
        const line = `y=${p + q === 0 ? '' : `${p + q === 1 ? '' : p + q === -1 ? '-' : p + q}x`}${p + q === 0 ? -p * q : sg(-p * q)}`;
        const pts = (a: number, b: number) => m(`${P(a, a * a)}\\ \\text{e}\\ ${P(b, b * b)}`);
        return {
          text: `Trova i punti di intersezione tra la parabola ${m('y=x^2')} e la retta ${m(line)}.`,
          options: mc(r, pts(p, q), [
            [m(`${P(p, 0)}\\ \\text{e}\\ ${P(q, 0)}`), 'Hai trovato le ascisse, ma le ordinate vanno calcolate sostituendo nella parabola (o nella retta).'],
            [pts(-q, -p), 'Le ascisse hanno il segno sbagliato.'],
            [m(`${P(p * p, p)}\\ \\text{e}\\ ${P(q * q, q)}`), 'Hai scambiato ascissa e ordinata.'],
          ], [pts(p, q + 1), pts(p - 1, q)]),
          hints: ['Uguaglia le due espressioni di $y$.', `Risolvi ${m(`${poly([1, -(p + q), p * q])}=0`)} e calcola le ordinate.`],
          solution: [`${m(`x^2=${line.slice(2)}`)}, cioè ${m(`${poly([1, -(p + q), p * q])}=0`)}.`, `${m(`x=${p}`)} oppure ${m(`x=${q}`)}.`, `Ordinate: ${m(`${par(p)}^2=${p * p}`)} e ${m(`${par(q)}^2=${q * q}`)}. Punti: ${pts(p, q)}.`],
        };
      },
    },
    {
      id: 'par-tangente-k',
      level: 3,
      title: 'Condizione di tangenza',
      make: (r) => {
        const mm = 2 * nz(r, -4, 4), c = int(r, -3, 3);
        // y = x^2 + c  e  y = mm x + k : x^2 - mm x + c - k = 0, Δ=0 → k = c - (mm/2)^2
        const k = c - (mm / 2) ** 2;
        return {
          text: `Per quale valore di $k$ la retta ${m(`y=${mm}x+k`)} è tangente alla parabola ${m(`y=x^2${sg(c)}`)}?`,
          answer: k,
          tol: 0,
          hints: ['Metti a sistema e scrivi l\'equazione risolvente.', 'Imponi che il discriminante sia nullo.'],
          solution: [`Sistema: ${m(`x^2${sg(c)}=${mm}x+k`)}, cioè ${m(`x^2${sg(-mm, 'x')}${c === 0 ? '' : sg(c)}-k=0`)}.`, `${m(`\\Delta=${mm * mm}-4(${c}-k)=0`)}`, `${m(`${c}-k=${(mm * mm) / 4}\\Rightarrow k=${k}`)}`],
        };
      },
    },
    {
      id: 'par-tangente-punto',
      level: 3,
      title: 'Tangente in un punto',
      make: (r) => {
        const a = pick(r, [1, 2, -1, 3]), b = int(r, -4, 4), c = int(r, -3, 3), x0 = nz(r, -3, 3);
        const y0 = a * x0 * x0 + b * x0 + c, mt = 2 * a * x0 + b;
        return {
          text: `Calcola il coefficiente angolare della retta tangente alla parabola ${m(`y=${poly([a, b, c])}`)} nel suo punto di ascissa ${m(`x_0=${x0}`)}.`,
          answer: mt,
          tol: 0,
          hints: [R`Per un punto della parabola vale $m=2ax_0+b$.`, 'In alternativa: fascio per il punto, sistema con la parabola e $\\Delta=0$.'],
          solution: [`Il punto è ${m(`P${P(x0, y0)}`)}.`, `${m(`m=2ax_0+b=2\\cdot${par(a)}\\cdot${par(x0)}${sg(b)}=${mt}`)}`, `La tangente è ${m(`y${sg(-y0)}=${mt}(x${sg(-x0)})`)}.`],
        };
      },
    },
    {
      id: 'par-fuoco-direttrice',
      level: 3,
      title: 'Equazione da fuoco e direttrice',
      make: (r) => {
        const p = pick(r, [1, 2, 3, -1, -2]);
        const good = `y=${frac(1, 4 * p)}x^2`;
        return {
          text: `Scrivi l'equazione della parabola con fuoco ${m(`F${P(0, p)}`)} e direttrice ${m(`y=${-p}`)}.`,
          options: mc(r, m(good), [
            [m(`y=${frac(1, p)}x^2`.replace('=1x', '=x').replace('=-1x', '=-x')), R`Il coefficiente è $a=\dfrac{1}{4p}$, non $\dfrac1p$.`],
            [m(`y=${frac(-1, 4 * p)}x^2`), 'La concavità è rivolta verso il fuoco: controlla il segno.'],
            [m(`y=${4 * p}x^2`), R`Hai invertito: da $x^2=4py$ si ricava $y=\dfrac{x^2}{4p}$.`],
          ]),
          hints: [R`Imponi $\overline{PF}=\overline{PH}$ per un punto generico $P(x;y)$.`, R`Si ottiene $x^2=4py$ con $p$ ordinata del fuoco.`],
          solution: [`${m(`\\sqrt{x^2+(y${sg(-p)})^2}=|y${sg(p)}|`)}`, `Elevando al quadrato e semplificando: ${m(`x^2=${4 * p}y`)}.`, `${m(good)}`],
        };
      },
    },
  ],
};
