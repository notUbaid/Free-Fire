-- ============================================================
-- CSGC Free Fire Tournament Database Schema
-- ============================================================

-- Create registrations table (teams register here first)
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT UNIQUE NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT UNIQUE NOT NULL,
  leader_phone TEXT NOT NULL,
  leader_school TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  player2_phone TEXT NOT NULL,
  player2_school TEXT NOT NULL,
  player3_name TEXT NOT NULL,
  player3_phone TEXT NOT NULL,
  player3_school TEXT NOT NULL,
  player4_name TEXT,
  player4_phone TEXT,
  player4_school TEXT,
  approved BOOLEAN DEFAULT FALSE,  -- Must be approved to appear in scoreboard
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_scores table (only approved teams go here)
CREATE TABLE IF NOT EXISTS team_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT UNIQUE NOT NULL,
  kills INTEGER DEFAULT 0,
  placement_points INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  rounds_played INTEGER DEFAULT 0,
  eliminated BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_scores ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Public can register (insert new team)
CREATE POLICY "Allow anonymous registration" ON registrations
  FOR INSERT TO anon WITH CHECK (true);

-- Public can check for duplicates (team name + email)
CREATE POLICY "Allow read for duplicate check" ON registrations
  FOR SELECT TO anon USING (true);

-- Public can view scoreboard
CREATE POLICY "Allow public read on scores" ON team_scores
  FOR SELECT TO anon USING (true);

-- Admin-only operations (managed via API routes with password)
-- These policies allow the service role to manage data

-- ============================================================
-- NOTES FOR ADMIN
-- ============================================================
-- 1. New registrations appear in /admin as "Pending"
-- 2. Click "Approve" to add team to scoreboard
-- 3. Approved teams appear in /scoremanager for score management
-- 4. Only teams in team_scores show on /score public page
-- ============================================================