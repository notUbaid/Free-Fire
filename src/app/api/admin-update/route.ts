import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password, id, data } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const allowedFields = [
      "team_name", "leader_name", "leader_email", "leader_phone", "leader_school",
      "player2_name", "player2_phone", "player2_school",
      "player3_name", "player3_phone", "player3_school",
      "player4_name", "player4_phone", "player4_school",
    ];
    const sanitized: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in data) sanitized[key] = data[key];
    }

    const { error } = await supabase
      .from("registrations")
      .update(sanitized)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}