// Approfondimenti dell'unità "Funzioni e loro proprietà".
import { choice, int, mc, nz, pick, poly, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;

export const funzioniPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-fun-4',
      title: 'Funzioni definite a tratti e con valore assoluto',
      blocks: [
        { t: 'idea', md: R`Non sempre una sola formula basta a descrivere un fenomeno: una tariffa telefonica può avere un costo fino a una certa soglia e un altro oltre. Una funzione **definita a tratti** usa formule diverse su intervalli diversi del dominio. Il valore assoluto è l'esempio più importante.` },
        { t: 'def', title: 'Funzione definita a tratti', md: R`È una funzione la cui espressione cambia a seconda dell'intervallo in cui si trova $x$:
$$f(x)=\begin{cases}x+2 & \text{se } x<1\\ x^2 & \text{se } x\ge1\end{cases}$$
Per calcolare $f(x_0)$ si guarda **prima** a quale intervallo appartiene $x_0$ e poi si usa la formula corrispondente: $f(0)=0+2=2$, mentre $f(3)=3^2=9$.

Nel punto di separazione i due tratti possono **raccordarsi** (stesso valore) oppure presentare un **salto**. Qui a sinistra di $1$ la prima formula tende a $3$, mentre $f(1)=1$: c'è un salto.` },
        { t: 'def', title: 'Grafici con il valore assoluto', md: R`Dal grafico di $y=f(x)$ si ottengono:
- $y=|f(x)|$: si lascia invariata la parte **sopra** l'asse $x$ e si **ribalta** rispetto all'asse $x$ la parte che sta sotto;
- $y=f(|x|)$: si tiene la parte con $x\ge0$ e la si **riflette** rispetto all'asse $y$ (la funzione diventa pari).` },
        {
          t: 'plot',
          title: R`Da $y=x^2-c$ a $y=|x^2-c|$`,
          caption: R`La linea tratteggiata è $y=x^2-c$, quella continua è $y=|x^2-c|$. La parte negativa viene ribaltata sopra l'asse $x$. Con $c\le0$ non c'è nulla da ribaltare.`,
          view: [-4, 4, -5, 7],
          params: [{ name: 'c', label: 'c', min: -2, max: 4, step: 0.5, value: 2 }],
          draw: (p) => [
            { k: 'fn', f: (x) => x * x - p.c, dash: true },
            { k: 'fn', f: (x) => Math.abs(x * x - p.c) },
          ],
        },
        {
          t: 'ex',
          title: R`Scrivi $f(x)=|x-2|+x$ senza valore assoluto.`,
          steps: [
            R`L'argomento $x-2$ è $\ge0$ per $x\ge2$ e negativo per $x<2$.`,
            R`Per $x\ge2$: $|x-2|=x-2$, quindi $f(x)=x-2+x=2x-2$.`,
            R`Per $x<2$: $|x-2|=-(x-2)=2-x$, quindi $f(x)=2-x+x=2$.`,
            R`$f(x)=\begin{cases}2 & \text{se } x<2\\ 2x-2 & \text{se } x\ge2\end{cases}$ I due tratti si raccordano: in $x=2$ entrambi valgono $2$.`,
          ],
        },
        { t: 'warn', md: R`$|f(x)|$ e $f(|x|)$ sono funzioni diverse. Con $f(x)=x-1$: $|f(x)|=|x-1|$ ha il vertice in $x=1$, mentre $f(|x|)=|x|-1$ ha il vertice in $x=0$ e assume anche valori negativi.` },
        {
          t: 'quiz',
          q: R`Quante soluzioni ha l'equazione $|x^2-4|=4$?`,
          options: [
            { md: 'Tre', ok: true, why: R`Giusto: $x^2-4=4$ dà $x=\pm2\sqrt2$; $x^2-4=-4$ dà $x=0$.` },
            { md: 'Quattro', why: R`$x^2-4=-4$ dà $x^2=0$, cioè una sola soluzione.` },
            { md: 'Due', why: R`Va considerato anche il caso $x^2-4=-4$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-fun-5',
      title: 'Crescenza, massimi e minimi',
      blocks: [
        { t: 'idea', md: R`Leggere un grafico da sinistra a destra è come percorrere una strada: ci sono salite, discese, cime e avvallamenti. La matematica dà un nome preciso a ciascuna di queste cose, e per le funzioni quadratiche permette di trovare la cima o il fondo con un calcolo immediato.` },
        { t: 'def', title: 'Funzioni crescenti e decrescenti', md: R`Sia $I$ un intervallo contenuto nel dominio di $f$.
- $f$ è **crescente** in $I$ se, presi comunque $x_1<x_2$ in $I$, risulta $f(x_1)<f(x_2)$;
- $f$ è **decrescente** in $I$ se, presi comunque $x_1<x_2$ in $I$, risulta $f(x_1)>f(x_2)$.

Una funzione crescente (o decrescente) su tutto il dominio si dice **monotòna**. Le funzioni monotone sono iniettive, quindi invertibili sull'immagine.` },
        { t: 'def', title: 'Massimo, minimo, funzione limitata', md: R`- $M$ è il **massimo assoluto** di $f$ se $f(x)\le M$ per ogni $x$ del dominio ed esiste $x_0$ con $f(x_0)=M$. Analogamente si definisce il **minimo assoluto** $m$.
- $f$ è **limitata superiormente** se esiste un numero $k$ con $f(x)\le k$ per ogni $x$; **limitata inferiormente** se $f(x)\ge h$; **limitata** se lo è da entrambe le parti.` },
        { t: 'thm', title: 'Massimo e minimo della funzione quadratica', md: R`La funzione $f(x)=ax^2+bx+c$ assume il suo valore estremo nel vertice, cioè per $x_V=-\dfrac{b}{2a}$:
- se $a>0$ ha un **minimo** $f(x_V)$, decresce per $x<x_V$ e cresce per $x>x_V$;
- se $a<0$ ha un **massimo** $f(x_V)$, cresce per $x<x_V$ e decresce per $x>x_V$.`, proof: [
          R`Completiamo il quadrato: $ax^2+bx+c=a\left(x+\dfrac{b}{2a}\right)^2+c-\dfrac{b^2}{4a}$.`,
          R`Il quadrato è sempre $\ge0$ e si annulla solo per $x=-\dfrac{b}{2a}$.`,
          R`Se $a>0$ il primo termine è $\ge0$: il valore più piccolo di $f$ si ha quando esso è nullo. Se $a<0$ il primo termine è $\le0$: lì $f$ è massima.`,
        ] },
        {
          t: 'ex',
          title: R`Con $40$ m di rete si vuole recintare un rettangolo di area massima. Che dimensioni deve avere?`,
          steps: [
            R`Detto $x$ un lato, l'altro misura $20-x$ (il semiperimetro è $20$). Deve essere $0<x<20$.`,
            R`Area: $A(x)=x(20-x)=-x^2+20x$, funzione quadratica con $a=-1<0$: ha un massimo.`,
            R`$x_V=-\dfrac{20}{2\cdot(-1)}=10$, e $A(10)=100$.`,
            R`Il rettangolo di area massima è il **quadrato** di lato $10$ m, con area $100\ \text{m}^2$.`,
          ],
        },
        { t: 'warn', md: R`Una funzione può essere crescente su due intervalli senza esserlo sulla loro unione. $f(x)=-\dfrac1x$ è crescente per $x<0$ ed è crescente per $x>0$, ma $f(-1)=1>f(1)=-1$: non è crescente su tutto il dominio.` },
        {
          t: 'quiz',
          q: R`La funzione $f(x)=-x^2+6x-5$ ha:`,
          options: [
            { md: R`massimo $4$, assunto per $x=3$`, ok: true, why: R`Giusto: $x_V=3$ e $f(3)=-9+18-5=4$; $a<0$ quindi è un massimo.` },
            { md: R`minimo $4$, assunto per $x=3$`, why: R`Con $a<0$ la parabola ha la concavità verso il basso: il vertice è un massimo.` },
            { md: R`massimo $-5$, assunto per $x=0$`, why: R`$-5$ è il valore in $x=0$, non il valore nel vertice.` },
          ],
        },
      ],
    },
    {
      id: 'a3-fun-6',
      title: 'Funzioni come modelli: lineare, quadratica, proporzionalità',
      blocks: [
        { t: 'idea', md: R`Un **modello matematico** traduce una situazione reale in una funzione, così da poter fare previsioni e confronti. Riconoscere il tipo di funzione adatto è la parte più importante: dipende da *come varia* una grandezza al variare dell'altra.` },
        { t: 'def', title: 'Quale modello?', md: R`- **Lineare** $y=mx+q$: a incrementi uguali di $x$ corrispondono incrementi uguali di $y$. $q$ è il valore iniziale (quota fissa), $m$ la variazione per unità di $x$.
- **Proporzionalità diretta** $y=kx$: caso particolare con $q=0$; il rapporto $\dfrac yx$ è costante.
- **Proporzionalità inversa** $y=\dfrac kx$: il prodotto $xy$ è costante; raddoppiando $x$, $y$ si dimezza.
- **Quadratico** $y=ax^2+bx+c$: gli incrementi di $y$ non sono costanti, ma lo sono le loro differenze (le "differenze seconde").` },
        {
          t: 'ex',
          title: R`Due palestre: A costa $30$ € di iscrizione più $20$ € al mese; B costa $80$ € di iscrizione più $15$ € al mese. Quando conviene B?`,
          steps: [
            R`Detto $x$ il numero di mesi: $C_A(x)=30+20x$ e $C_B(x)=80+15x$.`,
            R`Le due spese sono uguali quando $30+20x=80+15x$, cioè $5x=50$, $x=10$.`,
            R`Per $x>10$ la retta di B (pendenza minore) sta sotto quella di A.`,
            R`B conviene se ci si iscrive per più di $10$ mesi; a $10$ mesi esatti le due palestre costano uguale ($230$ €).`,
          ],
        },
        {
          t: 'plot',
          title: 'Confronto fra due tariffe',
          caption: R`Le rette rappresentano il costo totale (in decine di euro) in funzione dei mesi. Il punto di intersezione è il **punto di pareggio**: cambia la quota fissa di B e osserva come si sposta.`,
          view: [0, 20, 0, 45],
          params: [{ name: 'q', label: 'quota fissa di B', min: 3, max: 14, step: 0.5, value: 8 }],
          draw: (p) => {
            const x = (p.q - 3) / 0.5;
            return [
              { k: 'fn', f: (t) => 3 + 2 * t },
              { k: 'fn', f: (t) => p.q + 1.5 * t, color: '#c0392b' },
              { k: 'pt', x, y: 3 + 2 * x, label: 'pareggio' },
            ];
          },
          readout: (p) => `Pareggio dopo $${`${(p.q - 3) / 0.5}`.replace('.', '{,}')}$ mesi.`,
        },
        {
          t: 'ex',
          title: R`Un sasso è lanciato verso l'alto: la sua quota (in metri) dopo $t$ secondi è $h(t)=-5t^2+20t$. Qual è la quota massima e quando tocca terra?`,
          steps: [
            R`È un modello quadratico con $a=-5<0$: c'è un massimo nel vertice.`,
            R`$t_V=-\dfrac{20}{2\cdot(-5)}=2$ s e $h(2)=-20+40=20$ m.`,
            R`Tocca terra quando $h(t)=0$: $-5t(t-4)=0$, cioè $t=0$ (partenza) oppure $t=4$ s.`,
            R`Quota massima $20$ m dopo $2$ s; ricade al suolo dopo $4$ s. Il modello ha senso solo per $0\le t\le4$.`,
          ],
        },
        { t: 'warn', md: R`Un modello vale solo entro certi limiti: va sempre indicato il **dominio del problema** (tempi non negativi, lunghezze positive, quantità intere…), che di solito è più piccolo del dominio matematico della funzione.` },
        {
          t: 'quiz',
          q: R`Un rubinetto riempie una vasca in $6$ ore. Quante ore impiegano $3$ rubinetti uguali?`,
          options: [
            { md: R`$2$ ore`, ok: true, why: R`Proporzionalità inversa: il prodotto (rubinetti × ore) è costante, $1\cdot6=3\cdot2$.` },
            { md: R`$18$ ore`, why: R`Con più rubinetti il tempo diminuisce: è una proporzionalità inversa, non diretta.` },
            { md: R`$3$ ore`, why: R`Il tempo si divide per $3$, non si sottrae $3$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'fun-tratti-valore',
      level: 1,
      title: 'Funzione a tratti: valore',
      make: (r) => {
        const a = nz(r, -3, 3), b = int(r, -5, 5), c = int(r, -2, 2), d = int(r, -4, 4);
        const left = r() < 0.5;
        const t = left ? c - int(r, 1, 4) : c + int(r, 0, 3);
        const val = left ? a * t + b : t * t + d;
        return {
          text: R`Data $f(x)=\begin{cases}${poly([a, b])} & \text{se } x<${c}\\ ${poly([1, 0, d])} & \text{se } x\ge${c}\end{cases}$ calcola $f(${t})$.`,
          answer: val,
          tol: 0,
          hints: [R`Stabilisci prima se $${t}<${c}$ oppure $${t}\ge${c}$.`, `Usa la ${left ? 'prima' : 'seconda'} espressione.`],
          solution: [R`Poiché $${t}${left ? '<' : R`\ge`}${c}$ si usa la ${left ? 'prima' : 'seconda'} espressione.`, left ? R`$f(${t})=${a}\cdot(${t})${sg(b)}=${val}$.` : R`$f(${t})=(${t})^2${sg(d)}=${val}$.`],
        };
      },
    },
    {
      id: 'fun-tratti-raccordo',
      level: 3,
      title: 'Funzione a tratti: raccordo',
      make: (r) => {
        const a = nz(r, -3, 3), c = nz(r, -3, 3);
        const k = c * c - a * c;
        const ax = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
        return {
          text: R`Per quale valore di $k$ i due tratti di $f(x)=\begin{cases}${ax}+k & \text{se } x<${c}\\ x^2 & \text{se } x\ge${c}\end{cases}$ si raccordano, cioè il grafico non presenta salti?`,
          answer: k,
          tol: 0,
          hints: [R`Le due espressioni devono dare lo stesso valore in $x=${c}$.`, R`Imponi $${a}\cdot(${c})+k=(${c})^2$.`],
          solution: [R`In $x=${c}$ il secondo tratto vale $(${c})^2=${c * c}$.`, R`Il primo tratto, calcolato in $x=${c}$, vale $${a * c}+k$.`, R`$${a * c}+k=${c * c}\Rightarrow k=${k}$.`],
        };
      },
    },
    {
      id: 'fun-abs-soluzioni',
      level: 2,
      title: 'Equazione con valore assoluto: numero di soluzioni',
      make: (r) => {
        const a = int(r, 2, 5), A = a * a;
        const kind = pick(r, [4, 3, 2] as const);
        const h = kind === 4 ? int(r, 1, A - 1) : kind === 3 ? A : A + int(r, 1, 9);
        const names: Record<number, string> = { 2: 'Due', 3: 'Tre', 4: 'Quattro' };
        const others = ([2, 3, 4] as const).filter((n) => n !== kind);
        return {
          text: R`Quante soluzioni reali ha l'equazione $|x^2-${A}|=${h}$?`,
          options: choice(r, [
            [names[kind]],
            [names[others[0]], R`Considera separatamente $x^2-${A}=${h}$ e $x^2-${A}=-${h}$ e conta le soluzioni di ciascuna.`],
            [names[others[1]], R`Ricorda che $x^2=k$ ha due soluzioni se $k>0$, una se $k=0$, nessuna se $k<0$.`],
            ['Nessuna', R`Il secondo membro è positivo: l'equazione $|A|=k$ con $k>0$ equivale a $A=\pm k$.`],
          ]),
          hints: [R`$|A|=k$ con $k>0$ equivale a $A=k\ \lor\ A=-k$.`, R`Risolvi $x^2=${A + h}$ e $x^2=${A - h}$.`],
          solution: [R`$x^2-${A}=${h}\Rightarrow x^2=${A + h}$: due soluzioni.`, R`$x^2-${A}=-${h}\Rightarrow x^2=${A - h}$: ${A - h > 0 ? 'due soluzioni' : A - h === 0 ? 'una soluzione ($x=0$)' : 'nessuna soluzione'}.`, `In tutto: ${names[kind].toLowerCase()} soluzioni.`],
        };
      },
    },
    {
      id: 'fun-abs-grafico',
      level: 2,
      title: 'Trasformazioni con valore assoluto e simmetrie',
      make: (r) => {
        const items: [string, string][] = [
          ['y=|f(x)|', 'Si ribalta rispetto all\'asse $x$ la parte di grafico che sta sotto l\'asse $x$'],
          ['y=f(|x|)', 'Si tiene la parte con $x\\ge0$ e la si riflette rispetto all\'asse $y$'],
          ['y=-f(x)', 'Si ribalta tutto il grafico rispetto all\'asse $x$'],
          ['y=f(-x)', 'Si ribalta tutto il grafico rispetto all\'asse $y$'],
        ];
        const i = int(r, 0, 3);
        return {
          text: R`Come si ottiene il grafico di $${items[i][0]}$ a partire da quello di $y=f(x)$?`,
          options: choice(r, [[items[i][1]], ...items.filter((_, j) => j !== i).map(([f, d]): [string, string] => [d, `Questa è la costruzione del grafico di $${f}$.`])]),
          hints: ['Chiediti quale variabile viene modificata: la $x$ (prima di applicare $f$) o la $y$ (dopo).', 'Un cambiamento sul risultato agisce in verticale; un cambiamento sull\'argomento agisce in orizzontale.'],
          solution: [`${items[i][1]}.`],
        };
      },
    },
    {
      id: 'fun-max-quadratica',
      level: 2,
      title: 'Massimo di una funzione quadratica',
      make: (r) => {
        const p = nz(r, -5, 5), q = int(r, -6, 6);
        return {
          text: R`Qual è il valore **massimo** della funzione $f(x)=${poly([-1, 2 * p, q])}$?`,
          answer: p * p + q,
          tol: 0,
          hints: [R`Il massimo si ha nel vertice: $x_V=-\dfrac{b}{2a}$.`, R`$x_V=${p}$: calcola $f(${p})$.`],
          solution: [R`$a=-1<0$: la funzione ha un massimo nel vertice.`, R`$x_V=-\dfrac{${2 * p}}{2\cdot(-1)}=${p}$.`, R`$f(${p})=-${p * p}+${2 * p * p}${sg(q)}=${p * p + q}$.`],
        };
      },
    },
    {
      id: 'fun-crescente',
      level: 2,
      title: 'Intervallo di crescenza',
      make: (r) => {
        const p = nz(r, -6, 6), q = int(r, -5, 5), up = r() < 0.5;
        const s = up ? 1 : -1;
        const good = up ? R`$x>${p}$` : R`$x<${p}$`;
        return {
          text: R`In quale intervallo la funzione $f(x)=${poly([s, -2 * p * s, q])}$ è **crescente**?`,
          options: mc(r, good, [
            [up ? R`$x<${p}$` : R`$x>${p}$`, `Qui la funzione è decrescente: la concavità è rivolta verso ${up ? "l'alto" : 'il basso'}.`],
            [up ? R`$x>${-p}$` : R`$x<${-p}$`, R`Attenzione al segno dell'ascissa del vertice: $x_V=-\dfrac{b}{2a}$.`],
            [up ? R`$x<${-p}$` : R`$x>${-p}$`, 'Sono sbagliati sia il segno del vertice sia il verso.'],
          ]),
          hints: [R`Trova l'ascissa del vertice $x_V=-\dfrac{b}{2a}$.`, `La concavità è rivolta verso ${up ? "l'alto: la funzione cresce a destra del vertice" : 'il basso: la funzione cresce a sinistra del vertice'}.`],
          solution: [R`$x_V=-\dfrac{b}{2a}=${p}$.`, R`$a=${s}$: la parabola ha la concavità verso ${up ? "l'alto" : 'il basso'}, quindi $f$ è crescente per ${good}.`],
        };
      },
    },
    {
      id: 'fun-immagine',
      level: 2,
      title: 'Immagine di una funzione quadratica',
      make: (r) => {
        const p = nz(r, -4, 4), c = int(r, -5, 8);
        const min = c - p * p;
        return {
          text: R`Qual è l'immagine (insieme dei valori assunti) della funzione $f(x)=${poly([1, -2 * p, c])}$?`,
          options: mc(r, R`$y\ge${min}$`, [
            [R`$y\ge${c}$`, R`$${c}$ è il valore in $x=0$, non il minimo: il minimo si trova nel vertice.`],
            [R`$y\le${min}$`, 'La concavità è verso l\'alto: il vertice è un minimo, e la funzione assume tutti i valori maggiori.'],
            ['Tutti i numeri reali', 'Una funzione quadratica ha un minimo (o un massimo): non può assumere tutti i valori reali.'],
          ]),
          hints: [R`Calcola l'ordinata del vertice.`, R`$x_V=${p}$.`],
          solution: [R`$x_V=${p}$ e $f(${p})=${p * p}-${2 * p * p}${sg(c)}=${min}$.`, R`Poiché $a>0$ il vertice è il punto di minimo: l'immagine è $y\ge${min}$.`],
        };
      },
    },
    {
      id: 'fun-ottimizzazione',
      level: 3,
      title: 'Problema di massimo',
      make: (r) => {
        const n = int(r, 2, 12);
        return {
          text: R`Con $${4 * n}$ m di rete si recinta un orto rettangolare appoggiato a un muro: la rete serve solo per **tre** lati. Qual è, in $\text{m}^2$, l'area massima che si può recintare?`,
          answer: 2 * n * n,
          tol: 0,
          hints: [R`Chiama $x$ ciascuno dei due lati perpendicolari al muro: il lato parallelo misura $${4 * n}-2x$.`, R`Area $A(x)=x(${4 * n}-2x)$: cerca il vertice della parabola.`],
          solution: [R`$A(x)=x(${4 * n}-2x)=-2x^2+${4 * n}x$, con $0<x<${2 * n}$.`, R`$x_V=-\dfrac{${4 * n}}{2\cdot(-2)}=${n}$.`, R`$A(${n})=${n}\cdot${2 * n}=${2 * n * n}\ \text{m}^2$ (lati di $${n}$ m e $${2 * n}$ m).`],
        };
      },
    },
    {
      id: 'fun-tariffe',
      level: 2,
      title: 'Modello lineare: punto di pareggio',
      make: (r) => {
        const c2 = int(r, 1, 3), d = int(r, 1, 3), c1 = c2 + d, n = int(r, 4, 20), f1 = int(r, 2, 15), f2 = f1 + d * n;
        return {
          text: R`Un noleggio propone due tariffe. Tariffa A: $${f1}$ € fissi più $${c1}$ € all'ora. Tariffa B: $${f2}$ € fissi più $${c2}$ € all'ora. Dopo quante ore le due tariffe costano uguale?`,
          answer: n,
          tol: 0,
          hints: [R`Scrivi le due funzioni di costo: $C_A(x)=${f1}+${c1}x$ e $C_B(x)=${f2}+${c2}x$.`, 'Uguagliale e risolvi.'],
          solution: [R`$${f1}+${c1}x=${f2}+${c2}x$.`, R`$${d}x=${f2 - f1}\Rightarrow x=${n}$.`, R`Dopo $${n}$ ore entrambe costano $${f1 + c1 * n}$ €; oltre, conviene la tariffa B.`],
        };
      },
    },
    {
      id: 'fun-inversa-prop',
      level: 1,
      title: 'Proporzionalità inversa',
      make: (r) => {
        const y2 = int(r, 2, 9), f = int(r, 2, 4), x1 = int(r, 2, 6), x2 = x1 * f, y1 = y2 * f;
        return {
          text: R`Due grandezze $x$ e $y$ sono **inversamente** proporzionali. Se per $x=${x1}$ si ha $y=${y1}$, quanto vale $y$ per $x=${x2}$?`,
          answer: y2,
          tol: 0,
          hints: [R`Nella proporzionalità inversa il prodotto $xy$ è costante.`, R`$k=${x1}\cdot${y1}=${x1 * y1}$.`],
          solution: [R`$xy=k$ con $k=${x1}\cdot${y1}=${x1 * y1}$.`, R`Per $x=${x2}$: $y=\dfrac{${x1 * y1}}{${x2}}=${y2}$.`],
        };
      },
    },
  ],
};
