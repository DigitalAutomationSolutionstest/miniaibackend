import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromToken } from "@/utils/auth";
import { deductCredits } from "@/utils/credits";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function processPDF(pdfUrl: string, userId: string, questions?: string[]) {
  // Crea il client Supabase all'interno della funzione
  const supabase = createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verificare se l'utente esiste e ha abbastanza crediti
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, credits')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    throw new Error('Utente non trovato');
  }

  if (userData.credits < 1) {
    throw new Error('Crediti insufficienti per elaborare il PDF');
  }

  // Logica per elaborare il PDF con AI
  // Qui andrebbe implementata la chiamata a OpenAI o altra API di AI
  
  // Mock della risposta AI per dimostrazione
  const aiResponses = questions 
    ? questions.map(q => ({ question: q, answer: `Risposta simulata per: ${q}` }))
    : [{ summary: 'Questo è un riassunto simulato del contenuto del PDF.' }];

  // Registra l'utilizzo e scala i crediti
  const { error: usageError } = await supabase
    .from('ai_usage')
    .insert({
      user_id: userId,
      feature: 'pdf',
      credits_used: 1,
      content_reference: pdfUrl,
      created_at: new Date().toISOString(),
    });

  if (usageError) {
    console.error('Errore nel salvataggio dell\'utilizzo:', usageError);
  }

  // Sottrai un credito all'utente
  const { error: creditError } = await supabase
    .from('users')
    .update({ credits: userData.credits - 1 })
    .eq('id', userId);

  if (creditError) {
    console.error('Errore nell\'aggiornamento dei crediti:', creditError);
  }

  return {
    success: true,
    responses: aiResponses,
    remainingCredits: userData.credits - 1,
  };
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hasCredits = await deductCredits(user.id, 1);
  if (!hasCredits) return NextResponse.json({ error: "Crediti esauriti" }, { status: 402 });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Analizza questo contenuto PDF:\n${text}` }],
    model: "gpt-4",
  });

  return NextResponse.json({ result: completion.choices[0].message.content });
} 