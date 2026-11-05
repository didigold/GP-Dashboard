'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useDelayedLiveTiming } from '@/lib/hooks/useDelayedLiveTiming';
import { LiveTimingRider } from '@/lib/types/motogp';
import {
  LiveTimingHeader,
  TrackStatus,
  LayoutMode,
  WeatherSimPreset,
} from '@/components/timing/LiveTimingHeader';
import { LiveLeaderboardWidget } from '@/components/timing/LiveLeaderboardWidget';
import { LiveTelemetryCockpit } from '@/components/timing/LiveTelemetryCockpit';
import { LiveDynamicCarouselWidget } from '@/components/timing/LiveDynamicCarouselWidget';
import { ReplayScrubberBar, TimelineIncidentMarker } from '@/components/timing/ReplayScrubberBar';
import { SectorTrackingTable } from '@/components/timing/SectorTrackingTable';
import { RaceControlAlert } from '@/components/timing/RaceControlEventBanner';
import { toast } from 'sonner';
import { GiCardPick } from 'react-icons/gi';

const LiveMapboxTrackMap = dynamic(
  () => import('@/components/timing/LiveMapboxTrackMap').then((mod) => mod.LiveMapboxTrackMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] bg-[#0D0D0E]/90 rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center text-neutral-400 font-sans text-xs gap-3 shadow-2xl">
        <div className="w-7 h-7 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin" />
        <span className="font-sans font-bold text-white text-xs tracking-tight">
          Loading 3D Circuit Asphalt &amp; FIA/FIM Kerb Spline...
        </span>
      </div>
    ),
  }
);

const SEPANG_CIRCUIT_COORDS: [number, number] = [101.7375, 2.7608];

