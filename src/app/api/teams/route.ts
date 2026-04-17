import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("team_scores")
      .select("*")
      .order("total_points", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch scores" },
        { status: 500 }
      );
    }

    // Add rank based on position
    const ranked = (data || []).map((team, index) => ({
      ...team,
      rank: index + 1,
    }));

    return NextResponse.json({ teams: ranked });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
