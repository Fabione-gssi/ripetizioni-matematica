# Ripetizioni di Matematica

App per ripetizioni di matematica (3° e 4° anno di liceo scientifico) con lezioni interattive,
esercizi a tre livelli di autonomia, simulazioni di verifica, tutor AI, chat con il professore
e correzione di esercizi fotografati. Un unico codice produce la **webapp** e l'**APK Android**.

Tutto funziona con servizi gratuiti: nessun costo di sviluppo né di manutenzione.

## Come è fatta

| Parte | Tecnologia | Note |
|---|---|---|
| Interfaccia | React + TypeScript + Vite | `src/` |
| App Android | Capacitor (incapsula la webapp) | `android/` |
| Formule | KaTeX | incluso nell'app, funziona offline |
| Contenuti | file TypeScript in `src/content/` | inclusi nell'app, funzionano offline |
| Account, dati, chat, foto | Supabase (piano gratuito) | `supabase/migrations/` |
| Tutor AI | Edge Function Supabase + Google Gemini (piano gratuito) | `supabase/functions/ai-tutor/` |

Senza configurazione l'app parte in **modalità demo**: i dati restano nel browser e si possono creare
sullo stesso dispositivo un account studente e uno professore per provare tutte le funzioni.

### Struttura delle cartelle

```
src/lib/         logica: tipi, generatori di esercizi, accesso ai dati (api.ts, supabaseApi.ts, localApi.ts)
src/components/  componenti riutilizzabili (grafici, blocchi lezione, esercizio, chat, foto)
src/pages/       schermate dello studente e del professore
src/content/     unità didattiche (anno3/, anno4/) e registro (index.ts)
tests/           controlli automatici sui contenuti
supabase/        schema del database con regole di sicurezza, funzione del tutor AI
android/         progetto Android generato da Capacitor
```

## Comandi

```bash
npm install        # una volta sola
npm run dev        # avvia la webapp in locale (http://localhost:5173)
npm test           # controlli automatici sui contenuti
npm run build      # produce la webapp in dist/
```

## Mettere in funzione il backend (una volta sola, circa 20 minuti)

1. **Crea il progetto Supabase**: registrati su https://supabase.com, crea un progetto (regione
   consigliata: Europa). Annota la password del database.
2. **Crea le tabelle**: apri *SQL Editor*, incolla tutto il contenuto di
   `supabase/migrations/0001_schema.sql` ed esegui. Crea tabelle, regole di sicurezza (RLS),
   archivio privato per le foto e la chat in tempo reale.
3. **Impostazioni di accesso** (*Authentication*):
   - *Sign In / Providers → Email*: lascia attivo "Email". Il servizio email gratuito di Supabase
     invia pochissimi messaggi all'ora: con pochi studenti va bene, altrimenti disattiva
     "Confirm email" oppure collega un servizio SMTP gratuito.
   - *URL Configuration → Site URL*: l'indirizzo della webapp (vedi sotto).
4. **Collega l'app**: copia `.env.example` in `.env` e inserisci *Project URL* e chiave *anon*
   (da *Project Settings → API*). La chiave anon è pubblica per definizione: i dati sono protetti
   dalle regole RLS, non dalla segretezza della chiave. **Non usare mai la chiave `service_role` nell'app.**
5. **Tutor AI** (facoltativo):
   - crea una chiave gratuita su https://aistudio.google.com/apikey;
   - in Supabase: *Edge Functions → Secrets*, aggiungi `GEMINI_API_KEY`;
   - pubblica la funzione: dalla dashboard (*Edge Functions → Deploy a new function*, nome
     `ai-tutor`, incolla `supabase/functions/ai-tutor/index.ts`) oppure da terminale con
     `npx supabase login`, `npx supabase link`, `npx supabase functions deploy ai-tutor`.
   - Se nell'elenco delle funzioni l'indirizzo non termina con `/ai-tutor` (Supabase a volte
     assegna un nome casuale, per esempio `super-worker`), scrivi quel nome in `.env` come
     `VITE_AI_FUNCTION=super-worker` (e, per GitHub Pages, nel segreto `VITE_AI_FUNCTION`).
   - Segreti facoltativi: `GEMINI_MODEL` (se il modello predefinito non fosse più disponibile,
     indica qui il nome di un modello gratuito attuale) e `AI_DAILY_LIMIT` (domande al giorno per
     studente, predefinito 30).
   - Senza chiave il tutor risponde che non è disponibile e lo studente usa la chat con il professore.

Dopo aver creato `.env`, ricostruisci webapp e APK (i valori vengono inseriti al momento della build).

## Pubblicare la webapp (gratis)

La cartella `dist/` è un sito statico: va bene qualunque hosting gratuito.

