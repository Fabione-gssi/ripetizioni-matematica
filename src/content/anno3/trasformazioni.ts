import { choice, int, mc, nz, pick, poly, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;

export const trasformazioni: Unit = {
  id: 'a3-trasformazioni',
  year: 3,
  title: 'Trasformazioni geometriche',
  summary: 'Traslazioni, simmetrie, rotazioni, omotetie e dilatazioni nel piano cartesiano; trasformare punti e curve.',
  lessons: [
    {
      id: 'a3-tra-1',
      title: 'Traslazioni e simmetrie',
      blocks: [
        { t: 'idea', md: R`Una **trasformazione geometrica** è una regola che a ogni punto del piano associa un altro punto, la sua *immagine*. Spostare, ribaltare, ruotare una figura sono trasformazioni. Nel piano cartesiano ogni trasformazione si descrive con due equazioni che danno le nuove coordinate $(x';y')$ in funzione delle vecchie $(x;y)$.` },
        { t: 'def', title: 'Isometrie e punti uniti', md: R`- Una trasformazione è un'**isometria** se conserva le distanze: la figura trasformata è congruente a quella di partenza. Traslazioni, simmetrie e rotazioni sono isometrie.
- Un punto è **unito** se coincide con la propria immagine.` },
        { t: 'def', title: 'Traslazione', md: R`La traslazione di vettore $\vec v(a;b)$ sposta ogni punto di $a$ in orizzontale e di $b$ in verticale:
$$\begin{cases}x'=x+a\\ y'=y+b\end{cases}$$
Se $\vec v\neq\vec0$ non ha punti uniti. Il vettore che porta $A$ in $B$ è $\vec v(x_B-x_A;\ y_B-y_A)$.` },
        { t: 'def', title: 'Simmetrie', md: R`**Simmetria centrale** di centro $C(x_C;y_C)$: $C$ è il punto medio tra ogni punto e la sua immagine.
$$\begin{cases}x'=2x_C-x\\ y'=2y_C-y\end{cases}$$
L'unico punto unito è il centro. Rispetto all'origine: $(x;y)\to(-x;-y)$.

**Simmetrie assiali** (l'asse è l'asse del segmento che unisce ogni punto alla sua immagine; i punti dell'asse sono tutti uniti):
- rispetto all'asse $x$: $(x;y)\to(x;-y)$
- rispetto all'asse $y$: $(x;y)\to(-x;y)$
- rispetto alla retta $x=h$: $(x;y)\to(2h-x;\,y)$
- rispetto alla retta $y=k$: $(x;y)\to(x;\,2k-y)$
- rispetto alla bisettrice $y=x$: $(x;y)\to(y;x)$
- rispetto alla bisettrice $y=-x$: $(x;y)\to(-y;-x)$` },
        {
          t: 'plot',
          title: 'Simmetria rispetto a una retta verticale',
          caption: R`$P'$ è il simmetrico di $P$ rispetto alla retta $x=h$: l'ordinata non cambia e l'asse passa per il punto medio di $PP'$.`,
          view: [-8, 8, -5, 5],
          params: [
            { name: 'h', label: 'h', min: -3, max: 3, step: 0.5, value: 1 },
            { name: 'x', label: 'ascissa di P', min: -6, max: 6, step: 0.5, value: -2 },
            { name: 'y', label: 'ordinata di P', min: -4, max: 4, step: 0.5, value: 2 },
          ],
          draw: (p) => [
            { k: 'vline', x: p.h, dash: true },
            { k: 'seg', x1: p.x, y1: p.y, x2: 2 * p.h - p.x, y2: p.y, dash: true },
            { k: 'pt', x: p.x, y: p.y, label: 'P' },
            { k: 'pt', x: 2 * p.h - p.x, y: p.y, label: "P'", color: '#c0392b' },
          ],
          readout: (p) => `$P'(${`${2 * p.h - p.x}`.replace('.', '{,}')};\\,${`${p.y}`.replace('.', '{,}')})$`,
        },
        {
          t: 'ex',
          title: R`Trova il simmetrico di $P(3;-1)$ rispetto al punto $C(1;2)$ e rispetto alla retta $y=2$.`,
          steps: [
            R`Simmetria centrale: $x'=2\cdot1-3=-1$, $y'=2\cdot2-(-1)=5$. Immagine $(-1;5)$.`,
            R`Controllo: il punto medio tra $(3;-1)$ e $(-1;5)$ è $(1;2)=C$ ✓`,
            R`Simmetria assiale rispetto a $y=2$: l'ascissa resta $3$, $y'=2\cdot2-(-1)=5$. Immagine $(3;5)$.`,
          ],
        },
        {
          t: 'quiz',
          q: R`Qual è il simmetrico di $(2;5)$ rispetto alla bisettrice $y=x$?`,
          options: [
            { md: R`$(5;\,2)$`, ok: true, why: 'Giusto: la simmetria rispetto alla bisettrice del primo e terzo quadrante scambia le coordinate.' },
            { md: R`$(-2;\,-5)$`, why: 'Questo è il simmetrico rispetto all\'origine.' },
            { md: R`$(-5;\,-2)$`, why: R`Questo è il simmetrico rispetto all'altra bisettrice, $y=-x$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-tra-2',
      title: 'Trasformare una curva',
      blocks: [
        { t: 'idea', md: R`Trasformare una curva significa trasformare **tutti** i suoi punti. Per ottenere l'equazione della curva immagine c'è un procedimento unico, valido per qualunque trasformazione: si usano le equazioni della trasformazione **inversa**.` },
        { t: 'def', title: 'Procedimento', md: R`Data la curva $\gamma$ di equazione $F(x;y)=0$ e una trasformazione:
1. si ricavano $x$ e $y$ in funzione di $x'$ e $y'$ (equazioni della trasformazione inversa);
2. si sostituiscono nell'equazione di $\gamma$;
3. si tolgono gli apici: si ottiene l'equazione della curva trasformata $\gamma'$.

Per la **traslazione** di vettore $(a;b)$: $x=x'-a$, $y=y'-b$. Quindi
$$y=f(x)\quad\longrightarrow\quad y=f(x-a)+b$$` },
        {
          t: 'ex',
          title: R`Trasla la parabola $y=x^2$ del vettore $\vec v(2;-3)$.`,
          steps: [
            R`Equazioni della traslazione: $x'=x+2$, $y'=y-3$. Inverse: $x=x'-2$, $y=y'+3$.`,
            R`Sostituiamo in $y=x^2$: $y'+3=(x'-2)^2$.`,
            R`Togliamo gli apici: $y=(x-2)^2-3=x^2-4x+1$. Il vertice è passato da $(0;0)$ a $(2;-3)$ ✓`,
          ],
        },
        { t: 'def', title: 'Simmetrie di una curva y = f(x)', md: R`- rispetto all'asse $x$: $y=-f(x)$
- rispetto all'asse $y$: $y=f(-x)$
- rispetto all'origine: $y=-f(-x)$
- rispetto alla bisettrice $y=x$: si scambiano $x$ e $y$ (si ottiene il grafico della relazione inversa)

Una curva è **simmetrica** rispetto a una di queste trasformazioni se la sua equazione non cambia: per esempio il grafico di una funzione **pari** è simmetrico rispetto all'asse $y$, quello di una funzione **dispari** rispetto all'origine.` },
        {
          t: 'ex',
          title: R`Trova la simmetrica della retta $y=2x+3$ rispetto all'origine e rispetto alla retta $x=1$.`,
          steps: [
            R`Rispetto all'origine: $x=-x'$, $y=-y'$. Sostituendo: $-y'=-2x'+3$, cioè $y=2x-3$. È parallela a quella data.`,
            R`Rispetto a $x=1$: $x=2-x'$, $y=y'$. Sostituendo: $y'=2(2-x')+3$, cioè $y=-2x+7$.`,
            R`Controllo: le due rette $y=2x+3$ e $y=-2x+7$ si incontrano per $x=1$, cioè sull'asse di simmetria ✓`,
          ],
        },
        { t: 'warn', md: R`Nelle equazioni della curva trasformata i segni sono "al contrario" rispetto a quelli della trasformazione, proprio perché si usa la trasformazione inversa: traslando di $+2$ in orizzontale compare $(x-2)$.` },
        {
          t: 'quiz',
          q: R`Qual è l'equazione della simmetrica della parabola $y=x^2-2x$ rispetto all'asse $x$?`,
          options: [
            { md: R`$y=-x^2+2x$`, ok: true, why: R`Giusto: si cambia segno a tutta l'espressione, $y=-f(x)$.` },
            { md: R`$y=x^2+2x$`, why: R`Questa è la simmetrica rispetto all'asse $y$: $y=f(-x)$.` },
            { md: R`$y=-x^2-2x$`, why: R`Questa è la simmetrica rispetto all'origine: $y=-f(-x)$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-tra-3',
      title: 'Rotazioni, omotetie e dilatazioni',
      blocks: [
        { t: 'idea', md: R`Non tutte le trasformazioni conservano le distanze. Un'**omotetia** ingrandisce o rimpicciolisce una figura mantenendone la forma, come lo zoom di una fotografia; una **dilatazione** la deforma, allungandola in modo diverso nelle due direzioni: è così che una circonferenza diventa un'ellisse.` },
        { t: 'def', title: 'Rotazioni di centro l\'origine', md: R`- Rotazione di $90°$ in senso **antiorario**: $(x;y)\to(-y;\,x)$
- Rotazione di $90°$ in senso **orario**: $(x;y)\to(y;\,-x)$
- Rotazione di $180°$: $(x;y)\to(-x;\,-y)$, che coincide con la simmetria centrale rispetto all'origine.

Le rotazioni sono isometrie; l'unico punto unito è il centro.` },
        { t: 'def', title: 'Omotetia', md: R`L'omotetia di centro l'origine e rapporto $k\neq0$:
$$\begin{cases}x'=kx\\ y'=ky\end{cases}$$
- le lunghezze vengono moltiplicate per $|k|$, le **aree per $k^2$**;
- gli angoli e la forma si conservano: è una **similitudine**;
- se $|k|>1$ ingrandisce, se $|k|<1$ rimpicciolisce; se $k<0$ la figura viene anche ribaltata rispetto al centro.

L'omotetia di centro $C(x_C;y_C)$: $x'=x_C+k(x-x_C)$, $y'=y_C+k(y-y_C)$.` },
        { t: 'def', title: 'Dilatazione', md: R`$$\begin{cases}x'=hx\\ y'=ky\end{cases}\qquad(h,k>0)$$
allunga (o accorcia) di un fattore $h$ in orizzontale e $k$ in verticale. Le aree vengono moltiplicate per $h\cdot k$. Se $h=k$ è un'omotetia.

Applicata a una curva: $y=f(x)$ diventa $y=k\,f\!\left(\dfrac xh\right)$.` },
        {
          t: 'ex',
          title: R`Applica alla circonferenza $x^2+y^2=1$ la dilatazione $x'=3x$, $y'=2y$.`,
          steps: [
            R`Inverse: $x=\dfrac{x'}{3}$, $y=\dfrac{y'}{2}$.`,
            R`Sostituiamo: $\dfrac{x'^2}{9}+\dfrac{y'^2}{4}=1$.`,
            R`Si ottiene l'ellisse $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$, di semiassi $3$ e $2$. L'area passa da $\pi$ a $\pi\cdot3\cdot2=6\pi$.`,
          ],
        },
        { t: 'thm', title: 'Composizione di trasformazioni', md: R`Applicando due trasformazioni una dopo l'altra se ne ottiene una terza, la loro **composizione**. In generale l'ordine conta.
- Due traslazioni: una traslazione di vettore somma.
- Due simmetrie assiali con assi **paralleli** a distanza $d$: una traslazione di ampiezza $2d$, perpendicolare agli assi.
- Due simmetrie assiali con assi **perpendicolari**: la simmetria centrale rispetto al loro punto di intersezione.
- Due simmetrie centrali: una traslazione.`, proof: [
          R`Verifichiamo il secondo caso con gli assi $x=h_1$ e $x=h_2$.`,
          R`Prima simmetria: $(x;y)\to(2h_1-x;\,y)$.`,
          R`Seconda simmetria: $(2h_1-x;\,y)\to(2h_2-(2h_1-x);\,y)=(x+2(h_2-h_1);\,y)$.`,
          R`È la traslazione di vettore $(2(h_2-h_1);\,0)$: ampiezza doppia della distanza tra gli assi.`,
        ] },
        {
          t: 'quiz',
          q: R`Un triangolo di area $6$ viene trasformato con un'omotetia di rapporto $k=-2$. Qual è l'area dell'immagine?`,
          options: [
            { md: R`$24$`, ok: true, why: R`Giusto: le aree si moltiplicano per $k^2=4$.` },
            { md: R`$12$`, why: R`Sono le lunghezze a raddoppiare; le aree si moltiplicano per $k^2$.` },
            { md: R`$-12$`, why: 'Un\'area non può essere negativa: il segno di $k$ indica solo il ribaltamento.' },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'tra-traslazione-punto',
      level: 1,
      title: 'Traslare un punto',
      make: (r) => {
        const x = int(r, -6, 6), y = int(r, -6, 6), a = nz(r, -5, 5), b = nz(r, -5, 5, a);
        return {
          text: R`Qual è l'immagine del punto $P${P(x, y)}$ nella traslazione di vettore $\vec v${P(a, b)}$?`,
          options: mc(r, `$${P(x + a, y + b)}$`, [
            [`$${P(x - a, y - b)}$`, 'Hai sottratto le componenti del vettore: così si torna indietro (traslazione inversa).'],
            [`$${P(x + b, y + a)}$`, 'Hai scambiato le componenti del vettore.'],
            [`$${P(x * a, y * b)}$`, 'In una traslazione le componenti si sommano, non si moltiplicano.'],
          ], [`$${P(x + a, y - b)}$`]),
          hints: [R`$x'=x+a$, $y'=y+b$.`],
          solution: [R`$x'=${x}${sg(a)}=${x + a}$ e $y'=${y}${sg(b)}=${y + b}$.`, R`$P'${P(x + a, y + b)}$.`],
        };
      },
    },
    {
      id: 'tra-vettore',
      level: 1,
      title: 'Vettore di una traslazione',
      make: (r) => {
        const xa = int(r, -6, 6), ya = int(r, -6, 6), a = nz(r, -6, 6), b = nz(r, -6, 6, a, -a);
        return {
          text: R`Quale vettore individua la traslazione che porta $A${P(xa, ya)}$ in $B${P(xa + a, ya + b)}$?`,
          options: mc(r, `$${P(a, b)}$`, [
            [`$${P(-a, -b)}$`, 'Questo è il vettore che porta $B$ in $A$: hai sottratto nell\'ordine sbagliato.'],
            [`$${P(b, a)}$`, 'Hai scambiato le due componenti.'],
            [`$${P(2 * xa + a, 2 * ya + b)}$`, 'Le coordinate vanno sottratte, non sommate.'],
          ], [`$${P(a, -b)}$`]),
          hints: [R`$\vec v(x_B-x_A;\ y_B-y_A)$.`],
          solution: [R`$x_B-x_A=${xa + a}-(${xa})=${a}$; $y_B-y_A=${ya + b}-(${ya})=${b}$.`, R`$\vec v${P(a, b)}$.`],
        };
      },
    },
    {
      id: 'tra-simmetria-assi',
      level: 1,
      title: 'Simmetrie rispetto agli assi e alle bisettrici',
      make: (r) => {
        const x = nz(r, -7, 7), y = nz(r, -7, 7, x, -x);
        const kinds: [string, string, string][] = [
          ['all\'asse $x$', P(x, -y), 'Questo è il simmetrico rispetto all\'asse $x$.'],
          ['all\'asse $y$', P(-x, y), 'Questo è il simmetrico rispetto all\'asse $y$.'],
          ['all\'origine', P(-x, -y), 'Questo è il simmetrico rispetto all\'origine.'],
          ['alla bisettrice $y=x$', P(y, x), 'Questo è il simmetrico rispetto alla bisettrice $y=x$.'],
        ];
        const i = int(r, 0, 3);
        return {
          text: `Qual è il simmetrico del punto $P${P(x, y)}$ rispetto ${kinds[i][0]}?`,
          options: choice(r, [[`$${kinds[i][1]}$`], ...kinds.filter((_, j) => j !== i).map(([, pt, why]): [string, string] => [`$${pt}$`, why])]),
          hints: ['Chiediti quale coordinata resta invariata e quale cambia segno (o se si scambiano).'],
          solution: [`Il simmetrico rispetto ${kinds[i][0]} è $${kinds[i][1]}$.`],
        };
      },
    },
    {
      id: 'tra-omotetia-punto',
      level: 1,
      title: 'Omotetia di un punto',
      make: (r) => {
        const x = nz(r, -5, 5), y = nz(r, -5, 5), k = pick(r, [2, 3, 4, -2, -3]);
        return {
          text: R`Qual è l'immagine di $P${P(x, y)}$ nell'omotetia di centro l'origine e rapporto $k=${k}$?`,
          options: mc(r, `$${P(k * x, k * y)}$`, [
            [`$${P(x + k, y + k)}$`, 'In un\'omotetia le coordinate si moltiplicano per $k$, non si somma $k$.'],
            [`$${P(k * x, y)}$`, 'Vanno moltiplicate entrambe le coordinate.'],
            [`$${P(-k * x, -k * y)}$`, 'Controlla il segno del rapporto.'],
          ]),
          hints: [R`$x'=kx$, $y'=ky$.`],
          solution: [R`$x'=${k}\cdot(${x})=${k * x}$ e $y'=${k}\cdot(${y})=${k * y}$.`, R`$P'${P(k * x, k * y)}$.`],
        };
      },
    },
    {
      id: 'tra-simmetria-centrale',
      level: 2,
      title: 'Simmetria centrale',
      make: (r) => {
        const x = int(r, -6, 6), y = int(r, -6, 6), cx = nz(r, -4, 4), cy = nz(r, -4, 4);
        return {
          text: R`Qual è il simmetrico di $P${P(x, y)}$ rispetto al punto $C${P(cx, cy)}$?`,
          options: mc(r, `$${P(2 * cx - x, 2 * cy - y)}$`, [
            [`$${P(-x, -y)}$`, 'Questo è il simmetrico rispetto all\'origine, non rispetto a $C$.'],
            [`$${P(2 * x - cx, 2 * y - cy)}$`, 'Hai scambiato i ruoli: così hai trovato il simmetrico di $C$ rispetto a $P$.'],
            [`$${P(cx - x, cy - y)}$`, R`Il centro deve essere il **punto medio**: $x'=2x_C-x$.`],
          ], [`$${P(2 * cx - x, y)}$`, `$${P(x, 2 * cy - y)}$`]),
          hints: [R`$C$ è il punto medio tra $P$ e $P'$.`, R`$x'=2x_C-x$, $y'=2y_C-y$.`],
          solution: [R`$x'=2\cdot(${cx})-(${x})=${2 * cx - x}$.`, R`$y'=2\cdot(${cy})-(${y})=${2 * cy - y}$. Immagine $${P(2 * cx - x, 2 * cy - y)}$.`],
        };
      },
    },
    {
      id: 'tra-simmetria-retta',
      level: 2,
      title: 'Simmetria rispetto a una retta parallela agli assi',
      make: (r) => {
        const x = int(r, -6, 6), y = int(r, -6, 6), h = nz(r, -5, 5), vert = r() < 0.5;
        const ans = vert ? 2 * h - x : 2 * h - y;
        return {
          text: R`Il punto $P${P(x, y)}$ viene trasformato con la simmetria assiale rispetto alla retta $${vert ? 'x' : 'y'}=${h}$. Qual è l'**${vert ? 'ascissa' : 'ordinata'}** dell'immagine?`,
          answer: ans,
          tol: 0,
          hints: [`La retta è ${vert ? 'verticale: cambia solo l\'ascissa' : 'orizzontale: cambia solo l\'ordinata'}.`, vert ? R`$x'=2h-x$.` : R`$y'=2k-y$.`],
          solution: [vert ? R`$x'=2\cdot(${h})-(${x})=${ans}$; l'ordinata resta $${y}$.` : R`$y'=2\cdot(${h})-(${y})=${ans}$; l'ascissa resta $${x}$.`],
        };
      },
    },
    {
      id: 'tra-rotazione',
      level: 2,
      title: 'Rotazione di 90°',
      make: (r) => {
        const x = nz(r, -7, 7), y = nz(r, -7, 7, x, -x);
        const ccw = r() < 0.5;
        const good = ccw ? P(-y, x) : P(y, -x), other = ccw ? P(y, -x) : P(-y, x);
        return {
          text: R`Qual è l'immagine di $P${P(x, y)}$ nella rotazione di $90°$ in senso **${ccw ? 'antiorario' : 'orario'}** attorno all'origine?`,
          options: mc(r, `$${good}$`, [
            [`$${other}$`, `Questa è la rotazione in senso ${ccw ? 'orario' : 'antiorario'}.`],
            [`$${P(-x, -y)}$`, R`Questa è la rotazione di $180°$.`],
            [`$${P(y, x)}$`, R`Questa è la simmetria rispetto alla bisettrice $y=x$: in una rotazione di $90°$ una coordinata cambia anche segno.`],
          ]),
          hints: [R`Antioraria: $(x;y)\to(-y;x)$. Oraria: $(x;y)\to(y;-x)$.`, 'Aiutati con il punto $(1;0)$: in senso antiorario finisce in $(0;1)$.'],
          solution: [`Rotazione ${ccw ? 'antioraria' : 'oraria'}: $(x;y)\\to${ccw ? '(-y;x)' : '(y;-x)'}$.`, R`$P'${good}$.`],
        };
      },
    },
    {
      id: 'tra-omotetia-area',
      level: 2,
      title: 'Aree in un\'omotetia',
      make: (r) => {
        const k = pick(r, [2, 3, 4, 5, -2, -3]), A = int(r, 2, 12);
        return {
          text: R`Un poligono di area $${A}$ viene trasformato con un'omotetia di rapporto $k=${k}$. Qual è l'area del poligono immagine?`,
          answer: A * k * k,
          tol: 0,
          hints: [R`In un'omotetia le aree vengono moltiplicate per $k^2$.`],
          solution: [R`$\mathcal A'=k^2\cdot\mathcal A=${k * k}\cdot${A}=${A * k * k}$.`],
        };
      },
    },
    {
      id: 'tra-retta-traslata',
      level: 2,
      title: 'Traslare una retta',
      make: (r) => {
        const m = nz(r, -4, 4), q = int(r, -6, 6), a = nz(r, -4, 4), b = nz(r, -4, 4);
        const mx = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`;
        return {
          text: R`La retta $y=${mx}${sg(q)}$ viene traslata del vettore $\vec v${P(a, b)}$. Qual è l'**ordinata all'origine** della retta ottenuta?`,
          answer: q + b - m * a,
          tol: 0,
          hints: [R`$y=f(x)$ traslata di $(a;b)$ diventa $y=f(x-a)+b$.`, R`Sostituisci $x$ con $x${sg(-a)}$ e aggiungi $${b}$.`],
          solution: [R`$y=${m}(x${sg(-a)})${sg(q)}${sg(b)}$.`, R`$y=${mx}${sg(-m * a)}${sg(q)}${sg(b)}=${mx}${sg(q + b - m * a)}$: l'ordinata all'origine è $${q + b - m * a}$.`],
        };
      },
    },
    {
      id: 'tra-parabola-simmetrica',
      level: 2,
      title: 'Simmetrica di una parabola',
      make: (r) => {
        const b = nz(r, -6, 6), c = nz(r, -6, 6);
        const kinds: [string, number[], string][] = [
          ['all\'asse $x$', [-1, -b, -c], 'Questa è la simmetrica rispetto all\'asse $x$: $y=-f(x)$.'],
          ['all\'asse $y$', [1, -b, c], 'Questa è la simmetrica rispetto all\'asse $y$: $y=f(-x)$.'],
          ['all\'origine', [-1, b, -c], 'Questa è la simmetrica rispetto all\'origine: $y=-f(-x)$.'],
        ];
        const i = int(r, 0, 2);
        return {
          text: `Qual è l'equazione della curva simmetrica della parabola $y=${poly([1, b, c])}$ rispetto ${kinds[i][0]}?`,
          options: choice(r, [
            [`$y=${poly(kinds[i][1])}$`],
            ...kinds.filter((_, j) => j !== i).map(([, co, why]): [string, string] => [`$y=${poly(co)}$`, why]),
            [`$y=${poly([-1, -b, c])}$`, 'Questa curva non corrisponde a nessuna delle tre simmetrie: controlla i segni di tutti i termini.'],
          ]),
          hints: [R`Asse $x$: $y=-f(x)$. Asse $y$: $y=f(-x)$. Origine: $y=-f(-x)$.`],
          solution: [`Rispetto ${kinds[i][0]}: $y=${poly(kinds[i][1])}$.`],
        };
      },
    },
    {
      id: 'tra-punti-uniti',
      level: 3,
      title: 'Punti uniti',
      make: (r) => {
        const h = nz(r, -5, 5), k = nz(r, -5, 5);
        const kinds: [string, string][] = [
          [R`la traslazione di vettore $\vec v${P(h, k)}$`, 'Nessuno'],
          [R`la simmetria centrale di centro $C${P(h, k)}$`, 'Uno solo: il centro'],
          [R`la simmetria assiale rispetto alla retta $x=${h}$`, 'Tutti i punti di una retta: l\'asse'],
          [R`la rotazione di $90°$ attorno all'origine`, 'Uno solo: il centro'],
          [R`l'omotetia di centro l'origine e rapporto $${k === 1 ? 2 : k}$`, 'Uno solo: il centro'],
        ];
        const [desc, good] = pick(r, kinds);
        const all = ['Nessuno', 'Uno solo: il centro', 'Tutti i punti di una retta: l\'asse', 'Tutti i punti del piano'];
        return {
          text: `Quali sono i punti uniti (cioè che coincidono con la propria immagine) per ${desc}?`,
          options: choice(r, [[good], ...all.filter((x) => x !== good).map((x): [string, string] => [x, 'Imponi $x\'=x$ e $y\'=y$ nelle equazioni della trasformazione e guarda quali punti le soddisfano.'])]),
          hints: [R`Un punto è unito se $x'=x$ e $y'=y$.`],
          solution: [`Punti uniti: ${good.toLowerCase()}.`],
        };
      },
    },
    {
      id: 'tra-composizione',
      level: 3,
      title: 'Composizione di due simmetrie assiali',
      make: (r) => {
        const h1 = int(r, -5, 5), h2 = nz(r, -6, 7, h1) + 0;
        return {
          text: R`Si applica prima la simmetria rispetto alla retta $x=${h1}$ e poi quella rispetto alla retta $x=${h2}$. Il risultato è una traslazione orizzontale: di quanto si sposta ogni punto (con segno, positivo verso destra)?`,
          answer: 2 * (h2 - h1),
          tol: 0,
          hints: [R`Prima simmetria: $x\to2\cdot(${h1})-x$.`, 'Applica la seconda simmetria al risultato della prima.'],
          solution: [R`Prima: $x_1=${2 * h1}-x$.`, R`Seconda: $x_2=${2 * h2}-x_1=${2 * h2}-(${2 * h1}-x)=x${sg(2 * (h2 - h1))}$.`, R`Traslazione di $${2 * (h2 - h1)}$: il doppio della distanza (con segno) tra i due assi.`],
        };
      },
    },
    {
      id: 'tra-dilatazione',
      level: 3,
      title: 'Dilatare una circonferenza',
      make: (r) => {
        const a = int(r, 2, 6), b = nz(r, 2, 6, a);
        const eq = (u: string, v: string) => R`$\dfrac{x^2}{${u}}+\dfrac{y^2}{${v}}=1$`;
        return {
          text: R`Quale curva si ottiene applicando alla circonferenza $x^2+y^2=1$ la dilatazione $x'=${a}x$, $y'=${b}y$?`,
          options: mc(r, eq(`${a * a}`, `${b * b}`), [
            [eq(`${a}`, `${b}`), 'Sostituendo $x=x\'/h$ il denominatore viene elevato al quadrato.'],
            [R`$${a * a}x^2+${b * b}y^2=1$`, 'Hai usato le equazioni dirette invece di quelle inverse.'],
            [eq(`${b * b}`, `${a * a}`), 'Hai scambiato i due fattori di dilatazione.'],
          ]),
          hints: [R`Ricava $x=\dfrac{x'}{${a}}$, $y=\dfrac{y'}{${b}}$ e sostituisci.`],
          solution: [R`$\left(\dfrac{x'}{${a}}\right)^2+\left(\dfrac{y'}{${b}}\right)^2=1$.`, `Togliendo gli apici: ${eq(`${a * a}`, `${b * b}`)}, un'ellisse di semiassi $${a}$ e $${b}$.`],
        };
      },
    },
  ],
};
