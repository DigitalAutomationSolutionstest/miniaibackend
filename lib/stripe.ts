import Stripe from 'stripe';

// Inizializza Stripe con la chiave segreta
const stripeKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'MiniAI Backend',
    version: '1.0.0',
  }
});

// Per verificare se le credenziali sono impostate correttamente
if (!stripeKey) {
  console.warn('⚠️ Stripe: credenziali mancanti. Imposta STRIPE_SECRET_KEY');
}

// Funzione per gestire l'abbonamento
export async function createCheckoutSession(priceId: string, userId: string, customerEmail: string) {
  try {
    // Crea una sessione di checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/prezzi`,
      customer_email: customerEmail,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Errore nella creazione della sessione di checkout:', error);
    return { success: false, error: 'Errore durante la creazione della sessione di pagamento' };
  }
} 