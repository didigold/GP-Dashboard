'use client';

import { useState } from 'react';
import { Header } from '../../components/navigation/Header';
import { MOCK_STANDINGS } from '../../lib/data/mock-race-data';
import { Trophy, Users, Wrench, ChevronUp, ChevronDown } from 'lucide-react';

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<'riders' | 'teams' | 'constructors'>('riders');

  const constructorStandings = [
    { pos: 1, name: 'Ducati', points: 722, wins: 19, podiums: 53, color: '#CC0000' },
    { pos: 2, name: 'KTM', points: 327, wins: 0, podiums: 16, color: '#F97316' },
    { pos: 3, name: 'Aprilia', points: 302, wins: 1, podiums: 11, color: '#22C55E' },
    { pos: 4, name: 'Yamaha', points: 124, wins: 0, podiums: 0, color: '#2563EB' },
    { pos: 5, name: 'Honda', points: 75, wins: 0, podiums: 0, color: '#EF4444' },
  ];

  const teamStandings = [
    { pos: 1, name: 'Ducati Lenovo Team', points: 884, wins: 16, color: '#CC0000' },
    { pos: 2, name: 'Prima Pramac Racing', points: 658, wins: 8, color: '#9333EA' },
    { pos: 3, name: 'Gresini Racing MotoGP', points: 538, wins: 3, color: '#38BDF8' },
    { pos: 4, name: 'Aprilia Racing', points: 353, wins: 1, color: '#22C55E' },
    { pos: 5, name: 'Red Bull KTM Factory Racing', points: 332, wins: 0, color: '#F97316' },
    { pos: 6, name: 'Red Bull GASGAS Tech3', points: 242, wins: 0, color: '#EF4444' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="MotoGP™ World Championship Standings" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-racing-purple">
              <Trophy className="w-4 h-4" />
              <span>OFFICIAL CLASSIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Championship Standings
            </h1>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-racing-dark rounded-xl border border-racing-border">
            <button
              onClick={() => setActiveTab('riders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'riders'
                  ? 'bg-racing-cyan text-black font-extrabold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>RIDERS</span>
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'teams'
                  ? 'bg-racing-cyan text-black font-extrabold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>TEAMS</span>
            </button>
            <button
              onClick={() => setActiveTab('constructors')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'constructors'
                  ? 'bg-racing-cyan text-black font-extrabold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>CONSTRUCTORS</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Riders Standings */}
        {activeTab === 'riders' && (
          <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-racing-border bg-racing-dark/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-16 text-center">POS</th>
                  <th className="py-3.5 px-4">RIDER</th>
                  <th className="py-3.5 px-4">TEAM</th>
                  <th className="py-3.5 px-4">BIKE</th>
                  <th className="py-3.5 px-4 text-right">POINTS</th>
                  <th className="py-3.5 px-4 text-right">GAP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
                {MOCK_STANDINGS.map((item) => {
                  const isLeader = item.position === 1;
                  const gapToLeader = isLeader ? '-' : `-${MOCK_STANDINGS[0].points - item.points}`;

                  return (
                    <tr key={item.rider.id} className="hover:bg-racing-cardHover transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold">
                        <span
                          className={`inline-block w-6 h-6 rounded-md text-center leading-6 ${
                            isLeader
                              ? 'bg-racing-cyan text-black font-extrabold shadow-glow-cyan'
                              : item.position <= 3
                              ? 'bg-racing-purple/30 text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.position}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-sans font-bold text-white text-sm">
                        <span className="text-slate-400 mr-2 font-mono text-xs">#{item.rider.number}</span>
                        {item.rider.full_name}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-sans">
                        {item.team.name}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {item.constructor.name}
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-base text-white">
                        {item.points}
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-400">
                        {gapToLeader}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Teams Standings */}
        {activeTab === 'teams' && (
          <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-racing-border bg-racing-dark/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-16 text-center">POS</th>
                  <th className="py-3.5 px-4">TEAM</th>
                  <th className="py-3.5 px-4 text-center">GP WINS</th>
                  <th className="py-3.5 px-4 text-right">POINTS</th>
                  <th className="py-3.5 px-4 text-right">GAP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
                {teamStandings.map((t) => (
                  <tr key={t.name} className="hover:bg-racing-cardHover transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className="inline-block w-6 h-6 rounded-md bg-racing-card text-white text-center leading-6">
                        {t.pos}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-2 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-racing-cyan">
                      {t.wins}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-base text-white">
                      {t.points}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {t.pos === 1 ? '-' : `-${teamStandings[0].points - t.points}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Constructor Standings */}
        {activeTab === 'constructors' && (
          <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-racing-border bg-racing-dark/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-16 text-center">POS</th>
                  <th className="py-3.5 px-4">CONSTRUCTOR</th>
                  <th className="py-3.5 px-4 text-center">WINS</th>
                  <th className="py-3.5 px-4 text-center">PODIUMS</th>
                  <th className="py-3.5 px-4 text-right">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
                {constructorStandings.map((c) => (
                  <tr key={c.name} className="hover:bg-racing-cardHover transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className="inline-block w-6 h-6 rounded-md bg-racing-card text-white text-center leading-6">
                        {c.pos}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-white text-base flex items-center gap-2.5">
                      <span className="w-2.5 h-5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-racing-cyan text-sm">
                      {c.wins}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-300 font-bold">
                      {c.podiums}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-lg text-white">
                      {c.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
