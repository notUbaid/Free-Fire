import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      team_name,
      leader_name,
      leader_email,
      leader_phone,
      leader_school,
      player2_name,
      player2_phone,
      player2_school,
      player3_name,
      player3_phone,
      player3_school,
      player4_name,
      player4_phone,
      player4_school,
    } = body;

    // Validate required fields
    if (
      !team_name ||
      !leader_name ||
      !leader_email ||
      !leader_phone ||
      !leader_school ||
      !player2_name ||
      !player2_phone ||
      !player2_school ||
      !player3_name ||
      !player3_phone ||
      !player3_school
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check for duplicate team name
    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("team_name", team_name)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A team with this name already exists. Choose a different name." },
        { status: 409 }
      );
    }

    // Check for duplicate email
    const { data: existingEmail } = await supabase
      .from("registrations")
      .select("id")
      .eq("leader_email", leader_email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: "This email has already been used for registration." },
        { status: 409 }
      );
    }

    // Insert registration
    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          team_name,
          leader_name,
          leader_email,
          leader_phone,
          leader_school,
          player2_name,
          player2_phone,
          player2_school,
          player3_name,
          player3_phone,
          player3_school,
          player4_name: player4_name || null,
          player4_phone: player4_phone || null,
          player4_school: player4_school || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Registration failed. Please try again." },
        { status: 500 }
      );
    }

    // Also insert into scoreboard with default values
    await supabase.from("team_scores").insert([
      {
        team_name,
        kills: 0,
        placement_points: 0,
        total_points: 0,
        rounds_played: 0,
        eliminated: false,
      },
    ]);

    return NextResponse.json(
      {
        message: "Registration successful!",
        team: data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
