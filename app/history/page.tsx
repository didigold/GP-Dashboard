'use client';

import { Header } from '../../components/navigation/Header';
import { History, Trophy, Award, Sparkles, BookOpen } from 'lucide-react';

const LEGENDS = [
  { rider: 'Giacomo Agostini', country: 'Italy', titles: 15, wins: 122, era: '1965 - 1977 (MV Agusta, Yamaha)' },
  { rider: 'Angel Nieto', country: 'Spain', titles: 13, wins: 90, era: '1964 - 1986 (Derbi, Garelli)' },
  { rider: 'Valentino Rossi', country: 'Italy', titles: 9, wins: 115, era: '1996 - 2021 (Honda, Yamaha, Ducati)' },
  { rider: 'Mike Hailwood', country: 'UK', titles: 9, wins: 76, era: '1958 - 1967 (Honda, MV Agusta)' },
  { rider: 'Marc Marquez', country: 'Spain', titles: 8, wins: 88, era: '2008 - Present (Honda, Ducati)' },
  { rider: 'Mick Doohan', country: 'Australia', titles: 5, wins: 54, era: '1989 - 1999 (Honda NSR500)' },
  { rider: 'Jorge Lorenzo', country: 'Spain', titles: 5, wins: 68, era: '2002 - 2019 (Yamaha, Ducati)' },
  { rider: 'Casey Stoner', country: 'Australia', titles: 2, wins: 45, era: '2001 - 2012 (Ducati, Honda)' },
  { rider: 'Francesco Bagnaia', country: 'Italy', titles: 3, wins: 29, era: '2013 - Present (Ducati Lenovo)' },
];

export default function HistoryPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="Grand Prix Motorcycle Racing History (1949 - Present)" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-racing-yellow">
            <History className="w-4 h-4" />
            <span>MOTORCYCLE WORLD CHAMPIONSHIP ARCHIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Historical Hall of Fame
          </h1>
          <p className="text-xs text-slate-400">
            Records, champions, and technical revolutions across 75+ years of Grand Prix racing.
          </p>
        </div>

        {/* Technical Eras Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[10px] font-mono text-slate-500">1949 - 2001</div>
            <div className="text-base font-bold text-white mt-1">500cc Two-Stroke Era</div>
            <p className="text-xs text-slate-400 mt-1">
              Violent powerbands, no traction control, legendary slide battles.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[10px] font-mono text-slate-500">2002 - 2006</div>
            <div className="text-base font-bold text-white mt-1">990cc Four-Stroke Dawn</div>
            <p className="text-xs text-slate-400 mt-1">
              Honda RC211V V5 vs Yamaha YZR-M1 inline-four revolution.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[10px] font-mono text-slate-500">2007 - 2011</div>
            <div className="text-base font-bold text-white mt-1">800cc Corner Speed Era</div>
            <p className="text-xs text-slate-400 mt-1">
              Electronics advancement, pneumatic valves, extreme lean angles.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[10px] font-mono text-slate-500">2012 - PRESENT</div>
            <div className="text-base font-bold text-racing-cyan mt-1">1000cc Aerodynamic Era</div>
            <p className="text-xs text-slate-400 mt-1">
              Downforce winglets, ground-effect fairings, holeshot & shapeshifters.
            </p>
          </div>
        </div>

        {/* Legends Table */}
        <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-racing-border bg-racing-dark/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">LEGENDARY RIDER</th>
                <th className="py-3.5 px-4">NATION</th>
                <th className="py-3.5 px-4 text-center">WORLD TITLES</th>
                <th className="py-3.5 px-4 text-center">GP VICTORIES</th>
                <th className="py-3.5 px-4">CAREER SPAN & MANUFACTURERS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
              {LEGENDS.map((legend) => (
                <tr key={legend.rider} className="hover:bg-racing-cardHover transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-white text-sm">
                    {legend.rider}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {legend.country}
                  </td>

                  <td className="py-3.5 px-4 text-center font-extrabold text-base text-racing-yellow">
                    {legend.titles}
                  </td>

                  <td className="py-3.5 px-4 text-center font-extrabold text-sm text-racing-cyan">
                    {legend.wins}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-sans">
                    {legend.era}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
