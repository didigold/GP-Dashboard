'use client';

import { History, Trophy, Award, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex-1 flex flex-col min-h-screen bg-black">
      {/* Top Motorsport Sub-Header Banner */}
      <div className="border-b border-[#262626] bg-[#0A0A0A] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#E10600]" />
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              GRAND PRIX MOTORCYCLE RACING HISTORY (1949 - PRESENT)
            </h1>
            <p className="text-[11px] font-mono text-[#888888]">
              75+ YEARS OF WORLD CHAMPIONSHIP TITLES &amp; TECHNICAL REVOLUTIONS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-none border-[#262626] bg-black text-[#A0A0A0] font-mono text-[11px]">
            ARCHIVE
          </Badge>
          <Badge className="rounded-none bg-[#E10600] text-white hover:bg-[#E10600] font-mono text-[11px]">
            FIM HALL OF FAME
          </Badge>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E5A93C]">
            <History className="w-4 h-4" />
            <span>MOTORCYCLE WORLD CHAMPIONSHIP ARCHIVE</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Historical Hall of Fame
          </h2>
          <p className="text-xs text-[#888888] font-mono">
            Records, champions, and technical regulations across 75+ years of Grand Prix racing.
          </p>
        </div>

        {/* Technical Eras Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">1949 - 2001</div>
              <div className="text-sm font-black uppercase text-white mt-1">500cc Two-Stroke Era</div>
              <p className="text-xs text-[#888888] mt-2">
                Violent powerbands, zero traction control, iconic sliding masterclasses.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">2002 - 2006</div>
              <div className="text-sm font-black uppercase text-white mt-1">990cc Four-Stroke Dawn</div>
              <p className="text-xs text-[#888888] mt-2">
                Honda RC211V V5 vs Yamaha YZR-M1 inline-four revolution.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">2007 - 2011</div>
              <div className="text-sm font-black uppercase text-white mt-1">800cc Corner Speed Era</div>
              <p className="text-xs text-[#888888] mt-2">
                Electronics advancement, pneumatic valves, extreme lean angle growth.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#0066FF]">2012 - PRESENT</div>
              <div className="text-sm font-black uppercase text-[#0066FF] mt-1">1000cc Aero &amp; Ride-Height</div>
              <p className="text-xs text-[#888888] mt-2">
                Downforce winglets, ground-effect aero, shapeshifter holeshot devices.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Legends Table */}
        <Card className="rounded-none border-[#262626] bg-[#0A0A0A] overflow-hidden">
          <div className="border-b border-[#262626] px-5 py-3.5 flex items-center justify-between bg-black">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              ALL-TIME WORLD CHAMPIONS
            </span>
            <span className="text-[10px] font-mono text-[#888888]">
              OFFICIAL FIM GRAND PRIX ALL-CLASS RECORDS
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#111111] text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                  <th className="py-3 px-4">LEGENDARY RIDER</th>
                  <th className="py-3 px-4">NATION</th>
                  <th className="py-3 px-4 text-center">WORLD TITLES</th>
                  <th className="py-3 px-4 text-center">GP VICTORIES</th>
                  <th className="py-3 px-4">CAREER SPAN &amp; MANUFACTURERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F] font-mono text-xs">
                {LEGENDS.map((legend) => (
                  <tr key={legend.rider} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 font-bold text-white text-sm">
                      {legend.rider}
                    </td>

                    <td className="py-3 px-4 text-[#A0A0A0]">
                      {legend.country}
                    </td>

                    <td className="py-3 px-4 text-center font-black text-sm text-[#E5A93C]">
                      {legend.titles}
                    </td>

                    <td className="py-3 px-4 text-center font-black text-sm text-[#0066FF]">
                      {legend.wins}
                    </td>

                    <td className="py-3 px-4 text-[#888888]">
                      {legend.era}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
