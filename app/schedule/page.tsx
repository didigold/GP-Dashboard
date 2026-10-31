'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink, Flag, FileText } from 'lucide-react';

const SEASONS = [
  { year: 2024, id: 'dd12382e-1d9f-46ee-a5f7-c5104db28e43' },
  { year: 2025, id: 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4' },
  { year: 2026, id: 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e' },
];

interface EventItem {
  id: string;
  name: string;
  sponsored_name?: string;
  status: string;
  date_start: string;
  date_end: string;
  country: { iso: string; name: string };
  circuit: { name: string; place: string };
  event_files?: {
    circuit_information?: { url: string };
  };
}

export default function SchedulePage() {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/motogp/results/events?seasonUuid=${selectedSeason.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);
          }
        }
      } catch (err) {
        console.error('Failed to load schedule from Pulselive:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSchedule();
  }, [selectedSeason]);

  const grandPrixEvents = events.filter((e) => !e.name.toLowerCase().includes('test'));

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="motogp">Official Calendar</Badge>
            <Badge variant="outline">api.motogp.pulselive.com</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            Official Grand Prix Schedule
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Real official Dorna calendar: dates, circuits, countries, and direct links to official FIM circuit specifications.
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
              {season.year} Season
            </Button>
          ))}
        </div>
      </div>

      {/* Schedule Table */}
      <div className="border border-neutral-800 overflow-hidden bg-[#0A0A0A]">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-[11px] font-sans font-semibold">
              <th className="py-3 px-4 w-14 text-center">Round</th>
              <th className="py-3 px-4">Grand Prix Event</th>
              <th className="py-3 px-4">Circuit &amp; Location</th>
              <th className="py-3 px-4">Dates</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Official Documents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-mono">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500 font-mono text-xs">
                  Loading official calendar from Pulselive API...
                </td>
              </tr>
            ) : (
              grandPrixEvents.map((ev, idx) => (
                <tr key={ev.id || idx} className="hover:bg-neutral-900/60 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-white">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-white text-sm">
                      {ev.sponsored_name || ev.name}
                    </div>
                    <div className="text-[10px] text-neutral-500">{ev.country?.name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-light font-sans">
                    <div>{ev.circuit?.name || 'Grand Prix Circuit'}</div>
                    <div className="text-[10px] text-neutral-500">{ev.circuit?.place}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-medium whitespace-nowrap">
                    {ev.date_start} — {ev.date_end}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={ev.status === 'FINISHED' ? 'secondary' : 'motogp'}>
                      {ev.status === 'FINISHED' ? 'Finished' : (ev.status || 'Scheduled')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {ev.event_files?.circuit_information?.url ? (
                      <a
                        href={ev.event_files.circuit_information.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#E10600]" />
                        <span>Circuit PDF</span>
                      </a>
                    ) : (
                      <span className="text-neutral-600 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
