// Approfondimenti dell'unità "Equazioni e disequazioni".
import { choice, int, mc, nz, poly, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;

export const equazioniPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-eq-5',
      title: 'Disequazioni di grado superiore: studio del segno di un prodotto',
      blocks: [
        { t: 'idea', md: R`Per una disequazione di grado superiore al secondo non esistono formule: si **scompone** il polinomio in fattori di primo e secondo grado, si studia il segno di ciascun fattore e poi si combinano i segni con la regola del prodotto, esattamente come si fa per le disequazioni fratte.` },
        { t: 'def', title: 'Procedimento', md: R`Per risolvere $P(x)>0$ (o $<,\ge,\le$):
1. si porta tutto a primo membro e si **scompone** $P(x)$ in fattori;
2. si studia il segno di ogni fattore ponendolo $>0$;
3. si riportano i risultati in uno **schema dei segni** (una riga per fattore);
4. in ogni intervallo il segno del prodotto è $+$ se i fattori negativi sono in numero pari, $-$ se sono in numero dispari;
5. si scelgono gli intervalli richiesti; gli zeri sono inclusi solo con $\ge$ o $\le$.` },
        {
          t: 'ex',
          title: R`Risolvi $x^3-4x>0$.`,
          steps: [
            R`Scomponiamo: $x^3-4x=x(x^2-4)=x(x-2)(x+2)$.`,
            R`Segno dei fattori: $x>0$; $x-2>0\iff x>2$; $x+2>0\iff x>-2$.`,
            R`Gli zeri $-2,\ 0,\ 2$ dividono la retta in quattro intervalli. Per $x<-2$ i tre fattori sono negativi: prodotto negativo. Per $-2<x<0$ due fattori negativi: positivo. Per $0<x<2$ un fattore negativo: negativo. Per $x>2$ tutti positivi: positivo.`,
            R`Soluzione: $-2<x<0\ \lor\ x>2$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Il segno di un polinomio di terzo grado',
          caption: R`Il grafico di $y=(x-a)(x-b)(x-c)$ attraversa l'asse $x$ in ogni zero semplice: il segno cambia a ogni attraversamento. Avvicina due zeri fino a farli coincidere e osserva che lì il grafico tocca l'asse senza attraversarlo.`,
          view: [-5, 5, -8, 8],
          params: [
            { name: 'a', label: 'a', min: -4, max: 0, step: 0.5, value: -2 },
            { name: 'b', label: 'b', min: -1, max: 2, step: 0.5, value: 0 },
            { name: 'c', label: 'c', min: 0, max: 4, step: 0.5, value: 2 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => 0.4 * (x - p.a) * (x - p.b) * (x - p.c) },
            { k: 'pt', x: p.a, y: 0, label: 'a' },
            { k: 'pt', x: p.b, y: 0, label: 'b' },
            { k: 'pt', x: p.c, y: 0, label: 'c' },
          ],
        },
        { t: 'def', title: 'Zeri di molteplicità pari', md: R`Un fattore elevato a esponente **pari**, come $(x-a)^2$, non è mai negativo: vale zero in $x=a$ ed è positivo altrove. Quindi **non fa cambiare segno** al prodotto. Bisogna però ricordarsi del punto $x=a$: va **aggiunto** alle soluzioni se la disequazione ammette l'uguaglianza ($\ge$, $\le$) e va **escluso** se è stretta ($>$, $<$).` },
        {
          t: 'ex',
          title: R`Risolvi $(x-1)^2(x+2)\le 0$.`,
          steps: [
            R`$(x-1)^2\ge0$ sempre, e si annulla solo per $x=1$.`,
            R`Il segno del prodotto è quindi quello di $x+2$: negativo per $x<-2$, nullo per $x=-2$.`,
            R`Il prodotto è $\le0$ per $x\le-2$; inoltre vale $0$ anche in $x=1$, che va aggiunto.`,
            R`Soluzione: $x\le-2\ \lor\ x=1$.`,
          ],
        },
        { t: 'warn', md: R`Un fattore sempre positivo (per esempio $x^2+1$ oppure un trinomio con $\Delta<0$ e $a>0$) non influisce sul segno e si può trascurare. Un fattore con $\Delta<0$ e $a<0$ è invece sempre negativo: **inverte** il segno di tutto il prodotto.` },
        {
          t: 'quiz',
          q: R`Qual è la soluzione di $x^2(x-3)>0$?`,
          options: [
            { md: R`$x>3$`, ok: true, why: R`Giusto: $x^2$ è positivo per $x\neq0$, quindi conta solo il segno di $x-3$; e $x=0$ non è soluzione perché lì il prodotto vale $0$.` },
            { md: R`$x<0\ \lor\ x>3$`, why: R`$x^2$ non cambia segno in $x=0$: per $x<0$ il prodotto è negativo.` },
            { md: R`$x\neq0$`, why: R`Per esempio $x=1$ dà $1\cdot(-2)<0$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-eq-6',
      title: 'Sistemi di secondo grado e problemi',
      blocks: [
        { t: 'idea', md: R`Un sistema è di secondo grado quando contiene un'equazione di primo grado e una di secondo. Geometricamente significa cercare i punti comuni a una retta e a una conica: possono essere due, uno o nessuno.` },
        { t: 'def', title: 'Metodo di sostituzione', md: R`1. Dall'equazione di **primo grado** si ricava un'incognita in funzione dell'altra.
2. Si sostituisce nell'equazione di secondo grado, ottenendo un'equazione in una sola incognita (la **risolvente**).
3. Per ogni soluzione della risolvente si calcola il valore dell'altra incognita.

Il discriminante della risolvente dice quante soluzioni ha il sistema: $\Delta>0$ due coppie, $\Delta=0$ una coppia (doppia), $\Delta<0$ nessuna.` },
        {
          t: 'ex',
          title: R`Risolvi $\begin{cases}y=x+1\\ x^2+y^2=5\end{cases}$`,
          steps: [
            R`Sostituiamo $y=x+1$ nella seconda: $x^2+(x+1)^2=5$.`,
            R`Sviluppiamo: $2x^2+2x+1=5$, cioè $x^2+x-2=0$.`,
            R`$(x+2)(x-1)=0$, quindi $x=-2$ oppure $x=1$.`,
            R`Calcoliamo $y=x+1$: per $x=-2$ si ha $y=-1$; per $x=1$ si ha $y=2$. Soluzioni: $(-2;-1)$ e $(1;2)$.`,
          ],
        },
        { t: 'thm', title: 'Sistemi simmetrici', md: R`Un sistema è **simmetrico** se non cambia scambiando $x$ con $y$. Il caso fondamentale è
$$\begin{cases}x+y=s\\ xy=p\end{cases}$$
Le soluzioni sono le coppie formate dalle radici dell'equazione $t^2-st+p=0$.`, proof: [
          R`Se $x$ e $y$ hanno somma $s$ e prodotto $p$, allora sono le radici di un'equazione di secondo grado con somma delle radici $s$ e prodotto $p$.`,
          R`Un'equazione monica con queste proprietà è $t^2-st+p=0$ (ricorda: somma $=-b/a$, prodotto $=c/a$).`,
          R`Dette $t_1,t_2$ le sue radici, le soluzioni del sistema sono $(t_1;t_2)$ e $(t_2;t_1)$.`,
        ] },
        {
          t: 'ex',
          title: R`Un rettangolo ha perimetro $26$ cm e area $40\ \text{cm}^2$. Trova i lati.`,
          steps: [
            R`Detti $x$ e $y$ i lati: $2(x+y)=26$ e $xy=40$, cioè $x+y=13$ e $xy=40$.`,
            R`È un sistema simmetrico: i lati sono le radici di $t^2-13t+40=0$.`,
            R`$\Delta=169-160=9$, $t=\dfrac{13\pm3}{2}$: $t_1=5$, $t_2=8$.`,
            R`I lati misurano $5$ cm e $8$ cm. Controllo: perimetro $2\cdot13=26$, area $5\cdot8=40$ ✓`,
          ],
        },
        { t: 'warn', md: R`Nei problemi, dopo aver risolto l'equazione controlla sempre l'**accettabilità** delle soluzioni: una lunghezza non può essere negativa, un numero di oggetti deve essere intero, e così via.` },
        {
          t: 'quiz',
          q: R`Quante soluzioni ha il sistema $\begin{cases}x+y=2\\ xy=5\end{cases}$?`,
          options: [
            { md: 'Nessuna soluzione reale', ok: true, why: R`Esatto: $t^2-2t+5=0$ ha $\Delta=4-20<0$.` },
            { md: 'Due', why: R`Controlla il discriminante di $t^2-2t+5=0$.` },
            { md: 'Una', why: R`Ci sarebbe una sola coppia (doppia) solo se $\Delta=0$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-eq-7',
      title: 'Equazioni parametriche e relazioni tra radici e coefficienti',
      blocks: [
        { t: 'idea', md: R`In un'equazione **parametrica** i coefficienti dipendono da una lettera (il parametro, di solito $k$). Non si chiede di risolverla, ma di stabilire **per quali valori del parametro** le soluzioni hanno una certa proprietà. Lo strumento principale sono le relazioni tra radici e coefficienti, che permettono di ragionare sulle radici senza calcolarle.` },
        { t: 'def', title: 'Gli strumenti', md: R`Per $ax^2+bx+c=0$ con radici $x_1,x_2$:
- **realtà delle radici:** $\Delta\ge0$ (distinte se $\Delta>0$, coincidenti se $\Delta=0$);
- **somma:** $s=x_1+x_2=-\dfrac{b}{a}$ ; **prodotto:** $p=x_1x_2=\dfrac{c}{a}$.

Condizioni frequenti:
- **una radice è** $x=\alpha$: si sostituisce $\alpha$ nell'equazione;
- **radici opposte:** $s=0$, cioè $b=0$ (con $\Delta\ge0$);
- **radici reciproche:** $p=1$, cioè $c=a$ (con $\Delta\ge0$);
- **una radice nulla:** $p=0$, cioè $c=0$;
- **radici concordi / discordi:** $p>0$ / $p<0$.` },
        { t: 'thm', title: 'Espressioni simmetriche delle radici', md: R`Si possono calcolare senza risolvere l'equazione:
$$x_1^2+x_2^2=s^2-2p\qquad \dfrac1{x_1}+\dfrac1{x_2}=\dfrac{s}{p}\qquad (x_1-x_2)^2=s^2-4p$$`, proof: [
          R`$(x_1+x_2)^2=x_1^2+2x_1x_2+x_2^2$, quindi $x_1^2+x_2^2=s^2-2p$.`,
          R`$\dfrac1{x_1}+\dfrac1{x_2}=\dfrac{x_1+x_2}{x_1x_2}=\dfrac{s}{p}$ (se $p\neq0$).`,
          R`$(x_1-x_2)^2=x_1^2+x_2^2-2x_1x_2=s^2-2p-2p=s^2-4p$.`,
        ] },
        {
          t: 'ex',
          title: R`Data $x^2-(k+1)x+k=0$, trova $k$ in modo che la somma dei quadrati delle radici sia $10$.`,
          steps: [
            R`$s=k+1$, $p=k$. Le radici sono sempre reali: $\Delta=(k+1)^2-4k=(k-1)^2\ge0$.`,
            R`$x_1^2+x_2^2=s^2-2p=(k+1)^2-2k=k^2+1$.`,
            R`Imponiamo $k^2+1=10$: $k^2=9$, $k=\pm3$.`,
            R`Entrambi i valori sono accettabili perché le radici sono reali per ogni $k$.`,
          ],
        },
        { t: 'warn', md: R`Le condizioni su somma e prodotto hanno senso solo se le radici **esistono**: va sempre controllato che per i valori trovati sia $\Delta\ge0$. Per esempio $x^2+1=0$ ha $b=0$ ma non ha radici opposte, perché non ha radici reali.` },
        {
          t: 'quiz',
          q: R`Per quale $k$ l'equazione $x^2-5x+k=0$ ha radici reciproche?`,
          options: [
            { md: R`$k=1$`, ok: true, why: R`Giusto: $p=k=1$; e $\Delta=25-4>0$, quindi le radici esistono.` },
            { md: R`$k=0$`, why: R`Con $k=0$ una radice è nulla, e lo zero non ha reciproco.` },
            { md: R`$k=5$`, why: R`$5$ è la somma delle radici, non il prodotto.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'diseq-prodotto',
      level: 2,
      title: 'Disequazione con tre fattori',
      make: (r) => {
        const a = int(r, -6, -1), b = int(r, a + 1, a + 4), c = int(r, b + 1, b + 4);
        const gt = r() < 0.5;
        const f = (z: number) => `(x${sg(-z)})`.replace('(x)', 'x');
        const pos = R`$${a}<x<${b}\ \lor\ x>${c}$`, neg = R`$x<${a}\ \lor\ ${b}<x<${c}$`;
        return {
          text: R`Risolvi la disequazione $${f(a)}${f(b)}${f(c)}${gt ? '>' : '<'}0$.`,
          options: mc(r, gt ? pos : neg, [
            [gt ? neg : pos, 'Hai scelto gli intervalli con il segno opposto: conta quanti fattori sono negativi in ogni intervallo.'],
            [R`$x<${a}\ \lor\ x>${c}$`, 'Questa è la regola del trinomio di secondo grado: con tre fattori il segno si alterna a ogni zero.'],
            [R`$x>${c}$`, 'Hai considerato solo l\'intervallo in cui tutti i fattori sono positivi: il prodotto è positivo anche quando i fattori negativi sono due.'],
          ]),
          hints: ['Studia il segno di ciascun fattore e costruisci lo schema dei segni.', R`A destra dello zero più grande tutti i fattori sono positivi; a ogni zero che attraversi il segno cambia.`],
          solution: [R`Zeri dei fattori: $x=${a}$, $x=${b}$, $x=${c}$.`, R`Segno del prodotto, da sinistra a destra: $-$ per $x<${a}$, $+$ per $${a}<x<${b}$, $-$ per $${b}<x<${c}$, $+$ per $x>${c}$.`, `Soluzione: ${gt ? pos : neg}.`],
        };
      },
    },
    {
      id: 'diseq-cubica',
      level: 2,
      title: 'Disequazione di terzo grado scomponibile',
      make: (r) => {
        const a = int(r, 1, 7), k = a * a;
        const gt = r() < 0.5;
        const pos = R`$-${a}<x<0\ \lor\ x>${a}$`, neg = R`$x<-${a}\ \lor\ 0<x<${a}$`;
        return {
          text: R`Risolvi la disequazione $x^3-${k}x${gt ? '>' : '<'}0$.`,
          options: mc(r, gt ? pos : neg, [
            [gt ? neg : pos, 'Segni invertiti: verifica con un valore di prova, per esempio un numero molto grande.'],
            [gt ? R`$x>${a}$` : R`$x<${a}$`, R`Hai diviso per $x$: non è lecito, perché $x$ può essere negativo o nullo. Bisogna raccogliere e studiare il segno.`],
            [gt ? R`$x<-${a}\ \lor\ x>${a}$` : R`$-${a}<x<${a}$`, R`Hai dimenticato il fattore $x$, che cambia segno in $x=0$.`],
          ]),
          hints: [R`Raccogli $x$ e scomponi la differenza di quadrati.`, 'Costruisci lo schema dei segni dei tre fattori.'],
          solution: [R`$x^3-${k}x=x(x-${a})(x+${a})$.`, R`Zeri: $-${a},\ 0,\ ${a}$. Il segno si alterna: $-,\ +,\ -,\ +$ da sinistra a destra.`, `Soluzione: ${gt ? pos : neg}.`],
        };
      },
    },
    {
      id: 'diseq-molteplicita',
      level: 3,
      title: 'Zero di molteplicità pari',
      make: (r) => {
        const a = int(r, -5, 3), b = int(r, a + 1, a + 5);
        const f = (z: number) => (z === 0 ? 'x' : `(x${sg(-z)})`);
        return {
          text: R`Risolvi la disequazione $${f(a)}^2${f(b)}\ge0$.`,
          options: mc(r, R`$x=${a}\ \lor\ x\ge${b}$`, [
            [R`$x\ge${b}$`, R`Hai dimenticato $x=${a}$: lì il prodotto vale $0$ e la disequazione ammette l'uguaglianza.`],
            [R`$x\ge${a}$`, R`Il quadrato non cambia segno: tra $${a}$ e $${b}$ il prodotto è negativo.`],
            [R`$x\le${a}\ \lor\ x\ge${b}$`, R`Il fattore al quadrato non fa cambiare segno al prodotto: per $x<${a}$ il prodotto è negativo.`],
          ]),
          hints: [R`Un quadrato è sempre $\ge0$: il segno del prodotto dipende solo dall'altro fattore.`, 'Non dimenticare i punti in cui il prodotto si annulla.'],
          solution: [R`$${f(a)}^2\ge0$ per ogni $x$ e si annulla per $x=${a}$.`, R`$${f(b)}\ge0$ per $x\ge${b}$.`, R`Il prodotto è $\ge0$ per $x\ge${b}$ e inoltre è nullo in $x=${a}$: soluzione $x=${a}\ \lor\ x\ge${b}$.`],
        };
      },
    },
    {
      id: 'eq-fratta',
      level: 2,
      title: 'Equazione fratta',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -6, 6, a);
        return {
          text: R`Risolvi l'equazione $\dfrac{${poly([1, -(a + b), a * b])}}{x${sg(-a)}}=0$.`,
          options: mc(r, R`$x=${b}$`, [
            [R`$x=${Math.min(a, b)}\ \lor\ x=${Math.max(a, b)}$`, R`$x=${a}$ annulla il denominatore: non è accettabile.`],
            [R`$x=${a}$`, R`Questo è proprio il valore escluso dalle condizioni di esistenza.`],
            ['Nessuna soluzione', 'Una delle due radici del numeratore è accettabile.'],
          ]),
          hints: [R`Poni le condizioni di esistenza: il denominatore deve essere diverso da zero.`, 'Una frazione è nulla quando è nullo il numeratore (e il denominatore no).'],
          solution: [R`Condizione di esistenza: $x\neq${a}$.`, R`Numeratore: $${poly([1, -(a + b), a * b])}=0$ ha radici $x=${a}$ e $x=${b}$.`, R`$x=${a}$ non è accettabile: l'unica soluzione è $x=${b}$.`],
        };
      },
    },
    {
      id: 'sis-simmetrico',
      level: 2,
      title: 'Somma e prodotto di due numeri',
      make: (r) => {
        const u = int(r, 1, 8), v = int(r, u + 1, u + 7);
        return {
          text: R`Due numeri hanno somma $${u + v}$ e prodotto $${u * v}$. Quanto vale il **maggiore** dei due?`,
          answer: v,
          tol: 0,
          hints: [R`I due numeri sono le radici di $t^2-st+p=0$.`, R`Risolvi $t^2-${u + v}t+${u * v}=0$.`],
          solution: [R`I numeri sono le radici di $t^2-${u + v}t+${u * v}=0$.`, R`$\Delta=${(u + v) ** 2}-${4 * u * v}=${(v - u) ** 2}$, quindi $t=\dfrac{${u + v}\pm${v - u}}{2}$.`, R`$t_1=${u}$, $t_2=${v}$: il maggiore è $${v}$.`],
        };
      },
    },
    {
      id: 'sis-retta-parabola',
      level: 2,
      title: 'Sistema di secondo grado',
      make: (r) => {
        const u = nz(r, -5, 5), v = nz(r, -5, 5, u, -u);
        const s = u + v, p = u * v;
        const lo = Math.min(u, v), hi = Math.max(u, v);
        const pt = (x: number) => R`(${x};\,${x * x})`;
        const retta = `${s === 0 ? '' : s === 1 ? 'x' : s === -1 ? '-x' : `${s}x`}${s === 0 ? `${-p}` : sg(-p)}`;
        return {
          text: R`Risolvi il sistema $\begin{cases}y=x^2\\ y=${retta}\end{cases}$`,
          options: mc(r, R`$${pt(lo)}$ e $${pt(hi)}$`, [
            [R`$${pt(-hi)}$ e $${pt(-lo)}$`, 'Le ascisse hanno il segno sbagliato: ricontrolla la risolvente.'],
            [R`$(${lo};\,${lo})$ e $(${hi};\,${hi})$`, R`L'ordinata si ottiene sostituendo in $y=x^2$, non è uguale all'ascissa.`],
            ['Nessuna soluzione', 'Il discriminante della risolvente è positivo.'],
          ], [R`$${pt(lo)}$ e $${pt(hi + 1)}$`]),
          hints: [R`Uguaglia le due espressioni di $y$.`, R`Risolvi l'equazione di secondo grado in $x$, poi calcola $y=x^2$.`],
          solution: [R`Uguagliando: $x^2=${retta}$, cioè $${poly([1, -s, p])}=0$.`, R`Radici: $x=${lo}$ e $x=${hi}$.`, R`Con $y=x^2$: i punti sono $${pt(lo)}$ e $${pt(hi)}$.`],
        };
      },
    },
    {
      id: 'prob-rettangolo',
      level: 2,
      title: 'Problema: lati di un rettangolo',
      make: (r) => {
        const u = int(r, 2, 9), v = int(r, u + 1, u + 8);
        return {
          text: R`Un rettangolo ha perimetro $${2 * (u + v)}$ cm e area $${u * v}\ \text{cm}^2$. Quanto misura, in cm, il lato **maggiore**?`,
          answer: v,
          tol: 0,
          hints: [R`Semiperimetro e area sono la somma e il prodotto dei lati.`, R`I lati sono le radici di $t^2-${u + v}t+${u * v}=0$.`],
          solution: [R`Detti $x,y$ i lati: $x+y=${u + v}$ e $xy=${u * v}$.`, R`$t^2-${u + v}t+${u * v}=0$ ha radici $t=${u}$ e $t=${v}$.`, R`Il lato maggiore misura $${v}$ cm.`],
        };
      },
    },
    {
      id: 'par-radice-data',
      level: 1,
      title: 'Parametro: radice assegnata',
      make: (r) => {
        const p = nz(r, -5, 5), q = nz(r, -6, 6);
        const c = p * q;
        return {
          text: R`Per quale valore di $k$ l'equazione $x^2+kx${sg(c)}=0$ ha come soluzione $x=${p}$?`,
          answer: -(p + q),
          tol: 0,
          hints: [R`Se $x=${p}$ è soluzione, sostituendola l'uguaglianza deve essere vera.`, R`Sostituisci e risolvi l'equazione di primo grado in $k$.`],
          solution: [R`Sostituiamo $x=${p}$: $${p * p}${sg(p, 'k')}${sg(c)}=0$.`, R`$${p === 1 ? '' : p === -1 ? '-' : p}k=${-(p * p + c)}$, quindi $k=${-(p + q)}$.`, R`Controllo: con $k=${-(p + q)}$ l'equazione è $${poly([1, -(p + q), c])}=0$, che ha radici $${p}$ e $${q}$ ✓`],
        };
      },
    },
    {
      id: 'par-radici-opposte',
      level: 2,
      title: 'Parametro: radici opposte',
      make: (r) => {
        const a = int(r, 2, 9), b = int(r, 1, 9);
        return {
          text: R`Per quale valore di $k$ l'equazione $x^2+(k-${a})x-${b}=0$ ha radici **opposte**?`,
          answer: a,
          tol: 0,
          hints: [R`Due numeri opposti hanno somma zero.`, R`La somma delle radici è $-\dfrac{b}{a}$: imponi che sia nulla.`],
          solution: [R`Radici opposte $\iff x_1+x_2=0$.`, R`$x_1+x_2=-(k-${a})=0\Rightarrow k=${a}$.`, R`Controllo dell'esistenza: con $k=${a}$ l'equazione diventa $x^2-${b}=0$, che ha radici reali $\pm\sqrt{${b}}$ ✓`],
        };
      },
    },
    {
      id: 'par-reali',
      level: 3,
      title: 'Parametro: radici reali distinte',
      make: (r) => {
        const n = int(r, 1, 6), sign = r() < 0.5 ? 1 : -1;
        const q = n * n;
        return {
          text: R`Per quali valori di $k$ l'equazione $x^2${sg(2 * n * sign, 'x')}+k=0$ ha due soluzioni reali **distinte**?`,
          options: mc(r, R`$k<${q}$`, [
            [R`$k>${q}$`, R`Verso invertito: da $${q}-k>0$ segue $k<${q}$.`],
            [R`$k\le${q}$`, R`Con $k=${q}$ il discriminante è nullo e le soluzioni coincidono: la richiesta è che siano distinte.`],
            [R`$k<${4 * q}$`, R`Controlla il calcolo: $\Delta=${4 * q}-4k$, e bisogna dividere per $4$.`],
          ], [R`$k>-${q}$`]),
          hints: [R`Due soluzioni reali distinte $\iff\Delta>0$.`, R`$\Delta=${4 * q}-4k$.`],
          solution: [R`$\Delta=(${2 * n * sign})^2-4k=${4 * q}-4k$.`, R`$\Delta>0\iff ${4 * q}-4k>0\iff k<${q}$.`],
        };
      },
    },
    {
      id: 'rad-somma-quadrati',
      level: 3,
      title: 'Somma dei quadrati delle radici',
      make: (r) => {
        const u = nz(r, -6, 6), v = nz(r, -6, 6, u);
        const s = u + v, p = u * v;
        return {
          text: R`Senza risolvere l'equazione $${poly([1, -s, p])}=0$, calcola la somma dei quadrati delle sue radici, $x_1^2+x_2^2$.`,
          answer: u * u + v * v,
          tol: 0,
          hints: [R`$x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2$.`, R`Somma delle radici $s=${s}$, prodotto $p=${p}$.`],
          solution: [R`$s=x_1+x_2=-\dfrac ba=${s}$ e $p=x_1x_2=\dfrac ca=${p}$.`, R`$x_1^2+x_2^2=s^2-2p=${s * s}${sg(-2 * p)}=${u * u + v * v}$.`],
        };
      },
    },
    {
      id: 'eq-segni-radici',
      level: 1,
      title: 'Segno delle radici',
      make: (r) => {
        const u = nz(r, -6, 6), v = nz(r, -6, 6, u, -u);
        const s = u + v, p = u * v;
        const good = p < 0 ? 'Discordi' : s > 0 ? 'Entrambe positive' : 'Entrambe negative';
        const all: [string, string][] = [
          ['Discordi', 'Le radici sono discordi quando il prodotto $c/a$ è negativo.'],
          ['Entrambe positive', 'Servono prodotto positivo e somma positiva.'],
          ['Entrambe negative', 'Servono prodotto positivo e somma negativa.'],
        ];
        return {
          text: R`L'equazione $${poly([1, -s, p])}=0$ ha due radici reali. Senza risolverla, stabilisci il loro segno.`,
          options: choice(r, [[good], ...all.filter(([x]) => x !== good)]),
          hints: [R`Il segno del prodotto $p=\dfrac ca$ dice se le radici sono concordi o discordi.`, R`Se sono concordi, il segno della somma $s=-\dfrac ba$ dice se sono positive o negative.`],
          solution: [R`Prodotto: $p=${p}$, ${p < 0 ? 'negativo: le radici sono discordi' : 'positivo: le radici sono concordi'}.`, p < 0 ? 'Non serve altro.' : R`Somma: $s=${s}$, ${s > 0 ? 'positiva: entrambe positive' : 'negativa: entrambe negative'}.`],
        };
      },
    },
  ],
};
