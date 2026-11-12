import { choice, frac, int, mc, nz, pick, poly, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
/** Fattore (x - a) scritto con il segno giusto: f(2) = "(x-2)", f(-3) = "(x+3)". */
const f = (a: number) => `(x${sg(-a)})`;

export const polinomi: Unit = {
  id: 'a3-polinomi',
  year: 3,
  title: 'Polinomi e scomposizioni',
  summary: 'Divisione tra polinomi, regola di Ruffini, teorema del resto, scomposizioni, frazioni algebriche.',
  lessons: [
    {
      id: 'a3-pol-1',
      title: 'Divisione tra polinomi e regola di Ruffini',
      blocks: [
        { t: 'idea', md: R`Dividere due polinomi è come dividere due numeri interi: si ottengono un **quoziente** e un **resto**. Saper dividere serve soprattutto a **scomporre**: se il resto è zero, il polinomio di partenza si scrive come prodotto di due polinomi più semplici, ed equazioni e disequazioni di grado alto diventano trattabili.` },
        { t: 'def', title: 'Divisione con resto', md: R`Dati due polinomi $A(x)$ (dividendo) e $B(x)\neq0$ (divisore), con il grado di $A$ maggiore o uguale a quello di $B$, esistono e sono unici due polinomi $Q(x)$ (quoziente) e $R(x)$ (resto) tali che
$$A(x)=B(x)\cdot Q(x)+R(x)$$
con il grado di $R$ **minore** del grado di $B$ (oppure $R=0$).
- Il grado di $Q$ è la differenza tra i gradi di $A$ e di $B$.
- Se $R(x)=0$ si dice che $A$ è **divisibile** per $B$.` },
        {
          t: 'ex',
          title: R`Esegui $(2x^3+3x^2-4x+5):(x^2+x-1)$.`,
          steps: [
            R`Dividiamo i termini di grado massimo: $2x^3:x^2=2x$. Moltiplichiamo: $2x(x^2+x-1)=2x^3+2x^2-2x$ e sottraiamo dal dividendo: resta $x^2-2x+5$.`,
            R`Ripetiamo: $x^2:x^2=1$. Moltiplichiamo: $x^2+x-1$ e sottraiamo: resta $-3x+6$.`,
            R`Il grado di $-3x+6$ è minore di quello del divisore: ci fermiamo. $Q(x)=2x+1$, $R(x)=-3x+6$.`,
            R`Verifica: $(x^2+x-1)(2x+1)+(-3x+6)=2x^3+3x^2-x-1-3x+6=2x^3+3x^2-4x+5$ ✓`,
          ],
        },
        { t: 'def', title: 'Regola di Ruffini', md: R`Quando il divisore è un binomio del tipo $x-a$ si usa uno schema rapido:
1. si scrivono in riga i coefficienti del dividendo, **ordinato e completo** (con $0$ al posto dei termini mancanti), e a sinistra il numero $a$;
2. si abbassa il primo coefficiente;
3. lo si moltiplica per $a$ e si somma il risultato al coefficiente successivo;
4. si ripete fino all'ultima colonna: l'ultimo numero è il **resto**, gli altri sono i coefficienti del quoziente (che ha un grado in meno).` },
        {
          t: 'ex',
          title: R`Esegui con Ruffini $(x^3-2x^2-5x+6):(x-3)$.`,
          steps: [
            R`Coefficienti: $1,\ -2,\ -5,\ 6$; il numero a sinistra è $a=3$.`,
            R`Abbassiamo $1$. Poi $1\cdot3=3$ e $-2+3=1$.`,
            R`$1\cdot3=3$ e $-5+3=-2$. Infine $-2\cdot3=-6$ e $6-6=0$.`,
            R`Quoziente $x^2+x-2$, resto $0$: quindi $x^3-2x^2-5x+6=(x-3)(x^2+x-2)$.`,
          ],
        },
        { t: 'warn', md: R`Dividendo per $x+2$ il numero da usare nello schema di Ruffini è $a=-2$, perché $x+2=x-(-2)$. E se manca un termine (per esempio in $x^3-4x+1$ manca $x^2$) va inserito uno $0$ al suo posto.` },
        {
          t: 'quiz',
          q: R`Dividendo un polinomio di quinto grado per uno di secondo grado, quale può essere il grado massimo del resto?`,
          options: [
            { md: R`$1$`, ok: true, why: 'Giusto: il resto ha grado minore di quello del divisore.' },
            { md: R`$2$`, why: 'Il grado del resto deve essere strettamente minore di quello del divisore.' },
            { md: R`$3$`, why: R`$3$ è il grado del quoziente ($5-2$), non del resto.` },
          ],
        },
      ],
    },
    {
      id: 'a3-pol-2',
      title: 'Teorema del resto, teorema di Ruffini, zeri razionali',
      blocks: [
        { t: 'idea', md: R`Per sapere se un polinomio è divisibile per $x-a$ non occorre fare la divisione: basta **sostituire** $a$ al posto di $x$. Da questa osservazione nasce un metodo sistematico per scomporre i polinomi di grado superiore al secondo.` },
        {
          t: 'thm',
          title: 'Teorema del resto',
          md: R`Il resto della divisione di $P(x)$ per $x-a$ è uguale a $P(a)$.`,
          proof: [
            R`Per la divisione con resto: $P(x)=(x-a)\cdot Q(x)+R$, dove $R$ è una costante perché ha grado minore di $1$.`,
            R`L'uguaglianza vale per ogni $x$: scegliamo $x=a$.`,
            R`$P(a)=(a-a)\cdot Q(a)+R=0+R$, quindi $R=P(a)$.`,
          ],
        },
        { t: 'thm', title: 'Teorema di Ruffini', md: R`$P(x)$ è divisibile per $x-a$ **se e solo se** $P(a)=0$, cioè se $a$ è uno **zero** del polinomio. In tal caso $P(x)=(x-a)\cdot Q(x)$.` },
        { t: 'thm', title: 'Zeri razionali', md: R`Se un polinomio a coefficienti **interi** $a_nx^n+\dots+a_1x+a_0$ ha uno zero razionale $\dfrac pq$ (frazione ridotta ai minimi termini), allora
- $p$ è un divisore del **termine noto** $a_0$;
- $q$ è un divisore del **primo coefficiente** $a_n$.

In particolare, se $a_n=1$ gli eventuali zeri razionali sono interi, divisori del termine noto.` },
        {
          t: 'ex',
          title: R`Scomponi $2x^3-x^2-7x+6$.`,
          steps: [
            R`Possibili zeri razionali: divisori di $6$ fratto divisori di $2$, cioè $\pm1,\ \pm2,\ \pm3,\ \pm6,\ \pm\dfrac12,\ \pm\dfrac32$.`,
            R`Proviamo $x=1$: $2-1-7+6=0$. È uno zero: il polinomio è divisibile per $x-1$.`,
            R`Con Ruffini (coefficienti $2,-1,-7,6$ e $a=1$) si ottiene il quoziente $2x^2+x-6$.`,
            R`$2x^2+x-6$ ha radici $x=\dfrac{-1\pm7}{4}$, cioè $\dfrac32$ e $-2$: $2x^2+x-6=(2x-3)(x+2)$.`,
            R`$2x^3-x^2-7x+6=(x-1)(2x-3)(x+2)$.`,
          ],
        },
        { t: 'warn', md: R`Il teorema sugli zeri razionali dice dove **cercare**, non garantisce che uno zero ci sia: $x^2-2$ non ha zeri razionali (i suoi zeri sono $\pm\sqrt2$) e $x^2+1$ non ne ha nemmeno di reali.` },
        {
          t: 'quiz',
          q: R`Qual è il resto della divisione di $x^3-2x+5$ per $x+1$?`,
          options: [
            { md: R`$6$`, ok: true, why: R`Giusto: $P(-1)=-1+2+5=6$.` },
            { md: R`$4$`, why: R`Hai calcolato $P(1)$: dividendo per $x+1$ va sostituito $x=-1$.` },
            { md: R`$0$`, why: R`$P(-1)=6\neq0$: il polinomio non è divisibile per $x+1$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-pol-3',
      title: 'Scomposizioni e frazioni algebriche',
      blocks: [
        { t: 'idea', md: R`**Scomporre** un polinomio significa scriverlo come prodotto di polinomi di grado più basso. È l'operazione inversa della moltiplicazione, ed è il primo passo per risolvere equazioni, studiare segni, semplificare frazioni. Conviene provare i metodi sempre nello stesso ordine.` },
        { t: 'def', title: 'Metodi di scomposizione, nell\'ordine', md: R`1. **Raccoglimento totale:** $ab+ac=a(b+c)$.
2. **Raccoglimento parziale:** $ax+ay+bx+by=(a+b)(x+y)$.
3. **Prodotti notevoli:**
- $a^2-b^2=(a-b)(a+b)$
- $a^2\pm2ab+b^2=(a\pm b)^2$
- $a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2)$
- $a^3\pm3a^2b+3ab^2\pm b^3=(a\pm b)^3$
4. **Trinomio speciale:** $x^2+sx+p=(x+u)(x+v)$ con $u+v=s$ e $u\cdot v=p$.
5. **Trinomio di secondo grado:** $ax^2+bx+c=a(x-x_1)(x-x_2)$ se $\Delta\ge0$.
6. **Regola di Ruffini**, dopo aver trovato uno zero.` },
        {
          t: 'ex',
          title: R`Scomponi $x^4-16$ e $x^3+2x^2-9x-18$.`,
          steps: [
            R`$x^4-16$ è una differenza di quadrati: $(x^2-4)(x^2+4)$; il primo fattore lo è ancora: $(x-2)(x+2)(x^2+4)$.`,
            R`$x^2+4$ è una **somma** di quadrati: non si scompone nei numeri reali.`,
            R`$x^3+2x^2-9x-18$: raccoglimento parziale, $x^2(x+2)-9(x+2)=(x+2)(x^2-9)$.`,
            R`$=(x+2)(x-3)(x+3)$.`,
          ],
        },
        { t: 'def', title: 'Frazioni algebriche', md: R`Una **frazione algebrica** è il quoziente di due polinomi, $\dfrac{A(x)}{B(x)}$.
- **Condizioni di esistenza (C.E.):** il denominatore deve essere diverso da zero.
- **Semplificazione:** si scompongono numeratore e denominatore e si dividono entrambi per i **fattori** comuni.
- **Somma:** si riducono le frazioni allo stesso denominatore, il **m.c.m.** dei denominatori (prodotto di tutti i fattori, comuni e non comuni, con l'esponente più alto).` },
        {
          t: 'ex',
          title: R`Semplifica $\dfrac{x^2-9}{x^2-x-6}$.`,
          steps: [
            R`Scomponiamo: $x^2-9=(x-3)(x+3)$ e $x^2-x-6=(x-3)(x+2)$.`,
            R`C.E.: $x\neq3$ e $x\neq-2$ (si leggono sul denominatore **prima** di semplificare).`,
            R`Semplifichiamo il fattore comune $(x-3)$: $\dfrac{x+3}{x+2}$.`,
          ],
        },
        { t: 'warn', md: R`Si semplificano i **fattori**, mai gli addendi. In $\dfrac{x+3}{x+2}$ non si può "togliere la $x$": numeratore e denominatore sono somme, non prodotti.` },
        {
          t: 'quiz',
          q: R`Come si scompone $x^3-8$?`,
          options: [
            { md: R`$(x-2)(x^2+2x+4)$`, ok: true, why: R`Giusto: differenza di cubi, $a^3-b^3=(a-b)(a^2+ab+b^2)$.` },
            { md: R`$(x-2)^3$`, why: R`$(x-2)^3=x^3-6x^2+12x-8$: il cubo di un binomio contiene anche i termini misti.` },
            { md: R`$(x-2)(x^2-2x+4)$`, why: R`Nel secondo fattore il termine misto ha il segno **opposto** a quello del binomio: qui deve essere $+2x$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'pol-grado',
      level: 1,
      title: 'Grado del quoziente',
      make: (r) => {
        const n = int(r, 1, 3), m = n + int(r, 1, 5);
        return {
          text: R`Si divide un polinomio di grado $${m}$ per un polinomio di grado $${n}$. Qual è il grado del quoziente?`,
          answer: m - n,
          tol: 0,
          hints: ['Il grado del quoziente è la differenza tra il grado del dividendo e quello del divisore.'],
          solution: [R`$${m}-${n}=${m - n}$.`],
        };
      },
    },
    {
      id: 'pol-resto',
      level: 1,
      title: 'Teorema del resto',
      make: (r) => {
        const a = nz(r, -3, 3), c = [1, int(r, -4, 4), int(r, -5, 5), int(r, -6, 6)];
        const val = c[0] * a ** 3 + c[1] * a ** 2 + c[2] * a + c[3];
        return {
          text: R`Calcola il resto della divisione di $${poly(c)}$ per $${f(a).slice(1, -1)}$.`,
          answer: val,
          tol: 0,
          hints: [R`Per il teorema del resto, $R=P(a)$.`, R`Qui $a=${a}$.`],
          solution: [R`Il divisore è $x-(${a})$: $R=P(${a})$.`, R`$P(${a})=${a ** 3}${sg(c[1] * a ** 2)}${sg(c[2] * a)}${sg(c[3])}=${val}$.`],
        };
      },
    },
    {
      id: 'pol-scomponi-trinomio',
      level: 1,
      title: 'Trinomio speciale',
      make: (r) => {
        const u = nz(r, -7, 7), v = nz(r, -7, 7, u, -u);
        const pr = (a: number, b: number) => `$${f(-Math.min(a, b))}${f(-Math.max(a, b))}$`;
        return {
          text: R`Scomponi il trinomio $${poly([1, u + v, u * v])}$.`,
          options: mc(r, pr(u, v), [
            [pr(-u, -v), R`Controlla i segni: la somma dei due numeri deve dare $${u + v}$.`],
            [pr(u, -v), R`Il prodotto dei due numeri deve dare $${u * v}$.`],
            [pr(-u, v), R`Il prodotto dei due numeri deve dare $${u * v}$.`],
          ], [pr(u + 1, v - 1)]),
          hints: [R`Cerca due numeri con somma $${u + v}$ e prodotto $${u * v}$.`],
          solution: [R`I numeri sono $${u}$ e $${v}$: somma $${u + v}$, prodotto $${u * v}$.`, `Scomposizione: ${pr(u, v)}.`],
        };
      },
    },
    {
      id: 'pol-ce',
      level: 1,
      title: 'Condizioni di esistenza',
      make: (r) => {
        const u = nz(r, -6, 5), v = nz(r, u + 1, 7, -u);
        const ce = (a: number, b: number) => R`$x\neq${a}\ \land\ x\neq${b}$`;
        return {
          text: R`Quali sono le condizioni di esistenza della frazione $\dfrac{x+1}{${poly([1, -(u + v), u * v])}}$?`,
          options: mc(r, ce(u, v), [
            [ce(-v, -u), 'Segni sbagliati: risolvi l\'equazione che si ottiene uguagliando a zero il denominatore.'],
            [R`$x\neq${u}$`, 'Il denominatore è di secondo grado e ha due zeri: vanno esclusi entrambi.'],
            [R`$x\neq-1$`, 'Lo zero del numeratore non va escluso: lì la frazione vale $0$.'],
          ], ['Nessuna condizione']),
          hints: ['Il denominatore deve essere diverso da zero.', R`Risolvi $${poly([1, -(u + v), u * v])}=0$.`],
          solution: [R`$${poly([1, -(u + v), u * v])}=${f(u)}${f(v)}$.`, `C.E.: ${ce(u, v)}.`],
        };
      },
    },
    {
      id: 'pol-divisibile',
      level: 2,
      title: 'Divisibilità con parametro',
      make: (r) => {
        const a = nz(r, -3, 3), t = int(r, -5, 5), c = a * t;
        return {
          text: R`Per quale valore di $k$ il polinomio $x^3+kx${sg(c)}$ è divisibile per $${f(a).slice(1, -1)}$?`,
          answer: -(a * a + t),
          tol: 0,
          hints: [R`Per il teorema di Ruffini deve essere $P(${a})=0$.`, R`Sostituisci $x=${a}$ e risolvi rispetto a $k$.`],
          solution: [R`$P(${a})=${a ** 3}${sg(a, 'k')}${sg(c)}=0$.`, R`$${a === 1 ? '' : a === -1 ? '-' : a}k=${-(a ** 3 + c)}\Rightarrow k=${-(a * a + t)}$.`],
        };
      },
    },
    {
      id: 'pol-ruffini-quoziente',
      level: 2,
      title: 'Quoziente con Ruffini',
      make: (r) => {
        const a = nz(r, -3, 3), p = nz(r, -4, 4), q = nz(r, -5, 5);
        const P = [1, p - a, q - a * p, -a * q];
        return {
          text: R`Il polinomio $${poly(P)}$ è divisibile per $${f(a).slice(1, -1)}$. Qual è il quoziente?`,
          options: mc(r, `$${poly([1, p, q])}$`, [
            [`$${poly([1, p - 2 * a, q])}$`, R`Nello schema di Ruffini va usato $a=${a}$ (lo zero del divisore), non il suo opposto.`],
            [`$${poly([1, p, -q])}$`, 'Controlla l\'ultimo passaggio: il termine noto del quoziente ha il segno sbagliato.'],
            [`$${poly([1, p - a, q - a * p])}$`, 'Questi sono i primi coefficienti del dividendo: lo schema richiede di sommare i prodotti.'],
          ], [`$${poly([1, p + 1, q])}$`]),
          hints: [R`Applica la regola di Ruffini con $a=${a}$.`, R`Coefficienti del dividendo: $${P.join(',\\ ')}$.`],
          solution: [R`Si abbassa $1$; poi $1\cdot(${a})${sg(p - a)}=${p}$; poi $${p}\cdot(${a})${sg(q - a * p)}=${q}$; infine $${q}\cdot(${a})${sg(-a * q)}=0$.`, R`Quoziente: $${poly([1, p, q])}$, resto $0$.`],
        };
      },
    },
    {
      id: 'pol-zeri-razionali',
      level: 2,
      title: 'Possibili zeri razionali',
      make: (r) => {
        const p = pick(r, [2, 3, 5]), q = pick(r, [2, 3, 5, 7].filter((x) => x !== p));
        const P = [p, int(r, -5, 5), int(r, -5, 5), q * pick(r, [1, -1])];
        return {
          text: R`Quale dei seguenti numeri **non** può essere uno zero razionale del polinomio $${poly(P)}$?`,
          options: choice(r, [
            [`$${frac(1, q)}$`, R`Corretto: il denominatore $${q}$ non divide il primo coefficiente $${p}$.`],
            [`$${frac(q, p)}$`, R`È un candidato: $${q}$ divide il termine noto e $${p}$ divide il primo coefficiente.`],
            [`$${frac(1, p)}$`, R`È un candidato: $1$ divide il termine noto e $${p}$ divide il primo coefficiente.`],
            [`$${q}$`, R`È un candidato: $${q}$ divide il termine noto e il denominatore è $1$.`],
          ]),
          hints: [R`Uno zero razionale $\dfrac pq$ ha $p$ divisore del termine noto e $q$ divisore del primo coefficiente.`],
          solution: [R`Divisori del termine noto: $\pm1,\ \pm${q}$. Divisori del primo coefficiente: $\pm1,\ \pm${p}$.`, R`Candidati: $\pm1,\ \pm${q},\ \pm${frac(1, p)},\ \pm${frac(q, p)}$. Il numero $${frac(1, q)}$ non è tra questi.`],
        };
      },
    },
    {
      id: 'pol-cubi',
      level: 2,
      title: 'Somma e differenza di cubi',
      make: (r) => {
        const a = int(r, 1, 5), minus = r() < 0.5;
        const s = minus ? -1 : 1; // x³ + s·a³
        const good = `$(x${sg(s * a)})(${poly([1, -s * a, a * a])})$`;
        return {
          text: R`Scomponi $x^3${sg(s * a ** 3)}$.`,
          options: mc(r, good, [
            [`$(x${sg(s * a)})(${poly([1, s * a, a * a])})$`, 'Nel secondo fattore il termine misto ha segno **opposto** a quello del binomio.'],
            [`$(x${sg(s * a)})^3$`, 'Il cubo di un binomio contiene anche i due termini misti.'],
            [`$(x${sg(s * a)})(x^2+${a * a})$`, 'Nel secondo fattore manca il termine misto.'],
          ]),
          hints: [R`$a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2)$.`, R`Qui $b=${a}$.`],
          solution: [R`$x^3${sg(s * a ** 3)}=x^3${minus ? '-' : '+'}${a}^3$.`, `Scomposizione: ${good}.`],
        };
      },
    },
    {
      id: 'pol-parziale',
      level: 2,
      title: 'Raccoglimento parziale',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, 1, 9, a, -a);
        return {
          text: R`Scomponi $${poly([1, a, b, a * b])}$.`,
          options: mc(r, `$(x^2+${b})${f(-a)}$`, [
            [`$(x^2${sg(a)})${f(-b)}$`, 'Sviluppa il prodotto per controllare: i coefficienti non corrispondono.'],
            [`$(x^2-${b})${f(a)}$`, 'Controlla i segni sviluppando il prodotto.'],
            [`$${f(-a)}${f(-b)}$`, 'Il prodotto di due binomi di primo grado è di secondo grado, non di terzo.'],
          ]),
          hints: [R`Raccogli $x^2$ dai primi due termini e $${b}$ dagli ultimi due.`],
          solution: [R`$x^2${f(-a)}+${b}${f(-a)}$.`, R`$=(x^2+${b})${f(-a)}$; il fattore $x^2+${b}$ non si scompone ulteriormente.`],
        };
      },
    },
    {
      id: 'pol-semplifica',
      level: 2,
      title: 'Semplificare una frazione algebrica',
      make: (r) => {
        const a = int(r, 1, 6), b = nz(r, -6, 6, a, -a);
        const fr = (n: string, d: string) => R`$\dfrac{${n}}{${d}}$`;
        return {
          text: R`Semplifica la frazione $\dfrac{x^2-${a * a}}{${poly([1, -(a + b), a * b])}}$.`,
          options: mc(r, fr(`x+${a}`, `x${sg(-b)}`), [
            [fr(`x-${a}`, `x${sg(-b)}`), R`Il fattore comune è $(x-${a})$: quello che resta al numeratore è $(x+${a})$.`],
            [fr(`x+${a}`, `x${sg(b)}`), 'Controlla la scomposizione del denominatore.'],
            [fr(`${a}`, `${b}`), 'Non si possono semplificare gli addendi: prima si scompone in fattori.'],
          ]),
          hints: ['Scomponi numeratore e denominatore.', R`$x^2-${a * a}=(x-${a})(x+${a})$.`],
          solution: [R`Numeratore: $(x-${a})(x+${a})$. Denominatore: $(x-${a})${f(b)}$.`, R`C.E.: $x\neq${a}$, $x\neq${b}$. Semplificando $(x-${a})$: $\dfrac{x+${a}}{x${sg(-b)}}$.`],
        };
      },
    },
    {
      id: 'pol-terzo-zero',
      level: 3,
      title: 'Trovare il terzo zero',
      make: (r) => {
        const u = nz(r, -4, 4), v = nz(r, -4, 4, u), w = nz(r, -5, 5, u, v);
        const P = [1, -(u + v + w), u * v + u * w + v * w, -u * v * w];
        return {
          text: R`Il polinomio $${poly(P)}$ ha come zeri $x=${u}$ e $x=${v}$. Qual è il terzo zero?`,
          answer: w,
          tol: 0,
          hints: [R`Il polinomio è divisibile per $${f(u)}${f(v)}$.`, R`In alternativa: in $x^3+ax^2+bx+c$ la somma dei tre zeri vale $-a$.`],
          solution: [R`Il polinomio si scrive $${f(u)}${f(v)}(x-x_3)$.`, R`Confrontando i termini noti: $-(${u})\cdot(${v})\cdot x_3=${-u * v * w}$, quindi $x_3=${w}$.`, R`Controllo con la somma degli zeri: $${u}+(${v})+(${w})=${u + v + w}=-a$ ✓`],
        };
      },
    },
    {
      id: 'pol-identita-divisione',
      level: 3,
      title: 'Ricostruire il dividendo',
      make: (r) => {
        const a = nz(r, -5, 5), q = nz(r, -6, 6), res = int(r, -9, 9);
        return {
          text: R`Dividendo $P(x)$ per $${f(a).slice(1, -1)}$ si ottengono quoziente $x${sg(q)}$ e resto $${res}$. Quanto vale $P(0)$?`,
          answer: -a * q + res,
          tol: 0,
          hints: [R`$P(x)=\text{divisore}\cdot\text{quoziente}+\text{resto}$.`, 'Sostituisci $x=0$.'],
          solution: [R`$P(x)=${f(a)}(x${sg(q)})${sg(res)}$.`, R`$P(0)=(${-a})\cdot(${q})${sg(res)}=${-a * q + res}$.`],
        };
      },
    },
  ],
};
