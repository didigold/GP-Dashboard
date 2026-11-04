'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LiveTimingRider } from '@/lib/types/motogp';
import {
  SEPANG_OFFICIAL_GPS_COORDS,
  SEPANG_CORNERS,
  getInterpolatedSepangSpline,
  getSepangSectorGeoJSON,
} from '@/lib/data/sepang-gps-track';
import { CircuitCanvas } from '@/components/3d/CircuitCanvas';
import {
  Maximize2,
  Minimize2,
  Compass,
  Video,
  Layers,
  MapPin,
  Eye,
  Sun,
  Moon,
  Globe,
  GripVertical,
  Flag,
} from 'lucide-react';
import {
  GiRoad,
  GiFullMotorcycleHelmet,
  GiSpeedometer,
  GiCheckeredFlag,
  GiCardPick,
} from 'react-icons/gi';
import { useMagicBentoEffect } from '@/components/ui/MagicBentoCard';

// 1. Day Mode: OpenFreeMap Liberty (Vector tiles with lush green parks, roads, 3D buildings)
const DAY_VECTOR_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

// 2. Dark Mode: Tactical Motorsport Dark Style with visible green infield grass, slate roads, and dark buildings
const DARK_TACTICAL_STYLE = 'https://tiles.openfreemap.org/styles/dark';

// 3. Satellite Mode: High-res Esri World Imagery
const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'satellite-tiles': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: '© Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

interface LiveMapboxTrackMapProps {
  riders: LiveTimingRider[];
  selectedRiderNum?: string;
  selectedRiderNums?: string[];
  onSelectRider?: (riderNum: string) => void;
  circuitName?: string;
  circuitCoords?: [number, number]; // [lng, lat]
  isPlaying?: boolean;
  playbackSpeed?: number;
  className?: string;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragLeave?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function LiveMapboxTrackMap({
  riders,
  selectedRiderNum = '93',
  selectedRiderNums,
  onSelectRider,
  circuitName = 'Petronas Sepang International Circuit',
  circuitCoords = [101.7375, 2.7608],
  isPlaying = true,
  playbackSpeed = 1,
  className = '',
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: LiveMapboxTrackMapProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riderMarkersRef = useRef<{ [key: string]: { marker: maplibregl.Marker; el: HTMLElement } }>({});
  const cornerMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Magic Bento interactive illumination & dynamic neon border
  useMagicBentoEffect(cardRef, {
    glowColor: '234, 179, 8',
    spotlightRadius: 400,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.08,
    glowAlpha: 0.9,
  });

  // View modes: '3d' aerial, '2d' plan, 'onboard' cockpit rider view
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'onboard'>('3d');
  const [mapTheme, setMapTheme] = useState<'day' | 'dark' | 'satellite'>('day');
  const [showDriverCodes, setShowDriverCodes] = useState<boolean>(true);
  const [showCorners, setShowCorners] = useState<boolean>(true);
  const [showMiniMap, setShowMiniMap] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Official high-density 360-point Catmull-Rom spline from the real 104 GPS points
  const splineCoords = useMemo(() => getInterpolatedSepangSpline(360), []);

  // Selected riders list
  const activeSelectedList = useMemo(() => {
    if (selectedRiderNums && selectedRiderNums.length > 0) return selectedRiderNums;
    if (selectedRiderNum) return [selectedRiderNum];
    return ['93'];
  }, [selectedRiderNums, selectedRiderNum]);

  // Animated progress state for riders along the authentic spline
  const [riderProgresses, setRiderProgresses] = useState<Record<string, number>>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Initialize rider progress staggered across the circuit
  useEffect(() => {
    const initial: Record<string, number> = {};
    const sorted = [...riders].sort((a, b) => a.pos - b.pos);
    sorted.forEach((r, idx) => {
      // Leader starts along main straight (~0.02), each follower slightly behind
      const offset = (0.02 - idx * 0.042 + 1.0) % 1.0;
      initial[r.rider_number] = offset;
    });
    setRiderProgresses(initial);
  }, [riders.length]);

  // Smooth real-time animation loop along the circuit spline
  useEffect(() => {
    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying && delta > 0 && delta < 0.2) {
        setRiderProgresses((prev) => {
          const next = { ...prev };
          riders.forEach((r, idx) => {
            const current = next[r.rider_number] ?? (0.9 - idx * 0.04);
            // Lap time is ~117s (1'57), speed is 1 / 117.4 * playbackSpeed
            const baseSpeed = 1 / 117.4;
            const jitter = 1 + (idx === 0 ? 0.012 : -0.006 * idx);
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
  }, [isPlaying, playbackSpeed, riders]);

  // Add Circuit Track and 3D Layers onto the MapLibre map
  const addTrackLayers = useCallback((map: maplibregl.Map) => {
    try {

    // 1. Add Infield Grass / Runoff Polygon Layer (high contrast motorsport turf)
    if (!map.getSource('sepang-infield')) {
      const closedTrack = [...SEPANG_OFFICIAL_GPS_COORDS, SEPANG_OFFICIAL_GPS_COORDS[0]];
      map.addSource('sepang-infield', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [closedTrack],
          },
        },
      });

      map.addLayer({
        id: 'sepang-infield-fill',
        type: 'fill',
        source: 'sepang-infield',
        paint: {
          'fill-color': mapTheme === 'day' ? '#16a34a' : '#142a1d',
          'fill-opacity': mapTheme === 'day' ? 0.25 : 0.45,
        },
      });
    }

    // 2. Add Full Circuit Centerline (Base Road Ribbon)
    if (!map.getSource('sepang-full-track')) {
      const closedTrack = [...SEPANG_OFFICIAL_GPS_COORDS, SEPANG_OFFICIAL_GPS_COORDS[0]];
      map.addSource('sepang-full-track', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: closedTrack,
          },
        },
      });

      // Outer track curb/casing
      map.addLayer({
        id: 'sepang-track-casing',
        type: 'line',
        source: 'sepang-full-track',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#000000',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 8, 16, 16],
          'line-opacity': 0.85,
        },
      });

      // Inner asphalt racing surface
      map.addLayer({
        id: 'sepang-track-asphalt',
        type: 'line',
        source: 'sepang-full-track',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': mapTheme === 'day' ? '#1e293b' : '#0B0F19',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 4, 16, 8],
        },
      });

      // Racing line dashed marker
      map.addLayer({
        id: 'sepang-track-racing-line',
        type: 'line',
        source: 'sepang-full-track',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-dasharray': [3, 4],
          'line-opacity': 0.75,
        },
      });
    }

