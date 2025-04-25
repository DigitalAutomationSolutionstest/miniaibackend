import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const supabase = createSupabaseServerClient();

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: "PriceId e userId sono richiesti" },
        { status: 400 }
      );
    }

    // Verifica che il prezzo esista
    const price = await stripe.prices.retrieve(priceId);
    if (!price) {
      return NextResponse.json(
        { error: "Prezzo non trovato" },
        { status: 404 }
      );
    }

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=Pagamento annullato`,
      metadata: {
        user_id: userId,
        price_id: priceId,
        type: "subscription"
      },
    });

    // Registra il tentativo di checkout
    await supabase.from("checkout_sessions").insert({
      user_id: userId,
      session_id: session.id,
      price_id: priceId,
      amount: price.unit_amount,
      currency: price.currency,
      status: "pending",
      type: "subscription",
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Errore creazione sessione:", err);
    return NextResponse.json(
      { error: err.message || "Errore creazione sessione" },
      { status: 500 }
    );
  }
} 