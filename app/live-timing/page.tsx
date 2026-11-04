'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useDelayedLiveTiming } from '@/lib/hooks/useDelayedLiveTiming';
import { LiveTimingRider } from '@/lib/types/motogp';
import {
  LiveTimingHeader,
  TrackStatus,
  LayoutMode,
} from '@/components/timing/LiveTimingHeader';
import { LiveLeaderboardWidget } from '@/components/timing/LiveLeaderboardWidget';
import { LiveTelemetryCockpit } from '@/components/timing/LiveTelemetryCockpit';
import { LiveChampionshipWidget } from '@/components/timing/LiveChampionshipWidget';
import { ReplayScrubberBar } from '@/components/timing/ReplayScrubberBar';
import { SectorTrackingTable } from '@/components/timing/SectorTrackingTable';
import { toast } from 'sonner';
import {
  GiFullMotorcycleHelmet,
  GiRoad,
  GiTrophyCup,
  GiSpeedometer,
  GiStopwatch,
  GiCardPick,
} from 'react-icons/gi';

// Dynamically import 3D Mapbox Track Map to prevent SSR canvas issues
const LiveMapboxTrackMap = dynamic(
  () => import('@/components/timing/LiveMapboxTrackMap').then((mod) => mod.LiveMapboxTrackMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[610px] bg-[#0B0D14] rounded-2xl border border-neutral-800/90 flex flex-col items-center justify-center text-neutral-400 font-sans text-xs gap-3 shadow-xl">
        <div className="w-8 h-8 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin" />
        <span className="font-sans font-bold text-white text-xs tracking-tight">
          Initializing 3D Circuit Canvas &amp; High-Contrast Spline...
        </span>
      </div>
    ),
  }
);

const SEPANG_CIRCUIT_COORDS: [number, number] = [101.7381, 2.7608];

