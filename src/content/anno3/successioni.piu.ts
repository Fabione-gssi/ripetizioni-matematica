// Approfondimenti dell'unità "Successioni e progressioni".
import { choice, frac, int, mc, nz, sg } from '../../lib/gen';
import type { Shape, UnitExtra } from '../../lib/types';

const R = String.raw;

export const successioniPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-suc-4',
      title: 'Il principio di induzione',
      blocks: [
        { t: 'idea', md: R`Immagina una fila infinita di tessere del domino. Per essere certo che cadano **tutte** bastano due cose: che cada la prima, e che ogni tessera, cadendo, faccia cadere la successiva. Il principio di induzione è questo ragionamento applicato alle affermazioni che dipendono da un numero naturale $n$.` },
        { t: 'def', title: 'Principio di induzione', md: R`Sia $P(n)$ una proprietà che dipende da $n\in\mathbb N$. Se
1. **(base)** $P(n_0)$ è vera per un certo valore iniziale $n_0$ (di solito $0$ o $1$);
2. **(passo induttivo)** per ogni $n\ge n_0$, dall'ipotesi che $P(n)$ sia vera segue che è vera $P(n+1)$;

allora $P(n)$ è vera **per ogni** $n\ge n_0$.

Nel passo induttivo l'affermazione $P(n)$ si chiama **ipotesi induttiva**: non la si dimostra, la si *suppone* vera per dimostrare $P(n+1)$.` },
        {
          t: 'thm',
          title: 'Somma dei primi n numeri naturali',
          md: R`Per ogni $n\ge1$: $\ 1+2+3+\dots+n=\dfrac{n(n+1)}{2}$.`,
          proof: [
            R`**Base** ($n=1$): il primo membro vale $1$, il secondo $\dfrac{1\cdot2}{2}=1$. Vera.`,
            R`**Ipotesi induttiva:** supponiamo che $1+2+\dots+n=\dfrac{n(n+1)}{2}$ per un certo $n$.`,
            R`**Tesi:** dobbiamo dimostrare che $1+2+\dots+n+(n+1)=\dfrac{(n+1)(n+2)}{2}$.`,
            R`Aggiungiamo $(n+1)$ a entrambi i membri dell'ipotesi: $1+\dots+n+(n+1)=\dfrac{n(n+1)}{2}+(n+1)$.`,
            R`Raccogliamo $(n+1)$: $(n+1)\left(\dfrac n2+1\right)=\dfrac{(n+1)(n+2)}{2}$. È la tesi: la formula vale per ogni $n\ge1$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Dimostra che $1+3+5+\dots+(2n-1)=n^2$ per ogni $n\ge1$.`,
          steps: [
            R`**Base:** per $n=1$ il primo membro è $1$ e il secondo $1^2=1$. Vera.`,
            R`**Ipotesi induttiva:** $1+3+\dots+(2n-1)=n^2$.`,
            R`Il termine successivo della somma è $2(n+1)-1=2n+1$. Aggiungiamolo: $1+3+\dots+(2n-1)+(2n+1)=n^2+2n+1$.`,
            R`$n^2+2n+1=(n+1)^2$: è la formula scritta per $n+1$. Dimostrato.`,
          ],
        },
        {
          t: 'ex',
          title: R`Dimostra che $2^n>n$ per ogni $n\ge1$.`,
          steps: [
            R`**Base:** $2^1=2>1$. Vera.`,
            R`**Ipotesi induttiva:** $2^n>n$.`,
            R`$2^{n+1}=2\cdot2^n>2n$ per l'ipotesi induttiva.`,
            R`Poiché $n\ge1$, si ha $2n=n+n\ge n+1$. Dunque $2^{n+1}>n+1$: è la tesi.`,
          ],
        },
        { t: 'warn', md: R`Servono **entrambe** le parti. Senza la base, il passo induttivo non prova nulla: l'affermazione "$n=n+1$" supera il passo induttivo (se $n=n+1$ allora $n+1=n+2$) ma è falsa per ogni $n$, perché non c'è nessun valore iniziale per cui sia vera.` },
        {
          t: 'quiz',
          q: R`Nel passo induttivo della dimostrazione di $1+2+\dots+n=\dfrac{n(n+1)}2$, che cosa si suppone vero?`,
          options: [
            { md: R`La formula per un generico $n$`, ok: true, why: 'Esatto: è l\'ipotesi induttiva, da cui si ricava la formula per $n+1$.' },
            { md: R`La formula per $n+1$`, why: 'Questa è la tesi del passo induttivo: va dimostrata, non supposta.' },
            { md: R`La formula per tutti i numeri naturali`, why: 'È ciò che si vuole concludere alla fine: supporlo sarebbe un circolo vizioso.' },
          ],
        },
      ],
    },
    {
      id: 'a3-suc-5',
      title: 'Successioni monotone e limitate',
      blocks: [
        { t: 'idea', md: R`Di una successione interessa spesso l'**andamento**: i termini crescono sempre? Possono diventare grandi quanto si vuole, oppure restano sotto una certa soglia? Sono le stesse domande che ci si pone per le funzioni, ma qui la variabile assume solo valori naturali.` },
        { t: 'def', title: 'Monotonia', md: R`Una successione $a_n$ è
- **crescente** se $a_{n+1}>a_n$ per ogni $n$;
- **decrescente** se $a_{n+1}<a_n$ per ogni $n$;
- **costante** se $a_{n+1}=a_n$ per ogni $n$.

Per stabilirlo si studia il segno della differenza $a_{n+1}-a_n$ oppure, se i termini sono tutti positivi, si confronta il rapporto $\dfrac{a_{n+1}}{a_n}$ con $1$.` },
        { t: 'def', title: 'Successioni limitate', md: R`$a_n$ è **limitata superiormente** se esiste $M$ tale che $a_n\le M$ per ogni $n$; **limitata inferiormente** se esiste $m$ tale che $a_n\ge m$; **limitata** se valgono entrambe.

Esempi: $a_n=n^2$ è limitata inferiormente ma non superiormente; $a_n=(-1)^n$ è limitata ma non monotona; $a_n=\dfrac1n$ è decrescente e limitata ($0<a_n\le1$).` },
        {
          t: 'ex',
          title: R`Studia la successione $a_n=\dfrac{n}{n+1}$.`,
          steps: [
            R`Primi termini: $\dfrac12,\ \dfrac23,\ \dfrac34,\ \dfrac45,\dots$ Sembrano crescere avvicinandosi a $1$.`,
            R`Monotonia: $a_{n+1}-a_n=\dfrac{n+1}{n+2}-\dfrac{n}{n+1}=\dfrac{(n+1)^2-n(n+2)}{(n+1)(n+2)}=\dfrac{1}{(n+1)(n+2)}>0$. È crescente.`,
            R`Limitatezza: $a_n=1-\dfrac1{n+1}<1$ e $a_n\ge a_1=\dfrac12$. È limitata.`,
            R`Al crescere di $n$ la quantità $\dfrac1{n+1}$ diventa piccola quanto si vuole: i termini si avvicinano a $1$ senza mai raggiungerlo.`,
          ],
        },
        {
          t: 'plot',
          title: R`I termini di $a_n=\dfrac{n}{n+k}$`,
          caption: R`Ogni punto ha ascissa $n$ e ordinata $a_n$. La successione è crescente e limitata: i punti si avvicinano alla retta tratteggiata $y=1$. Aumenta $k$ per vedere che l'avvicinamento diventa più lento.`,
          view: [0, 16, 0, 1.3],
          params: [{ name: 'k', label: 'k', min: 1, max: 8, step: 1, value: 1 }],
          draw: (p) => {
            const pts: Shape[] = [];
            for (let n = 1; n <= 15; n++) pts.push({ k: 'pt', x: n, y: n / (n + p.k) });
            return [{ k: 'fn', f: () => 1, dash: true }, ...pts];
          },
        },
        { t: 'thm', title: 'Monotonia delle progressioni', md: R`- Una progressione **aritmetica** di ragione $d$ è crescente se $d>0$, decrescente se $d<0$, costante se $d=0$; se $d\neq0$ non è limitata.
- Una progressione **geometrica** con $a_1>0$ è crescente se $q>1$, decrescente se $0<q<1$, costante se $q=1$. Se $q<0$ i termini hanno segni alterni: non è monotona.` },
        {
          t: 'quiz',
          q: R`La successione $a_n=\dfrac{(-1)^n}{n}$ è:`,
          options: [
            { md: 'limitata ma non monotona', ok: true, why: R`Giusto: i termini $-1,\ \tfrac12,\ -\tfrac13,\dots$ oscillano, restando tra $-1$ e $\tfrac12$.` },
            { md: 'decrescente e limitata', why: R`$a_1=-1<a_2=\tfrac12$: non è decrescente.` },
            { md: 'crescente e non limitata', why: R`$a_2=\tfrac12>a_3=-\tfrac13$: non è crescente; e tutti i termini stanno tra $-1$ e $1$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-suc-6',
      title: 'Applicazioni delle progressioni',
      blocks: [
        { t: 'idea', md: R`Le progressioni compaiono ogni volta che una grandezza varia "a passi regolari": di una quantità fissa (aritmetica) o di una percentuale fissa (geometrica). Rate, interessi, dimezzamenti, numeri periodici: sono tutti problemi sulle progressioni.` },
        { t: 'def', title: 'Medie e inserimento di medi', md: R`- In una progressione **aritmetica** ogni termine è la **media aritmetica** del precedente e del successivo: $a_n=\dfrac{a_{n-1}+a_{n+1}}{2}$.
- In una progressione **geometrica** a termini positivi ogni termine è la **media geometrica** dei due vicini: $a_n=\sqrt{a_{n-1}\cdot a_{n+1}}$.

**Inserire $k$ medi** tra due numeri $a$ e $b$ significa costruire una progressione di $k+2$ termini che inizia con $a$ e finisce con $b$:
- medi aritmetici: $d=\dfrac{b-a}{k+1}$;
- medi geometrici: $q^{k+1}=\dfrac ba$.` },
        {
          t: 'ex',
          title: R`Inserisci tre medi aritmetici tra $5$ e $21$.`,
          steps: [
            R`La progressione ha $3+2=5$ termini: $a_1=5$ e $a_5=21$.`,
            R`$a_5=a_1+4d\Rightarrow 21=5+4d\Rightarrow d=4$.`,
            R`I tre medi sono $9,\ 13,\ 17$. Progressione: $5,\ 9,\ 13,\ 17,\ 21$.`,
          ],
        },
        { t: 'thm', title: 'Somma di infiniti termini di una progressione geometrica', md: R`Se $|q|<1$, la somma $S_n=a_1\dfrac{1-q^n}{1-q}$ si avvicina, al crescere di $n$, al valore
$$S=\dfrac{a_1}{1-q}$$
che si chiama **somma della serie geometrica**.`, proof: [
          R`Per $|q|<1$ le potenze $q^n$ diventano sempre più piccole in valore assoluto: per esempio $\left(\tfrac12\right)^{10}\approx0{,}001$.`,
          R`Quindi nella formula $S_n=a_1\dfrac{1-q^n}{1-q}$ il termine $q^n$ diventa trascurabile al crescere di $n$.`,
          R`La somma si avvicina quanto si vuole a $\dfrac{a_1}{1-q}$. (La nozione precisa di "avvicinarsi" è il limite, che si studia in quinta.)`,
        ] },
        {
          t: 'ex',
          title: R`Scrivi $0{,}\overline{3}$ come frazione usando la serie geometrica.`,
          steps: [
            R`$0{,}333\dots=\dfrac{3}{10}+\dfrac{3}{100}+\dfrac{3}{1000}+\dots$`,
            R`È la somma degli infiniti termini di una progressione geometrica con $a_1=\dfrac3{10}$ e $q=\dfrac1{10}$.`,
            R`$S=\dfrac{a_1}{1-q}=\dfrac{3/10}{9/10}=\dfrac39=\dfrac13$.`,
          ],
        },
        { t: 'def', title: 'Interesse semplice e composto', md: R`Un capitale $C$ è investito al tasso annuo $i$ (per esempio $i=0{,}03$ per il $3\%$).
- **Interesse semplice:** ogni anno si aggiunge la stessa quantità $C\cdot i$. I montanti formano una progressione **aritmetica**: $M_n=C(1+n\,i)$.
- **Interesse composto:** ogni anno il montante viene moltiplicato per $(1+i)$. I montanti formano una progressione **geometrica**: $M_n=C(1+i)^n$.` },
        { t: 'warn', md: R`La formula $S=\dfrac{a_1}{1-q}$ vale **solo** se $|q|<1$. Con $q=2$ la somma $1+2+4+8+\dots$ cresce senza limite, anche se la formula darebbe il valore assurdo $-1$.` },
        {
          t: 'quiz',
          q: R`Quanto vale $1+\dfrac12+\dfrac14+\dfrac18+\dots$?`,
          options: [
            { md: R`$2$`, ok: true, why: R`Giusto: $a_1=1$, $q=\tfrac12$, $S=\dfrac{1}{1-\frac12}=2$.` },
            { md: R`$1$`, why: R`$1$ è la somma di $\tfrac12+\tfrac14+\tfrac18+\dots$, senza il primo termine.` },
            { md: 'La somma cresce senza limite', why: R`Con $|q|<1$ i termini diventano così piccoli che la somma resta limitata.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'ind-somma',
      level: 1,
      title: 'Somma dei primi n naturali',
      make: (r) => {
        const n = int(r, 10, 60);
        return {
          text: R`Calcola la somma $1+2+3+\dots+${n}$.`,
          answer: (n * (n + 1)) / 2,
          tol: 0,
          hints: [R`Usa la formula $1+2+\dots+n=\dfrac{n(n+1)}{2}$.`],
          solution: [R`$\dfrac{${n}\cdot${n + 1}}{2}=${(n * (n + 1)) / 2}$.`],
        };
      },
    },
    {
      id: 'ind-dispari',
      level: 2,
      title: 'Somma dei numeri dispari',
      make: (r) => {
        const n = int(r, 6, 30);
        return {
          text: R`Calcola la somma dei numeri dispari $1+3+5+\dots+${2 * n - 1}$.`,
          answer: n * n,
          tol: 0,
          hints: [R`La somma dei primi $n$ numeri dispari è $n^2$.`, R`L'ultimo addendo è $2n-1=${2 * n - 1}$: ricava $n$.`],
          solution: [R`$2n-1=${2 * n - 1}\Rightarrow n=${n}$: gli addendi sono $${n}$.`, R`Somma $=n^2=${n * n}$.`],
        };
      },
    },
    {
      id: 'ind-passo',
      level: 3,
      title: 'Il passo induttivo',
      make: (r) => {
        const items: [string, string][] = [
          [R`1+2+\dots+n=\dfrac{n(n+1)}{2}`, R`$n+1$`],
          [R`1+3+\dots+(2n-1)=n^2`, R`$2n+1$`],
          [R`1+2+4+\dots+2^{n-1}=2^n-1`, R`$2^n$`],
          [R`2+4+\dots+2n=n(n+1)`, R`$2n+2$`],
        ];
        const i = int(r, 0, 3);
        return {
          text: R`Si vuole dimostrare per induzione che $${items[i][0]}$. Nel passo induttivo, quale termine si aggiunge a entrambi i membri dell'ipotesi induttiva per ottenere la somma relativa a $n+1$?`,
          options: choice(r, [[items[i][1]], ...items.filter((_, j) => j !== i).map(([, t]): [string, string] => [t, 'Scrivi l\'ultimo addendo della somma sostituendo $n+1$ al posto di $n$.'])]),
          hints: ['Guarda l\'ultimo addendo della somma: è scritto in funzione di $n$.', 'Sostituisci $n+1$ al posto di $n$ in quell\'addendo.'],
          solution: [`L'addendo successivo si ottiene scrivendo l'ultimo termine della somma per $n+1$: è ${items[i][1]}.`],
        };
      },
    },
    {
      id: 'suc-monotona',
      level: 2,
      title: 'Monotonia di una successione',
      make: (r) => {
        const a = int(r, 1, 9), b = nz(r, 1, 9, a);
        const up = a < b;
        return {
          text: R`La successione $a_n=\dfrac{n+${a}}{n+${b}}$, con $n\ge1$, è:`,
          options: choice(r, [
            [up ? 'crescente' : 'decrescente', R`Corretto: $a_n=1${sg(a - b)}\cdot\dfrac{1}{n+${b}}$.`],
            [up ? 'decrescente' : 'crescente', R`Scrivi $a_n=1+\dfrac{${a - b}}{n+${b}}$ e osserva come varia la frazione al crescere di $n$.`],
            ['costante', R`I termini cambiano: confronta $a_1$ e $a_2$.`],
            ['né crescente né decrescente', 'Calcola qualche termine: l\'andamento è sempre lo stesso.'],
          ]),
          hints: [R`Calcola i primi termini, oppure scrivi $a_n=1+\dfrac{${a - b}}{n+${b}}$.`, R`Al crescere di $n$ la frazione $\dfrac{1}{n+${b}}$ diminuisce.`],
          solution: [R`$a_n=\dfrac{n+${b}${sg(a - b)}}{n+${b}}=1${sg(a - b)}\cdot\dfrac{1}{n+${b}}$.`, R`$\dfrac1{n+${b}}$ decresce al crescere di $n$; essendo moltiplicata per un numero ${up ? 'negativo' : 'positivo'}, la successione è ${up ? 'crescente' : 'decrescente'}.`],
        };
      },
    },
    {
      id: 'suc-tendenza',
      level: 2,
      title: 'Andamento per n grande',
      make: (r) => {
        const p = int(r, 2, 9), q = int(r, 1, 9), s = int(r, 1, 9);
        return {
          text: R`A quale numero si avvicinano i termini della successione $a_n=\dfrac{${p}n+${q}}{n+${s}}$ quando $n$ diventa molto grande?`,
          answer: p,
          tol: 0,
          hints: [R`Dividi numeratore e denominatore per $n$.`, R`Le quantità $\dfrac{${q}}{n}$ e $\dfrac{${s}}{n}$ diventano trascurabili.`],
          solution: [R`$a_n=\dfrac{${p}+\frac{${q}}{n}}{1+\frac{${s}}{n}}$.`, R`Per $n$ molto grande le frazioni con $n$ al denominatore sono trascurabili: $a_n$ si avvicina a $\dfrac{${p}}{1}=${p}$.`],
        };
      },
    },
    {
      id: 'ar-media',
      level: 1,
      title: 'Termine medio aritmetico',
      make: (r) => {
        const x = int(r, -10, 20), d = nz(r, -8, 8);
        return {
          text: R`I numeri $${x - d},\ x,\ ${x + d}$ sono tre termini consecutivi di una progressione aritmetica. Quanto vale $x$?`,
          answer: x,
          tol: 0,
          hints: ['In una progressione aritmetica ogni termine è la media aritmetica dei due vicini.'],
          solution: [R`$x=\dfrac{${x - d}+(${x + d})}{2}=\dfrac{${2 * x}}{2}=${x}$.`],
        };
      },
    },
    {
      id: 'ge-media',
      level: 2,
      title: 'Termine medio geometrico',
      make: (r) => {
        const t = int(r, 1, 6), q = int(r, 2, 5);
        return {
          text: R`I numeri $${t},\ x,\ ${t * q * q}$ sono tre termini consecutivi di una progressione geometrica a termini positivi. Quanto vale $x$?`,
          answer: t * q,
          tol: 0,
          hints: ['In una progressione geometrica a termini positivi ogni termine è la media geometrica dei due vicini.', R`$x=\sqrt{${t}\cdot${t * q * q}}$.`],
          solution: [R`$x^2=${t}\cdot${t * q * q}=${t * t * q * q}$.`, R`$x=\sqrt{${t * t * q * q}}=${t * q}$ (la ragione è $${q}$).`],
        };
      },
    },
    {
      id: 'ar-medi',
      level: 2,
      title: 'Inserire medi aritmetici',
      make: (r) => {
        const k = int(r, 2, 6), d = nz(r, -6, 9), a = int(r, -10, 15), b = a + (k + 1) * d;
        return {
          text: R`Si inseriscono $${k}$ medi aritmetici tra $${a}$ e $${b}$. Qual è la ragione della progressione ottenuta?`,
          answer: d,
          tol: 0,
          hints: [R`La progressione ha $${k}+2=${k + 2}$ termini: $a_1=${a}$ e $a_{${k + 2}}=${b}$.`, R`$a_{${k + 2}}=a_1+${k + 1}d$.`],
          solution: [R`$${b}=${a}+${k + 1}d$.`, R`$d=\dfrac{${b}-(${a})}{${k + 1}}=\dfrac{${b - a}}{${k + 1}}=${d}$.`],
        };
      },
    },
    {
      id: 'ge-medi',
      level: 3,
      title: 'Inserire medi geometrici',
      make: (r) => {
        const k = int(r, 1, 3), q = int(r, 2, 3), a = int(r, 1, 5), b = a * q ** (k + 1);
        return {
          text: R`Si inseriscono $${k}$ medi geometrici positivi tra $${a}$ e $${b}$. Quanto vale il **primo** dei medi inseriti?`,
          answer: a * q,
          tol: 0,
          hints: [R`La progressione ha $${k + 2}$ termini: $a_{${k + 2}}=a_1\cdot q^{${k + 1}}$.`, R`$q^{${k + 1}}=\dfrac{${b}}{${a}}=${b / a}$.`],
          solution: [R`$${b}=${a}\cdot q^{${k + 1}}\Rightarrow q^{${k + 1}}=${b / a}\Rightarrow q=${q}$.`, R`Il primo medio è $a_2=${a}\cdot${q}=${a * q}$.`],
        };
      },
    },
    {
      id: 'ge-serie',
      level: 3,
      title: 'Somma di infiniti termini',
      make: (r) => {
        const k = int(r, 2, 6), t = int(r, 1, 6), a = (k - 1) * t;
        return {
          text: R`Una progressione geometrica ha primo termine $a_1=${a}$ e ragione $q=\dfrac{1}{${k}}$. Quanto vale la somma di **tutti** i suoi infiniti termini?`,
          answer: k * t,
          tol: 0,
          hints: [R`Poiché $|q|<1$ si può usare $S=\dfrac{a_1}{1-q}$.`, R`$1-q=${frac(k - 1, k)}$.`],
          solution: [R`$S=\dfrac{a_1}{1-q}=\dfrac{${a}}{1-\frac{1}{${k}}}=\dfrac{${a}}{\frac{${k - 1}}{${k}}}$.`, R`$S=${a}\cdot\dfrac{${k}}{${k - 1}}=${k * t}$.`],
        };
      },
    },
    {
      id: 'ge-periodico',
      level: 2,
      title: 'Numero periodico come serie geometrica',
      make: (r) => {
        const d = int(r, 1, 8);
        return {
          text: R`Il numero periodico $0{,}\overline{${d}}=0{,}${d}${d}${d}\dots$ è la somma degli infiniti termini di una progressione geometrica. A quale frazione è uguale?`,
          options: mc(r, `$${frac(d, 9)}$`, [
            [`$${frac(d, 10)}$`, R`Questo è solo il primo termine della progressione, cioè $0{,}${d}$.`],
            [`$${frac(d, 99)}$`, R`Il denominatore $99$ si usa quando il periodo ha due cifre.`],
            [`$${frac(d, 90)}$`, R`Il denominatore $90$ compare quando c'è un antiperiodo di una cifra.`],
          ]),
          hints: [R`$0{,}\overline{${d}}=\dfrac{${d}}{10}+\dfrac{${d}}{100}+\dots$: $a_1=\dfrac{${d}}{10}$, $q=\dfrac1{10}$.`, R`$S=\dfrac{a_1}{1-q}$.`],
          solution: [R`$a_1=\dfrac{${d}}{10}$, $q=\dfrac{1}{10}$.`, R`$S=\dfrac{${d}/10}{9/10}=\dfrac{${d}}{9}${d % 3 === 0 ? `=${frac(d, 9)}` : ''}$.`],
        };
      },
    },
    {
      id: 'int-semplice-composto',
      level: 2,
      title: 'Interesse semplice',
      make: (r) => {
        const c = int(r, 1, 9) * 1000, i = int(r, 1, 5), n = int(r, 2, 10);
        return {
          text: R`Un capitale di $${c}$ € è investito a **interesse semplice** al tasso annuo del $${i}\%$. Qual è il montante, in euro, dopo $${n}$ anni?`,
          answer: c + (c * i * n) / 100,
          tol: 0,
          hints: [R`Ogni anno si aggiunge sempre lo stesso interesse: $C\cdot i$.`, R`$M_n=C(1+n\,i)$ con $i=${i}/100$.`],
          solution: [R`Interesse annuo: $${c}\cdot\dfrac{${i}}{100}=${(c * i) / 100}$ €.`, R`In $${n}$ anni: $${n}\cdot${(c * i) / 100}=${(c * i * n) / 100}$ €.`, R`Montante: $${c}+${(c * i * n) / 100}=${c + (c * i * n) / 100}$ €.`],
        };
      },
    },
  ],
};