export default function LiveTimingPage() {
  const [delay, setDelay] = useState<number>(0);
  const [isSimulation] = useState<boolean>(false);
  // Default to 2 contenders (#93 Marquez vs #37 Acosta) to showcase real-time battle comparison
  const [selectedRiderNums, setSelectedRiderNums] = useState<string[]>(['93', '37']);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('cockpit');
  const [trackStatus, setTrackStatus] = useState<TrackStatus>('CLEAR');
  const [weatherPreset, setWeatherPreset] = useState<WeatherSimPreset>('dry');
  const [activeAlert, setActiveAlert] = useState<RaceControlAlert | null>(null);

  // Playback & Replay state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(2294);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const totalDurationSec = 7917;

  // Draggable Bento state
  const [panelOrder, setPanelOrder] = useState<string[]>([
    'leaderboard',
    'track-map',
    'championship',
    'telemetry',
    'sectors',
  ]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Gateway Connection state
  const [liveGatewayData, setLiveGatewayData] = useState<any>(null);
  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(false);
  const [sessionName, setSessionName] = useState<string>('Petronas Grand Prix of Malaysia');
  const [circuitName, setCircuitName] = useState<string>('Petronas Sepang International Circuit');
  const [availableSessions, setAvailableSessions] = useState<any[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<string>('RAC');
  const [standings, setStandings] = useState<any[]>([]);

  const checkLiveGateway = useCallback(
    async (sessionType?: string) => {
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
    },
    [selectedSessionType]
  );

  useEffect(() => {
    checkLiveGateway();
    const interval = setInterval(() => checkLiveGateway(), 10000);
    return () => clearInterval(interval);
  }, [checkLiveGateway]);

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
    }, 1000 / Math.min(10, playbackSpeed));

    return () => clearInterval(timerInterval);
  }, [isPlaying, playbackSpeed, totalDurationSec]);

  const currentTimingState = useDelayedLiveTiming(liveGatewayData, delay, isSimulation);

  const ridersList: LiveTimingRider[] = useMemo(() => {
    return (Object.values(currentTimingState.rider || {}) as LiveTimingRider[]).sort(
      (a, b) => a.pos - b.pos
    );
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

  // Toggle 2-Driver Battle Mode between P1 & P2
  const handleQuickCompareTop2 = () => {
    if (selectedRiderNums.length >= 2) {
      setSelectedRiderNums([ridersList[0]?.rider_number || '93']);
    } else {
      const r1 = ridersList[0]?.rider_number || '93';
      const r2 = ridersList[1]?.rider_number || '37';
      setSelectedRiderNums([r1, r2]);
    }
  };

  // Handle Weather Simulation Preset Change & Broadcast Notification Banner
  const handleChangeWeatherPreset = (preset: WeatherSimPreset) => {
    setWeatherPreset(preset);
    if (preset === 'heavy-wet') {
      setActiveAlert({
        id: `wet-${Date.now()}`,
        type: 'wet',
        title: 'White Cross Flag · Wet Race Declared',
        subtitle: '3.4 mm Rain Detected — Riders Permitted to Enter Pit for Wet-Tyre Bike Swap',
        timestampStr: 'LIVE SENSOR',
      });
    } else if (preset === 'light-rain') {
      setActiveAlert({
        id: `light-rain-${Date.now()}`,
        type: 'wet',
        title: 'Rain Drops Reported in Sector 2 & 3',
        subtitle: '0.8 mm Precipitation — Surface Grip Reduced at Turn 5–8',
        timestampStr: 'LIVE SENSOR',
      });
    } else {
      setActiveAlert({
        id: `dry-${Date.now()}`,
        type: 'clear',
        title: 'Track Surface Dry · Slick Allocation Optimal',
        subtitle: 'Asphalt Temp 48.2°C — High Grip Conditions Restored',
        timestampStr: 'LIVE SENSOR',
      });
    }
  };

  // Handle Track Flag Status Change & Broadcast Notification Banner
  const handleChangeTrackStatus = (status: TrackStatus) => {
    setTrackStatus(status);
    if (status === 'YELLOW') {
      setActiveAlert({
        id: `yellow-${Date.now()}`,
        type: 'yellow',
        title: 'Yellow Flag · Sector 1 (Turn 4)',
        subtitle: 'Marshal Recovery in Progress — No Overtaking in Sector 1',
        timestampStr: 'STEWARD DESK',
      });
    } else if (status === 'RED') {
      setActiveAlert({
        id: `red-${Date.now()}`,
        type: 'red',
        title: 'Session Red Flagged · All Riders Return to Pit Lane',
        subtitle: 'Track Surface Inspection by FIM Safety Officer',
        timestampStr: 'RACE DIRECTION',
      });
    } else {
      setActiveAlert(null);
    }
  };

  // Handle Seeking & Timeline Incident Pin Clicks
  const handleSeek = (seconds: number, marker?: TimelineIncidentMarker) => {
    setCurrentTimeSec(seconds);
    if (marker) {
      if (marker.type === 'wet') {
        handleChangeWeatherPreset('heavy-wet');
      } else if (marker.type === 'yellow') {
        handleChangeTrackStatus('YELLOW');
      } else if (marker.type === 'purple') {
        setActiveAlert({
          id: `inc-${Date.now()}`,
          type: 'fastest',
          title: marker.label,
          subtitle: marker.subtitle,
          timestampStr: 'TIMELINE REPLAY',
        });
      } else {
        setTrackStatus('CLEAR');
        setWeatherPreset('dry');
        setActiveAlert({
          id: `clear-${Date.now()}`,
          type: 'clear',
          title: marker.label,
          subtitle: marker.subtitle,
          timestampStr: 'TIMELINE REPLAY',
        });
      }
    }
  };

  const selectedRiderObjects = useMemo(() => {
    return selectedRiderNums
      .map((num) => ridersList.find((r) => r.rider_number === num))
      .filter(Boolean) as LiveTimingRider[];
  }, [selectedRiderNums, ridersList]);

  const currentLap = Math.min(
    20,
    Math.max(1, Math.floor((currentTimeSec / totalDurationSec) * 20) + 1)
  );

  // Derived environmental telemetry based on weather preset
  const isWet = weatherPreset !== 'dry';
  const rainIntensity: 'none' | 'light' | 'heavy' =
    weatherPreset === 'heavy-wet'
      ? 'heavy'
      : weatherPreset === 'light-rain'
      ? 'light'
      : 'none';
  const rainMm = weatherPreset === 'heavy-wet' ? 3.4 : weatherPreset === 'light-rain' ? 0.8 : 0.0;
  const airTemp = weatherPreset === 'heavy-wet' ? 27.4 : weatherPreset === 'light-rain' ? 30.2 : 33.8;
  const trackTemp = weatherPreset === 'heavy-wet' ? 32.6 : weatherPreset === 'light-rain' ? 38.5 : 48.2;
  const humidity = weatherPreset === 'heavy-wet' ? 91 : weatherPreset === 'light-rain' ? 79 : 61.5;
  const windSpeedMs = weatherPreset === 'heavy-wet' ? 5.8 : weatherPreset === 'light-rain' ? 3.6 : 2.1;

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

    toast.success(`Moved ${draggingId} next to ${targetId}`);
    setDraggingId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  const handleResetLayout = () => {
    setPanelOrder(['leaderboard', 'track-map', 'championship', 'telemetry', 'sectors']);
    setLayoutMode('cockpit');
    setWeatherPreset('dry');
    setTrackStatus('CLEAR');
    setActiveAlert(null);
    toast.info('Workspace reset to default cockpit');
  };

  const renderPanel = (panelId: string, customClass = '') => {
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
            isWet={isWet}
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
            onClearComparison={() =>
              setSelectedRiderNums(selectedRiderNums[0] ? [selectedRiderNums[0]] : [])
            }
            circuitName={circuitName}
            circuitCoords={SEPANG_CIRCUIT_COORDS}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            elapsedSeconds={currentTimeSec}
            currentLap={currentLap}
            weatherCondition={isWet ? 'Wet' : 'Dry'}
            rainIntensity={rainIntensity}
            windSpeedMs={windSpeedMs}
            activeAlert={activeAlert}
            onDismissAlert={() => setActiveAlert(null)}
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

      case 'championship':
        return (
          <LiveDynamicCarouselWidget
            key="championship"
            standings={standings}
            riders={ridersList}
            selectedRiderNums={selectedRiderNums}
            onSelectRider={handleToggleSelectRider}
            isWet={isWet}
            trackStatus={trackStatus}
            currentLap={currentLap}
            totalLaps={20}
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
            onQuickCompareTop2={handleQuickCompareTop2}
            elapsedSeconds={currentTimeSec}
            isWet={isWet}
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
    <div
      className={`w-full bg-[#07080B] text-white px-3 sm:px-4 py-2.5 max-w-[1920px] mx-auto select-none font-sans flex flex-col justify-between gap-2.5 ${
        layoutMode === 'cockpit'
          ? 'min-h-screen lg:h-[calc(100dvh-48px)] lg:overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* 1. TOP LIQUID GLASS COMMAND & WEATHER BAR */}
      <LiveTimingHeader
        sessionName={sessionName}
        circuitName={circuitName}
        elapsedSeconds={currentTimeSec}
        totalLaps={20}
        currentLap={currentLap}
        isGatewayActive={isGatewayActive}
        trackStatus={trackStatus}
        onChangeTrackStatus={handleChangeTrackStatus}
        weatherPreset={weatherPreset}
        onChangeWeatherPreset={handleChangeWeatherPreset}
        onQuickCompareTop2={handleQuickCompareTop2}
        isComparingTwo={selectedRiderNums.length >= 2}
        availableSessions={availableSessions}
        selectedSessionType={selectedSessionType}
        onSelectSessionType={handleSelectSessionType}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        onResetLayout={handleResetLayout}
        airTemp={airTemp}
        trackTemp={trackTemp}
        humidity={humidity}
        rainMm={rainMm}
        windSpeedMs={windSpeedMs}
      />

      {/* 2. ZERO-SCROLL COCKPIT WORKSPACE (3-COLUMN MAGIC BENTO GRID) */}
      {layoutMode === 'cockpit' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Left Column: Leaderboard (col-span-3, 100% height) */}
          <div className="lg:col-span-3 h-[540px] lg:h-full min-h-0 flex flex-col">
            {renderPanel('leaderboard', 'h-full')}
          </div>

          {/* Center Column: Realistic 3D Track Map + Floating 2-Driver Battle HUD (col-span-6, 100% height) */}
          <div className="lg:col-span-6 h-[560px] lg:h-full min-h-0 flex flex-col">
            {renderPanel('track-map', 'h-full')}
          </div>

          {/* Right Column: Auto-Cycling Dynamic Carousel + Dual/Single Telemetry Cockpit (col-span-3, 100% height) */}
          <div className="lg:col-span-3 h-full min-h-0 flex flex-col gap-3">
            <div className="flex-1 min-h-[260px] lg:min-h-0 flex flex-col">
              {renderPanel('championship', 'h-full')}
            </div>
            <div className="flex-1 min-h-[260px] lg:min-h-0 flex flex-col">
              {renderPanel('telemetry', 'h-full')}
            </div>
          </div>
        </div>
      )}

      {layoutMode === 'map-focus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          <div className="lg:col-span-8 flex flex-col gap-3">
            {renderPanel('track-map', 'h-[620px]')}
            {renderPanel('leaderboard', 'h-[480px]')}
          </div>
          <div className="lg:col-span-4 space-y-3">
            {renderPanel('championship', 'h-[340px]')}
            {renderPanel('telemetry', 'h-[340px]')}
          </div>
        </div>
      )}

      {layoutMode === 'table-focus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          <div className="lg:col-span-8 space-y-3">
            {renderPanel('leaderboard', 'h-[580px]')}
            {renderPanel('sectors')}
          </div>
          <div className="lg:col-span-4 space-y-3">
            {renderPanel('track-map', 'h-[420px]')}
            {renderPanel('championship', 'h-[320px]')}
            {renderPanel('telemetry', 'h-[320px]')}
          </div>
        </div>
      )}

      {layoutMode === 'custom-bento' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-[#0D0D0E]/90 px-4 py-2 rounded-2xl border border-white/[0.08] text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <GiCardPick className="w-4 h-4 text-[#00F5D4]" />
              <span className="font-bold text-white">Custom Magic Bento:</span>
              <span className="text-neutral-400">
                Drag any card by its header grip handle to reorder your workspace in real-time.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetLayout}
              className="h-7 px-3 rounded-full liquid-glass-pill text-white font-semibold cursor-pointer"
            >
              Reset to Default
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-start">
            {panelOrder.map((id) => {
              let spanClass = 'lg:col-span-6';
              if (id === 'track-map') spanClass = 'lg:col-span-7';
              if (id === 'leaderboard') spanClass = 'lg:col-span-5';
              if (id === 'sectors') spanClass = 'lg:col-span-12';
              return (
                <div key={id} className={spanClass}>
                  {renderPanel(id, id === 'track-map' ? 'h-[560px]' : '')}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. BOTTOM SESSION REPLAY SCRUBBER WITH WEATHER & INCIDENT TIMELINE PINS */}
      <ReplayScrubberBar
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        currentTimeSec={currentTimeSec}
        totalDurationSec={totalDurationSec}
        onSeek={handleSeek}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
        tvDelay={delay}
        onChangeTvDelay={setDelay}
      />
    </div>
  );
}
