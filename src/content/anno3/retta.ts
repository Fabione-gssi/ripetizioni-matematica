import { frac, int, m, mc, nz, par, pick, sg } from '../../lib/gen';
import type { Unit } from '../../lib/types';

const R = String.raw;
const d = (x: number) => `${Math.round(x * 100) / 100}`.replace('.', '{,}');
const P = (x: number | string, y: number | string) => `(${x};\\ ${y})`;

/** Equazione esplicita y = (n/dn) x + (qn/qd) in LaTeX, con frazioni ridotte. */
function explicit(n: number, dn: number, qn: number, qd: number): string {
  const mm = frac(n, dn), q = frac(qn, qd);
  const mx = mm === '0' ? '' : mm === '1' ? 'x' : mm === '-1' ? '-x' : `${mm}x`;
  if (!mx) return `y=${q}`;
  return `y=${mx}${q === '0' ? '' : q.startsWith('-') ? q : `+${q}`}`;
}

export const retta: Unit = {
  id: 'a3-retta',
  year: 3,
  title: 'Piano cartesiano e retta',
  summary: 'Distanze, punto medio, equazione della retta, parallelismo e perpendicolarità.',
  lessons: [
    {
      id: 'a3-ret-1',
      title: 'Punti e segmenti nel piano cartesiano',
      blocks: [
        { t: 'idea', md: R`Il piano cartesiano è il ponte tra geometria e algebra: ogni punto diventa una coppia di numeri e ogni figura un'equazione. Così i problemi geometrici si risolvono **con i calcoli**.` },
        {
          t: 'thm',
          title: 'Distanza tra due punti',
          md: R`Dati $A(x_A;y_A)$ e $B(x_B;y_B)$: $$\overline{AB}=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$$`,
          proof: [
            R`Costruiamo il punto $C(x_B;y_A)$: il triangolo $ABC$ è rettangolo in $C$.`,
            R`Il cateto orizzontale misura $\overline{AC}=|x_B-x_A|$, quello verticale $\overline{CB}=|y_B-y_A|$.`,
            R`Per il teorema di Pitagora $\overline{AB}^2=\overline{AC}^2+\overline{CB}^2=(x_B-x_A)^2+(y_B-y_A)^2$. Estraendo la radice si ottiene la formula.`,
          ],
        },
        { t: 'def', title: 'Punto medio e baricentro', md: R`Il **punto medio** $M$ del segmento $AB$ ha per coordinate la media delle coordinate degli estremi: $$M\left(\frac{x_A+x_B}{2};\ \frac{y_A+y_B}{2}\right)$$ Il **baricentro** del triangolo $ABC$ è $$G\left(\frac{x_A+x_B+x_C}{3};\ \frac{y_A+y_B+y_C}{3}\right)$$` },
        {
          t: 'plot',
          title: 'Distanza e punto medio',
          caption: R`Muovi il punto $B$: il segmento $AB$ è l'ipotenusa di un triangolo rettangolo con cateti paralleli agli assi.`,
          view: [-6, 6, -5, 5],
          params: [
            { name: 'x', label: 'x di B', min: -5, max: 5, step: 1, value: 3 },
            { name: 'y', label: 'y di B', min: -4, max: 4, step: 1, value: 2 },
          ],
          draw: (p) => [
            { k: 'seg', x1: -1, y1: -1, x2: p.x, y2: -1, dash: true },
            { k: 'seg', x1: p.x, y1: -1, x2: p.x, y2: p.y, dash: true },
            { k: 'seg', x1: -1, y1: -1, x2: p.x, y2: p.y, color: 'var(--plot-1)' },
            { k: 'pt', x: -1, y: -1, label: 'A' },
            { k: 'pt', x: p.x, y: p.y, label: 'B' },
            { k: 'pt', x: (p.x - 1) / 2, y: (p.y - 1) / 2, label: 'M', color: 'var(--plot-3)' },
          ],
          readout: (p) => `$A(-1;-1)$, $B(${p.x};${p.y})$: $\\overline{AB}=\\sqrt{${(p.x + 1) ** 2}+${(p.y + 1) ** 2}}\\approx${d(Math.hypot(p.x + 1, p.y + 1))}$, $M(${d((p.x - 1) / 2)};\\ ${d((p.y - 1) / 2)})$`,
        },
        {
          t: 'ex',
          title: R`Verifica che il triangolo di vertici $A(1;1)$, $B(5;1)$, $C(3;5)$ è isoscele e calcolane l'area.`,
          steps: [R`$\overline{AC}=\sqrt{(3-1)^2+(5-1)^2}=\sqrt{20}=2\sqrt5$.`, R`$\overline{BC}=\sqrt{(3-5)^2+(5-1)^2}=\sqrt{20}=2\sqrt5$. Quindi $AC=BC$: il triangolo è isoscele sulla base $AB$.`, R`La base $AB$ è orizzontale e misura $4$; l'altezza è la distanza di $C$ dalla retta $y=1$, cioè $4$.`, R`Area $=\dfrac{4\cdot4}{2}=8$.`],
        },
        { t: 'warn', md: R`$\sqrt{a^2+b^2}$ **non** è $a+b$. Per esempio $\sqrt{3^2+4^2}=\sqrt{25}=5$, non $7$.` },
        {
          t: 'quiz',
          q: R`Qual è il punto medio del segmento di estremi $A(-2;4)$ e $B(6;0)$?`,
          options: [
            { md: '$M(2;2)$', ok: true, why: R`Esatto: $\frac{-2+6}{2}=2$ e $\frac{4+0}{2}=2$.` },
            { md: '$M(4;2)$', why: R`Per l'ascissa hai fatto la semidifferenza: il punto medio usa la **somma** delle coordinate divisa per $2$.` },
            { md: '$M(4;4)$', why: 'Hai sommato le coordinate senza dividere per $2$.' },
          ],
        },
      ],
    },
    {
      id: 'a3-ret-2',
      title: 'L\'equazione della retta',
      blocks: [
        { t: 'idea', md: R`Una retta è caratterizzata dalla sua **pendenza costante**: spostandosi di $1$ in orizzontale si sale (o si scende) sempre della stessa quantità $m$. Questo numero, il coefficiente angolare, è il cuore dell'equazione della retta.` },
        { t: 'def', title: 'Forme dell\'equazione', md: R`- **Forma esplicita:** $y=mx+q$, dove $m$ è il **coefficiente angolare** e $q$ l'**ordinata all'origine** (intersezione con l'asse $y$). Non rappresenta le rette verticali.
- **Forma implicita:** $ax+by+c=0$ (con $a,b$ non entrambi nulli): rappresenta **tutte** le rette. Se $b\neq0$: $m=-\dfrac ab$, $q=-\dfrac cb$.
- Rette parallele agli assi: $y=k$ (orizzontale, $m=0$), $x=h$ (verticale, $m$ non definito).` },
        { t: 'def', title: 'Coefficiente angolare', md: R`Dati due punti $A$ e $B$ della retta con $x_A\neq x_B$: $$m=\frac{y_B-y_A}{x_B-x_A}=\frac{\Delta y}{\Delta x}$$ Se $m>0$ la retta è crescente, se $m<0$ decrescente. Inoltre $m=\tan\alpha$, dove $\alpha$ è l'angolo che la retta forma con il semiasse positivo delle $x$.` },
        {
          t: 'plot',
          title: 'Il ruolo di m e q',
          caption: R`$m$ cambia l'inclinazione, $q$ trasla la retta in verticale. Il triangolino mostra che a $\Delta x=1$ corrisponde $\Delta y=m$.`,
          view: [-6, 6, -6, 6],
          params: [
            { name: 'm', label: 'm', min: -3, max: 3, step: 0.25, value: 1 },
            { name: 'q', label: 'q', min: -4, max: 4, step: 0.5, value: 1 },
          ],
          draw: (p) => [
            { k: 'fn', f: (x) => p.m * x + p.q },
            { k: 'pt', x: 0, y: p.q, label: 'q' },
            { k: 'seg', x1: 1, y1: p.m + p.q, x2: 2, y2: p.m + p.q, dash: true },
            { k: 'seg', x1: 2, y1: p.m + p.q, x2: 2, y2: 2 * p.m + p.q, dash: true },
          ],
          readout: (p) => `$y=${d(p.m)}x${p.q >= 0 ? '+' : ''}${d(p.q)}$`,
        },
        { t: 'def', title: 'Come si scrive l\'equazione di una retta', md: R`- **Per un punto** $P(x_0;y_0)$ **con coefficiente angolare** $m$: $$y-y_0=m\,(x-x_0)$$
- **Per due punti** $A$ e $B$ (con $x_A\neq x_B$ e $y_A\neq y_B$): $$\frac{y-y_A}{y_B-y_A}=\frac{x-x_A}{x_B-x_A}$$ oppure si calcola $m$ e si usa la formula precedente.` },
        {
          t: 'ex',
          title: R`Scrivi l'equazione della retta passante per $A(1;2)$ e $B(3;-4)$.`,
          steps: [R`Coefficiente angolare: $m=\dfrac{-4-2}{3-1}=-3$.`, R`Retta per $A$ con $m=-3$: $y-2=-3(x-1)$.`, R`Forma esplicita: $y=-3x+5$. Verifica con $B$: $-3\cdot3+5=-4$ ✓.`],
        },
        {
          t: 'quiz',
          q: R`Qual è il coefficiente angolare della retta $2x-4y+3=0$?`,
          options: [
            { md: R`$\dfrac12$`, ok: true, why: R`Esatto: $m=-\dfrac ab=-\dfrac{2}{-4}=\dfrac12$.` },
            { md: R`$-\dfrac12$`, why: R`Attenzione ai segni: $b=-4$, quindi $-\dfrac{a}{b}=-\dfrac{2}{-4}=+\dfrac12$.` },
            { md: '$2$', why: 'Il coefficiente di $x$ nella forma implicita non è $m$: bisogna prima ricavare $y$.' },
          ],
        },
      ],
    },
    {
      id: 'a3-ret-3',
      title: 'Posizioni reciproche, distanza, fasci',
      blocks: [
        { t: 'idea', md: R`Due rette del piano possono incontrarsi in un punto, non incontrarsi mai (parallele) oppure coincidere. Tutto si legge dai **coefficienti angolari**.` },
        { t: 'def', title: 'Rette parallele e perpendicolari', md: R`Per due rette non verticali di coefficienti angolari $m_1$ e $m_2$:
- **parallele** $\iff m_1=m_2$
- **perpendicolari** $\iff m_1\cdot m_2=-1$, cioè $m_2=-\dfrac{1}{m_1}$ (l'**antireciproco**)

Il punto di intersezione di due rette incidenti si trova risolvendo il **sistema** delle loro equazioni.` },
        {
          t: 'plot',
          title: 'Rette perpendicolari',
          caption: R`La retta tratteggiata ha coefficiente angolare $-\frac1m$: è sempre perpendicolare alla prima (gli assi hanno la stessa scala).`,
          view: [-5.2, 5.2, -4, 4],
          params: [{ name: 'm', label: 'm', min: 0.25, max: 3, step: 0.25, value: 2 }],
          draw: (p) => [{ k: 'fn', f: (x) => p.m * x }, { k: 'fn', f: (x) => -x / p.m, dash: true }],
          readout: (p) => `$m_1=${d(p.m)}$, $m_2=-\\dfrac{1}{${d(p.m)}}\\approx${d(-1 / p.m)}$, prodotto $=-1$`,
        },
        {
          t: 'thm',
          title: 'Distanza di un punto da una retta',
          md: R`La distanza del punto $P(x_0;y_0)$ dalla retta $ax+by+c=0$ è $$d=\frac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$$ Per usare la formula la retta deve essere in **forma implicita**.`,
        },
        {
          t: 'ex',
          title: R`Calcola la distanza di $P(2;-1)$ dalla retta $y=\frac34x+1$.`,
          steps: [R`Portiamo la retta in forma implicita: $3x-4y+4=0$.`, R`$d=\dfrac{|3\cdot2-4\cdot(-1)+4|}{\sqrt{3^2+(-4)^2}}=\dfrac{|6+4+4|}{5}$.`, R`$d=\dfrac{14}{5}=2{,}8$.`],
        },
        { t: 'def', title: 'Asse di un segmento', md: R`L'**asse** del segmento $AB$ è la retta perpendicolare ad $AB$ passante per il suo punto medio. È anche il **luogo dei punti equidistanti** da $A$ e da $B$: si può ottenere imponendo $\overline{PA}=\overline{PB}$.` },
        { t: 'def', title: 'Fasci di rette', md: R`- **Fascio proprio** di centro $P(x_0;y_0)$: tutte le rette per $P$, $y-y_0=m(x-x_0)$ al variare di $m$ (più la retta verticale $x=x_0$).
- **Fascio improprio**: tutte le rette parallele a una data, $y=mx+k$ al variare di $k$.` },
        { t: 'warn', md: R`Perpendicolare non vuol dire "coefficiente opposto": la perpendicolare a una retta con $m=2$ ha coefficiente $-\frac12$, non $-2$.` },
      ],
    },
  ],
  exercises: [
    {
      id: 'ret-distanza',
      level: 1,
      title: 'Distanza tra due punti',
      make: (r) => {
        const [a, b, c] = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]]);
        const x1 = int(r, -5, 3), y1 = int(r, -5, 3);
        const x2 = x1 + a * pick(r, [1, -1]), y2 = y1 + b * pick(r, [1, -1]);
        return {
          text: `Calcola la distanza tra i punti ${m(`A${P(x1, y1)}`)} e ${m(`B${P(x2, y2)}`)}.`,
          answer: c,
          tol: 0,
          hints: [R`Usa $\overline{AB}=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$.`, `${m(`x_B-x_A=${x2 - x1}`)} e ${m(`y_B-y_A=${y2 - y1}`)}.`],
          steps: [
            { ask: `Quanto vale ${m('(x_B-x_A)^2')}?`, options: mc(r, m(a * a), [[m(a), 'Devi elevare al quadrato la differenza.'], [m((x1 + x2) ** 2), 'Serve la **differenza** delle ascisse, non la somma.']], [m(a * a + 1), m(2 * a)]), explain: `${m(`(${x2}-${par(x1)})^2=${par(x2 - x1)}^2=${a * a}`)}.` },
            { ask: `Quanto vale ${m('(y_B-y_A)^2')}?`, options: mc(r, m(b * b), [[m(b), 'Devi elevare al quadrato la differenza.'], [m(-b * b), 'Un quadrato non è mai negativo.']], [m(b * b + 2), m(2 * b)]), explain: `${m(`(${y2}-${par(y1)})^2=${par(y2 - y1)}^2=${b * b}`)}.` },
            { ask: `Quindi ${m(`\\overline{AB}=\\sqrt{${a * a}+${b * b}}`)} vale:`, options: mc(r, m(c), [[m(a + b), R`$\sqrt{a^2+b^2}\neq a+b$: prima si somma, poi si estrae la radice.`], [m(a * a + b * b), 'Hai dimenticato la radice quadrata.']], [m(c + 1)]), explain: `${m(`\\overline{AB}=\\sqrt{${c * c}}=${c}`)}.` },
          ],
          solution: [`${m(`\\overline{AB}=\\sqrt{(${x2}-${par(x1)})^2+(${y2}-${par(y1)})^2}`)}`, `${m(`=\\sqrt{${a * a}+${b * b}}=\\sqrt{${c * c}}=${c}`)}`],
        };
      },
    },
    {
      id: 'ret-medio',
      level: 1,
      title: 'Punto medio',
      make: (r) => {
        const x1 = int(r, -6, 6), y1 = int(r, -6, 6);
        const x2 = x1 + 2 * nz(r, -4, 4), y2 = y1 + 2 * nz(r, -4, 4);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return {
          text: `Determina il punto medio del segmento di estremi ${m(`A${P(x1, y1)}`)} e ${m(`B${P(x2, y2)}`)}.`,
          options: mc(r, m(`M${P(mx, my)}`), [
            [m(`M${P((x2 - x1) / 2, (y2 - y1) / 2)}`), 'Hai usato la semidifferenza: il punto medio è la **media** (semisomma) delle coordinate.'],
            [m(`M${P(x1 + x2, y1 + y2)}`), 'Hai dimenticato di dividere per $2$.'],
            [m(`M${P(my, mx)}`), 'Hai scambiato ascissa e ordinata.'],
          ], [m(`M${P(mx + 1, my)}`), m(`M${P(mx, my - 1)}`)]),
          hints: [R`$x_M=\dfrac{x_A+x_B}{2}$, $y_M=\dfrac{y_A+y_B}{2}$.`],
          solution: [`${m(`x_M=\\dfrac{${x1}+${par(x2)}}{2}=${mx}`)}`, `${m(`y_M=\\dfrac{${y1}+${par(y2)}}{2}=${my}`)}`, `${m(`M${P(mx, my)}`)}`],
        };
      },
    },
    {
      id: 'ret-coeff',
      level: 1,
      title: 'Coefficiente angolare',
      make: (r) => {
        const x1 = int(r, -5, 5), y1 = int(r, -5, 5), dx = nz(r, -4, 4), dy = nz(r, -6, 6);
        const x2 = x1 + dx, y2 = y1 + dy;
        return {
          text: `Calcola il coefficiente angolare della retta passante per ${m(`A${P(x1, y1)}`)} e ${m(`B${P(x2, y2)}`)}.`,
          options: mc(r, m(frac(dy, dx)), [
            [m(frac(dx, dy)), R`Hai invertito il rapporto: $m=\dfrac{\Delta y}{\Delta x}$.`],
            [m(frac(-dy, dx)), 'Errore di segno: le differenze vanno calcolate nello stesso ordine a numeratore e a denominatore.'],
            [m(frac(y1 + y2, x1 + x2 || 1)), 'Servono le differenze delle coordinate, non le somme.'],
          ], [m(frac(dy + 1, dx)), m(frac(-dx, dy))]),
          hints: [R`$m=\dfrac{y_B-y_A}{x_B-x_A}$.`],
          solution: [`${m(`m=\\dfrac{${y2}-${par(y1)}}{${x2}-${par(x1)}}=\\dfrac{${dy}}{${dx}}=${frac(dy, dx)}`)}`],
        };
      },
    },
    {
      id: 'ret-implicita',
      level: 1,
      title: 'Dalla forma implicita a m e q',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -5, 5), c = nz(r, -8, 8);
        return {
          text: `Qual è il coefficiente angolare della retta ${m(`${a === 1 ? '' : a === -1 ? '-' : a}x${sg(b, 'y')}${sg(c)}=0`)}?`,
          options: mc(r, m(frac(-a, b)), [
            [m(frac(a, b)), R`Manca il segno meno: $m=-\dfrac ab$.`],
            [m(frac(-b, a)), R`Hai invertito il rapporto: $m=-\dfrac ab$.`],
            [m(a), 'Nella forma implicita il coefficiente di $x$ non è $m$: ricava prima $y$.'],
          ], [m(frac(-c, b)), m(frac(b, a)), m(frac(-2 * a, b)), m(0)]),
          hints: ['Ricava $y$ per passare alla forma esplicita.', R`In alternativa usa $m=-\dfrac ab$.`],
          solution: [`Ricaviamo $y$: ${m(`${b}y=${-a}x${sg(-c)}`)}.`, `Dividendo per ${m(b)}: il coefficiente di $x$ è ${m(`m=${frac(-a, b)}`)} (e l'ordinata all'origine è ${m(`q=${frac(-c, b)}`)}).`],
        };
      },
    },
    {
      id: 'ret-due-punti',
      level: 2,
      title: 'Retta per due punti',
      make: (r) => {
        const x1 = int(r, -4, 4), y1 = int(r, -5, 5), dx = pick(r, [1, 2, 3, -1, -2]), dy = nz(r, -5, 5);
        const x2 = x1 + dx, y2 = y1 + dy;
        // y = (dy/dx) x + (y1*dx - dy*x1)/dx
        const good = explicit(dy, dx, y1 * dx - dy * x1, dx);
        return {
          text: `Scrivi l'equazione della retta passante per ${m(`A${P(x1, y1)}`)} e ${m(`B${P(x2, y2)}`)}.`,
          options: mc(r, m(good), [
            [m(explicit(dx, dy, y1 * dy - dx * x1, dy)), R`Hai invertito il coefficiente angolare: $m=\dfrac{\Delta y}{\Delta x}$.`],
            [m(explicit(dy, dx, y1 * dx + dy * x1, dx)), R`Errore di segno nel calcolo di $q$: da $y-y_A=m(x-x_A)$ si ottiene $q=y_A-m\,x_A$.`],
            [m(explicit(-dy, dx, y1 * dx + dy * x1, dx)), 'Il coefficiente angolare ha il segno sbagliato.'],
          ], [m(explicit(dy, dx, y1 * dx - dy * x1 + dx, dx)), m(explicit(dy, dx, y1 * dx - dy * x1 - dx, dx))]),
          hints: [R`Calcola prima $m=\dfrac{y_B-y_A}{x_B-x_A}$.`, R`Poi usa $y-y_A=m(x-x_A)$.`, 'Controlla il risultato sostituendo le coordinate di $B$.'],
          steps: [
            { ask: 'Quanto vale il coefficiente angolare?', options: mc(r, m(frac(dy, dx)), [[m(frac(dx, dy)), 'Rapporto invertito.'], [m(frac(-dy, dx)), 'Errore di segno nelle differenze.']], [m(frac(dy + 1, dx)), m(frac(dy, dx + 1 || 1))]), explain: `${m(`m=\\dfrac{${y2}-${par(y1)}}{${x2}-${par(x1)}}=${frac(dy, dx)}`)}.` },
            { ask: `Imponendo il passaggio per $A$: ${m(`y-${par(y1)}=${frac(dy, dx)}(x-${par(x1)})`)}. Qual è la forma esplicita?`, options: mc(r, m(good), [[m(explicit(dy, dx, y1 * dx + dy * x1, dx)), 'Errore di segno nel prodotto $m\\cdot x_A$.']], [m(explicit(dy, dx, y1 * dx - dy * x1 + dx, dx)), m(explicit(dy, dx, y1 * dx - dy * x1 - dx, dx))]), explain: `${m(good)}.` },
          ],
          solution: [`${m(`m=\\dfrac{${y2}-${par(y1)}}{${x2}-${par(x1)}}=${frac(dy, dx)}`)}`, `${m(`y-${par(y1)}=${frac(dy, dx)}\\,(x-${par(x1)})`)}`, `${m(good)}`],
        };
      },
    },
    {
      id: 'ret-parallela',
      level: 2,
      title: 'Retta parallela per un punto',
      make: (r) => {
        const mm = nz(r, -4, 4), q = int(r, -5, 5), x0 = nz(r, -4, 4), y0 = int(r, -5, 5);
        const q2 = y0 - mm * x0 === q ? q + 1 : q;
        const good = explicit(mm, 1, y0 - mm * x0, 1);
        return {
          text: `Scrivi l'equazione della retta passante per ${m(`P${P(x0, y0)}`)} e **parallela** alla retta ${m(explicit(mm, 1, q2, 1))}.`,
          options: mc(r, m(good), [
            [m(explicit(-1, mm, y0 * mm + x0, mm)), 'Questa è la retta **perpendicolare**: per la parallela il coefficiente angolare resta uguale.'],
            [m(explicit(mm, 1, y0 + mm * x0, 1)), 'Errore di segno: $q=y_0-m\\,x_0$.'],
            [m(explicit(mm, 1, y0, 1)), 'Hai usato $y_0$ come ordinata all\'origine, ma $P$ non sta sull\'asse $y$.'],
          ], [m(explicit(mm, 1, y0 - mm * x0 + 1, 1))]),
          hints: ['Rette parallele hanno lo stesso coefficiente angolare.', R`Usa $y-y_0=m(x-x_0)$.`],
          solution: [`La retta data ha ${m(`m=${mm}`)}; la parallela ha lo stesso coefficiente angolare.`, `${m(`y-${par(y0)}=${mm}\\,(x-${par(x0)})`)}`, `${m(good)}`],
        };
      },
    },
    {
      id: 'ret-perpendicolare',
      level: 2,
      title: 'Retta perpendicolare per un punto',
      make: (r) => {
        const mm = pick(r, [2, 3, 4, -2, -3, -4]), q = int(r, -5, 5), x0 = mm * nz(r, -2, 2), y0 = int(r, -5, 5);
        // perpendicolare: m' = -1/mm, q' = y0 + x0/mm (intero perché x0 multiplo di mm)
        const good = explicit(-1, mm, y0 * mm + x0, mm);
        return {
          text: `Scrivi l'equazione della retta passante per ${m(`P${P(x0, y0)}`)} e **perpendicolare** alla retta ${m(explicit(mm, 1, q, 1))}.`,
          options: mc(r, m(good), [
            [m(explicit(-mm, 1, y0 + mm * x0, 1)), R`Il coefficiente della perpendicolare è l'**antireciproco** $-\dfrac1m$, non l'opposto.`],
            [m(explicit(1, mm, y0 * mm - x0, mm)), R`Manca il segno meno: $m'=-\dfrac1m$.`],
            [m(explicit(mm, 1, y0 - mm * x0, 1)), 'Questa è la retta **parallela**.'],
          ], [m(explicit(-1, mm, y0 * mm + x0 + mm, mm))]),
          hints: [R`Due rette sono perpendicolari se $m\cdot m'=-1$.`, `Quindi ${m(`m'=${frac(-1, mm)}`)}. Poi usa ${m("y-y_0=m'(x-x_0)")}.`],
          steps: [
            { ask: `La retta data ha ${m(`m=${mm}`)}. Qual è il coefficiente angolare della perpendicolare?`, options: mc(r, m(frac(-1, mm)), [[m(-mm), 'Questo è l\'opposto: serve l\'antireciproco.'], [m(frac(1, mm)), 'Questo è il reciproco: manca il cambio di segno.'], [m(mm), 'Questo è il coefficiente della parallela.']]), explain: `${m(`m'=-\\dfrac{1}{m}=${frac(-1, mm)}`)}.` },
            { ask: `Qual è l'equazione della retta per $P$ con coefficiente angolare ${m(frac(-1, mm))}?`, options: mc(r, m(good), [[m(explicit(-1, mm, y0 * mm - x0, mm)), 'Errore di segno nel calcolo dell\'ordinata all\'origine.']], [m(explicit(-1, mm, y0 * mm + x0 + mm, mm)), m(explicit(-1, mm, y0 * mm, mm))]), explain: `${m(`y-${par(y0)}=${frac(-1, mm)}(x-${par(x0)})`)}, cioè ${m(good)}.` },
          ],
          solution: [`La retta data ha ${m(`m=${mm}`)}, quindi la perpendicolare ha ${m(`m'=${frac(-1, mm)}`)}.`, `${m(`y-${par(y0)}=${frac(-1, mm)}\\,(x-${par(x0)})`)}`, `${m(good)}`],
        };
      },
    },
    {
      id: 'ret-intersezione',
      level: 2,
      title: 'Intersezione di due rette',
      make: (r) => {
        const x0 = int(r, -4, 4), y0 = int(r, -4, 4), m1 = nz(r, -3, 3), m2 = nz(r, -3, 3, m1);
        const q1 = y0 - m1 * x0, q2 = y0 - m2 * x0;
        return {
          text: `Determina il punto di intersezione delle rette ${m(explicit(m1, 1, q1, 1))} e ${m(explicit(m2, 1, q2, 1))}.`,
          options: mc(r, m(P(x0, y0)), [
            [m(P(y0, x0)), 'Hai scambiato ascissa e ordinata.'],
            [m(P(-x0, y0)), 'Errore di segno nel ricavare $x$.'],
            [m(P(x0, m1 * x0 - q1)), 'Trovata $x$, devi sostituirla correttamente in una delle due equazioni per ottenere $y$.'],
          ], [m(P(x0 + 1, y0 + m1)), m(P(x0 - 1, y0)), m(P(x0, y0 + 1))]),
          hints: ['Il punto comune soddisfa entrambe le equazioni: risolvi il sistema.', 'Uguaglia i due secondi membri (metodo del confronto).'],
          solution: [`Confronto: ${m(`${m1}x${sg(q1)}=${m2}x${sg(q2)}`)}.`, `${m(`${m1 - m2}x=${q2 - q1}\\Rightarrow x=${x0}`)}`, `Sostituendo: ${m(`y=${m1}\\cdot${par(x0)}${sg(q1)}=${y0}`)}. Punto ${m(P(x0, y0))}.`],
        };
      },
    },
    {
      id: 'ret-dist-punto',
      level: 2,
      title: 'Distanza punto-retta',
      make: (r) => {
        const [a, b, h] = pick(r, [[3, 4, 5], [4, 3, 5], [3, -4, 5], [5, 12, 13], [6, 8, 10], [4, -3, 5]]);
        const x0 = int(r, -4, 4), y0 = int(r, -4, 4), k = nz(r, -4, 4);
        const c = k * h - a * x0 - b * y0; // così |a x0 + b y0 + c| = |k| h
        const line = `${a}x${sg(b, 'y')}${sg(c)}=0`;
        return {
          text: `Calcola la distanza del punto ${m(`P${P(x0, y0)}`)} dalla retta ${m(line)}.`,
          answer: Math.abs(k),
          tol: 0,
          hints: [R`Usa $d=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$.`, `Qui ${m(`\\sqrt{a^2+b^2}=${h}`)}.`],
          solution: [`${m(`d=\\dfrac{|${a}\\cdot${par(x0)}${sg(b)}\\cdot${par(y0)}${sg(c)}|}{\\sqrt{${a * a}+${b * b}}}`)}`, `${m(`d=\\dfrac{|${k * h}|}{${h}}=${Math.abs(k)}`)}`],
        };
      },
    },
    {
      id: 'ret-asse',
      level: 3,
      title: 'Asse di un segmento',
      make: (r) => {
        const mm = pick(r, [2, 3, -2, -3]); // coefficiente angolare dell'asse
        const xm = int(r, -3, 3), ym = int(r, -3, 3), t = pick(r, [1, 2]);
        // AB perpendicolare all'asse: direzione (mm, -1)·t  => m_AB = -1/mm
        const A = [xm - mm * t, ym + t], B = [xm + mm * t, ym - t];
        const good = explicit(mm, 1, ym - mm * xm, 1);
        return {
          text: `Scrivi l'equazione dell'asse del segmento di estremi ${m(`A${P(A[0], A[1])}`)} e ${m(`B${P(B[0], B[1])}`)}.`,
          options: mc(r, m(good), [
            [m(explicit(-1, mm, ym * mm + xm, mm)), 'Questa è la retta $AB$ stessa (o una sua parallela): l\'asse è **perpendicolare** ad $AB$.'],
            [m(explicit(mm, 1, A[1] - mm * A[0], 1)), 'L\'asse passa per il **punto medio** di $AB$, non per l\'estremo $A$.'],
            [m(explicit(-mm, 1, ym + mm * xm, 1)), 'Il coefficiente angolare ha il segno sbagliato: serve l\'antireciproco di quello di $AB$.'],
          ], [m(explicit(mm, 1, ym - mm * xm + 1, 1))]),
          hints: ['L\'asse passa per il punto medio di $AB$ ed è perpendicolare ad $AB$.', `Punto medio: ${m(`M${P(xm, ym)}`)}; coefficiente angolare di $AB$: ${m(frac(-1, mm))}.`],
          solution: [`Punto medio: ${m(`M${P(xm, ym)}`)}.`, `${m(`m_{AB}=\\dfrac{${B[1]}-${par(A[1])}}{${B[0]}-${par(A[0])}}=${frac(-1, mm)}`)}, quindi l'asse ha ${m(`m=${mm}`)}.`, `${m(`y-${par(ym)}=${mm}\\,(x-${par(xm)})`)}, cioè ${m(good)}.`],
        };
      },
    },
    {
      id: 'ret-area',
      level: 3,
      title: 'Area di un triangolo',
      make: (r) => {
        const x1 = int(r, -4, 0), y0 = int(r, -3, 2), base = 2 * int(r, 2, 4), h = int(r, 2, 6), xc = int(r, -4, 5);
        return {
          text: `Calcola l'area del triangolo di vertici ${m(`A${P(x1, y0)}`)}, ${m(`B${P(x1 + base, y0)}`)}, ${m(`C${P(xc, y0 + h)}`)}.`,
          answer: (base * h) / 2,
          tol: 0,
          hints: ['$A$ e $B$ hanno la stessa ordinata: il lato $AB$ è orizzontale, conviene prenderlo come base.', `L'altezza è la distanza di $C$ dalla retta ${m(`y=${y0}`)}.`],
          solution: [`Base: ${m(`\\overline{AB}=|${x1 + base}-${par(x1)}|=${base}`)}.`, `Altezza: distanza di $C$ dalla retta ${m(`y=${y0}`)}: ${m(`|${y0 + h}-${par(y0)}|=${h}`)}.`, `Area ${m(`=\\dfrac{${base}\\cdot${h}}{2}=${(base * h) / 2}`)}.`],
        };
      },
    },
    {
      id: 'ret-allineati',
      level: 3,
      title: 'Punti allineati',
      make: (r) => {
        const x1 = int(r, -4, 2), y1 = int(r, -4, 4), mm = nz(r, -3, 3), dx1 = int(r, 1, 3), dx2 = dx1 + int(r, 1, 3);
        const k = y1 + mm * dx2;
        return {
          text: `Per quale valore di $k$ i punti ${m(`A${P(x1, y1)}`)}, ${m(`B${P(x1 + dx1, y1 + mm * dx1)}`)} e ${m(`C${P(x1 + dx2, 'k')}`)} sono allineati?`,
          answer: k,
          tol: 0,
          hints: ['Tre punti sono allineati se la retta $AB$ e la retta $AC$ hanno lo stesso coefficiente angolare.', `${m(`m_{AB}=${mm}`)}: imponi ${m(`m_{AC}=${mm}`)}.`],
          solution: [`${m(`m_{AB}=\\dfrac{${y1 + mm * dx1}-${par(y1)}}{${dx1}}=${mm}`)}`, `${m(`m_{AC}=\\dfrac{k-${par(y1)}}{${dx2}}=${mm}`)}`, `${m(`k=${y1}+${par(mm * dx2)}=${k}`)}`],
        };
      },
    },
  ],
};

