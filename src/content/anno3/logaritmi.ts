import { dec, frac, int, m, mc, nz, pick, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

export const logaritmi: Unit = {
  id: 'a3-logaritmi',
  year: 3,
  title: 'Logaritmi',
  summary: 'Definizione e proprietà, funzione logaritmica, equazioni e disequazioni.',
  lessons: [
    {
      id: 'a3-log-1',
      title: 'Definizione e proprietà dei logaritmi',
      blocks: [
        { t: 'idea', md: R`Il logaritmo risponde alla domanda inversa dell'esponenziale: **"a quale esponente devo elevare la base per ottenere questo numero?"**. $\log_2 8=3$ perché $2^3=8$. I logaritmi trasformano prodotti in somme: per questo misurano grandezze che variano su scale enormi (terremoti, decibel, pH).` },
        { t: 'def', title: 'Logaritmo', md: R`Dati $a>0$, $a\neq1$ e $b>0$, il **logaritmo in base $a$ di $b$** è l'esponente da dare ad $a$ per ottenere $b$: $$\log_ab=x\iff a^x=b$$ $b$ si chiama **argomento** e deve essere **positivo**.

Conseguenze immediate: $\log_a1=0$, $\ \log_aa=1$, $\ \log_aa^k=k$, $\ a^{\log_ab}=b$.

Notazioni: $\log x$ indica la base $10$, $\ln x$ la base $e$ (logaritmo naturale).` },
        {
          t: 'thm',
          title: 'Proprietà dei logaritmi',
          md: R`Per $a>0$, $a\neq1$, $b>0$, $c>0$:
- **prodotto:** $\log_a(b\cdot c)=\log_ab+\log_ac$
- **quoziente:** $\log_a\dfrac bc=\log_ab-\log_ac$
- **potenza:** $\log_ab^k=k\,\log_ab$
- **cambiamento di base:** $\log_ab=\dfrac{\log_cb}{\log_ca}$`,
          proof: [
            R`**Prodotto.** Poniamo $x=\log_ab$ e $y=\log_ac$, cioè $a^x=b$ e $a^y=c$.`,
            R`Allora $b\cdot c=a^x\cdot a^y=a^{x+y}$. Per definizione di logaritmo: $\log_a(bc)=x+y=\log_ab+\log_ac$.`,
            R`**Potenza.** Da $a^x=b$ segue $b^k=(a^x)^k=a^{kx}$, quindi $\log_ab^k=kx=k\log_ab$.`,
            R`**Cambiamento di base.** Da $a^x=b$, applicando $\log_c$ a entrambi i membri: $x\log_ca=\log_cb$, cioè $x=\dfrac{\log_cb}{\log_ca}$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Calcola $\log_2\dfrac18$, $\ \log_93$, $\ \log_62+\log_618$.`,
          steps: [R`$\log_2\dfrac18=\log_22^{-3}=-3$.`, R`$\log_93$: cerchiamo $x$ con $9^x=3$, cioè $3^{2x}=3^1$: $x=\dfrac12$.`, R`$\log_62+\log_618=\log_6(2\cdot18)=\log_636=2$.`],
        },
        { t: 'def', title: 'Funzione logaritmica', md: R`La funzione $y=\log_ax$ è l'**inversa** dell'esponenziale $y=a^x$:
- **Dominio:** $x>0$. **Immagine:** $\mathbb R$.
- Passa per $(1;0)$ e per $(a;1)$.
- Se $a>1$ è **crescente**; se $0<a<1$ è **decrescente**.
- L'asse $y$ è **asintoto verticale**.` },
        {
          t: 'plot',
          title: 'Logaritmo ed esponenziale: funzioni inverse',
          caption: R`$y=\log_ax$ (in colore) e $y=a^x$ (tratteggiata) sono simmetriche rispetto alla bisettrice $y=x$.`,
          view: [-4, 8, -4.5, 4.5],
          params: [{ name: 'a', label: 'a', min: 0.25, max: 4, step: 0.25, value: 2 }],
          draw: (p) =>
            p.a === 1
              ? [{ k: 'fn', f: (x) => x, dash: true }]
              : [
                  { k: 'fn', f: (x) => (x > 0 ? Math.log(x) / Math.log(p.a) : NaN) },
                  { k: 'fn', f: (x) => p.a ** x, dash: true, color: 'var(--plot-3)' },
                  { k: 'fn', f: (x) => x, dash: true, color: 'var(--muted)' },
                  { k: 'pt', x: 1, y: 0 },
                ],
          readout: (p) => (p.a === 1 ? 'La base $1$ non è ammessa.' : `$y=\\log_{${d(p.a)}}x$: **${p.a > 1 ? 'crescente' : 'decrescente'}**`),
        },
        { t: 'warn', md: R`Errori da evitare: $\log(a+b)\neq\log a+\log b$ (la proprietà vale per il **prodotto**); $\log a\cdot\log b\neq\log(ab)$; $\dfrac{\log a}{\log b}\neq\log\dfrac ab$. Inoltre il logaritmo di un numero negativo o di zero **non esiste**.` },
        {
          t: 'quiz',
          q: R`Quanto vale $\log_5 1$?`,
          options: [
            { md: '$0$', ok: true, why: 'Esatto: $5^0=1$.' },
            { md: '$1$', why: R`$\log_55=1$; qui l'argomento è $1$.` },
            { md: 'Non esiste', why: 'L\'argomento $1$ è positivo: il logaritmo esiste.' },
          ],
        },
      ],
    },
    {
      id: 'a3-log-2',
      title: 'Equazioni e disequazioni logaritmiche',
      blocks: [
        { t: 'idea', md: R`Con i logaritmi si risolvono le equazioni esponenziali "impossibili" con le sole potenze, come $2^x=5$. E quando l'incognita sta **dentro** un logaritmo, il primo passo è sempre lo stesso: assicurarsi che gli argomenti siano positivi.` },
        { t: 'def', title: 'Equazioni logaritmiche', md: R`1. **Condizioni di esistenza:** ogni argomento deve essere $>0$.
2. Si riporta l'equazione a una delle forme
   - $\log_aA(x)=k\iff A(x)=a^k$
   - $\log_aA(x)=\log_aB(x)\iff A(x)=B(x)$
   usando le proprietà dei logaritmi.
3. Si risolve e si **confrontano** le soluzioni con le condizioni di esistenza.` },
        {
          t: 'ex',
          title: R`Risolvi $\log_2x+\log_2(x-2)=3$.`,
          steps: [R`C.E.: $x>0$ e $x-2>0$, cioè $x>2$.`, R`Proprietà del prodotto: $\log_2[x(x-2)]=3$.`, R`Per definizione: $x(x-2)=2^3=8$, cioè $x^2-2x-8=0$, con soluzioni $x=4$ e $x=-2$.`, R`Solo $x=4$ rispetta $x>2$. **Soluzione: $x=4$.**`],
        },
        { t: 'def', title: 'Equazioni esponenziali risolte con i logaritmi', md: R`Se i due membri non si possono scrivere con la stessa base: $$a^{x}=b\iff x=\log_ab\qquad(b>0)$$ In generale si applica il logaritmo a entrambi i membri e si usa la proprietà della potenza. Per il calcolo numerico: $\log_ab=\dfrac{\ln b}{\ln a}$.` },
        {
          t: 'ex',
          title: R`In quanti anni raddoppia un capitale investito al $4\%$ annuo composto?`,
          steps: [R`Dopo $t$ anni il capitale è $C_0\cdot1{,}04^t$. Cerchiamo $t$ tale che $1{,}04^t=2$.`, R`$t=\log_{1{,}04}2=\dfrac{\ln2}{\ln1{,}04}$.`, R`$t\approx\dfrac{0{,}6931}{0{,}0392}\approx17{,}7$ anni.`],
        },
        { t: 'def', title: 'Disequazioni logaritmiche', md: R`Dopo aver posto le condizioni di esistenza:
- se $a>1$: $\log_aA(x)>\log_aB(x)\iff A(x)>B(x)$ — verso **conservato**;
- se $0<a<1$: $\log_aA(x)>\log_aB(x)\iff A(x)<B(x)$ — verso **invertito**.

La soluzione finale è l'intersezione con le condizioni di esistenza.` },
        {
          t: 'ex',
          title: R`Risolvi $\log_3(x-1)<2$.`,
          steps: [R`C.E.: $x-1>0\Rightarrow x>1$.`, R`Scriviamo $2=\log_39$: $\log_3(x-1)<\log_39$.`, R`Base $3>1$: il verso si conserva, $x-1<9\Rightarrow x<10$.`, R`Intersezione con la C.E.: $1<x<10$.`],
        },
        { t: 'warn', md: R`La condizione di esistenza **non è facoltativa**: in una disequazione come $\log_3(x-1)<2$ dimenticarla porta alla risposta sbagliata $x<10$ (che include valori per cui il logaritmo non esiste).` },
      ],
    },
  ],
  exercises: [
    {
      id: 'log-calcolo',
      level: 1,
      title: 'Calcolo di un logaritmo',
      make: (r) => {
        const b = pick(r, [2, 3, 5, 10]), k = nz(r, -3, 4);
        const arg = k > 0 ? `${b ** k}` : `\\dfrac{1}{${b ** -k}}`;
        return {
          text: `Calcola ${m(`\\log_{${b}}${arg}`)}.`,
          answer: k,
          tol: 0,
          hints: [`Chiediti: a quale esponente devo elevare ${m(b)} per ottenere l'argomento?`, k < 0 ? R`Ricorda che $\dfrac{1}{a^n}=a^{-n}$.` : `Scrivi l'argomento come potenza di ${m(b)}.`],
          steps: [
            { ask: `Scrivi l'argomento come potenza di ${m(b)}:`, options: mc(r, m(`${b}^{${k}}`), [[m(`${b}^{${-k}}`), k < 0 ? 'Il reciproco corrisponde a un esponente **negativo**.' : 'L\'argomento è maggiore di $1$: l\'esponente è positivo.']], [m(`${b}^{${k + 1}}`), m(`${b}^{${k - 1}}`), m(`${b}^{${k + 2}}`)]), explain: `${m(`${arg}=${b}^{${k}}`)}.` },
            { ask: `Quindi ${m(`\\log_{${b}}${b}^{${k}}`)} vale:`, options: mc(r, m(k), [[m(b ** Math.abs(k)), 'Il logaritmo è l\'**esponente**, non la potenza.'], [m(-k), 'Attenzione al segno dell\'esponente.']], [m(k + 1), m(b)]), explain: `${m(`\\log_aa^k=k`)}: il risultato è ${m(k)}.` },
          ],
          solution: [`${m(`${arg}=${b}^{${k}}`)}`, `${m(`\\log_{${b}}${b}^{${k}}=${k}`)}`],
        };
      },
    },
    {
      id: 'log-definizione',
      level: 1,
      title: 'Dalla definizione',
      make: (r) => {
        const b = pick(r, [2, 3, 4, 5]), k = int(r, 2, 4);
        return {
          text: `Trova $x$ sapendo che ${m(`\\log_{${b}}x=${k}`)}.`,
          answer: b ** k,
          tol: 0,
          hints: [R`$\log_ax=k\iff x=a^k$.`],
          solution: [`Per definizione: ${m(`x=${b}^{${k}}=${b ** k}`)}.`],
        };
      },
    },
    {
      id: 'log-dominio',
      level: 1,
      title: 'Dominio di una funzione logaritmica',
      make: (r) => {
        const a = pick(r, [1, 2, 3, -1, -2]), k = int(r, -4, 4);
        const arg = `${a === 1 ? '' : a === -1 ? '-' : a}x${sg(-a * k)}`;
        const good = m(`x${a > 0 ? '>' : '<'}${k}`);
        return {
          text: `Determina il dominio di ${m(`f(x)=\\ln(${arg})`)}.`,
          options: mc(r, good, [
            [m(`x${a > 0 ? '\\ge' : '\\le'}${k}`), 'L\'argomento deve essere **strettamente** positivo: $\\ln0$ non esiste.'],
            [m(`x${a > 0 ? '<' : '>'}${k}`), a < 0 ? 'Dividendo per un numero negativo il verso si inverte.' : 'Verso sbagliato: controlla sostituendo un valore.'],
            [m(`x\\neq${k}`), 'Non basta che l\'argomento sia diverso da zero: deve essere positivo.'],
          ]),
          hints: ['L\'argomento del logaritmo deve essere maggiore di zero.'],
          solution: [`Condizione: ${m(`${arg}>0`)}.`, `${a < 0 ? 'Dividendo per un numero negativo il verso si inverte: ' : ''}${good}.`],
        };
      },
    },
    {
      id: 'log-proprieta',
      level: 2,
      title: 'Somma di logaritmi',
      make: (r) => {
        const [p, q] = pick(r, [[2, 3], [2, 5], [3, 5], [2, 7], [3, 4]]), k = pick(r, [1, 2]);
        const diff = r() < 0.4;
        const b = p * q;
        // somma: log_b(p^k) + log_b(q^k) = k ; differenza: log_p(p^(k+1) q) - log_p(q) = k+1
        return diff
          ? {
              text: `Calcola ${m(`\\log_{${p}}${p ** (k + 1) * q}-\\log_{${p}}${q}`)}.`,
              answer: k + 1,
              tol: 0,
              hints: [R`$\log_ab-\log_ac=\log_a\dfrac bc$.`],
              solution: [`${m(`\\log_{${p}}\\dfrac{${p ** (k + 1) * q}}{${q}}=\\log_{${p}}${p ** (k + 1)}`)}`, `${m(`=${k + 1}`)}`],
            }
          : {
              text: `Calcola ${m(`\\log_{${b}}${p ** k}+\\log_{${b}}${q ** k}`)}.`,
              answer: k,
              tol: 0,
              hints: [R`$\log_ab+\log_ac=\log_a(bc)$.`],
              solution: [`${m(`\\log_{${b}}(${p ** k}\\cdot${q ** k})=\\log_{${b}}${b ** k}`)}`, `${m(`=${k}`)}`],
            };
      },
    },
    {
      id: 'log-espandi',
      level: 2,
      title: 'Applicare le proprietà',
      make: (r) => {
        const p = int(r, 2, 4), q = int(r, 2, 5);
        const t = (c: number, v: string) => `${c === 1 ? '' : c}\\log ${v}`;
        const good = `${t(p, 'a')}+${t(1, 'b')}-${t(q, 'c')}`;
        return {
          text: `Sviluppa, usando le proprietà dei logaritmi, ${m(`\\log\\dfrac{a^{${p}}\\,b}{c^{${q}}}`)} (con $a,b,c>0$).`,
          options: mc(r, m(good), [
            [m(`${t(p, 'a')}+${t(1, 'b')}+${t(q, 'c')}`), 'Il logaritmo di un **quoziente** è una differenza: il termine a denominatore va sottratto.'],
            [m(`${t(p, 'a')}\\cdot${t(1, 'b')}-${t(q, 'c')}`), 'Il logaritmo di un prodotto è la **somma** dei logaritmi, non il prodotto.'],
            [m(`\\log^{${p}}a+\\log b-\\log^{${q}}c`), R`L'esponente dell'argomento diventa un **coefficiente**: $\log a^k=k\log a$.`],
          ]),
          hints: ['Quoziente → differenza; prodotto → somma; potenza → coefficiente.'],
          solution: [`${m(`\\log(a^{${p}}b)-\\log c^{${q}}`)}`, `${m(`=\\log a^{${p}}+\\log b-\\log c^{${q}}`)}`, `${m(`=${good}`)}`],
        };
      },
    },
    {
      id: 'log-base',
      level: 2,
      title: 'Cambiamento di base',
      make: (r) => {
        const b = pick(r, [2, 3]), i = pick(r, [2, 3]), j = nz(r, 1, 5, i, 2 * i);
        return {
          text: `Calcola ${m(`\\log_{${b ** i}}${b ** j}`)}.`,
          options: mc(r, m(frac(j, i)), [
            [m(frac(i, j)), 'Rapporto invertito: l\'esponente dell\'argomento va a numeratore.'],
            [m(frac(b ** j, b ** i)), 'Non si dividono argomento e base: si confrontano gli **esponenti** rispetto a una base comune.'],
            [m(j - i), R`Non è una differenza: $\log_{a^i}a^j=\dfrac ji$.`],
          ], [m(frac(j + 1, i)), m(frac(j, i + 1))]),
          hints: [`Passa alla base ${m(b)}: ${m(`\\log_ab=\\dfrac{\\log_cb}{\\log_ca}`)}.`, `Oppure cerca $x$ tale che ${m(`(${b}^{${i}})^x=${b}^{${j}}`)}.`],
          solution: [`${m(`\\log_{${b ** i}}${b ** j}=\\dfrac{\\log_{${b}}${b ** j}}{\\log_{${b}}${b ** i}}=\\dfrac{${j}}{${i}}=${frac(j, i)}`)}`],
        };
      },
    },
    {
      id: 'log-eq-semplice',
      level: 1,
      title: 'Equazione logaritmica elementare',
      make: (r) => {
        const b = pick(r, [2, 3, 5]), k = int(r, 1, 3), a = nz(r, -6, 6);
        const x = b ** k - a;
        return {
          text: `Risolvi l'equazione ${m(`\\log_{${b}}(x${sg(a)})=${k}`)}.`,
          answer: x,
          tol: 0,
          hints: [R`$\log_aA=k\iff A=a^k$.`, `Quindi ${m(`x${sg(a)}=${b}^{${k}}`)}.`],
          steps: [
            { ask: 'Qual è la condizione di esistenza?', options: mc(r, m(`x>${-a}`), [[m(`x\\ge${-a}`), 'L\'argomento deve essere strettamente positivo.'], [m(`x>${a}`), 'Risolvi con attenzione: l\'argomento è $x' + sg(a) + '$.']], [m(`x>0`), m(`x\\neq${-a}`)]), explain: `${m(`x${sg(a)}>0\\iff x>${-a}`)}.` },
            { ask: 'Applicando la definizione di logaritmo si ottiene:', options: mc(r, m(`x${sg(a)}=${b ** k}`), [[m(`x${sg(a)}=${b * k}`), `${m(`${b}^{${k}}`)} è una potenza, non un prodotto.`], [m(`x${sg(a)}=${k ** b}`), 'Base ed esponente sono scambiati.']], [m(`x${sg(a)}=${k}`), m(`x${sg(a)}=${b ** k + 1}`)]), explain: `${m(`x${sg(a)}=${b}^{${k}}=${b ** k}`)}, quindi ${m(`x=${x}`)}, che rispetta la condizione di esistenza.` },
          ],
          solution: [`C.E.: ${m(`x>${-a}`)}.`, `${m(`x${sg(a)}=${b}^{${k}}=${b ** k}`)}`, `${m(`x=${x}`)}, accettabile.`],
        };
      },
    },
    {
      id: 'log-esp',
      level: 2,
      title: 'Equazione esponenziale con i logaritmi',
      make: (r) => {
        const b = pick(r, [2, 3, 5]), c = pick(r, [7, 10, 11, 13, 20]);
        return {
          text: `Risolvi l'equazione ${m(`${b}^x=${c}`)}.`,
          options: mc(r, m(`x=\\log_{${b}}${c}`), [
            [m(`x=\\log_{${c}}${b}`), 'Base e argomento sono scambiati: la base del logaritmo è la base della potenza.'],
            [m(`x=${frac(c, b)}`), 'L\'incognita è all\'esponente: non si può dividere per la base.'],
            [m(`x=\\sqrt[${b}]{${c}}`), `La radice risolverebbe ${m(`x^{${b}}=${c}`)}, non ${m(`${b}^x=${c}`)}.`],
          ]),
          hints: [R`Per definizione $a^x=b\iff x=\log_ab$.`],
          solution: [`${m(`x=\\log_{${b}}${c}=\\dfrac{\\ln${c}}{\\ln${b}}\\approx${dec(Math.log(c) / Math.log(b))}`)}`],
        };
      },
    },
    {
      id: 'log-diseq',
      level: 2,
      title: 'Disequazione logaritmica',
      make: (r) => {
        const b = pick(r, [2, 3]), k = int(r, 1, 3), a = int(r, -4, 4);
        const lt = r() < 0.6;
        const up = a + b ** k;
        const good = lt ? m(`${a}<x<${up}`) : m(`x>${up}`);
        return {
          text: `Risolvi la disequazione ${m(`\\log_{${b}}(x${sg(-a)})${lt ? '<' : '>'}${k}`)}.`,
          options: mc(r, good, [
            [lt ? m(`x<${up}`) : m(`x>${a}`), lt ? `Hai dimenticato la condizione di esistenza ${m(`x>${a}`)}.` : 'Questa è solo la condizione di esistenza.'],
            [lt ? m(`x>${up}`) : m(`${a}<x<${up}`), 'Con base maggiore di $1$ il verso si conserva: ricontrolla.'],
            [lt ? m(`${a}<x<${a + b * k}`) : m(`x>${a + b * k}`), `${m(`${b}^{${k}}`)} è una potenza, non un prodotto.`],
          ], [m(`x<${a}`), m(`x>${up + 1}`)]),
          hints: ['Poni la condizione di esistenza: argomento $>0$.', `Scrivi ${m(k)} come ${m(`\\log_{${b}}${b ** k}`)} e confronta gli argomenti (base $>1$: verso conservato).`],
          solution: [`C.E.: ${m(`x>${a}`)}.`, `${m(`\\log_{${b}}(x${sg(-a)})${lt ? '<' : '>'}\\log_{${b}}${b ** k}`)}, base $>1$: ${m(`x${sg(-a)}${lt ? '<' : '>'}${b ** k}`)}, cioè ${m(`x${lt ? '<' : '>'}${up}`)}.`, `Intersezione con la C.E.: ${good}.`],
        };
      },
    },
    {
      id: 'log-eq-prodotto',
      level: 3,
      title: 'Equazione con somma di logaritmi',
      make: (r) => {
        const p = int(r, 3, 8), q = nz(r, 1, 6, p);
        // log x + log(x - a) = log K, con a = p - q, K = p q: radici p (accettabile) e -q (non accettabile)
        const a = p - q, K = p * q;
        return {
          text: `Risolvi l'equazione ${m(`\\log x+\\log(x${sg(-a)})=\\log${K}`)}.`,
          options: mc(r, m(`x=${p}`), [
            [m(`x=${-q}\\ \\lor\\ x=${p}`), `${m(`x=${-q}`)} non rispetta le condizioni di esistenza: ${m(`\\log(${-q})`)} non esiste.`],
            [m(`x=${-q}`), 'Hai tenuto la soluzione non accettabile e scartato quella valida.'],
            [m(`x=${frac(K + a, 2)}`), R`$\log A+\log B=\log(A\cdot B)$, non $\log(A+B)$.`],
          ], [m(`x=${p + 1}`)]),
          hints: ['Poni le condizioni di esistenza per entrambi i logaritmi.', R`Usa $\log A+\log B=\log(AB)$ e uguaglia gli argomenti.`, 'Controlla l\'accettabilità delle soluzioni.'],
          solution: [`C.E.: ${m('x>0')} e ${m(`x>${a}`)}, cioè ${m(`x>${Math.max(a, 0)}`)}.`, `${m(`\\log[x(x${sg(-a)})]=\\log${K}\\Rightarrow x^2${sg(-a, 'x')}-${K}=0`)}`, `Soluzioni: ${m(`x=${p}`)} e ${m(`x=${-q}`)}.`, `Solo ${m(`x=${p}`)} è accettabile.`],
        };
      },
    },
    {
      id: 'log-diseq-base',
      level: 3,
      title: 'Disequazione con base minore di 1',
      make: (r) => {
        const b = pick(r, [2, 3]), k = int(r, 1, 3);
        const gt = r() < 0.5;
        const lim = frac(1, b ** k);
        const good = gt ? m(`0<x<${lim}`) : m(`x>${lim}`);
        return {
          text: `Risolvi la disequazione ${m(`\\log_{\\frac{1}{${b}}}x${gt ? '>' : '<'}${k}`)}.`,
          options: mc(r, good, [
            [gt ? m(`x>${lim}`) : m(`0<x<${lim}`), 'La base è minore di $1$: il verso si **inverte** passando agli argomenti.'],
            [gt ? m(`x<${lim}`) : m(`x<${lim}`), 'Manca la condizione di esistenza $x>0$, e controlla il verso.'],
            [gt ? m(`0<x<${b ** k}`) : m(`x>${b ** k}`), R`$\left(\dfrac1b\right)^k=\dfrac{1}{b^k}$: hai usato la base sbagliata.`],
          ], [m(`x>0`)]),
          hints: ['C.E.: $x>0$.', `Scrivi ${m(k)} come ${m(`\\log_{\\frac{1}{${b}}}${lim}`)}; con base minore di $1$ il verso si inverte.`],
          solution: [`C.E.: $x>0$.`, `${m(`${k}=\\log_{\\frac{1}{${b}}}\\left(\\dfrac{1}{${b}}\\right)^{${k}}=\\log_{\\frac{1}{${b}}}${lim}`)}`, `Base minore di $1$, verso invertito: ${m(`x${gt ? '<' : '>'}${lim}`)}.`, `Con la C.E.: ${good}.`],
        };
      },
    },
    {
      id: 'log-raddoppio',
      level: 3,
      title: 'Tempo di raddoppio',
      make: (r) => {
        const i = pick(r, [2, 3, 4, 5, 6, 8, 10]);
        const t = Math.log(2) / Math.log(1 + i / 100);
        return {
          text: `Un capitale è investito al tasso annuo composto del ${m(`${i}\\%`)}. Dopo quanti anni raddoppia? (Risposta con una cifra decimale.)`,
          answer: Math.round(t * 10) / 10,
          tol: 0.15,
          hints: [`Il capitale dopo $t$ anni è ${m(`C_0\\cdot${dec(1 + i / 100)}^{\\,t}`)}.`, `Risolvi ${m(`${dec(1 + i / 100)}^{\\,t}=2`)} con i logaritmi.`],
          solution: [`${m(`C_0\\cdot${dec(1 + i / 100)}^{\\,t}=2C_0\\Rightarrow${dec(1 + i / 100)}^{\\,t}=2`)}`, `${m(`t=\\dfrac{\\ln2}{\\ln${dec(1 + i / 100)}}\\approx${dec(t, 1)}`)} anni.`],
        };
      },
    },
  ],
};
