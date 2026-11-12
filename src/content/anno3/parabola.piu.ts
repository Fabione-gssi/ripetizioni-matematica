// Approfondimenti dell'unità "Parabola".
import { frac, int, mc, nz, pick, poly, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;

export const parabolaPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-par-4',
      title: 'Parabola con asse parallelo all\'asse x',
      blocks: [
        { t: 'idea', md: R`Se si scambiano i ruoli di $x$ e $y$ nell'equazione di una parabola si ottiene una parabola "coricata", con l'asse di simmetria orizzontale. Tutte le formule restano le stesse, a patto di scambiare ascisse e ordinate.` },
        { t: 'def', title: 'Equazione e elementi', md: R`L'equazione
$$x=ay^2+by+c\qquad(a\neq0)$$
rappresenta una parabola con **asse parallelo all'asse $x$**. Posto $\Delta=b^2-4ac$:
- asse di simmetria: $y=-\dfrac{b}{2a}$
- vertice: $V\left(-\dfrac{\Delta}{4a};\ -\dfrac{b}{2a}\right)$
- fuoco: $F\left(\dfrac{1-\Delta}{4a};\ -\dfrac{b}{2a}\right)$
- direttrice: $x=-\dfrac{1+\Delta}{4a}$

Se $a>0$ la concavità è rivolta verso **destra**, se $a<0$ verso **sinistra**.` },
        {
          t: 'plot',
          title: R`La parabola $x=ay^2+c$`,
          caption: R`Cambia $a$ e $c$: il vertice è $(c;0)$ e l'asse di simmetria è l'asse $x$. Una retta verticale può incontrare la curva in due punti: questa parabola **non** è il grafico di una funzione $y=f(x)$.`,
          view: [-7, 7, -5, 5],
          params: [
            { name: 'a', label: 'a', min: -2, max: 2, step: 0.25, value: 0.5 },
            { name: 'c', label: 'c', min: -4, max: 4, step: 0.5, value: -2 },
          ],
          draw: (p) => [
            { k: 'param', x: (t) => p.a * t * t + p.c, y: (t) => t, t0: -6, t1: 6 },
            { k: 'pt', x: p.c, y: 0, label: 'V' },
          ],
          readout: (p) => (p.a === 0 ? 'Con $a=0$ la curva degenera nella retta verticale $x=c$.' : `Concavità verso ${p.a > 0 ? 'destra' : 'sinistra'}.`),
        },
        {
          t: 'ex',
          title: R`Studia la parabola $x=y^2-4y+3$.`,
          steps: [
            R`$a=1$, $b=-4$, $c=3$; $\Delta=16-12=4$. Concavità verso destra.`,
            R`Asse: $y=-\dfrac{-4}{2}=2$. Vertice: $x_V=-\dfrac{4}{4}=-1$, quindi $V(-1;2)$.`,
            R`Fuoco: $F\left(\dfrac{1-4}{4};2\right)=\left(-\dfrac34;2\right)$. Direttrice: $x=-\dfrac{1+4}{4}=-\dfrac54$.`,
            R`Intersezioni con l'asse $y$ ($x=0$): $y^2-4y+3=0$, cioè $y=1$ e $y=3$. Con l'asse $x$ ($y=0$): $x=3$.`,
          ],
        },
        { t: 'warn', md: R`Per disegnare $x=ay^2+by+c$ conviene assegnare valori a $y$ e calcolare $x$. Se serve esprimere $y$ in funzione di $x$ si ottengono **due** funzioni (i due rami, sopra e sotto l'asse): per esempio da $x=y^2$ si ricava $y=\sqrt x$ e $y=-\sqrt x$.` },
        {
          t: 'quiz',
          q: R`Qual è il vertice della parabola $x=y^2-2y$?`,
          options: [
            { md: R`$(-1;\,1)$`, ok: true, why: R`Giusto: $y_V=-\dfrac{b}{2a}=1$ e $x_V=1-2=-1$.` },
            { md: R`$(1;\,-1)$`, why: R`Hai usato le formule della parabola con asse verticale: qui $-\dfrac{b}{2a}$ è l'**ordinata** del vertice.` },
            { md: R`$(0;\,0)$`, why: R`L'origine appartiene alla parabola, ma non è il vertice.` },
          ],
        },
      ],
    },
    {
      id: 'a3-par-5',
      title: 'Determinare l\'equazione di una parabola',
      blocks: [
        { t: 'idea', md: R`L'equazione $y=ax^2+bx+c$ contiene **tre** coefficienti: per individuare una parabola servono quindi **tre condizioni** indipendenti. Ogni informazione geometrica si traduce in un'equazione nelle incognite $a$, $b$, $c$; poi si risolve il sistema.` },
        { t: 'def', title: 'Come si traducono le condizioni', md: R`- **Passaggio per un punto** $P(x_0;y_0)$: le coordinate soddisfano l'equazione, $y_0=ax_0^2+bx_0+c$ (una condizione).
- **Vertice** $V(x_V;y_V)$ noto: vale **due** condizioni, $-\dfrac{b}{2a}=x_V$ e passaggio per $V$. Spesso conviene scrivere direttamente $y=a(x-x_V)^2+y_V$.
- **Asse** noto $x=k$: $-\dfrac{b}{2a}=k$ (una condizione).
- **Fuoco** noto: due condizioni. **Direttrice** nota: una condizione.
- **Tangenza a una retta**: il discriminante dell'equazione risolvente è nullo, $\Delta=0$ (una condizione).` },
        {
          t: 'ex',
          title: R`Trova la parabola con asse verticale passante per $A(0;1)$, $B(1;0)$, $C(2;3)$.`,
          steps: [
            R`Passaggio per $A$: $c=1$.`,
            R`Passaggio per $B$: $a+b+1=0$. Passaggio per $C$: $4a+2b+1=3$, cioè $2a+b=1$.`,
            R`Sottraendo la prima dalla seconda: $a=2$; quindi $b=-3$.`,
            R`Parabola: $y=2x^2-3x+1$. Controllo in $C$: $8-6+1=3$ ✓`,
          ],
        },
        {
          t: 'ex',
          title: R`Trova la parabola con vertice $V(1;-2)$ passante per $P(3;2)$.`,
          steps: [
            R`Con il vertice noto conviene la forma $y=a(x-1)^2-2$: resta una sola incognita.`,
            R`Passaggio per $P$: $2=a(3-1)^2-2$, cioè $4a=4$, $a=1$.`,
            R`$y=(x-1)^2-2=x^2-2x-1$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Trova le parabole $y=x^2+bx+c$ passanti per $(0;1)$ e tangenti alla retta $y=x$.`,
          steps: [
            R`Passaggio per $(0;1)$: $c=1$.`,
            R`Intersezione con la retta: $x^2+bx+1=x$, cioè $x^2+(b-1)x+1=0$.`,
            R`Tangenza: $\Delta=(b-1)^2-4=0$, da cui $b-1=\pm2$: $b=3$ oppure $b=-1$.`,
            R`Ci sono due parabole: $y=x^2+3x+1$ e $y=x^2-x+1$.`,
          ],
        },
        { t: 'warn', md: R`Tre punti **allineati** non individuano nessuna parabola con asse verticale (il sistema dà $a=0$, cioè una retta). E se due dei punti hanno la stessa ascissa non esiste nessuna funzione che passi per entrambi.` },
        {
          t: 'quiz',
          q: R`Quante condizioni fornisce la conoscenza del vertice?`,
          options: [
            { md: 'Due', ok: true, why: 'Giusto: l\'ascissa del vertice fissa l\'asse, e in più la parabola passa per il vertice.' },
            { md: 'Una', why: 'Il vertice dà sia la posizione dell\'asse sia un punto della parabola.' },
            { md: 'Tre', why: 'Con il solo vertice resta libero un coefficiente: esistono infinite parabole con lo stesso vertice.' },
          ],
        },
      ],
    },
    {
      id: 'a3-par-6',
      title: 'Tangenti da un punto esterno e segmento parabolico',
      blocks: [
        { t: 'idea', md: R`Da un punto **esterno** a una parabola si possono condurre due rette tangenti; da un punto della parabola una sola; da un punto interno nessuna. Per trovarle si usa sempre la stessa idea: una retta è tangente quando ha con la parabola **un solo punto in comune, contato due volte**.` },
        { t: 'def', title: 'Metodo del discriminante', md: R`Per trovare le tangenti alla parabola condotte da $P(x_0;y_0)$:
1. si scrive il fascio di rette per $P$: $y-y_0=m(x-x_0)$;
2. si mette a sistema con la parabola, ottenendo un'equazione di secondo grado in $x$ (la risolvente);
3. si impone $\Delta=0$: si ottiene un'equazione in $m$;
4. le soluzioni $m_1,m_2$ sono i coefficienti angolari delle tangenti.

Se l'equazione in $m$ ha due soluzioni $P$ è esterno, se ne ha una $P$ appartiene alla parabola, se non ne ha $P$ è interno.` },
        {
          t: 'ex',
          title: R`Trova le tangenti alla parabola $y=x^2$ condotte da $P(1;-3)$.`,
          steps: [
            R`Fascio per $P$: $y+3=m(x-1)$, cioè $y=mx-m-3$.`,
            R`Sistema con $y=x^2$: $x^2-mx+m+3=0$.`,
            R`$\Delta=m^2-4(m+3)=m^2-4m-12=0$, da cui $m=6$ oppure $m=-2$.`,
            R`Tangenti: $y=6x-9$ e $y=-2x-1$. I punti di tangenza hanno ascissa $x=\dfrac m2$: sono $(3;9)$ e $(-1;1)$.`,
          ],
        },
        { t: 'thm', title: 'Formula di sdoppiamento', md: R`Se $P(x_0;y_0)$ **appartiene** alla parabola $y=ax^2+bx+c$, la tangente in $P$ si ottiene "sdoppiando" l'equazione:
$$\dfrac{y+y_0}{2}=a\,x_0x+b\,\dfrac{x+x_0}{2}+c$$
In modo equivalente, il coefficiente angolare della tangente è $m=2ax_0+b$.` },
        { t: 'thm', title: 'Area del segmento parabolico (Archimede)', md: R`Il **segmento parabolico** è la regione compresa tra una parabola e una sua corda. La sua area è i $\dfrac23$ dell'area del rettangolo che ha per base la corda e per altezza la distanza tra la corda e la tangente parallela ad essa.

Per la parabola $y=ax^2+bx+c$ tagliata da una retta nei punti di ascisse $x_1<x_2$:
$$\mathcal A=\dfrac{|a|\,(x_2-x_1)^3}{6}$$` },
        {
          t: 'ex',
          title: R`Calcola l'area della regione compresa tra $y=x^2$ e $y=x+2$.`,
          steps: [
            R`Intersezioni: $x^2=x+2$, cioè $x^2-x-2=0$: $x_1=-1$, $x_2=2$.`,
            R`$\mathcal A=\dfrac{|a|(x_2-x_1)^3}{6}=\dfrac{1\cdot3^3}{6}=\dfrac{27}{6}=\dfrac92$.`,
          ],
        },
        {
          t: 'quiz',
          q: R`Quante tangenti alla parabola $y=x^2$ passano per il punto $(0;1)$?`,
          options: [
            { md: 'Nessuna', ok: true, why: R`Il punto è interno alla parabola (sta sopra il vertice, dentro la concavità): $x^2-mx-1=0$ ha $\Delta=m^2+4>0$ per ogni $m$, quindi nessuna retta è tangente.` },
            { md: 'Due', why: R`Due tangenti si hanno da un punto esterno; $(0;1)$ è interno.` },
            { md: 'Una', why: R`Una sola tangente si ha da un punto che appartiene alla parabola; ma $1\neq0^2$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'par-concavita',
      level: 1,
      title: 'Concavità con parametro',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -5, 5), c = int(r, -5, 5);
        const up = r() < 0.5;
        return {
          text: R`Per quali valori di $k$ la parabola $y=(k${sg(-a)})x^2${sg(b, 'x')}${sg(c)}$ ha la concavità rivolta verso **${up ? "l'alto" : 'il basso'}**?`,
          options: mc(r, up ? R`$k>${a}$` : R`$k<${a}$`, [
            [up ? R`$k<${a}$` : R`$k>${a}$`, 'Verso invertito: per questi valori la concavità è rivolta dalla parte opposta.'],
            [up ? R`$k>${-a}$` : R`$k<${-a}$`, R`Attenzione al segno: il coefficiente di $x^2$ è $k${sg(-a)}$.`],
            [up ? R`$k>0$` : R`$k<0$`, R`Il coefficiente di $x^2$ non è $k$, ma $k${sg(-a)}$.`],
          ]),
          hints: [R`La concavità dipende dal segno del coefficiente di $x^2$.`, R`Imponi $k${sg(-a)}${up ? '>' : '<'}0$.`],
          solution: [R`Concavità verso ${up ? "l'alto" : 'il basso'} $\iff$ coefficiente di $x^2$ ${up ? 'positivo' : 'negativo'}.`, R`$k${sg(-a)}${up ? '>' : '<'}0\iff k${up ? '>' : '<'}${a}$.`],
        };
      },
    },
    {
      id: 'parx-asse',
      level: 1,
      title: 'Asse di una parabola con asse orizzontale',
      make: (r) => {
        const q = nz(r, -6, 6), c = int(r, -6, 6);
        return {
          text: R`Qual è l'asse di simmetria della parabola $x=${poly([1, -2 * q, c], 'y')}$?`,
          options: mc(r, R`$y=${q}$`, [
            [R`$x=${q}$`, R`Questa parabola ha l'asse **orizzontale**: la sua equazione è del tipo $y=\text{costante}$.`],
            [R`$y=${-q}$`, R`Segno sbagliato: l'asse è $y=-\dfrac{b}{2a}$.`],
            [R`$x=${-q}$`, 'Sono sbagliati sia la direzione dell\'asse sia il segno.'],
          ]),
          hints: [R`Per $x=ay^2+by+c$ l'asse è la retta $y=-\dfrac{b}{2a}$.`],
          solution: [R`$a=1$, $b=${-2 * q}$: asse $y=-\dfrac{${-2 * q}}{2}=${q}$.`],
        };
      },
    },
    {
      id: 'parx-vertice',
      level: 2,
      title: 'Vertice di una parabola con asse orizzontale',
      make: (r) => {
        const q = nz(r, -4, 4), c = int(r, -6, 6);
        const xv = c - q * q;
        return {
          text: R`Trova il vertice della parabola $x=${poly([1, -2 * q, c], 'y')}$.`,
          options: mc(r, `$${P(xv, q)}$`, [
            [`$${P(q, xv)}$`, R`Hai scambiato le coordinate: $-\dfrac{b}{2a}$ è l'**ordinata** del vertice.`],
            [`$${P(xv, -q)}$`, R`Segno dell'ordinata sbagliato: $y_V=-\dfrac{b}{2a}$.`],
            [`$${P(c, q)}$`, R`L'ascissa del vertice si ottiene sostituendo $y_V$ nell'equazione, non è il termine noto.`],
          ], [`$${P(xv + 1, q)}$`]),
          hints: [R`$y_V=-\dfrac{b}{2a}$.`, R`Sostituisci $y=${q}$ nell'equazione per trovare $x_V$.`],
          solution: [R`$y_V=-\dfrac{${-2 * q}}{2}=${q}$.`, R`$x_V=(${q})^2${sg(-2 * q)}\cdot(${q})${sg(c)}=${q * q}-${2 * q * q}${sg(c)}=${xv}$.`, R`$V${P(xv, q)}$.`],
        };
      },
    },
    {
      id: 'parx-fuoco',
      level: 3,
      title: 'Fuoco di una parabola con asse orizzontale',
      make: (r) => {
        const f = nz(r, -5, 5);
        return {
          text: R`Trova il fuoco della parabola $x=${frac(1, 4 * f)}y^2$.`,
          options: mc(r, `$${P(f, 0)}$`, [
            [`$${P(0, f)}$`, 'Questa parabola ha l\'asse orizzontale: il fuoco sta sull\'asse $x$.'],
            [`$${P(-f, 0)}$`, 'Il fuoco sta dalla parte della concavità: controlla il segno.'],
            [`$${P(frac(1, 4 * f), 0)}$`, R`L'ascissa del fuoco è $\dfrac{1}{4a}$, non $a$.`],
          ]),
          hints: [R`Per $x=ay^2$ il vertice è l'origine e il fuoco è $F\left(\dfrac{1}{4a};0\right)$.`, R`Qui $a=${frac(1, 4 * f)}$.`],
          solution: [R`$a=${frac(1, 4 * f)}$, quindi $\dfrac{1}{4a}=${f}$.`, R`$F${P(f, 0)}$; la direttrice è $x=${-f}$.`],
        };
      },
    },
    {
      id: 'par-traslata',
      level: 2,
      title: 'Parabola traslata',
      make: (r) => {
        const h = nz(r, -5, 5), k = nz(r, -6, 6);
        return {
          text: R`Qual è l'equazione della parabola che si ottiene traslando $y=x^2$ in modo che il vertice vada in $V${P(h, k)}$?`,
          options: mc(r, R`$y=${poly([1, -2 * h, h * h + k])}$`, [
            [R`$y=${poly([1, 2 * h, h * h + k])}$`, R`Segno sbagliato: il vertice in $x=${h}$ corrisponde al fattore $(x${sg(-h)})^2$.`],
            [R`$y=${poly([1, -2 * h, k])}$`, R`Sviluppando $(x${sg(-h)})^2$ compare anche il termine $${h * h}$.`],
            [R`$y=${poly([1, 0, k])}$`, 'Questa parabola è stata traslata solo in verticale.'],
          ]),
          hints: [R`La parabola con vertice $V(x_V;y_V)$ e $a=1$ è $y=(x-x_V)^2+y_V$.`, 'Sviluppa il quadrato.'],
          solution: [R`$y=(x${sg(-h)})^2${sg(k)}$.`, R`$y=${poly([1, -2 * h, h * h])}${sg(k)}=${poly([1, -2 * h, h * h + k])}$.`],
        };
      },
    },
    {
      id: 'par-tre-punti',
      level: 3,
      title: 'Parabola per tre punti',
      make: (r) => {
        const a = nz(r, -3, 3), b = int(r, -4, 4), c = int(r, -5, 5);
        const y1 = a + b + c, y2 = a - b + c;
        return {
          text: R`La parabola $y=ax^2+bx+c$ passa per $A${P(0, c)}$, $B${P(1, y1)}$ e $C${P(-1, y2)}$. Quanto vale $a$?`,
          answer: a,
          tol: 0,
          hints: [R`Il passaggio per $A$ dà subito $c=${c}$.`, R`Scrivi le condizioni per $B$ e $C$ e **somma** le due equazioni: $b$ si elimina.`],
          solution: [R`$A$: $c=${c}$.`, R`$B$: $a+b${sg(c)}=${y1}$; $C$: $a-b${sg(c)}=${y2}$.`, R`Sommando: $2a${sg(2 * c)}=${y1 + y2}\Rightarrow a=${a}$ (e poi $b=${b}$).`],
        };
      },
    },
    {
      id: 'par-vertice-c',
      level: 2,
      title: 'Parabola dato il vertice',
      make: (r) => {
        const h = nz(r, -5, 5), k = int(r, -6, 6), a = pick(r, [1, 2, -1, -2]);
        return {
          text: R`Una parabola con asse verticale ha vertice $V${P(h, k)}$ e coefficiente $a=${a}$. Scritta nella forma $y=ax^2+bx+c$, quanto vale $c$?`,
          answer: a * h * h + k,
          tol: 0,
          hints: [R`Parti da $y=a(x-x_V)^2+y_V$.`, R`$c$ è il valore di $y$ per $x=0$.`],
          solution: [R`$y=${a === 1 ? '' : a === -1 ? '-' : a}(x${sg(-h)})^2${sg(k)}$.`, R`Per $x=0$: $c=${a}\cdot${h * h}${sg(k)}=${a * h * h + k}$.`],
        };
      },
    },
    {
      id: 'par-corda',
      level: 2,
      title: 'Corda parallela all\'asse x',
      make: (r) => {
        const s = int(r, 1, 7), c = int(r, -6, 6), k = s * s + c;
        return {
          text: R`Calcola la lunghezza della corda che la retta $y=${k}$ stacca sulla parabola $y=x^2${sg(c)}$.`,
          answer: 2 * s,
          tol: 0,
          hints: ['Trova le ascisse dei due punti di intersezione.', 'La corda è orizzontale: la sua lunghezza è la differenza delle ascisse.'],
          solution: [R`$x^2${sg(c)}=${k}\Rightarrow x^2=${s * s}\Rightarrow x=\pm${s}$.`, R`Lunghezza: $${s}-(-${s})=${2 * s}$.`],
        };
      },
    },
    {
      id: 'par-tangenti-esterno',
      level: 3,
      title: 'Tangenti da un punto esterno',
      make: (r) => {
        const p = int(r, -3, 3), k = int(r, 1, 4);
        const y0 = p * p - k * k;
        return {
          text: R`Dal punto $P${P(p, y0)}$ si conducono le due tangenti alla parabola $y=x^2$. Qual è il **maggiore** dei due coefficienti angolari?`,
          answer: 2 * p + 2 * k,
          tol: 0,
          hints: [R`Scrivi il fascio per $P$, mettilo a sistema con $y=x^2$ e imponi $\Delta=0$.`, R`Si ottiene un'equazione di secondo grado in $m$.`],
          solution: [
            R`Fascio: $y${sg(-y0)}=m(x${sg(-p)})$. Sistema con $y=x^2$: $x^2-mx${sg(p, 'm')}${sg(-y0)}=0$.`.replace(/\(x\)/g, 'x'),
            R`$\Delta=m^2-4(${`${sg(p, 'm')}${sg(-y0)}`.replace(/^\+/, '')})=m^2${sg(-4 * p, 'm')}${sg(4 * y0)}=0$.`,
            R`$m=${2 * p - 2 * k}$ oppure $m=${2 * p + 2 * k}$: il maggiore è $${2 * p + 2 * k}$.`,
          ],
        };
      },
    },
    {
      id: 'par-segmento',
      level: 3,
      title: 'Area del segmento parabolico',
      make: (r) => {
        const [a, d] = pick(r, [[1, 6], [2, 3], [3, 2], [3, 4], [6, 1], [6, 2], [6, 3]] as const);
        const u = int(r, -4, 2), v = u + d;
        const retta = `${a * (u + v) === 0 ? '' : `${a * (u + v)}x`}${sg(-a * u * v)}`.replace(/^\+/, '') || '0';
        return {
          text: R`Calcola l'area della regione compresa tra la parabola $y=${a === 1 ? '' : a}x^2$ e la retta $y=${retta}$.`,
          answer: (a * d ** 3) / 6,
          tol: 0,
          hints: ['Trova le ascisse $x_1,x_2$ dei punti di intersezione.', R`$\mathcal A=\dfrac{|a|(x_2-x_1)^3}{6}$.`],
          solution: [R`Intersezioni: $${a === 1 ? '' : a}x^2=${retta}$, cioè $${poly([1, -(u + v), u * v])}=0$: $x_1=${u}$, $x_2=${v}$.`, R`$\mathcal A=\dfrac{${a}\cdot${d}^3}{6}=\dfrac{${a * d ** 3}}{6}=${(a * d ** 3) / 6}$.`],
        };
      },
    },
  ],
};
