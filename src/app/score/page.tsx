"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Skull,
  Target,
  Medal,
  RefreshCw,
  ArrowLeft,
  Crown,
  Swords,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type { TeamScore } from "@/lib/supabase";

const rankStyles: Record<number, { bg: string; border: string; icon: React.ReactNode; glow: string }> = {
  1: {
    bg: "from-yellow-500/30 to-amber-600/10",
    border: "border-yellow-500/60",
    icon: <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />,
    glow: "shadow-yellow-500/30",
  },
  2: {
    bg: "from-gray-300/30 to-gray-400/10",
    border: "border-gray-400/60",
    icon: <Medal className="w-8 h-8 text-gray-300 drop-shadow-lg" />,
    glow: "shadow-gray-400/30",
  },
  3: {
    bg: "from-amber-700/30 to-orange-800/10",
    border: "border-amber-700/60",
    icon: <Medal className="w-8 h-8 text-amber-600 drop-shadow-lg" />,
    glow: "shadow-amber-600/30",
  },
};

export default function ScoreboardPage() {
  const [teams, setTeams] = useState<(TeamScore & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams?v=" + Date.now());
      const data = await res.json();
      setTeams(data.teams || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch scores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const activeTeams = teams.filter((t) => !t.eliminated);
  const eliminatedTeams = teams.filter((t) => t.eliminated);

  return (
    <div className="min-h-screen bg-ff-darker">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ff-orange/20 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        {/* Animated glow */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ff-orange/20 rounded-full blur-[120px]" 
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/50 hover:text-ff-orange transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main
            </Link>
            <button
              onClick={fetchScores}
              className="flex items-center gap-2 text-white/50 hover:text-ff-orange transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="text-center">
            {/* Live indicator */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-ff-red/20 border border-ff-red/30 px-3 py-1 rounded-full mb-4"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-ff-red rounded-full"
              />
              <span className="text-ff-red text-xs font-bold uppercase tracking-wider">Live</span>
            </motion.div>

            <div className="flex items-center justify-center gap-3 mb-3">
              <Image
                src="/images/csgc-logo.png"
                alt="CSGC"
                width={40}
                height={40}
                className="rounded-full border-2 border-ff-orange/40 shadow-lg shadow-ff-orange/20"
              />
              <span className="text-ff-orange text-xl font-bold">×</span>
              <Image
                src="/images/FFMIC.png"
                alt="FFMIC"
                width={40}
                height={40}
                className="rounded-full border-2 border-ff-maroon/40 shadow-lg"
              />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              <span className="bg-gradient-to-r from-ff-orange via-ff-yellow to-ff-red bg-clip-text text-transparent">
                Live Scoreboard
              </span>
            </h1>
            <p className="text-white/30 text-xs sm:text-sm mt-2 font-mono">
              Free Fire MAX Tournament — April 18, 2026
            </p>
            {lastUpdated && (
              <p className="text-white/20 text-[10px] mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
            <div className="text-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3"
              >
                <p className="text-3xl sm:text-4xl font-black text-ff-orange drop-shadow-lg">
                  {teams.length}
                </p>
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Teams
                </p>
              </motion.div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-ff-orange/30 to-transparent" />
            <div className="text-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-3"
              >
                <p className="text-3xl sm:text-4xl font-black text-green-400 drop-shadow-lg">
                  {activeTeams.length}
                </p>
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Alive
                </p>
              </motion.div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-ff-red/30 to-transparent" />
            <div className="text-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-ff-red/10 border border-ff-red/20 rounded-2xl px-6 py-3"
              >
                <p className="text-3xl sm:text-4xl font-black text-ff-red drop-shadow-lg">
                  {eliminatedTeams.length}
                </p>
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  KO
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {loading && teams.length === 0 ? (
          <div className="text-center py-20">
            <RefreshCw className="w-8 h-8 text-ff-orange animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Loading scores...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20">
            <Swords className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg font-bold">No teams registered yet</p>
            <p className="text-white/20 text-sm mt-1">Scores will appear here once the tournament begins</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium (on desktop) */}
            {activeTeams.length >= 3 && (
              <div className="hidden lg:flex items-end justify-center gap-6 mb-16 mt-8">
                {[1, 0, 2].map((podiumIndex) => {
                  const team = activeTeams[podiumIndex];
                  if (!team) return null;
                  const rank = podiumIndex === 0 ? 2 : podiumIndex === 1 ? 1 : 3;
                  const heights = { 1: "h-48", 2: "h-36", 3: "h-28" };
                  const podiumColors = {
                    1: "from-yellow-500/40 to-amber-600/20 border-yellow-500",
                    2: "from-gray-300/40 to-gray-400/20 border-gray-400",
                    3: "from-amber-700/40 to-orange-800/20 border-amber-700",
                  };

                  return (
                    <motion.div
                      key={team.team_name}
                      initial={{ opacity: 0, y: 80, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: podiumIndex * 0.2, duration: 0.6, type: "spring" }}
                      className="text-center w-56"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                      >
                        {/* Glow effect */}
                        <div className={`absolute -inset-2 bg-gradient-to-t ${podiumColors[rank as 1|2|3].split(' ')[0]} rounded-2xl blur-xl opacity-50`} />
                        <div className="relative bg-black/40 backdrop-blur-sm border-t-2 border-white/20 rounded-2xl p-4">
                          <div className="mb-2">
                            {rankStyles[rank]?.icon}
                          </div>
                          <p className="text-white font-bold text-sm truncate px-2">
                            {team.team_name}
                          </p>
                          <p className="text-4xl font-black text-transparent bg-gradient-to-r from-ff-orange to-ff-yellow bg-clip-text">
                            {team.total_points}
                          </p>
                          <p className="text-white/30 text-[10px] uppercase tracking-widest">
                            Points
                          </p>
                        </div>
                      </motion.div>
                      <div
                        className={`${heights[rank as 1 | 2 | 3]} mt-2 bg-gradient-to-t ${podiumColors[rank as 1|2|3]} border-t-4 rounded-t-xl flex items-center justify-center`}
                      >
                        <span className="text-5xl font-black text-white/20">
                          {rank}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Active Teams Table */}
            <div className="mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Active Teams
              </h2>

              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Team</div>
                <div className="col-span-2 text-center">Kills</div>
                <div className="col-span-2 text-center">Placement</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-center">Rounds</div>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {activeTeams.map((team, i) => {
                    const style = rankStyles[team.rank || i + 1];
                    return (
                      <motion.div
                        key={team.team_name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl border transition-colors ${
                          style
                            ? `bg-gradient-to-r ${style.bg} ${style.border}`
                            : "bg-white/[0.03] border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="col-span-2 sm:col-span-1">
                          <span
                            className={`text-lg font-black ${
                              (team.rank || 0) <= 3
                                ? "text-ff-orange"
                                : "text-white/30"
                            }`}
                          >
                            {team.rank}
                          </span>
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                          <p className="text-white font-bold text-sm truncate">
                            {team.team_name}
                          </p>
                        </div>
                        <div className="col-span-4 sm:col-span-2 flex items-center justify-end sm:justify-center gap-1">
                          <Skull className="w-3 h-3 text-ff-red/60 sm:hidden" />
                          <span className="text-white/80 text-sm font-mono">
                            {team.kills}
                          </span>
                        </div>
                        <div className="hidden sm:flex col-span-2 items-center justify-center">
                          <span className="text-white/80 text-sm font-mono">
                            {team.placement_points}
                          </span>
                        </div>
                        <div className="hidden sm:flex col-span-2 items-center justify-center">
                          <span className="text-ff-orange font-bold text-base">
                            {team.total_points}
                          </span>
                        </div>
                        <div className="hidden sm:flex col-span-1 items-center justify-center">
                          <span className="text-white/40 text-sm font-mono">
                            {team.rounds_played}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Eliminated Teams */}
            {eliminatedTeams.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white/50 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-ff-red/60" />
                  Eliminated
                </h2>
                <div className="space-y-2">
                  {eliminatedTeams.map((team, i) => (
                    <motion.div
                      key={team.team_name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-4 py-3 bg-ff-red/5 border border-ff-red/10 rounded-xl opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-ff-red/40" />
                        <span className="text-white/40 text-sm line-through">
                          {team.team_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-white/30 text-xs font-mono">
                        <span>{team.kills} kills</span>
                        <span>{team.total_points} pts</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ff-orange/5 via-transparent to-ff-red/5" />
        <div className="relative">
          <p className="text-white/40 text-sm font-medium">
            CSGC × FFMIC — Free Fire MAX Tournament
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-white/20 text-[10px]">Auto-refresh</span>
            <span className="w-1 h-1 bg-ff-orange/50 rounded-full" />
            <span className="text-white/20 text-[10px]">30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
