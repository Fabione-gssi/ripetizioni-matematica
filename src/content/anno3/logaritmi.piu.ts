// Approfondimenti dell'unità "Logaritmi".
import { choice, frac, int, mc, nz, pick, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;

export const logaritmiPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-log-3',
      title: 'La funzione logaritmica e i suoi grafici',
      blocks: [
        { t: 'idea', md: R`La funzione logaritmica è l'**inversa** dell'esponenziale: il suo grafico si ottiene da quello di $y=a^x$ per simmetria rispetto alla bisettrice $y=x$. Tutto ciò che per l'esponenziale accade "in orizzontale" per il logaritmo accade "in verticale": l'asintoto orizzontale diventa verticale, il dominio diventa l'immagine.` },
        { t: 'def', title: 'Proprietà di y = logₐ x', md: R`Con $a>0$, $a\neq1$:
- **dominio:** $x>0$; **immagine:** tutti i numeri reali;
- il grafico passa per $(1;0)$ e per $(a;1)$;
- l'asse $y$ (retta $x=0$) è **asintoto verticale**;
- se $a>1$ la funzione è **crescente**: negativa per $0<x<1$, positiva per $x>1$;
- se $0<a<1$ è **decrescente**: positiva per $0<x<1$, negativa per $x>1$.` },
        { t: 'def', title: 'Trasformazioni', md: R`- $y=\log_a(x-h)$: traslazione orizzontale; il dominio diventa $x>h$ e l'asintoto verticale è $x=h$;
- $y=\log_a x+k$: traslazione verticale; dominio e asintoto non cambiano;
- $y=-\log_a x=\log_{1/a}x$: simmetria rispetto all'asse $x$;
- $y=\log_a(-x)$: simmetria rispetto all'asse $y$; dominio $x<0$.

L'asintoto verticale si sposta solo con le traslazioni orizzontali.` },
        {
          t: 'plot',
          title: R`Il grafico di $y=\log_a(x-h)+k$`,
          caption: R`La retta tratteggiata verticale è l'asintoto $x=h$. Il punto segnato è l'immagine di $(1;0)$, cioè $(1+h;\,k)$.`,
          view: [-5, 9, -6, 6],
          params: [
            { name: 'a', label: 'a', min: 0.25, max: 4, step: 0.25, value: 2 },
            { name: 'h', label: 'h', min: -3, max: 3, step: 0.5, value: 1 },
            { name: 'k', label: 'k', min: -3, max: 3, step: 0.5, value: 0 },
          ],
          draw: (p) => [
            { k: 'vline', x: p.h, dash: true },
            { k: 'fn', f: (x) => (x > p.h && p.a !== 1 ? Math.log(x - p.h) / Math.log(p.a) + p.k : NaN) },
            { k: 'pt', x: 1 + p.h, y: p.k },
          ],
          readout: (p) => (p.a === 1 ? 'La base $1$ non è ammessa.' : `Dominio $x>${`${p.h}`.replace('.', '{,}')}$; funzione ${p.a > 1 ? 'crescente' : 'decrescente'}.`),
        },
        {
          t: 'ex',
          title: R`Studia $y=\log_2(x+4)-1$: dominio, asintoto, intersezioni con gli assi.`,
          steps: [
            R`Dominio: $x+4>0$, cioè $x>-4$. Asintoto verticale $x=-4$.`,
            R`Intersezione con l'asse $y$ ($x=0$): $y=\log_24-1=2-1=1$.`,
            R`Intersezione con l'asse $x$ ($y=0$): $\log_2(x+4)=1$, quindi $x+4=2$, $x=-2$.`,
            R`La base è $2>1$: funzione crescente, negativa per $-4<x<-2$ e positiva per $x>-2$.`,
          ],
        },
        { t: 'thm', title: 'Logaritmo ed esponenziale sono inverse', md: R`Per ogni $x>0$ e ogni $y$ reale:
$$a^{\log_a x}=x\qquad\qquad\log_a\left(a^{y}\right)=y$$
Per trovare l'inversa di una funzione esponenziale si scambiano $x$ e $y$ e si ricava $y$ con la definizione di logaritmo: l'inversa di $y=a^x+k$ è $y=\log_a(x-k)$.` },
        {
          t: 'quiz',
          q: R`Qual è il dominio di $y=\log_3(5-x)$?`,
          options: [
            { md: R`$x<5$`, ok: true, why: R`Giusto: l'argomento deve essere positivo, $5-x>0$.` },
            { md: R`$x>5$`, why: R`Da $5-x>0$ si ricava $x<5$: attenzione al verso.` },
            { md: R`$x>0$`, why: R`Deve essere positivo l'**argomento** del logaritmo, non necessariamente $x$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-log-4',
      title: 'Logaritmi nelle applicazioni',
      blocks: [
        { t: 'idea', md: R`I logaritmi servono a due cose. La prima: **ricavare un esponente**, cioè rispondere a domande del tipo "dopo quanto tempo…?" nei modelli esponenziali. La seconda: **comprimere** grandezze che variano su moltissimi ordini di grandezza in numeri maneggevoli; così sono costruite le scale del pH, dei decibel e della magnitudo dei terremoti.` },
        { t: 'def', title: 'Logaritmi decimali e naturali', md: R`- $\log x$ indica di solito il logaritmo in base $10$ (**decimale**);
- $\ln x$ indica il logaritmo in base $e$ (**naturale**).

Con la formula del cambiamento di base ogni logaritmo si calcola con questi: $\log_a b=\dfrac{\ln b}{\ln a}=\dfrac{\log b}{\log a}$.` },
        { t: 'def', title: 'Risolvere aˣ = b', md: R`Se $b>0$ non è una potenza "comoda" di $a$, si applica il logaritmo a entrambi i membri:
$$a^x=b\iff x=\log_ab=\dfrac{\ln b}{\ln a}$$
Più in generale, da $a^{f(x)}=b^{g(x)}$ si ottiene $f(x)\ln a=g(x)\ln b$, che è un'equazione algebrica.` },
        {
          t: 'ex',
          title: R`Un capitale è investito al $4\%$ annuo composto. Dopo quanti anni raddoppia?`,
          steps: [
            R`Modello: $M(t)=C\cdot1{,}04^t$. Raddoppia quando $1{,}04^t=2$.`,
            R`Applichiamo il logaritmo: $t\ln1{,}04=\ln2$.`,
            R`$t=\dfrac{\ln2}{\ln1{,}04}\approx\dfrac{0{,}693}{0{,}0392}\approx17{,}7$.`,
            R`Servono circa $18$ anni. Il risultato non dipende dal capitale iniziale.`,
          ],
        },
        { t: 'def', title: 'Scale logaritmiche', md: R`- **pH:** $\text{pH}=-\log[\text{H}^+]$. Se la concentrazione di ioni idrogeno aumenta di $10$ volte, il pH **diminuisce** di $1$.
- **Decibel:** $L=10\log\dfrac{I}{I_0}$. Se l'intensità sonora diventa $10$ volte maggiore, il livello aumenta di $10$ dB; se diventa $100$ volte maggiore, di $20$ dB.
- **Magnitudo Richter:** un aumento di $1$ grado corrisponde a un'ampiezza delle oscillazioni $10$ volte maggiore.

In una scala logaritmica passi uguali corrispondono a **rapporti** uguali, non a differenze uguali.` },
        { t: 'warn', md: R`Non esistono regole per il logaritmo di una somma: $\log(a+b)\neq\log a+\log b$. Le proprietà riguardano solo prodotti, quozienti e potenze.` },
        {
          t: 'quiz',
          q: R`Un suono ha intensità $1000$ volte maggiore di un altro. Di quanti decibel è più alto il suo livello?`,
          options: [
            { md: R`$30$ dB`, ok: true, why: R`Giusto: $10\log1000=10\cdot3=30$.` },
            { md: R`$1000$ dB`, why: R`La scala è logaritmica: conta l'esponente di $10$, non il rapporto.` },
            { md: R`$3$ dB`, why: R`Il logaritmo va moltiplicato per $10$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'log-ln',
      level: 1,
      title: 'Logaritmo naturale',
      make: (r) => {
        const n = nz(r, -5, 9, 1), exp = r() < 0.5 || n < 0;
        return {
          text: exp ? R`Calcola $\ln\left(e^{${n}}\right)$.` : R`Calcola $e^{\ln ${n}}$.`,
          answer: n,
          tol: 0,
          hints: ['Logaritmo naturale ed esponenziale in base $e$ sono funzioni inverse.'],
          solution: [exp ? R`$\ln\left(e^{${n}}\right)=${n}\cdot\ln e=${n}$.` : R`$e^{\ln ${n}}=${n}$, perché $\ln ${n}$ è proprio l'esponente da dare a $e$ per ottenere $${n}$.`],
        };
      },
    },
    {
      id: 'log-punto-grafico',
      level: 1,
      title: 'Punto del grafico',
      make: (r) => {
        const a = pick(r, [2, 3, 5, 10]), n = nz(r, -3, 4);
        const x = n > 0 ? `${a ** n}` : frac(1, a ** -n);
        return {
          text: R`Il grafico di $y=\log_{${a}}x$ passa per il punto di ascissa $x=${x}$. Qual è la sua ordinata?`,
          answer: n,
          tol: 0,
          hints: [R`Scrivi $${x}$ come potenza di $${a}$.`],
          solution: [R`$${x}=${a}^{${n}}$, quindi $\log_{${a}}${n > 0 ? x : R`\left(${x}\right)`}=${n}$.`],
        };
      },
    },
    {
      id: 'log-asintoto',
      level: 1,
      title: 'Asintoto verticale',
      make: (r) => {
        const a = int(r, 2, 5), h = nz(r, -6, 6), k = int(r, -4, 4);
        return {
          text: R`Qual è l'asintoto verticale del grafico di $y=\log_{${a}}(x${sg(-h)})${sg(k)}$?`,
          options: mc(r, R`$x=${h}$`, [
            [R`$x=${-h}$`, R`L'argomento si annulla per $x=${h}$: controlla il segno.`],
            [R`$x=0$`, R`$x=0$ è l'asintoto di $y=\log_{${a}}x$: qui il grafico è stato traslato in orizzontale.`],
            [R`$y=${h}$`, 'L\'asintoto di una funzione logaritmica è verticale: ha equazione $x=\\text{costante}$.'],
          ]),
          hints: ['L\'asintoto verticale si trova dove l\'argomento del logaritmo si annulla.'],
          solution: [R`Argomento: $x${sg(-h)}>0\iff x>${h}$.`, R`Asintoto verticale: $x=${h}$.`],
        };
      },
    },
    {
      id: 'log-zero',
      level: 2,
      title: 'Zero di una funzione logaritmica',
      make: (r) => {
        const a = pick(r, [2, 3, 5]), h = nz(r, -6, 6), k = int(r, 0, 3);
        return {
          text: R`Per quale valore di $x$ si annulla la funzione $y=\log_{${a}}(x${sg(-h)})${sg(-k)}$?`,
          answer: h + a ** k,
          tol: 0,
          hints: [R`Risolvi $\log_{${a}}(x${sg(-h)})=${k}$.`, R`Per definizione: $x${sg(-h)}=${a}^{${k}}$.`],
          solution: [R`$\log_{${a}}(x${sg(-h)})=${k}\iff x${sg(-h)}=${a}^{${k}}=${a ** k}$.`, R`$x=${h + a ** k}$ (accettabile perché maggiore di $${h}$).`],
        };
      },
    },
    {
      id: 'log-inversa',
      level: 2,
      title: 'Inversa di una funzione esponenziale',
      make: (r) => {
        const a = pick(r, [2, 3, 5, 10]), k = nz(r, -6, 6);
        return {
          text: R`Qual è la funzione inversa di $y=${a}^x${sg(k)}$?`,
          options: mc(r, R`$y=\log_{${a}}(x${sg(-k)})$`, [
            [R`$y=\log_{${a}}x${sg(-k)}$`, R`Il termine $${sg(k)}$ va portato a primo membro **prima** di applicare il logaritmo, quindi finisce dentro l'argomento.`],
            [R`$y=\log_{${a}}(x${sg(k)})$`, R`Segno sbagliato: da $x=${a}^y${sg(k)}$ si ricava $${a}^y=x${sg(-k)}$.`],
            [R`$y=${a}^{-x}${sg(-k)}$`, 'L\'inversa non si ottiene cambiando i segni: bisogna scambiare $x$ e $y$ e ricavare $y$.'],
          ]),
          hints: ['Scambia $x$ con $y$ e ricava $y$.', R`$x=${a}^y${sg(k)}\Rightarrow ${a}^y=x${sg(-k)}$.`],
          solution: [R`Scambiamo le variabili: $x=${a}^y${sg(k)}$.`, R`$${a}^y=x${sg(-k)}\Rightarrow y=\log_{${a}}(x${sg(-k)})$.`],
        };
      },
    },
    {
      id: 'log-confronto',
      level: 2,
      title: 'Confronto di logaritmi',
      make: (r) => {
        const small = r() < 0.5, n = int(r, 2, 5);
        const base = small ? `\\frac{1}{${n}}` : `${n}`;
        const p = int(r, 2, 9), q = nz(r, 2, 12, p);
        const lo = Math.min(p, q), hi = Math.max(p, q);
        const good = small ? lo : hi, bad = small ? hi : lo;
        return {
          text: R`Quale dei due numeri è **maggiore**: $\log_{${base}}${p}$ oppure $\log_{${base}}${q}$?`,
          options: choice(r, [
            [R`$\log_{${base}}${good}$`],
            [R`$\log_{${base}}${bad}$`, small ? 'Con base compresa tra $0$ e $1$ il logaritmo è decrescente: ad argomento maggiore corrisponde logaritmo minore.' : 'Con base maggiore di $1$ il logaritmo è crescente: ad argomento maggiore corrisponde logaritmo maggiore.'],
            ['Sono uguali', 'La funzione logaritmica è iniettiva: argomenti diversi danno logaritmi diversi.'],
          ]),
          hints: [`La base è ${small ? 'compresa tra $0$ e $1$' : 'maggiore di $1$'}: la funzione logaritmica è ${small ? 'decrescente' : 'crescente'}.`],
          solution: [`Con questa base la funzione logaritmica è ${small ? 'decrescente' : 'crescente'}.`, R`Poiché $${lo}<${hi}$, il maggiore è $\log_{${base}}${good}$.`],
        };
      },
    },
    {
      id: 'log-eq-esponenziale',
      level: 2,
      title: 'Risolvere aˣ = b con i logaritmi',
      make: (r) => {
        const a = pick(r, [2, 3, 5]), b = pick(r, [7, 11, 13, 17]);
        return {
          text: R`Qual è la soluzione dell'equazione $${a}^x=${b}$?`,
          options: mc(r, R`$x=\dfrac{\ln ${b}}{\ln ${a}}$`, [
            [R`$x=\dfrac{\ln ${a}}{\ln ${b}}$`, R`Hai invertito il rapporto: da $x\ln ${a}=\ln ${b}$ si divide per $\ln ${a}$.`],
            [R`$x=\ln ${b}-\ln ${a}$`, R`$\ln ${b}-\ln ${a}$ è il logaritmo del quoziente $\dfrac{${b}}{${a}}$, non il quoziente dei logaritmi.`],
            [R`$x=\dfrac{${b}}{${a}}$`, 'L\'incognita è all\'esponente: non si ricava con una divisione.'],
          ]),
          hints: ['Applica il logaritmo naturale a entrambi i membri.', R`$\ln\left(${a}^x\right)=x\ln ${a}$.`],
          solution: [R`$\ln\left(${a}^x\right)=\ln ${b}\Rightarrow x\ln ${a}=\ln ${b}$.`, R`$x=\dfrac{\ln ${b}}{\ln ${a}}=\log_{${a}}${b}\approx${(Math.log(b) / Math.log(a)).toFixed(2).replace('.', '{,}')}$.`],
        };
      },
    },
    {
      id: 'log-ph',
      level: 2,
      title: 'Scala del pH',
      make: (r) => {
        const p = int(r, 5, 12), k = int(r, 1, 4);
        return {
          text: R`Una soluzione A ha $\text{pH}=${p}$. Una soluzione B ha una concentrazione di ioni $\text{H}^+$ pari a $${10 ** k}$ volte quella di A. Qual è il pH di B?`,
          answer: p - k,
          tol: 0,
          hints: [R`$\text{pH}=-\log[\text{H}^+]$.`, R`Moltiplicare la concentrazione per $10^{${k}}$ aggiunge $${k}$ al logaritmo, quindi toglie $${k}$ al pH.`],
          solution: [R`$\text{pH}_B=-\log\left(${10 ** k}\cdot[\text{H}^+]_A\right)=-${k}-\log[\text{H}^+]_A$.`, R`$\text{pH}_B=${p}-${k}=${p - k}$: la soluzione B è più acida.`],
        };
      },
    },
    {
      id: 'log-richter',
      level: 2,
      title: 'Scala Richter',
      make: (r) => {
        const m1 = int(r, 3, 5), d = int(r, 1, 4);
        return {
          text: R`Nella scala Richter ogni grado in più corrisponde a un'ampiezza delle oscillazioni $10$ volte maggiore. Di quante volte l'ampiezza di un terremoto di magnitudo $${m1 + d}$ supera quella di un terremoto di magnitudo $${m1}$?`,
          answer: 10 ** d,
          tol: 0,
          hints: [R`La differenza di magnitudo è $${d}$.`, 'A ogni grado l\'ampiezza si moltiplica per $10$.'],
          solution: [R`Differenza: $${m1 + d}-${m1}=${d}$ gradi.`, R`Rapporto delle ampiezze: $10^{${d}}=${10 ** d}$.`],
        };
      },
    },
    {
      id: 'log-decibel',
      level: 3,
      title: 'Decibel',
      make: (r) => {
        const L = int(r, 3, 9) * 10, k = int(r, 1, 4);
        return {
          text: R`Il livello sonoro è $L=10\log\dfrac{I}{I_0}$ (in dB). Un suono ha livello $${L}$ dB. Qual è il livello, in dB, di un suono con intensità $${10 ** k}$ volte maggiore?`,
          answer: L + 10 * k,
          tol: 0,
          hints: [R`$\log(${10 ** k}\cdot x)=${k}+\log x$.`, R`Il fattore $10$ davanti al logaritmo moltiplica anche l'aumento.`],
          solution: [R`$L'=10\log\dfrac{${10 ** k}\,I}{I_0}=10\left(${k}+\log\dfrac{I}{I_0}\right)=${10 * k}+L$.`, R`$L'=${L}+${10 * k}=${L + 10 * k}$ dB.`],
        };
      },
    },
    {
      id: 'log-tempo-dimezzamenti',
      level: 3,
      title: 'Tempo per ridursi a una frazione',
      make: (r) => {
        const T = pick(r, [3, 5, 8, 12, 30]), k = int(r, 2, 6);
        return {
          text: R`Una sostanza ha tempo di dimezzamento di $${T}$ anni. Dopo quanti anni ne resta $${frac(1, 2 ** k)}$ della quantità iniziale?`,
          answer: T * k,
          tol: 0,
          hints: [R`$\left(\dfrac12\right)^{t/${T}}=${frac(1, 2 ** k)}$.`, R`$${frac(1, 2 ** k)}=\left(\dfrac12\right)^{${k}}$.`],
          solution: [R`$\left(\dfrac12\right)^{t/${T}}=\left(\dfrac12\right)^{${k}}\Rightarrow\dfrac{t}{${T}}=${k}$.`, R`$t=${T * k}$ anni.`],
        };
      },
    },
  ],
};
