import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

/**
 * API per verificare lo stato dei servizi
 * GET /api/debug
 */
export async function GET() {
  const status: Record<string, boolean | string> = {};

  try {
    const { error } = await supabase.from("quotes").select("*").limit(1);
    status.supabase = !error;
  } catch {
    status.supabase = false;
  }

  try {
    const products = await stripe.products.list({ limit: 1 });
    status.stripe = !!products.data;
  } catch {
    status.stripe = false;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const domains = await resend.domains.list();
    status.resend = !!domains?.data;
  } catch {
    status.resend = false;
  }

  return Response.json({ ok: true, services: status });
} 