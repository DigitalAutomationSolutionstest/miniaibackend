import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { resend } from '@/lib/resend';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Estrai i dati dal corpo della richiesta
    const { name, email, message, budget, services = [] } = await req.json();
    
    // Validazione base dei campi obbligatori
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Campi obbligatori mancanti' }, 
        { status: 400 }
      );
    }

    // Crea il client Supabase all'interno della funzione
    const supabase = createClient();

    // Salva la richiesta nel database
    const { error: dbError } = await supabase
      .from('quote_requests')
      .insert({
        name,
        email,
        message,
        budget,
        services,
        status: 'new',
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Errore salvataggio richiesta:', dbError);
      return NextResponse.json(
        { success: false, error: 'Errore nel salvataggio della richiesta' },
        { status: 500 }
      );
    }

    // Invia email di notifica al team
    await resend.emails.send({
      from: 'MiniAI Hub <noreply@miniaiapps.tech>',
      to: ['info.digitalautomationsolutions@gmail.com'],
      subject: 'Nuova richiesta preventivo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuova richiesta di preventivo</h2>
          <p><strong>Dettagli:</strong></p>
          <ul>
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            ${budget ? `<li><strong>Budget:</strong> ${budget}</li>` : ''}
            ${services?.length > 0 ? `<li><strong>Servizi:</strong> ${services.join(', ')}</li>` : ''}
          </ul>
          <p><strong>Messaggio:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    // Invia email di conferma al cliente
    await resend.emails.send({
      from: 'MiniAI Hub <noreply@miniaiapps.tech>',
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
            ${budget ? `<li><strong>Budget:</strong> ${budget}</li>` : ''}
          </ul>
          <p><strong>Il tuo messaggio:</strong></p>
          <p>${message}</p>
          <hr />
          <p>Il team di MiniAI</p>
        </div>
      `,
    });

    // Risposta di successo
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio preventivo:', error);
    return NextResponse.json(
      { success: false, error: 'Si è verificato un errore interno' },
      { status: 500 }
    );
  }
} 