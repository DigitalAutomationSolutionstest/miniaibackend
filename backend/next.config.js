/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['miniaiapps.tech'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    BASE_URL: process.env.BASE_URL
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  // Disabilita le pagine non essenziali
  pageExtensions: ['tsx', 'ts'],
  // Definisci i webhook solo per le API
  redirects: async () => {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/error/:path*',
        destination: '/',
        permanent: false,
      },
      // Redireziona API con dipendenze mancanti
      {
        source: '/api/miniapps/:path*',
        destination: '/api/debug',
        permanent: false,
      },
      {
        source: '/api/pdf/:path*',
        destination: '/api/debug',
        permanent: false,
      },
      {
        source: '/api/user/:path*',
        destination: '/api/debug',
        permanent: false,
      },
      {
        source: '/api/stripe/prices',
        destination: '/api/debug',
        permanent: false,
      }
    ]
  }
}

module.exports = nextConfig 