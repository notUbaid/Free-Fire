import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export type Registration = {
  id?: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_school: string;
  player2_name: string;
  player2_phone: string;
  player2_school: string;
  player3_name: string;
  player3_phone: string;
  player3_school: string;
  player4_name?: string;
  player4_phone?: string;
  player4_school?: string;
  approved?: boolean;
  created_at?: string;
};

export type TeamScore = {
  id?: string;
  team_name: string;
  kills: number;
  placement_points: number;
  total_points: number;
  rounds_played: number;
  eliminated: boolean;
  rank?: number;
};
