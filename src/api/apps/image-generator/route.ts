import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

// Configura Edge Runtime per prestazioni migliori
export const runtime = 'edge';

// CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

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

    // Verifica crediti utente (le immagini costano più crediti)
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();
      
    const requiredCredits = 2; // Generazione immagine costa 2 crediti
    
    if (creditsError || !credits || credits.credits < requiredCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Crediti insufficienti. Necessari: ${requiredCredits}, disponibili: ${credits?.credits || 0}` 
        },
        { status: 403 }
      );
    }

    // Estrazione parametri
    const { prompt, style, size, negativePrompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Parametro prompt richiesto' },
        { status: 400 }
      );
    }

    // Validazione dei parametri
    const validStyles = ['realistic', 'anime', 'digital-art', 'oil-painting', 'sketch'];
    const validSizes = ['512x512', '768x768', '1024x1024'];
    
    const imageSettings = {
      style: validStyles.includes(style) ? style : 'realistic',
      size: validSizes.includes(size) ? size : '512x512',
      negativePrompt: negativePrompt || '',
    };
    
    // Registra l'utilizzo
    await supabase.from('app_usage').insert({
      user_id: user.id,
      app_name: 'image-generator',
      credits_used: requiredCredits,
      timestamp: new Date().toISOString(),
      details: { prompt, style: imageSettings.style, size: imageSettings.size }
    });
    
    // Decrementa crediti
    await supabase
      .from('user_credits')
      .update({ credits: credits.credits - requiredCredits })
      .eq('user_id', user.id);

    // Mock response (in produzione, chiamerebbe un'API di generazione immagini)
    const imageUrl = `https://dummyimage.com/${imageSettings.size.replace('x', '/')}/808080/ffffff&text=${encodeURIComponent(prompt.slice(0, 20))}`;
    
    // Risposta di successo
    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
        settings: imageSettings,
        prompt,
        timestamp: new Date().toISOString()
      },
      credits_remaining: credits.credits - requiredCredits
    });
  } catch (error) {
    console.error('Errore API Image Generator:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
} 