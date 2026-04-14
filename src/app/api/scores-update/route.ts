import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password, id, field, value } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { error } = await supabase
      .from("team_scores")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}