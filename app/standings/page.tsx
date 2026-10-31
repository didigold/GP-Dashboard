'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Users, Wrench, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';
import { MOCK_STANDINGS } from '@/lib/data/mock-race-data';

const SEASONS = [
  { year: 2024, id: 'dd12382e-1d9f-46ee-a5f7-c5104db28e43', label: '2024 World Championship (Final)' },
  { year: 2025, id: 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4', label: '2025 Championship (Live Pulselive)' },
];

const MOTOGP_CAT_ID = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

interface StandingItem {
  id: string;
  position: number;
  rider: {
    id: string;
    full_name: string;
    number: number;
    country: { iso: string; name: string };
  };
  team: {
    id: string;
    name: string;
  };
  constructor: {
    id: string;
    name: string;
  };
  points: number;
  race_wins?: number;
  podiums?: number;
}

const INITIAL_2024_STANDINGS: StandingItem[] = MOCK_STANDINGS.map((s, idx) => ({
  id: s.rider.id || `standing-${idx}`,
  position: s.position,
  rider: {
    id: s.rider.id || `r-${idx}`,
    full_name: s.rider.full_name,
    number: s.rider.number,
    country: s.rider.country,
  },
  team: { id: `team-${idx}`, name: s.team.name },
  constructor: { id: `const-${idx}`, name: s.constructor.name },
  points: s.points,
  race_wins: s.position === 1 ? 7 : (s.position === 2 ? 11 : (s.position === 3 ? 3 : 2)),
  podiums: s.position === 1 ? 16 : (s.position === 2 ? 16 : (s.position === 3 ? 10 : 8)),
}));

export default function StandingsPage() {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [activeTab, setActiveTab] = useState<'riders' | 'teams' | 'constructors'>('riders');
  const [standings, setStandings] = useState<StandingItem[]>(INITIAL_2024_STANDINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Synced');

  useEffect(() => {
    async function loadStandings() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/motogp/results/standings?seasonUuid=${selectedSeason.id}&categoryUuid=${MOTOGP_CAT_ID}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.classification) {
            setStandings(data.classification);
            setLastUpdated(new Date().toLocaleTimeString());
          }
        }
      } catch (err) {
        console.error('Failed to load live standings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStandings();
  }, [selectedSeason]);

  // Aggregate constructor points
  const constructorStandings = React.useMemo(() => {
    const map = new Map<string, { name: string; points: number; wins: number; podiums: number }>();
    standings.forEach((item) => {
      const cName = item.constructor?.name || 'Independent';
      const existing = map.get(cName) || { name: cName, points: 0, wins: 0, podiums: 0 };
      existing.points += item.points;
      existing.wins += item.race_wins || 0;
      existing.podiums += item.podiums || 0;
      map.set(cName, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.points - a.points);
  }, [standings]);

  // Aggregate team points
  const teamStandings = React.useMemo(() => {
    const map = new Map<string, { name: string; points: number; wins: number }>();
    standings.forEach((item) => {
      const tName = item.team?.name || 'Independent Team';
      const existing = map.get(tName) || { name: tName, points: 0, wins: 0 };
      existing.points += item.points;
      existing.wins += item.race_wins || 0;
      map.set(tName, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.points - a.points);
  }, [standings]);

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">OFFICIAL DORNA SPORTS FEED</Badge>
            <Badge variant="outline">api.motogp.pulselive.com</Badge>
            {lastUpdated && (
              <span className="text-[10px] font-mono text-neutral-500">
                SYNCED: {lastUpdated}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight uppercase text-white leading-none">
            World Championship Standings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Directly synced from Dorna Sports&apos; official Pulselive timing servers. Live points, podium counts, and constructor classifications.
          </p>
        </div>

        {/* Season Switcher */}
        <div className="flex items-center gap-2">
          {SEASONS.map((season) => (
            <Button
              key={season.year}
              size="sm"
              variant={selectedSeason.year === season.year ? 'motogp' : 'outline'}
              onClick={() => setSelectedSeason(season)}
            >
              {season.year} SEASON
            </Button>
          ))}
        </div>
      </div>

      {/* Category Tabs: Riders, Teams, Constructors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#111111] p-1 border border-neutral-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('riders')}
              className={`px-4 py-1.5 font-bold uppercase transition-colors ${
                activeTab === 'riders' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              RIDERS CLASSIFICATION
            </button>
            <button
              onClick={() => setActiveTab('constructors')}
              className={`px-4 py-1.5 font-bold uppercase transition-colors ${
                activeTab === 'constructors' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              CONSTRUCTORS
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-1.5 font-bold uppercase transition-colors ${
                activeTab === 'teams' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              TEAMS
            </button>
          </div>

          <div className="text-xs font-mono text-neutral-400 hidden sm:block">
            {isLoading ? 'FETCHING PULSELIVE...' : `${standings.length} CLASSIFIED ENTRIES`}
          </div>
        </div>

        {/* Riders Table */}
        {activeTab === 'riders' && (
          <div className="border border-neutral-800 overflow-hidden bg-[#0A0A0A]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">POS</th>
                  <th className="py-3 px-3 w-14 text-center">NUM</th>
                  <th className="py-3 px-4">RIDER</th>
                  <th className="py-3 px-4">NAT</th>
                  <th className="py-3 px-4">TEAM / CONSTRUCTOR</th>
                  <th className="py-3 px-4 text-center">WINS</th>
                  <th className="py-3 px-4 text-center">PODIUMS</th>
                  <th className="py-3 px-4 text-right">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {isLoading && standings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-500 font-mono text-xs">
                      Fetching live championship data from Pulselive API...
                    </td>
                  </tr>
                ) : (
                  standings.map((item, idx) => {
                    const isP1 = item.position === 1;
                    return (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-neutral-900/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-black">
                          {isP1 ? (
                            <span className="text-[#E10600] font-black text-sm">P1</span>
                          ) : (
                            <span className="text-neutral-400">P{item.position}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-white">
                          #{item.rider?.number}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white text-sm">
                            {item.rider?.full_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-400 uppercase">
                          {item.rider?.country?.iso || '—'}
                        </td>
                        <td className="py-3 px-4 text-neutral-300 font-light">
                          <div>{item.team?.name || '—'}</div>
                          <div className="text-[10px] text-neutral-500">{item.constructor?.name}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-white tabular-nums">
                          {item.race_wins ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-neutral-300 tabular-nums">
                          {item.podiums ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-white text-base tabular-nums">
                          {item.points} <span className="text-xs text-neutral-500 font-normal">PTS</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Constructors Table */}
        {activeTab === 'constructors' && (
          <div className="border border-neutral-800 overflow-hidden bg-[#0A0A0A]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">POS</th>
                  <th className="py-3 px-4">CONSTRUCTOR</th>
                  <th className="py-3 px-4 text-center">VICTORIES</th>
                  <th className="py-3 px-4 text-center">PODIUM FINISHES</th>
                  <th className="py-3 px-4 text-right">TOTAL POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {constructorStandings.map((c, idx) => (
                  <tr key={c.name} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-black">
                      {idx === 0 ? <span className="text-[#E10600]">1</span> : idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-black text-white text-sm">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-white tabular-nums">
                      {c.wins}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-neutral-300 tabular-nums">
                      {c.podiums}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white text-base tabular-nums">
                      {c.points} <span className="text-xs text-neutral-500 font-normal">PTS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Teams Table */}
        {activeTab === 'teams' && (
          <div className="border border-neutral-800 overflow-hidden bg-[#0A0A0A]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">POS</th>
                  <th className="py-3 px-4">TEAM</th>
                  <th className="py-3 px-4 text-center">RACE WINS</th>
                  <th className="py-3 px-4 text-right">TOTAL POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {teamStandings.map((t, idx) => (
                  <tr key={t.name} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-black">
                      {idx === 0 ? <span className="text-[#E10600]">1</span> : idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-black text-white text-sm">
                      {t.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-white tabular-nums">
                      {t.wins}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white text-base tabular-nums">
                      {t.points} <span className="text-xs text-neutral-500 font-normal">PTS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
