import { choice, dec, int, m, mc, nz, pick, shuffle } from '../../lib/gen';
import type { Shape, Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const mean = (xs: number[]) => sum(xs) / xs.length;
const list = (xs: number[]) => xs.join(';\\ ');

/** Scarti fissi usati nel grafico di dispersione (somma nulla, non correlati con x). */
const NOISE = [1, -1.5, 0.5, 2, -2, -0.5, 1.5, -1, 0.5, -0.5];

function stats(xs: number[], ys: number[]) {
  const mx = mean(xs), my = mean(ys);
  const sxy = sum(xs.map((x, i) => (x - mx) * (ys[i] - my)));
  const sxx = sum(xs.map((x) => (x - mx) ** 2)), syy = sum(ys.map((y) => (y - my) ** 2));
  return { mx, my, b: sxy / sxx, r: syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy) };
}

export const statistica: Unit = {
  id: 'a3-statistica',
  year: 3,
  title: 'Statistica',
  summary: 'Indici di posizione e variabilità, dati bivariati, correlazione e regressione.',
  lessons: [
    {
      id: 'a3-sta-1',
      title: 'Indici di posizione e di variabilità',
      blocks: [
        { t: 'idea', md: R`Due classi hanno entrambe la media del $6$: in una tutti hanno $6$, nell'altra metà ha $3$ e metà ha $9$. La media da sola non basta: servono numeri che dicano **dove** si collocano i dati (posizione) e **quanto** sono sparsi (variabilità).` },
        { t: 'def', title: 'Indici di posizione', md: R`Dati $x_1,x_2,\dots,x_n$:
- **Media aritmetica:** $\bar x=\dfrac{x_1+x_2+\dots+x_n}{n}$. Con frequenze $f_i$: $\bar x=\dfrac{\sum x_if_i}{\sum f_i}$ (media **ponderata**).
- **Mediana:** il valore centrale dei dati **ordinati** (se $n$ è pari, la media dei due valori centrali). Non risente dei valori anomali.
- **Moda:** il valore con la frequenza più alta.` },
        { t: 'def', title: 'Indici di variabilità', md: R`- **Campo di variazione:** massimo $-$ minimo.
- **Varianza:** media dei quadrati degli scarti dalla media $$\sigma^2=\frac{\sum_{i=1}^n(x_i-\bar x)^2}{n}$$
- **Deviazione standard** (scarto quadratico medio): $\sigma=\sqrt{\sigma^2}$, espressa nella stessa unità di misura dei dati.
- **Coefficiente di variazione:** $CV=\dfrac{\sigma}{\bar x}$, utile per confrontare la variabilità di grandezze diverse.` },
        {
          t: 'thm',
          title: 'Formula rapida per la varianza',
          md: R`$$\sigma^2=\frac{\sum x_i^2}{n}-\bar x^{\,2}$$ cioè "media dei quadrati meno quadrato della media".`,
          proof: [
            R`Sviluppiamo il quadrato: $\sum(x_i-\bar x)^2=\sum x_i^2-2\bar x\sum x_i+n\bar x^{\,2}$.`,
            R`Poiché $\sum x_i=n\bar x$, il secondo termine vale $-2n\bar x^{\,2}$: in totale $\sum x_i^2-n\bar x^{\,2}$.`,
            R`Dividendo per $n$: $\sigma^2=\dfrac{\sum x_i^2}{n}-\bar x^{\,2}$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Calcola media, mediana, varianza e deviazione standard dei dati $2;\ 4;\ 4;\ 5;\ 10$.`,
          steps: [R`Media: $\bar x=\dfrac{2+4+4+5+10}{5}=5$.`, R`Mediana: i dati sono già ordinati, il valore centrale (il terzo) è $4$. Nota: è minore della media, "tirata su" dal valore $10$.`, R`Scarti dalla media: $-3;\ -1;\ -1;\ 0;\ 5$. Quadrati: $9;\ 1;\ 1;\ 0;\ 25$, somma $36$.`, R`$\sigma^2=\dfrac{36}{5}=7{,}2$ e $\sigma=\sqrt{7{,}2}\approx2{,}68$.`],
        },
        { t: 'def', title: 'Trasformazioni dei dati', md: R`Se a tutti i dati si **aggiunge** una costante $k$: la media aumenta di $k$, la deviazione standard **non cambia**.

Se tutti i dati si **moltiplicano** per $k$: la media viene moltiplicata per $k$, la deviazione standard per $|k|$ (e la varianza per $k^2$).` },
        { t: 'warn', md: R`Per trovare la mediana bisogna **prima ordinare** i dati. E la somma degli scarti dalla media è sempre zero: per questo, per misurare la dispersione, gli scarti si elevano al quadrato.` },
        {
          t: 'quiz',
          q: R`Gli stipendi di $5$ persone sono $1200,\ 1300,\ 1300,\ 1400,\ 9000$ euro. Quale indice descrive meglio lo stipendio "tipico"?`,
          options: [
            { md: 'La mediana', ok: true, why: 'Esatto: vale $1300$ e non risente del valore anomalo $9000$.' },
            { md: 'La media', why: 'La media vale $2840$: è molto influenzata dal valore anomalo e non rappresenta nessuno dei cinque.' },
            { md: 'Il campo di variazione', why: 'È un indice di variabilità, non di posizione.' },
          ],
        },
      ],
    },
    {
      id: 'a3-sta-2',
      title: 'Dati bivariati: correlazione e regressione',
      blocks: [
        { t: 'idea', md: R`Chi studia di più prende voti più alti? Per rispondere si rilevano **due caratteri** sulla stessa persona e si rappresentano le coppie come punti nel piano (**diagramma di dispersione**). Se la nuvola di punti si dispone attorno a una retta, tra i due caratteri c'è una relazione lineare.` },
        { t: 'def', title: 'Distribuzioni doppie', md: R`Una **tabella a doppia entrata** riporta le frequenze congiunte di due caratteri $X$ e $Y$; i totali di riga e di colonna sono le **frequenze marginali**.

$X$ e $Y$ sono **indipendenti** se ogni frequenza congiunta è uguale al prodotto delle marginali diviso il totale: $$n_{ij}=\frac{n_{i\cdot}\;n_{\cdot j}}{N}$$ Altrimenti c'è **dipendenza** (connessione).` },
        { t: 'def', title: 'Covarianza e coefficiente di correlazione', md: R`**Covarianza:** $$\sigma_{xy}=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{n}=\frac{\sum x_iy_i}{n}-\bar x\,\bar y$$ È positiva se $X$ e $Y$ tendono a crescere insieme, negativa se al crescere dell'una l'altra diminuisce.

**Coefficiente di correlazione lineare (di Pearson):** $$r=\frac{\sigma_{xy}}{\sigma_x\,\sigma_y}\qquad -1\le r\le1$$
- $r$ vicino a $1$: forte correlazione lineare **positiva**
- $r$ vicino a $-1$: forte correlazione lineare **negativa**
- $r$ vicino a $0$: assenza di correlazione **lineare**` },
        {
          t: 'plot',
          title: 'Nuvola di punti e retta di regressione',
          caption: R`Aumenta la dispersione: i punti si allontanano dalla retta di regressione (in colore) e $|r|$ diminuisce.`,
          view: [0, 11, -2, 14],
          params: [
            { name: 'm', label: 'pendenza', min: -1, max: 1, step: 0.25, value: 0.75 },
            { name: 's', label: 'dispersione', min: 0, max: 2.5, step: 0.25, value: 1 },
          ],
          draw: (p) => {
            const xs = NOISE.map((_, i) => i + 1), ys = xs.map((x, i) => 6 + p.m * (x - 5.5) + p.s * NOISE[i]);
            const st = stats(xs, ys);
            return [...xs.map((x, i): Shape => ({ k: 'pt', x, y: ys[i] })), { k: 'fn', f: (x) => st.my + st.b * (x - st.mx) }];
          },
          readout: (p) => {
            const xs = NOISE.map((_, i) => i + 1), ys = xs.map((x, i) => 6 + p.m * (x - 5.5) + p.s * NOISE[i]);
            const st = stats(xs, ys);
            return `$r\\approx${d(st.r)}$ — retta di regressione: $y\\approx${d(st.my - st.b * st.mx)}${st.b >= 0 ? '+' : ''}${d(st.b)}\\,x$`;
          },
        },
        { t: 'def', title: 'Retta di regressione', md: R`La **retta di regressione** di $Y$ su $X$ è la retta che meglio approssima la nuvola di punti (rende minima la somma dei quadrati degli scarti verticali — **metodo dei minimi quadrati**): $$y-\bar y=b\,(x-\bar x)\qquad\text{con}\quad b=\frac{\sigma_{xy}}{\sigma_x^2}$$ Passa sempre per il **baricentro** $(\bar x;\bar y)$. Serve a fare **previsioni** di $Y$ per valori di $X$ interni all'intervallo osservato.` },
        {
          t: 'ex',
          title: R`Ore di studio $X$: $1;2;3;4;5$. Voti $Y$: $4;5;7;7;7$. Trova la retta di regressione.`,
          steps: [R`Medie: $\bar x=3$, $\bar y=6$.`, R`Scarti di $X$: $-2;-1;0;1;2$; scarti di $Y$: $-2;-1;1;1;1$. Prodotti: $4;1;0;1;2$, somma $8$.`, R`$\sigma_{xy}=\dfrac85=1{,}6$; $\sigma_x^2=\dfrac{4+1+0+1+4}{5}=2$.`, R`$b=\dfrac{1{,}6}{2}=0{,}8$. Retta: $y-6=0{,}8(x-3)$, cioè $y=0{,}8x+3{,}6$.`, R`Previsione per $x=3{,}5$ ore: $y=0{,}8\cdot3{,}5+3{,}6=6{,}4$.`],
        },
        { t: 'warn', md: R`**Correlazione non significa causalità.** Le vendite di gelati e gli annegamenti sono correlati, ma nessuno dei due causa l'altro: dipendono entrambi dalla stagione calda. Inoltre $r\approx0$ esclude solo un legame **lineare**: potrebbe esisterne uno di altro tipo.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'sta-media',
      level: 1,
      title: 'Media aritmetica',
      make: (r) => {
        const n = pick(r, [4, 5, 6]), mu = int(r, 11, 18);
        const xs = Array.from({ length: n - 1 }, () => mu + int(r, -2, 2));
        xs.push(mu * n - sum(xs));
        const data = shuffle(r, xs);
        return {
          text: `Calcola la media aritmetica dei dati: ${m(list(data))}.`,
          answer: mu,
          tol: 0,
          hints: ['Somma tutti i dati e dividi per il loro numero.'],
          solution: [`Somma: ${m(sum(data))}. Numero di dati: ${m(n)}.`, `${m(`\\bar x=\\dfrac{${sum(data)}}{${n}}=${mu}`)}`],
        };
      },
    },
    {
      id: 'sta-mediana',
      level: 1,
      title: 'Mediana',
      make: (r) => {
        const n = pick(r, [5, 6, 7, 8]);
        const sorted = Array.from({ length: n }, () => int(r, 1, 20)).sort((a, b) => a - b);
        if (n % 2 === 0 && (sorted[n / 2 - 1] + sorted[n / 2]) % 2 !== 0) sorted[n / 2] += 1; // mediana intera
        sorted.sort((a, b) => a - b);
        const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        const data = shuffle(r, sorted);
        return {
          text: `Calcola la mediana dei dati: ${m(list(data))}.`,
          answer: med,
          tol: 0,
          hints: ['Prima ordina i dati in ordine crescente.', n % 2 ? 'I dati sono in numero dispari: la mediana è il valore centrale.' : 'I dati sono in numero pari: la mediana è la media dei due valori centrali.'],
          solution: [`Dati ordinati: ${m(list(sorted))}.`, n % 2 ? `Il valore centrale (posto ${(n + 1) / 2}) è ${m(med)}.` : `I due valori centrali sono ${m(sorted[n / 2 - 1])} e ${m(sorted[n / 2])}: la mediana è ${m(med)}.`],
        };
      },
    },
    {
      id: 'sta-ponderata',
      level: 1,
      title: 'Media ponderata',
      make: (r) => {
        const v = shuffle(r, [4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b);
        const f = [int(r, 1, 5), int(r, 1, 5), int(r, 1, 5)];
        const tot = sum(f), s = sum(v.map((x, i) => x * f[i]));
        return {
          text: `In una verifica ${m(f[0])} studenti hanno preso ${m(v[0])}, ${m(f[1])} studenti hanno preso ${m(v[1])} e ${m(f[2])} studenti hanno preso ${m(v[2])}. Qual è il voto medio? (Arrotonda ai centesimi.)`,
          answer: Math.round((s / tot) * 100) / 100,
          tol: 0.011,
          hints: ['Ogni voto va moltiplicato per la sua frequenza.', 'Dividi per il numero totale di studenti, non per $3$.'],
          solution: [`${m(`\\bar x=\\dfrac{${v.map((x, i) => `${x}\\cdot${f[i]}`).join('+')}}{${f.join('+')}}`)}`, `${m(`=\\dfrac{${s}}{${tot}}\\approx${dec(s / tot)}`)}`],
        };
      },
    },
    {
      id: 'sta-frequenza',
      level: 1,
      title: 'Frequenza relativa',
      make: (r) => {
        const tot = pick(r, [20, 25, 40, 50, 80]), pc = pick(r, [10, 20, 30, 40, 60]);
        const f = (tot * pc) / 100;
        return {
          text: `In un gruppo di ${m(tot)} studenti, ${m(f)} praticano uno sport di squadra. Qual è la frequenza relativa percentuale?`,
          answer: pc,
          tol: 0,
          hints: ['Frequenza relativa $=$ frequenza assoluta diviso il totale.', 'Per la percentuale moltiplica per $100$.'],
          solution: [`${m(`f=\\dfrac{${f}}{${tot}}=${dec(f / tot)}`)}`, `In percentuale: ${m(`${pc}\\%`)}.`],
        };
      },
    },
    {
      id: 'sta-varianza',
      level: 2,
      title: 'Varianza',
      make: (r) => {
        const mu = int(r, 3, 10), a = int(r, 1, 3), b = int(r, 0, 2);
        const xs = shuffle(r, [mu - a, mu + a, mu - b, mu + b, mu]);
        const ss = 2 * a * a + 2 * b * b;
        return {
          text: `Calcola la varianza dei dati: ${m(list(xs))}.`,
          answer: ss / 5,
          tol: 0.005,
          hints: ['Calcola prima la media.', 'Poi calcola gli scarti dalla media, elevali al quadrato e fanne la media.'],
          steps: [
            { ask: 'Quanto vale la media?', options: mc(r, m(mu), [], [m(mu + 1), m(mu - 1), m(mu + 2)]), explain: `${m(`\\bar x=\\dfrac{${sum(xs)}}{5}=${mu}`)}.` },
            { ask: 'Quanto vale la somma dei quadrati degli scarti dalla media?', options: mc(r, m(ss), [[m(0), 'La somma degli scarti (non elevati al quadrato) è sempre zero: qui servono i **quadrati**.'], [m(2 * a + 2 * b), 'Gli scarti vanno elevati al quadrato, non presi in valore assoluto.']], [m(ss + 2), m(ss + 4)]), explain: `Scarti: ${m(list(xs.map((x) => x - mu)))}; quadrati: ${m(list(xs.map((x) => (x - mu) ** 2)))}; somma ${m(ss)}.` },
            { ask: 'Quindi la varianza vale:', options: mc(r, m(dec(ss / 5)), [[m(ss), 'Bisogna dividere per il numero dei dati.'], [m(dec(Math.sqrt(ss / 5))), 'Questa è la deviazione standard (la radice della varianza).']], [m(dec(ss / 4)), m(dec(ss / 5 + 1))]), explain: `${m(`\\sigma^2=\\dfrac{${ss}}{5}=${dec(ss / 5)}`)}.` },
          ],
          solution: [`Media: ${m(`\\bar x=${mu}`)}.`, `Quadrati degli scarti: ${m(list(xs.map((x) => (x - mu) ** 2)))}, somma ${m(ss)}.`, `${m(`\\sigma^2=\\dfrac{${ss}}{5}=${dec(ss / 5)}`)}`],
        };
      },
    },
    {
      id: 'sta-devstd',
      level: 2,
      title: 'Deviazione standard',
      make: (r) => {
        const mu = int(r, 5, 12), k = int(r, 1, 4);
        const xs = shuffle(r, [mu - k, mu - k, mu + k, mu + k]);
        return {
          text: `Calcola la deviazione standard dei dati: ${m(list(xs))}.`,
          answer: k,
          tol: 0.005,
          hints: ['La deviazione standard è la radice quadrata della varianza.', `La media è ${m(mu)}: calcola gli scarti.`],
          solution: [`Media: ${m(mu)}. Ogni dato dista ${m(k)} dalla media: i quadrati degli scarti valgono tutti ${m(k * k)}.`, `${m(`\\sigma^2=\\dfrac{4\\cdot${k * k}}{4}=${k * k}`)}`, `${m(`\\sigma=\\sqrt{${k * k}}=${k}`)}`],
        };
      },
    },
    {
      id: 'sta-trasformazione',
      level: 2,
      title: 'Trasformazione dei dati',
      make: (r) => {
        const mu = int(r, 5, 9), s = int(r, 1, 3), k = int(r, 2, 4), add = r() < 0.5;
        const ans = (a: number, b: number) => m(`\\bar x=${a},\\ \\sigma=${b}`);
        return {
          text: add
            ? `Un insieme di dati ha media ${m(mu)} e deviazione standard ${m(s)}. Se a ogni dato si **aggiunge** ${m(k)}, quali sono la nuova media e la nuova deviazione standard?`
            : `Un insieme di dati ha media ${m(mu)} e deviazione standard ${m(s)}. Se ogni dato viene **moltiplicato** per ${m(k)}, quali sono la nuova media e la nuova deviazione standard?`,
          options: mc(r, add ? ans(mu + k, s) : ans(mu * k, s * k), [
            [add ? ans(mu + k, s + k) : ans(mu * k, s), add ? 'Traslando tutti i dati la dispersione non cambia: la deviazione standard resta la stessa.' : 'Moltiplicando i dati anche gli scarti dalla media vengono moltiplicati: la deviazione standard cambia.'],
            [add ? ans(mu, s) : ans(mu * k, s * k * k), add ? 'La media si sposta insieme ai dati.' : 'È la **varianza** a essere moltiplicata per $k^2$; la deviazione standard per $k$.'],
            [add ? ans(mu * k, s * k) : ans(mu + k, s), 'Hai confuso l\'effetto dell\'addizione con quello della moltiplicazione.'],
          ]),
          hints: [add ? 'Aggiungere una costante trasla tutti i dati senza cambiarne le distanze reciproche.' : 'Moltiplicare per una costante "dilata" sia i dati sia le loro distanze dalla media.'],
          solution: add ? [`La media aumenta di ${m(k)}: ${m(mu + k)}.`, `Gli scarti dalla media non cambiano: ${m(`\\sigma=${s}`)}.`] : [`La media viene moltiplicata per ${m(k)}: ${m(mu * k)}.`, `Anche gli scarti vengono moltiplicati per ${m(k)}: ${m(`\\sigma=${s * k}`)}.`],
        };
      },
    },
    {
      id: 'sta-correlazione',
      level: 2,
      title: 'Interpretare il coefficiente di correlazione',
      make: (r) => {
        const [val, lab, why] = pick(r, [
          ['0{,}95', 'Forte correlazione lineare positiva', 'è vicino a $1$'],
          ['-0{,}92', 'Forte correlazione lineare negativa', 'è vicino a $-1$'],
          ['0{,}04', 'Correlazione lineare praticamente assente', 'è vicino a $0$'],
          ['-0{,}97', 'Forte correlazione lineare negativa', 'è vicino a $-1$'],
          ['0{,}88', 'Forte correlazione lineare positiva', 'è vicino a $1$'],
          ['-0{,}03', 'Correlazione lineare praticamente assente', 'è vicino a $0$'],
        ] as const);
        const all = ['Forte correlazione lineare positiva', 'Forte correlazione lineare negativa', 'Correlazione lineare praticamente assente'];
        return {
          text: `Per due caratteri $X$ e $Y$ si è trovato un coefficiente di correlazione lineare ${m(`r=${val}`)}. Come si interpreta?`,
          options: choice(r, [[lab, `Corretto: $r$ ${why}.`], ...all.filter((x) => x !== lab).map((x): [string, string] => [x, `Guarda segno e valore assoluto di $r$: qui $r$ ${why}.`]), ['$X$ è la causa di $Y$', 'La correlazione non dice nulla sulla causalità.']]),
          hints: ['Il segno di $r$ indica il verso della relazione, il valore assoluto la sua intensità.'],
          solution: [`${m(`r=${val}`)} ${why}.`, `Quindi: ${lab.toLowerCase()}.`],
        };
      },
    },
    {
      id: 'sta-previsione',
      level: 1,
      title: 'Previsione con la retta di regressione',
      make: (r) => {
        const b = pick(r, [0.5, 0.8, 1.2, 1.5, 2, -0.5, -1.5]), a = int(r, 2, 20), x0 = int(r, 2, 10);
        const y = a + b * x0;
        return {
          text: `La retta di regressione di $Y$ su $X$ è ${m(`y=${dec(b)}x+${a}`)}. Quale valore di $Y$ si prevede per ${m(`x=${x0}`)}?`,
          answer: Math.round(y * 100) / 100,
          tol: 0.005,
          hints: ['Sostituisci il valore di $x$ nell\'equazione della retta.'],
          solution: [`${m(`y=${dec(b)}\\cdot${x0}+${a}=${dec(y)}`)}`],
        };
      },
    },
    {
      id: 'sta-covarianza',
      level: 3,
      title: 'Covarianza',
      make: (r) => {
        const mx = int(r, 2, 6), my = int(r, 3, 8), a = int(r, 1, 3), c = nz(r, -3, 3);
        const xs = [mx - a, mx, mx + a], ys = [my - c, my, my + c];
        const cov = (2 * a * c) / 3;
        return {
          text: `Calcola la covarianza dei dati: $X$: ${m(list(xs))}; $Y$: ${m(list(ys))}. (Arrotonda ai centesimi.)`,
          answer: Math.round(cov * 100) / 100,
          tol: 0.011,
          hints: ['Calcola le medie di $X$ e di $Y$.', 'Moltiplica tra loro gli scarti corrispondenti e fai la media dei prodotti.'],
          solution: [`${m(`\\bar x=${mx}`)}, ${m(`\\bar y=${my}`)}.`, `Scarti di $X$: ${m(list(xs.map((x) => x - mx)))}; scarti di $Y$: ${m(list(ys.map((y) => y - my)))}.`, `Prodotti: ${m(list(xs.map((x, i) => (x - mx) * (ys[i] - my))))}; ${m(`\\sigma_{xy}=\\dfrac{${2 * a * c}}{3}\\approx${dec(cov)}`)}.`, `La covarianza è ${cov > 0 ? 'positiva: $X$ e $Y$ crescono insieme' : 'negativa: al crescere di $X$, $Y$ diminuisce'}.`],
        };
      },
    },
    {
      id: 'sta-regressione',
      level: 3,
      title: 'Coefficiente di regressione',
      make: (r) => {
        const base = int(r, 2, 8);
        const ys = [0, 1, 2, 3, 4].map((x) => base + pick(r, [1, 2, -1]) * x + int(r, -1, 1));
        const xs = [1, 2, 3, 4, 5];
        const my = mean(ys);
        const sxy = sum(xs.map((x, i) => (x - 3) * (ys[i] - my)));
        const b = sxy / 10;
        return {
          text: `Dati $X$: ${m(list(xs))} e $Y$: ${m(list(ys))}, calcola il coefficiente angolare $b$ della retta di regressione di $Y$ su $X$.`,
          answer: Math.round(b * 100) / 100,
          tol: 0.011,
          hints: [R`$b=\dfrac{\sigma_{xy}}{\sigma_x^2}=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}$.`, `${m('\\bar x=3')}: gli scarti di $X$ sono ${m('-2;-1;0;1;2')}.`],
          solution: [`${m('\\bar x=3')}, ${m(`\\bar y=${dec(my)}`)}.`, `${m(`\\sum(x_i-\\bar x)^2=4+1+0+1+4=10`)}`, `${m(`\\sum(x_i-\\bar x)(y_i-\\bar y)=${dec(sxy)}`)}`, `${m(`b=\\dfrac{${dec(sxy)}}{10}=${dec(b)}`)}`],
        };
      },
    },
    {
      id: 'sta-indipendenza',
      level: 3,
      title: 'Frequenza teorica di indipendenza',
      make: (r) => {
        const N = pick(r, [100, 200]), r1 = pick(r, [20, 40, 50, 60]) * (N / 100), c1 = pick(r, [10, 30, 50, 70]) * (N / 100);
        const e = (r1 * c1) / N;
        return {
          text: `In un'indagine su ${m(N)} persone, ${m(r1)} sono fumatori e ${m(c1)} praticano sport. Se i due caratteri fossero **indipendenti**, quanti fumatori sportivi ci si aspetterebbe?`,
          answer: e,
          tol: 0,
          hints: [R`In caso di indipendenza: $n_{ij}=\dfrac{n_{i\cdot}\;n_{\cdot j}}{N}$.`],
          solution: [`${m(`n=\\dfrac{${r1}\\cdot${c1}}{${N}}=${e}`)}`, 'Se la frequenza osservata è molto diversa da questo valore, i due caratteri sono dipendenti.'],
        };
      },
    },
  ],
};
