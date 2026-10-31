'use client';

import { Header } from '../../components/navigation/Header';
import { MOCK_CRASHES_DATA } from '../../lib/data/mock-race-data';
import { AlertTriangle, Flame, ShieldAlert, Euro, Wrench } from 'lucide-react';

export default function GravelTrapPage() {
  const totalSeasonBill = MOCK_CRASHES_DATA.reduce((acc, curr) => acc + curr.repair_cost_eur, 0);
  const totalCrashes = MOCK_CRASHES_DATA.reduce((acc, curr) => acc + curr.crashes, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="Gravel Trap Championship (Crash Ledger)" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-racing-red">
            <Flame className="w-4 h-4" />
            <span>CRASH LEDGER & INCIDENT EXPENSES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gravel Trap Championship
          </h1>
          <p className="text-xs text-slate-400">
            Estimated crash damages, repair bills, and fall counts across the MotoGP field.
          </p>
        </div>

        {/* Global Season Damage Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">TOTAL DAMAGE BILL</div>
              <div className="text-2xl font-extrabold text-racing-red font-mono mt-1">
                €{(totalSeasonBill / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Estimated factory costs</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-red/10 text-racing-red">
              <Euro className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">TOTAL CRASHES</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {totalCrashes} Falls
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Across FP, Q, SPR & RAC</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-yellow/10 text-racing-yellow">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-racing-border flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">MOST FREQUENT CRASH ZONE</div>
              <div className="text-xl font-extrabold text-racing-cyan font-mono mt-1">
                Le Mans (T3)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Cold-tire chicane off</div>
            </div>
            <div className="p-3 rounded-xl bg-racing-cyan/10 text-racing-cyan">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Crashes Table */}
        <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-racing-border bg-racing-dark/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-12 text-center">POS</th>
                <th className="py-3.5 px-4">RIDER</th>
                <th className="py-3.5 px-4">TEAM</th>
                <th className="py-3.5 px-4 text-center">FALLS</th>
                <th className="py-3.5 px-4 text-center">BIKES DAMAGED</th>
                <th className="py-3.5 px-4 text-right">ESTIMATED REPAIR BILL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
              {MOCK_CRASHES_DATA.map((item, index) => (
                <tr key={item.rider} className="hover:bg-racing-cardHover transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className="inline-block w-6 h-6 rounded-md bg-racing-card text-white text-center leading-6">
                      {index + 1}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold text-white text-sm">
                    <span className="text-slate-400 mr-2 font-mono text-xs">#{item.number}</span>
                    {item.rider}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-sans">
                    {item.team}
                  </td>

                  <td className="py-3.5 px-4 text-center font-extrabold text-sm text-racing-red">
                    {item.crashes}
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-300 font-bold">
                    {item.bikes_damaged}
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-base text-racing-yellow">
                    €{(item.repair_cost_eur / 1000).toLocaleString()}k
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
