import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password, id, approved } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Get registration details
    const { data: reg } = await supabase
      .from("registrations")
      .select("team_name")
      .eq("id", id)
      .single();

    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (approved) {
      // Add to team_scores if not exists
      const { data: existing } = await supabase
        .from("team_scores")
        .select("id")
        .eq("team_name", reg.team_name)
        .single();

      if (!existing) {
        await supabase.from("team_scores").insert([{
          team_name: reg.team_name,
          kills: 0,
          placement_points: 0,
          total_points: 0,
          rounds_played: 0,
          eliminated: false,
        }]);
      }
    } else {
      // Remove from team_scores
      await supabase
        .from("team_scores")
        .delete()
        .eq("team_name", reg.team_name);
    }

    // Update approved status
    await supabase
      .from("registrations")
      .update({ approved })
      .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}