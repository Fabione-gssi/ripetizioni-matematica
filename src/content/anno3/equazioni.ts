import { choice, frac, int, m, mc, nz, par, poly, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;

export const equazioni: Unit = {
  id: 'a3-equazioni',
  year: 3,
  title: 'Equazioni e disequazioni',
  summary: 'Secondo grado e grado superiore, disequazioni fratte, valore assoluto, irrazionali.',
  lessons: [
    {
      id: 'a3-eq-1',
      title: 'Equazioni di secondo grado e di grado superiore',
      blocks: [
        { t: 'idea', md: R`Risolvere un'equazione significa trovare **tutti** i numeri che la rendono vera. Per il secondo grado esiste una formula che funziona sempre; per i gradi superiori la strategia è una sola: **scomporre in fattori** e usare il fatto che un prodotto è zero solo se è zero almeno uno dei fattori.` },
        { t: 'def', title: 'Formula risolutiva', md: R`Data $ax^2+bx+c=0$ con $a\neq 0$, si chiama **discriminante** $\Delta=b^2-4ac$.
- Se $\Delta>0$: due soluzioni reali distinte $x_{1,2}=\dfrac{-b\pm\sqrt{\Delta}}{2a}$
- Se $\Delta=0$: due soluzioni coincidenti $x=-\dfrac{b}{2a}$
- Se $\Delta<0$: nessuna soluzione reale` },
        {
          t: 'thm',
          title: 'Da dove viene la formula',
          md: R`La formula risolutiva si ottiene con il metodo del **completamento del quadrato**.`,
          proof: [
            R`Partiamo da $ax^2+bx+c=0$ e moltiplichiamo tutto per $4a$ (lecito perché $a\neq0$): $4a^2x^2+4abx+4ac=0$.`,
            R`Portiamo $4ac$ a destra e aggiungiamo $b^2$ a entrambi i membri: $4a^2x^2+4abx+b^2=b^2-4ac$.`,
            R`A sinistra riconosciamo un quadrato di binomio: $(2ax+b)^2=\Delta$.`,
            R`Se $\Delta\ge 0$ possiamo estrarre la radice: $2ax+b=\pm\sqrt{\Delta}$, da cui $x=\dfrac{-b\pm\sqrt{\Delta}}{2a}$. Se $\Delta<0$ un quadrato non può essere negativo: nessuna soluzione reale.`,
          ],
        },
        { t: 'thm', title: 'Somma e prodotto delle radici', md: R`Se $x_1,x_2$ sono le soluzioni di $ax^2+bx+c=0$ allora $x_1+x_2=-\dfrac{b}{a}$ e $x_1\cdot x_2=\dfrac{c}{a}$. Inoltre $ax^2+bx+c=a(x-x_1)(x-x_2)$.` },
        {
          t: 'plot',
          title: 'Il discriminante e la parabola',
          caption: R`Le soluzioni di $ax^2+bx+c=0$ sono le intersezioni della parabola $y=ax^2+bx+c$ con l'asse $x$. Muovi $c$ e osserva quando sono due, una o nessuna.`,
          view: [-6, 6, -6, 8],
          params: [
            { name: 'a', label: 'a', min: -2, max: 2, step: 0.5, value: 1 },
            { name: 'b', label: 'b', min: -4, max: 4, step: 0.5, value: -1 },
            { name: 'c', label: 'c', min: -5, max: 5, step: 0.5, value: -2 },
          ],
          draw: (p) => {
            const d = p.b * p.b - 4 * p.a * p.c;
            const pts = p.a !== 0 && d >= 0 ? [(-p.b - Math.sqrt(d)) / (2 * p.a), (-p.b + Math.sqrt(d)) / (2 * p.a)] : [];
            return [{ k: 'fn', f: (x) => p.a * x * x + p.b * x + p.c }, ...pts.map((x) => ({ k: 'pt' as const, x, y: 0 }))];
          },
          readout: (p) => {
            const d = p.b * p.b - 4 * p.a * p.c;
            if (p.a === 0) return 'Con $a=0$ l\'equazione non è di secondo grado.';
            return `$\\Delta=${`${d}`.replace('.', '{,}')}$: ${d > 0 ? 'due soluzioni distinte' : d === 0 ? 'due soluzioni coincidenti' : 'nessuna soluzione reale'}`;
          },
        },
        { t: 'def', title: 'Equazioni di grado superiore', md: R`**Legge di annullamento del prodotto:** $A(x)\cdot B(x)=0 \iff A(x)=0 \ \lor\ B(x)=0$.

Tipi notevoli:
- **Binomie** $x^n=k$: se $n$ è dispari $x=\sqrt[n]{k}$; se $n$ è pari e $k\ge0$, $x=\pm\sqrt[n]{k}$; se $n$ è pari e $k<0$ nessuna soluzione reale.
- **Biquadratiche** $ax^4+bx^2+c=0$: si pone $t=x^2$ e si risolve $at^2+bt+c=0$, accettando solo i valori $t\ge 0$.
- **Scomponibili** con raccoglimento, prodotti notevoli o regola di Ruffini (si cercano le radici razionali tra i divisori del termine noto fratto i divisori del primo coefficiente).` },
        {
          t: 'ex',
          title: R`Risolvi $x^4-5x^2+4=0$.`,
          steps: [
            R`È biquadratica: poniamo $t=x^2$ e otteniamo $t^2-5t+4=0$.`,
            R`$\Delta=25-16=9$, quindi $t=\dfrac{5\pm3}{2}$: $t_1=1$, $t_2=4$. Entrambi sono $\ge 0$, quindi accettabili.`,
            R`Torniamo a $x$: $x^2=1\Rightarrow x=\pm1$; $x^2=4\Rightarrow x=\pm2$.`,
            R`Soluzioni: $x=-2,\ -1,\ 1,\ 2$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Risolvi $x^3-2x^2-5x+6=0$.`,
          steps: [
            R`Cerchiamo una radice tra i divisori di $6$: proviamo $x=1$: $1-2-5+6=0$. Funziona, quindi il polinomio è divisibile per $(x-1)$.`,
            R`Con Ruffini: $x^3-2x^2-5x+6=(x-1)(x^2-x-6)$.`,
            R`Scomponiamo il trinomio: $x^2-x-6=(x-3)(x+2)$.`,
            R`Per l'annullamento del prodotto: $x=1\ \lor\ x=3\ \lor\ x=-2$.`,
          ],
        },
        { t: 'warn', md: R`Non dividere mai entrambi i membri per un'espressione che contiene $x$: perderesti soluzioni. In $x^3=4x$ **non** si semplifica per $x$: si scrive $x^3-4x=0$, cioè $x(x-2)(x+2)=0$, che dà $x=0,\ \pm 2$.` },
        {
          t: 'quiz',
          q: R`Quante soluzioni reali ha $x^4+3x^2-4=0$?`,
          options: [
            { md: 'Due', ok: true, why: R`Esatto: $t=x^2$ dà $t=1$ oppure $t=-4$; solo $t=1$ è accettabile, quindi $x=\pm1$.` },
            { md: 'Quattro', why: R`Attenzione: $t=-4$ non è accettabile perché $x^2$ non può essere negativo.` },
            { md: 'Nessuna', why: R`Il valore $t=1$ è positivo, quindi dà due soluzioni.` },
          ],
        },
      ],
    },
    {
      id: 'a3-eq-2',
      title: 'Disequazioni di secondo grado e fratte',
      blocks: [
        { t: 'idea', md: R`Una disequazione chiede **dove** un'espressione è positiva o negativa. Il segno di un polinomio può cambiare solo dove il polinomio si annulla: per questo si trovano prima gli zeri e poi si studia il segno negli intervalli che essi delimitano.` },
        { t: 'def', title: 'Segno del trinomio di secondo grado', md: R`Sia $ax^2+bx+c$ con $a>0$ (se $a<0$ si cambia segno a tutto, invertendo il verso).
- $\Delta>0$, radici $x_1<x_2$: il trinomio è **positivo all'esterno** delle radici ($x<x_1 \lor x>x_2$) e **negativo all'interno** ($x_1<x<x_2$).
- $\Delta=0$: è positivo per ogni $x\neq x_1$, nullo in $x_1$, mai negativo.
- $\Delta<0$: è positivo per ogni $x$ reale.` },
        {
          t: 'plot',
          title: 'Leggere il segno dal grafico',
          caption: R`Dove la parabola sta sopra l'asse $x$ il trinomio è positivo, dove sta sotto è negativo.`,
          view: [-6, 6, -6, 8],
          params: [
            { name: 'p', label: 'x₁', min: -5, max: 0, step: 0.5, value: -2 },
            { name: 'q', label: 'x₂', min: 0, max: 5, step: 0.5, value: 3 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => 0.5 * (x - p.p) * (x - p.q) },
            { k: 'pt', x: p.p, y: 0, label: 'x₁' },
            { k: 'pt', x: p.q, y: 0, label: 'x₂' },
          ],
          readout: (p) => `Positivo per $x<${`${p.p}`.replace('.', '{,}')}\\ \\lor\\ x>${`${p.q}`.replace('.', '{,}')}$; negativo tra le radici.`,
        },
        { t: 'def', title: 'Disequazioni fratte', md: R`Per risolvere $\dfrac{N(x)}{D(x)}>0$ (o $<,\ge,\le$):
1. si porta tutto a primo membro e si riduce a un'unica frazione;
2. si studia separatamente il segno di $N(x)$ e di $D(x)$ (ponendoli $>0$);
3. si costruisce lo **schema dei segni** e si applica la regola dei segni;
4. gli zeri del denominatore sono **sempre esclusi**; gli zeri del numeratore sono inclusi solo con $\ge$ o $\le$.` },
        {
          t: 'ex',
          title: R`Risolvi $\dfrac{x-1}{x+2}\ge 0$.`,
          steps: [
            R`Numeratore: $x-1\ge0 \iff x\ge1$.`,
            R`Denominatore: $x+2>0 \iff x>-2$ (il denominatore non può annullarsi, quindi $x\neq-2$).`,
            R`Schema dei segni: per $x<-2$ entrambi negativi → frazione positiva; per $-2<x<1$ segni discordi → negativa; per $x>1$ entrambi positivi → positiva.`,
            R`Soluzione: $x<-2\ \lor\ x\ge1$.`,
          ],
        },
        { t: 'warn', md: R`In una disequazione fratta **non si moltiplica** per il denominatore: non conoscendone il segno, non sai se il verso va mantenuto o invertito. Si porta tutto a sinistra e si studia il segno.` },
        { t: 'def', title: 'Sistemi di disequazioni', md: R`La soluzione di un sistema è l'**intersezione** delle soluzioni delle singole disequazioni: si risolvono separatamente e si riportano su uno schema di linee continue, prendendo gli intervalli in cui sono verificate tutte.` },
        {
          t: 'quiz',
          q: R`Qual è la soluzione di $x^2+1>0$?`,
          options: [
            { md: R`Ogni $x$ reale`, ok: true, why: R`Giusto: $\Delta=-4<0$ e $a>0$, il trinomio è sempre positivo.` },
            { md: 'Nessun $x$', why: R`$x^2\ge0$ sempre, quindi $x^2+1\ge1>0$.` },
            { md: R`$x>-1$`, why: R`Non è un'equazione di primo grado: non si "porta di là" il quadrato in questo modo.` },
          ],
        },
      ],
    },
    {
      id: 'a3-eq-3',
      title: 'Valore assoluto',
      blocks: [
        { t: 'idea', md: R`Il valore assoluto $|x|$ misura la **distanza** di $x$ dallo zero sulla retta dei numeri: per questo non è mai negativo. Allo stesso modo $|x-a|$ è la distanza tra $x$ e $a$.` },
        { t: 'def', title: 'Definizione', md: R`$$|A|=\begin{cases}A & \text{se } A\ge0\\ -A & \text{se } A<0\end{cases}$$` },
        { t: 'def', title: 'Casi fondamentali (con k > 0)', md: R`- $|A(x)|=k \iff A(x)=k\ \lor\ A(x)=-k$
- $|A(x)|<k \iff -k<A(x)<k$
- $|A(x)|>k \iff A(x)<-k\ \lor\ A(x)>k$

Se $k<0$: $|A|=k$ e $|A|<k$ sono impossibili, $|A|>k$ è sempre vera.` },
        {
          t: 'plot',
          title: 'Il valore assoluto come distanza',
          caption: R`Il grafico di $y=|x-a|$ è una "V" con vertice in $a$. La retta orizzontale $y=k$ lo taglia nei punti a distanza $k$ da $a$.`,
          view: [-7, 7, -1, 7],
          params: [
            { name: 'a', label: 'a', min: -4, max: 4, step: 0.5, value: 1 },
            { name: 'k', label: 'k', min: 0, max: 6, step: 0.5, value: 3 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => Math.abs(x - p.a) },
            { k: 'fn', f: () => p.k, dash: true },
            { k: 'pt', x: p.a - p.k, y: p.k },
            { k: 'pt', x: p.a + p.k, y: p.k },
          ],
          readout: (p) => `$|x-${par(p.a).replace('.', '{,}')}|=${`${p.k}`.replace('.', '{,}')}$ per $x=${`${p.a - p.k}`.replace('.', '{,}')}$ e $x=${`${p.a + p.k}`.replace('.', '{,}')}$`,
        },
        {
          t: 'ex',
          title: R`Risolvi $|2x-1|\le 5$.`,
          steps: [
            R`È del tipo $|A|\le k$ con $k=5>0$: equivale a $-5\le 2x-1\le 5$.`,
            R`Sommiamo $1$ a tutti i membri: $-4\le 2x\le 6$.`,
            R`Dividiamo per $2$: $-2\le x\le 3$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Risolvi $|x-3|=2x$ (il secondo membro contiene $x$: si distinguono i casi).`,
          steps: [
            R`**Caso 1:** $x-3\ge0$, cioè $x\ge3$. L'equazione diventa $x-3=2x$, da cui $x=-3$. Non rispetta $x\ge 3$: **non accettabile**.`,
            R`**Caso 2:** $x<3$. L'equazione diventa $-(x-3)=2x$, cioè $3=3x$, $x=1$. Rispetta $x<3$: **accettabile**.`,
            R`Soluzione: $x=1$. Verifica: $|1-3|=2$ e $2\cdot1=2$ ✓.`,
          ],
        },
        { t: 'warn', md: R`Quando il valore assoluto è confrontato con un'espressione in $x$ (non con un numero), devi **sempre** controllare che ogni soluzione rispetti la condizione del caso in cui l'hai trovata.` },
      ],
    },
    {
      id: 'a3-eq-4',
      title: 'Equazioni e disequazioni irrazionali',
      blocks: [
        { t: 'idea', md: R`Un'equazione è irrazionale se l'incognita compare sotto radice. Per eliminarla si eleva a potenza, ma **elevare al quadrato non è un'operazione innocua**: può introdurre soluzioni false (per esempio $-3\neq3$ ma $(-3)^2=3^2$). Servono quindi delle condizioni.` },
        { t: 'def', title: 'Equazione con radice quadrata', md: R`$$\sqrt{A(x)}=B(x)\iff\begin{cases}B(x)\ge 0\\ A(x)=[B(x)]^2\end{cases}$$
La condizione $A(x)\ge0$ è automaticamente garantita, perché $A$ è uguale a un quadrato. In alternativa si risolve $A=B^2$ e si fa la **verifica** sostituendo nell'equazione di partenza.

Con indice **dispari** ($\sqrt[3]{A}=B$) si eleva senza alcuna condizione.` },
        {
          t: 'ex',
          title: R`Risolvi $\sqrt{x+7}=x+1$.`,
          steps: [
            R`Condizione: $x+1\ge 0$, cioè $x\ge-1$.`,
            R`Eleviamo al quadrato: $x+7=x^2+2x+1$, cioè $x^2+x-6=0$.`,
            R`Soluzioni: $x=2$ e $x=-3$.`,
            R`Confronto con la condizione $x\ge-1$: $x=2$ è accettabile, $x=-3$ no. Infatti $\sqrt{-3+7}=2$ ma $-3+1=-2$. **Soluzione: $x=2$.**`,
          ],
        },
        { t: 'def', title: 'Disequazioni irrazionali (indice 2)', md: R`$$\sqrt{A(x)}<B(x)\iff\begin{cases}A(x)\ge0\\ B(x)>0\\ A(x)<[B(x)]^2\end{cases}$$
$$\sqrt{A(x)}>B(x)\iff\begin{cases}B(x)<0\\ A(x)\ge0\end{cases}\ \lor\ \begin{cases}B(x)\ge0\\ A(x)>[B(x)]^2\end{cases}$$
Nel secondo caso si **uniscono** le soluzioni dei due sistemi.` },
        {
          t: 'ex',
          title: R`Risolvi $\sqrt{x-1}<3$.`,
          steps: [
            R`Esistenza della radice: $x-1\ge0 \Rightarrow x\ge1$.`,
            R`Il secondo membro $3$ è positivo: possiamo elevare al quadrato mantenendo il verso: $x-1<9\Rightarrow x<10$.`,
            R`Intersezione: $1\le x<10$.`,
          ],
        },
        {
          t: 'quiz',
          q: R`L'equazione $\sqrt{x}=-2$ ha soluzione?`,
          options: [
            { md: 'No, è impossibile', ok: true, why: R`Esatto: una radice quadrata non è mai negativa.` },
            { md: R`Sì, $x=4$`, why: R`Elevando al quadrato si trova $x=4$, ma $\sqrt4=2\neq-2$: è una soluzione estranea.` },
            { md: R`Sì, $x=-4$`, why: R`$\sqrt{-4}$ non esiste nei numeri reali.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'eq-delta',
      level: 1,
      title: 'Discriminante',
      make: (r) => {
        const a = nz(r, 1, 3), b = nz(r, -6, 6), c = nz(r, -5, 5);
        const d = b * b - 4 * a * c;
        return {
          text: `Calcola il discriminante dell'equazione ${m(`${poly([a, b, c])}=0`)}.`,
          answer: d,
          tol: 0,
          hints: [R`Il discriminante è $\Delta=b^2-4ac$.`, `Qui ${m(`a=${a},\\ b=${b},\\ c=${c}`)}. Attenzione ai segni nel prodotto.`],
          solution: [`${m(`\\Delta=b^2-4ac=${par(b)}^2-4\\cdot${par(a)}\\cdot${par(c)}`)}`, `${m(`\\Delta=${b * b}${sg(-4 * a * c)}=${d}`)}: l'equazione ha ${d > 0 ? 'due soluzioni reali distinte' : d === 0 ? 'due soluzioni coincidenti' : 'nessuna soluzione reale'}.`],
        };
      },
    },
    {
      id: 'eq-secondo',
      level: 1,
      title: 'Equazione di secondo grado',
      make: (r) => {
        const p = nz(r, -6, 6), q = nz(r, -6, 6, p, -p);
        const [x1, x2] = [Math.min(p, q), Math.max(p, q)];
        const b = -(p + q), c = p * q;
        const eq = `${poly([1, b, c])}=0`;
        const sol = (u: number, v: number) => m(`x=${Math.min(u, v)}\\ \\lor\\ x=${Math.max(u, v)}`);
        return {
          text: `Risolvi l'equazione ${m(eq)}.`,
          options: mc(r, sol(x1, x2), [
            [sol(-x1, -x2), 'Hai sbagliato i segni: nella formula compare $-b$, non $b$. Verifica sostituendo.'],
            [sol(x1, -x2), 'Una delle due soluzioni ha il segno sbagliato: controlla che la somma delle radici sia $-b/a$.'],
            [sol(b, c), 'Questi sono i coefficienti, non le soluzioni: applica la formula risolutiva.'],
          ], [sol(x1 + 1, x2 + 1), sol(x1 - 1, x2)]),
          hints: [R`Calcola $\Delta=b^2-4ac$ e applica $x=\dfrac{-b\pm\sqrt\Delta}{2a}$.`, `In alternativa cerca due numeri con somma ${m(-b)} e prodotto ${m(c)}.`],
          steps: [
            {
              ask: `Quanto vale il discriminante ${m('\\Delta=b^2-4ac')}?`,
              options: mc(r, m(b * b - 4 * c), [[m(b * b + 4 * c), 'Attenzione al segno: è $b^2-4ac$, e bisogna tenere conto del segno di $c$.'], [m(-b * b - 4 * c), '$b^2$ è sempre positivo, anche se $b$ è negativo.']], [m(b * b - 4 * c + 4), m(b * b - 4 * c - 8)]),
              explain: `${m(`\\Delta=${par(b)}^2-4\\cdot1\\cdot${par(c)}=${b * b - 4 * c}`)}, positivo: due soluzioni distinte.`,
            },
            {
              ask: R`Applica la formula $x=\dfrac{-b\pm\sqrt\Delta}{2a}$. Quali sono le soluzioni?`,
              options: mc(r, sol(x1, x2), [[sol(-x1, -x2), 'Nella formula c\'è $-b$: hai usato $+b$.'], [sol(2 * x1, 2 * x2), 'Hai dimenticato di dividere per $2a$.']], [sol(x1 + 1, x2 + 1)]),
              explain: `${m(`x=\\dfrac{${-b}\\pm${Math.abs(p - q)}}{2}`)}, quindi ${sol(x1, x2)}.`,
            },
          ],
          solution: [`${m(`\\Delta=${par(b)}^2-4\\cdot${par(c)}=${b * b - 4 * c}`)}, quindi ${m(`\\sqrt\\Delta=${Math.abs(p - q)}`)}.`, `${m(`x=\\dfrac{${-b}\\pm${Math.abs(p - q)}}{2}`)}: ${sol(x1, x2)}.`, `Verifica: somma ${m(`${x1}+${par(x2)}=${-b}=-b`)}, prodotto ${m(`${c}=c`)} ✓`],
        };
      },
    },
    {
      id: 'eq-parametro',
      level: 2,
      title: 'Equazione con parametro',
      make: (r) => {
        const k = int(r, 2, 7);
        return {
          text: `Per quale valore **positivo** di $k$ l'equazione ${m(`x^2+kx+${k * k}=0`)} ha due soluzioni coincidenti?`,
          answer: 2 * k,
          tol: 0,
          hints: [R`Le soluzioni coincidono quando $\Delta=0$.`, `Imponi ${m(`k^2-4\\cdot${k * k}=0`)}.`],
          solution: [R`Soluzioni coincidenti $\iff \Delta=0$.`, `${m(`\\Delta=k^2-4\\cdot${k * k}=k^2-${4 * k * k}=0`)}`, `${m(`k^2=${4 * k * k}\\Rightarrow k=\\pm${2 * k}`)}; il valore positivo è ${m(`k=${2 * k}`)}.`],
        };
      },
    },
    {
      id: 'eq-biquadratica',
      level: 2,
      title: 'Equazione biquadratica',
      make: (r) => {
        const a = int(r, 1, 3), b = int(r, a + 1, 5);
        const neg = r() < 0.4; // variante con una radice t negativa
        const t1 = a * a, t2 = neg ? -(b * b) : b * b;
        const eq = `${poly([1, 0, -(t1 + t2), 0, t1 * t2])}=0`;
        const good = neg ? m(`x=\\pm${a}`) : m(`x=\\pm${a}\\ \\lor\\ x=\\pm${b}`);
        return {
          text: `Risolvi l'equazione ${m(eq)}.`,
          options: mc(r, good, [
            [neg ? m(`x=\\pm${a}\\ \\lor\\ x=\\pm${b}`) : m(`x=${t1}\\ \\lor\\ x=${t2}`), neg ? `Il valore ${m(`t=${t2}`)} è negativo: $x^2$ non può essere negativo, quindi va scartato.` : 'Questi sono i valori di $t=x^2$: devi ancora ricavare $x$ estraendo la radice.'],
            [neg ? m(`x=${t1}`) : m(`x=${a}\\ \\lor\\ x=${b}`), neg ? 'Hai trovato $t$, non $x$: e ricorda il doppio segno.' : 'Hai dimenticato le soluzioni negative: $x^2=k$ dà $x=\\pm\\sqrt k$.'],
            ['Nessuna soluzione reale', 'Almeno un valore di $t$ è positivo, quindi esistono soluzioni reali.'],
          ]),
          hints: [R`Poni $t=x^2$: ottieni un'equazione di secondo grado in $t$.`, R`Accetta solo i valori $t\ge0$, poi risolvi $x^2=t$ ricordando il $\pm$.`],
          solution: [`Poniamo $t=x^2$: ${m(`${poly([1, -(t1 + t2), t1 * t2], 't')}=0`)}.`, `Le soluzioni sono ${m(`t=${t1}`)} e ${m(`t=${t2}`)}${neg ? ` (quest'ultima non accettabile perché negativa)` : ''}.`, `Quindi ${good}.`],
        };
      },
    },
    {
      id: 'eq-grado3',
      level: 2,
      title: 'Equazione scomponibile',
      make: (r) => {
        const a = int(r, 1, 6);
        const k = a * a;
        return {
          text: `Risolvi l'equazione ${m(`x^3=${k}x`)}.`,
          options: choice(r, [
            [m(`x=0\\ \\lor\\ x=\\pm${a}`), R`Corretto: $x(x^2-${k})=0$.`],
            [m(`x=\\pm${a}`), 'Hai diviso per $x$ perdendo la soluzione $x=0$: bisogna raccogliere, non semplificare.'],
            [m(`x=${a}`), 'Hai diviso per $x$ (perdendo $x=0$) e dimenticato la radice negativa.'],
            [m(`x=0\\ \\lor\\ x=${k}`), `Dopo aver raccolto $x$ resta ${m(`x^2-${k}=0`)}, che è di secondo grado.`],
          ]),
          hints: ['Porta tutto a primo membro e raccogli $x$.', 'Usa la legge di annullamento del prodotto.'],
          solution: [`${m(`x^3-${k}x=0`)}`, `Raccogliamo: ${m(`x(x^2-${k})=0`)}, cioè ${m(`x(x-${a})(x+${a})=0`)}.`, `Soluzioni: ${m(`x=0\\ \\lor\\ x=${a}\\ \\lor\\ x=-${a}`)}.`],
        };
      },
    },
    {
      id: 'diseq-secondo',
      level: 1,
      title: 'Disequazione di secondo grado',
      make: (r) => {
        const p = int(r, -5, 3), q = int(r, p + 1, 6);
        const gt = r() < 0.5;
        const tri = poly([1, -(p + q), p * q]);
        const ext = m(`x<${p}\\ \\lor\\ x>${q}`), inn = m(`${p}<x<${q}`);
        const good = gt ? ext : inn;
        return {
          text: `Risolvi la disequazione ${m(`${tri}${gt ? '>' : '<'}0`)}.`,
          options: mc(r, good, [
            [gt ? inn : ext, `Hai scambiato intervalli interni ed esterni: con $a>0$ il trinomio è positivo **all'esterno** delle radici e negativo **all'interno**.`],
            [m(`x${gt ? '>' : '<'}${q}`), 'Una disequazione di secondo grado non si risolve come una di primo grado: servono entrambe le radici e lo studio del segno.'],
            [m(`x<${-q}\\ \\lor\\ x>${-p}`), 'Le radici hanno il segno sbagliato: ricontrolla l\'equazione associata.'],
          ], [m(`${-q}<x<${-p}`), m(`x>${p}`)]),
          hints: ['Risolvi prima l\'equazione associata per trovare le radici.', `Il coefficiente di $x^2$ è positivo: il trinomio è positivo all'esterno delle radici.`],
          steps: [
            {
              ask: `Quali sono le radici dell'equazione associata ${m(`${tri}=0`)}?`,
              options: mc(r, m(`${p}\\ \\text{e}\\ ${q}`), [[m(`${-q}\\ \\text{e}\\ ${-p}`), 'Segni sbagliati: verifica sostituendo.']], [m(`${p - 1}\\ \\text{e}\\ ${q + 1}`), m(`${p}\\ \\text{e}\\ ${q + 2}`)]),
              explain: `Le radici sono ${m(`x_1=${p}`)} e ${m(`x_2=${q}`)} (somma ${m(p + q)}, prodotto ${m(p * q)}).`,
            },
            {
              ask: `Il coefficiente di $x^2$ è positivo. Dove il trinomio è ${gt ? 'positivo' : 'negativo'}?`,
              options: choice(r, [[gt ? 'All\'esterno delle radici' : 'All\'interno delle radici'], [gt ? 'All\'interno delle radici' : 'All\'esterno delle radici', 'La parabola ha concavità verso l\'alto: sta sotto l\'asse $x$ tra le radici e sopra all\'esterno.'], ['Per ogni $x$', 'Questo accadrebbe solo con $\\Delta<0$.']]),
              explain: `Parabola con concavità verso l'alto: ${gt ? 'positiva all\'esterno' : 'negativa all\'interno'} delle radici. Soluzione: ${good}.`,
            },
          ],
          solution: [`Equazione associata ${m(`${tri}=0`)}: radici ${m(`x_1=${p}`)}, ${m(`x_2=${q}`)}.`, `Poiché $a=1>0$, il trinomio è positivo all'esterno delle radici e negativo all'interno.`, `Soluzione: ${good}.`],
        };
      },
    },
    {
      id: 'diseq-fratta',
      level: 2,
      title: 'Disequazione fratta',
      make: (r) => {
        const a = int(r, -5, 5), b = nz(r, -5, 5, a);
        const ge = r() < 0.5;
        const lo = Math.min(a, b), hi = Math.max(a, b);
        // (x-a)/(x-b): zero del numeratore a (incluso), zero del denominatore b (escluso)
        const le = (v: number) => (v === a ? '\\le ' : '<');
        const good = ge ? m(`x${le(lo)}${lo}\\ \\lor\\ x${hi === a ? '\\ge' : '>'}${hi}`) : m(`${lo}${le(lo)}x${le(hi)}${hi}`);
        const allIncl = ge ? m(`x\\le${lo}\\ \\lor\\ x\\ge${hi}`) : m(`${lo}\\le x\\le${hi}`);
        const swapped = ge ? m(`${lo}${le(lo)}x${le(hi)}${hi}`) : m(`x${le(lo)}${lo}\\ \\lor\\ x${hi === a ? '\\ge' : '>'}${hi}`);
        const frac_ = `\\dfrac{x${sg(-a)}}{x${sg(-b)}}`;
        return {
          text: `Risolvi la disequazione ${m(`${frac_}${ge ? '\\ge' : '\\le'}0`)}.`,
          options: mc(r, good, [
            [allIncl, `Il valore ${m(`x=${b}`)} annulla il denominatore: la frazione lì non esiste, quindi va **escluso**.`],
            [swapped, 'Hai scelto gli intervalli con il segno opposto: ricontrolla lo schema dei segni.'],
            [m(`x${ge ? '\\ge' : '\\le'}${a}`), 'Hai moltiplicato per il denominatore senza conoscerne il segno: non è lecito. Studia il segno di numeratore e denominatore.'],
          ]),
          hints: ['Studia separatamente il segno del numeratore e del denominatore.', `Il numeratore è positivo per ${m(`x>${a}`)}, il denominatore per ${m(`x>${b}`)}. Costruisci lo schema dei segni.`, 'Ricorda: lo zero del denominatore è sempre escluso.'],
          steps: [
            { ask: 'Per quali $x$ il **numeratore** è positivo o nullo?', options: mc(r, m(`x\\ge${a}`), [[m(`x\\ge${-a}`), 'Controlla il segno: risolvi $N(x)\\ge0$ isolando $x$.'], [m(`x\\le${a}`), 'Il coefficiente di $x$ è positivo: il verso non cambia.']], [m(`x>${a + 1}`)]), explain: `${m(`x${sg(-a)}\\ge0\\iff x\\ge${a}`)}.` },
            { ask: 'Per quali $x$ il **denominatore** è positivo?', options: mc(r, m(`x>${b}`), [[m(`x\\ge${b}`), 'Il denominatore non può essere zero: la disuguaglianza è stretta.'], [m(`x>${-b}`), 'Controlla il segno isolando $x$.']], [m(`x<${b}`)]), explain: `${m(`x${sg(-b)}>0\\iff x>${b}`)}; in ${m(`x=${b}`)} la frazione non esiste.` },
            { ask: `La frazione è ${ge ? 'positiva' : 'negativa'} quando numeratore e denominatore sono ${ge ? 'concordi' : 'discordi'}. Qual è la soluzione?`, options: mc(r, good, [[allIncl, `${m(`x=${b}`)} annulla il denominatore e va escluso.`], [swapped, 'Hai preso gli intervalli con il segno opposto.']], [m(`x>${hi}`)]), explain: `Dallo schema dei segni: ${good}.` },
          ],
          solution: [`Numeratore: ${m(`x${sg(-a)}\\ge0\\iff x\\ge${a}`)}.`, `Denominatore: ${m(`x${sg(-b)}>0\\iff x>${b}`)} (con ${m(`x\\neq${b}`)}).`, `Schema dei segni: la frazione è positiva all'esterno dell'intervallo tra ${m(lo)} e ${m(hi)}, negativa all'interno.`, `Soluzione: ${good}.`],
        };
      },
    },
    {
      id: 'diseq-sistema',
      level: 3,
      title: 'Sistema di disequazioni',
      make: (r) => {
        const p = int(r, -5, 1), q = int(r, p + 3, p + 7), c = int(r, p + 1, q - 1);
        const tri = poly([1, -(p + q), p * q]);
        return {
          text: `Risolvi il sistema $$\\begin{cases}${tri}<0\\\\ x${sg(-c)}>0\\end{cases}$$`,
          options: mc(r, m(`${c}<x<${q}`), [
            [m(`${p}<x<${q}`), 'Questa è solo la soluzione della prima disequazione: devi intersecarla con la seconda.'],
            [m(`x>${c}`), 'Questa è solo la soluzione della seconda disequazione: manca l\'intersezione con la prima.'],
            [m(`x>${p}`), 'Hai fatto l\'unione invece dell\'intersezione: in un sistema devono valere entrambe le condizioni.'],
          ], [m(`${p}<x<${c}`)]),
          hints: ['Risolvi separatamente le due disequazioni.', `La prima dà ${m(`${p}<x<${q}`)}, la seconda ${m(`x>${c}`)}.`, 'La soluzione del sistema è l\'intersezione dei due insiemi.'],
          solution: [`Prima disequazione: radici ${m(p)} e ${m(q)}, trinomio negativo all'interno: ${m(`${p}<x<${q}`)}.`, `Seconda disequazione: ${m(`x>${c}`)}.`, `Intersezione (valori comuni): ${m(`${c}<x<${q}`)}.`],
        };
      },
    },
    {
      id: 'abs-eq',
      level: 1,
      title: 'Equazione con valore assoluto',
      make: (r) => {
        const a = nz(r, -6, 6), k = int(r, 1, 7);
        const sol = (u: number, v: number) => m(`x=${Math.min(u, v)}\\ \\lor\\ x=${Math.max(u, v)}`);
        return {
          text: `Risolvi l'equazione ${m(`|x${sg(-a)}|=${k}`)}.`,
          options: mc(r, sol(a - k, a + k), [
            [m(`x=${a + k}`), 'Manca una soluzione: $|A|=k$ equivale a $A=k$ **oppure** $A=-k$.'],
            [sol(-a - k, -a + k), 'Hai sbagliato il segno isolando $x$.'],
            [sol(-k, k), 'Queste sono le soluzioni di $|x|=k$: qui dentro il modulo c\'è un\'altra espressione.'],
          ], [sol(a - k - 1, a + k)]),
          hints: [R`$|A|=k$ con $k>0$ equivale a $A=k\ \lor\ A=-k$.`],
          solution: [`${m(`x${sg(-a)}=${k}`)} oppure ${m(`x${sg(-a)}=-${k}`)}.`, `Quindi ${sol(a - k, a + k)}: sono i due punti a distanza ${m(k)} da ${m(a)}.`],
        };
      },
    },
    {
      id: 'abs-diseq',
      level: 2,
      title: 'Disequazione con valore assoluto',
      make: (r) => {
        const a = nz(r, -5, 5), k = int(r, 1, 6);
        const lt = r() < 0.5;
        const inn = m(`${a - k}<x<${a + k}`), ext = m(`x<${a - k}\\ \\lor\\ x>${a + k}`);
        return {
          text: `Risolvi la disequazione ${m(`|x${sg(-a)}|${lt ? '<' : '>'}${k}`)}.`,
          options: mc(r, lt ? inn : ext, [
            [lt ? ext : inn, R`Hai invertito i casi: $|A|<k$ dà un intervallo limitato, $|A|>k$ due semirette esterne.`],
            [m(`x${lt ? '<' : '>'}${a + k}`), 'Hai trattato il modulo come una parentesi: manca la seconda condizione.'],
            [lt ? m(`${-a - k}<x<${-a + k}`) : m(`x<${-a - k}\\ \\lor\\ x>${-a + k}`), 'Hai sbagliato un segno isolando $x$.'],
          ]),
          hints: [lt ? R`$|A|<k$ equivale a $-k<A<k$.` : R`$|A|>k$ equivale a $A<-k\ \lor\ A>k$.`, `Geometricamente: i punti a distanza ${lt ? 'minore' : 'maggiore'} di ${m(k)} da ${m(a)}.`],
          solution: [lt ? `${m(`-${k}<x${sg(-a)}<${k}`)}` : `${m(`x${sg(-a)}<-${k}`)} oppure ${m(`x${sg(-a)}>${k}`)}`, `Isolando $x$: ${lt ? inn : ext}.`],
        };
      },
    },
    {
      id: 'irr-eq',
      level: 3,
      title: 'Equazione irrazionale',
      make: (r) => {
        const k = int(r, 2, 4), b = int(r, -2, 3);
        const s = b + k, a = k * k - s, other = b + 1 - k;
        const rhs = `x${sg(-b)}`;
        return {
          text: `Risolvi l'equazione ${m(`\\sqrt{x${sg(a)}}=${rhs}`)}.`,
          options: mc(r, m(`x=${s}`), [
            [m(`x=${Math.min(s, other)}\\ \\lor\\ x=${Math.max(s, other)}`), `Non hai controllato l'accettabilità: per ${m(`x=${other}`)} il secondo membro vale ${m(other - b)}, negativo, mentre una radice quadrata non può esserlo.`],
            [m(`x=${other}`), `Hai tenuto la soluzione sbagliata: per ${m(`x=${other}`)} il secondo membro è negativo.`],
            ['Impossibile', `${m(`x=${s}`)} verifica l'equazione: ${m(`\\sqrt{${s + a}}=${k}`)} e ${m(`${s}${sg(-b)}=${k}`)}.`],
          ]),
          hints: [`Poni la condizione ${m(`${rhs}\\ge0`)}, poi eleva al quadrato.`, `Elevando ottieni ${m(`x${sg(a)}=(${rhs})^2`)}: sviluppa e risolvi l'equazione di secondo grado.`, 'Controlla quali soluzioni rispettano la condizione iniziale.'],
          solution: [`Condizione: ${m(`${rhs}\\ge0\\iff x\\ge${b}`)}.`, `Eleviamo al quadrato: ${m(`x${sg(a)}=${poly([1, -2 * b, b * b])}`)}, cioè ${m(`${poly([1, -(2 * b + 1), b * b - a])}=0`)}.`, `Soluzioni dell'equazione di secondo grado: ${m(`x=${s}`)} e ${m(`x=${other}`)}.`, `Solo ${m(`x=${s}`)} rispetta ${m(`x\\ge${b}`)}: è l'unica soluzione.`],
        };
      },
    },
    {
      id: 'irr-diseq',
      level: 3,
      title: 'Disequazione irrazionale',
      make: (r) => {
        const a = int(r, -4, 5), b = int(r, 2, 4);
        return {
          text: `Risolvi la disequazione ${m(`\\sqrt{x${sg(-a)}}<${b}`)}.`,
          options: mc(r, m(`${a}\\le x<${a + b * b}`), [
            [m(`x<${a + b * b}`), `Hai dimenticato la condizione di esistenza della radice: ${m(`x${sg(-a)}\\ge0`)}.`],
            [m(`${a}\\le x<${a + b}`), 'Elevando al quadrato va elevato anche il secondo membro.'],
            [m(`x>${a + b * b}`), 'Elevando al quadrato due quantità non negative il verso si conserva.'],
          ]),
          hints: ['Imponi prima l\'esistenza della radice (radicando $\\ge0$).', 'Poiché il secondo membro è positivo, puoi elevare al quadrato mantenendo il verso.'],
          solution: [`Esistenza: ${m(`x${sg(-a)}\\ge0\\iff x\\ge${a}`)}.`, `Eleviamo al quadrato: ${m(`x${sg(-a)}<${b * b}\\iff x<${a + b * b}`)}.`, `Intersezione: ${m(`${a}\\le x<${a + b * b}`)}.`],
        };
      },
    },
    {
      id: 'eq-somma-prodotto',
      level: 2,
      title: 'Somma e prodotto delle radici',
      make: (r) => {
        const a = int(r, 2, 4), b = nz(r, -9, 9), c = nz(r, -8, -1);
        const sum = r() < 0.5;
        return {
          text: `Senza risolvere l'equazione ${m(`${poly([a, b, c])}=0`)}, calcola ${sum ? 'la **somma**' : 'il **prodotto**'} delle sue soluzioni.`,
          options: mc(r, m(sum ? frac(-b, a) : frac(c, a)), [
            [m(sum ? frac(b, a) : frac(-c, a)), sum ? R`Attenzione al segno: la somma è $-\dfrac ba$.` : R`Attenzione al segno: il prodotto è $\dfrac ca$.`],
            [m(sum ? frac(c, a) : frac(-b, a)), 'Hai scambiato somma e prodotto.'],
            [m(sum ? `${-b}` : `${c}`), 'Hai dimenticato di dividere per $a$.'],
          ], [m(frac(a, b)), m(frac(b, c))]),
          hints: [R`Ricorda: $x_1+x_2=-\dfrac ba$ e $x_1x_2=\dfrac ca$.`],
          solution: [`Qui ${m(`a=${a},\\ b=${b},\\ c=${c}`)} (le soluzioni sono reali perché $a$ e $c$ sono discordi, quindi $\\Delta>0$).`, sum ? `${m(`x_1+x_2=-\\dfrac ba=${frac(-b, a)}`)}` : `${m(`x_1x_2=\\dfrac ca=${frac(c, a)}`)}`],
        };
      },
    },
  ],
};
