import { dec, frac, int, m, mc, pick } from '../../lib/gen';
import type { Shape, Unit } from '../../lib/types';
import { binom } from './combinatoria';

const R = String.raw;
const d = (x: number, n = 3) => `${Math.round(x * 10 ** n) / 10 ** n}`.replace('.', '{,}');

export const probabilita: Unit = {
  id: 'a4-probabilita',
  year: 4,
  title: 'Probabilità',
  summary: 'Eventi, probabilità della somma e del prodotto, condizionata, Bayes, prove ripetute.',
  lessons: [
    {
      id: 'a4-pro-1',
      title: 'Eventi e definizioni di probabilità',
      blocks: [
        { t: 'idea', md: R`Pioverà domani? Uscirà testa? La probabilità è un numero tra $0$ e $1$ che misura **quanto ci aspettiamo** che un evento incerto si verifichi: $0$ per l'impossibile, $1$ per il certo. Non elimina l'incertezza, ma permette di ragionarci sopra con rigore.` },
        { t: 'def', title: 'Eventi', md: R`Lo **spazio campionario** $\Omega$ è l'insieme di tutti gli esiti possibili di un esperimento aleatorio. Un **evento** è un sottoinsieme di $\Omega$.
- **Evento contrario** $\bar E$: si verifica quando non si verifica $E$.
- **Unione** $A\cup B$: si verifica almeno uno dei due.
- **Intersezione** $A\cap B$: si verificano entrambi.
- $A$ e $B$ sono **incompatibili** se non possono verificarsi insieme: $A\cap B=\varnothing$.` },
        { t: 'def', title: 'Definizioni di probabilità', md: R`- **Classica:** se gli esiti sono equiprobabili, $$p(E)=\frac{\text{numero dei casi favorevoli}}{\text{numero dei casi possibili}}$$
- **Frequentista:** è il valore a cui tende la frequenza relativa dell'evento su un gran numero di prove (legge empirica del caso).
- **Soggettiva:** è il prezzo equo che si è disposti a pagare per ricevere $1$ se l'evento si verifica.
- **Assiomatica** (Kolmogorov): $p(E)\ge0$; $\ p(\Omega)=1$; se $A$ e $B$ sono incompatibili, $p(A\cup B)=p(A)+p(B)$.` },
        {
          t: 'thm',
          title: 'Probabilità del contrario e della somma logica',
          md: R`$$p(\bar E)=1-p(E)$$ $$p(A\cup B)=p(A)+p(B)-p(A\cap B)$$ Se $A$ e $B$ sono incompatibili l'ultimo termine è nullo.`,
          proof: [
            R`$E$ ed $\bar E$ sono incompatibili e la loro unione è $\Omega$: $p(E)+p(\bar E)=p(\Omega)=1$.`,
            R`Per l'unione: scriviamo $A\cup B$ come unione di tre eventi incompatibili: "solo $A$", "solo $B$", "$A\cap B$".`,
            R`$p(\text{solo }A)=p(A)-p(A\cap B)$ e $p(\text{solo }B)=p(B)-p(A\cap B)$.`,
            R`Sommando i tre: $p(A\cup B)=p(A)+p(B)-p(A\cap B)$. Sommando semplicemente $p(A)+p(B)$ l'intersezione verrebbe contata **due volte**.`,
          ],
        },
        {
          t: 'ex',
          title: R`Si estrae un numero da $1$ a $20$. Qual è la probabilità che sia pari o multiplo di $5$?`,
          steps: [R`$A$ = "pari": $10$ casi, $p(A)=\dfrac{10}{20}$. $B$ = "multiplo di $5$": $5,10,15,20$, $p(B)=\dfrac4{20}$.`, R`Gli eventi sono compatibili: $A\cap B=\{10,20\}$, $p(A\cap B)=\dfrac2{20}$.`, R`$p(A\cup B)=\dfrac{10}{20}+\dfrac{4}{20}-\dfrac{2}{20}=\dfrac{12}{20}=\dfrac35$.`],
        },
        {
          t: 'plot',
          title: 'La somma di due dadi',
          caption: R`Numero di casi favorevoli (su $36$) per ciascuna somma: gli esiti $2,\dots,12$ **non** sono equiprobabili. Scegli una somma per leggerne la probabilità.`,
          view: [1, 13, -0.5, 7],
          params: [{ name: 's', label: 'somma', min: 2, max: 12, step: 1, value: 7 }],
          draw: (p) => Array.from({ length: 11 }, (_, i): Shape => ({ k: 'pt', x: i + 2, y: 6 - Math.abs(i + 2 - 7), color: i + 2 === p.s ? 'var(--plot-2)' : 'var(--plot-1)' })),
          readout: (p) => `$p(\\text{somma}=${p.s})=\\dfrac{${6 - Math.abs(p.s - 7)}}{36}\\approx${d((6 - Math.abs(p.s - 7)) / 36)}$`,
        },
        { t: 'warn', md: R`La definizione classica vale solo se i casi sono **equiprobabili**. Lanciando due dadi le somme possibili sono $11$, ma la probabilità di ottenere $7$ non è $\frac1{11}$: è $\frac{6}{36}$.` },
        {
          t: 'quiz',
          q: R`Lanciando un dado, qual è la probabilità di ottenere un numero maggiore di $4$?`,
          options: [
            { md: R`$\dfrac13$`, ok: true, why: 'Esatto: i casi favorevoli sono $5$ e $6$, su $6$ possibili.' },
            { md: R`$\dfrac12$`, why: '"Maggiore di $4$" non include il $4$: i casi favorevoli sono solo due.' },
            { md: R`$\dfrac23$`, why: 'Questa è la probabilità dell\'evento contrario.' },
          ],
        },
      ],
    },
    {
      id: 'a4-pro-2',
      title: 'Probabilità condizionata, Bayes, prove ripetute',
      blocks: [
        { t: 'idea', md: R`Sapere qualcosa in più cambia le probabilità. Se ti dico che la carta estratta è una figura, la probabilità che sia un re non è più quella di prima. La **probabilità condizionata** è il modo matematico di **aggiornare** le previsioni alla luce di nuove informazioni.` },
        { t: 'def', title: 'Probabilità condizionata e indipendenza', md: R`La probabilità di $A$ **sapendo che** si è verificato $B$ (con $p(B)>0$) è $$p(A\mid B)=\frac{p(A\cap B)}{p(B)}$$ Da qui il **teorema della probabilità composta**: $$p(A\cap B)=p(B)\cdot p(A\mid B)$$ $A$ e $B$ sono **indipendenti** se il verificarsi di uno non modifica la probabilità dell'altro: $p(A\mid B)=p(A)$, cioè $$p(A\cap B)=p(A)\cdot p(B)$$` },
        {
          t: 'ex',
          title: R`Un'urna contiene $5$ palline rosse e $3$ blu. Se ne estraggono due senza reimmissione. Qual è la probabilità che siano entrambe rosse?`,
          steps: [R`Prima estrazione: $p(R_1)=\dfrac58$.`, R`Se la prima è rossa, restano $4$ rosse su $7$ palline: $p(R_2\mid R_1)=\dfrac47$.`, R`$p(R_1\cap R_2)=\dfrac58\cdot\dfrac47=\dfrac{20}{56}=\dfrac{5}{14}$.`, R`Con reimmissione le estrazioni sarebbero indipendenti: $\dfrac58\cdot\dfrac58=\dfrac{25}{64}$.`],
        },
        {
          t: 'thm',
          title: 'Probabilità totale e teorema di Bayes',
          md: R`Se $H_1,\dots,H_n$ sono eventi incompatibili che esauriscono tutti i casi (una **partizione** di $\Omega$): $$p(E)=\sum_i p(H_i)\,p(E\mid H_i)$$ $$p(H_k\mid E)=\frac{p(H_k)\,p(E\mid H_k)}{p(E)}\qquad\text{(Bayes)}$$ Il teorema di Bayes permette di risalire dalle "cause" $H_i$ all'effetto osservato $E$.`,
          proof: [R`$E$ è l'unione degli eventi incompatibili $E\cap H_1,\dots,E\cap H_n$, quindi $p(E)=\sum_ip(E\cap H_i)$.`, R`Per la probabilità composta $p(E\cap H_i)=p(H_i)\,p(E\mid H_i)$: si ottiene la formula della probabilità totale.`, R`Per Bayes: $p(H_k\mid E)=\dfrac{p(H_k\cap E)}{p(E)}=\dfrac{p(H_k)\,p(E\mid H_k)}{p(E)}$.`],
        },
        {
          t: 'ex',
          title: R`Una malattia colpisce l'$1\%$ della popolazione. Un test è positivo nel $99\%$ dei malati e nel $5\%$ dei sani. Se il test è positivo, qual è la probabilità di essere malati?`,
          steps: [R`$p(M)=0{,}01$, $p(+\mid M)=0{,}99$, $p(+\mid S)=0{,}05$.`, R`Probabilità totale: $p(+)=0{,}01\cdot0{,}99+0{,}99\cdot0{,}05=0{,}0099+0{,}0495=0{,}0594$.`, R`Bayes: $p(M\mid+)=\dfrac{0{,}0099}{0{,}0594}\approx0{,}167$.`, R`Solo il $17\%$ circa! I falsi positivi tra i tantissimi sani superano i veri positivi tra i pochi malati.`],
        },
        { t: 'def', title: 'Prove ripetute (schema di Bernoulli)', md: R`Se un esperimento con probabilità di successo $p$ viene ripetuto $n$ volte in modo indipendente, la probabilità di ottenere **esattamente $k$ successi** è $$p(X=k)=\binom nk\,p^{\,k}\,(1-p)^{\,n-k}$$ (**distribuzione binomiale**). La probabilità di **almeno un successo** è $1-(1-p)^n$.` },
        {
          t: 'plot',
          title: 'Distribuzione binomiale',
          caption: R`Probabilità di ottenere $k$ successi in $n=10$ prove, al variare della probabilità $p$ di successo in ogni prova.`,
          view: [-0.5, 10.5, -0.03, 0.45],
          params: [{ name: 'p', label: 'p', min: 0.1, max: 0.9, step: 0.05, value: 0.5 }],
          draw: (p) => Array.from({ length: 11 }, (_, k): Shape[] => [{ k: 'seg', x1: k, y1: 0, x2: k, y2: binom(10, k) * p.p ** k * (1 - p.p) ** (10 - k), color: 'var(--plot-1)' }, { k: 'pt', x: k, y: binom(10, k) * p.p ** k * (1 - p.p) ** (10 - k) }]).flat(),
          readout: (p) => `Numero medio di successi: $n\\,p=${d(10 * p.p, 1)}$ — $p(X=5)\\approx${d(binom(10, 5) * p.p ** 5 * (1 - p.p) ** 5)}$`,
        },
        { t: 'warn', md: R`**Incompatibili** e **indipendenti** non sono sinonimi, anzi: due eventi incompatibili (di probabilità non nulla) sono sempre **dipendenti**, perché se si verifica l'uno l'altro diventa impossibile. E in generale $p(A\mid B)\neq p(B\mid A)$.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'pro-classica',
      level: 1,
      title: 'Probabilità classica',
      make: (r) => {
        const a = int(r, 2, 8), b = int(r, 2, 8), c = int(r, 1, 6), tot = a + b + c;
        return {
          text: `Un'urna contiene ${m(a)} palline rosse, ${m(b)} verdi e ${m(c)} gialle. Estraendone una a caso, qual è la probabilità che sia rossa?`,
          options: mc(r, m(frac(a, tot)), [
            [m(frac(a, b + c)), 'I casi possibili sono **tutte** le palline, comprese le rosse.'],
            [m(frac(b + c, tot)), 'Questa è la probabilità che **non** sia rossa.'],
            [m(frac(1, 3)), 'I tre colori non sono equiprobabili: conta le palline.'],
          ], [m(frac(a + 1, tot + 1)), m(frac(a, tot + 2))]),
          hints: ['Casi favorevoli diviso casi possibili.'],
          solution: [`Casi possibili: ${m(`${a}+${b}+${c}=${tot}`)}; favorevoli: ${m(a)}.`, `${m(`p=\\dfrac{${a}}{${tot}}=${frac(a, tot)}`)}`],
        };
      },
    },
    {
      id: 'pro-contrario',
      level: 1,
      title: 'Evento contrario',
      make: (r) => {
        const dn = pick(r, [4, 5, 8, 10, 20]), n = int(r, 1, dn - 1);
        return {
          text: `La probabilità che domani piova è ${m(frac(n, dn))}. Qual è la probabilità che non piova?`,
          options: mc(r, m(frac(dn - n, dn)), [[m(frac(dn, n)), 'Una probabilità non può superare $1$: non si fa il reciproco.'], [m(frac(n, dn)), 'Questa è la probabilità che piova.']], [m(frac(dn - n + 1, dn + 1)), m(frac(1, dn)), m(frac(dn - n, dn + 3))]),
          hints: [R`$p(\bar E)=1-p(E)$.`],
          solution: [`${m(`1-${frac(n, dn)}=${frac(dn - n, dn)}`)}`],
        };
      },
    },
    {
      id: 'pro-dadi',
      level: 2,
      title: 'Somma di due dadi',
      make: (r) => {
        const s = int(r, 3, 11), fav = 6 - Math.abs(s - 7);
        return {
          text: `Lanciando due dadi, qual è la probabilità che la somma dei punteggi sia ${m(s)}?`,
          options: mc(r, m(frac(fav, 36)), [
            [m(frac(1, 11)), 'Le $11$ somme possibili non sono equiprobabili: bisogna contare le coppie.'],
            [m(frac(Math.ceil(fav / 2), 36)), 'Le coppie sono **ordinate**: $(1;2)$ e $(2;1)$ sono due esiti diversi.'],
            [m(frac(fav, 12)), 'I casi possibili sono $6\\cdot6=36$.'],
          ], [m(frac(fav + 1, 36)), m(frac(fav + 2, 36))]),
          hints: ['I casi possibili sono $36$ coppie ordinate.', 'Elenca le coppie che danno quella somma.'],
          steps: [
            { ask: 'Quanti sono i casi possibili?', options: mc(r, m(36), [[m(12), 'Si moltiplicano le possibilità dei due dadi, non si sommano.'], [m(11), 'Queste sono le somme possibili, che però non sono equiprobabili.']], [m(21)]), explain: R`$6\cdot6=36$ coppie ordinate equiprobabili.` },
            { ask: `Quante coppie ordinate hanno somma ${m(s)}?`, options: mc(r, m(fav), [[m(Math.ceil(fav / 2)), 'Conta anche le coppie con i dadi scambiati.']], [m(fav + 1), m(fav + 2), m(fav + 3)]), explain: `Sono ${m(fav)}: ${Array.from({ length: 6 }, (_, i) => i + 1).filter((x) => s - x >= 1 && s - x <= 6).map((x) => `$(${x};${s - x})$`).join(', ')}. Quindi ${m(`p=${frac(fav, 36)}`)}.` },
          ],
          solution: [`Casi possibili: $36$. Casi favorevoli: ${Array.from({ length: 6 }, (_, i) => i + 1).filter((x) => s - x >= 1 && s - x <= 6).map((x) => `$(${x};${s - x})$`).join(', ')}, cioè ${m(fav)}.`, `${m(`p=\\dfrac{${fav}}{36}=${frac(fav, 36)}`)}`],
        };
      },
    },
    {
      id: 'pro-unione',
      level: 2,
      title: 'Eventi compatibili',
      make: (r) => {
        const [a, b] = pick(r, [[2, 3], [2, 5], [3, 5], [3, 4], [2, 7]]), N = pick(r, [30, 60]);
        const na = Math.floor(N / a), nb = Math.floor(N / b), nab = Math.floor(N / (a * b));
        return {
          text: `Si estrae a caso un numero intero da $1$ a ${m(N)}. Qual è la probabilità che sia multiplo di ${m(a)} oppure di ${m(b)}?`,
          options: mc(r, m(frac(na + nb - nab, N)), [
            [m(frac(na + nb, N)), `Hai contato due volte i multipli di entrambi (i multipli di ${m(a * b)}).`],
            [m(frac(nab, N)), 'Questa è la probabilità che sia multiplo di **entrambi**.'],
            [m(frac(na, N)), 'Hai considerato solo il primo evento.'],
          ], [m(frac(na + nb - nab + 1, N))]),
          hints: [R`$p(A\cup B)=p(A)+p(B)-p(A\cap B)$.`, `I numeri multipli di entrambi sono i multipli di ${m(a * b)}.`],
          solution: [`Multipli di ${m(a)}: ${m(na)}; multipli di ${m(b)}: ${m(nb)}; multipli di entrambi (di ${m(a * b)}): ${m(nab)}.`, `${m(`p=\\dfrac{${na}+${nb}-${nab}}{${N}}=${frac(na + nb - nab, N)}`)}`],
        };
      },
    },
    {
      id: 'pro-senza-reimmissione',
      level: 2,
      title: 'Estrazioni senza reimmissione',
      make: (r) => {
        const a = int(r, 3, 7), b = int(r, 2, 6), tot = a + b;
        return {
          text: `Un'urna contiene ${m(a)} palline bianche e ${m(b)} nere. Si estraggono due palline **senza reimmissione**. Qual è la probabilità che siano entrambe bianche?`,
          options: mc(r, m(frac(a * (a - 1), tot * (tot - 1))), [
            [m(frac(a * a, tot * tot)), 'Questa è la probabilità **con** reimmissione: dopo la prima estrazione l\'urna cambia.'],
            [m(frac(2 * a, tot)), 'Le probabilità di eventi che devono verificarsi entrambi si moltiplicano, non si sommano.'],
            [m(frac(a - 1, tot - 1)), 'Questa è solo la probabilità della seconda estrazione, sapendo che la prima è bianca.'],
          ], [m(frac(a, tot))]),
          hints: [R`$p(B_1\cap B_2)=p(B_1)\cdot p(B_2\mid B_1)$.`, 'Dopo la prima bianca restano una bianca in meno e una pallina in meno.'],
          steps: [
            { ask: 'Qual è la probabilità che la prima sia bianca?', options: mc(r, m(frac(a, tot)), [[m(frac(a, b)), 'I casi possibili sono tutte le palline.']], [m(frac(a - 1, tot)), m(frac(a, tot + 1)), m(frac(b, tot))]), explain: `${m(`p(B_1)=${frac(a, tot)}`)}.` },
            { ask: 'Sapendo che la prima è bianca, qual è la probabilità che lo sia anche la seconda?', options: mc(r, m(frac(a - 1, tot - 1)), [[m(frac(a, tot)), 'L\'urna è cambiata: c\'è una bianca in meno.'], [m(frac(a - 1, tot)), 'Anche il totale è diminuito di uno.']], [m(frac(a, tot - 1))]), explain: `${m(`p(B_2\\mid B_1)=${frac(a - 1, tot - 1)}`)}; prodotto: ${m(frac(a * (a - 1), tot * (tot - 1)))}.` },
          ],
          solution: [`${m(`p(B_1)=\\dfrac{${a}}{${tot}}`)}, ${m(`p(B_2\\mid B_1)=\\dfrac{${a - 1}}{${tot - 1}}`)}.`, `${m(`p=\\dfrac{${a}}{${tot}}\\cdot\\dfrac{${a - 1}}{${tot - 1}}=${frac(a * (a - 1), tot * (tot - 1))}`)}`],
        };
      },
    },
    {
      id: 'pro-indipendenti',
      level: 1,
      title: 'Eventi indipendenti',
      make: (r) => {
        const n = pick(r, [2, 3]), which = pick(r, ['moneta', 'dado'] as const);
        const p: [number, number] = which === 'moneta' ? [1, 2] : [1, 6];
        return {
          text: which === 'moneta' ? `Si lancia una moneta ${m(n)} volte. Qual è la probabilità di ottenere sempre testa?` : `Si lancia un dado ${m(n)} volte. Qual è la probabilità di ottenere sempre $6$?`,
          options: mc(r, m(frac(1, p[1] ** n)), [
            [m(frac(n, p[1])), 'Le probabilità di eventi indipendenti che devono verificarsi tutti si **moltiplicano**.'],
            [m(frac(1, p[1])), 'Questa è la probabilità per un solo lancio.'],
            [m(frac(1, p[1] * n)), R`Si eleva a potenza: $p^n$, non $\dfrac pn$.`],
          ], [m(frac(1, p[1] ** (n + 1)))]),
          hints: ['I lanci sono indipendenti.', R`$p(A\cap B)=p(A)\cdot p(B)$.`],
          solution: [`${m(`\\left(${frac(1, p[1])}\\right)^{${n}}=${frac(1, p[1] ** n)}`)}`],
        };
      },
    },
    {
      id: 'pro-almeno',
      level: 2,
      title: 'Almeno una volta',
      make: (r) => {
        const n = pick(r, [2, 3]), which = pick(r, ['moneta', 'dado'] as const);
        const q: [number, number] = which === 'moneta' ? [1, 2] : [5, 6];
        const num = q[1] ** n - q[0] ** n;
        return {
          text: which === 'moneta' ? `Si lancia una moneta ${m(n)} volte. Qual è la probabilità di ottenere **almeno una** testa?` : `Si lancia un dado ${m(n)} volte. Qual è la probabilità di ottenere **almeno un** $6$?`,
          options: mc(r, m(frac(num, q[1] ** n)), [
            [m(frac(n, q[1])), 'Non si sommano le probabilità dei singoli lanci: gli eventi non sono incompatibili.'],
            [m(frac(q[0] ** n, q[1] ** n)), 'Questa è la probabilità di non ottenerne **nessuno**.'],
            [m(frac(1, q[1] ** n)), 'Questa è la probabilità di ottenerlo **tutte** le volte.'],
          ], [m(frac(num + 1, q[1] ** n))]),
          hints: ['Passa all\'evento contrario: "nessuna volta".', R`$p=1-(1-p_0)^n$.`],
          solution: [`Evento contrario ("mai"): ${m(`\\left(${frac(q[0], q[1])}\\right)^{${n}}=${frac(q[0] ** n, q[1] ** n)}`)}.`, `${m(`p=1-${frac(q[0] ** n, q[1] ** n)}=${frac(num, q[1] ** n)}`)}`],
        };
      },
    },
    {
      id: 'pro-condizionata',
      level: 2,
      title: 'Probabilità condizionata',
      make: (r) => {
        const ms = int(r, 4, 12), mn = int(r, 3, 10), fs = int(r, 4, 12), fn = int(r, 3, 10);
        const tot = ms + mn + fs + fn;
        return {
          text: `In una classe ci sono ${m(ms + mn)} ragazzi, di cui ${m(ms)} praticano sport, e ${m(fs + fn)} ragazze, di cui ${m(fs)} praticano sport. Si sceglie a caso uno studente e si sa che **pratica sport**. Qual è la probabilità che sia una ragazza?`,
          options: mc(r, m(frac(fs, ms + fs)), [
            [m(frac(fs, tot)), 'Sapendo che pratica sport, i casi possibili si riducono ai soli sportivi.'],
            [m(frac(fs, fs + fn)), R`Questa è $p(\text{sport}\mid\text{ragazza})$: hai scambiato evento e condizione.`],
            [m(frac(fs + fn, tot)), 'Questa è la probabilità di scegliere una ragazza senza altre informazioni.'],
          ], [m(frac(ms, ms + fs))]),
          hints: ['L\'informazione "pratica sport" restringe lo spazio campionario agli sportivi.', R`$p(A\mid B)=\dfrac{p(A\cap B)}{p(B)}$`],
          solution: [`Sportivi in tutto: ${m(`${ms}+${fs}=${ms + fs}`)}; ragazze sportive: ${m(fs)}.`, `${m(`p(R\\mid S)=\\dfrac{${fs}}{${ms + fs}}=${frac(fs, ms + fs)}`)}`],
        };
      },
    },
    {
      id: 'pro-unione-indip',
      level: 2,
      title: 'Unione di eventi indipendenti',
      make: (r) => {
        const pa = pick(r, [2, 3, 4, 5]), pb = pick(r, [2, 3, 5, 6]);
        // p(A)=pa/10, p(B)=pb/10
        const num = pa * 10 + pb * 10 - pa * pb;
        return {
          text: `Due eventi **indipendenti** $A$ e $B$ hanno probabilità ${m(`p(A)=${dec(pa / 10)}`)} e ${m(`p(B)=${dec(pb / 10)}`)}. Calcola ${m('p(A\\cup B)')}.`,
          answer: num / 100,
          tol: 0.0005,
          hints: [R`$p(A\cup B)=p(A)+p(B)-p(A\cap B)$.`, R`Per eventi indipendenti $p(A\cap B)=p(A)\cdot p(B)$.`],
          solution: [`${m(`p(A\\cap B)=${dec(pa / 10)}\\cdot${dec(pb / 10)}=${dec((pa * pb) / 100)}`)}`, `${m(`p(A\\cup B)=${dec(pa / 10)}+${dec(pb / 10)}-${dec((pa * pb) / 100)}=${dec(num / 100)}`)}`],
        };
      },
    },
    {
      id: 'pro-totale',
      level: 3,
      title: 'Probabilità totale',
      make: (r) => {
        const a1 = int(r, 1, 5), b1 = int(r, 1, 5), a2 = int(r, 1, 5), b2 = int(r, 1, 5);
        // p = 1/2 * a1/(a1+b1) + 1/2 * a2/(a2+b2)
        const n = a1 * (a2 + b2) + a2 * (a1 + b1), dn = 2 * (a1 + b1) * (a2 + b2);
        return {
          text: `Un'urna contiene ${m(a1)} palline rosse e ${m(b1)} blu; una seconda urna contiene ${m(a2)} rosse e ${m(b2)} blu. Si sceglie a caso un'urna e si estrae una pallina. Qual è la probabilità che sia rossa?`,
          options: mc(r, m(frac(n, dn)), [
            [m(frac(a1 + a2, a1 + b1 + a2 + b2)), 'Non si possono unire le due urne: si sceglie prima l\'urna (probabilità $\\frac12$ ciascuna), poi la pallina.'],
            [m(frac(2 * n, dn)), R`Manca il fattore $\dfrac12$ della scelta dell'urna.`],
            [m(frac(a1 * a2, (a1 + b1) * (a2 + b2))), 'Le due eventualità (prima urna o seconda urna) sono alternative: i contributi si **sommano**.'],
          ], [m(frac(n + 1, dn)), m(frac(n, dn + 2))]),
          hints: [R`$p(R)=p(U_1)\,p(R\mid U_1)+p(U_2)\,p(R\mid U_2)$.`, 'Disegna un diagramma ad albero.'],
          solution: [`${m(`p(R)=\\dfrac12\\cdot\\dfrac{${a1}}{${a1 + b1}}+\\dfrac12\\cdot\\dfrac{${a2}}{${a2 + b2}}`)}`, `${m(`=${frac(a1, 2 * (a1 + b1))}+${frac(a2, 2 * (a2 + b2))}=${frac(n, dn)}`)}`],
        };
      },
    },
    {
      id: 'pro-bayes',
      level: 3,
      title: 'Teorema di Bayes',
      make: (r) => {
        const pa = pick(r, [20, 30, 40, 60]), da = pick(r, [1, 2, 3, 5]), db = pick(r, [2, 4, 5, 10]);
        const pb = 100 - pa;
        const na = pa * da, nb = pb * db;
        return {
          text: `Una fabbrica ha due macchine: A produce il ${m(`${pa}\\%`)} dei pezzi, B il ${m(`${pb}\\%`)}. È difettoso il ${m(`${da}\\%`)} dei pezzi di A e il ${m(`${db}\\%`)} dei pezzi di B. Un pezzo scelto a caso risulta difettoso: qual è la probabilità che provenga da A?`,
          options: mc(r, m(frac(na, na + nb)), [
            [m(frac(da, 100)), R`Questa è $p(D\mid A)$: la domanda chiede $p(A\mid D)$.`],
            [m(frac(pa, 100)), 'Questa è la probabilità "a priori": l\'informazione che il pezzo è difettoso la modifica.'],
            [m(frac(da, da + db)), 'Bisogna pesare i tassi di difettosità con le quote di produzione.'],
          ], [m(frac(nb, na + nb)), m(frac(na + 1, na + nb + 3))]),
          hints: [R`Calcola prima $p(D)$ con la probabilità totale.`, R`Poi $p(A\mid D)=\dfrac{p(A)\,p(D\mid A)}{p(D)}$.`],
          solution: [`${m(`p(D)=${dec(pa / 100)}\\cdot${dec(da / 100)}+${dec(pb / 100)}\\cdot${dec(db / 100)}=${d((na + nb) / 10000, 4)}`)}`, `${m(`p(A\\mid D)=\\dfrac{${d(na / 10000, 4)}}{${d((na + nb) / 10000, 4)}}=${frac(na, na + nb)}\\approx${dec(na / (na + nb))}`)}`],
        };
      },
    },
    {
      id: 'pro-bernoulli',
      level: 3,
      title: 'Prove ripetute',
      make: (r) => {
        const n = int(r, 3, 6), k = int(r, 1, n - 1);
        return {
          text: `Si lancia una moneta ${m(n)} volte. Qual è la probabilità di ottenere **esattamente** ${m(k)} ${k === 1 ? 'testa' : 'teste'}?`,
          options: mc(r, m(frac(binom(n, k), 2 ** n)), [
            [m(frac(1, 2 ** n)), 'Questa è la probabilità di **una** sequenza precisa: ma le sequenze con quel numero di teste sono più d\'una.'],
            [m(frac(k, n)), 'Non è un semplice rapporto tra teste e lanci.'],
            [m(frac(1, 2 ** k)), 'Bisogna considerare anche l\'esito degli altri lanci (croce).'],
          ], [m(frac(binom(n, k) + 1, 2 ** n)), m(frac(binom(n, k) + 2, 2 ** n))]),
          hints: [R`$p(X=k)=\dbinom nk\,p^k(1-p)^{n-k}$ con $p=\dfrac12$.`, `Le sequenze con esattamente ${k} teste sono ${m(`\\dbinom{${n}}{${k}}`)}.`],
          solution: [`Sequenze favorevoli: ${m(`\\dbinom{${n}}{${k}}=${binom(n, k)}`)}; sequenze possibili: ${m(`2^{${n}}=${2 ** n}`)}.`, `${m(`p=\\dfrac{${binom(n, k)}}{${2 ** n}}=${frac(binom(n, k), 2 ** n)}`)}`],
        };
      },
    },
  ],
};
