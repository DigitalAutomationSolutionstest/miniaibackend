import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';
import { validateQuoteForm } from '@/utils/validate';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Estrai i dati dal corpo della richiesta
    const data = await req.json();
    const { name, email, phone, company, message, budget, services } = data;

    // Valida i dati del form
    const validation = validateQuoteForm({ name, email, phone, company, message });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Crea il client Supabase (solo a runtime)
    const supabase = createSupabaseServerClient();

    // Salva la richiesta nel database
    const { error: dbError } = await supabase
      .from('quote_requests')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        message,
        budget: budget || null,
        services: services || [],
        status: 'new',
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Errore salvataggio richiesta:', dbError);
      return NextResponse.json(
        { success: false, message: 'Errore nel salvataggio della richiesta' },
        { status: 500 }
      );
    }

    // Invia email di conferma al cliente
    await sendEmail({
      to: email,
      subject: 'Abbiamo ricevuto la tua richiesta - MiniAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Grazie per la tua richiesta, ${name}!</h2>
          <p>Abbiamo ricevuto la tua richiesta e ti risponderemo al più presto.</p>
          <p><strong>Riepilogo:</strong></p>
          <ul>
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            ${phone ? `<li><strong>Telefono:</strong> ${phone}</li>` : ''}
            ${company ? `<li><strong>Azienda:</strong> ${company}</li>` : ''}
            ${budget ? `<li><strong>Budget:</strong> ${budget}</li>` : ''}
            ${services?.length > 0 ? `<li><strong>Servizi:</strong> ${services.join(', ')}</li>` : ''}
          </ul>
          <p><strong>Il tuo messaggio:</strong></p>
          <p>${message}</p>
          <hr />
          <p>Il team di MiniAI</p>
        </div>
      `,
    });

    // Invia notifica al team
    await sendEmail({
      to: 'info@miniaiapps.tech',
      subject: 'Nuova richiesta di preventivo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuova richiesta di preventivo</h2>
          <p><strong>Dettagli:</strong></p>
          <ul>
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            ${phone ? `<li><strong>Telefono:</strong> ${phone}</li>` : ''}
            ${company ? `<li><strong>Azienda:</strong> ${company}</li>` : ''}
            ${budget ? `<li><strong>Budget:</strong> ${budget}</li>` : ''}
            ${services?.length > 0 ? `<li><strong>Servizi:</strong> ${services.join(', ')}</li>` : ''}
          </ul>
          <p><strong>Messaggio:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    // Risposta di successo
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio preventivo:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore nell\'elaborazione della richiesta' },
      { status: 500 }
    );
  }
} 