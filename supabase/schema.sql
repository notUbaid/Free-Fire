-- Create registrations table
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_scores table
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

-- Allow anonymous inserts for registration
CREATE POLICY "Allow anonymous registration" ON registrations
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous reads on team_scores (scoreboard is public)
CREATE POLICY "Allow public read on scores" ON team_scores
  FOR SELECT TO anon USING (true);

-- Allow anonymous insert on team_scores (created on registration)
CREATE POLICY "Allow score creation" ON team_scores
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous reads on registrations for duplicate checks
CREATE POLICY "Allow read for duplicate check" ON registrations
  FOR SELECT TO anon USING (true);
