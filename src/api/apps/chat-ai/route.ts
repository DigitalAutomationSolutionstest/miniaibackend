import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

// Configura Edge Runtime per prestazioni migliori
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Autenticazione utente con Supabase
    const supabase = createClient();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Autenticazione richiesta' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Utente non autorizzato' },
        { status: 401 }
      );
    }

    // Verifica crediti utente
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();
      
    if (creditsError || !credits || credits.credits < 1) {
      return NextResponse.json(
        { success: false, error: 'Crediti insufficienti' },
        { status: 403 }
      );
    }

    // Estrazione parametri
    const { prompt, settings } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Parametro prompt richiesto' },
        { status: 400 }
      );
    }

    // Default settings
    const modelSettings = {
      model: settings?.model || 'gpt-3.5-turbo',
      temperature: settings?.temperature || 0.7,
      max_tokens: settings?.max_tokens || 500,
    };
    
    // Registra l'utilizzo
    await supabase.from('app_usage').insert({
      user_id: user.id,
      app_name: 'chat-ai',
      credits_used: 1,
      timestamp: new Date().toISOString(),
      details: { prompt, settings: modelSettings }
    });
    
    // Decrementa crediti
    await supabase
      .from('user_credits')
      .update({ credits: credits.credits - 1 })
      .eq('user_id', user.id);

    // Mock response (in produzione, chiamerebbe un'API AI esterna)
    const response = {
      text: `Risposta simulata alla domanda: ${prompt}`,
      model: modelSettings.model,
      tokens: {
        prompt: prompt.length / 4, // Simulazione conteggio token
        completion: prompt.length / 2,
        total: prompt.length / 4 + prompt.length / 2
      }
    };

    // Risposta di successo
    return NextResponse.json({
      success: true,
      data: response,
      credits_remaining: credits.credits - 1
    });
  } catch (error) {
    console.error('Errore API Chat AI:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
} 