// Approfondimenti dell'unità "Circonferenza".
import { choice, frac, int, mc, nz, pick, sg } from '../../lib/gen';
import type { UnitExtra } from '../../lib/types';

const R = String.raw;
const P = (x: number | string, y: number | string) => `(${x};\\,${y})`;
/** Equazione x²+y²+ax+by+c=0 in LaTeX. */
const circ = (a: number, b: number, c: number) => `x^2+y^2${sg(a, 'x')}${sg(b, 'y')}${sg(c)}=0`;
/** Equazione ax+by+c=0 in LaTeX. */
const lin = (a: number, b: number, c: number) => `${`${sg(a, 'x')}${sg(b, 'y')}${sg(c)}`.replace(/^\+/, '')}=0`;

export const circonferenzaPiu: UnitExtra = {
  lessons: [
    {
      id: 'a3-cir-4',
      title: 'Tangenti da un punto esterno e formula di sdoppiamento',
      blocks: [
        { t: 'idea', md: R`Per la circonferenza la tangenza si può esprimere in modo molto semplice: una retta è tangente quando la sua **distanza dal centro è uguale al raggio**. Questo evita quasi sempre i calcoli con il discriminante.` },
        { t: 'def', title: 'Tangenti condotte da un punto P', md: R`Sia $P(x_0;y_0)$ e sia $\mathcal C$ una circonferenza di centro $C$ e raggio $r$.
- Se $\overline{PC}>r$ ($P$ esterno): **due** tangenti.
- Se $\overline{PC}=r$ ($P$ sulla circonferenza): **una** tangente, perpendicolare al raggio $CP$.
- Se $\overline{PC}<r$ ($P$ interno): **nessuna** tangente.

**Metodo della distanza:** si scrive il fascio per $P$ in forma implicita, $mx-y+y_0-mx_0=0$, e si impone che la distanza di $C$ dalla retta sia $r$. Si ottiene un'equazione in $m$.` },
        {
          t: 'ex',
          title: R`Trova le tangenti alla circonferenza $x^2+y^2=5$ condotte da $P(3;1)$.`,
          steps: [
            R`Centro $O(0;0)$, raggio $\sqrt5$. $\overline{PO}=\sqrt{10}>\sqrt5$: $P$ è esterno, ci sono due tangenti.`,
            R`Fascio per $P$: $y-1=m(x-3)$, cioè $mx-y+1-3m=0$.`,
            R`Distanza da $O$ uguale al raggio: $\dfrac{|1-3m|}{\sqrt{m^2+1}}=\sqrt5$.`,
            R`Elevando al quadrato: $1-6m+9m^2=5m^2+5$, cioè $2m^2-3m-2=0$, da cui $m=2$ oppure $m=-\dfrac12$.`,
            R`Tangenti: $y=2x-5$ e $y=-\dfrac12x+\dfrac52$. Sono perpendicolari tra loro: un caso particolare.`,
          ],
        },
        { t: 'warn', md: R`Il fascio $y-y_0=m(x-x_0)$ non contiene la retta **verticale** $x=x_0$. Se l'equazione in $m$ risulta di primo grado (una sola soluzione) pur essendo $P$ esterno, la seconda tangente è proprio la retta verticale.` },
        { t: 'thm', title: 'Formula di sdoppiamento', md: R`Se $P(x_0;y_0)$ **appartiene** alla circonferenza $x^2+y^2+ax+by+c=0$, la tangente in $P$ è
$$x_0x+y_0y+a\,\dfrac{x+x_0}{2}+b\,\dfrac{y+y_0}{2}+c=0$$
In particolare, per $x^2+y^2=r^2$ la tangente in $P$ è $x_0x+y_0y=r^2$.`, proof: [
          R`Dimostriamo il caso $x^2+y^2=r^2$. Il raggio $OP$ ha coefficiente angolare $\dfrac{y_0}{x_0}$ (se $x_0\neq0$).`,
          R`La tangente è perpendicolare al raggio: $m=-\dfrac{x_0}{y_0}$ (se $y_0\neq0$).`,
          R`Retta per $P$: $y-y_0=-\dfrac{x_0}{y_0}(x-x_0)$, cioè $x_0x+y_0y=x_0^2+y_0^2$.`,
          R`Poiché $P$ sta sulla circonferenza, $x_0^2+y_0^2=r^2$: si ottiene $x_0x+y_0y=r^2$.`,
        ] },
        { t: 'thm', title: 'Segmenti di tangente', md: R`I due segmenti di tangente condotti da un punto esterno $P$ sono **congruenti**, e la loro lunghezza è $t=\sqrt{\overline{PC}^2-r^2}$ (teorema di Pitagora nel triangolo rettangolo formato da $P$, dal centro e dal punto di tangenza).` },
        {
          t: 'quiz',
          q: R`Qual è la tangente a $x^2+y^2=25$ nel suo punto $(3;4)$?`,
          options: [
            { md: R`$3x+4y=25$`, ok: true, why: R`Giusto: per sdoppiamento $x_0x+y_0y=r^2$.` },
            { md: R`$4x-3y=0$`, why: R`Questa è la retta del raggio (passa per l'origine): la tangente le è perpendicolare.` },
            { md: R`$3x+4y=5$`, why: R`Al secondo membro va $r^2=25$, non $r$.` },
          ],
        },
      ],
    },
    {
      id: 'a3-cir-5',
      title: 'Determinare l\'equazione di una circonferenza',
      blocks: [
        { t: 'idea', md: R`L'equazione $x^2+y^2+ax+by+c=0$ contiene tre coefficienti: come per la parabola, servono **tre condizioni**. In alternativa si può ragionare in modo geometrico, cercando direttamente il centro e il raggio.` },
        { t: 'def', title: 'Le condizioni più comuni', md: R`- **Passaggio per un punto**: una condizione (si sostituiscono le coordinate).
- **Centro noto**: due condizioni ($a=-2x_C$, $b=-2y_C$).
- **Raggio noto**: una condizione.
- **Centro su una retta data**: una condizione sulle coordinate del centro.
- **Tangenza a una retta**: una condizione (distanza centro-retta uguale al raggio).
- **Estremi di un diametro**: il centro è il punto medio e il raggio è metà della distanza: la circonferenza è determinata.` },
        {
          t: 'ex',
          title: R`Trova la circonferenza passante per $O(0;0)$, $A(4;0)$, $B(0;2)$.`,
          steps: [
            R`Passaggio per $O$: $c=0$.`,
            R`Passaggio per $A$: $16+4a=0$, quindi $a=-4$.`,
            R`Passaggio per $B$: $4+2b=0$, quindi $b=-2$.`,
            R`$x^2+y^2-4x-2y=0$: centro $(2;1)$, raggio $\sqrt{4+1}=\sqrt5$.`,
            R`Metodo geometrico: il triangolo $OAB$ è rettangolo in $O$, quindi il centro è il punto medio dell'ipotenusa $AB$, cioè $(2;1)$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Trova la circonferenza passante per $A(1;0)$ e $B(5;0)$ con il centro sulla retta $y=x$.`,
          steps: [
            R`Il centro è equidistante da $A$ e $B$: sta sull'asse di $AB$, cioè sulla retta $x=3$.`,
            R`Intersecando con $y=x$: centro $C(3;3)$.`,
            R`Raggio: $\overline{CA}=\sqrt{(3-1)^2+3^2}=\sqrt{13}$.`,
            R`$(x-3)^2+(y-3)^2=13$, cioè $x^2+y^2-6x-6y+5=0$.`,
          ],
        },
        {
          t: 'ex',
          title: R`Trova la circonferenza di centro $C(2;1)$ tangente alla retta $3x+4y+5=0$.`,
          steps: [
            R`Il raggio è la distanza del centro dalla retta: $r=\dfrac{|3\cdot2+4\cdot1+5|}{\sqrt{9+16}}=\dfrac{15}{5}=3$.`,
            R`$(x-2)^2+(y-1)^2=9$.`,
          ],
        },
        { t: 'warn', md: R`Tre punti **allineati** non appartengono a nessuna circonferenza. Dopo aver trovato $a,b,c$ controlla sempre che il raggio esista: deve essere $\dfrac{a^2}{4}+\dfrac{b^2}{4}-c>0$.` },
        {
          t: 'quiz',
          q: R`Una circonferenza ha come diametro il segmento di estremi $(0;0)$ e $(6;8)$. Quanto misura il raggio?`,
          options: [
            { md: R`$5$`, ok: true, why: R`Il diametro misura $\sqrt{36+64}=10$, quindi il raggio è $5$.` },
            { md: R`$10$`, why: R`$10$ è la lunghezza del diametro.` },
            { md: R`$7$`, why: R`La distanza si calcola con il teorema di Pitagora, non sommando e dividendo le coordinate.` },
          ],
        },
      ],
    },
    {
      id: 'a3-cir-6',
      title: 'Asse radicale e fasci di circonferenze',
      blocks: [
        { t: 'idea', md: R`Sottraendo membro a membro le equazioni di due circonferenze i termini $x^2$ e $y^2$ si eliminano e resta l'equazione di una **retta**. Questa retta, detta asse radicale, contiene tutte le informazioni sulla posizione reciproca delle due circonferenze.` },
        { t: 'def', title: 'Asse radicale', md: R`Date $\mathcal C_1:\ x^2+y^2+ax+by+c=0$ e $\mathcal C_2:\ x^2+y^2+a'x+b'y+c'=0$ non concentriche, l'**asse radicale** è la retta
$$(a-a')x+(b-b')y+(c-c')=0$$
- È **perpendicolare** alla retta che congiunge i centri.
- Se le circonferenze sono **secanti**, passa per i due punti di intersezione (è la retta della corda comune).
- Se sono **tangenti**, è la tangente comune nel punto di contatto.
- Se non hanno punti comuni, è una retta esterna a entrambe.

Per trovare i punti di intersezione di due circonferenze conviene quindi mettere a sistema **una** delle due con l'asse radicale.` },
        {
          t: 'ex',
          title: R`Trova i punti comuni a $x^2+y^2=5$ e $x^2+y^2-6x-6y+13=0$.`,
          steps: [
            R`Sottraiamo la seconda dalla prima: $6x+6y-18=0$, cioè $x+y=3$. È l'asse radicale.`,
            R`Sostituiamo $y=3-x$ nella prima: $x^2+(3-x)^2=5$, cioè $2x^2-6x+4=0$, $x^2-3x+2=0$.`,
            R`$x=1$ oppure $x=2$; i punti sono $(1;2)$ e $(2;1)$.`,
            R`Controllo: i centri sono $(0;0)$ e $(3;3)$, sulla retta $y=x$, che è perpendicolare a $x+y=3$ ✓`,
          ],
        },
        { t: 'def', title: 'Fascio di circonferenze', md: R`L'equazione
$$x^2+y^2+ax+by+c+k\,(x^2+y^2+a'x+b'y+c')=0$$
rappresenta, per $k\neq-1$, una circonferenza. L'insieme che si ottiene al variare di $k$ è il **fascio** generato da $\mathcal C_1$ e $\mathcal C_2$:
- se le generatrici sono secanti, tutte le circonferenze del fascio passano per gli stessi due **punti base**;
- se sono tangenti, tutte sono tangenti nello stesso punto alla stessa retta;
- per $k=-1$ si ottiene l'asse radicale (la "circonferenza degenere" del fascio);
- i centri di tutte le circonferenze del fascio sono allineati sulla retta dei centri.` },
        { t: 'warn', md: R`Prima di sottrarre le due equazioni assicurati che in entrambe i coefficienti di $x^2$ e $y^2$ siano uguali a $1$: in caso contrario dividi tutta l'equazione per quel coefficiente.` },
        {
          t: 'quiz',
          q: R`Qual è l'asse radicale di $x^2+y^2-4=0$ e $x^2+y^2-2x=0$?`,
          options: [
            { md: R`$x=2$`, ok: true, why: R`Sottraendo: $-4+2x=0$, cioè $x=2$. Le circonferenze sono tangenti in $(2;0)$ e questa è la tangente comune.` },
            { md: R`$y=2$`, why: R`Nella differenza delle due equazioni non compare $y$: la retta è verticale.` },
            { md: R`$x=-2$`, why: R`Controlla i segni nella sottrazione: $(-4)-(-2x)=2x-4$.` },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'cir-corona',
      level: 1,
      title: 'Corona circolare',
      make: (r) => {
        const r1 = int(r, 1, 6), r2 = int(r, r1 + 1, r1 + 5);
        return {
          text: R`L'area della corona circolare compresa tra le circonferenze $x^2+y^2=${r1 * r1}$ e $x^2+y^2=${r2 * r2}$ vale $k\pi$. Quanto vale $k$?`,
          answer: r2 * r2 - r1 * r1,
          tol: 0,
          hints: [R`Le due circonferenze sono concentriche: l'area è la differenza delle aree dei due cerchi.`, R`Nell'equazione $x^2+y^2=r^2$ il termine noto è già $r^2$.`],
          solution: [R`$\mathcal A=\pi r_2^2-\pi r_1^2=${r2 * r2}\pi-${r1 * r1}\pi=${r2 * r2 - r1 * r1}\pi$.`, R`$k=${r2 * r2 - r1 * r1}$.`],
        };
      },
    },
    {
      id: 'cir-semicirconferenza',
      level: 2,
      title: 'Semicirconferenze come funzioni',
      make: (r) => {
        const rad = int(r, 2, 9), up = r() < 0.5;
        return {
          text: R`Quale curva è il grafico della funzione $y=${up ? '' : '-'}\sqrt{${rad * rad}-x^2}$?`,
          options: choice(r, [
            [`La semicirconferenza ${up ? 'superiore' : 'inferiore'} di centro l'origine e raggio $${rad}$`],
            [`La semicirconferenza ${up ? 'inferiore' : 'superiore'} di centro l'origine e raggio $${rad}$`, `Una radice quadrata è sempre $\\ge0$: con il segno ${up ? 'più' : 'meno'} davanti, $y$ è ${up ? 'non negativa' : 'non positiva'}.`],
            [`L'intera circonferenza di centro l'origine e raggio $${rad}$`, 'L\'intera circonferenza non è il grafico di una funzione: a un valore di $x$ corrisponderebbero due valori di $y$.'],
            [`La semicirconferenza ${up ? 'superiore' : 'inferiore'} di centro l'origine e raggio $${rad * rad}$`, R`Elevando al quadrato si ottiene $x^2+y^2=${rad * rad}$: il termine noto è $r^2$.`],
          ]),
          hints: ['Eleva al quadrato entrambi i membri per riconoscere la curva.', 'Poi chiediti quale segno può avere $y$.'],
          solution: [R`Elevando al quadrato: $y^2=${rad * rad}-x^2$, cioè $x^2+y^2=${rad * rad}$: circonferenza di centro $O$ e raggio $${rad}$.`, `Poiché $y${up ? '\\ge' : '\\le'}0$, si tratta della sola semicirconferenza ${up ? 'superiore' : 'inferiore'}.`],
        };
      },
    },
    {
      id: 'cir-tangente-assi',
      level: 2,
      title: 'Circonferenza tangente agli assi',
      make: (r) => {
        const k = int(r, 1, 7);
        return {
          text: R`Qual è l'equazione della circonferenza di raggio $${k}$, con centro nel primo quadrante, tangente a entrambi gli assi cartesiani?`,
          options: mc(r, `$${circ(-2 * k, -2 * k, k * k)}$`, [
            [`$${circ(-2 * k, -2 * k, 0)}$`, 'Questa circonferenza passa per l\'origine: non è tangente agli assi.'],
            [`$${circ(-k, -k, k * k)}$`, R`Il centro è $(${k};${k})$: i coefficienti di $x$ e $y$ sono $-2x_C$ e $-2y_C$.`],
            [`$${circ(2 * k, 2 * k, k * k)}$`, 'Con questi segni il centro si trova nel terzo quadrante.'],
          ]),
          hints: [R`Se la circonferenza è tangente a entrambi gli assi, il centro dista $r$ da ciascun asse.`, R`Centro $(${k};${k})$, raggio $${k}$.`],
          solution: [R`Centro $C(${k};${k})$ e raggio $${k}$: $(x-${k})^2+(y-${k})^2=${k * k}$.`, R`Sviluppando: $${circ(-2 * k, -2 * k, k * k)}$.`],
        };
      },
    },
    {
      id: 'cir-corda-asse',
      level: 2,
      title: 'Corda staccata sull\'asse x',
      make: (r) => {
        const [b, rad] = pick(r, [[3, 5], [4, 5], [5, 13], [12, 13], [6, 10], [8, 10]] as const);
        const a = int(r, -5, 5), sb = pick(r, [1, -1]);
        const half = Math.sqrt(rad * rad - b * b);
        return {
          text: R`Calcola la lunghezza della corda che la circonferenza $(x${sg(-a)})^2+(y${sg(-b * sb)})^2=${rad * rad}$ stacca sull'asse $x$.`.replace('(x)^2', 'x^2'),
          answer: 2 * half,
          tol: 0,
          hints: [R`Il centro dista $${b}$ dall'asse $x$ e il raggio è $${rad}$.`, 'Metà corda, distanza del centro dalla retta e raggio formano un triangolo rettangolo.'],
          solution: [R`Distanza del centro $(${a};${b * sb})$ dall'asse $x$: $d=${b}$.`, R`Metà corda: $\sqrt{r^2-d^2}=\sqrt{${rad * rad}-${b * b}}=${half}$.`, R`Corda: $${2 * half}$.`],
        };
      },
    },
    {
      id: 'cir-distanza-minima',
      level: 2,
      title: 'Distanza di un punto dalla circonferenza',
      make: (r) => {
        const a = int(r, -4, 4), b = int(r, -4, 4), t = int(r, 1, 3);
        const [u, v] = pick(r, [[3, 4], [4, 3], [-3, 4], [4, -3]] as const);
        const rad = int(r, 1, 5 * t - 1);
        return {
          text: R`Qual è la distanza minima del punto $P${P(a + u * t, b + v * t)}$ dai punti della circonferenza di centro $C${P(a, b)}$ e raggio $${rad}$?`,
          answer: 5 * t - rad,
          tol: 0,
          hints: [R`Calcola la distanza $\overline{PC}$ e confrontala con il raggio.`, 'Il punto della circonferenza più vicino a $P$ sta sul segmento $PC$.'],
          solution: [R`$\overline{PC}=\sqrt{(${u * t})^2+(${v * t})^2}=${5 * t}$, maggiore del raggio: $P$ è esterno.`, R`Distanza minima: $\overline{PC}-r=${5 * t}-${rad}=${5 * t - rad}$.`],
        };
      },
    },
    {
      id: 'cir-retta-orizzontale',
      level: 2,
      title: 'Tangente orizzontale',
      make: (r) => {
        const a = int(r, -4, 4), b = int(r, -4, 4), rad = int(r, 1, 6);
        return {
          text: R`La retta $y=k$ è tangente alla circonferenza $${circ(-2 * a, -2 * b, a * a + b * b - rad * rad)}$. Qual è il **maggiore** dei due valori possibili di $k$?`,
          answer: b + rad,
          tol: 0,
          hints: ['Trova centro e raggio.', R`Le tangenti orizzontali sono $y=y_C+r$ e $y=y_C-r$.`],
          solution: [R`Centro $C(${a};${b})$; $r=\sqrt{${a * a}+${b * b}${sg(-(a * a + b * b - rad * rad))}}=${rad}$.`, R`Tangenti orizzontali: $y=${b}\pm${rad}$. Il valore maggiore è $k=${b + rad}$.`],
        };
      },
    },
    {
      id: 'cir-tre-punti',
      level: 3,
      title: 'Circonferenza per tre punti',
      make: (r) => {
        const p = nz(r, -5, 5), q = nz(r, -5, 5);
        return {
          text: R`Trova l'equazione della circonferenza passante per $O(0;0)$, $A${P(2 * p, 0)}$ e $B${P(0, 2 * q)}$.`,
          options: mc(r, `$${circ(-2 * p, -2 * q, 0)}$`, [
            [`$${circ(2 * p, 2 * q, 0)}$`, 'Segni sbagliati: sostituisci le coordinate di $A$ per controllare.'],
            [`$${circ(-p, -q, 0)}$`, R`Sostituendo $A$ si ottiene $${4 * p * p}${sg(2 * p, 'a')}=0$: ricalcola $a$.`],
            [`$${circ(-2 * p, -2 * q, p * p + q * q)}$`, 'La circonferenza passa per l\'origine: il termine noto deve essere $0$.'],
          ]),
          hints: [R`Il passaggio per l'origine dà $c=0$.`, 'Sostituisci le coordinate di $A$ e di $B$ per trovare $a$ e $b$.'],
          solution: [R`$O$: $c=0$.`, R`$A$: $${4 * p * p}${sg(2 * p, 'a')}=0\Rightarrow a=${-2 * p}$.`, R`$B$: $${4 * q * q}${sg(2 * q, 'b')}=0\Rightarrow b=${-2 * q}$. Equazione: $${circ(-2 * p, -2 * q, 0)}$.`],
        };
      },
    },
    {
      id: 'cir-centro-su-asse',
      level: 3,
      title: 'Circonferenza con centro su un asse',
      make: (r) => {
        const p = int(r, -5, 5), u = nz(r, -5, 5), v = nz(r, 1, 5, u, -u);
        const A = [p + u, v], B = [p - v, u];
        return {
          text: R`Una circonferenza passa per $A${P(A[0], A[1])}$ e $B${P(B[0], B[1])}$ e ha il centro sull'asse $x$. Quanto vale il **quadrato** del suo raggio?`,
          answer: u * u + v * v,
          tol: 0,
          hints: [R`Il centro ha coordinate $C(h;0)$ ed è equidistante da $A$ e da $B$.`, R`Imponi $\overline{CA}^2=\overline{CB}^2$, ricava $h$ e poi calcola $\overline{CA}^2$.`],
          solution: [R`$(h${sg(-A[0])})^2+${A[1] * A[1]}=(h${sg(-B[0])})^2+${B[1] * B[1]}$.`.replace(/\(h\)/g, 'h'), R`Semplificando $h^2$ si ricava $h=${p}$: centro $C(${p};0)$.`, R`$r^2=\overline{CA}^2=(${u})^2+(${v})^2=${u * u + v * v}$.`],
        };
      },
    },
    {
      id: 'cir-tangenti-esterno',
      level: 3,
      title: 'Tangenti da un punto esterno',
      make: (r) => {
        const [rad, d] = pick(r, [[3, 5], [4, 5], [5, 13], [12, 13], [6, 10], [8, 10]] as const);
        const t = Math.sqrt(d * d - rad * rad);
        return {
          text: R`Dal punto $P(0;${d})$ si conducono le tangenti alla circonferenza $x^2+y^2=${rad * rad}$. Quali sono i loro coefficienti angolari?`,
          options: mc(r, R`$m=\pm${frac(t, rad)}$`, [
            [R`$m=\pm${frac(rad, t)}$`, R`Hai invertito il rapporto: ricontrolla l'equazione ottenuta imponendo distanza $=$ raggio.`],
            [R`$m=\pm${frac(d, rad)}$`, R`Dalla condizione $\dfrac{${d}}{\sqrt{m^2+1}}=${rad}$ si ricava $m^2+1$, non $m$: manca un passaggio.`],
            [R`$m=\pm${frac(rad, d)}$`, 'Imposta la condizione di tangenza: distanza del centro dalla retta uguale al raggio.'],
          ]),
          hints: [R`Rette per $P$: $y=mx+${d}$, cioè $mx-y+${d}=0$.`, R`Imponi $\dfrac{${d}}{\sqrt{m^2+1}}=${rad}$.`],
          solution: [R`Distanza di $O$ dalla retta $mx-y+${d}=0$: $\dfrac{${d}}{\sqrt{m^2+1}}=${rad}$.`, R`$m^2+1=\dfrac{${d * d}}{${rad * rad}}\Rightarrow m^2=\dfrac{${d * d - rad * rad}}{${rad * rad}}$.`, R`$m=\pm${frac(t, rad)}$.`],
        };
      },
    },
    {
      id: 'cir-asse-radicale',
      level: 2,
      title: 'Asse radicale',
      make: (r) => {
        const a = nz(r, -6, 6), b = nz(r, -6, 6), c = int(r, -9, 3), k = int(r, 1, 9);
        const fix = (x: number) => (x === 0 ? 1 : 0);
        const c1 = c + k + fix(c + k), kk = c1 - c; // garantisce termine noto non nullo
        return {
          text: R`Trova l'asse radicale delle circonferenze $${circ(a, b, c)}$ e $x^2+y^2=${kk}$.`,
          options: mc(r, `$${lin(a, b, c1)}$`, [
            [`$${lin(a, b, c - kk)}$`, R`Segno sbagliato: la seconda equazione, portata a primo membro, è $x^2+y^2-${kk}=0$.`],
            [`$${lin(a, b, c)}$`, R`Hai dimenticato il termine noto della seconda circonferenza.`],
            [`$${lin(a, -b, c1)}$`, 'Controlla il segno del coefficiente di $y$ nella sottrazione.'],
          ], [`$${lin(-a, b, c1 + 1)}$`]),
          hints: ['Sottrai membro a membro le due equazioni: i termini di secondo grado si eliminano.', R`Scrivi la seconda come $x^2+y^2-${kk}=0$.`],
          solution: [R`$(${circ(a, b, c).replace('=0', '')})-(x^2+y^2-${kk})=0$.`, R`Asse radicale: $${lin(a, b, c1)}$.`],
        };
      },
    },
  ],
};
