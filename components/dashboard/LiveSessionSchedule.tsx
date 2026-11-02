'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Gauge,
  Trophy,
  History,
  Award,
  Zap,
  Flag,
} from 'lucide-react';

interface SessionItem {
  id: string;
  name: string;
  trackTime: string;
  myTime: string;
  status: 'COMPLETED' | 'LIVE' | 'UPCOMING';
  detail?: string;
  isMain?: boolean;
}

interface DaySchedule {
  dayNumber: number;
  dayName: string;
  month: string;
  sessions: SessionItem[];
}

export function LiveSessionSchedule() {
  const [activeDayIndex, setActiveDayIndex] = useState(2); // Default to Sunday (Race Day)
  const [timeZoneMode, setTimeZoneMode] = useState<'MY_TIME' | 'TRACK_TIME'>('TRACK_TIME');

  // Dynamic live countdown ticker
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

  // Schedule strictly for MotoGP™ (as requested: "only for motogp")
  const weekendDays: DaySchedule[] = [
    {
      dayNumber: 30,
      dayName: 'Friday',
      month: 'October',
      sessions: [
        {
          id: 'fp1',
          name: 'Free Practice Nr. 1',
          trackTime: '10:45 - 11:30',
          myTime: '03:45 - 04:30',
          status: 'COMPLETED',
          detail: 'Leader: F. Bagnaia · 1\'58.210',
        },
        {
          id: 'pr',
          name: 'Practice (Timed for Q2)',
          trackTime: '15:00 - 16:00',
          myTime: '08:00 - 09:00',
          status: 'COMPLETED',
          detail: 'Leader: J. Martin · 1\'57.720',
        },
      ],
    },
    {
      dayNumber: 31,
      dayName: 'Saturday',
      month: 'October',
      sessions: [
        {
          id: 'fp2',
          name: 'Free Practice Nr. 2',
          trackTime: '10:10 - 10:40',
          myTime: '03:10 - 03:40',
          status: 'COMPLETED',
          detail: 'Leader: M. Marquez · 1\'58.004',
        },
        {
          id: 'q1',
          name: 'Qualifying Nr. 1 (Q1)',
          trackTime: '10:50 - 11:05',
          myTime: '03:50 - 04:05',
          status: 'COMPLETED',
          detail: 'Promoted: Di Giannantonio & Morbidelli',
        },
        {
          id: 'q2',
          name: 'Qualifying Nr. 2 (Pole Shootout)',
          trackTime: '11:15 - 11:30',
          myTime: '04:15 - 04:30',
          status: 'COMPLETED',
          detail: 'Pole: F. Bagnaia · 1\'57.491',
        },
        {
          id: 'sprint',
          name: 'Tissot Sprint (10 Laps)',
          trackTime: '15:00 - 15:45',
          myTime: '08:00 - 08:45',
          status: 'COMPLETED',
          detail: 'Winner: P. Acosta (Red Bull KTM)',
          isMain: true,
        },
      ],
    },
    {
      dayNumber: 1,
      dayName: 'Sunday',
      month: 'November',
      sessions: [
        {
          id: 'wup',
          name: 'Warm Up',
          trackTime: '10:40 - 10:50',
          myTime: '03:40 - 03:50',
          status: 'COMPLETED',
          detail: 'Leader: M. Bezzecchi · 1\'58.420',
        },
        {
          id: 'race',
          name: 'Grand Prix Race (20 Laps)',
          trackTime: '15:00',
          myTime: '08:00',
          status: 'UPCOMING',
          detail: '20 Laps · 110.86 km total race distance',
          isMain: true,
        },
      ],
    },
  ];

  const currentDay = weekendDays[activeDayIndex];

  // Track record cards requested by user
  const trackRecords = [
    {
      label: 'Top Speed Record',
      value: '362.8 km/h',
      subtext: 'Pedro Acosta · KTM RC16 (2026)',
      icon: Gauge,
      accent: 'text-[#FF2A24]',
    },
    {
      label: 'All-Time Lap Record',
      value: "1'57.491",
      subtext: 'Francesco Bagnaia · Ducati GP24',
      icon: Zap,
      accent: 'text-amber-400',
    },
    {
      label: 'Year of Debut',
      value: '1999',
      subtext: 'Inaugural Grand Prix of Malaysia',
      icon: History,
      accent: 'text-cyan-400',
    },
    {
      label: 'Driver with Most Wins',
      value: '6 Victories',
      subtext: 'Valentino Rossi (M. Márquez: 3)',
      icon: Trophy,
      accent: 'text-emerald-400',
    },
    {
      label: 'Last GP Winner',
      value: 'Enea Bastianini',
      subtext: 'Ducati Lenovo Team · 39:59.137',
      icon: Award,
      accent: 'text-purple-400',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* SECTION CONTAINER: UPCOMING LIVE & SESSION SCHEDULE (Image 2 style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN (5 cols): Next Live Session Countdown Frame */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#160606] via-[#0E0E0E] to-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle motorsport ambient bloom */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#E10600]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Header: Label without repeating the Grand Prix name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#E10600] rounded-sm" />
                <span className="text-xs font-sans font-extrabold uppercase tracking-widest text-white">
                  Next Live Track Action
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E10600]/20 border border-[#E10600]/40 text-[#FF2A24] text-[10px] font-mono font-bold tracking-wider animate-pulse">
                STARTING SOON
              </span>
            </div>

            {/* Session Name in Standardized Custom Sora font */}
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight leading-tight">
                Main Grand Prix Race
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                20 Laps · 110.86 km full Grand Prix distance
              </p>
            </div>

            {/* Prominently Moved Digital Countdown Counter */}
            <div className="py-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Session T-Minus Countdown
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-3 bg-black/60 border border-white/[0.08] rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                    Days
                  </div>
                </div>

                <div className="p-3 bg-black/60 border border-white/[0.08] rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                    Hours
                  </div>
                </div>

                <div className="p-3 bg-black/60 border border-white/[0.08] rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                    Mins
                  </div>
                </div>

                <div className="p-3 bg-[#E10600]/15 border border-[#E10600]/50 rounded-xl shadow-[0_0_15px_rgba(225,6,0,0.2)]">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF2A24] tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-[#FF2A24] uppercase tracking-wider font-semibold mt-0.5">
                    Secs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Track Meteorological Snapshot at Bottom */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-3">
              <span>Air: <strong className="text-white">31.4°C</strong></span>
              <span>Asphalt: <strong className="text-[#FF2A24]">44.2°C</strong></span>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              DRY
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): MotoGP™ Weekend Timetable (Inspired by Image 2) */}
        <div className="lg:col-span-7 bg-[#0E0E0E]/90 border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
          <div className="space-y-4">
            {/* Header: Title and Days Tabs (Image 2 layout) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#E10600] rounded-sm" />
                <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-white">
                  Weekend Session Timetable
                </h4>
              </div>

              {/* Day Selector Tabs (30 Fri / 31 Sat / 1 Sun) */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/[0.06]">
                {weekendDays.map((day, idx) => {
                  const isActive = idx === activeDayIndex;
                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => setActiveDayIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all text-center leading-tight ${
                        isActive
                          ? 'bg-white/10 text-white font-bold border border-white/10 shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="font-mono font-bold mr-1">{day.dayNumber}</span>
                      <span>{day.dayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sessions Table (Filtered Strictly for MotoGP™) */}
            <div className="space-y-2">
              {currentDay.sessions.map((session) => {
                const isUpcoming = session.status === 'UPCOMING';

                return (
                  <div
                    key={session.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isUpcoming
                        ? 'bg-[#E10600]/10 border-[#E10600]/40 text-white shadow-md'
                        : 'bg-black/40 border-white/[0.06] text-neutral-300'
                    }`}
                  >
                    {/* Time & Class */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-neutral-200 min-w-[95px]">
                        {timeZoneMode === 'TRACK_TIME' ? session.trackTime : session.myTime}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white font-sans text-[11px] font-bold border border-white/10">
                        MotoGP™
                      </span>
                      <span className="text-xs font-sans font-bold text-white">
                        {session.name}
                      </span>
                    </div>

                    {/* Status & Detail */}
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {isUpcoming ? (
                        <span className="text-[#FF2A24] font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
                          NEXT UP
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{session.detail}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: MY TIME / TRACK TIME Toggle (matching Image 2) */}
          <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">
              Showing MotoGP™ premier class sessions
            </span>

            {/* My Time vs Track Time Pill Switcher */}
            <div className="flex items-center p-0.5 bg-black rounded-full border border-white/[0.08]">
              <button
                onClick={() => setTimeZoneMode('MY_TIME')}
                className={`px-3 py-1 rounded-full text-[11px] font-sans font-semibold transition-all ${
                  timeZoneMode === 'MY_TIME'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                MY TIME
              </button>
              <button
                onClick={() => setTimeZoneMode('TRACK_TIME')}
                className={`px-3 py-1 rounded-full text-[11px] font-sans font-semibold transition-all ${
                  timeZoneMode === 'TRACK_TIME'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                TRACK TIME (UTC+8)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TRACK RECORDS CARDS (Requested by user: Top Speed, Year of Debut, Last Winner, Most Wins) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-sans font-extrabold uppercase tracking-widest text-neutral-400">
            Sepang International Circuit · Historical Records
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Official FIM MotoGP™ Data</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {trackRecords.map((record, idx) => {
            const Icon = record.icon;
            return (
              <div
                key={idx}
                className="p-4 bg-[#0E0E0E] border border-white/[0.08] rounded-2xl hover:border-white/[0.18] transition-all space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">{record.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${record.accent}`} />
                </div>
                <div className={`text-xl sm:text-2xl font-bold font-sans tracking-tight text-white`}>
                  {record.value}
                </div>
                <div className="text-[11px] text-neutral-400 font-light truncate">
                  {record.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
