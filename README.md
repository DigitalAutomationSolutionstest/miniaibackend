# MiniAI Backend

Backend API per Mini AI Hub, costruito con Next.js 14 e pronto per il deploy su Vercel.

## Tecnologie

- Next.js 14
- API Routes
- Stripe per i pagamenti
- Supabase per il database
- Resend per le email

## Installazione

1. Clona il repository
```bash
git clone https://github.com/DigitalAutomationSolutionstest/miniai-backend.git
cd miniai-backend
```

2. Installa le dipendenze
```bash
npm install
```

3. Crea un file `.env.local` con le variabili d'ambiente necessarie
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
RESEND_API_KEY=...
```

4. Avvia il server di sviluppo
```bash
npm run dev
```

## Deploy su Vercel

Per il deploy su Vercel, segui questi passaggi:

1. Collega il repository GitHub a Vercel
2. Configura le variabili d'ambiente su Vercel
3. Imposta il dominio personalizzato `api.miniaiapps.tech` nelle impostazioni del progetto

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
/miniai-backend
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

Copia da `.env.example` e incolla nella sezione Environment Variables su Vercel.

```
# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# AI
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=
ANTHROPIC_API_KEY=

# Altro
EMAIL_ADMIN=admin@miniaiapps.tech
BASE_URL=https://miniaiapps.tech
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

Per un deployment manuale:

```bash
# Installa Vercel CLI
npm i -g vercel

# Esegui il deployment
vercel
```
// trigger rebuild
