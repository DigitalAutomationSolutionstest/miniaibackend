// @deno-types="https://deno.land/x/types/deno.ns.d.ts"

export const ENV = {
  // Supabase
  SUPABASE_URL: Deno.env.get("SUPABASE_URL") || "",
  SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY") || "",
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",

  // OpenAI
  OPENAI_API_KEY: Deno.env.get("OPENAI_API_KEY") || "",
  ANTHROPIC_API_KEY: Deno.env.get("ANTHROPIC_API_KEY") || "",

  // Hugging Face
  HF_API_KEY: Deno.env.get("HF_API_KEY") || "",

  // Resend
  RESEND_API_KEY: Deno.env.get("RESEND_API_KEY") || "",

  // Stripe
  STRIPE_SECRET_KEY: Deno.env.get("STRIPE_SECRET_KEY") || "",
  STRIPE_WEBHOOK_SECRET: Deno.env.get("STRIPE_WEBHOOK_SECRET") || "",

  // Dominio
  SITE_URL: Deno.env.get("SITE_URL") || "http://localhost:3000",
  API_URL: Deno.env.get("API_URL") || "http://localhost:54321",
}; 