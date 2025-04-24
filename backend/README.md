# Mini AI Hub Backend

Backend API per Mini AI Hub, costruito con Next.js 14 e pronto per il deploy su Vercel.

## Tecnologie

- Next.js 14
- API Routes
- Stripe per i pagamenti
- Supabase per il database
- Resend per le email

## Installazione

1. Dalla cartella principale del repository
```bash
cd backend
npm install
```

2. Crea un file `.env.local` con le variabili d'ambiente necessarie
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
RESEND_API_KEY=...
```

3. Avvia il server di sviluppo
```bash
npm run dev
```

## Deploy su Vercel

Per il deploy su Vercel, segui questi passaggi:

1. Collega il repository GitHub a Vercel, specificando `/backend` come directory del progetto
2. Configura le variabili d'ambiente su Vercel
3. Imposta il dominio personalizzato nelle impostazioni del progetto

## Endpoint API

- `GET /api/debug` - Verifica che il backend sia online
- Altre API saranno documentate qui...

## Struttura del Progetto

```
/backend
│
├── app/
│   └── api/
│       └── debug/route.ts       # API verifica stato
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