-- Clean up existing policies and tables (run first if you have issues)
DROP POLICY IF EXISTS "Allow anonymous registration" ON registrations;
DROP POLICY IF EXISTS "Allow read for duplicate check" ON registrations;
DROP POLICY IF EXISTS "Allow public read on scores" ON team_scores;
DROP POLICY IF EXISTS "Allow score creation" ON team_scores;
DROP POLICY IF EXISTS "Allow score update" ON team_scores;

-- Drop existing tables if fresh start
-- DROP TABLE IF EXISTS registrations CASCADE;
-- DROP TABLE IF EXISTS team_scores CASCADE;

-- ===== REGISTRATIONS TABLE =====
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
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  registered_at TIMESTAMPTZ
);

-- ===== TEAM SCORES TABLE =====
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

-- ===== RLS =====
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_scores ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow registration" ON registrations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow duplicate check" ON registrations FOR SELECT TO anon USING (true);
CREATE POLICY "Allow score read" ON team_scores FOR SELECT TO anon USING (true);
CREATE POLICY "Allow score insert" ON team_scores FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow score update" ON team_scores FOR UPDATE TO anon USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_approved ON registrations(approved);
CREATE INDEX IF NOT EXISTS idx_team_scores_points ON team_scores(total_points DESC);