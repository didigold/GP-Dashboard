'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Flag, CloudSun, Thermometer, Wind, Droplets, CheckCircle2, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SessionCountdownProps {
  sessionName?: string;
  roundName?: string;
  circuitName?: string;
}

export function SessionCountdown({
  sessionName = 'Main Grand Prix (20 Laps)',
  roundName = 'Petronas Grand Prix of Malaysia · Round 19',
  circuitName = 'Petronas Sepang International Circuit',
}: SessionCountdownProps) {
  // Target: dynamic 14h 28m countdown that ticks every second
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 14,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weekendSessions = [
    { name: 'Free Practice 1', time: 'Fri 10:45', status: 'COMPLETED', leader: 'F. Bagnaia 1\'58.210' },
    { name: 'Practice (PR)', time: 'Fri 15:00', status: 'COMPLETED', leader: 'J. Martin 1\'57.720' },
    { name: 'Qualifying (Q2)', time: 'Sat 10:50', status: 'COMPLETED', leader: 'F. Bagnaia 1\'57.491' },
    { name: 'Tissot Sprint (10 Laps)', time: 'Sat 15:00', status: 'COMPLETED', leader: 'P. Acosta (Winner)' },
    { name: 'Main Grand Prix (20 Laps)', time: 'Sun 15:00', status: 'NEXT UP', isNext: true },
  ];

  return (
    <div className="w-full bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E10600]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00F5D4]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="motogp" size="sm" className="font-mono text-[10px] tracking-wider uppercase">
                Next Live Session
              </Badge>
              <span className="text-xs font-mono text-neutral-400">
                {roundName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
              {sessionName}
            </h2>
            <p className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <span>🇲🇾</span>
              <span>{circuitName}</span>
            </p>
          </div>

          {/* Environmental Telemetry Pill */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs font-mono text-neutral-300 shrink-0">
            <div className="flex items-center gap-1.5" title="Air Temperature">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>31.4°C</span>
            </div>
            <div className="flex items-center gap-1.5" title="Track Asphalt Temperature">
              <Thermometer className="w-3.5 h-3.5 text-[#E10600]" />
              <span>44.2°C Track</span>
            </div>
            <div className="flex items-center gap-1.5" title="Humidity">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>76%</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
              DRY
            </div>
          </div>
        </div>

        {/* Big Countdown Timer Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto py-2">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-1">
              Days
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-1">
              Hours
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-1">
              Mins
            </div>
          </div>

          <div className="bg-white/[0.03] border border-[#E10600]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center shadow-[0_0_20px_rgba(225,6,0,0.15)]">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold text-[#FF2A24] tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#FF2A24] mt-1 font-semibold">
              Secs
            </div>
          </div>
        </div>

        {/* Weekend Timetable & Session Progress Horizontal Strip */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Grand Prix Weekend Timetable &amp; Track Status
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs">
            {weekendSessions.map((session, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  session.isNext
                    ? 'bg-[#E10600]/10 border-[#E10600]/60 text-white shadow-[0_0_15px_rgba(225,6,0,0.15)]'
                    : 'bg-white/[0.02] border-white/[0.06] text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] text-neutral-400">{session.time}</span>
                  {session.isNext ? (
                    <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                </div>
                <div className="font-semibold text-xs leading-tight truncate">{session.name}</div>
                <div className="text-[10px] text-neutral-400 mt-1 truncate">
                  {session.isNext ? (
                    <span className="text-[#FF2A24] font-bold">STARTING SOON</span>
                  ) : (
                    session.leader
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