export default function LiveTimingPage() {
  const [delay, setDelay] = useState<number>(0);
  const [isSimulation] = useState<boolean>(false);
  // Multi-select up to 2 riders for head-to-head telemetry
  const [selectedRiderNums, setSelectedRiderNums] = useState<string[]>(['93']);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('cockpit');
  const [trackStatus, setTrackStatus] = useState<TrackStatus>('CLEAR');

  // Playback & Replay state (matching 02:11:57 total session duration in reference image)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(2294); // ~38m 14s
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const totalDurationSec = 7917; // 02:11:57

  // Draggable Bento state
  const [panelOrder, setPanelOrder] = useState<string[]>([
    'leaderboard',
    'track-map',
    'championship',
    'telemetry',
    'sectors',
  ]);
  const [hiddenPanels, setHiddenPanels] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Gateway Connection state
  const [liveGatewayData, setLiveGatewayData] = useState<any>(null);
  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(false);
  const [sessionName, setSessionName] = useState<string>('Grand Prix of Malaysia · Race (20 Laps)');
  const [circuitName, setCircuitName] = useState<string>('Petronas Sepang International Circuit');
  const [availableSessions, setAvailableSessions] = useState<any[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<string>('RAC');
  const [standings, setStandings] = useState<any[]>([]);

  // Fetch Dorna live endpoint
  const checkLiveGateway = useCallback(async (sessionType?: string) => {
    try {
      const type = sessionType || selectedSessionType;
      const url = `/api/live${type ? `?sessionType=${type}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data && data.active && data.data) {
        setIsGatewayActive(true);
        setLiveGatewayData(data.data);
        if (data.sessionName) setSessionName(data.sessionName);
        if (data.event?.circuit?.name) setCircuitName(data.event.circuit.name);
        if (data.availableSessions) setAvailableSessions(data.availableSessions);
        if (data.standings) setStandings(data.standings);
      }
    } catch (err) {
      console.warn('Live gateway connection check failed:', err);
    }
  }, [selectedSessionType]);

  useEffect(() => {
    checkLiveGateway();
    const interval = setInterval(() => checkLiveGateway(), 10000);
    return () => clearInterval(interval);
  }, [checkLiveGateway]);

  // Handle session change from header dropdown
  const handleSelectSessionType = (type: string) => {
    setSelectedSessionType(type);
    checkLiveGateway(type);
  };

  // Timer increment loop for replay playback
  useEffect(() => {
    if (!isPlaying) return;
    const timerInterval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        if (prev >= totalDurationSec) return 0;
        return prev + 1 * playbackSpeed;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(timerInterval);
  }, [isPlaying, playbackSpeed, totalDurationSec]);

  const currentTimingState = useDelayedLiveTiming(liveGatewayData, delay, isSimulation);

  const ridersList: LiveTimingRider[] = useMemo(() => {
    return (
      Object.values(currentTimingState.rider || {}) as LiveTimingRider[]
    ).sort((a, b) => a.pos - b.pos);
  }, [currentTimingState.rider]);

  // Handle rider toggle selection (up to 2 drivers max)
  const handleToggleSelectRider = (riderNum: string) => {
    setSelectedRiderNums((prev) => {
      if (prev.includes(riderNum)) {
        return prev.filter((n) => n !== riderNum);
      }
      if (prev.length >= 2) {
        return [prev[0], riderNum];
      }
      return [...prev, riderNum];
    });
  };

  const handleDeselectRider = (riderNum: string) => {
    setSelectedRiderNums((prev) => prev.filter((n) => n !== riderNum));
  };

  // Find objects for selected riders
  const selectedRiderObjects = useMemo(() => {
    return selectedRiderNums
      .map((num) => ridersList.find((r) => r.rider_number === num))
      .filter(Boolean) as LiveTimingRider[];
  }, [selectedRiderNums, ridersList]);

  // Derive lap from current elapsed time
  const currentLap = Math.min(20, Math.max(1, Math.floor((currentTimeSec / totalDurationSec) * 20) + 1));

  // Drag and Drop Handlers for Magic Bento Reordering
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggingId && draggingId !== targetId && dropTargetId !== targetId) {
      setDropTargetId(targetId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, targetId: string) => {
    if (dropTargetId === targetId) {
      setDropTargetId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }

    setPanelOrder((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(draggingId);
      const toIdx = next.indexOf(targetId);
      if (fromIdx !== -1 && toIdx !== -1) {
        const item = next.splice(fromIdx, 1)[0];
        next.splice(toIdx, 0, item);
      }
      return next;
    });

    toast.success(`Customized layout: Moved ${draggingId} next to ${targetId}`);
    setDraggingId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  const handleResetLayout = () => {
    setPanelOrder(['leaderboard', 'track-map', 'championship', 'telemetry', 'sectors']);
    setHiddenPanels([]);
    setLayoutMode('cockpit');
    toast.info('Workspace layout reset to default cockpit');
  };

  const handleHidePanel = (id: string) => {
    setHiddenPanels((prev) => [...prev, id]);
    toast.info(`Hidden panel. Click Reset in top bar to restore.`);
  };

  // Render dictionary of individual panels directly as first-class Magic Bento cards
  const renderPanel = (panelId: string, customClass = '') => {
    if (hiddenPanels.includes(panelId)) return null;

    const isDragging = draggingId === panelId;
    const isDropTarget = dropTargetId === panelId;

    switch (panelId) {
      case 'leaderboard':
        return (
          <LiveLeaderboardWidget
            key="leaderboard"
            riders={ridersList}
            selectedRiderNums={selectedRiderNums}
            onToggleSelectRider={handleToggleSelectRider}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={customClass}
          />
        );

      case 'track-map':
        return (
          <LiveMapboxTrackMap
            key="track-map"
            riders={ridersList}
            selectedRiderNum={selectedRiderNums[0] || '93'}
            selectedRiderNums={selectedRiderNums}
            onSelectRider={handleToggleSelectRider}
            circuitName={circuitName}
            circuitCoords={SEPANG_CIRCUIT_COORDS}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`h-[610px] ${customClass}`}
          />
        );

      case 'championship':
        return (
          <LiveChampionshipWidget
            key="championship"
            standings={standings}
            riders={ridersList}
            sessionType={selectedSessionType}
            selectedRiderNum={selectedRiderNums[0]}
            onSelectRider={handleToggleSelectRider}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={customClass}
          />
        );

      case 'telemetry':
        return (
          <LiveTelemetryCockpit
            key="telemetry"
            selectedRiders={selectedRiderObjects}
            allRiders={ridersList}
            onDeselectRider={handleDeselectRider}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={customClass}
          />
        );

      case 'sectors':
        return (
          <SectorTrackingTable
            key="sectors"
            riders={ridersList}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={customClass}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white p-3 sm:p-4 lg:p-5 space-y-3.5 max-w-[1920px] mx-auto select-none font-sans">
      {/* 1. TOP COMMAND & WEATHER HUD BAR (Sora Typography & Game Icons) */}
      <LiveTimingHeader
        sessionName={sessionName}
        circuitName={circuitName}
        elapsedSeconds={currentTimeSec}
        totalLaps={20}
        currentLap={currentLap}
        isGatewayActive={isGatewayActive}
        trackStatus={trackStatus}
        onChangeTrackStatus={setTrackStatus}
        availableSessions={availableSessions}
        selectedSessionType={selectedSessionType}
        onSelectSessionType={handleSelectSessionType}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        onResetLayout={handleResetLayout}
        airTemp={33.8}
        trackTemp={48.2}
        humidity={61.5}
      />

      {/* 2. DYNAMIC WORKSPACE GRID WITH DRAGGABLE MAGIC BENTO CARDS */}
      {layoutMode === 'cockpit' && (
        /* PRO COCKPIT 3-COLUMN LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Left Column: Leaderboard (~25% / col-span-3) */}
          <div className="lg:col-span-3 xl:col-span-3">
            {renderPanel('leaderboard')}
          </div>

          {/* Center Column: 3D Mapbox Track Map (~50% / col-span-6) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-3.5">
            {renderPanel('track-map')}
          </div>

          {/* Right Column: Live Championship + Telemetry (~25% / col-span-3) */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-3.5">
            {renderPanel('championship')}
            {renderPanel('telemetry')}
          </div>
        </div>
      )}

      {layoutMode === 'map-focus' && (
        /* CINEMA / MAP FOCUS LAYOUT (Matching Reference media_1793830147734_258a3860.jpg) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Main 8-Column Column: Large 3D Map on Top + Wide Leaderboard below */}
          <div className="lg:col-span-8 flex flex-col gap-3.5">
            {renderPanel('track-map')}
            {renderPanel('leaderboard')}
            {renderPanel('sectors')}
          </div>

          {/* Right 4-Column Column: Championship & Telemetry Stacked */}
          <div className="lg:col-span-4 space-y-3.5">
            {renderPanel('championship')}
            {renderPanel('telemetry')}
          </div>
        </div>
      )}

      {layoutMode === 'table-focus' && (
        /* TIMING FOCUS LAYOUT (Matching Reference media_1793830139520_bc9a8d16.jpg) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Left 8-Column Column: Wide Leaderboard with Mini-Sectors & Sector Matrix */}
          <div className="lg:col-span-8 space-y-3.5">
            {renderPanel('leaderboard')}
            {renderPanel('sectors')}
          </div>

          {/* Right 4-Column Column: 3D Map Top Right, Championship & Telemetry below */}
          <div className="lg:col-span-4 space-y-3.5">
            {renderPanel('track-map')}
            {renderPanel('championship')}
            {renderPanel('telemetry')}
          </div>
        </div>
      )}

      {layoutMode === 'custom-bento' && (
        /* CUSTOM MAGIC BENTO REORDERABLE GRID */
        <div className="space-y-3.5">
          <div className="flex items-center justify-between bg-neutral-900/60 px-4 py-2 rounded-xl border border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <GiCardPick className="w-4 h-4 text-[#00F5D4]" />
              <span className="font-bold text-white">Custom Magic Bento:</span>
              <span className="text-neutral-400">
                Drag any card by its header grip handle to reorder your workspace in real-time.
              </span>
            </div>
            <button
              onClick={handleResetLayout}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors"
            >
              Reset to Default
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-start">
            {panelOrder.map((id) => {
              // Custom responsive widths for each panel in Custom Bento mode
              let spanClass = 'lg:col-span-6';
              if (id === 'track-map') spanClass = 'lg:col-span-7';
              if (id === 'leaderboard') spanClass = 'lg:col-span-5';
              if (id === 'sectors') spanClass = 'lg:col-span-12';
              return (
                <div key={id} className={spanClass}>
                  {renderPanel(id)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. BOTTOM SESSION REPLAY SCRUBBER (Matching Reference media_1793816610776_f44ea7b8.jpg) */}
      <ReplayScrubberBar
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        currentTimeSec={currentTimeSec}
        totalDurationSec={totalDurationSec}
        onSeek={setCurrentTimeSec}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
        tvDelay={delay}
        onChangeTvDelay={setDelay}
      />
    </div>
  );
}
