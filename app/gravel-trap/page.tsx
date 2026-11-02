'use client';

import Link from 'next/link';
import { MOCK_CRASHES_DATA } from '../../lib/data/mock-race-data';
import { AlertTriangle, Flame, Euro, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
            <h1 className="text-sm font-bold text-white">
              Gravel Trap Championship (Crash Ledger)
            </h1>
            <p className="text-[11px] font-mono text-[#888888]">
              Damage expenses • Accident frequency • Repair audit
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#262626] bg-black text-[#A0A0A0] font-mono text-[11px]">
            Season Impact
          </Badge>
          <Badge className="bg-[#E10600] text-white hover:bg-[#E10600] font-mono text-[11px]">
            Official FIM Record
          </Badge>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E10600]">
            <Flame className="w-4 h-4" />
            <span>Incident Ledger &amp; Repair Expenses</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Gravel Trap Championship
          </h2>
          <p className="text-xs text-[#888888] font-mono">
            Estimated crash damages, repair bills, and fall counts across the MotoGP field.
          </p>
        </div>

        {/* Global Season Damage Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#888888]">Total Damage Bill</div>
                <div className="text-3xl font-bold text-[#E10600] font-mono mt-1">
                  €{(totalSeasonBill / 1000000).toFixed(2)}M
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-0.5">Estimated factory carbon &amp; engine repairs</div>
              </div>
              <div className="p-3 rounded-xl border border-[#262626] bg-black text-[#E10600]">
                <Euro className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#888888]">Total Crashes</div>
                <div className="text-3xl font-bold text-white font-mono mt-1">
                  {totalCrashes} Falls
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-0.5">Across FP1, PR, Q1, Q2, SPR &amp; RAC</div>
              </div>
              <div className="p-3 rounded-xl border border-[#262626] bg-black text-[#E5A93C]">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#888888]">Most Frequent Crash Zone</div>
                <div className="text-2xl font-bold text-[#0066FF] font-mono mt-1">
                  Le Mans (T3)
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-0.5">Cold front tire chicane lowside</div>
              </div>
              <div className="p-3 rounded-xl border border-[#262626] bg-black text-[#0066FF]">
                <Wrench className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crashes Table */}
        <Card className="border-[#262626] bg-[#0A0A0A] overflow-hidden">
          <div className="border-b border-[#262626] px-5 py-3.5 flex items-center justify-between bg-black">
            <span className="text-xs font-semibold text-white">
              Riders Crash Ledger &amp; Estimated Expense
            </span>
            <span className="text-[10px] font-mono text-[#888888]">
              Sorted by total damage expenditure
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#111111] text-[11px] font-sans font-semibold text-[#888888]">
                  <th className="py-3 px-4 w-12 text-center">Pos</th>
                  <th className="py-3 px-4">Rider</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4 text-center">Falls</th>
                  <th className="py-3 px-4 text-center">Bikes Damaged</th>
                  <th className="py-3 px-4 text-right">Estimated Repair Bill</th>
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

                    <td className="py-3 px-4 font-semibold text-white text-sm font-sans">
                      <span className="text-[#888888] mr-2 font-mono text-xs">#{item.number}</span>
                      {item.rider}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <Link
                        href="/teams"
                        className="text-neutral-300 hover:text-white hover:underline transition-colors"
                      >
                        {item.team}
                      </Link>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-sm text-[#E10600]">
                      {item.crashes}
                    </td>

                    <td className="py-3 px-4 text-center text-[#A0A0A0] font-semibold">
                      {item.bikes_damaged}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-sm text-[#E5A93C]">
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
