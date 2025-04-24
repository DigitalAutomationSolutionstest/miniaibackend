import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { priceId, successUrl, cancelUrl } = await req.json();
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    
    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("[STRIPE CHECKOUT ERROR]", error);
    return new Response(JSON.stringify({ error: "Errore Stripe", details: error }), { status: 500 });
  }
} 