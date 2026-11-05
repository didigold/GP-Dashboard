'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { GiCheckeredFlag, GiStopwatch, GiSun, GiHeavyRain } from 'react-icons/gi';
import { TrackWeather } from '@/lib/utils/weather';

export interface AvailableSession {
  id: string;
  type: string;
  name: string;
}

export interface SessionHeaderProps {
  eventName: string;
  circuitName: string;
  sessionType: string;
  sessionName: string;
  isLive: boolean;
  remainingSeconds: number;
  totalDurationSeconds: number;
  currentLap: number;
  totalLaps: number;
  weather: TrackWeather | null;
  lastUpdated: number | null;
  availableSessions?: AvailableSession[];
  onSelectSession?: (type: string) => void;
  className?: string;
}

function clock(secs: number): string {
  const s = Math.max(0, Math.floor(secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

const SESSION_LABEL: Record<string, string> = {
  RAC: 'Grand Prix Race',
  SPR: 'Sprint',
  Q: 'Qualifying',
  FP: 'Free Practice',
  PR: 'Practice',
  WUP: 'Warm Up',
};

export function SessionHeader({
  eventName,
  circuitName,
  sessionType,
  sessionName,
  isLive,
  remainingSeconds,
  totalDurationSeconds,
  currentLap,
  totalLaps,
  weather,
  lastUpdated,
  availableSessions = [],
  onSelectSession,
  className = '',
}: SessionHeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const isTimed = /^(FP|PR|Q|WUP)/i.test(sessionType);
  const secondsAgo = lastUpdated ? Math.max(0, Math.round((now - lastUpdated) / 1000)) : null;

  return (
    <div
      className={`px-3.5 py-2 bg-[#0D0D0E]/90 border border-white/[0.08] rounded-xl flex flex-wrap items-center justify-between gap-2.5 shadow-xl select-none font-sans relative z-30 shrink-0 ${className}`}
    >
      {/* Left: event + session */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white leading-tight truncate">
            {eventName}
          </h1>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-none mt-0.5 truncate">
            {(SESSION_LABEL[sessionType] || sessionName.split('·').pop()?.trim() || sessionName)} · {circuitName}
          </p>
        </div>

        {availableSessions.length > 1 && onSelectSession && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-6 px-2 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-semibold text-neutral-300 flex items-center gap-1 cursor-pointer"
            >
              {sessionType}
              <ChevronDown className="w-3 h-3" />
            </button>
            {menuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-[#0B0C10] border border-white/15 p-1 z-50 text-[11px] space-y-0.5 shadow-2xl">
                {availableSessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectSession(s.type);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded-md cursor-pointer ${
                      sessionType === s.type
                        ? 'bg-neutral-700 text-white font-bold'
                        : 'text-neutral-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: live, clock/laps, weather, updated */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Live / official */}
        <div
          className={`h-7 px-2.5 rounded-full border text-[10px] font-bold flex items-center gap-1.5 ${
            isLive
              ? 'bg-[#E10600]/15 border-[#E10600]/40 text-white'
              : 'bg-white/[0.05] border-white/[0.1] text-neutral-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLive ? 'bg-[#E10600] animate-pulse' : 'bg-neutral-500'
            }`}
          />
          {isLive ? 'LIVE' : 'OFFICIAL'}
        </div>

        {/* Clock / laps */}
        <div className="h-7 px-2.5 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center gap-1.5 text-white">
          <GiStopwatch className="w-4 h-4 text-white" />
          <span className="font-black tabular-nums text-[12px]">
            {isTimed
              ? totalDurationSeconds > 0
                ? clock(remainingSeconds)
                : '—'
              : `L${currentLap}${totalLaps ? `/${totalLaps}` : ''}`}
          </span>
        </div>

        {/* Weather (real) */}
        <div className="h-7 px-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-neutral-300 flex items-center gap-2 text-[10px]">
          {weather ? (
            <>
              {weather.isRaining ? (
                <GiHeavyRain className="w-4 h-4 text-white" />
              ) : (
                <GiSun className="w-4 h-4 text-white" />
              )}
              <span className="tabular-nums">
                AIR <strong className="text-white">{weather.airTemp.toFixed(0)}°</strong>
              </span>
              <span className="text-white/10">|</span>
              <span className="tabular-nums">
                HUM <strong className="text-white">{weather.humidity.toFixed(0)}%</strong>
              </span>
              <span className="text-white/10">|</span>
              <span className="tabular-nums">
                WIND <strong className="text-white">{weather.windSpeed.toFixed(1)}</strong>
              </span>
            </>
          ) : (
            <>
              <GiCheckeredFlag className="w-4 h-4 text-white" />
              <span>Weather unavailable</span>
            </>
          )}
        </div>

        {secondsAgo !== null && (
          <div className="h-7 px-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] text-neutral-500 flex items-center tabular-nums">
            {secondsAgo < 5 ? 'updated now' : `updated ${secondsAgo}s ago`}
          </div>
        )}
      </div>
    </div>
  );
}
