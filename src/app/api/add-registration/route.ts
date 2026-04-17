import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { password, team_name, leader_name, leader_email, leader_phone, leader_school, player2_name, player2_phone, player2_school, player3_name, player3_phone, player3_school, player4_name, player4_phone, player4_school } = await request.json();

    if (password !== "Admin@CSGC#") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { error } = await supabase.from("registrations").insert([{
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
      approved: false,
    }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Registration added" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}