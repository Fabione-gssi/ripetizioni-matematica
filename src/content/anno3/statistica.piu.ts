// Approfondimenti dell'unità "Statistica".
import { dec, int, nz, pick, shuffle } from '../../lib/gen';
import type { Shape, UnitExtra } from '../../lib/types';

const R = String.raw;

export const statisticaPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-sta-3',
      title: 'Distribuzioni di frequenze e rappresentazioni grafiche',
      blocks: [
        { t: 'idea', md: R`Un elenco di centinaia di dati non dice nulla finché non lo si **organizza**. Contare quante volte compare ogni valore (o quanti dati cadono in ogni intervallo) trasforma l'elenco in una distribuzione di frequenze, che si può leggere, confrontare e disegnare.` },
        { t: 'def', title: 'Frequenze', md: R`Sia $N$ il numero totale dei dati.
- **Frequenza assoluta** $n_i$: quante volte compare la modalità $x_i$. La somma delle $n_i$ è $N$.
- **Frequenza relativa** $f_i=\dfrac{n_i}{N}$: è un numero tra $0$ e $1$; la somma delle $f_i$ è $1$.
- **Frequenza percentuale**: $f_i\cdot100$.
- **Frequenza cumulata**: somma delle frequenze fino a una certa modalità compresa; indica quanti dati sono **minori o uguali** a quel valore. Ha senso solo se le modalità si possono ordinare.` },
        { t: 'def', title: 'Dati raggruppati in classi', md: R`Quando i valori sono molti e diversi (altezze, tempi, redditi) si raggruppano in **classi** di valori, per esempio $[150;160)$, $[160;170)$…
- **Ampiezza** della classe: differenza tra gli estremi.
- **Valore centrale**: media dei due estremi; rappresenta tutta la classe nei calcoli.
- **Media** (approssimata): $\bar x=\dfrac{\sum c_i\,n_i}{N}$, dove $c_i$ sono i valori centrali.
- **Classe modale**: quella con la maggiore **densità di frequenza** $\dfrac{n_i}{\text{ampiezza}}$ (se le classi hanno la stessa ampiezza, quella con la frequenza più alta).` },
        {
          t: 'ex',
          title: R`Le altezze (in cm) di $20$ studenti: $4$ in $[150;160)$, $10$ in $[160;170)$, $6$ in $[170;180)$. Calcola la media.`,
          steps: [
            R`Valori centrali: $155$, $165$, $175$.`,
            R`$\sum c_i n_i=155\cdot4+165\cdot10+175\cdot6=620+1650+1050=3320$.`,
            R`$\bar x=\dfrac{3320}{20}=166$ cm. La classe modale è $[160;170)$.`,
          ],
        },
        { t: 'def', title: 'Quale grafico?', md: R`- **Diagramma a barre** (ortogramma): barre separate di altezza proporzionale alla frequenza; adatto ai caratteri qualitativi o quantitativi discreti.
- **Areogramma** (diagramma a torta): ogni modalità occupa un settore di ampiezza $\alpha_i=f_i\cdot360°$; mette in evidenza le **parti di un tutto**.
- **Istogramma**: rettangoli **adiacenti** che hanno per base la classe e **area** proporzionale alla frequenza; l'altezza è quindi la densità di frequenza. Si usa per i dati raggruppati in classi.
- **Diagramma cartesiano** (poligono, serie storica): adatto a mostrare un andamento nel tempo.` },
        { t: 'warn', md: R`In un istogramma con classi di **ampiezza diversa** è l'area, non l'altezza, a rappresentare la frequenza. Disegnare altezze uguali alle frequenze farebbe sembrare più importanti le classi più larghe.` },
        {
          t: 'quiz',
          q: R`In un areogramma, una modalità con frequenza relativa $0{,}25$ occupa un settore di ampiezza:`,
          options: [
            { md: R`$90°$`, ok: true, why: R`Giusto: $0{,}25\cdot360°=90°$.` },
            { md: R`$25°$`, why: R`$25$ è la percentuale: l'angolo si ottiene moltiplicando la frequenza relativa per $360°$.` },
            { md: R`$45°$`, why: R`$45°$ corrisponde a un ottavo del totale, cioè a $f=0{,}125$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-sta-4',
      title: 'Moda, quartili e box plot',
      blocks: [
        { t: 'idea', md: R`La media è l'indice più noto, ma basta un solo dato anomalo per spostarla molto. Mediana e quartili dividono invece i dati in parti **ugualmente numerose** e risentono poco dei valori estremi: per questo si dicono indici *robusti*.` },
        { t: 'def', title: 'Moda, mediana, quartili', md: R`Dati ordinati in senso crescente:
- **moda**: il valore con la frequenza più alta (può non essere unica);
- **mediana** $Me$ (o $Q_2$): il valore centrale; lascia metà dei dati a sinistra e metà a destra. Se i dati sono in numero pari è la media dei due centrali;
- **primo quartile** $Q_1$: mediana della metà inferiore dei dati; lascia a sinistra circa il $25\%$ dei dati;
- **terzo quartile** $Q_3$: mediana della metà superiore; lascia a sinistra circa il $75\%$ dei dati.

Indici di variabilità collegati:
- **campo di variazione**: $x_{\max}-x_{\min}$;
- **scarto interquartile**: $Q_3-Q_1$, l'ampiezza dell'intervallo che contiene la metà centrale dei dati.` },
        {
          t: 'ex',
          title: R`Trova quartili e scarto interquartile dei dati $3,\ 5,\ 6,\ 8,\ 9,\ 12,\ 20$.`,
          steps: [
            R`I dati sono $7$ e già ordinati: la mediana è il quarto, $Me=8$.`,
            R`Metà inferiore: $3,\ 5,\ 6$, con mediana $Q_1=5$. Metà superiore: $9,\ 12,\ 20$, con mediana $Q_3=12$.`,
            R`Scarto interquartile: $Q_3-Q_1=7$. Campo di variazione: $20-3=17$.`,
          ],
        },
        { t: 'def', title: 'Box plot e valori anomali', md: R`Il **box plot** (diagramma a scatola e baffi) riassume i dati con cinque numeri: minimo, $Q_1$, mediana, $Q_3$, massimo. La scatola va da $Q_1$ a $Q_3$ ed è tagliata dalla mediana; i baffi raggiungono il minimo e il massimo.

Un dato si considera **anomalo** (outlier) se dista dalla scatola più di una volta e mezza lo scarto interquartile, cioè se è minore di $Q_1-1{,}5\,(Q_3-Q_1)$ oppure maggiore di $Q_3+1{,}5\,(Q_3-Q_1)$.` },
        {
          t: 'plot',
          title: 'Media e mediana di fronte a un valore estremo',
          caption: R`I punti sull'asse sono i dati $2,\ 4,\ 5,\ 6,\ 8$ più un sesto dato che puoi spostare. Il punto in alto è la **media**, quello in basso la **mediana**: allontanando il sesto dato la media lo segue, la mediana quasi non si muove.`,
          view: [0, 31, -3, 3],
          params: [{ name: 'x', label: 'sesto dato', min: 1, max: 30, step: 1, value: 9 }],
          draw: (p) => {
            const d = [2, 4, 5, 6, 8, p.x].sort((a, b) => a - b);
            const mean = d.reduce((s, v) => s + v, 0) / 6;
            const med = (d[2] + d[3]) / 2;
            const pts: Shape[] = d.map((v) => ({ k: 'pt', x: v, y: 0 }));
            return [...pts, { k: 'pt', x: mean, y: 1.5, label: 'media', color: '#c0392b' }, { k: 'pt', x: med, y: -1.5, label: 'mediana', color: '#1e8449' }];
          },
          readout: (p) => {
            const d = [2, 4, 5, 6, 8, p.x].sort((a, b) => a - b);
            const f = (v: number) => v.toFixed(2).replace(/\.?0+$/, '').replace('.', '{,}');
            return `Media $${f(d.reduce((s, v) => s + v, 0) / 6)}$, mediana $${f((d[2] + d[3]) / 2)}$`;
          },
        },
        { t: 'def', title: 'Coefficiente di variazione', md: R`Per confrontare la variabilità di grandezze con unità di misura o ordini di grandezza diversi si usa il **coefficiente di variazione**
$$CV=\dfrac{\sigma}{\bar x}$$
(spesso espresso in percentuale), che è un numero puro: indica quanto è grande la deviazione standard rispetto alla media.` },
        {
          t: 'quiz',
          q: R`Nei dati $1,\ 2,\ 3,\ 4,\ 100$ quale indice descrive meglio il "valore tipico"?`,
          options: [
            { md: 'La mediana, che vale $3$', ok: true, why: 'Giusto: la mediana non risente del valore anomalo $100$.' },
            { md: 'La media, che vale $22$', why: 'La media è trascinata dal valore $100$: nessun dato è vicino a $22$.' },
            { md: 'Il campo di variazione, che vale $99$', why: 'Il campo di variazione misura la dispersione, non la posizione.' },
          ],
        },
      ],
    },
    {
      id: 'a3-sta-5',
      title: 'Tabelle a doppia entrata: dipendenza e indipendenza',
      blocks: [
        { t: 'idea', md: R`Spesso su ogni individuo si rilevano **due** caratteri: sesso e sport praticato, indirizzo di studio e voto, fumo e malattia. La domanda interessante è se i due caratteri sono legati oppure no. La tabella a doppia entrata è lo strumento per rispondere.` },
        { t: 'def', title: 'Distribuzioni congiunte, marginali, condizionate', md: R`In una **tabella a doppia entrata** le righe corrispondono alle modalità del primo carattere, le colonne a quelle del secondo.
- **Frequenze congiunte** $n_{ij}$: numero di individui che presentano insieme la modalità $i$ del primo carattere e la $j$ del secondo (le caselle interne).
- **Frequenze marginali**: i totali di riga $R_i$ e di colonna $C_j$; descrivono ciascun carattere preso da solo.
- **Frequenze condizionate**: si restringe l'attenzione a una sola riga (o colonna). Per esempio la frequenza relativa della modalità $j$ *tra gli individui della riga $i$* è $\dfrac{n_{ij}}{R_i}$.` },
        { t: 'thm', title: 'Indipendenza', md: R`Due caratteri sono **indipendenti** se le distribuzioni condizionate sono tutte uguali tra loro (e quindi uguali a quella marginale). Questo accade se e solo se ogni frequenza congiunta coincide con la **frequenza teorica**
$$\hat n_{ij}=\dfrac{R_i\cdot C_j}{N}$$`, proof: [
          R`Se i caratteri sono indipendenti, la frazione di individui con la modalità $j$ è la stessa in ogni riga, e quindi è uguale a quella sul totale: $\dfrac{n_{ij}}{R_i}=\dfrac{C_j}{N}$.`,
          R`Moltiplicando per $R_i$ si ottiene $n_{ij}=\dfrac{R_i\cdot C_j}{N}$.`,
          R`Viceversa, se vale questa uguaglianza per ogni casella, dividendo per $R_i$ si ritrova che la frazione $\dfrac{n_{ij}}{R_i}$ non dipende dalla riga.`,
        ] },
        { t: 'def', title: 'Misurare la dipendenza: il chi quadrato', md: R`Le differenze $n_{ij}-\hat n_{ij}$ tra frequenze osservate e teoriche si chiamano **contingenze**. L'indice
$$\chi^2=\sum\dfrac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}$$
vale $0$ in caso di indipendenza e cresce al crescere della dipendenza. Il suo valore massimo è $N\cdot\min(r-1;\,c-1)$, dove $r$ e $c$ sono il numero di righe e di colonne: dividendo $\chi^2$ per questo massimo si ottiene un indice **normalizzato** compreso tra $0$ e $1$.` },
        {
          t: 'ex',
          title: R`Su $100$ studenti: tra i $50$ maschi $30$ praticano sport e $20$ no; tra le $50$ femmine $20$ sì e $30$ no. I due caratteri sono indipendenti?`,
          steps: [
            R`Totali di colonna: sport sì $50$, sport no $50$. Totali di riga: $50$ e $50$.`,
            R`Frequenze teoriche: $\dfrac{50\cdot50}{100}=25$ in ogni casella.`,
            R`Le frequenze osservate ($30,20,20,30$) sono diverse da $25$: i caratteri **non** sono indipendenti.`,
            R`$\chi^2=4\cdot\dfrac{5^2}{25}=4$. Il massimo è $100\cdot1=100$: l'indice normalizzato vale $0{,}04$, una dipendenza debole.`,
          ],
        },
        { t: 'warn', md: R`Dipendenza statistica **non** significa rapporto di causa-effetto. Due caratteri possono risultare legati perché dipendono entrambi da un terzo fattore non rilevato, o semplicemente per caso se i dati sono pochi.` },
        {
          t: 'quiz',
          q: R`In una tabella con totali di riga $40$ e $60$, totali di colonna $30$ e $70$ ($N=100$), qual è la frequenza teorica di indipendenza della casella in alto a sinistra?`,
          options: [
            { md: R`$12$`, ok: true, why: R`Giusto: $\dfrac{40\cdot30}{100}=12$.` },
            { md: R`$35$`, why: R`Non si fa la media dei due totali: si moltiplicano e si divide per $N$.` },
            { md: R`$1200$`, why: R`Manca la divisione per il totale $N=100$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'sta-moda',
      level: 1,
      title: 'Moda',
      make: (r) => {
        const m = int(r, 2, 10);
        const others = shuffle(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => v !== m)).slice(0, 4);
        const data = shuffle(r, [m, m, m, others[0], others[0], others[1], others[2], others[3]]);
        return {
          text: R`Qual è la moda dei dati $${data.join(',\\ ')}$?`,
          answer: m,
          tol: 0,
          hints: ['La moda è il valore che compare più volte.'],
          solution: [R`Il valore $${m}$ compare $3$ volte, più di ogni altro: la moda è $${m}$.`],
        };
      },
    },
    {
      id: 'sta-campo',
      level: 1,
      title: 'Campo di variazione',
      make: (r) => {
        const lo = int(r, 1, 30), hi = lo + int(r, 8, 40);
        const mid = Array.from({ length: 5 }, () => int(r, lo + 1, hi - 1));
        const data = shuffle(r, [lo, hi, ...mid]);
        return {
          text: R`Calcola il campo di variazione dei dati $${data.join(',\\ ')}$.`,
          answer: hi - lo,
          tol: 0,
          hints: ['Il campo di variazione è la differenza tra il dato più grande e il più piccolo.'],
          solution: [R`Massimo $${hi}$, minimo $${lo}$.`, R`Campo di variazione: $${hi}-${lo}=${hi - lo}$.`],
        };
      },
    },
    {
      id: 'sta-angolo',
      level: 1,
      title: 'Angolo in un areogramma',
      make: (r) => {
        const N = pick(r, [20, 24, 30, 36, 40, 60, 72, 90, 120]), f = int(r, 1, Math.floor(N / 2));
        return {
          text: R`In un'indagine su $${N}$ persone, $${f}$ hanno scelto la risposta A. In un areogramma, quanti gradi misura il settore della risposta A?`,
          answer: (360 * f) / N,
          tol: 0,
          hints: [R`L'angolo è proporzionale alla frequenza: $\alpha=\dfrac{n}{N}\cdot360°$.`],
          solution: [R`$\alpha=\dfrac{${f}}{${N}}\cdot360°=${(360 * f) / N}°$.`],
        };
      },
    },
    {
      id: 'sta-cumulata',
      level: 1,
      title: 'Frequenza cumulata',
      make: (r) => {
        const f = Array.from({ length: 5 }, () => int(r, 1, 7));
        const v = int(r, 5, 7);
        const cum = f.slice(0, v - 3).reduce((s, x) => s + x, 0);
        return {
          text: R`In una verifica i voti sono stati: $${f[0]}$ studenti con $4$, $${f[1]}$ con $5$, $${f[2]}$ con $6$, $${f[3]}$ con $7$, $${f[4]}$ con $8$. Quanti studenti hanno preso un voto **minore o uguale** a $${v}$?`,
          answer: cum,
          tol: 0,
          hints: [R`Somma le frequenze di tutti i voti fino a $${v}$ compreso: è la frequenza cumulata.`],
          solution: [R`$${f.slice(0, v - 3).join('+')}=${cum}$.`],
        };
      },
    },
    {
      id: 'sta-densita',
      level: 2,
      title: 'Altezza di un rettangolo dell\'istogramma',
      make: (r) => {
        const w = pick(r, [5, 10, 20, 25]), d = int(r, 1, 6), lo = int(r, 0, 8) * 10;
        return {
          text: R`In un istogramma la classe $[${lo};${lo + w})$ ha frequenza $${w * d}$. Qual è la sua densità di frequenza, cioè l'altezza del rettangolo?`,
          answer: d,
          tol: 0,
          hints: [R`L'area del rettangolo rappresenta la frequenza: altezza $=\dfrac{\text{frequenza}}{\text{ampiezza}}$.`, R`L'ampiezza della classe è $${w}$.`],
          solution: [R`Ampiezza: $${lo + w}-${lo}=${w}$.`, R`Densità: $\dfrac{${w * d}}{${w}}=${d}$.`],
        };
      },
    },
    {
      id: 'sta-media-classi',
      level: 2,
      title: 'Media di dati raggruppati in classi',
      make: (r) => {
        const f1 = int(r, 1, 4), f2 = int(r, 1, 4), f3 = 10 - f1 - f2, base = int(r, 0, 5) * 10;
        const c = [base + 5, base + 15, base + 25];
        const tot = c[0] * f1 + c[1] * f2 + c[2] * f3;
        return {
          text: R`Dieci dati sono raggruppati in classi: $${f1}$ in $[${base};${base + 10})$, $${f2}$ in $[${base + 10};${base + 20})$, $${f3}$ in $[${base + 20};${base + 30})$. Calcola la media usando i valori centrali.`,
          answer: tot / 10,
          tol: 0,
          hints: [R`I valori centrali sono $${c[0]}$, $${c[1]}$, $${c[2]}$.`, R`$\bar x=\dfrac{\sum c_i n_i}{N}$.`],
          solution: [R`$\sum c_in_i=${c[0]}\cdot${f1}+${c[1]}\cdot${f2}+${c[2]}\cdot${f3}=${tot}$.`, R`$\bar x=\dfrac{${tot}}{10}=${tot / 10}$.`],
        };
      },
    },
    {
      id: 'sta-quartili',
      level: 2,
      title: 'Scarto interquartile',
      make: (r) => {
        const n = pick(r, [7, 11]);
        const s: number[] = [int(r, 1, 9)];
        for (let i = 1; i < n; i++) s.push(s[i - 1] + int(r, 1, 4));
        const q1 = s[(n + 1) / 4 - 1], q3 = s[(3 * (n + 1)) / 4 - 1], me = s[(n - 1) / 2];
        return {
          text: R`Calcola lo scarto interquartile $Q_3-Q_1$ dei dati $${shuffle(r, s).join(',\\ ')}$.`,
          answer: q3 - q1,
          tol: 0,
          hints: ['Ordina i dati in senso crescente e trova la mediana.', R`$Q_1$ è la mediana della metà inferiore, $Q_3$ quella della metà superiore (mediana esclusa).`],
          solution: [R`Dati ordinati: $${s.join(',\\ ')}$. Mediana: $${me}$.`, R`$Q_1=${q1}$ e $Q_3=${q3}$.`, R`Scarto interquartile: $${q3}-${q1}=${q3 - q1}$.`],
        };
      },
    },
    {
      id: 'sta-anomalo',
      level: 3,
      title: 'Soglia dei valori anomali',
      make: (r) => {
        const q1 = int(r, 5, 40), iqr = int(r, 2, 10) * 2, q3 = q1 + iqr;
        return {
          text: R`Una distribuzione ha $Q_1=${q1}$ e $Q_3=${q3}$. Oltre quale valore un dato è considerato **anomalo verso l'alto**, secondo la regola di una volta e mezza lo scarto interquartile?`,
          answer: q3 + 1.5 * iqr,
          tol: 0,
          hints: [R`Scarto interquartile: $Q_3-Q_1$.`, R`Soglia superiore: $Q_3+1{,}5\,(Q_3-Q_1)$.`],
          solution: [R`$Q_3-Q_1=${iqr}$.`, R`Soglia: $${q3}+1{,}5\cdot${iqr}=${q3}+${1.5 * iqr}=${q3 + 1.5 * iqr}$.`],
        };
      },
    },
    {
      id: 'sta-cv',
      level: 2,
      title: 'Coefficiente di variazione',
      make: (r) => {
        const mu = pick(r, [20, 25, 40, 50, 80, 200]), cv = pick(r, [5, 10, 15, 20, 25, 40]);
        const sigma = (mu * cv) / 100;
        return {
          text: R`Una distribuzione ha media $${mu}$ e deviazione standard $${dec(sigma)}$. Quanto vale il coefficiente di variazione, espresso **in percentuale**?`,
          answer: cv,
          tol: 0,
          hints: [R`$CV=\dfrac{\sigma}{\bar x}$.`, 'Moltiplica per $100$ per esprimerlo in percentuale.'],
          solution: [R`$CV=\dfrac{${dec(sigma)}}{${mu}}=${dec(cv / 100)}=${cv}\%$.`],
        };
      },
    },
    {
      id: 'sta-condizionata',
      level: 2,
      title: 'Frequenza condizionata',
      make: (r) => {
        const row = pick(r, [20, 25, 40, 50]), pct = pick(r, [20, 40, 60, 80]);
        const a = (row * pct) / 100, c = int(r, 5, 30), d = int(r, 5, 30);
        return {
          text: R`In un'indagine: tra i maschi $${a}$ praticano sport e $${row - a}$ no; tra le femmine $${c}$ praticano sport e $${d}$ no. Qual è la **percentuale** di sportivi **tra i maschi**?`,
          answer: pct,
          tol: 0,
          hints: ['È una frequenza condizionata: considera solo la riga dei maschi.', R`I maschi sono in tutto $${row}$.`],
          solution: [R`Maschi: $${a}+${row - a}=${row}$.`, R`$\dfrac{${a}}{${row}}=${dec(pct / 100)}=${pct}\%$. I dati sulle femmine non servono.`],
        };
      },
    },
    {
      id: 'sta-chi2',
      level: 3,
      title: 'Chi quadrato',
      make: (r) => {
        const [n, d] = pick(r, [[20, 5], [40, 5], [40, 10], [80, 10], [80, 20]] as const);
        const e = n / 2, s = nz(r, -1, 1);
        const a = e + s * d, b = e - s * d;
        return {
          text: R`In una tabella a doppia entrata $2\times2$ le frequenze osservate sono: prima riga $${a}$ e $${b}$, seconda riga $${b}$ e $${a}$. Calcola l'indice $\chi^2$.`,
          answer: (4 * d * d) / e,
          tol: 0.01,
          hints: [R`Tutti i totali di riga e di colonna valgono $${n}$ e $N=${2 * n}$: le frequenze teoriche sono tutte $\dfrac{${n}\cdot${n}}{${2 * n}}=${e}$.`, R`$\chi^2=\sum\dfrac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}$: le quattro caselle danno lo stesso contributo.`],
          solution: [R`Frequenze teoriche: $\hat n=${e}$ in ogni casella.`, R`Ogni contingenza vale $\pm${d}$: contributo $\dfrac{${d * d}}{${e}}$ per casella.`, R`$\chi^2=4\cdot\dfrac{${d * d}}{${e}}=${dec((4 * d * d) / e)}$.`],
        };
      },
    },
  ],
};
