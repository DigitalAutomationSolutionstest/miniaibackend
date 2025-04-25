# Audio Transcriber

## Descrizione
Questa applicazione converte file audio in testo utilizzando modelli AI avanzati.
> "Trasforma qualsiasi file audio (MP3, WAV, M4A) in testo accurato con supporto per italiano e molte altre lingue."

## Requisiti
- Sistema operativo: Windows (.exe) o Mac (.dmg)
- Connessione Internet attiva
- Almeno 4 GB di RAM disponibile
- Spazio su disco: 100 MB minimo
- API Key OpenAI (opzionale per modelli avanzati)

## Installazione

### Windows
1. Scarica il file `audio-transcriber-windows.exe` dal sito Mini AI Hub.
2. Esegui il file e segui le istruzioni dell'installazione guidata.
3. L'applicazione verrà installata nella cartella `C:\Program Files\MiniAI\AudioTranscriber` di default.

### macOS
1. Scarica il file `audio-transcriber-mac.dmg` dal sito Mini AI Hub.
2. Apri il file .dmg scaricato.
3. Trascina l'icona dell'applicazione nella cartella Applicazioni.
4. Alla prima apertura, clicca destro sull'app e seleziona "Apri" per bypassare l'avviso di sicurezza.

### Linux
1. Scarica il file `audio-transcriber-linux.zip` dal sito Mini AI Hub.
2. Estrai l'archivio in una cartella a tua scelta.
3. Apri il terminale nella directory estratta.
4. Esegui `chmod +x audio-transcriber` per rendere il file eseguibile.
5. Avvia l'applicazione con `./audio-transcriber`.

## Configurazione

### Chiavi API (Opzionale)
Se desideri utilizzare modelli di trascrizione più avanzati:

1. Ottieni una API Key da OpenAI (whisper-1): [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Nell'applicazione, vai su "Impostazioni" > "API Keys"
3. Inserisci la tua chiave OpenAI nel campo appropriato

Oppure:

1. Crea un file `.env` nella cartella di installazione dell'app
2. Aggiungi la seguente riga:
```
OPENAI_API_KEY=la-tua-chiave-api
```
3. Salva e riavvia l'applicazione

## Utilizzo

### Importazione Audio
1. Apri l'applicazione Audio Transcriber
2. Clicca su "Importa File" o trascina un file audio direttamente nell'app
3. Formati supportati: MP3, WAV, M4A, FLAC, OGG (max 25 MB)

### Trascrizione
1. Seleziona la lingua dell'audio (o lascia su "Auto-detect")
2. Scegli il modello di trascrizione:
   - Standard: veloce, adatto per audio chiari
   - Avanzato: più preciso, migliore con rumori di fondo (richiede API Key)
3. Clicca su "Trascrivi"
4. Attendi il completamento del processo

### Modifica e Esportazione
1. Una volta completata la trascrizione, puoi modificare il testo nel pannello editor
2. Usa gli strumenti di formattazione per migliorare la leggibilità
3. Esporta in formato TXT, DOCX o SRT (sottotitoli) usando il menu "Esporta"
4. Opzionalmente, salva il progetto per modifiche future

## Problemi Comuni

### Errore di Connessione
- Verifica la tua connessione internet
- Controlla lo stato del servizio su [status.miniaiapps.tech](https://status.miniaiapps.tech)

### Qualità Trascrizione Bassa
- Usa un file audio con meno rumori di fondo
- Seleziona il modello "Avanzato" per maggiore precisione
- Per lunghi file audio, considera di dividerli in segmenti più piccoli

### Errore di Autenticazione API
- Verifica che la tua API Key sia valida e inserita correttamente
- Controlla di avere credito sufficiente sul tuo account OpenAI

## Supporto
Per assistenza o richieste particolari:  
📧 Email: support@miniaiapps.tech
🌐 Sito web: [www.miniaiapps.tech/support](https://www.miniaiapps.tech/support)
📚 Documentazione: [docs.miniaiapps.tech/audio-transcriber](https://docs.miniaiapps.tech/audio-transcriber) 