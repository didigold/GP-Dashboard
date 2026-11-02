'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GiSun,
  GiThermometerHot,
  GiWindSlap,
  GiHeavyRain,
} from 'react-icons/gi';

interface SessionItem {
  id: string;
  name: string;
  myTime: string;
  status: 'COMPLETED' | 'LIVE' | 'UPCOMING';
  detail?: string;
}

interface DaySchedule {
  dayName: string;
  dateStr: string;
  sessions: SessionItem[];
}

export function UnifiedHeroScheduleCard() {
  const [activeDayIndex, setActiveDayIndex] = useState(0); // Auto-rotates across Friday, Saturday, Sunday
  const [isPaused, setIsPaused] = useState(false);

  // General session countdown ticker
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 25,
    seconds: 56,
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
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filtered strictly for MotoGP™ premier class
  const weekendDays: DaySchedule[] = [
    {
      dayName: 'Friday',
      dateStr: '30 Oct',
      sessions: [
        {
          id: 'fp1',
          name: 'Free Practice Nr. 1',
          myTime: '03:45 - 04:30',
          status: 'COMPLETED',
          detail: "Bagnaia · 1'58.210",
        },
        {
          id: 'pr',
          name: 'Practice (Timed for Q2)',
          myTime: '08:00 - 09:00',
          status: 'COMPLETED',
          detail: "Martin · 1'57.720",
        },
      ],
    },
    {
      dayName: 'Saturday',
      dateStr: '31 Oct',
      sessions: [
        {
          id: 'fp2',
          name: 'Free Practice Nr. 2',
          myTime: '03:10 - 03:40',
          status: 'COMPLETED',
          detail: "Marquez · 1'58.004",
        },
        {
          id: 'q1',
          name: 'Qualifying Nr. 1',
          myTime: '03:50 - 04:05',
          status: 'COMPLETED',
          detail: 'Top 2 into Q2',
        },
        {
          id: 'q2',
          name: 'Qualifying Nr. 2 (Pole)',
          myTime: '04:15 - 04:30',
          status: 'COMPLETED',
          detail: "Bagnaia · 1'57.491",
        },
        {
          id: 'sprint',
          name: 'Tissot Sprint (10 Laps)',
          myTime: '08:00 - 08:45',
          status: 'COMPLETED',
          detail: 'Winner: P. Acosta',
        },
      ],
    },
    {
      dayName: 'Sunday',
      dateStr: '01 Nov',
      sessions: [
        {
          id: 'wup',
          name: 'Warm Up',
          myTime: '03:40 - 03:50',
          status: 'COMPLETED',
          detail: "Bezzecchi · 1'58.420",
        },
        {
          id: 'race',
          name: 'Grand Prix Race (20 Laps)',
          myTime: '08:00',
          status: 'UPCOMING',
          detail: '20 Laps · 110.86 km',
        },
      ],
    },
  ];

  // Auto-advance every 5 seconds, pausing on hover (like milestone card)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveDayIndex((prev) => (prev + 1) % weekendDays.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, weekendDays.length]);

  const currentDay = weekendDays[activeDayIndex];

  return (
    <div
      className="w-full text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 2-COLUMN LAYOUT: Floating Elements without framing border or bg */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN (md:col-span-7): AUTO-ROTATING TIMETABLE LIKE MILESTONE CARD
           ========================================================================= */}
        <div className="md:col-span-7 space-y-3">
          {/* Day Header with smooth indicator dots */}
          <div className="flex items-center justify-between pb-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentDay.dayName}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-baseline gap-2 font-sans"
              >
                <span className="text-base sm:text-lg font-bold text-white">
                  {currentDay.dayName}
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-normal">
                  · {currentDay.dateStr}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Auto-rotation indicator dots like milestone card */}
            <div className="flex items-center gap-1.5">
              {weekendDays.map((d, idx) => (
                <button
                  key={d.dayName}
                  onClick={() => setActiveDayIndex(idx)}
                  aria-label={`Show ${d.dayName} schedule`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeDayIndex
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sessions List - Fixed Height h-[176px] with Floating Row Aesthetics */}
          <div className="h-[176px] flex flex-col justify-start overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeDayIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-1.5"
              >
                {currentDay.sessions.map((session) => {
                  const isUpcoming = session.status === 'UPCOMING';
                  return (
                    <div
                      key={session.id}
                      className={`py-2 px-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-sans transition-colors ${
                        isUpcoming
                          ? 'text-white font-semibold bg-white/[0.08]'
                          : 'text-neutral-300 font-normal hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Time & Session Title */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`font-sans text-xs sm:text-sm min-w-[88px] tabular-nums ${
                            isUpcoming ? 'text-white font-bold' : 'text-neutral-400 font-medium'
                          }`}
                        >
                          {session.myTime}
                        </span>
                        <span
                          className={`truncate font-sans ${
                            isUpcoming ? 'text-white font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          {session.name}
                        </span>
                      </div>

                      {/* State / Result */}
                      <div className="shrink-0 text-xs sm:text-sm font-sans">
                        {isUpcoming ? (
                          <span className="text-[#FF2A24] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
                            <span>Next up</span>
                          </span>
                        ) : (
                          <span className="text-neutral-400 truncate max-w-[170px] block text-right">
                            {session.detail}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (md:col-span-5): EQUAL BIG NEXT SESSION & TRACK CONDITIONS
            (Counter text equidistant between "Next session in" and "Track conditions")
           ========================================================================= */}
        <div className="md:col-span-5 md:border-l md:border-white/10 md:pl-8 flex flex-col justify-start text-left">
          {/* Label 1: Next session in */}
          <span className="text-xs sm:text-sm font-sans font-medium text-neutral-400 block">
            Next session in
          </span>

          {/* Countdown Digits: Equidistant from "Next session in" above and "Track conditions" below */}
          <div className="my-3 flex items-baseline gap-2 font-sans text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tabular-nums tracking-tight leading-none">
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span className="text-neutral-500 font-light">:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span className="text-neutral-500 font-light">:</span>
            <span className="text-[#FF2A24]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>

          {/* Label 2: Track conditions */}
          <span className="text-xs sm:text-sm font-sans font-medium text-neutral-400 block text-left mb-2.5">
            Track conditions
          </span>

          {/* Track conditions grid */}
          <div className="grid grid-cols-4 gap-2 w-full font-sans">
            <div className="flex flex-col items-center text-center gap-1">
              <GiSun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white mt-0.5">Sunny</span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Clear</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1">
              <GiThermometerHot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white mt-0.5">32°/44°C</span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Air/Track</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1">
              <GiWindSlap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white mt-0.5">14 km/h</span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Wind SE</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1">
              <GiHeavyRain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white mt-0.5">15%</span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Rain risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
