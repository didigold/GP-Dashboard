'use client';

import { Header } from '../../components/navigation/Header';
import { Calendar, MapPin, Flag, Clock } from 'lucide-react';

const CALENDAR_EVENTS = [
  { round: 1, name: 'Qatar Airways Grand Prix of Qatar', circuit: 'Lusail International Circuit', date: 'March 8 - 10', country: 'Qatar', sprint: true },
  { round: 2, name: 'Grande Prémio Tissot de Portugal', circuit: 'Autódromo Internacional do Algarve', date: 'March 22 - 24', country: 'Portugal', sprint: true },
  { round: 3, name: 'Red Bull Grand Prix of The Americas', circuit: 'Circuit of The Americas (COTA)', date: 'April 12 - 14', country: 'United States', sprint: true },
  { round: 4, name: 'Gran Premio Estrella Galicia 0,0 de España', circuit: 'Circuito de Jerez-Ángel Nieto', date: 'April 26 - 28', country: 'Spain', sprint: true },
  { round: 5, name: 'Michelin® Grand Prix de France', circuit: 'Le Mans Bugatti Circuit', date: 'May 10 - 12', country: 'France', sprint: true },
  { round: 6, name: 'Gran Premi Monster Energy de Catalunya', circuit: 'Circuit de Barcelona-Catalunya', date: 'May 24 - 26', country: 'Spain', sprint: true },
  { round: 7, name: 'Gran Premio d’Italia Brembo', circuit: 'Autodromo del Mugello', date: 'May 31 - June 2', country: 'Italy', sprint: true },
  { round: 8, name: 'Motul TT Assen', circuit: 'TT Circuit Assen', date: 'June 28 - 30', country: 'Netherlands', sprint: true },
  { round: 9, name: 'Liqui Moly Motorrad Grand Prix Deutschland', circuit: 'Sachsenring', date: 'July 5 - 7', country: 'Germany', sprint: true },
  { round: 10, name: 'Monster Energy British Grand Prix', circuit: 'Silverstone Circuit', date: 'August 2 - 4', country: 'United Kingdom', sprint: true },
  { round: 11, name: 'Motorrad Grand Prix von Österreich', circuit: 'Red Bull Ring - Spielberg', date: 'August 16 - 18', country: 'Austria', sprint: true },
  { round: 12, name: 'Gran Premio Red Bull di San Marino e della Riviera di Rimini', circuit: 'Misano World Circuit Marco Simoncelli', date: 'September 6 - 8', country: 'Italy', sprint: true },
  { round: 13, name: 'Grand Prix of Japan', circuit: 'Mobility Resort Motegi', date: 'October 4 - 6', country: 'Japan', sprint: true },
  { round: 14, name: 'Australian Motorcycle Grand Prix', circuit: 'Phillip Island Grand Prix Circuit', date: 'October 18 - 20', country: 'Australia', sprint: true },
  { round: 15, name: 'Gran Premio Motul de la Comunitat Valenciana', circuit: 'Circuit Ricardo Tormo', date: 'November 15 - 17', country: 'Spain', sprint: true },
];

export default function SchedulePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName="MotoGP™ Official Grand Prix Schedule" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-racing-cyan">
            <Calendar className="w-4 h-4" />
            <span>CALENDAR & SESSIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Grand Prix Schedule
          </h1>
          <p className="text-xs text-slate-400">
            Sprint and Grand Prix weekend timetables, local track session times, and circuit locations.
          </p>
        </div>

        {/* Schedule Table */}
        <div className="glass-card rounded-2xl border border-racing-border overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-racing-border bg-racing-dark/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-16 text-center">RND</th>
                <th className="py-3.5 px-4">EVENT</th>
                <th className="py-3.5 px-4">CIRCUIT</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4 text-center">FORMAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-racing-border/40 font-mono text-xs">
              {CALENDAR_EVENTS.map((event) => (
                <tr key={event.round} className="hover:bg-racing-cardHover transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className="inline-block w-6 h-6 rounded-md bg-racing-card text-white text-center leading-6">
                      {event.round}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold text-white text-sm">
                    {event.name}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-sans flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-racing-cyan" />
                    <span>{event.circuit}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {event.date}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-racing-purple/20 text-racing-purple border border-racing-purple/30">
                      SPRINT + GP
                    </span>
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
