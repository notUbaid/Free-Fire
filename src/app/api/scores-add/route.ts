import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password, teamName } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Check if already in team_scores
    const { data: existing } = await supabase
      .from("team_scores")
      .select("id")
      .eq("team_name", teamName)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Team already in scoreboard" }, { status: 400 });
    }

    // Add to team_scores
    const { data, error } = await supabase
      .from("team_scores")
      .insert([{
        team_name: teamName,
        kills: 0,
        placement_points: 0,
        total_points: 0,
        rounds_played: 0,
        eliminated: false,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ team: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}