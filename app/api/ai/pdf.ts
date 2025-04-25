import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getUserFromToken } from "@/utils/auth";
import { deductCredits } from "@/utils/credits";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
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