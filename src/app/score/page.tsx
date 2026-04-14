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

const rankStyles: Record<number, { bg: string; border: string; icon: React.ReactNode }> = {
  1: {
    bg: "from-yellow-500/20 to-amber-600/10",
    border: "border-yellow-500/50",
    icon: <Crown className="w-6 h-6 text-yellow-400" />,
  },
  2: {
    bg: "from-gray-300/20 to-gray-400/10",
    border: "border-gray-400/50",
    icon: <Medal className="w-6 h-6 text-gray-300" />,
  },
  3: {
    bg: "from-amber-700/20 to-orange-800/10",
    border: "border-amber-700/50",
    icon: <Medal className="w-6 h-6 text-amber-600" />,
  },
};

export default function ScoreboardPage() {
  const [teams, setTeams] = useState<(TeamScore & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams");
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
        <div className="absolute inset-0 bg-gradient-to-b from-ff-orange/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />

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
            <div className="flex items-center justify-center gap-3 mb-3">
              <Image
                src="/images/csgc-logo.png"
                alt="CSGC"
                width={36}
                height={36}
                className="rounded-full border border-ff-orange/30"
              />
              <span className="text-white/30 text-sm">×</span>
              <Image
                src="/images/iar-logo.png"
                alt="IAR"
                width={36}
                height={36}
                className="rounded-full border border-ff-maroon/30"
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
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-ff-orange">
                {teams.length}
              </p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">
                Total Teams
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-green-400">
                {activeTeams.length}
              </p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">
                Active
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-ff-red">
                {eliminatedTeams.length}
              </p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">
                Eliminated
              </p>
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
              <div className="hidden sm:flex items-end justify-center gap-4 mb-12 mt-8">
                {[1, 0, 2].map((podiumIndex) => {
                  const team = activeTeams[podiumIndex];
                  if (!team) return null;
                  const rank = podiumIndex === 0 ? 2 : podiumIndex === 1 ? 1 : 3;
                  const heights = { 1: "h-40", 2: "h-32", 3: "h-24" };

                  return (
                    <motion.div
                      key={team.team_name}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: podiumIndex * 0.2, duration: 0.6 }}
                      className="text-center w-48"
                    >
                      <div className="mb-3">
                        {rankStyles[rank]?.icon}
                        <p className="text-white font-bold text-sm mt-1 truncate">
                          {team.team_name}
                        </p>
                        <p className="text-ff-orange text-2xl font-black">
                          {team.total_points}
                        </p>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest">
                          Points
                        </p>
                      </div>
                      <div
                        className={`${heights[rank as 1 | 2 | 3]} bg-gradient-to-t ${
                          rankStyles[rank]?.bg
                        } border-t-2 ${
                          rankStyles[rank]?.border
                        } rounded-t-lg flex items-center justify-center`}
                      >
                        <span className="text-4xl font-black text-white/20">
                          #{rank}
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
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-white/20 text-xs">
          CSGC × IAR — Free Fire MAX Tournament Scoreboard
        </p>
        <p className="text-white/10 text-[10px] mt-1">
          Auto-refreshes every 30 seconds
        </p>
      </div>
    </div>
  );
}
