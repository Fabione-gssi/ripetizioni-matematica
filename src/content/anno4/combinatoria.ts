import { choice, int, m, mc, pick } from '../../lib/gen';
import type { Shape, Unit } from '../../lib/types';

const R = String.raw;
export const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
export const binom = (n: number, k: number): number => {
  let v = 1;
  for (let i = 1; i <= k; i++) v = (v * (n - k + i)) / i;
  return Math.round(v);
};
const disp = (n: number, k: number) => fact(n) / fact(n - k);

export const combinatoria: Unit = {
  id: 'a4-combinatoria',
  year: 4,
  title: 'Calcolo combinatorio',
  summary: 'Disposizioni, permutazioni, combinazioni, coefficienti binomiali, binomio di Newton.',
  lessons: [
    {
      id: 'a4-cmb-1',
      title: 'Contare con ordine: disposizioni e permutazioni',
      blocks: [
        { t: 'idea', md: R`Quante password, quante targhe, quante classifiche possibili? Elencarle tutte è impensabile: il calcolo combinatorio insegna a **contare senza elencare**. Le due domande da farsi sempre sono: **conta l'ordine?** Gli elementi **possono ripetersi?**` },
        { t: 'def', title: 'Principio fondamentale del calcolo combinatorio', md: R`Se una scelta si può fare in $n_1$ modi e, per ciascuno di essi, una seconda scelta si può fare in $n_2$ modi, allora le due scelte insieme si possono fare in $n_1\cdot n_2$ modi (e così via per più scelte).

Esempio: con $3$ magliette e $4$ pantaloni si formano $3\cdot4=12$ abbinamenti.` },
        { t: 'def', title: 'Disposizioni', md: R`Le **disposizioni** sono raggruppamenti **ordinati** di $k$ elementi scelti tra $n$.
- **Semplici** (senza ripetizioni, $k\le n$): $$D_{n,k}=n(n-1)(n-2)\cdots(n-k+1)=\frac{n!}{(n-k)!}$$
- **Con ripetizione:** $$D'_{n,k}=n^k$$

Il **fattoriale** è $n!=n\cdot(n-1)\cdots2\cdot1$, con $0!=1$.` },
        { t: 'def', title: 'Permutazioni', md: R`Le **permutazioni** sono gli ordinamenti di **tutti** gli $n$ elementi:
- **semplici:** $P_n=n!$
- **con ripetizione** (un elemento compare $a$ volte, un altro $b$ volte, …): $$P_n^{(a,b,\dots)}=\frac{n!}{a!\;b!\cdots}$$` },
        {
          t: 'plot',
          title: 'Quanto cresce il fattoriale',
          caption: R`I punti mostrano $n!$ (in rosso) e $2^n$ (in blu): il fattoriale cresce molto più in fretta di qualsiasi esponenziale.`,
          view: [0, 8.5, -50, 800],
          params: [{ name: 'n', label: 'n', min: 1, max: 8, step: 1, value: 6 }],
          draw: (p) => Array.from({ length: p.n }, (_, i): Shape[] => [{ k: 'pt', x: i + 1, y: fact(i + 1), color: 'var(--plot-2)' }, { k: 'pt', x: i + 1, y: 2 ** (i + 1), color: 'var(--plot-1)' }]).flat(),
          readout: (p) => `$${p.n}!=${fact(p.n)}$, $\\ 2^{${p.n}}=${2 ** p.n}$`,
        },
        {
          t: 'ex',
          title: R`Quanti sono gli anagrammi (anche senza significato) della parola MAMMA?`,
          steps: [R`Le lettere sono $5$: la M compare $3$ volte, la A $2$ volte.`, R`Se fossero tutte diverse gli ordinamenti sarebbero $5!=120$; ma scambiando tra loro le M ($3!$ modi) o le A ($2!$ modi) la parola non cambia.`, R`$\dfrac{5!}{3!\,2!}=\dfrac{120}{6\cdot2}=10$.`],
        },
        {
          t: 'ex',
          title: R`In una gara con $8$ atleti, in quanti modi si può comporre il podio (oro, argento, bronzo)?`,
          steps: [R`L'ordine conta (oro ≠ argento) e non ci sono ripetizioni: disposizioni semplici.`, R`$D_{8,3}=8\cdot7\cdot6=336$.`],
        },
        { t: 'warn', md: R`$0!=1$ per definizione (c'è un solo modo di ordinare zero oggetti). E attenzione: $(n-k)!$ non è $n!-k!$.` },
      ],
    },
    {
      id: 'a4-cmb-2',
      title: 'Contare senza ordine: combinazioni e binomio di Newton',
      blocks: [
        { t: 'idea', md: R`Scegliere tre amici da invitare non è come assegnare tre medaglie: nell'invito **l'ordine non conta**. Ogni gruppo di tre persone corrisponde a $3!=6$ podi diversi: per contare i gruppi basta dividere il numero dei podi per $6$.` },
        {
          t: 'thm',
          title: 'Combinazioni semplici',
          md: R`Le **combinazioni** sono i raggruppamenti **non ordinati** di $k$ elementi distinti scelti tra $n$: $$C_{n,k}=\binom nk=\frac{D_{n,k}}{k!}=\frac{n!}{k!\,(n-k)!}$$ Il simbolo $\dbinom nk$ si chiama **coefficiente binomiale**.`,
          proof: [R`Ogni combinazione di $k$ elementi può essere ordinata in $k!$ modi diversi, dando origine a $k!$ disposizioni distinte.`, R`Quindi $D_{n,k}=C_{n,k}\cdot k!$, da cui $C_{n,k}=\dfrac{D_{n,k}}{k!}$.`, R`Sostituendo $D_{n,k}=\dfrac{n!}{(n-k)!}$ si ottiene $C_{n,k}=\dfrac{n!}{k!\,(n-k)!}$.`],
        },
        { t: 'def', title: 'Proprietà dei coefficienti binomiali', md: R`- $\dbinom n0=\dbinom nn=1$, $\ \dbinom n1=n$
- **Simmetria:** $\dbinom nk=\dbinom n{n-k}$ (scegliere $k$ elementi equivale a scartarne $n-k$)
- **Formula di Stifel:** $\dbinom nk=\dbinom{n-1}{k-1}+\dbinom{n-1}{k}$, che genera il **triangolo di Tartaglia**
- $\dbinom n0+\dbinom n1+\dots+\dbinom nn=2^n$ (numero di sottoinsiemi di un insieme di $n$ elementi)

**Combinazioni con ripetizione:** $C'_{n,k}=\dbinom{n+k-1}{k}$.` },
        {
          t: 'plot',
          title: 'Una riga del triangolo di Tartaglia',
          caption: R`I punti rappresentano $\binom nk$ per $k=0,1,\dots,n$: la riga è simmetrica e ha il massimo al centro.`,
          view: [-0.5, 10.5, -20, 270],
          params: [{ name: 'n', label: 'n', min: 1, max: 10, step: 1, value: 6 }],
          draw: (p) => Array.from({ length: p.n + 1 }, (_, k): Shape => ({ k: 'pt', x: k, y: binom(p.n, k) })),
          readout: (p) => `Riga $n=${p.n}$: $${Array.from({ length: p.n + 1 }, (_, k) => binom(p.n, k)).join(',\\ ')}$ — somma $2^{${p.n}}=${2 ** p.n}$`,
        },
        { t: 'def', title: 'Binomio di Newton', md: R`$$(a+b)^n=\sum_{k=0}^{n}\binom nk\,a^{\,n-k}\,b^{\,k}$$ I coefficienti dello sviluppo sono quelli della riga $n$ del triangolo di Tartaglia. Esempio: $(a+b)^4=a^4+4a^3b+6a^2b^2+4ab^3+b^4$.` },
        {
          t: 'ex',
          title: R`In una classe di $20$ studenti, in quanti modi si possono scegliere $2$ rappresentanti?`,
          steps: [R`L'ordine non conta e non ci sono ripetizioni: combinazioni semplici.`, R`$C_{20,2}=\dbinom{20}{2}=\dfrac{20\cdot19}{2}=190$.`, R`Se invece i ruoli fossero distinti (rappresentante e vice) sarebbero disposizioni: $20\cdot19=380$.`],
        },
        { t: 'def', title: 'Schema per scegliere il modello', md: R`- Ordine **sì**, tutti gli elementi → **permutazioni**
- Ordine **sì**, solo $k$ elementi, senza ripetizioni → **disposizioni semplici**
- Ordine **sì**, con ripetizioni → **disposizioni con ripetizione** ($n^k$)
- Ordine **no** → **combinazioni**` },
      ],
    },
  ],
  exercises: [
    {
      id: 'cmb-fattoriale',
      level: 1,
      title: 'Fattoriali',
      make: (r) => {
        const n = int(r, 5, 12), k = pick(r, [1, 2, 3]);
        const val = disp(n, k);
        return {
          text: `Calcola ${m(`\\dfrac{${n}!}{${n - k}!}`)}.`,
          answer: val,
          tol: 0,
          hints: [`Scrivi ${m(`${n}!=${Array.from({ length: k }, (_, i) => n - i).join('\\cdot')}\\cdot${n - k}!`)} e semplifica.`],
          solution: [`${m(`\\dfrac{${n}!}{${n - k}!}=${Array.from({ length: k }, (_, i) => n - i).join('\\cdot')}=${val}`)}`],
        };
      },
    },
    {
      id: 'cmb-permutazioni',
      level: 1,
      title: 'Permutazioni',
      make: (r) => {
        const [w, n] = pick(r, [['ROMA', 4], ['LIBRO', 5], ['AMORE', 5], ['STUDIO', 6], ['FIUME', 5], ['PONTE', 5], ['CIELO', 5], ['NUMERI', 6]] as const);
        const alt = r() < 0.4;
        return {
          text: alt ? `In quanti modi diversi si possono mettere in fila ${m(n)} persone?` : `Quanti sono gli anagrammi (anche senza significato) della parola ${w}?`,
          answer: fact(n),
          tol: 0,
          hints: ['Si ordinano tutti gli elementi, tutti diversi: permutazioni semplici.', R`$P_n=n!$`],
          solution: [`Gli elementi sono ${m(n)}, tutti distinti: ${m(`P_{${n}}=${n}!=${fact(n)}`)}.`],
        };
      },
    },
    {
      id: 'cmb-anagrammi-rip',
      level: 2,
      title: 'Permutazioni con ripetizione',
      make: (r) => {
        const [w, n, reps] = pick(r, [['MAMMA', 5, [3, 2]], ['NONNO', 5, [3, 2]], ['PAPPA', 5, [3, 2]], ['TETTO', 5, [3]], ['ATTICO', 6, [2]], ['COCCO', 5, [3, 2]], ['SASSO', 5, [3]], ['PIZZA', 5, [2]], ['MATEMATICA', 10, [2, 3, 2]], ['ANANAS', 6, [3, 2]]] as const);
        const den = reps.reduce((a: number, b: number) => a * fact(b), 1), val = fact(n) / den;
        return {
          text: `Quanti sono gli anagrammi (anche senza significato) della parola ${w}?`,
          options: mc(r, m(val), [
            [m(fact(n)), 'Alcune lettere si ripetono: scambiandole tra loro la parola non cambia, quindi bisogna dividere.'],
            [m(fact(n) / fact(reps[0])), reps.length > 1 ? 'Hai tenuto conto di una sola delle lettere ripetute.' : 'Ricontrolla quante volte compare la lettera ripetuta.'],
          ], [m(val * 2), m(val + n), m(val / 2 === Math.floor(val / 2) ? val / 2 : val + 1)]),
          hints: ['Conta le lettere e quante volte si ripete ciascuna.', R`$\dfrac{n!}{a!\,b!\cdots}$`],
          solution: [`Lettere: ${m(n)}; ripetizioni: ${reps.join(', ')}.`, `${m(`\\dfrac{${n}!}{${reps.map((x) => `${x}!`).join('\\,')}}=\\dfrac{${fact(n)}}{${den}}=${val}`)}`],
        };
      },
    },
    {
      id: 'cmb-disposizioni',
      level: 1,
      title: 'Disposizioni semplici',
      make: (r) => {
        const n = int(r, 5, 12), k = pick(r, [2, 3]);
        const val = disp(n, k);
        const prod = Array.from({ length: k }, (_, i) => n - i).join('\\cdot');
        return {
          text: k === 3 ? `A una gara partecipano ${m(n)} atleti. In quanti modi possono essere assegnate le medaglie d'oro, d'argento e di bronzo?` : `In una classe di ${m(n)} studenti si devono eleggere un rappresentante e un vice. In quanti modi è possibile?`,
          options: mc(r, m(val), [
            [m(binom(n, k)), 'Queste sono le combinazioni: qui però l\'ordine (il ruolo) conta.'],
            [m(n ** k), 'Una stessa persona non può occupare due posti: non ci sono ripetizioni.'],
            [m(n * k), 'Le scelte successive si moltiplicano tra loro, diminuendo ogni volta di uno.'],
          ], [m(val + n)]),
          hints: ['L\'ordine conta e non ci sono ripetizioni.', R`$D_{n,k}=n(n-1)\cdots(n-k+1)$`],
          steps: [
            { ask: 'L\'ordine degli elementi scelti è importante?', options: choice(r, [['Sì', 'Giusto: scambiando due persone cambia l\'assegnazione dei ruoli.'], ['No', 'I posti sono distinti: scambiando due persone si ottiene un esito diverso.'], ['Dipende', 'Qui i ruoli sono chiaramente distinti.']]), explain: 'L\'ordine conta e non ci sono ripetizioni: disposizioni semplici.' },
            { ask: `Quanto vale ${m(`D_{${n},${k}}`)}?`, options: mc(r, m(val), [[m(binom(n, k)), 'Hai diviso per $k!$: così conti i gruppi non ordinati.'], [m(n ** k), 'Senza ripetizioni i fattori decrescono.']], [m(val + n), m(val - n)]), explain: `${m(`D_{${n},${k}}=${prod}=${val}`)}.` },
          ],
          solution: [`Disposizioni semplici di ${m(n)} elementi a ${m(k)} a ${m(k)}.`, `${m(`D_{${n},${k}}=${prod}=${val}`)}`],
        };
      },
    },
    {
      id: 'cmb-disp-rip',
      level: 1,
      title: 'Disposizioni con ripetizione',
      make: (r) => {
        const [n, what] = pick(r, [[10, 'cifre (da 0 a 9)'], [2, 'simboli (0 e 1)'], [5, 'vocali'], [6, 'colori'], [4, 'lettere (A, B, C, D)']] as const);
        const k = n === 2 ? int(r, 4, 10) : n === 10 ? int(r, 2, 4) : int(r, 2, 4);
        return {
          text: `Quanti codici di ${m(k)} caratteri si possono formare con ${m(n)} ${what}, potendo ripetere i caratteri?`,
          answer: n ** k,
          tol: 0,
          hints: ['Per ogni posizione hai sempre lo stesso numero di scelte.', R`$D'_{n,k}=n^k$`],
          solution: [`Per ciascuna delle ${m(k)} posizioni ci sono ${m(n)} scelte: ${m(`${n}^{${k}}=${n ** k}`)}.`],
        };
      },
    },
    {
      id: 'cmb-binomiale',
      level: 1,
      title: 'Coefficiente binomiale',
      make: (r) => {
        const n = int(r, 5, 10), k = int(r, 2, 3);
        const kk = r() < 0.3 ? n - k : k;
        return {
          text: `Calcola ${m(`\\dbinom{${n}}{${kk}}`)}.`,
          answer: binom(n, k),
          tol: 0,
          hints: [R`$\dbinom nk=\dfrac{n(n-1)\cdots(n-k+1)}{k!}$`, kk !== k ? R`Conviene usare la simmetria: $\dbinom nk=\dbinom n{n-k}$.` : 'Al numeratore $k$ fattori decrescenti a partire da $n$.'],
          solution: [kk !== k ? `Per simmetria ${m(`\\dbinom{${n}}{${kk}}=\\dbinom{${n}}{${k}}`)}.` : `${m(`\\dbinom{${n}}{${k}}=\\dfrac{${Array.from({ length: k }, (_, i) => n - i).join('\\cdot')}}{${k}!}`)}`, `${m(`=\\dfrac{${disp(n, k)}}{${fact(k)}}=${binom(n, k)}`)}`],
        };
      },
    },
    {
      id: 'cmb-combinazioni',
      level: 2,
      title: 'Combinazioni',
      make: (r) => {
        const n = int(r, 6, 12), k = pick(r, [2, 3, 4]);
        const val = binom(n, k);
        const ctx = pick(r, [`In quanti modi si può formare una commissione di ${k} persone scelte tra ${n}?`, `Da un mazzo di ${n} carte diverse se ne pescano ${k} insieme. Quante sono le possibili "mani"?`, `Una pizzeria offre ${n} ingredienti: in quanti modi si possono scegliere ${k} ingredienti diversi per una pizza?`]);
        return {
          text: ctx,
          options: mc(r, m(val), [
            [m(disp(n, k)), 'Queste sono le disposizioni: qui l\'ordine non conta, quindi bisogna dividere per $k!$.'],
            [m(n ** k), 'Non ci sono ripetizioni e l\'ordine non conta.'],
            [m(n * k), 'Non basta moltiplicare $n$ per $k$.'],
          ], [m(val + n), m(val + 1)]),
          hints: ['L\'ordine non conta: sono combinazioni.', R`$C_{n,k}=\dbinom nk=\dfrac{D_{n,k}}{k!}$`],
          steps: [
            { ask: 'L\'ordine degli elementi scelti è importante?', options: choice(r, [['No', 'Giusto: lo stesso gruppo elencato in ordine diverso è la stessa scelta.'], ['Sì', 'Scambiando l\'ordine degli elementi scelti il gruppo resta lo stesso.'], ['Solo per il primo', 'Nessun elemento ha un ruolo particolare.']]), explain: 'L\'ordine non conta: combinazioni semplici.' },
            { ask: `Quanto vale ${m(`\\dbinom{${n}}{${k}}`)}?`, options: mc(r, m(val), [[m(disp(n, k)), 'Manca la divisione per $k!$.']], [m(val + n), m(val - 1), m(val + 2)]), explain: `${m(`\\dbinom{${n}}{${k}}=\\dfrac{${disp(n, k)}}{${fact(k)}}=${val}`)}.` },
          ],
          solution: [`Combinazioni semplici: ${m(`C_{${n},${k}}=\\dbinom{${n}}{${k}}=\\dfrac{${Array.from({ length: k }, (_, i) => n - i).join('\\cdot')}}{${k}!}=${val}`)}.`],
        };
      },
    },
    {
      id: 'cmb-modello',
      level: 2,
      title: 'Scegliere il modello',
      make: (r) => {
        const all = ['Permutazioni', 'Disposizioni semplici', 'Disposizioni con ripetizione', 'Combinazioni'];
        const [text, ok, why] = pick(r, [
          ['Si vuole contare in quanti modi 6 amici possono sedersi su 6 sedie in fila. Quale modello si usa?', 'Permutazioni', 'si ordinano tutti gli elementi'],
          ['Si vuole contare quante schedine diverse si possono compilare scegliendo 6 numeri su 90. Quale modello si usa?', 'Combinazioni', 'l\'ordine dei numeri scelti non conta'],
          ['Si vuole contare quanti PIN di 4 cifre esistono. Quale modello si usa?', 'Disposizioni con ripetizione', 'l\'ordine conta e le cifre possono ripetersi'],
          ['Si vuole contare in quanti modi 10 squadre possono occupare i primi 3 posti in classifica. Quale modello si usa?', 'Disposizioni semplici', 'l\'ordine conta, non ci sono ripetizioni e si scelgono solo 3 elementi'],
          ['Si vuole contare quante strette di mano si scambiano 8 persone. Quale modello si usa?', 'Combinazioni', 'ogni stretta di mano è una coppia non ordinata'],
          ['Si vuole contare quante colonne si possono giocare al totocalcio (13 partite, segni 1, X, 2). Quale modello si usa?', 'Disposizioni con ripetizione', 'l\'ordine conta e i segni si ripetono'],
          ['Si vuole contare in quanti modi si possono assegnare presidente e segretario scegliendoli tra 12 soci. Quale modello si usa?', 'Disposizioni semplici', 'i due ruoli sono distinti e una persona non può ricoprirli entrambi'],
        ] as const);
        return {
          text,
          options: choice(r, [[ok, `Corretto: ${why}.`], ...all.filter((x) => x !== ok).map((x): [string, string] => [x, `Chiediti se conta l'ordine e se sono ammesse ripetizioni: qui ${why}.`])]),
          hints: ['Conta l\'ordine? Si usano tutti gli elementi? Sono ammesse ripetizioni?'],
          solution: [`Qui ${why}: ${ok.toLowerCase()}.`],
        };
      },
    },
    {
      id: 'cmb-strette',
      level: 2,
      title: 'Coppie',
      make: (r) => {
        const n = int(r, 5, 20);
        const ctx = pick(r, [`A una riunione partecipano ${n} persone e ognuna stringe la mano a tutte le altre. Quante strette di mano avvengono?`, `In un torneo ${n} squadre si affrontano tutte tra loro una sola volta. Quante partite si giocano?`, `Quante diagonali e lati in tutto (cioè quanti segmenti) congiungono a due a due ${n} punti, a tre a tre non allineati?`]);
        return {
          text: ctx,
          answer: binom(n, 2),
          tol: 0,
          hints: ['Ogni coppia (non ordinata) va contata una volta sola.', R`$\dbinom n2=\dfrac{n(n-1)}{2}$`],
          solution: [`${m(`\\dbinom{${n}}{2}=\\dfrac{${n}\\cdot${n - 1}}{2}=${binom(n, 2)}`)}`],
        };
      },
    },
    {
      id: 'cmb-mista',
      level: 3,
      title: 'Scelte da due gruppi',
      make: (r) => {
        const a = int(r, 4, 7), b = int(r, 4, 7), ka = pick(r, [1, 2]), kb = pick(r, [2, 3]);
        const val = binom(a, ka) * binom(b, kb);
        return {
          text: `Da un gruppo di ${m(a)} ragazzi e ${m(b)} ragazze si vuole formare una squadra con ${m(ka)} ${ka === 1 ? 'ragazzo' : 'ragazzi'} e ${m(kb)} ragazze. In quanti modi è possibile?`,
          answer: val,
          tol: 0,
          hints: ['Conta separatamente le scelte dei ragazzi e delle ragazze (combinazioni).', 'Poi applica il principio fondamentale: le due scelte si moltiplicano.'],
          solution: [`Ragazzi: ${m(`\\dbinom{${a}}{${ka}}=${binom(a, ka)}`)}; ragazze: ${m(`\\dbinom{${b}}{${kb}}=${binom(b, kb)}`)}.`, `${m(`${binom(a, ka)}\\cdot${binom(b, kb)}=${val}`)}`],
        };
      },
    },
    {
      id: 'cmb-newton',
      level: 3,
      title: 'Binomio di Newton',
      make: (r) => {
        const n = int(r, 4, 6), k = int(r, 1, n - 1), a = pick(r, [1, 2, 3, -1, -2]);
        // (x + a)^n: coefficiente di x^(n-k) = C(n,k) a^k
        const val = binom(n, k) * a ** k;
        return {
          text: `Qual è il coefficiente di ${m(`x^{${n - k}}`)} nello sviluppo di ${m(`(x${a > 0 ? '+' : ''}${a})^{${n}}`)}?`,
          answer: val,
          tol: 0,
          hints: [R`Il termine generale è $\dbinom nk\,x^{\,n-k}\,a^{\,k}$.`, `Qui serve ${m(`k=${k}`)}.`],
          solution: [`Termine con ${m(`k=${k}`)}: ${m(`\\dbinom{${n}}{${k}}\\,x^{${n - k}}\\,(${a})^{${k}}`)}.`, `Coefficiente: ${m(`${binom(n, k)}\\cdot(${a ** k})=${val}`)}.`],
        };
      },
    },
    {
      id: 'cmb-equazione',
      level: 3,
      title: 'Equazione con coefficiente binomiale',
      make: (r) => {
        const n = int(r, 5, 15), d2 = r() < 0.5;
        return {
          text: d2 ? `Trova il numero naturale $n$ tale che ${m(`D_{n,2}=${n * (n - 1)}`)}.` : `Trova il numero naturale $n$ tale che ${m(`\\dbinom n2=${binom(n, 2)}`)}.`,
          answer: n,
          tol: 0,
          hints: [d2 ? R`$D_{n,2}=n(n-1)$.` : R`$\dbinom n2=\dfrac{n(n-1)}{2}$.`, 'Ottieni un\'equazione di secondo grado: accetta solo la soluzione naturale.'],
          solution: [`${m(`n(n-1)=${n * (n - 1)}`)}, cioè ${m(`n^2-n-${n * (n - 1)}=0`)}.`, `Soluzioni: ${m(`n=${n}`)} e ${m(`n=${1 - n}`)} (non accettabile).`, `${m(`n=${n}`)}`],
        };
      },
    },
  ],
};
