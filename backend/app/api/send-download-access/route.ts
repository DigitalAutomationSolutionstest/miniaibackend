import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';
import { validateEmail } from '@/utils/validate';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Estrai i dati dal corpo della richiesta
    const data = await req.json();
    const { email, productId } = data;

    // Validazione base
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email non valida' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'ID prodotto richiesto' },
        { status: 400 }
      );
    }

    // Crea il client Supabase (solo a runtime)
    const supabase = createSupabaseServerClient();

    // Verifica se l'utente esiste
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Recupera dettagli prodotto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, download_url')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, message: 'Prodotto non trovato' },
        { status: 404 }
      );
    }

    if (!product.download_url) {
      return NextResponse.json(
        { success: false, message: 'URL di download non disponibile per questo prodotto' },
        { status: 400 }
      );
    }

    // Genera token temporaneo per download sicuro
    const downloadToken = crypto.randomUUID();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Valido per 24 ore

    // Salva token nel database
    const { error: tokenError } = await supabase
      .from('download_tokens')
      .insert({
        user_id: user.id,
        product_id: productId,
        token: downloadToken,
        expires_at: expiryDate.toISOString(),
        created_at: new Date().toISOString(),
      });

    if (tokenError) {
      console.error('Errore creazione token:', tokenError);
      return NextResponse.json(
        { success: false, message: 'Errore generazione link di download' },
        { status: 500 }
      );
    }

    // Costruisci URL di download con token
    const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/download/${downloadToken}`;

    // Invia email con link di download
    await sendEmail({
      to: email,
      subject: `Il tuo download per ${product.name} - MiniAI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Il tuo download è pronto, ${user.name}!</h2>
          <p>Grazie per aver scelto MiniAI. Di seguito trovi il link per scaricare ${product.name}:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" style="background-color: #6c5ce7; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Scarica ora
            </a>
          </p>
          <p><strong>Importante:</strong> Questo link scadrà tra 24 ore.</p>
          <p>Se hai problemi con il download, contattaci rispondendo a questa email.</p>
          <hr />
          <p>Il team di MiniAI</p>
        </div>
      `,
    });

    // Registra l'evento di download
    await supabase
      .from('download_events')
      .insert({
        user_id: user.id,
        product_id: productId,
        created_at: new Date().toISOString(),
      });

    // Risposta di successo
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio accesso download:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante l\'invio dell\'accesso al download' },
      { status: 500 }
    );
  }
} 