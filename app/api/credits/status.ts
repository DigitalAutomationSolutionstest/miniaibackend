import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getUserFromToken } from "@/utils/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ credits: data?.credits ?? 0 });
} 