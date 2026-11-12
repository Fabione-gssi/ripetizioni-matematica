// Approfondimenti dell'unità "Esponenziali".
import { choice, dec, frac, int, mc, nz, pick, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;

export const esponenzialiPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-esp-3',
      title: 'Grafici esponenziali, trasformazioni e il numero e',
      blocks: [
        { t: 'idea', md: R`Tutte le funzioni esponenziali si assomigliano: partendo dal grafico di $y=a^x$ e applicando traslazioni e simmetrie si ottengono i grafici di moltissime funzioni, senza bisogno di tabelle di valori. Tra tutte le basi possibili ce n'è una speciale, il numero $e$, che compare in modo naturale nei fenomeni di crescita continua.` },
        { t: 'def', title: 'Trasformazioni di y = aˣ', md: R`Partendo da $y=a^x$ (con $a>0$, $a\neq1$):
- $y=a^x+k$: traslazione **verticale** di $k$; l'asintoto orizzontale diventa $y=k$;
- $y=a^{x-h}$: traslazione **orizzontale** di $h$ (verso destra se $h>0$);
- $y=-a^x$: simmetria rispetto all'asse $x$;
- $y=a^{-x}=\left(\dfrac1a\right)^x$: simmetria rispetto all'asse $y$;
- $y=c\cdot a^x$ con $c>0$: dilatazione verticale; il grafico incontra l'asse $y$ in $(0;c)$.

L'asintoto orizzontale si sposta solo con le traslazioni verticali.` },
        {
          t: 'plot',
          title: R`Il grafico di $y=a^{x-h}+k$`,
          caption: R`La retta tratteggiata è l'asintoto orizzontale $y=k$. Il punto segnato è l'immagine di $(0;1)$, cioè $(h;\,1+k)$.`,
          view: [-6, 6, -4, 8],
          params: [
            { name: 'a', label: 'a', min: 0.25, max: 4, step: 0.25, value: 2 },
            { name: 'h', label: 'h', min: -3, max: 3, step: 0.5, value: 1 },
            { name: 'k', label: 'k', min: -3, max: 3, step: 0.5, value: -1 },
          ],
          draw: (p) => [
            { k: 'fn', f: () => p.k, dash: true },
            { k: 'fn', f: (x) => Math.pow(p.a, x - p.h) + p.k },
            { k: 'pt', x: p.h, y: 1 + p.k },
          ],
          readout: (p) => (p.a === 1 ? 'Con $a=1$ la funzione è costante: non è una funzione esponenziale.' : `Funzione ${p.a > 1 ? 'crescente' : 'decrescente'}; immagine $y>${`${p.k}`.replace('.', '{,}')}$.`),
        },
        {
          t: 'ex',
          title: R`Disegna il grafico di $y=2^{x+1}-4$ e trova le intersezioni con gli assi.`,
          steps: [
            R`È $y=2^x$ traslato di $1$ verso **sinistra** e di $4$ verso il basso: asintoto orizzontale $y=-4$.`,
            R`Intersezione con l'asse $y$ ($x=0$): $y=2^1-4=-2$.`,
            R`Intersezione con l'asse $x$ ($y=0$): $2^{x+1}=4=2^2$, quindi $x+1=2$, $x=1$.`,
            R`La funzione è crescente, negativa per $x<1$ e positiva per $x>1$; l'immagine è $y>-4$.`,
          ],
        },
        { t: 'def', title: 'Il numero e', md: R`La successione $\left(1+\dfrac1n\right)^n$ è crescente e limitata: al crescere di $n$ i suoi termini si avvicinano a un numero irrazionale, indicato con $e$ (numero di Nepero):
$$e\approx2{,}71828$$
La funzione $y=e^x$ è l'esponenziale "naturale": è la base che descrive la crescita quando gli interessi (o gli incrementi) vengono aggiunti **in modo continuo**. Essendo $e>1$, $y=e^x$ è crescente.` },
        { t: 'warn', md: R`In $y=a^{x-h}$ la traslazione va nel verso **opposto** al segno che si legge: $2^{x+3}$ è $2^x$ spostato di $3$ verso **sinistra**. Per non sbagliare, chiediti dove finisce il punto $(0;1)$: l'esponente si annulla per $x=-3$.` },
        {
          t: 'quiz',
          q: R`Qual è l'immagine della funzione $y=3^x-2$?`,
          options: [
            { md: R`$y>-2$`, ok: true, why: R`Giusto: $3^x>0$ sempre, quindi $3^x-2>-2$.` },
            { md: R`$y>0$`, why: R`Questa è l'immagine di $y=3^x$: sottraendo $2$ il grafico scende di $2$.` },
            { md: 'Tutti i numeri reali', why: R`Il grafico ha un asintoto orizzontale e non scende mai sotto $y=-2$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-esp-4',
      title: 'Modelli di crescita e di decadimento',
      blocks: [
        { t: 'idea', md: R`Una grandezza cresce in modo **esponenziale** quando in intervalli di tempo uguali viene moltiplicata per lo stesso fattore: popolazioni di batteri, capitali a interesse composto, diffusione di un contagio nelle fasi iniziali. Se il fattore è minore di $1$ si parla di **decadimento**: sostanze radioattive, farmaci nel sangue, svalutazione di un bene.` },
        { t: 'def', title: 'Il modello', md: R`$$N(t)=N_0\cdot a^t$$
- $N_0$ è il valore iniziale (per $t=0$);
- $a$ è il **fattore di crescita** per unità di tempo: se la grandezza aumenta del $p\%$ a ogni periodo, $a=1+\dfrac{p}{100}$; se diminuisce del $p\%$, $a=1-\dfrac{p}{100}$.

Forme equivalenti molto usate:
- **tempo di raddoppio** $T$: $N(t)=N_0\cdot2^{\,t/T}$;
- **tempo di dimezzamento** $T$: $N(t)=N_0\cdot\left(\dfrac12\right)^{t/T}$.` },
        {
          t: 'ex',
          title: R`Una coltura contiene $500$ batteri e raddoppia ogni $3$ ore. Quanti batteri ci sono dopo $12$ ore?`,
          steps: [
            R`Modello: $N(t)=500\cdot2^{\,t/3}$, con $t$ in ore.`,
            R`In $12$ ore ci sono $12:3=4$ raddoppi.`,
            R`$N(12)=500\cdot2^4=500\cdot16=8000$ batteri.`,
          ],
        },
        {
          t: 'ex',
          title: R`Un'auto pagata $20\,000$ € perde il $20\%$ del valore ogni anno. Quanto vale dopo $3$ anni?`,
          steps: [
            R`Ogni anno il valore viene moltiplicato per $1-0{,}20=0{,}8$.`,
            R`$V(3)=20\,000\cdot0{,}8^3=20\,000\cdot0{,}512=10\,240$ €.`,
            R`Attenzione: **non** è $20\,000-3\cdot20\%=8\,000$ €. La perdita si calcola ogni anno sul valore residuo, non su quello iniziale.`,
          ],
        },
        {
          t: 'plot',
          title: 'Crescita lineare e crescita esponenziale',
          caption: R`In blu un capitale che aumenta ogni anno di una quota fissa (interesse semplice), in rosso lo stesso capitale a interesse composto. All'inizio le due curve quasi coincidono, poi l'esponenziale supera qualunque retta.`,
          view: [0, 40, 0, 12],
          params: [{ name: 'p', label: 'tasso annuo %', min: 1, max: 10, step: 0.5, value: 5 }],
          draw: (p) => [
            { k: 'fn', f: (t) => 1 + (p.p / 100) * t },
            { k: 'fn', f: (t) => Math.pow(1 + p.p / 100, t), color: '#c0392b' },
          ],
          readout: (p) => `Dopo $40$ anni: semplice $\\times${(1 + (p.p / 100) * 40).toFixed(2).replace('.', '{,}')}$, composto $\\times${Math.pow(1 + p.p / 100, 40).toFixed(2).replace('.', '{,}')}$`,
        },
        { t: 'thm', title: 'Lineare o esponenziale?', md: R`- In un modello **lineare** sono costanti le **differenze** tra valori successivi: $N(t+1)-N(t)=m$.
- In un modello **esponenziale** sono costanti i **rapporti**: $\dfrac{N(t+1)}{N(t)}=a$.

È lo stesso criterio che distingue le progressioni aritmetiche da quelle geometriche.` },
        {
          t: 'quiz',
          q: R`Una popolazione aumenta del $3\%$ all'anno. Per quale numero va moltiplicata ogni anno?`,
          options: [
            { md: R`$1{,}03$`, ok: true, why: R`Giusto: $100\%+3\%=103\%=1{,}03$.` },
            { md: R`$0{,}03$`, why: R`Moltiplicando per $0{,}03$ si ottiene solo l'**aumento**, non la nuova popolazione.` },
            { md: R`$3$`, why: R`Moltiplicare per $3$ significherebbe triplicare, cioè aumentare del $200\%$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'esp-asintoto',
      level: 1,
      title: 'Asintoto orizzontale',
      make: (r) => {
        const a = int(r, 2, 5), k = nz(r, -6, 6);
        return {
          text: R`Qual è l'asintoto orizzontale del grafico di $y=${a}^x${sg(k)}$?`,
          options: mc(r, R`$y=${k}$`, [
            [R`$y=0$`, R`$y=0$ è l'asintoto di $y=${a}^x$: qui il grafico è stato traslato in verticale.`],
            [R`$x=${k}$`, 'Un asintoto orizzontale ha equazione del tipo $y=\\text{costante}$.'],
            [R`$y=${-k}$`, 'Controlla il verso della traslazione verticale.'],
          ]),
          hints: [R`Per $x$ molto negativo, $${a}^x$ si avvicina a $0$.`],
          solution: [R`Quando $x\to-\infty$, $${a}^x$ si avvicina a $0$ e quindi $y$ si avvicina a $${k}$.`, R`Asintoto orizzontale: $y=${k}$.`],
        };
      },
    },
    {
      id: 'esp-intersezione-y',
      level: 1,
      title: 'Intersezione con l\'asse y',
      make: (r) => {
        const a = int(r, 2, 5), c = nz(r, -4, 5, 1), k = int(r, -6, 6);
        return {
          text: R`In quale ordinata il grafico di $y=${c === -1 ? '-' : c}\cdot${a}^x${sg(k)}$ interseca l'asse $y$?`.replace('-\\cdot', '-'),
          answer: c + k,
          tol: 0,
          hints: [R`Sull'asse $y$ si ha $x=0$, e $${a}^0=1$.`],
          solution: [R`Per $x=0$: $y=${c}\cdot1${sg(k)}=${c + k}$.`],
        };
      },
    },
    {
      id: 'esp-traslazione',
      level: 2,
      title: 'Traslazione del grafico',
      make: (r) => {
        const a = int(r, 2, 5), h = nz(r, -5, 5), k = nz(r, -5, 5, h, -h);
        return {
          text: R`Il grafico di $y=${a}^{x${sg(-h)}}${sg(k)}$ si ottiene da quello di $y=${a}^x$ con una traslazione di vettore:`,
          options: mc(r, `$${P(h, k)}$`, [
            [`$${P(-h, k)}$`, R`Nell'esponente compare $x-h$: con $x${sg(-h)}$ la traslazione orizzontale è di $${h}$.`],
            [`$${P(h, -k)}$`, 'Il termine aggiunto fuori dall\'esponente dà la traslazione verticale con il suo stesso segno.'],
            [`$${P(k, h)}$`, 'Hai scambiato la componente orizzontale con quella verticale.'],
          ]),
          hints: [R`$y=f(x-h)+k$ è il grafico di $f$ traslato di $h$ in orizzontale e di $k$ in verticale.`, R`Dove finisce il punto $(0;1)$?`],
          solution: [R`$x${sg(-h)}=x-(${h})$: traslazione orizzontale di $${h}$.`, R`Il termine $${sg(k)}$ dà la traslazione verticale di $${k}$. Vettore $${P(h, k)}$.`],
        };
      },
    },
    {
      id: 'esp-soluzioni',
      level: 1,
      title: 'Numero di soluzioni',
      make: (r) => {
        const a = int(r, 2, 6), kind = int(r, 0, 2);
        const k = kind === 0 ? -int(r, 1, 9) : kind === 1 ? 0 : int(r, 2, 30);
        const good = kind === 2 ? 'Una' : 'Nessuna';
        return {
          text: R`Quante soluzioni reali ha l'equazione $${a}^x=${k}$?`,
          options: choice(r, [
            [good, kind === 2 ? 'Corretto: la funzione esponenziale assume una e una sola volta ogni valore positivo.' : 'Corretto: una potenza con base positiva è sempre positiva.'],
            [kind === 2 ? 'Nessuna' : 'Una', kind === 2 ? `Il valore $${k}$ è positivo: appartiene all'immagine di $${a}^x$.` : `$${a}^x>0$ per ogni $x$: non può valere $${k}$.`],
            ['Due', 'La funzione esponenziale è monotòna: non può assumere due volte lo stesso valore.'],
            ['Infinite', 'La funzione esponenziale è monotòna: ogni valore è assunto al più una volta.'],
          ]),
          hints: [R`Ricorda che $a^x>0$ per ogni $x$ reale.`, 'La funzione esponenziale è iniettiva.'],
          solution: [kind === 2 ? R`$${k}>0$: la retta $y=${k}$ incontra il grafico di $y=${a}^x$ in un solo punto.` : R`$${a}^x$ è sempre positivo, mentre $${k}\le0$: nessuna soluzione.`],
        };
      },
    },
    {
      id: 'esp-confronto',
      level: 1,
      title: 'Confronto di potenze',
      make: (r) => {
        const small = r() < 0.5;
        const n = int(r, 2, 5);
        const base = small ? frac(1, n) : `${n}`;
        const b = small ? R`\left(${base}\right)` : base;
        const p = int(r, -4, 5), q = nz(r, -4, 6, p);
        const lo = Math.min(p, q), hi = Math.max(p, q);
        const good = small ? lo : hi, bad = small ? hi : lo;
        return {
          text: R`Quale dei due numeri è **maggiore**: $${b}^{${p}}$ oppure $${b}^{${q}}$?`,
          options: choice(r, [
            [R`$${b}^{${good}}$`],
            [R`$${b}^{${bad}}$`, small ? 'Con base compresa tra $0$ e $1$ la funzione esponenziale è decrescente: a esponente maggiore corrisponde potenza minore.' : 'Con base maggiore di $1$ la funzione esponenziale è crescente: a esponente maggiore corrisponde potenza maggiore.'],
            ['Sono uguali', 'La funzione esponenziale è iniettiva: esponenti diversi danno potenze diverse.'],
          ]),
          hints: [`La base è ${small ? 'compresa tra $0$ e $1$' : 'maggiore di $1$'}: la funzione esponenziale è ${small ? 'decrescente' : 'crescente'}.`],
          solution: [`La base è ${small ? 'minore' : 'maggiore'} di $1$, quindi la funzione è ${small ? 'decrescente' : 'crescente'}.`, R`Poiché $${lo}<${hi}$, il numero maggiore è $${b}^{${good}}$.`],
        };
      },
    },
    {
      id: 'esp-fattore',
      level: 2,
      title: 'Fattore di crescita',
      make: (r) => {
        const p = int(r, 2, 40), up = r() < 0.5;
        const good = dec(1 + (up ? p : -p) / 100);
        return {
          text: R`Una grandezza ${up ? 'aumenta' : 'diminuisce'} del $${p}\%$ ogni anno. Per quale numero viene moltiplicata a ogni anno che passa?`,
          options: mc(r, `$${good}$`, [
            [`$${dec(p / 100)}$`, `Questo è solo ${up ? "l'aumento" : 'la diminuzione'} percentuale scritto in forma decimale: il fattore è $1${up ? '+' : '-'}\\dfrac{p}{100}$.`],
            [`$${dec(1 + (up ? -p : p) / 100)}$`, `Questo fattore corrisponde a ${up ? 'una diminuzione' : 'un aumento'} del $${p}\\%$.`],
            [`$${p}$`, R`La percentuale va divisa per $100$.`],
          ]),
          hints: [R`Il nuovo valore è il $${up ? 100 + p : 100 - p}\%$ del precedente.`],
          solution: [R`$1${up ? '+' : '-'}\dfrac{${p}}{100}=${good}$.`],
        };
      },
    },
    {
      id: 'esp-raddoppio',
      level: 2,
      title: 'Crescita con tempo di raddoppio',
      make: (r) => {
        const T = int(r, 2, 6), n = int(r, 2, 6), n0 = int(r, 1, 9) * 100;
        return {
          text: R`Una popolazione di batteri raddoppia ogni $${T}$ ore. All'inizio ci sono $${n0}$ batteri. Quanti sono dopo $${T * n}$ ore?`,
          answer: n0 * 2 ** n,
          tol: 0,
          hints: [R`Quanti raddoppi avvengono in $${T * n}$ ore?`, R`$N=N_0\cdot2^{\,t/T}$.`],
          solution: [R`Numero di raddoppi: $${T * n}:${T}=${n}$.`, R`$N=${n0}\cdot2^{${n}}=${n0}\cdot${2 ** n}=${n0 * 2 ** n}$.`],
        };
      },
    },
    {
      id: 'esp-dimezzamento',
      level: 2,
      title: 'Decadimento con tempo di dimezzamento',
      make: (r) => {
        const T = pick(r, [2, 5, 8, 10, 30]), n = int(r, 2, 5), m = int(r, 1, 9) * 5;
        return {
          text: R`Una sostanza radioattiva ha tempo di dimezzamento di $${T}$ anni. Se inizialmente ce ne sono $${m * 2 ** n}$ g, quanti grammi restano dopo $${T * n}$ anni?`,
          answer: m,
          tol: 0,
          hints: [R`In $${T * n}$ anni avvengono $${n}$ dimezzamenti.`, R`$Q=Q_0\cdot\left(\dfrac12\right)^{t/T}$.`],
          solution: [R`Dimezzamenti: $${T * n}:${T}=${n}$.`, R`$Q=${m * 2 ** n}\cdot\left(\dfrac12\right)^{${n}}=\dfrac{${m * 2 ** n}}{${2 ** n}}=${m}$ g.`],
        };
      },
    },
    {
      id: 'esp-svalutazione',
      level: 2,
      title: 'Svalutazione percentuale',
      make: (r) => {
        const v = int(r, 1, 5) * 10000, p = pick(r, [10, 20, 30, 40, 50]);
        const res = (v * (100 - p) * (100 - p)) / 10000;
        return {
          text: R`Un macchinario acquistato a $${v}$ € perde il $${p}\%$ del proprio valore ogni anno. Quanto vale, in euro, dopo $2$ anni?`,
          answer: res,
          tol: 0,
          hints: [R`Ogni anno il valore viene moltiplicato per $${dec(1 - p / 100)}$.`, 'La perdita del secondo anno si calcola sul valore residuo, non su quello iniziale.'],
          solution: [R`Fattore annuo: $1-\dfrac{${p}}{100}=${dec(1 - p / 100)}$.`, R`$V=${v}\cdot${dec(1 - p / 100)}^2=${v}\cdot${dec((1 - p / 100) ** 2)}=${res}$ €.`],
        };
      },
    },
    {
      id: 'esp-fattore-annuo',
      level: 3,
      title: 'Ricavare il fattore di crescita',
      make: (r) => {
        const q = int(r, 2, 5), n = pick(r, [2, 3]), n0 = int(r, 1, 9) * 10;
        return {
          text: R`Una grandezza cresce in modo esponenziale: vale $${n0}$ all'istante iniziale e $${n0 * q ** n}$ dopo $${n}$ anni. Per quale fattore viene moltiplicata **ogni anno**?`,
          answer: q,
          tol: 0,
          hints: [R`Modello: $N(t)=N_0\cdot a^t$.`, R`$a^{${n}}=\dfrac{${n0 * q ** n}}{${n0}}$.`],
          solution: [R`$${n0}\cdot a^{${n}}=${n0 * q ** n}\Rightarrow a^{${n}}=${q ** n}$.`, R`$a=${q}$.`],
        };
      },
    },
  ],
};
