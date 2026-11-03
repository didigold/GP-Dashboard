'use client';

import React, { useState } from 'react';
import { ALL_GRID_HEAD_TO_HEAD, TeamHeadToHeadData, HeadToHeadSession } from '@/lib/data/head-to-head-data';
import { Download, ChevronRight, Gauge, Trophy, Sparkles, Filter } from 'lucide-react';

interface AllGridDuelsProps {
  onSelectTeamDuel?: (riderAId: string, riderBId: string) => void;
}

export function AllGridDuels({ onSelectTeamDuel }: AllGridDuelsProps) {
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Quali' | 'Sprint Quali'>('All');
  const [highlightLast, setHighlightLast] = useState<boolean>(true);
  const [activeTooltip, setActiveTooltip] = useState<{
    teamId: string;
    session: HeadToHeadSession;
    x: number;
    y: number;
  } | null>(null);

  // Filter sessions for a given team
  const getFilteredSessions = (team: TeamHeadToHeadData) => {
    if (sessionFilter === 'All') return team.sessions;
    return team.sessions.filter((s) => s.type === sessionFilter);
  };

  // Convert delta (-2.0s to +2.0s) into horizontal percentage (0% to 100%)
  const deltaToPercent = (delta: number) => {
    // 0s is at 50%
    // -2.0s is at 5%, +2.0s is at 95%
    const clamped = Math.max(-2.0, Math.min(2.0, delta));
    return 50 + (clamped / 2.0) * 45;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls Bar (Matching the user's reference image) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0F12] border border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
            <span>Teammate Qualifying Gaps</span>
            <span className="text-[11px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-300">
              2026 Season · 19 Rounds
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5">
            Each dot represents one qualifying session. Position shows gap to teammate.
          </p>
        </div>

        {/* Controls: Segmented Buttons + Highlight Last Switch + Export */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Segmented Filter Pills */}
          <div className="flex items-center p-1 rounded-full bg-[#141519] border border-white/[0.08]">
            {(['All', 'Quali', 'Sprint Quali'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSessionFilter(filter)}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                  sessionFilter === filter
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Highlight Last Quali Switch */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-neutral-300 select-none">
            <span>Highlight last quali</span>
            <button
              type="button"
              role="switch"
              aria-checked={highlightLast}
              onClick={() => setHighlightLast(!highlightLast)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                highlightLast ? 'bg-[#E10600]' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  highlightLast ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          {/* Download Icon Button */}
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ALL_GRID_HEAD_TO_HEAD, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', 'motogp-teammate-qualifying-gaps-2026.json');
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            title="Export Teammate Gap Dataset"
            className="p-2 rounded-full bg-[#141519] border border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#0E0F12] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
              Avg Grid Gap
            </div>
            <div className="text-xl font-bold font-sans text-white mt-1">0.264s</div>
          </div>
          <Gauge className="w-5 h-5 text-neutral-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#0E0F12] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
              Tightest Battle
            </div>
            <div className="text-xl font-bold font-sans text-emerald-400 mt-1">0.065s</div>
            <div className="text-[10px] text-neutral-400">Trackhouse (Ogura vs Raúl)</div>
          </div>
          <Trophy className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#0E0F12] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
              Widest Delta
            </div>
            <div className="text-xl font-bold font-sans text-amber-400 mt-1">0.562s</div>
            <div className="text-[10px] text-neutral-400">LCR Honda (Zarco vs Moreira)</div>
          </div>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#0E0F12] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
              Championship Rounds
            </div>
            <div className="text-xl font-bold font-sans text-white mt-1">19 Weekends</div>
            <div className="text-[10px] text-neutral-400">Lusail → Sepang Q2</div>
          </div>
          <Filter className="w-5 h-5 text-neutral-400" />
        </div>
      </div>

      {/* 11 Team Match-Up Cards (Exact layout from the uploaded image) */}
      <div className="space-y-4">
        {ALL_GRID_HEAD_TO_HEAD.map((team) => {
          const sessions = getFilteredSessions(team);
          const medianPct = deltaToPercent(team.medianQualiDelta);

          return (
            <div
              key={team.teamId}
              onClick={() => onSelectTeamDuel?.(team.riderA.id, team.riderB.id)}
              className="p-5 sm:p-6 rounded-2xl bg-[#0E0F12] border border-white/[0.08] hover:border-white/20 transition-all duration-300 group cursor-pointer relative overflow-visible shadow-lg"
            >
              {/* Card Top Row: Left Rider - Team Emblem - Right Rider */}
              <div className="flex items-center justify-between gap-4 mb-4">
                {/* Left Rider Box */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-[140px] sm:min-w-[180px]">
                  {/* Wins Count */}
                  <span className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                    {sessionFilter === 'Sprint Quali' ? team.sprintWinsA : team.qualiWinsA}
                  </span>

                  {/* Avg Delta Badge */}
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {team.avgQualiDelta.toFixed(3)}s
                  </span>

                  {/* Circular Avatar */}
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0">
                    <img
                      src={team.riderA.photoUrl}
                      alt={team.riderA.fullName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* 3-Letter Code / Name */}
                  <div className="hidden sm:block">
                    <div className="text-sm font-bold font-sans text-white group-hover:text-[#FF2A24] transition-colors">
                      {team.riderA.code}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-light truncate max-w-[100px]">
                      #{team.riderA.number} {team.riderA.fullName.split(' ').pop()}
                    </div>
                  </div>
                </div>

                {/* Center Team Emblem & Bike Info */}
                <div className="flex flex-col items-center justify-center text-center px-2">
                  <div className="h-7 sm:h-8 flex items-center justify-center">
                    {team.teamLogoUrl ? (
                      <img
                        src={team.teamLogoUrl}
                        alt={team.teamName}
                        className="max-h-7 sm:max-h-8 max-w-[120px] sm:max-w-[160px] object-contain filter brightness-95"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {team.teamShortName}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono mt-0.5 hidden md:block">
                    {team.bikeName}
                  </span>
                </div>

                {/* Right Rider Box */}
                <div className="flex items-center justify-end gap-3 sm:gap-4 min-w-[140px] sm:min-w-[180px] text-right">
                  {/* 3-Letter Code / Name */}
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-bold font-sans text-white group-hover:text-[#FF2A24] transition-colors">
                      {team.riderB.code}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-light truncate max-w-[100px]">
                      #{team.riderB.number} {team.riderB.fullName.split(' ').pop()}
                    </div>
                  </div>

                  {/* Circular Avatar */}
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900 shrink-0">
                    <img
                      src={team.riderB.photoUrl}
                      alt={team.riderB.fullName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Avg Delta Badge */}
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    +{(Math.abs(team.avgQualiDelta)).toFixed(3)}s
                  </span>

                  {/* Wins Count */}
                  <span className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                    {sessionFilter === 'Sprint Quali' ? team.sprintWinsB : team.qualiWinsB}
                  </span>
                </div>
              </div>

              {/* Card Bottom Row: Dot Plot Strip Chart (Matching the exact visual from the uploaded image) */}
              <div className="relative w-full pt-1 pb-4">
                {/* Dot Plot Track Bar */}
                <div
                  className="relative w-full h-10 sm:h-11 rounded-lg overflow-hidden flex items-center border border-white/[0.06]"
                  style={{
                    backgroundColor: '#12141C',
                  }}
                >
                  {/* Diagonal Hatch Pattern on Far Left Outlier Zone (< -1.5s) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[15%] opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 8px)',
                    }}
                  />

                  {/* Diagonal Hatch Pattern on Far Right Outlier Zone (> +1.5s) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-[15%] opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 8px)',
                    }}
                  />

                  {/* Center Line at 0.0s */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 z-10 -translate-x-1/2" />

                  {/* Vertical Median / Mean Indicator Line */}
                  <div
                    className="absolute top-0 bottom-0 w-[1.5px] z-10 transition-all duration-300"
                    style={{
                      left: `${medianPct}%`,
                      backgroundColor: team.teamColor || '#38BDF8',
                    }}
                    title={`Median Gap: ${team.medianQualiDelta.toFixed(3)}s`}
                  />

                  {/* Plotted Session Dots */}
                  {sessions.map((session, idx) => {
                    const xPercent = deltaToPercent(session.delta);
                    const isLatest = session.isLast;
                    const isHighlighted = highlightLast && isLatest;

                    return (
                      <div
                        key={`${team.teamId}-${session.round}-${session.type}-${idx}`}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-150"
                        style={{
                          left: `${xPercent}%`,
                          top: `calc(50% + ${session.jitter}px)`,
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setActiveTooltip({
                            teamId: team.teamId,
                            session,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            isHighlighted
                              ? 'w-3.5 h-3.5 bg-white ring-4 ring-white/40 shadow-lg animate-pulse'
                              : 'w-2.5 h-2.5 border border-white/30 hover:border-white'
                          }`}
                          style={{
                            backgroundColor: isHighlighted ? '#FFFFFF' : team.teamColor || '#38BDF8',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Scale Labels */}
                <div className="w-full flex justify-between text-[10px] text-neutral-400 font-mono mt-1.5 px-2 select-none">
                  <span>2.0s</span>
                  <span>1.5s</span>
                  <span>1.0s</span>
                  <span>0.5s</span>
                  <span className="text-neutral-300 font-semibold">0</span>
                  <span>0.5s</span>
                  <span>1.0s</span>
                  <span>1.5s</span>
                  <span>2.0s</span>
                </div>
              </div>

              {/* Card Footer Action: Drill-down prompt */}
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/[0.04]">
                <span className="font-sans font-light">
                  Click to inspect detailed sector splits &amp; lap telemetry
                </span>
                <span className="text-[#E10600] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Deep Duel Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Interactive Tooltip */}
      {activeTooltip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full p-2.5 rounded-xl bg-black/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl text-xs space-y-1 font-sans"
          style={{
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y}px`,
          }}
        >
          <div className="flex items-center justify-between gap-3 text-[11px] text-neutral-400 font-mono">
            <span>Round {activeTooltip.session.round} · {activeTooltip.session.circuitName}</span>
            <span className="text-white font-bold px-1.5 py-0.2 rounded bg-white/10">
              {activeTooltip.session.type}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5 text-xs font-semibold">
            <span>Gap:</span>
            <span
              className={`font-mono ${
                activeTooltip.session.delta <= 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {activeTooltip.session.delta > 0 ? `+${activeTooltip.session.delta.toFixed(3)}s` : `${activeTooltip.session.delta.toFixed(3)}s`}
            </span>
            <span className="text-neutral-400 font-light">
              ({activeTooltip.session.winner === 'A' ? 'Left rider faster' : 'Right rider faster'})
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {activeTooltip.session.riderATime} vs {activeTooltip.session.riderBTime}
          </div>
        </div>
      )}
    </div>
  );
}
