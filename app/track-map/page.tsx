'use client';

import { useState } from 'react';
import { CircuitCanvas } from '../../components/3d/CircuitCanvas';
import { CIRCUITS_DATA } from '../../lib/data/mock-race-data';
import { MapPin, Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TrackMapPage() {
  const [selectedCircuitIndex, setSelectedCircuitIndex] = useState<number>(0);
  const [selectedRider, setSelectedRider] = useState<string>('1');

  const circuit = CIRCUITS_DATA[selectedCircuitIndex];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black">
      {/* Top Motorsport Sub-Header Banner */}
      <div className="border-b border-[#262626] bg-[#0A0A0A] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#E10600]" />
          <div>
            <h1 className="text-sm font-bold text-white">
              {circuit.name} 3D Simulation
            </h1>
            <p className="text-[11px] font-mono text-[#888888]">
              FIM Grade A • High-speed apex &amp; run-off telemetry
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#262626] bg-black text-[#A0A0A0] font-mono text-[11px]">
            WebGL Renderer
          </Badge>
          <Badge className="bg-[#E10600] text-white hover:bg-[#E10600] font-mono text-[11px]">
            3D Track Map
          </Badge>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Circuit Selection & Stats Header */}
        <Card className="border-[#262626] bg-[#0A0A0A]">
          <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#0066FF] text-xs font-mono font-bold">
                <Compass className="w-4 h-4" />
                <span>Grand Prix Circuit Architecture</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                {circuit.name}
              </h2>
              <p className="text-xs text-[#888888] font-mono flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                <span>{circuit.place}, {circuit.nation}</span>
              </p>
            </div>

            {/* Circuit Switcher Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#888888]">Select circuit:</span>
              <select
                value={selectedCircuitIndex}
                onChange={(e) => setSelectedCircuitIndex(parseInt(e.target.value, 10))}
                className="bg-black text-white text-xs font-mono px-3.5 py-2 rounded-xl border border-[#262626] outline-none cursor-pointer hover:border-[#E10600] transition-colors"
              >
                {CIRCUITS_DATA.map((c, i) => (
                  <option key={c.name} value={i} className="bg-black text-white">
                    {c.name} ({c.nation})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 3D Canvas Visualizer (Hero Centerpiece) */}
        <div className="border border-[#262626] bg-[#0A0A0A] h-[600px] relative overflow-hidden">
          <CircuitCanvas
            circuitName={circuit.name}
            selectedRiderNumber={selectedRider}
            onSelectRider={setSelectedRider}
          />
        </div>

        {/* Technical Circuit Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">Track Length</div>
              <div className="text-xl font-bold text-white font-mono mt-1">
                {circuit.length_meters ? `${(circuit.length_meters / 1000).toFixed(3)} km` : '5.245 km'}
              </div>
              <div className="text-[10px] text-[#888888] font-mono mt-0.5">FIM Grade A Approved</div>
            </CardContent>
          </Card>

          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">Corners</div>
              <div className="text-xl font-bold text-[#0066FF] font-mono mt-1">
                {circuit.corners?.total || 15} Turns
              </div>
              <div className="text-[10px] text-[#888888] font-mono mt-0.5">
                {circuit.corners?.left || 6} Left • {circuit.corners?.right || 9} Right
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">Longest Straight</div>
              <div className="text-xl font-bold text-[#E5A93C] font-mono mt-1">
                {circuit.longest_straight_meters ? `${circuit.longest_straight_meters} m` : '1,141 m'}
              </div>
              <div className="text-[10px] text-[#888888] font-mono mt-0.5">Main Start/Finish Straight</div>
            </CardContent>
          </Card>

          <Card className="border-[#262626] bg-[#0A0A0A]">
            <CardContent className="p-4">
              <div className="text-[10px] font-mono text-[#888888]">Top Speed Trap</div>
              <div className="text-xl font-bold text-[#E10600] font-mono mt-1">
                {circuit.top_speed_record?.speed_kmh || 366.1} km/h
              </div>
              <div className="text-[10px] text-[#888888] font-mono mt-0.5">
                {circuit.top_speed_record?.rider || 'Brad Binder'} (KTM RC16)
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
