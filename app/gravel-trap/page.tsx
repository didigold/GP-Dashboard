'use client';

import { MOCK_CRASHES_DATA } from '../../lib/data/mock-race-data';
import { AlertTriangle, Flame, ShieldAlert, Euro, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function GravelTrapPage() {
  const totalSeasonBill = MOCK_CRASHES_DATA.reduce((acc, curr) => acc + curr.repair_cost_eur, 0);
  const totalCrashes = MOCK_CRASHES_DATA.reduce((acc, curr) => acc + curr.crashes, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black">
      {/* Top Motorsport Sub-Header Banner */}
      <div className="border-b border-[#262626] bg-[#0A0A0A] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#E10600]" />
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              GRAVEL TRAP CHAMPIONSHIP (CRASH LEDGER)
            </h1>
            <p className="text-[11px] font-mono text-[#888888]">
              DAMAGE EXPENSES • ACCIDENT FREQUENCY • REPAIR AUDIT
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-none border-[#262626] bg-black text-[#A0A0A0] font-mono text-[11px]">
            SEASON IMPACT
          </Badge>
          <Badge className="rounded-none bg-[#E10600] text-white hover:bg-[#E10600] font-mono text-[11px]">
            OFFICIAL FIM RECORD
          </Badge>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E10600]">
            <Flame className="w-4 h-4" />
            <span>CRASH LEDGER &amp; INCIDENT EXPENSES</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Gravel Trap Championship
          </h2>
          <p className="text-xs text-[#888888] font-mono">
            Estimated crash damages, repair bills, and fall counts across the MotoGP field.
          </p>
        </div>

        {/* Global Season Damage Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">TOTAL DAMAGE BILL</div>
                <div className="text-3xl font-black text-[#E10600] font-mono mt-1">
                  €{(totalSeasonBill / 1000000).toFixed(2)}M
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-0.5">Estimated factory carbon &amp; engine repairs</div>
              </div>
              <div className="p-3 border border-[#262626] bg-black text-[#E10600]">
                <Euro className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">TOTAL CRASHES</div>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {totalCrashes} Falls
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-0.5">Across FP1, PR, Q1, Q2, SPR &amp; RAC</div>
              </div>
              <div className="p-3 border border-[#262626] bg-black text-[#E5A93C]">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">MOST FREQUENT CRASH ZONE</div>
                <div className="text-2xl font-black text-[#0066FF] font-mono mt-1">
                  Le Mans (T3)
                </div>
                <div className="text-[10px] text-[#666666] font-mono mt-0.5">Cold front tire chicane lowside</div>
              </div>
              <div className="p-3 border border-[#262626] bg-black text-[#0066FF]">
                <Wrench className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crashes Table */}
        <Card className="rounded-none border-[#262626] bg-[#0A0A0A] overflow-hidden">
          <div className="border-b border-[#262626] px-5 py-3.5 flex items-center justify-between bg-black">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              RIDERS CRASH LEDGER &amp; ESTIMATED EXPENSE
            </span>
            <span className="text-[10px] font-mono text-[#888888]">
              SORTED BY TOTAL DAMAGE EXPENDITURE
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#111111] text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                  <th className="py-3 px-4 w-12 text-center">POS</th>
                  <th className="py-3 px-4">RIDER</th>
                  <th className="py-3 px-4">TEAM</th>
                  <th className="py-3 px-4 text-center">FALLS</th>
                  <th className="py-3 px-4 text-center">BIKES DAMAGED</th>
                  <th className="py-3 px-4 text-right">ESTIMATED REPAIR BILL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F] font-mono text-xs">
                {MOCK_CRASHES_DATA.map((item, index) => (
                  <tr key={item.rider} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="inline-block w-6 h-6 border border-[#262626] bg-black text-white text-center leading-6 text-xs">
                        {index + 1}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-white text-sm">
                      <span className="text-[#888888] mr-2 font-mono text-xs">#{item.number}</span>
                      {item.rider}
                    </td>

                    <td className="py-3 px-4 text-[#A0A0A0]">
                      {item.team}
                    </td>

                    <td className="py-3 px-4 text-center font-black text-sm text-[#E10600]">
                      {item.crashes}
                    </td>

                    <td className="py-3 px-4 text-center text-[#A0A0A0] font-bold">
                      {item.bikes_damaged}
                    </td>

                    <td className="py-3 px-4 text-right font-black text-sm text-[#E5A93C]">
                      €{(item.repair_cost_eur / 1000).toLocaleString()}k
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
