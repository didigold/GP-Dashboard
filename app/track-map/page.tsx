'use client';

import { useState } from 'react';
import { Header } from '../../components/navigation/Header';
import { CircuitCanvas } from '../../components/3d/CircuitCanvas';
import { CIRCUITS_DATA } from '../../lib/data/mock-race-data';
import { Layers, MapPin, Gauge, Award, Compass } from 'lucide-react';

export default function TrackMapPage() {
  const [selectedCircuitIndex, setSelectedCircuitIndex] = useState<number>(0);
  const [selectedRider, setSelectedRider] = useState<string>('1');

  const circuit = CIRCUITS_DATA[selectedCircuitIndex];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header eventName={`${circuit.name} 3D Live Simulation`} />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Circuit Selection & Stats Header */}
        <div className="glass-card p-6 rounded-2xl border border-racing-border flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-racing-cyan text-xs font-mono font-bold">
              <Compass className="w-4 h-4" />
              <span>GRAND PRIX CIRCUIT ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {circuit.name}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-racing-red" />
              <span>{circuit.place}, {circuit.nation}</span>
            </p>
          </div>

          {/* Circuit Switcher Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">SELECT CIRCUIT:</span>
            <select
              value={selectedCircuitIndex}
              onChange={(e) => setSelectedCircuitIndex(parseInt(e.target.value, 10))}
              className="bg-racing-dark text-white text-xs font-mono px-3.5 py-2 rounded-xl border border-racing-border outline-none cursor-pointer hover:border-racing-cyan transition-colors"
            >
              {CIRCUITS_DATA.map((c, i) => (
                <option key={c.name} value={i}>
                  {c.name} ({c.nation})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technical Circuit Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[11px] font-mono text-slate-400">TRACK LENGTH</div>
            <div className="text-lg font-extrabold text-white font-mono mt-1">
              {circuit.length_meters ? `${(circuit.length_meters / 1000).toFixed(3)} km` : '5.245 km'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">FIM Grade A</div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[11px] font-mono text-slate-400">CORNERS</div>
            <div className="text-lg font-extrabold text-racing-cyan font-mono mt-1">
              {circuit.corners?.total || 15} Turns
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {circuit.corners?.left || 6} Left • {circuit.corners?.right || 9} Right
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[11px] font-mono text-slate-400">LONGEST STRAIGHT</div>
            <div className="text-lg font-extrabold text-racing-yellow font-mono mt-1">
              {circuit.longest_straight_meters ? `${circuit.longest_straight_meters} m` : '1,141 m'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Main Start/Finish Straight</div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-racing-border">
            <div className="text-[11px] font-mono text-slate-400">TOP SPEED TRAP</div>
            <div className="text-lg font-extrabold text-racing-red font-mono mt-1">
              {circuit.top_speed_record?.speed_kmh || 366.1} km/h
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {circuit.top_speed_record?.rider || 'Brad Binder'}
            </div>
          </div>
        </div>

        {/* 3D Canvas Visualizer */}
        <div className="space-y-3">
          <CircuitCanvas
            circuitName={circuit.name}
            selectedRiderNumber={selectedRider}
            onSelectRider={setSelectedRider}
          />
        </div>
      </main>
    </div>
  );
}
