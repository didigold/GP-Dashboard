'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LiveTimingRider } from '@/lib/types/motogp';
import { getRiderByNumber } from '@/lib/data/motogp-grid';
import circuitSvgs from '@/lib/data/circuit-svgs.json';
import { CircuitCanvas } from '@/components/3d/CircuitCanvas';
import {
  Layers,
  MapPin,
  Eye,
  Maximize2,
  Minimize2,
  Compass,
  Zap,
  Moon,
  Sun,
  Camera,
  RotateCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LiveTrackMapWidgetProps {
  riders: LiveTimingRider[];
  selectedRiderNum?: string;
  onSelectRider?: (riderNum: string) => void;
  circuitName?: string;
  circuitKey?: string;
  isPlaying?: boolean;
  playbackSpeed?: number;
  className?: string;
}

// Corner Apex Annotations for Sepang International Circuit
const SEPANG_CORNERS = [
  { name: 'T1', x: 440, y: 130, angle: 'Heavy Braking' },
  { name: 'T2', x: 420, y: 70, angle: 'Left Apex' },
  { name: 'T4', x: 280, y: 75, angle: 'Right Sweeper' },
  { name: 'T5', x: 230, y: 140, angle: 'High Speed' },
  { name: 'T9', x: 100, y: 220, angle: 'Slow Left' },
  { name: 'T11', x: 140, y: 350, angle: 'Right Transition' },
  { name: 'T14', x: 260, y: 390, angle: 'Hairpin Entry' },
  { name: 'T15', x: 180, y: 415, angle: 'Final Hairpin' },
];

export function LiveTrackMapWidget({
  riders,
  selectedRiderNum = '37',
  onSelectRider,
  circuitName = 'Petronas Sepang International Circuit',
  circuitKey = 'round-19-malaysia',
  isPlaying = true,
  playbackSpeed = 1,
  className = '',
}: LiveTrackMapWidgetProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [showDriverCodes, setShowDriverCodes] = useState<boolean>(true);
  const [showCorners, setShowCorners] = useState<boolean>(true);
  const [showSpeedTrap, setShowSpeedTrap] = useState<boolean>(true);
  const [mapTheme, setMapTheme] = useState<'night' | 'day'>('night');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredRider, setHoveredRider] = useState<LiveTimingRider | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState<number>(0);

  // Animated progress state for riders
  const [riderProgresses, setRiderProgresses] = useState<Record<string, number>>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const svgD = (circuitSvgs as Record<string, string>)[circuitKey] || (circuitSvgs as any)['round-19-malaysia'];

  // Initialize track path length
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) {
        setPathLength(len);
      }
    }
  }, [svgD, viewMode]);

  // Initial rider positions spread naturally across the track
  useEffect(() => {
    const initial: Record<string, number> = {};
    const sorted = [...riders].sort((a, b) => a.pos - b.pos);
    sorted.forEach((r, idx) => {
      // Leader at ~0.82, each follower slightly behind
      const offset = (0.82 - idx * 0.038 + 1.0) % 1.0;
      initial[r.rider_number] = offset;
    });
    setRiderProgresses(initial);
  }, [riders.length]);

  // Smooth continuous real-time animation loop along track ribbon
  useEffect(() => {
    if (viewMode !== '2d') return;

    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying && delta > 0 && delta < 0.2) {
        setRiderProgresses((prev) => {
          const next = { ...prev };
          riders.forEach((r, idx) => {
            const current = next[r.rider_number] ?? (0.8 - idx * 0.04);
            // Lap time is ~117s (1'57), so speed is 1 / 117 per second * playbackSpeed
            const baseSpeed = 1 / 117.5;
            const jitter = 1 + (idx === 0 ? 0.02 : -0.01 * idx);
            const increment = baseSpeed * jitter * delta * playbackSpeed;
            next[r.rider_number] = (current + increment) % 1.0;
          });
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, riders, viewMode]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`border border-neutral-800 bg-[#0B0D12] overflow-hidden rounded-2xl flex flex-col relative ${className}`}
    >
      {/* Top Header & Interactive Controls Strip */}
      <div className="p-3 bg-neutral-950/80 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 font-mono text-xs z-10">
        {/* Left: Circuit Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
          <span className="font-bold text-white text-xs tracking-tight">
            Track Map
          </span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-400 text-[11px] hidden md:inline truncate max-w-[200px] lg:max-w-xs">
            {circuitName}
          </span>
        </div>

        {/* Center / Right: Interactive HUD Toggles */}
        <div className="flex items-center gap-2">
          {/* Driver codes toggle */}
          <button
            onClick={() => setShowDriverCodes(!showDriverCodes)}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
              showDriverCodes
                ? 'bg-neutral-800 border-neutral-700 text-white'
                : 'bg-transparent border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Toggle driver codes on track"
          >
            Codes
          </button>

          {/* Corner Numbers toggle */}
          <button
            onClick={() => setShowCorners(!showCorners)}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
              showCorners
                ? 'bg-neutral-800 border-neutral-700 text-white'
                : 'bg-transparent border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Toggle turn apex markers"
          >
            Turns
          </button>

          {/* Mode Switcher: 2D Vector / 3D WebGL */}
          <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                viewMode === '2d'
                  ? 'bg-[#E10600] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-[#E10600] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              3D
            </button>
          </div>

          {/* Theme Switcher: Night / Day */}
          <button
            onClick={() => setMapTheme(mapTheme === 'night' ? 'day' : 'night')}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Toggle Map Atmosphere"
          >
            {mapTheme === 'night' ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative flex-1 min-h-[440px] lg:min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {viewMode === '2d' ? (
          <div
            className={`w-full h-full flex items-center justify-center p-4 relative select-none transition-colors duration-500 ${
              mapTheme === 'night' ? 'bg-[#06080D]' : 'bg-[#141A24]'
            }`}
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

            <div className="w-full h-full max-w-4xl max-h-[580px] relative flex items-center justify-center">
              <svg
                viewBox="20 20 460 440"
                className="w-full h-full filter drop-shadow-[0_0_24px_rgba(225,6,0,0.18)]"
              >
                <defs>
                  {/* Glowing Sector Gradients */}
                  <linearGradient id="sepangSectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E10600" />
                    <stop offset="30%" stopColor="#F59E0B" />
                    <stop offset="65%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>

                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Outer Deep Road Outline */}
                <path
                  d={svgD}
                  fill="none"
                  stroke="#161F30"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Asphalt Track Surface with Sector Colors */}
                <path
                  ref={pathRef}
                  d={svgD}
                  fill="none"
                  stroke="url(#sepangSectorGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 3. High-Contrast Inner Racing Line */}
                <path
                  d={svgD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeDasharray="4 6"
                  opacity="0.85"
                />

                {/* Start / Finish Gantry Line */}
                <g transform="translate(185, 415) rotate(78)">
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFFFFF" strokeWidth="4" />
                  <line x1="-12" y1="2" x2="12" y2="2" stroke="#E10600" strokeWidth="2" />
                </g>

                {/* 4. Turn Apex Badges (T1 to T15) */}
                {showCorners &&
                  SEPANG_CORNERS.map((corner) => (
                    <g key={corner.name} className="pointer-events-none">
                      <circle
                        cx={corner.x}
                        cy={corner.y}
                        r="8.5"
                        fill="#0A0D14"
                        stroke="#334155"
                        strokeWidth="1.5"
                      />
                      <text
                        x={corner.x}
                        y={corner.y + 3.2}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {corner.name}
                      </text>
                    </g>
                  ))}

                {/* 5. Speed Trap Radar Marker */}
                {showSpeedTrap && (
                  <g className="pointer-events-none">
                    <circle cx="280" cy="74" r="7" fill="#E10600" opacity="0.4" className="animate-ping" />
                    <circle cx="280" cy="74" r="4.5" fill="#E10600" />
                    <rect
                      x="235"
                      y="48"
                      width="90"
                      height="18"
                      rx="4"
                      fill="#0B0D12"
                      stroke="#E10600"
                      strokeWidth="1"
                    />
                    <text
                      x="280"
                      y="60.5"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      SPEED TRAP · 362.8
                    </text>
                  </g>
                )}

                {/* 6. Real-Time Moving Bike Markers along the Circuit Ribbon */}
                {pathLength > 0 &&
                  riders.map((r) => {
                    const progress = riderProgresses[r.rider_number] ?? 0;
                    const distance = progress * pathLength;
                    let pt = { x: 0, y: 0 };
                    try {
                      if (pathRef.current) {
                        pt = pathRef.current.getPointAtLength(distance);
                      }
                    } catch {
                      // fallback
                    }

                    if (!pt.x && !pt.y) return null;

                    const isSelected = selectedRiderNum === r.rider_number;
                    const gridRider = getRiderByNumber(r.rider_number);
                    const riderColor = r.color || '#E10600';

                    return (
                      <g
                        key={r.rider_number}
                        transform={`translate(${pt.x}, ${pt.y})`}
                        onClick={() => onSelectRider && onSelectRider(r.rider_number)}
                        onMouseEnter={() => setHoveredRider(r)}
                        onMouseLeave={() => setHoveredRider(null)}
                        className="cursor-pointer group"
                      >
                        {/* Outer Glow / Pulse for Selected Rider */}
                        {isSelected && (
                          <circle
                            r="15"
                            fill={riderColor}
                            opacity="0.3"
                            className="animate-ping"
                          />
                        )}

                        {/* Selected Rider Spotlight Halo */}
                        {isSelected && (
                          <circle
                            r="12"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            opacity="0.9"
                          />
                        )}

                        {/* Bike Dot */}
                        <circle
                          r={isSelected ? '8' : '6.5'}
                          fill={riderColor}
                          stroke="#FFFFFF"
                          strokeWidth={isSelected ? '2' : '1.2'}
                          className="transition-all duration-150 drop-shadow-md"
                        />

                        {/* Rider Number on Dot */}
                        <text
                          y="2.8"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize={isSelected ? '7.5' : '6.5'}
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {r.rider_number}
                        </text>

                        {/* Driver Code / Name Tag Flag (Always visible or toggled) */}
                        {showDriverCodes && (
                          <g transform="translate(11, -7)" className="pointer-events-none">
                            <rect
                              x="0"
                              y="-8"
                              width={isSelected ? '38' : '30'}
                              height="14"
                              rx="3"
                              fill="#07090F"
                              stroke={isSelected ? riderColor : '#2A364F'}
                              strokeWidth={isSelected ? '1.5' : '1'}
                              opacity="0.95"
                            />
                            <text
                              x={isSelected ? '19' : '15'}
                              y="2.5"
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize={isSelected ? '8' : '7'}
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase()}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
              </svg>
            </div>

            {/* Hover Tooltip Card */}
            {hoveredRider && (
              <div className="absolute top-4 right-4 bg-black/90 border border-neutral-700 rounded-xl p-3 shadow-2xl pointer-events-none font-mono text-xs z-30 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: hoveredRider.color || '#E10600' }}
                  />
                  <span className="font-bold text-white">
                    #{hoveredRider.rider_number} {hoveredRider.rider_surname}
                  </span>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    P{hoveredRider.pos}
                  </Badge>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Speed: <strong className="text-white">{hoveredRider.speed || 342.8} km/h</strong> · Gap: {hoveredRider.gap_first}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 3D WebGL Canvas Mode */
          <div className="w-full h-full min-h-[500px]">
            <CircuitCanvas
              circuitName={circuitName}
              selectedRiderNumber={selectedRiderNum}
              onSelectRider={onSelectRider}
              hideHeader={true}
            />
          </div>
        )}
      </div>

      {/* Bottom Track Telemetry Mini Ribbon */}
      <div className="p-2.5 bg-neutral-950 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-3">
          <span>Length: <strong className="text-white">5.543 km</strong></span>
          <span className="text-neutral-700">|</span>
          <span>Corners: <strong className="text-white">15 (5L / 10R)</strong></span>
          <span className="text-neutral-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Straight: <strong className="text-white">920 m</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Selected:</span>
          <span className="font-bold text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
            #{selectedRiderNum}
          </span>
        </div>
      </div>
    </div>
  );
}
