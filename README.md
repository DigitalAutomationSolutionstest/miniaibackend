# Mini AI Hub Monorepo

Monorepo per il progetto Mini AI Hub contenente backend e (in futuro) frontend.

## Struttura

- `backend/` - API Next.js per il backend

## Installazione

1. Clona il repository
```bash
git clone https://github.com/tuo-username/mini-ai-hub.git
cd mini-ai-hub
```

2. Installa le dipendenze
```bash
npm install
```

## Avvio del backend

```bash
# Sviluppo
npm run backend:dev

# Build
npm run backend:build

# Produzione
npm run backend:start
```

## Backend

Il backend si trova nella cartella `backend/` ed è un'applicazione Next.js con:

- API Routes in `app/api/`
- Integrazione con Stripe e Supabase
- Deploy su Vercel

Per maggiori dettagli, consulta il [README del backend](backend/README.md).

## Tecnologie

- Next.js 14
- API Routes
- Stripe per i pagamenti
- Supabase per il database
- Resend per le email

## Endpoint API

- `GET /api/debug` - Verifica che il backend sia online
- Altre API saranno documentate qui...

## API Principali

- `GET /api/debug` → Verifica stato dei servizi
- `POST /api/quote` → Richiesta preventivo
- `POST /api/stripe/checkout-subscription` → Abbonamento
- `POST /api/ai/pdf` → Elaborazione PDF con AI
- `POST /api/ai/image` → Generazione immagini con AI

## Struttura del Progetto

```
/mini-ai-hub
│
├── app/
│   └── api/
│       └── debug/route.ts       # API verifica stato
│       └── stripe/...           # Rotte API Stripe
│       └── quote/...            # API preventivi
│       └── ai/...               # API AI (PDF, Image)
│
├── lib/                         # Librerie utility
│   └── stripe.ts                # Integrazione Stripe
│   └── supabase.ts              # Integrazione Supabase
│
├── .env.example                 # Variabili da impostare
├── vercel.json                  # Configurazione Vercel
└── README.md                    # Documentazione
```

## Variabili d'Ambiente

```
# Stripe
STRIPE_SECRET_KEY=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
```

## Sviluppo Locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## Deployment

Il deployment è automatizzato tramite Vercel. Ogni push al branch `main` attiva un nuovo deployment.
