import { choice, frac, int, m, mc, nz, par, pick, poly, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');

export const funzioni: Unit = {
  id: 'a3-funzioni',
  year: 3,
  title: 'Funzioni e loro proprietà',
  summary: 'Dominio, proprietà, funzione composta e inversa, trasformazioni dei grafici.',
  lessons: [
    {
      id: 'a3-fun-1',
      title: 'Che cos\'è una funzione: dominio e immagine',
      blocks: [
        { t: 'idea', md: R`Una funzione è una "macchina" che a ogni ingresso ammesso associa **una e una sola** uscita. Il prezzo di un pieno in funzione dei litri, l'area di un quadrato in funzione del lato: a ogni valore di partenza corrisponde un unico risultato.` },
        { t: 'def', title: 'Funzione', md: R`Dati due insiemi $A$ e $B$, una **funzione** $f:A\to B$ è una legge che a **ogni** elemento $x\in A$ associa **uno e un solo** elemento $y=f(x)\in B$.
- $A$ è il **dominio**, $B$ il **codominio**;
- $y=f(x)$ è l'**immagine** di $x$; $x$ è una **controimmagine** di $y$;
- l'insieme di tutte le immagini $f(A)\subseteq B$ è l'**insieme immagine** (o codominio effettivo).

Per una funzione reale di variabile reale data da un'espressione $y=f(x)$, il **dominio naturale** è l'insieme dei numeri reali per cui l'espressione ha significato.` },
        { t: 'def', title: 'Come si determina il dominio', md: R`- **Frazione** $\dfrac{N(x)}{D(x)}$: si impone $D(x)\neq0$
- **Radice di indice pari** $\sqrt[2n]{A(x)}$: si impone $A(x)\ge0$
- **Radice di indice dispari**: nessuna condizione sul radicando
- **Logaritmo** $\log_a A(x)$: si impone $A(x)>0$
- Polinomi, seno, coseno, esponenziali: definiti per ogni $x$ reale

Se compaiono più condizioni, devono valere **tutte insieme** (sistema).` },
        {
          t: 'ex',
          title: R`Determina il dominio di $f(x)=\dfrac{\sqrt{x+3}}{x-1}$.`,
          steps: [
            R`C'è una radice quadrata: il radicando deve essere non negativo, $x+3\ge0\Rightarrow x\ge-3$.`,
            R`C'è una frazione: il denominatore deve essere diverso da zero, $x-1\neq0\Rightarrow x\neq1$.`,
            R`Le due condizioni valgono insieme: $D=\{x\in\mathbb R: x\ge-3,\ x\neq1\}$, cioè $[-3,1)\cup(1,+\infty)$.`,
          ],
        },
        {
          t: 'plot',
          title: 'Dominio di una funzione con radice',
          caption: R`Grafico di $y=\sqrt{x-a}$: la curva esiste solo dove il radicando è non negativo, cioè per $x\ge a$.`,
          view: [-6, 8, -1, 5],
          params: [{ name: 'a', label: 'a', min: -5, max: 5, step: 0.5, value: 1 }],
          draw: (p) => [{ k: 'fn', f: (x) => (x >= p.a ? Math.sqrt(x - p.a) : NaN) }, { k: 'pt', x: p.a, y: 0 }],
          readout: (p) => `Dominio: $x\\ge${d(p.a)}$ — Immagine: $y\\ge0$`,
        },
        { t: 'def', title: 'Zeri e segno', md: R`Gli **zeri** di $f$ sono le soluzioni di $f(x)=0$: sono le ascisse dei punti in cui il grafico incontra l'asse $x$. Studiare il **segno** significa risolvere $f(x)>0$: il grafico sta sopra l'asse $x$ dove $f$ è positiva, sotto dove è negativa.` },
        { t: 'warn', md: R`Non ogni curva è il grafico di una funzione: se una retta verticale incontra la curva in **più di un punto**, a quella $x$ corrisponderebbero più valori di $y$. La circonferenza $x^2+y^2=1$, per esempio, non è il grafico di una funzione.` },
        {
          t: 'quiz',
          q: R`Qual è il dominio di $f(x)=\dfrac{1}{x^2+1}$?`,
          options: [
            { md: R`Tutto $\mathbb R$`, ok: true, why: R`Esatto: $x^2+1\ge1$ non si annulla mai.` },
            { md: R`$x\neq\pm1$`, why: R`$x^2+1=0$ non ha soluzioni reali: non c'è nessun valore da escludere.` },
            { md: R`$x\neq-1$`, why: R`Sostituendo $x=-1$ il denominatore vale $2$, non $0$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-fun-2',
      title: 'Proprietà delle funzioni',
      blocks: [
        { t: 'idea', md: R`Le proprietà di una funzione raccontano il "carattere" del suo grafico: sale o scende? È simmetrico? Ogni uscita proviene da un solo ingresso? Riconoscerle fa risparmiare calcoli e permette di disegnare grafici con poche informazioni.` },
        { t: 'def', title: 'Iniettiva, suriettiva, biiettiva', md: R`Una funzione $f:A\to B$ è
- **iniettiva** se elementi diversi hanno immagini diverse: $x_1\neq x_2\Rightarrow f(x_1)\neq f(x_2)$ (ogni retta orizzontale incontra il grafico al più una volta);
- **suriettiva** se ogni elemento di $B$ è immagine di almeno un elemento di $A$: $f(A)=B$;
- **biiettiva** (o biunivoca) se è sia iniettiva sia suriettiva.` },
        { t: 'def', title: 'Monotonia', md: R`In un intervallo $I$ del dominio, $f$ è
- **crescente** (in senso stretto) se $x_1<x_2\Rightarrow f(x_1)<f(x_2)$;
- **decrescente** (in senso stretto) se $x_1<x_2\Rightarrow f(x_1)>f(x_2)$.

Una funzione strettamente monotòna è sempre iniettiva.` },
        { t: 'def', title: 'Funzioni pari e dispari', md: R`Sia il dominio simmetrico rispetto allo zero.
- $f$ è **pari** se $f(-x)=f(x)$ per ogni $x$: grafico simmetrico rispetto all'**asse $y$** (es. $x^2$, $|x|$, $\cos x$).
- $f$ è **dispari** se $f(-x)=-f(x)$ per ogni $x$: grafico simmetrico rispetto all'**origine** (es. $x^3$, $\frac1x$, $\sin x$).

Molte funzioni non sono né pari né dispari (es. $x^2+x$).` },
        {
          t: 'plot',
          title: 'Potenze pari e dispari',
          caption: R`Grafico di $y=x^n$. Con $n$ pari il grafico è simmetrico rispetto all'asse $y$; con $n$ dispari rispetto all'origine.`,
          view: [-2.5, 2.5, -4, 4],
          params: [{ name: 'n', label: 'n', min: 1, max: 6, step: 1, value: 2 }],
          draw: (p) => [{ k: 'fn', f: (x) => x ** p.n }],
          readout: (p) => (p.n % 2 === 0 ? `$n=${p.n}$ pari: $f(-x)=f(x)$, funzione **pari**, non iniettiva.` : `$n=${p.n}$ dispari: $f(-x)=-f(x)$, funzione **dispari**, crescente e iniettiva.`),
        },
        {
          t: 'ex',
          title: R`Stabilisci se $f(x)=\dfrac{x^3}{x^2+1}$ è pari o dispari.`,
          steps: [
            R`Il dominio è $\mathbb R$ (il denominatore non si annulla mai), quindi è simmetrico rispetto allo zero.`,
            R`Calcoliamo $f(-x)=\dfrac{(-x)^3}{(-x)^2+1}=\dfrac{-x^3}{x^2+1}$.`,
            R`Risulta $f(-x)=-f(x)$: la funzione è **dispari**.`,
          ],
        },
        { t: 'def', title: 'Funzione periodica', md: R`$f$ è **periodica** di periodo $T>0$ se $f(x+T)=f(x)$ per ogni $x$ del dominio (e $T$ è il più piccolo numero positivo con questa proprietà). Il grafico si ripete identico a intervalli di ampiezza $T$.` },
        {
          t: 'quiz',
          q: R`La funzione $f(x)=x^2$, da $\mathbb R$ a $\mathbb R$, è iniettiva?`,
          options: [
            { md: 'No', ok: true, why: R`Giusto: per esempio $f(2)=f(-2)=4$, due ingressi diversi con la stessa uscita.` },
            { md: 'Sì', why: R`Controlla: $f(2)=4$ e $f(-2)=4$. Elementi diversi con la stessa immagine.` },
            { md: 'Dipende dal valore di $x$', why: R`L'iniettività è una proprietà della funzione nel suo dominio, non di un singolo valore.` },
          ],
        },
      ],
    },
    {
      id: 'a3-fun-3',
      title: 'Funzione composta, funzione inversa, trasformazioni',
      blocks: [
        { t: 'idea', md: R`Comporre due funzioni significa applicarle **una dopo l'altra**, come due macchine in catena. Invertire una funzione significa far girare la macchina **al contrario**: dall'uscita si risale all'ingresso (ed è possibile solo se ogni uscita proviene da un unico ingresso).` },
        { t: 'def', title: 'Funzione composta', md: R`Date $f$ e $g$, la funzione composta $g\circ f$ ("$g$ dopo $f$") è $$(g\circ f)(x)=g(f(x))$$ Si applica **prima** $f$ e **poi** $g$. In generale $g\circ f\neq f\circ g$: la composizione **non è commutativa**.` },
        {
          t: 'ex',
          title: R`Date $f(x)=x+1$ e $g(x)=x^2$, calcola $g\circ f$ e $f\circ g$.`,
          steps: [
            R`$(g\circ f)(x)=g(f(x))=g(x+1)=(x+1)^2=x^2+2x+1$.`,
            R`$(f\circ g)(x)=f(g(x))=f(x^2)=x^2+1$.`,
            R`I due risultati sono diversi: l'ordine conta.`,
          ],
        },
        { t: 'def', title: 'Funzione inversa', md: R`Se $f:A\to B$ è **biiettiva**, la sua inversa $f^{-1}:B\to A$ associa a ogni $y\in B$ l'unico $x\in A$ tale che $f(x)=y$.

**Procedimento:** si scrive $y=f(x)$, si ricava $x$ in funzione di $y$, infine si scambiano i nomi delle variabili.

I grafici di $f$ e $f^{-1}$ sono **simmetrici rispetto alla bisettrice** $y=x$.` },
        {
          t: 'ex',
          title: R`Trova l'inversa di $f(x)=\dfrac{2x-1}{x+3}$.`,
          steps: [
            R`Scriviamo $y=\dfrac{2x-1}{x+3}$ con $x\neq-3$ e ricaviamo $x$: $y(x+3)=2x-1$.`,
            R`$xy+3y=2x-1\Rightarrow xy-2x=-3y-1\Rightarrow x(y-2)=-3y-1$.`,
            R`$x=\dfrac{-3y-1}{y-2}=\dfrac{3y+1}{2-y}$, con $y\neq2$.`,
            R`Scambiando i nomi: $f^{-1}(x)=\dfrac{3x+1}{2-x}$.`,
          ],
        },
        { t: 'def', title: 'Trasformazioni del grafico', md: R`A partire dal grafico di $y=f(x)$:
- $y=f(x)+k$: traslazione **verticale** di $k$ (verso l'alto se $k>0$)
- $y=f(x-h)$: traslazione **orizzontale** di $h$ (verso destra se $h>0$)
- $y=-f(x)$: simmetria rispetto all'asse $x$
- $y=f(-x)$: simmetria rispetto all'asse $y$
- $y=a\,f(x)$ con $a>0$: dilatazione verticale di fattore $a$
- $y=|f(x)|$: si ribalta sopra l'asse $x$ la parte negativa` },
        {
          t: 'plot',
          title: 'Traslare e dilatare una parabola',
          caption: R`In tratteggio $y=x^2$; in colore $y=a(x-h)^2+k$. Osserva che $h>0$ sposta il grafico verso **destra**.`,
          view: [-6, 6, -5, 8],
          params: [
            { name: 'a', label: 'a', min: -2, max: 2, step: 0.25, value: 1 },
            { name: 'h', label: 'h', min: -4, max: 4, step: 0.5, value: 2 },
            { name: 'k', label: 'k', min: -4, max: 4, step: 0.5, value: -1 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => x * x, dash: true, color: 'var(--muted)' },
            { k: 'fn', f: (x) => p.a * (x - p.h) ** 2 + p.k },
            { k: 'pt', x: p.h, y: p.k, label: 'V' },
          ],
          readout: (p) => `Vertice $V(${d(p.h)};\\ ${d(p.k)})$`,
        },
        { t: 'warn', md: R`Nella traslazione orizzontale il segno "inganna": $y=f(x-2)$ sposta il grafico di $2$ verso **destra**, $y=f(x+2)$ di $2$ verso **sinistra**.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'fun-valore',
      level: 1,
      title: 'Valore di una funzione',
      make: (r) => {
        const a = nz(r, -3, 3), b = nz(r, -5, 5), c = int(r, -6, 6), x0 = nz(r, -4, 4);
        const v = a * x0 * x0 + b * x0 + c;
        return {
          text: `Data ${m(`f(x)=${poly([a, b, c])}`)}, calcola ${m(`f(${x0})`)}.`,
          answer: v,
          tol: 0,
          hints: [`Sostituisci ${m(`x=${x0}`)} nell'espressione, usando le parentesi.`, 'Attenzione: prima la potenza, poi il prodotto per il coefficiente.'],
          solution: [`${m(`f(${x0})=${a}\\cdot${par(x0)}^2${sg(b)}\\cdot${par(x0)}${sg(c)}`)}`, `${m(`=${a * x0 * x0}${sg(b * x0)}${sg(c)}=${v}`)}`],
        };
      },
    },
    {
      id: 'fun-dominio-fratta',
      level: 1,
      title: 'Dominio di una funzione fratta',
      make: (r) => {
        const p = nz(r, -5, 5), q = nz(r, -5, 5, p, -p);
        const lo = Math.min(p, q), hi = Math.max(p, q);
        const den = poly([1, -(p + q), p * q]);
        const k = nz(r, 1, 5);
        return {
          text: `Determina il dominio di ${m(`f(x)=\\dfrac{x${sg(k)}}{${den}}`)}.`,
          options: mc(r, m(`x\\neq${lo}\\ \\land\\ x\\neq${hi}`), [
            [m(`x\\neq${-k}`), 'Hai escluso lo zero del **numeratore**: lì la funzione vale semplicemente $0$. Vanno esclusi gli zeri del denominatore.'],
            [m(`x\\neq${-hi}\\ \\land\\ x\\neq${-lo}`), 'I valori esclusi hanno il segno sbagliato: risolvi con attenzione $D(x)=0$.'],
            [m(`${lo}<x<${hi}`), 'Non c\'è nessuna radice: non serve una disequazione, basta $D(x)\\neq0$.'],
          ], [R`$\mathbb R$`]),
          hints: ['In una frazione il denominatore deve essere diverso da zero.', `Risolvi ${m(`${den}=0`)} ed escludi le soluzioni.`],
          solution: [`Condizione: ${m(`${den}\\neq0`)}.`, `${m(`${den}=0`)} per ${m(`x=${lo}`)} e ${m(`x=${hi}`)}.`, `Dominio: ${m(`x\\neq${lo}\\ \\land\\ x\\neq${hi}`)}.`],
        };
      },
    },
    {
      id: 'fun-dominio-radice',
      level: 1,
      title: 'Dominio di una funzione irrazionale',
      make: (r) => {
        const a = pick(r, [-3, -2, -1, 1, 2, 3]), k = int(r, -4, 4);
        const b = -a * k; // radicando ax+b, zero in x=k
        const good = m(`x${a > 0 ? '\\ge' : '\\le'}${k}`);
        return {
          text: `Determina il dominio di ${m(`f(x)=\\sqrt{${poly([a, b])}}`)}.`,
          options: mc(r, good, [
            [m(`x${a > 0 ? '\\le' : '\\ge'}${k}`), a < 0 ? 'Il verso è sbagliato: controlla sostituendo un valore.' : 'Il verso è sbagliato: il coefficiente di $x$ è positivo, quindi non si inverte.'],
            [m(`x${a > 0 ? '>' : '<'}${k}`), 'Il radicando può anche essere **uguale** a zero: $\\sqrt0=0$ esiste.'],
            [m(`x\\neq${k}`), 'Questa è la condizione per un denominatore. Per una radice quadrata serve radicando $\\ge0$.'],
          ], [R`$\mathbb R$`]),
          hints: ['Il radicando di una radice quadrata deve essere $\\ge0$.', a < 0 ? 'Dividendo per un numero negativo il verso della disequazione si inverte.' : 'Risolvi la disequazione di primo grado.'],
          solution: [`Condizione: ${m(`${poly([a, b])}\\ge0`)}.`, `${m(`${a}x\\ge${-b}`)}${a < 0 ? ', e dividendo per un numero negativo il verso si inverte' : ''}: ${good}.`],
        };
      },
    },
    {
      id: 'fun-dominio-radice2',
      level: 2,
      title: 'Dominio con radice e trinomio',
      make: (r) => {
        const k = int(r, 1, 6);
        const inside = r() < 0.5; // sqrt(k^2 - x^2) oppure sqrt(x^2-k^2)
        const rad = inside ? `${k * k}-x^2` : `x^2-${k * k}`;
        const inn = m(`-${k}\\le x\\le${k}`), ext = m(`x\\le-${k}\\ \\lor\\ x\\ge${k}`);
        return {
          text: `Determina il dominio di ${m(`f(x)=\\sqrt{${rad}}`)}.`,
          options: mc(r, inside ? inn : ext, [
            [inside ? ext : inn, 'Hai scelto gli intervalli opposti: controlla il segno del coefficiente di $x^2$ e prova con $x=0$.'],
            [m(`x${inside ? '\\le' : '\\ge'}${k}`), R`Da $x^2\ge k^2$ non segue solo $x\ge k$: bisogna considerare anche i valori negativi.`],
            [m(`x\\neq\\pm${k}`), 'Questa sarebbe la condizione per un denominatore, non per una radice.'],
          ]),
          hints: ['Imponi radicando $\\ge0$: è una disequazione di secondo grado.', `Le radici dell'equazione associata sono ${m(`\\pm${k}`)}.`],
          solution: [`Condizione: ${m(`${rad}\\ge0`)}.`, `L'equazione associata ha radici ${m(`x=\\pm${k}`)}.`, inside ? `Cambiando segno: ${m(`x^2-${k * k}\\le0`)}, verificata per valori interni: ${inn}.` : `Il trinomio (con $a>0$) è non negativo per valori esterni: ${ext}.`],
        };
      },
    },
    {
      id: 'fun-parita',
      level: 2,
      title: 'Funzioni pari e dispari',
      make: (r) => {
        const [f, kind, why] = pick(r, [
          [R`x^4-3x^2+1`, 'pari', R`$f(-x)=(-x)^4-3(-x)^2+1=x^4-3x^2+1=f(x)$`],
          [R`x^3-2x`, 'dispari', R`$f(-x)=-x^3+2x=-(x^3-2x)=-f(x)$`],
          [R`\dfrac{x}{x^2+4}`, 'dispari', R`$f(-x)=\dfrac{-x}{x^2+4}=-f(x)$`],
          [R`x^2+x`, 'nessuna', R`$f(-x)=x^2-x$, che non è né $f(x)$ né $-f(x)$`],
          [R`|x|-1`, 'pari', R`$f(-x)=|-x|-1=|x|-1=f(x)$`],
          [R`\dfrac{1}{x^3}`, 'dispari', R`$f(-x)=\dfrac{1}{-x^3}=-f(x)$`],
          [R`x^3+1`, 'nessuna', R`$f(-x)=-x^3+1$, che non è né $f(x)$ né $-f(x)=-x^3-1$`],
          [R`\dfrac{x^2}{x^4+1}`, 'pari', R`$f(-x)=\dfrac{x^2}{x^4+1}=f(x)$`],
          [R`x\,|x|`, 'dispari', R`$f(-x)=-x\,|-x|=-x|x|=-f(x)$`],
        ] as const);
        const label = { pari: 'Pari', dispari: 'Dispari', nessuna: 'Né pari né dispari' };
        const others = (['pari', 'dispari', 'nessuna'] as const).filter((k) => k !== kind);
        return {
          text: `La funzione ${m(`f(x)=${f}`)} è pari, dispari o nessuna delle due?`,
          options: choice(r, [[label[kind], `Corretto: ${why}.`], ...others.map((k): [string, string] => [label[k], `Calcola $f(-x)$ e confrontalo con $f(x)$ e con $-f(x)$: ${why}.`])]),
          hints: ['Calcola $f(-x)$ sostituendo $-x$ al posto di $x$.', R`Se $f(-x)=f(x)$ è pari; se $f(-x)=-f(x)$ è dispari.`],
          solution: [`Il dominio è simmetrico rispetto allo zero.`, `${why}.`, `Quindi la funzione è: **${label[kind].toLowerCase()}**.`],
        };
      },
    },
    {
      id: 'fun-iniettiva',
      level: 2,
      title: 'Iniettività',
      make: (r) => {
        const inj = pick(r, [R`f(x)=x^3`, R`f(x)=2x-5`, R`f(x)=\sqrt{x}`, R`f(x)=\dfrac1x`]);
        const non = [
          [R`f(x)=x^2`, R`$f(1)=f(-1)=1$`],
          [R`f(x)=|x|`, R`$f(2)=f(-2)=2$`],
          [R`f(x)=x^4-1`, R`$f(1)=f(-1)=0$`],
          [R`f(x)=x^2-2x`, R`$f(0)=f(2)=0$`],
        ] as const;
        return {
          text: 'Quale delle seguenti funzioni è **iniettiva** nel suo dominio naturale?',
          options: choice(r, [[m(inj), 'Corretto: valori diversi di $x$ danno sempre immagini diverse (ogni retta orizzontale incontra il grafico al più una volta).'], ...non.slice(0, 3).map(([f, why]): [string, string] => [m(f), `Non è iniettiva: ${why}, due valori diversi con la stessa immagine.`])]),
          hints: ['Una funzione è iniettiva se $x_1\\neq x_2$ implica $f(x_1)\\neq f(x_2)$.', 'Prova il test della retta orizzontale: se incontra il grafico in due punti, la funzione non è iniettiva.'],
          solution: [`${m(inj)} è iniettiva: a valori diversi di $x$ corrispondono immagini diverse.`, `Le altre non lo sono: per esempio ${non[0][1]} e ${non[1][1]}.`],
        };
      },
    },
    {
      id: 'fun-composta-valore',
      level: 2,
      title: 'Funzione composta: valore',
      make: (r) => {
        const a = nz(r, -3, 3), b = int(r, -4, 4), c = int(r, -3, 3), x0 = nz(r, -3, 3);
        const fg = a * (x0 * x0 + c) + b; // f(g(x0))
        const gf = (a * x0 + b) ** 2 + c; // g(f(x0))
        const which = r() < 0.5;
        return {
          text: `Date ${m(`f(x)=${poly([a, b])}`)} e ${m(`g(x)=${poly([1, 0, c])}`)}, calcola ${m(which ? `(f\\circ g)(${x0})` : `(g\\circ f)(${x0})`)}.`,
          answer: which ? fg : gf,
          tol: 0,
          hints: [which ? R`$(f\circ g)(x)=f(g(x))$: applica **prima** $g$, poi $f$.` : R`$(g\circ f)(x)=g(f(x))$: applica **prima** $f$, poi $g$.`, which ? `Calcola prima ${m(`g(${x0})`)}.` : `Calcola prima ${m(`f(${x0})`)}.`],
          solution: which
            ? [`${m(`g(${x0})=${par(x0)}^2${sg(c)}=${x0 * x0 + c}`)}`, `${m(`f(${x0 * x0 + c})=${a}\\cdot${par(x0 * x0 + c)}${sg(b)}=${fg}`)}`, `Nota: nell'ordine opposto si otterrebbe ${m(`(g\\circ f)(${x0})=${gf}`)}.`]
            : [`${m(`f(${x0})=${a}\\cdot${par(x0)}${sg(b)}=${a * x0 + b}`)}`, `${m(`g(${a * x0 + b})=${par(a * x0 + b)}^2${sg(c)}=${gf}`)}`, `Nota: nell'ordine opposto si otterrebbe ${m(`(f\\circ g)(${x0})=${fg}`)}.`],
        };
      },
    },
    {
      id: 'fun-composta-espr',
      level: 3,
      title: 'Funzione composta: espressione',
      make: (r) => {
        const a = int(r, 2, 4), b = nz(r, -4, 4);
        const fog = poly([a, 0, b]); // f(g(x)) = a x^2 + b
        const gof = poly([a * a, 2 * a * b, b * b]); // g(f(x)) = (ax+b)^2
        const which = r() < 0.5;
        return {
          text: `Date ${m(`f(x)=${poly([a, b])}`)} e ${m('g(x)=x^2')}, qual è l'espressione di ${m(which ? 'f\\circ g' : 'g\\circ f')}?`,
          options: mc(r, m(which ? fog : gof), [
            [m(which ? gof : fog), 'Hai composto nell\'ordine sbagliato: la funzione scritta a destra si applica per prima.'],
            [m(poly([a, b, 0])), 'Questo è il **prodotto** $f(x)\\cdot g(x)$, non la composizione.'],
            [m(poly([a * a, 0, b * b])), R`Il quadrato di un binomio contiene anche il doppio prodotto: $(A+B)^2=A^2+2AB+B^2$.`],
          ], [m(poly([1, a, b]))]),
          hints: [which ? 'Sostituisci $g(x)=x^2$ al posto di $x$ dentro $f$.' : 'Sostituisci $f(x)$ al posto di $x$ dentro $g$, cioè eleva $f(x)$ al quadrato.'],
          solution: which ? [`${m(`(f\\circ g)(x)=f(g(x))=f(x^2)`)}`, `${m(`=${a}\\cdot x^2${sg(b)}=${fog}`)}`] : [`${m(`(g\\circ f)(x)=g(f(x))=(${poly([a, b])})^2`)}`, `${m(`=${gof}`)}`],
        };
      },
    },
    {
      id: 'fun-inversa-lineare',
      level: 2,
      title: 'Funzione inversa (lineare)',
      make: (r) => {
        const a = pick(r, [2, 3, 4, 5, -2, -3]), b = nz(r, -6, 6);
        const good = `f^{-1}(x)=\\dfrac{x${sg(-b)}}{${a}}`;
        return {
          text: `Determina la funzione inversa di ${m(`f(x)=${poly([a, b])}`)}.`,
          options: mc(r, m(good), [
            [m(`f^{-1}(x)=\\dfrac{x${sg(b)}}{${a}}`), 'Portando $b$ dall\'altra parte il suo segno cambia.'],
            [m(`f^{-1}(x)=\\dfrac{1}{${poly([a, b])}}`), 'Questo è il **reciproco** $1/f(x)$, non la funzione inversa.'],
            [m(`f^{-1}(x)=${poly([-a, -b])}`), 'Questa è la funzione **opposta** $-f(x)$, non l\'inversa.'],
          ]),
          hints: ['Scrivi $y=f(x)$ e ricava $x$ in funzione di $y$.', 'Alla fine scambia i nomi di $x$ e $y$.'],
          solution: [`${m(`y=${poly([a, b])}`)}`, `${m(`${a}x=y${sg(-b)}\\Rightarrow x=\\dfrac{y${sg(-b)}}{${a}}`)}`, `Scambiando le variabili: ${m(good)}.`],
        };
      },
    },
    {
      id: 'fun-inversa-fratta',
      level: 3,
      title: 'Funzione inversa (omografica)',
      make: (r) => {
        const a = nz(r, -5, 5), b = nz(r, -5, 5, -a);
        // y=(x+a)/(x-b)  =>  x=(by+a)/(y-1)
        const good = `f^{-1}(x)=\\dfrac{${poly([b, a])}}{x-1}`;
        return {
          text: `Determina la funzione inversa di ${m(`f(x)=\\dfrac{x${sg(a)}}{x${sg(-b)}}`)}.`,
          options: mc(r, m(good), [
            [m(`f^{-1}(x)=\\dfrac{x${sg(-b)}}{x${sg(a)}}`), 'Questo è il reciproco $1/f(x)$, non l\'inversa.'],
            [m(`f^{-1}(x)=\\dfrac{${poly([b, -a])}}{x-1}`), 'Errore di segno nel portare i termini da un membro all\'altro: ricontrolla.'],
            [m(`f^{-1}(x)=\\dfrac{${poly([b, a])}}{x+1}`), 'Raccogliendo $x$ si ottiene $x(y-1)$: controlla il segno.'],
          ]),
          hints: ['Scrivi $y=f(x)$ e moltiplica entrambi i membri per il denominatore.', 'Porta a sinistra tutti i termini con $x$, raccogli $x$ e dividi.'],
          solution: [`${m(`y(x${sg(-b)})=x${sg(a)}`)}`, `${m(`xy${sg(-b)}y=x${sg(a)}\\Rightarrow xy-x=${poly([b, a], 'y')}`)}`, `${m(`x(y-1)=${poly([b, a], 'y')}\\Rightarrow x=\\dfrac{${poly([b, a], 'y')}}{y-1}`)}`, `Scambiando le variabili: ${m(good)}, con ${m('x\\neq1')}.`],
        };
      },
    },
    {
      id: 'fun-traslazione',
      level: 1,
      title: 'Trasformazioni del grafico',
      make: (r) => {
        const h = nz(r, -5, 5), k = nz(r, -5, 5);
        const v = (x: number, y: number) => m(`V(${x};\\ ${y})`);
        return {
          text: `Il grafico di ${m(`y=(x${sg(-h)})^2${sg(k)}`)} si ottiene traslando la parabola ${m('y=x^2')}. Dove si trova il suo vertice?`,
          options: mc(r, v(h, k), [
            [v(-h, k), `Attenzione al segno della traslazione orizzontale: ${m(`(x${sg(-h)})^2`)} si annulla per ${m(`x=${h}`)}.`],
            [v(k, h), 'Hai scambiato ascissa e ordinata.'],
            [v(h, -k), 'La traslazione verticale ha lo stesso segno del termine aggiunto.'],
          ], [v(-h, -k)]),
          hints: [R`$y=f(x-h)+k$ trasla il grafico di $h$ in orizzontale e di $k$ in verticale.`, 'Il vertice è il punto in cui il quadrato si annulla.'],
          solution: [`Confrontiamo con ${m('y=(x-h)^2+k')}: qui ${m(`h=${h}`)} e ${m(`k=${k}`)}.`, `Il vertice di ${m('y=x^2')}, cioè l'origine, viene traslato in ${v(h, k)}.`],
        };
      },
    },
    {
      id: 'fun-zeri',
      level: 1,
      title: 'Zeri di una funzione',
      make: (r) => {
        const a = pick(r, [2, 3, 4, 5]), k = nz(r, -4, 4);
        const b = -a * k + pick(r, [0, 1, -1]);
        return {
          text: `Determina lo zero della funzione ${m(`f(x)=${poly([a, b])}`)}.`,
          options: mc(r, m(`x=${frac(-b, a)}`), [
            [m(`x=${frac(b, a)}`), 'Errore di segno: portando $b$ a secondo membro cambia segno.'],
            [m(`x=${frac(-a, b || 1)}`), 'Hai invertito la frazione: si divide per il coefficiente di $x$.'],
            [m(`x=${b}`), 'Questo è il valore $f(0)$ (intersezione con l\'asse $y$), non lo zero.'],
          ], [m(`x=${frac(-b + a, a)}`), m(`x=${frac(-b - a, a)}`)]),
          hints: ['Gli zeri sono le soluzioni di $f(x)=0$.'],
          solution: [`${m(`${poly([a, b])}=0`)}`, `${m(`${a}x=${-b}\\Rightarrow x=${frac(-b, a)}`)}`],
        };
      },
    },
  ],
};
