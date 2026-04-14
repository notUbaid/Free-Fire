import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password, id } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Approve (add to team_scores automatically)
    const { data: reg } = await supabase
      .from("registrations")
      .select("team_name")
      .eq("id", id)
      .single();

    if (reg) {
      // Add to team_scores
      await supabase.from("team_scores").insert([{
        team_name: reg.team_name,
        kills: 0,
        placement_points: 0,
        total_points: 0,
        rounds_played: 0,
        eliminated: false,
      }]);

      // Mark as approved
      await supabase
        .from("registrations")
        .update({ approved: true })
        .eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}