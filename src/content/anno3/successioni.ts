import { choice, dec, int, m, mc, nz, par, pick, sg } from '../../lib/gen';
import type { Shape, Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

export const successioni: Unit = {
  id: 'a3-successioni',
  year: 3,
  title: 'Successioni e progressioni',
  summary: 'Successioni numeriche, progressioni aritmetiche e geometriche, somme.',
  lessons: [
    {
      id: 'a3-suc-1',
      title: 'Successioni numeriche',
      blocks: [
        { t: 'idea', md: R`Una successione è un **elenco ordinato e infinito** di numeri: c'è un primo termine, un secondo, un terzo… Le rate di un mutuo, la popolazione di batteri ora dopo ora, i numeri pari: sono tutte successioni.` },
        { t: 'def', title: 'Successione', md: R`Una **successione numerica** è una funzione che a ogni numero naturale $n\ge1$ (a volte $n\ge0$) associa un numero reale $a_n$, detto **termine** di indice $n$. Si indica con $a_1,a_2,a_3,\dots$ oppure $\{a_n\}$.` },
        { t: 'def', title: 'Come si assegna una successione', md: R`- **In forma analitica**: una formula dà $a_n$ in funzione di $n$. Esempio: $a_n=n^2+1$ dà $2,5,10,17,\dots$
- **Per ricorsione**: si assegnano il primo termine e una regola per passare da un termine al successivo. Esempio: $a_1=3,\ a_{n+1}=2a_n-1$ dà $3,5,9,17,\dots$
- **Per elencazione** dei primi termini, quando la regola è evidente.` },
        { t: 'def', title: 'Successioni monotòne', md: R`Una successione è **crescente** se $a_{n+1}>a_n$ per ogni $n$, **decrescente** se $a_{n+1}<a_n$ per ogni $n$, **costante** se tutti i termini sono uguali.` },
        {
          t: 'ex',
          title: R`Scrivi i primi quattro termini di $a_1=2,\ a_{n+1}=3a_n-4$ e stabilisci se è crescente.`,
          steps: [R`$a_2=3\cdot2-4=2$.`, R`$a_3=3\cdot2-4=2$, e così $a_4=2$.`, R`Tutti i termini valgono $2$: la successione è **costante** (non crescente). Con un diverso valore iniziale, per esempio $a_1=3$, si otterrebbe $3,5,11,29,\dots$, crescente.`],
        },
        {
          t: 'ex',
          title: R`La successione $a_n=\dfrac{n}{n+1}$ è crescente?`,
          steps: [R`Primi termini: $\frac12,\frac23,\frac34,\dots$ sembrano crescere. Dimostriamolo.`, R`$a_{n+1}-a_n=\dfrac{n+1}{n+2}-\dfrac{n}{n+1}=\dfrac{(n+1)^2-n(n+2)}{(n+1)(n+2)}=\dfrac{1}{(n+1)(n+2)}$.`, R`La differenza è positiva per ogni $n$: la successione è **crescente**.`],
        },
        {
          t: 'quiz',
          q: R`Qual è il quinto termine della successione $a_n=2n-3$?`,
          options: [
            { md: '$7$', ok: true, why: R`Esatto: $a_5=2\cdot5-3=7$.` },
            { md: '$5$', why: R`Hai calcolato $a_4$. Sostituisci $n=5$.` },
            { md: '$13$', why: R`Attenzione al segno: $2\cdot5-3$, non $+3$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-suc-2',
      title: 'Progressioni aritmetiche',
      blocks: [
        { t: 'idea', md: R`In una progressione aritmetica si passa da un termine al successivo **aggiungendo sempre la stessa quantità**: come salire una scala con gradini tutti uguali. Esempio: $5,8,11,14,\dots$ (ogni volta $+3$).` },
        { t: 'def', title: 'Progressione aritmetica', md: R`Una successione è una **progressione aritmetica** di **ragione** $d$ se la differenza tra ogni termine e il precedente è costante: $$a_{n+1}-a_n=d$$ Il termine generale è $$a_n=a_1+(n-1)\,d$$ e più in generale $a_n=a_k+(n-k)\,d$.` },
        {
          t: 'plot',
          title: 'I termini di una progressione aritmetica',
          caption: R`I punti $(n;a_n)$ sono allineati su una retta di pendenza $d$: la progressione aritmetica è la versione "a passi" della crescita lineare.`,
          view: [0, 11, -10, 20],
          params: [
            { name: 'a', label: 'a₁', min: -5, max: 10, step: 1, value: 2 },
            { name: 'd', label: 'd', min: -3, max: 3, step: 0.5, value: 1.5 },
          ],
          draw: (p) => [{ k: 'fn', f: (x) => p.a + (x - 1) * p.d, dash: true, color: 'var(--muted)' }, ...Array.from({ length: 10 }, (_, i): Shape => ({ k: 'pt', x: i + 1, y: p.a + i * p.d }))],
          readout: (p) => `$a_n=${d(p.a)}+(n-1)\\cdot${par(d(p.d))}$ — ${p.d > 0 ? 'crescente' : p.d < 0 ? 'decrescente' : 'costante'}`,
        },
        {
          t: 'thm',
          title: 'Somma dei primi n termini',
          md: R`$$S_n=a_1+a_2+\dots+a_n=\frac{n\,(a_1+a_n)}{2}$$`,
          proof: [
            R`Scriviamo la somma due volte, una in ordine crescente e una in ordine inverso: $S_n=a_1+a_2+\dots+a_n$ e $S_n=a_n+a_{n-1}+\dots+a_1$.`,
            R`Sommiamo in colonna. La prima coppia vale $a_1+a_n$. La seconda vale $a_2+a_{n-1}=(a_1+d)+(a_n-d)=a_1+a_n$. Allo stesso modo **ogni** coppia vale $a_1+a_n$.`,
            R`Le coppie sono $n$, quindi $2S_n=n(a_1+a_n)$, da cui $S_n=\dfrac{n(a_1+a_n)}{2}$.`,
            R`È l'idea attribuita al giovane Gauss per sommare i numeri da $1$ a $100$: $\dfrac{100\cdot101}{2}=5050$.`,
          ],
        },
        {
          t: 'ex',
          title: R`In una progressione aritmetica $a_3=10$ e $a_7=22$. Trova $a_1$, $d$ e la somma dei primi $20$ termini.`,
          steps: [R`Da $a_7=a_3+4d$: $22=10+4d$, quindi $d=3$.`, R`Da $a_3=a_1+2d$: $a_1=10-6=4$.`, R`$a_{20}=a_1+19d=4+57=61$.`, R`$S_{20}=\dfrac{20\,(4+61)}{2}=650$.`],
        },
        { t: 'warn', md: R`Nella formula del termine generale compare $(n-1)$ e non $n$: per arrivare al termine $n$-esimo partendo dal primo si fanno $n-1$ passi.` },
      ],
    },
    {
      id: 'a3-suc-3',
      title: 'Progressioni geometriche',
      blocks: [
        { t: 'idea', md: R`In una progressione geometrica si passa da un termine al successivo **moltiplicando sempre per lo stesso numero**. È la legge dei fenomeni che raddoppiano o si dimezzano: interessi composti, crescita batterica, decadimento radioattivo.` },
        { t: 'def', title: 'Progressione geometrica', md: R`Una successione di termini non nulli è una **progressione geometrica** di **ragione** $q\neq0$ se il rapporto tra ogni termine e il precedente è costante: $$\frac{a_{n+1}}{a_n}=q$$ Il termine generale è $$a_n=a_1\cdot q^{\,n-1}$$` },
        {
          t: 'plot',
          title: 'Crescita e decrescita geometrica',
          caption: R`Con $q>1$ i termini crescono sempre più rapidamente; con $0<q<1$ si avvicinano a zero; con $q<0$ i segni si alternano.`,
          view: [0, 9, -10, 20],
          params: [
            { name: 'a', label: 'a₁', min: 1, max: 16, step: 1, value: 1 },
            { name: 'q', label: 'q', min: -1.5, max: 2, step: 0.25, value: 1.5 },
          ],
          draw: (p) => Array.from({ length: 8 }, (_, i): Shape => ({ k: 'pt', x: i + 1, y: p.a * p.q ** i })),
          readout: (p) => `$a_n=${d(p.a)}\\cdot${par(d(p.q))}^{\\,n-1}$`,
        },
        {
          t: 'thm',
          title: 'Somma dei primi n termini',
          md: R`Se $q\neq1$: $$S_n=a_1\,\frac{q^n-1}{q-1}$$ (Se $q=1$ tutti i termini sono uguali e $S_n=n\,a_1$.)`,
          proof: [
            R`Scriviamo $S_n=a_1+a_1q+a_1q^2+\dots+a_1q^{n-1}$.`,
            R`Moltiplichiamo per $q$: $qS_n=a_1q+a_1q^2+\dots+a_1q^{n-1}+a_1q^n$.`,
            R`Sottraiamo la prima dalla seconda: quasi tutti i termini si elidono e resta $qS_n-S_n=a_1q^n-a_1$.`,
            R`Raccogliendo: $S_n(q-1)=a_1(q^n-1)$ e, poiché $q\neq1$, $S_n=a_1\dfrac{q^n-1}{q-1}$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Un capitale di $1000$ € è investito al $5\%$ annuo composto. Quanto vale dopo $3$ anni?`,
          steps: [R`Ogni anno il capitale viene moltiplicato per $1{,}05$: i valori formano una progressione geometrica di ragione $q=1{,}05$.`, R`Dopo $n$ anni: $C_n=1000\cdot1{,}05^{\,n}$.`, R`$C_3=1000\cdot1{,}05^3=1000\cdot1{,}157625\approx1157{,}63$ €.`],
        },
        { t: 'warn', md: R`Non confondere le due progressioni: nell'aritmetica è costante la **differenza** tra termini consecutivi, nella geometrica è costante il **rapporto**.` },
        {
          t: 'quiz',
          q: R`La successione $3,\ 6,\ 12,\ 24,\dots$ è`,
          options: [
            { md: 'una progressione geometrica di ragione $2$', ok: true, why: 'Esatto: ogni termine è il doppio del precedente.' },
            { md: 'una progressione aritmetica di ragione $3$', why: 'Le differenze sono $3,6,12$: non sono costanti.' },
            { md: 'una progressione geometrica di ragione $3$', why: 'Il rapporto tra termini consecutivi è $6/3=2$.' },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'suc-termine',
      level: 1,
      title: 'Termine di una successione',
      make: (r) => {
        const a = nz(r, -3, 4), b = int(r, -5, 5), n = int(r, 3, 8);
        const quad = r() < 0.5;
        const v = quad ? a * n * n + b : a * n + b;
        const f = quad ? `${a === 1 ? '' : a === -1 ? '-' : a}n^2${sg(b)}` : `${a === 1 ? '' : a === -1 ? '-' : a}n${sg(b)}`;
        return {
          text: `Data la successione ${m(`a_n=${f}`)}, calcola ${m(`a_{${n}}`)}.`,
          answer: v,
          tol: 0,
          hints: [`Sostituisci ${m(`n=${n}`)} nella formula.`],
          solution: [quad ? `${m(`a_{${n}}=${a}\\cdot${n}^2${sg(b)}=${a * n * n}${sg(b)}=${v}`)}` : `${m(`a_{${n}}=${a}\\cdot${n}${sg(b)}=${v}`)}`],
        };
      },
    },
    {
      id: 'suc-tipo',
      level: 1,
      title: 'Riconoscere una progressione',
      make: (r) => {
        const a = int(r, 1, 6), k = int(r, 2, 4);
        const type = pick(r, ['ar', 'ge', 'no'] as const);
        const terms = type === 'ar' ? [0, 1, 2, 3].map((i) => a + i * k) : type === 'ge' ? [0, 1, 2, 3].map((i) => a * k ** i) : [1, 2, 3, 4].map((i) => i * i + a);
        const lab = { ar: `Progressione aritmetica di ragione $${k}$`, ge: `Progressione geometrica di ragione $${k}$`, no: 'Né aritmetica né geometrica' };
        const why = { ar: `Le differenze tra termini consecutivi sono tutte uguali a $${k}$.`, ge: `I rapporti tra termini consecutivi sono tutti uguali a $${k}$.`, no: `Le differenze ($${terms[1] - terms[0]}$, $${terms[2] - terms[1]}$, $${terms[3] - terms[2]}$) non sono costanti, e nemmeno i rapporti.` };
        const others = (['ar', 'ge', 'no'] as const).filter((t) => t !== type);
        return {
          text: `La successione ${m(`${terms.join(',\\ ')},\\dots`)} è:`,
          options: choice(r, [[lab[type], `Corretto. ${why[type]}`], ...others.map((t): [string, string] => [lab[t], `Controlla differenze e rapporti tra termini consecutivi. ${why[type]}`])]),
          hints: ['Calcola le differenze tra termini consecutivi: sono costanti?', 'Se no, calcola i rapporti tra termini consecutivi.'],
          solution: [why[type], `Quindi: ${lab[type].toLowerCase()}.`],
        };
      },
    },
    {
      id: 'ar-termine',
      level: 1,
      title: 'Progressione aritmetica: termine generale',
      make: (r) => {
        const a1 = int(r, -8, 12), dd = nz(r, -5, 6), n = int(r, 8, 30);
        const v = a1 + (n - 1) * dd;
        return {
          text: `In una progressione aritmetica ${m(`a_1=${a1}`)} e la ragione è ${m(`d=${dd}`)}. Calcola ${m(`a_{${n}}`)}.`,
          answer: v,
          tol: 0,
          hints: [R`Usa $a_n=a_1+(n-1)d$.`, `Per arrivare al termine ${n} si fanno ${n - 1} passi.`],
          steps: [
            { ask: 'Quale formula dà il termine generale di una progressione aritmetica?', options: choice(r, [[R`$a_n=a_1+(n-1)\,d$`], [R`$a_n=a_1+n\,d$`, 'Con questa formula $a_1$ varrebbe $a_1+d$: i passi dal primo termine sono $n-1$.'], [R`$a_n=a_1\cdot d^{\,n-1}$`, 'Questa è la formula della progressione **geometrica**.']]), explain: R`$a_n=a_1+(n-1)\,d$.` },
            { ask: `Quanti "passi" di ampiezza $d$ servono per andare da $a_1$ a ${m(`a_{${n}}`)}?`, options: mc(r, m(n - 1), [[m(n), 'Dal primo al secondo termine c\'è un solo passo: i passi sono uno in meno dell\'indice.']], [m(n + 1), m(n - 2)]), explain: `Servono ${m(`${n}-1=${n - 1}`)} passi.` },
            { ask: `Quanto vale ${m(`a_{${n}}=${a1}+${n - 1}\\cdot${par(dd)}`)}?`, options: mc(r, m(v), [[m(a1 + n * dd), 'Hai usato $n$ passi invece di $n-1$.'], [m(a1 - (n - 1) * dd), 'Attenzione al segno della ragione.']], [m(v + 1), m(v - dd - 1)]), explain: `${m(`a_{${n}}=${a1}${sg((n - 1) * dd)}=${v}`)}.` },
          ],
          solution: [`${m(`a_{${n}}=a_1+(${n}-1)\\,d=${a1}+${n - 1}\\cdot${par(dd)}`)}`, `${m(`a_{${n}}=${v}`)}`],
        };
      },
    },
    {
      id: 'ar-ragione',
      level: 2,
      title: 'Progressione aritmetica: ragione',
      make: (r) => {
        const dd = nz(r, -4, 5), a1 = int(r, -6, 10), p = int(r, 2, 5), q = p + int(r, 2, 6);
        const ap = a1 + (p - 1) * dd, aq = a1 + (q - 1) * dd;
        return {
          text: `In una progressione aritmetica ${m(`a_{${p}}=${ap}`)} e ${m(`a_{${q}}=${aq}`)}. Determina la ragione $d$.`,
          answer: dd,
          tol: 0,
          hints: [R`Vale $a_q=a_p+(q-p)\,d$.`, `Tra il termine ${p} e il termine ${q} ci sono ${q - p} passi.`],
          solution: [`${m(`a_{${q}}=a_{${p}}+(${q}-${p})\\,d`)}`, `${m(`${aq}=${ap}+${q - p}\\,d\\Rightarrow d=\\dfrac{${aq}-${par(ap)}}{${q - p}}=${dd}`)}`],
        };
      },
    },
    {
      id: 'ar-somma',
      level: 2,
      title: 'Progressione aritmetica: somma',
      make: (r) => {
        const a1 = int(r, -5, 10), dd = nz(r, -3, 5), n = int(r, 8, 25);
        const an = a1 + (n - 1) * dd, s = (n * (a1 + an)) / 2;
        return {
          text: `Calcola la somma dei primi ${m(n)} termini della progressione aritmetica con ${m(`a_1=${a1}`)} e ${m(`d=${dd}`)}.`,
          answer: s,
          tol: 0,
          hints: [R`Serve $S_n=\dfrac{n(a_1+a_n)}{2}$: calcola prima $a_n$.`, `${m(`a_{${n}}=a_1+(n-1)d`)}.`],
          steps: [
            { ask: `Quanto vale l'ultimo termine ${m(`a_{${n}}`)}?`, options: mc(r, m(an), [[m(a1 + n * dd), 'I passi sono $n-1$, non $n$.']], [m(an + 1), m(an - dd - 1), m(an + 2 * dd + 1)]), explain: `${m(`a_{${n}}=${a1}+${n - 1}\\cdot${par(dd)}=${an}`)}.` },
            { ask: R`Applica $S_n=\dfrac{n(a_1+a_n)}{2}$. Quanto vale la somma?`, options: mc(r, m(s), [[m(n * (a1 + an)), 'Hai dimenticato di dividere per $2$.'], [m(((n - 1) * (a1 + an)) / 2), 'I termini sono $n$, non $n-1$.']], [m(s + n), m(s - 1)]), explain: `${m(`S_{${n}}=\\dfrac{${n}\\,(${a1}+${par(an)})}{2}=${s}`)}.` },
          ],
          solution: [`${m(`a_{${n}}=${a1}+${n - 1}\\cdot${par(dd)}=${an}`)}`, `${m(`S_{${n}}=\\dfrac{${n}\\,(${a1}+${par(an)})}{2}=${s}`)}`],
        };
      },
    },
    {
      id: 'ar-indice',
      level: 2,
      title: 'Progressione aritmetica: posto di un termine',
      make: (r) => {
        const a1 = int(r, -6, 9), dd = int(r, 2, 6), n = int(r, 9, 30);
        const an = a1 + (n - 1) * dd;
        return {
          text: `Nella progressione aritmetica con ${m(`a_1=${a1}`)} e ${m(`d=${dd}`)}, quale posto $n$ occupa il termine che vale ${m(an)}?`,
          answer: n,
          tol: 0,
          hints: [R`Imponi $a_1+(n-1)d$ uguale al valore dato e ricava $n$.`],
          solution: [`${m(`${a1}+(n-1)\\cdot${dd}=${an}`)}`, `${m(`(n-1)=\\dfrac{${an}-${par(a1)}}{${dd}}=${n - 1}`)}`, `${m(`n=${n}`)}`],
        };
      },
    },
    {
      id: 'ge-termine',
      level: 1,
      title: 'Progressione geometrica: termine generale',
      make: (r) => {
        const a1 = nz(r, -4, 5), q = pick(r, [2, 3, -2, -3]), n = int(r, 4, 6);
        const v = a1 * q ** (n - 1);
        return {
          text: `In una progressione geometrica ${m(`a_1=${a1}`)} e la ragione è ${m(`q=${q}`)}. Calcola ${m(`a_{${n}}`)}.`,
          answer: v,
          tol: 0,
          hints: [R`Usa $a_n=a_1\cdot q^{\,n-1}$.`, `L'esponente è ${m(`${n}-1=${n - 1}`)}.`],
          solution: [`${m(`a_{${n}}=a_1\\cdot q^{${n - 1}}=${a1}\\cdot${par(q)}^{${n - 1}}`)}`, `${m(`=${a1}\\cdot${par(q ** (n - 1))}=${v}`)}`],
        };
      },
    },
    {
      id: 'ge-ragione',
      level: 2,
      title: 'Progressione geometrica: ragione',
      make: (r) => {
        const q = pick(r, [2, 3, 4, 5]), a1 = int(r, 1, 6), p = int(r, 1, 3), e = pick(r, [2, 3]);
        const ap = a1 * q ** (p - 1), aq = ap * q ** e;
        return {
          text: `In una progressione geometrica a termini positivi ${m(`a_{${p}}=${ap}`)} e ${m(`a_{${p + e}}=${aq}`)}. Determina la ragione $q$.`,
          answer: q,
          tol: 0,
          hints: [R`Vale $a_m=a_k\cdot q^{\,m-k}$.`, `Quindi ${m(`q^{${e}}=\\dfrac{${aq}}{${ap}}`)}.`],
          solution: [`${m(`a_{${p + e}}=a_{${p}}\\cdot q^{${e}}`)}`, `${m(`q^{${e}}=\\dfrac{${aq}}{${ap}}=${q ** e}`)}`, `Essendo i termini positivi, ${m(`q=\\sqrt[${e}]{${q ** e}}=${q}`)}.`],
        };
      },
    },
    {
      id: 'ge-somma',
      level: 2,
      title: 'Progressione geometrica: somma',
      make: (r) => {
        const a1 = int(r, 1, 5), q = pick(r, [2, 3]), n = int(r, 4, 7);
        const s = (a1 * (q ** n - 1)) / (q - 1);
        return {
          text: `Calcola la somma dei primi ${m(n)} termini della progressione geometrica con ${m(`a_1=${a1}`)} e ${m(`q=${q}`)}.`,
          answer: s,
          tol: 0,
          hints: [R`Usa $S_n=a_1\,\dfrac{q^n-1}{q-1}$.`, `${m(`${q}^{${n}}=${q ** n}`)}.`],
          steps: [
            { ask: 'Quale formula dà la somma dei primi $n$ termini di una progressione geometrica ($q\\neq1$)?', options: choice(r, [[R`$S_n=a_1\,\dfrac{q^n-1}{q-1}$`], [R`$S_n=\dfrac{n(a_1+a_n)}{2}$`, 'Questa è la somma della progressione **aritmetica**.'], [R`$S_n=a_1\,\dfrac{q^{n-1}-1}{q-1}$`, 'Nella somma l\'esponente è $n$; è nel termine generale che compare $n-1$.']]), explain: R`$S_n=a_1\,\dfrac{q^n-1}{q-1}$.` },
            { ask: `Quanto vale ${m(`${q}^{${n}}`)}?`, options: mc(r, m(q ** n), [[m(q * n), 'Una potenza non è un prodotto: $q^n$ significa moltiplicare $q$ per sé stesso $n$ volte.'], [m(q ** (n - 1)), `Questo è ${m(`${q}^{${n - 1}}`)}.`]], [m(q ** (n + 1))]), explain: `${m(`${q}^{${n}}=${q ** n}`)}.` },
            { ask: 'Quanto vale la somma?', options: mc(r, m(s), [[m(a1 * (q ** n - 1)), 'Hai dimenticato di dividere per $q-1$.'], [m(a1 * q ** n), 'Manca il $-1$ al numeratore e la divisione per $q-1$.']], [m(s + a1), m(s - 1)]), explain: `${m(`S_{${n}}=${a1}\\cdot\\dfrac{${q ** n}-1}{${q}-1}=${s}`)}.` },
          ],
          solution: [`${m(`S_{${n}}=a_1\\,\\dfrac{q^{${n}}-1}{q-1}=${a1}\\cdot\\dfrac{${q ** n}-1}{${q - 1}}`)}`, `${m(`S_{${n}}=${s}`)}`],
        };
      },
    },
    {
      id: 'suc-ricorsiva',
      level: 2,
      title: 'Successione per ricorrenza',
      make: (r) => {
        const a1 = int(r, 1, 4), k = pick(r, [2, 3]), c = nz(r, -3, 3);
        const t = [a1];
        for (let i = 0; i < 3; i++) t.push(k * t[i] + c);
        return {
          text: `Una successione è definita da ${m(`a_1=${a1}`)} e ${m(`a_{n+1}=${k}a_n${sg(c)}`)}. Calcola ${m('a_4')}.`,
          answer: t[3],
          tol: 0,
          hints: ['Calcola i termini uno alla volta: ogni termine si ottiene dal precedente.', `${m(`a_2=${k}\\cdot${a1}${sg(c)}=${t[1]}`)}`],
          solution: [`${m(`a_2=${k}\\cdot${par(t[0])}${sg(c)}=${t[1]}`)}`, `${m(`a_3=${k}\\cdot${par(t[1])}${sg(c)}=${t[2]}`)}`, `${m(`a_4=${k}\\cdot${par(t[2])}${sg(c)}=${t[3]}`)}`],
        };
      },
    },
    {
      id: 'ar-due-termini',
      level: 3,
      title: 'Ricostruire una progressione aritmetica',
      make: (r) => {
        const a1 = int(r, -6, 8), dd = nz(r, -4, 5), p = int(r, 3, 5), q = p + int(r, 3, 5), n = int(r, 10, 20);
        const ap = a1 + (p - 1) * dd, aq = a1 + (q - 1) * dd, an = a1 + (n - 1) * dd;
        const s = (n * (a1 + an)) / 2;
        return {
          text: `In una progressione aritmetica ${m(`a_{${p}}=${ap}`)} e ${m(`a_{${q}}=${aq}`)}. Calcola la somma dei primi ${m(n)} termini.`,
          answer: s,
          tol: 0,
          hints: [`Trova la ragione da ${m(`a_{${q}}=a_{${p}}+${q - p}\\,d`)}.`, `Poi ricava ${m('a_1')} da ${m(`a_{${p}}=a_1+${p - 1}\\,d`)}.`, R`Infine calcola $a_n$ e applica $S_n=\dfrac{n(a_1+a_n)}{2}$.`],
          solution: [`${m(`d=\\dfrac{${aq}-${par(ap)}}{${q - p}}=${dd}`)}`, `${m(`a_1=a_{${p}}-${p - 1}\\,d=${ap}-${p - 1}\\cdot${par(dd)}=${a1}`)}`, `${m(`a_{${n}}=${a1}+${n - 1}\\cdot${par(dd)}=${an}`)}`, `${m(`S_{${n}}=\\dfrac{${n}\\,(${a1}+${par(an)})}{2}=${s}`)}`],
        };
      },
    },
    {
      id: 'ge-interesse',
      level: 3,
      title: 'Capitalizzazione composta',
      make: (r) => {
        const c = pick(r, [1000, 2000, 5000, 10000]), i = pick(r, [2, 3, 4, 5, 10]), n = int(r, 2, 4);
        const v = c * (1 + i / 100) ** n;
        return {
          text: `Un capitale di ${m(c)} € è investito al tasso annuo composto del ${m(`${i}\\%`)}. Quanti euro vale dopo ${m(n)} anni? (Arrotonda ai centesimi.)`,
          answer: Math.round(v * 100) / 100,
          tol: 0.02,
          hints: [`Ogni anno il capitale viene moltiplicato per ${m(dec(1 + i / 100))}.`, `I valori annuali formano una progressione geometrica: ${m(`C_n=C_0\\cdot q^{\\,n}`)}.`],
          solution: [`Fattore annuo: ${m(`q=1+\\dfrac{${i}}{100}=${dec(1 + i / 100)}`)}.`, `${m(`C_{${n}}=${c}\\cdot${dec(1 + i / 100)}^{${n}}\\approx${dec(v)}`)} €.`, `Attenzione: non è ${m(dec(c * (1 + (i * n) / 100)))} € (interesse semplice), perché gli interessi maturano anche sugli interessi precedenti.`],
        };
      },
    },
  ],
};
