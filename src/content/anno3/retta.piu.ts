// Approfondimenti dell'unità "Piano cartesiano e retta".
import { frac, int, mc, nz, pick, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;

export const rettaPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-ret-4',
      title: 'Fasci di rette',
      blocks: [
        { t: 'idea', md: R`Un **fascio** è una famiglia di rette che hanno qualcosa in comune: o passano tutte per uno stesso punto, oppure hanno tutte la stessa direzione. L'equazione di un fascio contiene un **parametro**: a ogni suo valore corrisponde una retta della famiglia. Scegliere la retta giusta significa trovare il valore giusto del parametro.` },
        { t: 'def', title: 'Fascio proprio e fascio improprio', md: R`- **Fascio proprio** di centro $P_0(x_0;y_0)$: tutte le rette passanti per $P_0$.
$$y-y_0=m(x-x_0)$$
Al variare di $m$ si ottengono tutte le rette per $P_0$ **tranne la verticale** $x=x_0$, che va aggiunta a parte.
- **Fascio improprio**: tutte le rette parallele a una retta data, cioè con lo stesso coefficiente angolare $m$:
$$y=mx+k$$
dove ora il parametro è l'ordinata all'origine $k$.` },
        {
          t: 'plot',
          title: 'Fascio proprio di centro (1; 1)',
          caption: R`Le rette tratteggiate sono alcune rette del fascio; quella continua corrisponde al valore di $m$ scelto con il cursore. Nessun valore di $m$ dà la retta verticale $x=1$.`,
          view: [-5, 7, -5, 7],
          params: [{ name: 'm', label: 'm', min: -4, max: 4, step: 0.25, value: 1 }],
          draw: (p) => [
            ...[-2, -0.5, 0, 0.5, 2].map((k) => ({ k: 'fn' as const, f: (x: number) => 1 + k * (x - 1), dash: true })),
            { k: 'fn', f: (x) => 1 + p.m * (x - 1), color: '#c0392b' },
            { k: 'pt', x: 1, y: 1, label: 'P₀' },
          ],
          readout: (p) => `Retta del fascio: $y-1=${`${p.m}`.replace('.', '{,}')}(x-1)$`,
        },
        { t: 'thm', title: 'Fascio generato da due rette', md: R`Date due rette $r:\ ax+by+c=0$ e $s:\ a'x+b'y+c'=0$, l'equazione
$$ax+by+c+k(a'x+b'y+c')=0$$
rappresenta, al variare di $k$, un fascio:
- **proprio**, con centro nel punto di intersezione, se $r$ e $s$ sono incidenti;
- **improprio** se $r$ e $s$ sono parallele.

Le rette $r$ e $s$ si chiamano **generatrici**; $s$ non si ottiene per nessun valore di $k$.`, proof: [
          R`Per ogni $k$ l'equazione è di primo grado in $x$ e $y$: rappresenta una retta.`,
          R`Se $P$ è il punto comune a $r$ e $s$, le sue coordinate annullano sia $ax+by+c$ sia $a'x+b'y+c'$: quindi annullano la loro combinazione per qualunque $k$.`,
          R`Tutte le rette dell'equazione passano dunque per $P$: è un fascio proprio di centro $P$.`,
        ] },
        {
          t: 'ex',
          title: R`Studia il fascio $(k+1)x+(k-1)y-2k=0$ e trova la retta che passa per $A(3;1)$.`,
          steps: [
            R`Separiamo i termini con $k$: $x-y+k(x+y-2)=0$. Le generatrici sono $x-y=0$ e $x+y-2=0$.`,
            R`Centro: risolviamo il sistema $y=x$, $x+y=2$: $x=1$, $y=1$. È un fascio proprio di centro $C(1;1)$.`,
            R`Imponiamo il passaggio per $A$: $(k+1)\cdot3+(k-1)\cdot1-2k=0$, cioè $2k+2=0$, $k=-1$.`,
            R`Con $k=-1$: $-2y+2=0$, cioè $y=1$. Infatti $A$ e $C$ hanno la stessa ordinata.`,
          ],
        },
        { t: 'warn', md: R`Per trovare il centro di un fascio proprio basta intersecare **due qualsiasi** rette del fascio: conviene scegliere valori comodi del parametro, per esempio $k=0$ e $k=1$, oppure usare le generatrici.` },
        {
          t: 'quiz',
          q: R`Il fascio $y=3x+k$ è:`,
          options: [
            { md: 'improprio: rette parallele con coefficiente angolare $3$', ok: true, why: 'Giusto: il coefficiente angolare è fisso, cambia solo l\'ordinata all\'origine.' },
            { md: 'proprio, con centro in $(0;3)$', why: 'In un fascio proprio varia la pendenza e resta fisso un punto; qui la pendenza è fissa.' },
            { md: 'proprio, con centro nell\'origine', why: 'Le rette per l\'origine hanno equazione $y=mx$, con $m$ variabile.' },
          ],
        },
      ],
    },
    {
      id: 'a3-ret-5',
      title: 'Luoghi geometrici e punti notevoli del triangolo',
      blocks: [
        { t: 'idea', md: R`Un **luogo geometrico** è l'insieme di *tutti e soli* i punti che godono di una certa proprietà. In geometria analitica trovare un luogo significa tradurre la proprietà in un'equazione nelle coordinate $(x;y)$ di un punto generico.` },
        { t: 'def', title: 'Come si trova l\'equazione di un luogo', md: R`1. Si indica con $P(x;y)$ un punto generico del luogo.
2. Si scrive la proprietà caratteristica come uguaglianza (di distanze, di rapporti…).
3. Si semplifica fino a ottenere un'equazione in $x$ e $y$.

Due luoghi fondamentali:
- **asse di un segmento** $AB$: punti equidistanti da $A$ e da $B$ (retta perpendicolare ad $AB$ nel suo punto medio);
- **bisettrici** degli angoli formati da due rette: punti equidistanti dalle due rette.` },
        {
          t: 'ex',
          title: R`Trova le bisettrici degli angoli formati da $r:\ 3x+4y-1=0$ e $s:\ 4x-3y+2=0$.`,
          steps: [
            R`Un punto $P(x;y)$ appartiene a una bisettrice se ha la stessa distanza da $r$ e da $s$: $\dfrac{|3x+4y-1|}{5}=\dfrac{|4x-3y+2|}{5}$.`,
            R`Due valori assoluti sono uguali quando gli argomenti sono uguali oppure opposti: $3x+4y-1=\pm(4x-3y+2)$.`,
            R`Con il segno $+$: $-x+7y-3=0$, cioè $x-7y+3=0$.`,
            R`Con il segno $-$: $7x+y+1=0$.`,
            R`Le due bisettrici sono tra loro perpendicolari: $m_1=\tfrac17$ e $m_2=-7$, prodotto $-1$ ✓`,
          ],
        },
        { t: 'def', title: 'Punti notevoli di un triangolo', md: R`Dato il triangolo di vertici $A(x_A;y_A)$, $B(x_B;y_B)$, $C(x_C;y_C)$:
- **baricentro** $G$ (incontro delle mediane): $G\left(\dfrac{x_A+x_B+x_C}{3};\ \dfrac{y_A+y_B+y_C}{3}\right)$;
- **circocentro** (incontro degli assi dei lati): è equidistante dai tre vertici, ed è il centro della circonferenza circoscritta;
- **ortocentro** (incontro delle altezze);
- **incentro** (incontro delle bisettrici): è equidistante dai tre lati, centro della circonferenza inscritta.

Per circocentro e ortocentro basta intersecare **due** delle tre rette: la terza passa automaticamente per lo stesso punto.` },
        {
          t: 'ex',
          title: R`Trova il circocentro del triangolo $A(0;0)$, $B(6;0)$, $C(0;4)$.`,
          steps: [
            R`Asse di $AB$: $AB$ è orizzontale con punto medio $(3;0)$, quindi l'asse è $x=3$.`,
            R`Asse di $AC$: $AC$ è verticale con punto medio $(0;2)$, quindi l'asse è $y=2$.`,
            R`Il circocentro è $K(3;2)$.`,
            R`Osserva: il triangolo è rettangolo in $A$ e $K$ è il punto medio dell'ipotenusa $BC$. È una proprietà generale dei triangoli rettangoli.`,
          ],
        },
        { t: 'thm', title: 'Area di un triangolo con le coordinate', md: R`L'area del triangolo $ABC$ è
$$\mathcal A=\dfrac12\,\bigl|x_A(y_B-y_C)+x_B(y_C-y_A)+x_C(y_A-y_B)\bigr|$$
Se il risultato è $0$ i tre punti sono allineati.` },
        {
          t: 'quiz',
          q: R`Quale punto notevole di un triangolo è equidistante dai tre vertici?`,
          options: [
            { md: 'Il circocentro', ok: true, why: 'Giusto: appartiene agli assi dei lati, ciascuno dei quali è il luogo dei punti equidistanti da due vertici.' },
            { md: 'Il baricentro', why: 'Il baricentro divide ogni mediana in due parti, una doppia dell\'altra: in generale non è equidistante dai vertici.' },
            { md: 'L\'incentro', why: 'L\'incentro è equidistante dai tre **lati**, non dai vertici.' },
          ],
        },
      ],
    },
    {
      id: 'a3-ret-6',
      title: 'Disequazioni lineari in due incognite e semipiani',
      blocks: [
        { t: 'idea', md: R`Una retta divide il piano in due **semipiani**. I punti della retta soddisfano un'equazione; i punti di ciascun semipiano soddisfano una disequazione. Così una disequazione in due incognite si "risolve" disegnando una regione di piano.` },
        { t: 'def', title: 'Semipiani', md: R`La retta $ax+by+c=0$ divide il piano in due semipiani: in uno vale $ax+by+c>0$, nell'altro $ax+by+c<0$.

**Metodo del punto di prova:** si disegna la retta, si sceglie un punto che non le appartiene (l'origine, se possibile) e si sostituiscono le sue coordinate. Se la disequazione è verificata, la soluzione è il semipiano che contiene quel punto; altrimenti è l'altro.

Con $\ge$ o $\le$ la retta fa parte della soluzione (si disegna continua); con $>$ o $<$ è esclusa (tratteggiata).

In forma esplicita: $y>mx+q$ è il semipiano **sopra** la retta, $y<mx+q$ quello **sotto**.` },
        {
          t: 'plot',
          title: 'Sopra o sotto la retta?',
          caption: R`La retta è $y=\tfrac12x+1$. Sposta il punto e leggi se le sue coordinate verificano $y>\tfrac12x+1$.`,
          view: [-6, 6, -5, 6],
          params: [
            { name: 'x', label: 'ascissa del punto', min: -5, max: 5, step: 0.5, value: 2 },
            { name: 'y', label: 'ordinata del punto', min: -4, max: 5, step: 0.5, value: 4 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => 0.5 * x + 1 },
            { k: 'pt', x: p.x, y: p.y, label: 'P' },
          ],
          readout: (p) => {
            const d = p.y - (0.5 * p.x + 1);
            return d > 0 ? 'Il punto sta **sopra** la retta: $y>\\tfrac12x+1$ è verificata.' : d < 0 ? 'Il punto sta **sotto** la retta: $y>\\tfrac12x+1$ non è verificata.' : 'Il punto sta **sulla** retta: vale l\'uguaglianza, non la disuguaglianza stretta.';
          },
        },
        { t: 'def', title: 'Sistemi e regioni', md: R`La soluzione di un **sistema** di disequazioni lineari è l'intersezione dei semipiani: una regione poligonale (limitata o illimitata), a volte vuota. I suoi **vertici** si trovano intersecando a due a due le rette di confine.` },
        {
          t: 'ex',
          title: R`Rappresenta il sistema $\begin{cases}x\ge0\\ y\ge0\\ x+2y\le8\end{cases}$ e calcola l'area della regione.`,
          steps: [
            R`$x\ge0$ e $y\ge0$ individuano il primo quadrante, assi compresi.`,
            R`La retta $x+2y=8$ incontra gli assi in $(8;0)$ e $(0;4)$. L'origine verifica $0\le8$: si prende il semipiano che contiene l'origine.`,
            R`La regione è il triangolo di vertici $(0;0)$, $(8;0)$, $(0;4)$.`,
            R`Area: $\dfrac{8\cdot4}{2}=16$.`,
          ],
        },
        { t: 'thm', title: 'Massimo di una funzione lineare su un poligono', md: R`Una funzione lineare $z=ax+by$ (**funzione obiettivo**) considerata su una regione poligonale limitata assume il suo valore massimo e il suo valore minimo in un **vertice** della regione. Per trovarli basta calcolare $z$ in tutti i vertici e confrontare. È l'idea alla base della *programmazione lineare*.` },
        {
          t: 'quiz',
          q: R`Il punto $(1;2)$ appartiene al semipiano $2x-y+3<0$?`,
          options: [
            { md: 'No', ok: true, why: R`$2\cdot1-2+3=3$, che non è minore di $0$.` },
            { md: 'Sì', why: R`Sostituisci: $2\cdot1-2+3=3>0$.` },
            { md: 'Sta sulla retta di confine', why: R`Starebbe sulla retta solo se sostituendo si ottenesse $0$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'ret-intercetta',
      level: 1,
      title: 'Intersezione con l\'asse x',
      make: (r) => {
        const a = nz(r, -5, 5), b = nz(r, -5, 5), p = nz(r, -6, 6);
        const c = a * p;
        return {
          text: R`Qual è l'ascissa del punto in cui la retta $${a === 1 ? '' : a === -1 ? '-' : a}x${sg(b, 'y')}=${c}$ interseca l'asse $x$?`,
          answer: p,
          tol: 0,
          hints: [R`I punti dell'asse $x$ hanno $y=0$.`],
          solution: [R`Poniamo $y=0$: $${a}x=${c}$.`, R`$x=${p}$: il punto è $${P(p, 0)}$.`],
        };
      },
    },
    {
      id: 'fascio-centro',
      level: 2,
      title: 'Centro di un fascio proprio',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -6, 6, a);
        return {
          text: R`Qual è il centro del fascio di rette $y=kx${sg(-a, 'k')}${sg(b)}$?`,
          options: mc(r, `$${P(a, b)}$`, [
            [`$${P(-a, b)}$`, R`Attenzione al segno: l'equazione è $y-y_0=k(x-x_0)$, con il segno meno davanti a $x_0$.`],
            [`$${P(b, a)}$`, 'Hai scambiato ascissa e ordinata.'],
            [`$${P(a, -b)}$`, R`Portando il termine noto a primo membro si ottiene $y-y_0$: controlla il segno dell'ordinata.`],
          ]),
          hints: [R`Raccogli $k$: scrivi l'equazione nella forma $y-y_0=k(x-x_0)$.`, R`$y${sg(-b)}=k(x${sg(-a)})$.`],
          solution: [R`$y=kx${sg(-a, 'k')}${sg(b)}\iff y${sg(-b)}=k(x${sg(-a)})$.`, R`Per $x=${a}$ si ottiene $y=${b}$ qualunque sia $k$: il centro è $${P(a, b)}$.`],
        };
      },
    },
    {
      id: 'fascio-per-punto',
      level: 2,
      title: 'Retta di un fascio per un punto',
      make: (r) => {
        const a = int(r, -4, 4), b = int(r, -4, 4), m = nz(r, -4, 4), dx = nz(r, -3, 3);
        const qx = a + dx, qy = b + m * dx;
        return {
          text: R`Nel fascio di rette di centro $C${P(a, b)}$, di equazione $y${sg(-b) || '+0'}=m(x${sg(-a) || '+0'})$, per quale valore di $m$ la retta passa per $Q${P(qx, qy)}$?`.replace(/\+0/g, '').replace('m(x)', 'm\\,x'),
          answer: m,
          tol: 0,
          hints: ['Sostituisci le coordinate di $Q$ nell\'equazione del fascio.', R`Equivale a calcolare il coefficiente angolare della retta $CQ$: $m=\dfrac{y_Q-y_C}{x_Q-x_C}$.`],
          solution: [R`$m=\dfrac{y_Q-y_C}{x_Q-x_C}=\dfrac{${qy}-(${b})}{${qx}-(${a})}=\dfrac{${qy - b}}{${qx - a}}=${m}$.`],
        };
      },
    },
    {
      id: 'fascio-improprio',
      level: 1,
      title: 'Retta di un fascio improprio',
      make: (r) => {
        const m = nz(r, -4, 4), x0 = nz(r, -5, 5), y0 = int(r, -6, 6);
        const k = y0 - m * x0;
        return {
          text: R`Nel fascio improprio $y=${m === 1 ? '' : m === -1 ? '-' : m}x+k$, per quale valore di $k$ la retta passa per $A${P(x0, y0)}$?`,
          answer: k,
          tol: 0,
          hints: ['Sostituisci le coordinate di $A$ e ricava $k$.'],
          solution: [R`$${y0}=${m}\cdot(${x0})+k$.`, R`$k=${y0}${sg(-m * x0)}=${k}$.`],
        };
      },
    },
    {
      id: 'fascio-perpendicolare',
      level: 3,
      title: 'Retta di un fascio perpendicolare a una retta',
      make: (r) => {
        const n = int(r, 2, 6), s = pick(r, [1, -1]), a = nz(r, -4, 4), b = nz(r, -4, 4), q = int(r, -5, 5);
        return {
          text: R`Nel fascio $y${sg(-b)}=k(x${sg(-a)})$, per quale valore di $k$ la retta è **perpendicolare** alla retta $y=${frac(s, n)}x${sg(q)}$?`,
          answer: -n * s,
          tol: 0,
          hints: [R`Due rette sono perpendicolari se $m\cdot m'=-1$.`, R`Il coefficiente angolare cercato è l'antireciproco di $${frac(s, n)}$.`],
          solution: [R`Condizione: $k\cdot\left(${frac(s, n)}\right)=-1$.`, R`$k=${-n * s}$.`],
        };
      },
    },
    {
      id: 'ret-parallele-distanza',
      level: 2,
      title: 'Distanza tra rette parallele',
      make: (r) => {
        const [a, b, h] = pick(r, [[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]] as const);
        const sb = pick(r, [1, -1]), c1 = int(r, -9, 9), t = int(r, 1, 6), c2 = c1 + h * t * pick(r, [1, -1]);
        const lhs = `${a}x${sg(b * sb, 'y')}`;
        return {
          text: R`Calcola la distanza tra le rette parallele $${lhs}${sg(c1)}=0$ e $${lhs}${sg(c2)}=0$.`,
          answer: t,
          tol: 0,
          hints: [R`Per due rette $ax+by+c_1=0$ e $ax+by+c_2=0$ con gli stessi $a,b$: $d=\dfrac{|c_1-c_2|}{\sqrt{a^2+b^2}}$.`, R`$\sqrt{${a}^2+${b}^2}=${h}$.`],
          solution: [R`$d=\dfrac{|c_1-c_2|}{\sqrt{a^2+b^2}}=\dfrac{|${c1}-(${c2})|}{\sqrt{${a * a}+${b * b}}}$.`, R`$d=\dfrac{${Math.abs(c1 - c2)}}{${h}}=${t}$.`],
        };
      },
    },
    {
      id: 'tri-baricentro',
      level: 1,
      title: 'Baricentro di un triangolo',
      make: (r) => {
        const gx = int(r, -4, 4), gy = int(r, -4, 4), a1 = nz(r, -4, 4), b1 = int(r, -4, 4), a2 = nz(r, -4, 4, a1, -a1), b2 = nz(r, -4, 4, b1, -b1);
        const A = [gx + a1, gy + b1], B = [gx + a2, gy + b2], C = [gx - a1 - a2, gy - b1 - b2];
        const absc = r() < 0.5;
        return {
          text: R`Il triangolo $ABC$ ha vertici $A${P(A[0], A[1])}$, $B${P(B[0], B[1])}$, $C${P(C[0], C[1])}$. Qual è l'**${absc ? 'ascissa' : 'ordinata'}** del suo baricentro?`,
          answer: absc ? gx : gy,
          tol: 0,
          hints: ['Le coordinate del baricentro sono la media aritmetica delle coordinate dei tre vertici.'],
          solution: [absc ? R`$x_G=\dfrac{${A[0]}+(${B[0]})+(${C[0]})}{3}=\dfrac{${3 * gx}}{3}=${gx}$.` : R`$y_G=\dfrac{${A[1]}+(${B[1]})+(${C[1]})}{3}=\dfrac{${3 * gy}}{3}=${gy}$.`],
        };
      },
    },
    {
      id: 'tri-circocentro',
      level: 3,
      title: 'Circocentro di un triangolo rettangolo',
      make: (r) => {
        const a = int(r, -4, 4), b = int(r, -4, 4), u = nz(r, -4, 4), v = nz(r, -4, 4);
        return {
          text: R`Trova il circocentro del triangolo di vertici $A${P(a, b)}$, $B${P(a + 2 * u, b)}$, $C${P(a, b + 2 * v)}$.`,
          options: mc(r, `$${P(a + u, b + v)}$`, [
            [`$${P(a, b)}$`, 'Questo è il vertice dell\'angolo retto, che in un triangolo rettangolo è l\'**ortocentro**.'],
            [`$${P(a + u, b)}$`, 'Questo è solo il punto medio del lato $AB$: serve l\'intersezione di due assi.'],
            [`$${P(a + 2 * u, b + 2 * v)}$`, 'Hai sommato gli spostamenti invece di prendere i punti medi.'],
          ]),
          hints: ['Il circocentro è l\'intersezione degli assi dei lati.', R`$AB$ è orizzontale e $AC$ è verticale: i loro assi sono una retta verticale e una orizzontale.`],
          solution: [R`Asse di $AB$ (orizzontale): $x=${a + u}$.`, R`Asse di $AC$ (verticale): $y=${b + v}$.`, R`Circocentro: $${P(a + u, b + v)}$, punto medio dell'ipotenusa $BC$.`],
        };
      },
    },
    {
      id: 'luogo-equidistante',
      level: 3,
      title: 'Punto equidistante sull\'asse x',
      make: (r) => {
        const p = int(r, -5, 5), u = nz(r, -5, 5), v = nz(r, 1, 5, u, -u);
        const A = [p + u, v], B = [p - v, u];
        return {
          text: R`Trova l'ascissa del punto dell'asse $x$ equidistante da $A${P(A[0], A[1])}$ e $B${P(B[0], B[1])}$.`,
          answer: p,
          tol: 0,
          hints: [R`Un punto dell'asse $x$ ha coordinate $P(x;0)$.`, R`Imponi $\overline{PA}^2=\overline{PB}^2$: i termini $x^2$ si semplificano.`],
          solution: [R`$\overline{PA}^2=(x${sg(-A[0])})^2+${A[1] * A[1]}$ e $\overline{PB}^2=(x${sg(-B[0])})^2+${B[1] * B[1]}$.`.replace(/\(x\)/g, 'x'), R`Uguagliando e semplificando $x^2$: $${-2 * A[0]}x+${A[0] * A[0] + A[1] * A[1]}=${-2 * B[0]}x+${B[0] * B[0] + B[1] * B[1]}$.`, R`$x=${p}$. Controllo: entrambe le distanze valgono $\sqrt{${u * u + v * v}}$.`],
        };
      },
    },
    {
      id: 'semipiano-punto',
      level: 1,
      title: 'Punto di un semipiano',
      make: (r) => {
        const m = nz(r, -3, 3), q = int(r, -4, 4);
        const xs = [int(r, -4, -2), int(r, -1, 0), int(r, 1, 2), int(r, 3, 5)].sort(() => r() - 0.5);
        const y = (x: number, d: number) => m * x + q + d;
        const line = `${m === 1 ? '' : m === -1 ? '-' : m}x${sg(q)}`;
        return {
          text: R`Quale dei seguenti punti appartiene al semipiano $y>${line}$?`,
          options: mc(r, `$${P(xs[0], y(xs[0], int(r, 1, 4)))}$`, [
            [`$${P(xs[1], y(xs[1], -int(r, 1, 4)))}$`, 'Sostituendo, l\'ordinata risulta minore del valore della retta: il punto sta sotto.'],
            [`$${P(xs[2], y(xs[2], 0))}$`, 'Questo punto sta sulla retta: la disuguaglianza è stretta, quindi la retta è esclusa.'],
            [`$${P(xs[3], y(xs[3], -int(r, 1, 4)))}$`, 'Sostituendo, l\'ordinata risulta minore del valore della retta: il punto sta sotto.'],
          ]),
          hints: [R`Per ogni punto calcola $${line}$ con la sua ascissa e confronta con la sua ordinata.`, 'Il semipiano richiesto è quello sopra la retta, retta esclusa.'],
          solution: [R`Il punto giusto ha ordinata **maggiore** di $${line}$ calcolato nella sua ascissa.`, R`Per $x=${xs[0]}$ la retta vale $${y(xs[0], 0)}$: ogni ordinata più grande va bene.`],
        };
      },
    },
    {
      id: 'semipiano-area',
      level: 2,
      title: 'Area di una regione',
      make: (r) => {
        const p = int(r, 1, 6) * 2, q = int(r, 2, 9);
        return {
          text: R`Calcola l'area della regione di piano definita dal sistema $\begin{cases}x\ge0\\ y\ge0\\ ${q}x+${p}y\le${p * q}\end{cases}$`,
          answer: (p * q) / 2,
          tol: 0,
          hints: [R`Trova le intersezioni della retta $${q}x+${p}y=${p * q}$ con gli assi.`, 'La regione è un triangolo rettangolo con i cateti sugli assi.'],
          solution: [R`Per $y=0$: $x=${p}$. Per $x=0$: $y=${q}$.`, R`La regione è il triangolo di vertici $(0;0)$, $(${p};0)$, $(0;${q})$.`, R`Area $=\dfrac{${p}\cdot${q}}{2}=${(p * q) / 2}$.`],
        };
      },
    },
    {
      id: 'prog-lineare',
      level: 3,
      title: 'Massimo di una funzione obiettivo',
      make: (r) => {
        const n = int(r, 3, 10), a = int(r, 1, 8), b = nz(r, 1, 8, a);
        return {
          text: R`Trova il valore massimo di $z=${a === 1 ? '' : a}x+${b === 1 ? '' : b}y$ nella regione definita da $x\ge0$, $y\ge0$, $x+y\le${n}$.`,
          answer: n * Math.max(a, b),
          tol: 0,
          hints: ['Il massimo di una funzione lineare su un poligono si trova in uno dei vertici.', R`I vertici sono $(0;0)$, $(${n};0)$, $(0;${n})$.`],
          solution: [R`La regione è il triangolo di vertici $(0;0)$, $(${n};0)$, $(0;${n})$.`, R`$z(0;0)=0$, $z(${n};0)=${a * n}$, $z(0;${n})=${b * n}$.`, R`Il massimo è $${n * Math.max(a, b)}$.`],
        };
      },
    },
  ],
};
