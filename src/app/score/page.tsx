"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { RefreshCw, ArrowLeft, Skull, ChevronUp } from "lucide-react";
import Link from "next/link";
import type { TeamScore } from "@/lib/supabase";

export default function ScoreboardPage() {
  const [teams, setTeams] = useState<(TeamScore & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showEliminated, setShowEliminated] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams?v=" + Date.now());
      if (!res.ok) throw new Error("Failed to fetch");
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
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sort teams: active first by points (desc), then eliminated
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return b.total_points - a.total_points;
  });

  // Assign ranks separately for active and eliminated
  let activeRank = 0;
  let eliminatedRank = 0;
  const rankedTeams = sortedTeams.map(t => {
    if (!t.eliminated) {
      activeRank++;
      return { ...t, rank: activeRank };
    } else {
      eliminatedRank++;
      return { ...t, rank: eliminatedRank, isEliminated: true };
    }
  });

  const activeTeams = rankedTeams.filter((t) => !t.eliminated);
  const eliminatedTeams = rankedTeams.filter((t) => t.eliminated);

  return (
    <div className="min-h-screen bg-[#06060a] selection:bg-ff-orange/30">
      {/* ── Top bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#06060a]/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-xs tracking-wide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-white/15 text-[10px] font-mono">
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchScores}
              className="text-white/25 hover:text-white/50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero header ────────────────────────────── */}
      <div className="relative pt-10 pb-8 sm:pt-14 sm:pb-10">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-ff-orange/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-1.5 mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            <span className="text-red-400/80 text-[10px] font-semibold uppercase tracking-[0.2em]">
              Live
            </span>
          </div>

          {/* Logos + title */}
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <Image
              src="/images/csgc-logo.png"
              alt="CSGC"
              width={32}
              height={32}
              className="rounded-full opacity-80"
            />
            <span className="text-white/15 text-sm font-light">×</span>
            <Image
              src="/images/FFMIC.png"
              alt="FFMIC"
              width={32}
              height={32}
              className="rounded-full opacity-80"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white/90">
            Scoreboard
          </h1>
          <p className="text-white/20 text-[11px] font-mono mt-1.5 tracking-widest">
            FREE FIRE MAX — 18 APR 2026
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-7">
            <div className="text-center">
              <p className="text-2xl font-black text-white/80 tabular-nums">{teams.length}</p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.15em] mt-0.5">Teams</p>
            </div>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="text-center">
              <p className="text-2xl font-black text-green-400/80 tabular-nums">{activeTeams.length}</p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.15em] mt-0.5">Alive</p>
            </div>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="text-center">
              <p className="text-2xl font-black text-red-400/60 tabular-nums">{eliminatedTeams.length}</p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.15em] mt-0.5">Out</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        {loading && teams.length === 0 ? (
          <div className="text-center py-24">
            <RefreshCw className="w-5 h-5 text-white/20 animate-spin mx-auto mb-3" />
            <p className="text-white/20 text-sm">Loading scores...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/20 text-sm">No teams registered yet</p>
          </div>
        ) : (
          <>
            {/* ── Table ───────────────────────────── */}
            <div className="rounded-xl border border-white/[0.04] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-white/[0.02] text-[10px] text-white/20 uppercase tracking-[0.15em] font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-5 sm:col-span-4">Team</div>
                <div className="col-span-2 text-right sm:text-center">Kills</div>
                <div className="hidden sm:block col-span-2 text-center">Place</div>
                <div className="col-span-2 text-right sm:text-center">Pts</div>
                <div className="col-span-2 sm:col-span-1 text-right">Rnd</div>
              </div>

              {/* Rows */}
              <div>
                <AnimatePresence>
                  {activeTeams.map((team, i) => {
                    const isTop3 = (team.rank || 0) <= 3;
                    return (
                      <motion.div
                        key={team.id || team.team_name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        className={`grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-t border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                          isTop3 ? "bg-white/[0.01]" : ""
                        }`}
                      >
                        {/* Rank */}
                        <div className="col-span-1">
                          <span
                            className={`text-sm font-bold tabular-nums ${
                              team.rank === 1
                                ? "text-amber-400"
                                : team.rank === 2
                                ? "text-white/40"
                                : team.rank === 3
                                ? "text-amber-600/70"
                                : "text-white/15"
                            }`}
                          >
                            {team.rank}
                          </span>
                        </div>

                        {/* Name */}
                        <div className="col-span-5 sm:col-span-4 min-w-0">
                          <p className={`font-semibold text-[13px] truncate ${isTop3 ? "text-white/90" : "text-white/60"}`}>
                            {team.team_name}
                          </p>
                        </div>

                        {/* Kills */}
                        <div className="col-span-2 text-right sm:text-center">
                          <span className="text-white/50 text-sm font-mono tabular-nums">
                            {team.kills}
                          </span>
                        </div>

                        {/* Placement */}
                        <div className="hidden sm:block col-span-2 text-center">
                          <span className="text-white/35 text-sm font-mono tabular-nums">
                            {team.placement_points}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-right sm:text-center">
                          <span className={`text-sm font-bold tabular-nums ${isTop3 ? "text-ff-orange" : "text-white/50"}`}>
                            {team.total_points}
                          </span>
                        </div>

                        {/* Rounds */}
                        <div className="col-span-2 sm:col-span-1 text-right">
                          <span className="text-white/20 text-xs font-mono tabular-nums">
                            {team.rounds_played}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Eliminated ─────────────────────── */}
            {eliminatedTeams.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowEliminated(!showEliminated)}
                  className="flex items-center gap-2 text-white/20 hover:text-white/35 transition-colors text-xs uppercase tracking-widest font-medium mb-3"
                >
                  <Skull className="w-3.5 h-3.5" />
                  Eliminated ({eliminatedTeams.length})
                  <ChevronUp
                    className={`w-3 h-3 transition-transform ${showEliminated ? "" : "rotate-180"}`}
                  />
                </button>

                <AnimatePresence>
                  {showEliminated && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl border border-red-500/[0.06]"
                    >
                      {eliminatedTeams.map((team) => (
                        <div
                          key={team.id || team.team_name}
                          className="flex items-center justify-between px-4 py-2 border-t first:border-t-0 border-red-500/[0.04] bg-red-500/[0.02]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-white/20 text-[10px] font-mono">#{team.rank}</span>
                            <span className="text-white/20 text-[13px] line-through decoration-red-500/20">
                              {team.team_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-white/15 text-[11px] font-mono">
                            <span>{team.kills}k</span>
                            <span>{team.total_points}pts</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <div className="border-t border-white/[0.03] py-6 text-center">
        <p className="text-white/10 text-[10px] font-mono tracking-widest">
          CSGC × FFMIC — Auto-refresh 30s
        </p>
      </div>
    </div>
  );
}
