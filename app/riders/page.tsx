'use client';

import { Header } from '../../components/navigation/Header';
import { RIDERS_DATA } from '../../lib/data/mock-race-data';
import { Users, Trophy, Flag, Award, Flame } from 'lucide-react';

export default function RidersPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="MotoGP™ Premier Class Riders & Grid" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-racing-cyan">
            <Users className="w-4 h-4" />
            <span>OFFICIAL GRID</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            MotoGP Riders & Teams
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive rider profiles, career milestones, and manufacturer alliances.
          </p>
        </div>

        {/* Riders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RIDERS_DATA.map((rider) => (
            <div
              key={rider.id}
              className="glass-card rounded-2xl border border-racing-border overflow-hidden p-5 flex flex-col justify-between hover:border-racing-cyan/40 transition-all group"
            >
              <div className="space-y-3">
                {/* Rider Top Row: Number & Flag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-7 rounded-full"
                      style={{ backgroundColor: rider.color || '#FF2A54' }}
                    />
                    <span className="font-mono font-extrabold text-2xl text-white">
                      #{rider.number}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-racing-dark text-slate-300 border border-racing-border">
                    {rider.country.name}
                  </span>
                </div>

                {/* Name & Nickname */}
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-racing-cyan transition-colors">
                    {rider.full_name}
                  </h3>
                  {rider.nickname && (
                    <p className="text-xs text-racing-purple font-mono italic">
                      "{rider.nickname}"
                    </p>
                  )}
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {rider.team_name}
                  </p>
                </div>
              </div>

              {/* Career Milestone Counters */}
              <div className="mt-5 pt-4 border-t border-racing-border/50 grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2 rounded-xl bg-racing-dark/80 border border-racing-border">
                  <div className="text-[10px] text-slate-500">TITLES</div>
                  <div className="text-sm font-extrabold text-racing-yellow">
                    {rider.stats?.world_championships || 0}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-racing-dark/80 border border-racing-border">
                  <div className="text-[10px] text-slate-500">WINS</div>
                  <div className="text-sm font-extrabold text-white">
                    {rider.stats?.victories || 0}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-racing-dark/80 border border-racing-border">
                  <div className="text-[10px] text-slate-500">PODIUMS</div>
                  <div className="text-sm font-extrabold text-racing-cyan">
                    {rider.stats?.podiums || 0}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-racing-dark/80 border border-racing-border">
                  <div className="text-[10px] text-slate-500">POLES</div>
                  <div className="text-sm font-extrabold text-slate-300">
                    {rider.stats?.poles || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