**GitHub Pages (automatico)**: crea un repository, carica il progetto e in
*Settings → Pages* scegli "GitHub Actions". In *Settings → Secrets and variables → Actions* aggiungi
i segreti `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. A ogni `git push` su `main` il flusso
`.github/workflows/deploy.yml` esegue i test, costruisce e pubblica.

Lo stesso repository esegue `.github/workflows/keepalive.yml`: due volte alla settimana fa una
richiesta al database, così il progetto Supabase gratuito non va in pausa per inattività.

## Costruire l'APK Android

Servono Android Studio (o il solo Android SDK) e un JDK 21 (quello incluso in Android Studio va bene).

```bash
npm run build
```

```bash
npx cap sync android
```

Poi, dalla cartella `android/`, con `JAVA_HOME` che punta al JDK 21:

```bash
./gradlew assembleRelease
```

L'APK firmato è in `android/app/build/outputs/apk/release/app-release.apk`: si può inviare agli
studenti e installare direttamente (sul telefono va consentita l'installazione da origini sconosciute).

**Firma**: l'APK è firmato con `android/release.keystore`; le credenziali sono in
`android/keystore.properties`. Questi due file **non** sono nel repository: fanne una copia di
sicurezza. Senza la stessa chiave non è possibile installare un aggiornamento sopra la versione
precedente (bisognerebbe disinstallare e reinstallare).

**Aggiornamenti**: aumenta `versionCode` e `versionName` in `android/app/build.gradle`, ricostruisci
e ridistribuisci l'APK.

## Aggiungere o modificare contenuti

Ogni unità è un file in `src/content/anno3/` o `anno4/` con:

- `lessons`: lezioni composte da blocchi — `idea` (spiegazione divulgativa), `def` (definizione
  formale), `thm` (teorema con dimostrazione guidata a passi), `ex` (esempio svolto a passi),
  `plot` (grafico interattivo con cursori), `warn` (errore tipico), `quiz` (verifica rapida);
- `exercises`: generatori di esercizi con numeri casuali. Ogni generatore produce testo, risposta
  (a scelta multipla con la spiegazione di ogni errore tipico, oppure numerica), suggerimenti,
  soluzione a passi e, dove previsto, i passi guidati.

Le unità più ricche sono divise in due file: quello di base (per esempio `parabola.ts`) e quello di
approfondimento (`parabola.piu.ts`), che `src/content/index.ts` unisce con la funzione `con(...)`.

Il testo usa Markdown essenziale (senza tabelle) e LaTeX tra `$…$`. Per aggiungere un'unità: crea il file, importalo
in `src/content/index.ts` e aggiungilo all'elenco. Per aggiungere fisica o altri anni basta aggiungere
unità (per un nuovo anno va esteso il tipo `year` in `src/lib/types.ts` e il selettore in `Home.tsx`).

**Esegui sempre `npm test` dopo una modifica**: per ogni unità i test generano ogni esercizio con
150 semi casuali e controllano che tutte le formule siano LaTeX valido, che ci sia una sola risposta
corretta, che le opzioni siano distinte e che suggerimenti e soluzione siano presenti. I test **non**
possono verificare la correttezza matematica o didattica: quella va riletta da un docente.

## Sicurezza e privacy

- Ogni studente vede solo i propri dati. Un professore vede i dati dei soli studenti che lo hanno
  scelto e che lui ha accettato. Queste regole sono applicate dal database (RLS), non dall'app.
- Il ruolo (studente/professore) non può essere cambiato dopo la registrazione. Chiunque può
  registrarsi come professore, ma non vede alcun dato finché uno studente non lo sceglie.
- Le foto stanno in un archivio privato e sono accessibili solo tramite link temporanei.
- La chiave del tutor AI resta sul server; ogni studente ha un limite giornaliero di domande.
  Con il piano gratuito di Gemini le conversazioni possono essere usate da Google per migliorare i
  propri servizi: per questo il tutor è istruito a non chiedere dati personali, e lo si può
  disattivare semplicemente non configurando la chiave.
- Dal profilo ogni utente può eliminare il proprio account con tutti i dati collegati.
- Gli studenti sono in gran parte minorenni: prima dell'uso reale è opportuno predisporre
  un'informativa sulla privacy e raccogliere il consenso dei genitori secondo il GDPR.

## Limiti dei piani gratuiti

- **Supabase**: 500 MB di database, 1 GB di foto (compresse a circa 300 kB l'una), 50 000 utenti
  attivi al mese; il progetto va in pausa dopo 7 giorni senza richieste (vedi `keepalive.yml`).
- **Gemini**: numero limitato di richieste al minuto e al giorno; se il limite è superato lo
  studente riceve un messaggio che lo invita a riprovare.
- **GitHub Pages / Actions**: ampiamente sufficienti per un progetto di queste dimensioni.
