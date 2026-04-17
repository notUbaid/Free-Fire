import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendConfirmationEmail(email: string, teamName: string, leaderName: string) {
  const safeLeaderName = escapeHtml(leaderName);
  const safeTeamName = escapeHtml(teamName);
  
  console.log("Attempting to send email to:", email);
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_USER:", process.env.SMTP_USER ? "set" : "NOT SET");
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "set" : "NOT SET");
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050508;">
        <div style="background: linear-gradient(135deg, #ff6a00, #ff1744); padding: 30px; border-radius: 16px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎮 You're In!</h1>
        </div>
        <div style="background: #1a1a2e; padding: 30px; border-radius: 0 0 16px 16px;">
          <p style="color: #ededed; font-size: 18px;">Hi ${safeLeaderName},</p>
          <p style="color: #a0a0a0; font-size: 16px;">Your team <strong style="color: #ff6a00;">${safeTeamName}</strong> has been registered successfully!</p>
          
          <div style="background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #ff6a00; margin: 0 0 10px 0;">📋 Event Details</h3>
            <p style="color: #ededed; margin: 5px 0;"><strong>Date:</strong> Saturday, 18 April 2026</p>
            <p style="color: #ededed; margin: 5px 0;"><strong>Check-in:</strong> 9:15 AM</p>
            <p style="color: #ededed; margin: 5px 0;"><strong>Venue:</strong> IAR Main Campus, A3 Building</p>
          </div>
          
          <p style="color: #a0a0a0; font-size: 14px;">⚠️ Important: Arrive by 9:15 AM for check-in. Bring valid ID proof.</p>
          <p style="color: #a0a0a0; font-size: 14px;">📍 <a href="https://maps.app.goo.gl/9ZbJN5PvMv2CzBLA8" style="color: #ff6a00;">Open in Maps</a></p>
        </div>
        <div style="text-align: center; padding: 20px;">
          <p style="color: #505050; font-size: 12px;">Made with 🔥 by CSGC | Computer Science & Gaming Club, IAR</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"CSGC Tournament" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🎮 Registration Confirmed - CSGC x FFMIC Free Fire MAX Tournament",
      html: htmlContent,
    });

    console.log("Email sent successfully to", email);
    return "sent";
  } catch (err: any) {
    console.error("EMAIL_ERROR:", err?.message || err);
    return "failed: " + (err?.message || err);
  }
}

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

    // Check current registration count
    const { count } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    const isWaitlist = count !== null && count >= 36;

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
          approved: false,
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

    // Send confirmation email
    sendConfirmationEmail(leader_email, team_name, leader_name);

    // Registration complete
    return NextResponse.json(
      {
        message: isWaitlist 
          ? "You've been added to the waitlist. We'll notify you if a spot opens up!" 
          : "Registration successful!",
        team: data,
        waitlist: isWaitlist,
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