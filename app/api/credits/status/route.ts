import { createSupabaseServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer", "");

  if (!token) {
    return NextResponse.json({ error: "Token mancante" }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 401 });
  }

  const { data, error: dbError } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  if (dbError || !data) {
    return NextResponse.json({ credits: 0 });
  }

  return NextResponse.json({ credits: data.credits });
} 