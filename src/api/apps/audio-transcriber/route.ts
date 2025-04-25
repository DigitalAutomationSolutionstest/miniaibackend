import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Previeni caching statico delle API
export const dynamic = 'force-dynamic';

// Configura Edge Runtime per prestazioni migliori
export const runtime = 'edge';

// Limite dimensione file upload
export const fetchCache = 'force-no-store';
export const bodyParser = {
  sizeLimit: '25mb',
};

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
      
    const requiredCredits = 1; // Trascrizione audio usa 1 credito
    
    if (creditsError || !credits || credits.credits < requiredCredits) {
      return NextResponse.json(
        { success: false, error: 'Crediti insufficienti' },
        { status: 403 }
      );
    }

    // Estrazione form data e file
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'auto';
    const model = formData.get('model') as string || 'standard';
    
    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'File audio richiesto' },
        { status: 400 }
      );
    }
    
    // Validazione file
    const fileType = audioFile.type;
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/flac', 'audio/ogg'];
    if (!validTypes.some(type => fileType.includes(type))) {
      return NextResponse.json(
        { success: false, error: 'Formato file non supportato. Formati supportati: MP3, WAV, M4A, FLAC, OGG' },
        { status: 400 }
      );
    }
    
    const fileSizeInMB = audioFile.size / (1024 * 1024);
    if (fileSizeInMB > 25) {
      return NextResponse.json(
        { success: false, error: 'File troppo grande. Il limite è 25 MB' },
        { status: 400 }
      );
    }
    
    // Registra l'utilizzo
    await supabase.from('app_usage').insert({
      user_id: user.id,
      app_name: 'audio-transcriber',
      credits_used: requiredCredits,
      timestamp: new Date().toISOString(),
      details: { 
        fileName: audioFile.name,
        fileType,
        fileSize: audioFile.size,
        language,
        model 
      }
    });
    
    // Decrementa crediti
    await supabase
      .from('user_credits')
      .update({ credits: credits.credits - requiredCredits })
      .eq('user_id', user.id);

    // Mock response (in produzione, chiamerebbe un'API di trascrizione)
    const mockTranscriptionText = `Questa è una trascrizione simulata del file audio "${audioFile.name}". 
In un'implementazione reale, il file audio verrebbe inviato a un servizio di trascrizione come OpenAI Whisper 
o un motore di trascrizione personalizzato. La trascrizione risultante verrebbe quindi restituita all'utente.

Il file ha una dimensione di ${fileSizeInMB.toFixed(2)} MB ed è stato elaborato con il modello "${model}" 
con impostazione lingua "${language}".

Grazie per aver utilizzato il nostro servizio di trascrizione audio.`;
    
    // Risposta di successo
    return NextResponse.json({
      success: true,
      data: {
        text: mockTranscriptionText,
        fileName: audioFile.name,
        duration: Math.floor(Math.random() * 120) + 30, // durata simulata tra 30 e 150 secondi
        language: language === 'auto' ? 'it' : language, // lingua rilevata (simulata)
        model,
        wordCount: mockTranscriptionText.split(' ').length
      },
      credits_remaining: credits.credits - requiredCredits
    });
  } catch (error) {
    console.error('Errore API Audio Transcriber:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
} 