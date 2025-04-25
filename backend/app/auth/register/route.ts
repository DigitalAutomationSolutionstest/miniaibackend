import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';
import { validateRegistrationForm } from '@/utils/validate';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Estrai i dati dal corpo della richiesta
    const data = await req.json();
    const { name, email, password } = data;

    // Valida i dati di registrazione
    const validation = validateRegistrationForm({ name, email, password });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Crea il client Supabase (solo a runtime)
    const supabase = createSupabaseServerClient();

    // Controlla se l'utente esiste già
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Indirizzo email già registrato' },
        { status: 409 }
      );
    }

    // Registra l'utente con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      console.error('Errore registrazione Supabase Auth:', authError);
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, message: 'Errore nella creazione dell\'utente' },
        { status: 500 }
      );
    }

    // Crea il profilo utente nella tabella users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        created_at: new Date().toISOString(),
        credits: 3, // Crediti iniziali gratuiti
      });

    if (profileError) {
      console.error('Errore creazione profilo utente:', profileError);
      // Non restituiamo errore all'utente perché l'auth è andata a buon fine
      // L'amministratore dovrà risolvere manualmente
      console.warn('L\'utente è stato creato in Auth ma non nel profilo:', authData.user.id);
    }

    // Invia email di benvenuto
    await sendEmail({
      to: email,
      subject: 'Benvenuto in MiniAI!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Benvenuto in MiniAI, ${name}!</h2>
          <p>La tua registrazione è stata completata con successo.</p>
          <p>Hai ricevuto 3 crediti gratuiti da utilizzare per provare le nostre funzionalità.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #6c5ce7; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Vai alla dashboard
            </a>
          </p>
          <p>Se hai domande, non esitare a contattarci rispondendo a questa email.</p>
          <hr />
          <p>Il team di MiniAI</p>
        </div>
      `,
    });

    // Risposta di successo
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        name,
        email,
        credits: 3,
      },
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante la registrazione' },
      { status: 500 }
    );
  }
} 