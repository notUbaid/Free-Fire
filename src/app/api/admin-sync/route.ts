import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Get all approved registrations
    const { data: approvedRegs } = await supabase
      .from("registrations")
      .select("team_name")
      .eq("approved", true);

    // Get all existing team_scores
    const { data: existingScores } = await supabase
      .from("team_scores")
      .select("team_name");

    const existingTeamNames = new Set(existingScores?.map(t => t.team_name) || []);
    const approvedTeamNames = new Set(approvedRegs?.map(r => r.team_name) || []);

    // Find teams that are approved but not in team_scores
    const teamsToAdd = approvedTeamNames.filter(name => !existingTeamNames.has(name));

    if (teamsToAdd.length > 0) {
      const insertData = teamsToAdd.map(team_name => ({
        team_name,
        kills: 0,
        placement_points: 0,
        total_points: 0,
        rounds_played: 0,
        eliminated: false,
      }));

      await supabase.from("team_scores").insert(insertData);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${teamsToAdd.length} teams to scoreboard`
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}