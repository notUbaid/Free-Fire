import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { data: teams, error } = await supabase
      .from("team_scores")
      .select("*")
      .order("total_points", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ teams: teams || [] });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}