    // 3. Add 4 Distinct Official Dorna Sectors (GeoJSON line features with vibrant colors)
    if (!map.getSource('sepang-sectors')) {
      map.addSource('sepang-sectors', {
        type: 'geojson',
        data: getSepangSectorGeoJSON(),
      });

      // Sector 1: Red (#EF4444)
      map.addLayer({
        id: 'sepang-sector-s1',
        type: 'line',
        source: 'sepang-sectors',
        filter: ['==', ['get', 'sector'], 1],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#EF4444',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 16, 11],
          'line-opacity': 0.95,
        },
      });

      // Sector 2: Amber Gold (#F59E0B)
      map.addLayer({
        id: 'sepang-sector-s2',
        type: 'line',
        source: 'sepang-sectors',
        filter: ['==', ['get', 'sector'], 2],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#F59E0B',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 16, 11],
          'line-opacity': 0.95,
        },
      });

      // Sector 3: Electric Cyan (#06B6D4)
      map.addLayer({
        id: 'sepang-sector-s3',
        type: 'line',
        source: 'sepang-sectors',
        filter: ['==', ['get', 'sector'], 3],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#06B6D4',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 16, 11],
          'line-opacity': 0.95,
        },
      });

      // Sector 4: Emerald Green (#10B981)
      map.addLayer({
        id: 'sepang-sector-s4',
        type: 'line',
        source: 'sepang-sectors',
        filter: ['==', ['get', 'sector'], 4],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#10B981',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 16, 11],
          'line-opacity': 0.95,
        },
      });
    }

    // 4. Add 3D Extruded Buildings (Paddock, Grandstands, Control Towers)
    try {
      if (map.getSource('openmaptiles') && !map.getLayer('3d-buildings')) {
        map.addLayer({
          id: '3d-buildings',
          source: 'openmaptiles',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': mapTheme === 'day' ? '#cbd5e1' : '#273449',
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 16],
            'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
            'fill-extrusion-opacity': 0.85,
          },
        });
      }
    } catch {
      // Ignore if source layer building is not present
    }
    } catch (err) {
      console.warn('[MAP TRACK LAYERS ERROR]:', err);
    }
  }, [mapTheme]);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (viewMode === 'onboard' || !mapContainerRef.current) return;

    if (typeof window !== 'undefined') {
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    }

    let styleUrl: string | maplibregl.StyleSpecification;
    if (mapTheme === 'day') {
      styleUrl = DAY_VECTOR_STYLE;
    } else if (mapTheme === 'satellite') {
      styleUrl = SATELLITE_STYLE;
    } else {
      styleUrl = DARK_TACTICAL_STYLE;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: circuitCoords,
      zoom: 15.2,
      pitch: viewMode === '3d' ? 56 : 0,
      bearing: viewMode === '3d' ? -18 : 0,
      attributionControl: false,
    });

    map.on('error', (e: any) => {
      console.warn('[MAPLIBRE WARNING]:', e?.error?.message || e);
    });

    mapRef.current = map;
    (window as any).__map = map;

    // Navigation Controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.resize();
      addTrackLayers(map);
    });

    map.on('style.load', () => {
      addTrackLayers(map);
    });

    map.on('idle', () => {
      addTrackLayers(map);
    });

    map.on('styledata', () => {
      addTrackLayers(map);
    });

    return () => {
      // Clear corner markers
      cornerMarkersRef.current.forEach((m) => m.remove());
      cornerMarkersRef.current = [];
      // Clear rider markers
      Object.values(riderMarkersRef.current).forEach((rm) => rm.marker.remove());
      riderMarkersRef.current = {};

      map.remove();
      mapRef.current = null;
    };
  }, [circuitCoords[0], circuitCoords[1], viewMode, mapTheme, addTrackLayers]);

  // Render Corner Apex Markers (T1 through T15)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || viewMode === 'onboard') return;

    // Remove existing corner markers
    cornerMarkersRef.current.forEach((m) => m.remove());
    cornerMarkersRef.current = [];

    if (!showCorners) return;

    SEPANG_CORNERS.forEach((c, idx) => {
      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer select-none';

      // Sector color accent for corner badge
      let sectorColor = '#EF4444'; // S1
      if (idx >= 4 && idx < 8) sectorColor = '#F59E0B'; // S2
      else if (idx >= 8 && idx < 14) sectorColor = '#06B6D4'; // S3
      else if (idx >= 14) sectorColor = '#10B981'; // S4

      el.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background-color: #0E111A;
          border: 2px solid ${sectorColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
          font-size: 9px;
          font-weight: 800;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.6);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        " class="hover:scale-125">
          ${c.name.replace('T', '')}
        </div>
        <div style="
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(14, 17, 26, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          padding: 3px 6px;
          font-size: 10px;
          font-weight: 700;
          color: #FFFFFF;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          opacity: 0;
          transition: opacity 0.15s ease;
        " class="group-hover:opacity-100 z-50">
          <span style="color: ${sectorColor}">${c.name}</span>: ${c.label} <span style="color: #94A3B8; font-size: 9px;">(${c.gear} • ${c.speed})</span>
        </div>
      `;

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
        pitchAlignment: 'viewport',
        rotationAlignment: 'viewport',
      })
        .setLngLat(c.coords)
        .addTo(map);

      cornerMarkersRef.current.push(marker);
    });
  }, [showCorners, viewMode, mapTheme]);

  // Update animated rider markers on the MapLibre map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || splineCoords.length === 0 || viewMode === 'onboard') return;

    riders.slice(0, 20).forEach((r) => {
      const progress = riderProgresses[r.rider_number] ?? 0;
      const index = Math.floor(progress * (splineCoords.length - 1));
      const pt = splineCoords[index] || splineCoords[0];
      const isSelected = activeSelectedList.includes(r.rider_number);
      const riderColor = r.color || '#E10600';
      const shortName = r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase();

      if (!riderMarkersRef.current[r.rider_number]) {
        const el = document.createElement('div');
        el.className = 'rider-marker cursor-pointer select-none transition-transform duration-100 hover:scale-125';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectRider?.(r.rider_number);
        });

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center',
          pitchAlignment: 'viewport',
          rotationAlignment: 'viewport',
        })
          .setLngLat(pt)
          .addTo(map);

        riderMarkersRef.current[r.rider_number] = { marker, el };
      }

      const item = riderMarkersRef.current[r.rider_number];
      if (item) {
        item.marker.setLngLat(pt);

        item.el.innerHTML = `
          <div style="
            width: ${isSelected ? '22px' : '16px'};
            height: ${isSelected ? '22px' : '16px'};
            border-radius: 9999px;
            background-color: ${riderColor};
            border: 2px solid ${isSelected ? '#FFFFFF' : '#0B0D14'};
            box-shadow: 0 0 ${isSelected ? '12px' : '4px'} ${riderColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '11px' : '9px'};
            font-weight: 800;
            color: #FFFFFF;
            transition: all 0.2s ease;
          ">
            ${r.rider_number}
          </div>
          ${
            showDriverCodes
              ? `<div style="
                  background: rgba(11, 13, 20, 0.92);
                  backdrop-filter: blur(4px);
                  border: 1px solid ${isSelected ? riderColor : 'rgba(255,255,255,0.15)'};
                  padding: 1px 5px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: 800;
                  color: ${isSelected ? '#FFFFFF' : '#CBD5E1'};
                  letter-spacing: 0.05em;
                  white-space: nowrap;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.4);
                ">
                  ${shortName}
                </div>`
              : ''
          }
        `;
      }
    });
  }, [riderProgresses, activeSelectedList, showDriverCodes, onSelectRider, splineCoords, viewMode, riders]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!cardRef.current) return;
    if (!document.fullscreenElement) {
      cardRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSetView = (mode: '3d' | '2d' | 'onboard') => {
    setViewMode(mode);
    if (mode === '3d') {
      mapRef.current?.easeTo({ pitch: 56, bearing: -18, zoom: 15.2, duration: 800 });
    } else if (mode === '2d') {
      mapRef.current?.easeTo({ pitch: 0, bearing: 0, zoom: 15.0, duration: 800 });
    }
  };

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'map')}
      onDragOver={(e) => onDragOver?.(e, 'map')}
      onDragLeave={(e) => onDragLeave?.(e, 'map')}
      onDrop={(e) => onDrop?.(e, 'map')}
      onDragEnd={onDragEnd}
      className={`relative bg-[#0E111A] border rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans transition-all duration-200 select-none ${
        isDragging
          ? 'opacity-40 scale-95 border-amber-500/80 shadow-[0_0_25px_rgba(234,179,8,0.4)]'
          : isDropTarget
          ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.01]'
          : 'border-neutral-800/90 hover:border-neutral-700/80'
      } ${className}`}
    >
      {/* Track Map Header matching Reference Design */}
      <div className="px-4 py-3 bg-[#0B0D14]/90 backdrop-blur-md border-b border-neutral-800/90 flex flex-wrap items-center justify-between gap-2.5 z-10 shrink-0">
        {/* Left: Drag Handle + Icon + Title + Circuit Details */}
        <div className="flex items-center gap-2.5">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-amber-400 transition-colors"
              title="Drag to reposition frame"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <GiRoad className="w-5 h-5 text-[#E10600]" />
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Track Map</span>
              <span className="hidden sm:inline-block text-xs font-normal text-neutral-400">
                | {circuitName}
              </span>
            </h2>
          </div>
        </div>

        {/* Right Controls: Driver Codes Toggle | Corner Numbers Toggle | View Mode (3D/2D/Onboard) | Theme | Fullscreen */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Driver Codes Toggle */}
          <button
            onClick={() => setShowDriverCodes(!showDriverCodes)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              showDriverCodes
                ? 'bg-neutral-800/90 text-white border-neutral-700'
                : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="Toggle Driver Codes along Track"
          >
            <GiFullMotorcycleHelmet className="w-3.5 h-3.5 text-amber-400" />
            <span>Driver codes</span>
          </button>

          {/* Corner Numbers Toggle */}
          <button
            onClick={() => setShowCorners(!showCorners)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              showCorners
                ? 'bg-neutral-800/90 text-white border-neutral-700'
                : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="Toggle Turn Numbers (T1 to T15)"
          >
            <Flag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Corner apexes</span>
          </button>

          {/* View Mode Switcher: 3D / 2D / Onboard */}
          <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => handleSetView('3d')}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                viewMode === '3d'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="3D Aerial Track Camera"
            >
              3D
            </button>
            <button
              onClick={() => handleSetView('2d')}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                viewMode === '2d'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="2D Overhead Schematic Plan"
            >
              2D
            </button>
            <button
              onClick={() => handleSetView('onboard')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                viewMode === 'onboard'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Onboard Cockpit 3D Perspective"
            >
              <Video className="w-3 h-3" />
              <span>Onboard</span>
            </button>
          </div>

          {/* Map Theme Toggle: Day / Dark / Satellite */}
          <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => setMapTheme('day')}
              className={`p-1.5 rounded-md transition-colors ${
                mapTheme === 'day'
                  ? 'bg-amber-950/60 border border-amber-800/80 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Day Mode (Lush Green OpenStreetMap with 3D buildings and turf)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMapTheme('dark')}
              className={`p-1.5 rounded-md transition-colors ${
                mapTheme === 'dark'
                  ? 'bg-sky-950/60 border border-sky-800/80 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Dark Mode (Tactical dark slate road grid with luminous circuit)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMapTheme('satellite')}
              className={`p-1.5 rounded-md transition-colors ${
                mapTheme === 'satellite'
                  ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Satellite Mode (High-resolution aerial satellite imagery)"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Camera Button */}
          {viewMode !== 'onboard' && (
            <button
              onClick={() => {
                mapRef.current?.flyTo({
                  center: circuitCoords,
                  zoom: 15.2,
                  pitch: viewMode === '3d' ? 56 : 0,
                  bearing: viewMode === '3d' ? -18 : 0,
                  duration: 800,
                });
              }}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Reset View to Sepang Center"
            >
              <Compass className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Viewport: MapLibre 3D / 2D Canvas or Onboard Cockpit 3D */}
      <div className="w-full flex-1 min-h-[480px] lg:min-h-[540px] relative bg-[#090D14] overflow-hidden">
        {viewMode === 'onboard' ? (
          /* ONBOARD 3D COCKPIT VIEW */
          <div className="w-full h-full min-h-[540px] relative">
            <CircuitCanvas
              circuitName={circuitName}
              selectedRiderNumber={activeSelectedList[0] || '93'}
              onSelectRider={onSelectRider}
              hideHeader={true}
            />

            {/* Live Onboard Overlay Telemetry Tag */}
            <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-neutral-700/80 shadow-2xl flex items-center gap-3">
              <GiFullMotorcycleHelmet className="w-5 h-5 text-[#E10600]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Onboard Camera Focus
                </span>
                <span className="text-sm font-bold text-white">
                  Rider #{activeSelectedList[0] || '93'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* MAPLIBRE 3D / 2D MAP WITH NATIVE WEBGL SECTORS & CORNERS */
          <div className="w-full h-full min-h-[540px] relative">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          </div>
        )}

        {/* Circuit Technical Quick Info Bar */}
        <div className="absolute bottom-2 left-3 right-3 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs z-10 font-sans pointer-events-none">
          <div className="flex items-center gap-4 text-neutral-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="text-white font-bold">S1:</span> 1,322 m
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-white font-bold">S2:</span> 1,094 m
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
              <span className="text-white font-bold">S3:</span> 1,562 m
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-white font-bold">S4:</span> 1,572 m
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span>Length: <strong className="text-white font-bold">5.543 km</strong></span>
            <span>Turns: <strong className="text-white font-bold">15 (5L / 10R)</strong></span>
            <span>Longest Straight: <strong className="text-white font-bold">920 m</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
