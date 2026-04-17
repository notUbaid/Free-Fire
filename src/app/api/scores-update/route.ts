import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@CSGC#";

export async function POST(request: NextRequest) {
  try {
    const { password, id, field, value } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const allowedFields = ["kills", "placement_points", "rounds_played", "eliminated"];
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    const updateData: Record<string, any> = { [field]: value, updated_at: new Date().toISOString() };

    // Auto-calculate total_points when kills or placement changes
    if (field === "kills" || field === "placement_points") {
      const { data: team } = await supabase.from("team_scores").select("kills, placement_points").eq("id", id).maybeSingle();
      const newKills = field === "kills" ? value : (team?.kills || 0);
      const newPlacement = field === "placement_points" ? value : (team?.placement_points || 0);
      updateData.total_points = newKills + newPlacement;
    }

    const { error } = await supabase
      .from("team_scores")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}