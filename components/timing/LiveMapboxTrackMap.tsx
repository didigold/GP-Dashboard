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
import {
  generateSepangKerbsGeoJSON,
  generatePitAndStartFinishGeoJSON,
  generateDriverBattleRibbonGeoJSON,
} from '@/lib/utils/track-geometry';
import { computeRiderLiveKinematics, RiderKinematicTelemetry } from '@/lib/utils/rider-kinematics';
import { CircuitCanvas } from '@/components/3d/CircuitCanvas';
import { RainOverlayCanvas } from './RainOverlayCanvas';
import { RaceControlEventBanner, RaceControlAlert } from './RaceControlEventBanner';
import { DriverBattleOverlayHUD } from './DriverBattleOverlayHUD';
import {
  Maximize2,
  Minimize2,
  Compass,
  Video,
  Sun,
  Sunset,
  Moon,
  Globe,
  Clock,
  GripVertical,
  Flag,
} from 'lucide-react';
import {
  GiRoad,
  GiFullMotorcycleHelmet,
  GiCrossedSwords,
} from 'react-icons/gi';
import { useMagicBentoEffect, MagicBentoGlow } from '@/components/ui/MagicBentoCard';

const DAY_VECTOR_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const DARK_TACTICAL_STYLE = 'https://tiles.openfreemap.org/styles/dark';

const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'satellite-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
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

export type MapLightingMode = 'auto' | 'day' | 'dusk' | 'night' | 'satellite';

interface LiveMapboxTrackMapProps {
  riders: LiveTimingRider[];
  selectedRiderNum?: string;
  selectedRiderNums?: string[];
  onSelectRider?: (riderNum: string) => void;
  onClearComparison?: () => void;
  circuitName?: string;
  circuitCoords?: [number, number];
  isPlaying?: boolean;
  playbackSpeed?: number;
  elapsedSeconds?: number;
  currentLap?: number;
  weatherCondition?: 'Dry' | 'Wet' | 'Mixed';
  rainIntensity?: 'none' | 'light' | 'heavy';
  windSpeedMs?: number;
  activeAlert?: RaceControlAlert | null;
  onDismissAlert?: () => void;
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
  onClearComparison,
  circuitName = 'Petronas Sepang International Circuit',
  circuitCoords = [101.7375, 2.7608],
  isPlaying = true,
  playbackSpeed = 1,
  elapsedSeconds = 2294,
  currentLap = 16,
  weatherCondition = 'Dry',
  rainIntensity = 'none',
  windSpeedMs = 2.1,
  activeAlert = null,
  onDismissAlert,
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

  useMagicBentoEffect(cardRef, {
    glowColor: '225, 6, 0',
    spotlightRadius: 420,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.06,
    glowAlpha: 0.85,
  });

  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'onboard'>('3d');
  const [lightingMode, setLightingMode] = useState<MapLightingMode>('auto');
  const [showDriverCodes, setShowDriverCodes] = useState<boolean>(true);
  const [showCorners, setShowCorners] = useState<boolean>(true);
  const [showSectorTint, setShowSectorTint] = useState<boolean>(false);
  const [battleCamActive, setBattleCamActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Smooth high-frequency sub-second clock for 60fps kinematic interpolation
  const [smoothClockSec, setSmoothClockSec] = useState<number>(elapsedSeconds);
  const lastFrameTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    setSmoothClockSec(elapsedSeconds);
  }, [elapsedSeconds]);

  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = now;
      setSmoothClockSec((prev) => prev + dt * playbackSpeed);
      rafId = requestAnimationFrame(tick);
    };
    lastFrameTimeRef.current = performance.now();
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, playbackSpeed]);

  // Resolve effective visual theme from 'auto' mode (syncs with weather & session clock)
  const isWet = weatherCondition === 'Wet' || rainIntensity !== 'none';
  const resolvedBaseStyle = useMemo<'day' | 'dark' | 'satellite'>(() => {
    if (lightingMode === 'satellite') return 'satellite';
    if (lightingMode === 'night') return 'dark';
    if (lightingMode === 'day' || lightingMode === 'dusk') return 'day';
    // Auto mode: if heavy rain, use high-contrast overcast vector day/slate; if late session (>5800s), use dusk/dark
    return 'day';
  }, [lightingMode]);

  // Atmospheric CSS filter over MapLibre canvas for Auto / Wet / Dusk / Dawn lighting
  const mapAtmosphereFilter = useMemo(() => {
    if (lightingMode === 'dusk') {
      return 'sepia(0.24) saturate(1.35) hue-rotate(-14deg) brightness(0.92) contrast(1.06)';
    }
    if (lightingMode === 'auto') {
      if (isWet) {
        return 'saturate(0.75) hue-rotate(8deg) brightness(0.84) contrast(1.12)';
      }
      if (elapsedSeconds > 5400) {
        // Late afternoon tropical golden hour at Sepang
        return 'sepia(0.16) saturate(1.2) hue-rotate(-8deg) brightness(0.95)';
      }
    }
    return 'none';
  }, [lightingMode, isWet, elapsedSeconds]);

  // Precomputed GeoJSONs for realistic asphalt, kerbs ("pianos"), pit lane, and start/finish
  const closedSplineCoords = useMemo(() => getInterpolatedSepangSpline(720), []);
  const kerbsGeoJSON = useMemo(() => generateSepangKerbsGeoJSON(), []);
  const { startFinishGeoJSON, pitLaneGeoJSON } = useMemo(
    () => generatePitAndStartFinishGeoJSON(),
    []
  );

  // Selected riders list
  const activeSelectedList = useMemo(() => {
    if (selectedRiderNums && selectedRiderNums.length > 0) return selectedRiderNums;
    if (selectedRiderNum) return [selectedRiderNum];
    return [];
  }, [selectedRiderNums, selectedRiderNum]);

  const isDualComparison = activeSelectedList.length >= 2;

  // Compute real-time kinematic telemetry for all riders
  const ridersKinematics = useMemo(() => {
    const map: Record<string, RiderKinematicTelemetry> = {};
    riders.forEach((r) => {
      map[r.rider_number] = computeRiderLiveKinematics(r, smoothClockSec, isWet);
    });
    return map;
  }, [riders, smoothClockSec, isWet]);

  // Add realistic Asphalt, White Track Limits, Red/White Kerb Pianos, Pit Lane & Battle Ribbon
  const addTrackLayers = useCallback(
    (map: maplibregl.Map) => {
      try {
        // 1. Infield Turf Polygon
        if (!map.getSource('sepang-infield')) {
          const closedTrack = [...SEPANG_OFFICIAL_GPS_COORDS, SEPANG_OFFICIAL_GPS_COORDS[0]];
          map.addSource('sepang-infield', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [closedTrack] },
            },
          });

          map.addLayer({
            id: 'sepang-infield-fill',
            type: 'fill',
            source: 'sepang-infield',
            paint: {
              'fill-color': resolvedBaseStyle === 'day' ? '#22c55e' : '#0f291e',
              'fill-opacity': resolvedBaseStyle === 'day' ? 0.16 : 0.35,
            },
          });
        }

        // 2. Pit Lane Source & Layers
        if (!map.getSource('sepang-pit-lane')) {
          map.addSource('sepang-pit-lane', {
            type: 'geojson',
            data: pitLaneGeoJSON,
          });

          map.addLayer({
            id: 'sepang-pit-casing',
            type: 'line',
            source: 'sepang-pit-lane',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#94A3B8',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3.5, 16, 7],
              'line-opacity': 0.8,
            },
          });

          map.addLayer({
            id: 'sepang-pit-asphalt',
            type: 'line',
            source: 'sepang-pit-lane',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#1E293B',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 2.2, 16, 4.8],
            },
          });
        }

        // 3. Kerbs ("Pianos") Source & Alternating Red/White Layers (Placed just outside asphalt edge)
        if (!map.getSource('sepang-kerbs')) {
          map.addSource('sepang-kerbs', {
            type: 'geojson',
            data: kerbsGeoJSON,
          });

          // White base of kerb
          map.addLayer({
            id: 'sepang-kerbs-white',
            type: 'line',
            source: 'sepang-kerbs',
            layout: { 'line-cap': 'butt', 'line-join': 'round' },
            paint: {
              'line-color': '#FFFFFF',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 2.5, 16, 6],
              'line-opacity': 0.95,
            },
          });

          // Red alternating piano blocks on kerb
          map.addLayer({
            id: 'sepang-kerbs-red-pianos',
            type: 'line',
            source: 'sepang-kerbs',
            layout: { 'line-cap': 'butt', 'line-join': 'round' },
            paint: {
              'line-color': '#E10600',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 2.5, 16, 6],
              'line-dasharray': [1.1, 1.1],
              'line-opacity': 0.98,
            },
          });
        }

        // 4. Full High-Density Circuit Spline (Shadow -> White Track Limits -> Dark Charcoal Asphalt)
        if (!map.getSource('sepang-full-track')) {
          map.addSource('sepang-full-track', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: closedSplineCoords,
              },
            },
          });

          // 4a. Outer Drop Shadow Casing
          map.addLayer({
            id: 'sepang-track-shadow',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': isWet ? '#0284C7' : '#05070B',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 13, 16, 26],
              'line-opacity': isWet ? 0.45 : 0.78,
            },
          });

          // 4b. Crisp White Track Edge Lines (Visible on both sides of the asphalt!)
          map.addLayer({
            id: 'sepang-track-white-edges',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#F8FAFC',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 10, 16, 20.5],
              'line-opacity': 0.92,
            },
          });

          // 4c. Realistic Dark Charcoal Tarmac Asphalt Surface (Matching F1 Dashboard Image 2)
          map.addLayer({
            id: 'sepang-track-asphalt',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': isWet ? '#131C2E' : '#262B35',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 8.2, 16, 17],
              'line-opacity': 1,
            },
          });

          // 4d. Subtle Rubbered Racing Groove Centerline
          map.addLayer({
            id: 'sepang-track-racing-line',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': isWet ? '#38BDF8' : '#94A3B8',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 16, 2],
              'line-opacity': isWet ? 0.35 : 0.25,
            },
          });
        }

        // 5. Optional Sector Accent Overlay (Thin inner line when Sector toggle is enabled)
        if (!map.getSource('sepang-sectors')) {
          map.addSource('sepang-sectors', {
            type: 'geojson',
            data: getSepangSectorGeoJSON(),
          });

          const sectorColors: Record<number, string> = {
            1: '#EF4444',
            2: '#F59E0B',
            3: '#06B6D4',
            4: '#10B981',
          };

          ([1, 2, 3, 4] as const).forEach((sec) => {
            map.addLayer({
              id: `sepang-sector-s${sec}`,
              type: 'line',
              source: 'sepang-sectors',
              filter: ['==', ['get', 'sector'], sec],
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
                visibility: showSectorTint ? 'visible' : 'none',
              },
              paint: {
                'line-color': sectorColors[sec],
                'line-width': ['interpolate', ['linear'], ['zoom'], 13, 2.5, 16, 4.5],
                'line-opacity': 0.9,
              },
            });
          });
        }

        // 6. Start/Finish Checkered Line
        if (!map.getSource('sepang-start-finish')) {
          map.addSource('sepang-start-finish', {
            type: 'geojson',
            data: startFinishGeoJSON,
          });

          map.addLayer({
            id: 'sepang-sf-white',
            type: 'line',
            source: 'sepang-start-finish',
            paint: {
              'line-color': '#FFFFFF',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3, 16, 6],
            },
          });

          map.addLayer({
            id: 'sepang-sf-checkered',
            type: 'line',
            source: 'sepang-start-finish',
            paint: {
              'line-color': '#E10600',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3, 16, 6],
              'line-dasharray': [1, 1],
            },
          });
        }

        // 7. Dynamic 2-Driver Battle Gap Ribbon Source & Layers
        if (!map.getSource('sepang-battle-ribbon')) {
          map.addSource('sepang-battle-ribbon', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });

          map.addLayer({
            id: 'sepang-battle-ribbon-glow',
            type: 'line',
            source: 'sepang-battle-ribbon',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#F59E0B',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 16, 12],
              'line-opacity': 0.35,
            },
          });

          map.addLayer({
            id: 'sepang-battle-ribbon-core',
            type: 'line',
            source: 'sepang-battle-ribbon',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#FBBF24',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 2.5, 16, 4.5],
              'line-dasharray': [2, 1.5],
              'line-opacity': 0.95,
            },
          });
        }

        // 8. 3D Extruded Grandstands & Paddock Buildings
        try {
          if (map.getSource('openmaptiles') && !map.getLayer('3d-buildings')) {
            map.addLayer({
              id: '3d-buildings',
              source: 'openmaptiles',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': resolvedBaseStyle === 'day' ? '#d4d4d8' : '#1e293b',
                'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 16],
                'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                'fill-extrusion-opacity': 0.85,
              },
            });
          }
        } catch {
          // Safe ignore if vector building layer unavailable
        }
      } catch (err) {
        console.warn('[MAP TRACK LAYERS WARNING]:', err);
      }
    },
    [
      resolvedBaseStyle,
      isWet,
      showSectorTint,
      closedSplineCoords,
      kerbsGeoJSON,
      pitLaneGeoJSON,
      startFinishGeoJSON,
    ]
  );

  // Toggle sector overlay visibility dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    ([1, 2, 3, 4] as const).forEach((sec) => {
      const layerId = `sepang-sector-s${sec}`;
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', showSectorTint ? 'visible' : 'none');
      }
    });
  }, [showSectorTint]);

  // Update wet asphalt colors dynamically when weather changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    try {
      if (map.getLayer('sepang-track-asphalt')) {
        map.setPaintProperty('sepang-track-asphalt', 'line-color', isWet ? '#131C2E' : '#262B35');
      }
      if (map.getLayer('sepang-track-shadow')) {
        map.setPaintProperty('sepang-track-shadow', 'line-color', isWet ? '#0284C7' : '#05070B');
        map.setPaintProperty('sepang-track-shadow', 'line-opacity', isWet ? 0.45 : 0.78);
      }
    } catch {
      // safe ignore before style load
    }
  }, [isWet]);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (viewMode === 'onboard' || !mapContainerRef.current) return;

    if (typeof window !== 'undefined') {
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    }

    let styleUrl: string | maplibregl.StyleSpecification;
    if (resolvedBaseStyle === 'day') {
      styleUrl = DAY_VECTOR_STYLE;
    } else if (resolvedBaseStyle === 'satellite') {
      styleUrl = SATELLITE_STYLE;
    } else {
      styleUrl = DARK_TACTICAL_STYLE;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: circuitCoords,
      zoom: 15.25,
      pitch: viewMode === '3d' ? 54 : 0,
      bearing: viewMode === '3d' ? -18 : 0,
      attributionControl: false,
    });

    map.on('error', () => {});

    mapRef.current = map;

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

    return () => {
      cornerMarkersRef.current.forEach((m) => m.remove());
      cornerMarkersRef.current = [];
      Object.values(riderMarkersRef.current).forEach((rm) => rm.marker.remove());
      riderMarkersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, [circuitCoords[0], circuitCoords[1], viewMode, resolvedBaseStyle]);

  // Render Corner Numbers (1 to 15) matching F1 Dashboard Image 2
  useEffect(() => {
    const map = mapRef.current;
    if (!map || viewMode === 'onboard') return;

    cornerMarkersRef.current.forEach((m) => m.remove());
    cornerMarkersRef.current = [];

    if (!showCorners) return;

    SEPANG_CORNERS.forEach((c) => {
      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer select-none';

      el.innerHTML = `
        <div style="
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background-color: rgba(11, 13, 20, 0.92);
          border: 1.5px solid rgba(255,255,255,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.65);
        ">
          ${c.name.replace('T', '')}
        </div>
        <div style="
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(11, 13, 20, 0.95);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 3px 6px;
          font-size: 10px;
          font-weight: 700;
          color: #FFFFFF;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
        " class="group-hover:opacity-100 z-50">
          ${c.name}: ${c.label} (${c.gear} · ${c.speed})
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
  }, [showCorners, viewMode, resolvedBaseStyle]);

  // Update Real-Time Kinematic Rider Markers + 2-Driver Elastic Battle Ribbon
  useEffect(() => {
    const map = mapRef.current;
    if (!map || viewMode === 'onboard') return;

    // 1. Update 2-Driver Battle Ribbon along the asphalt if 2 riders are selected
    try {
      const battleSource = map.getSource('sepang-battle-ribbon') as maplibregl.GeoJSONSource | undefined;
      if (battleSource) {
        if (isDualComparison) {
          const kin1 = ridersKinematics[activeSelectedList[0]];
          const kin2 = ridersKinematics[activeSelectedList[1]];
          if (kin1 && kin2) {
            battleSource.setData(generateDriverBattleRibbonGeoJSON(kin1.progress, kin2.progress));

            // If Battle Cam follow is enabled, ease camera toward the midpoint between the 2 battling riders
            if (battleCamActive) {
              const midLng = (kin1.coords[0] + kin2.coords[0]) / 2;
              const midLat = (kin1.coords[1] + kin2.coords[1]) / 2;
              map.jumpTo({ center: [midLng, midLat] });
            }
          }
        } else {
          battleSource.setData({ type: 'FeatureCollection', features: [] });
        }
      }
    } catch {
      // safe ignore before source ready
    }

    // 2. Update Rider Markers
    riders.slice(0, 20).forEach((r) => {
      const kin = ridersKinematics[r.rider_number];
      if (!kin) return;

      const isSelected = activeSelectedList.includes(r.rider_number);
      const isSecondSelected = isDualComparison && activeSelectedList[1] === r.rider_number;
      const baseColor = r.color || '#E10600';
      // Ensure distinct colors if 2 teammates are compared (like Red vs Cyan in Image 5)
      const riderColor =
        isSecondSelected && r.color === riders.find((x) => x.rider_number === activeSelectedList[0])?.color
          ? '#38BDF8'
          : baseColor;
      const shortName = r.rider_shortname || r.rider_surname.slice(0, 3).toUpperCase();

      if (!riderMarkersRef.current[r.rider_number]) {
        const el = document.createElement('div');
        el.className = 'rider-marker cursor-pointer select-none';
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
          .setLngLat(kin.coords)
          .addTo(map);

        riderMarkersRef.current[r.rider_number] = { marker, el };
      }

      const item = riderMarkersRef.current[r.rider_number];
      if (item) {
        item.marker.setLngLat(kin.coords);
        item.el.style.zIndex = isSelected ? '40' : '15';
        // Dim unselected riders when 2 riders are in comparison focus mode (like F1 Image 5)
        item.el.style.opacity = isDualComparison && !isSelected ? '0.45' : '1';

        item.el.innerHTML = `
          <div style="
            width: ${isSelected ? '20px' : '14px'};
            height: ${isSelected ? '20px' : '14px'};
            border-radius: 9999px;
            background-color: ${riderColor};
            border: ${isSelected ? '2.5px solid #FFFFFF' : '1.5px solid #0B0D14'};
            box-shadow: ${isSelected ? `0 0 14px ${riderColor}` : '0 2px 4px rgba(0,0,0,0.6)'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '10px' : '8px'};
            font-weight: 900;
            color: #FFFFFF;
          ">
            ${r.rider_number}
          </div>
          ${
            isSelected
              ? `<div style="
                  background: rgba(9, 11, 16, 0.94);
                  border: 1.5px solid ${riderColor};
                  padding: 1.5px 6px;
                  border-radius: 6px;
                  font-size: 10px;
                  font-weight: 800;
                  color: #FFFFFF;
                  white-space: nowrap;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.65);
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <span>${shortName}</span>
                  <span style="color: #94A3B8; font-weight: 700;">${kin.speedKmh} km/h</span>
                  <span style="color: #FBBF24; font-weight: 800;">G${kin.gear}</span>
                </div>`
              : showDriverCodes
              ? `<div style="
                  background: rgba(11, 13, 20, 0.88);
                  border: 1px solid rgba(255,255,255,0.16);
                  padding: 1px 4.5px;
                  border-radius: 4px;
                  font-size: 9.5px;
                  font-weight: 800;
                  color: #E2E8F0;
                  white-space: nowrap;
                ">
                  ${shortName}
                </div>`
              : ''
          }
        `;
      }
    });
  }, [
    ridersKinematics,
    activeSelectedList,
    isDualComparison,
    battleCamActive,
    showDriverCodes,
    onSelectRider,
    viewMode,
    riders,
  ]);

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
    setBattleCamActive(false);
    if (mode === '3d') {
      mapRef.current?.easeTo({ pitch: 54, bearing: -18, zoom: 15.25, duration: 750 });
    } else if (mode === '2d') {
      mapRef.current?.easeTo({ pitch: 0, bearing: 0, zoom: 15.05, duration: 750 });
    }
  };

  // Find selected rider objects for the 2-Driver Battle Overlay HUD
  const selectedRiderA = useMemo(
    () => riders.find((r) => r.rider_number === activeSelectedList[0]),
    [riders, activeSelectedList]
  );
  const selectedRiderB = useMemo(
    () => (isDualComparison ? riders.find((r) => r.rider_number === activeSelectedList[1]) : undefined),
    [riders, activeSelectedList, isDualComparison]
  );
  const leaderKin = selectedRiderA ? ridersKinematics[selectedRiderA.rider_number] : undefined;

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, 'track-map')}
      onDragOver={(e) => onDragOver?.(e, 'track-map')}
      onDragLeave={(e) => onDragLeave?.(e, 'track-map')}
      onDrop={(e) => onDrop?.(e, 'track-map')}
      onDragEnd={onDragEnd}
      className={`relative bg-[#0D0D0E]/90 border rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans transition-all duration-200 select-none ${
        isDragging
          ? 'opacity-40 scale-95 border-[#E10600]'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      } ${className}`}
    >
      <MagicBentoGlow />

      {/* TOP HEADER BAR: Standardized Liquid Glass Pills (h-8) matching F1 Image 2 & MotoGP Taste */}
      <div className="px-3.5 py-2.5 bg-[#0A0B0E]/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2 z-20 shrink-0">
        {/* Left: Drag Handle + Icon + Title */}
        <div className="flex items-center gap-2 min-w-0">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-0.5 text-neutral-500 hover:text-white transition-colors"
              title="Drag to reposition frame"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}
          <GiRoad className="w-4 h-4 text-[#E10600] shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
            <span>Track Map</span>
            <span className="hidden xl:inline-block text-xs font-normal text-neutral-400 truncate">
              · {circuitName}
            </span>
          </h2>
        </div>

        {/* Right: Liquid Glass Control Pills (Codes | Corners | Sectors | Mode 3D/2D | Theme Auto/Day/Dusk/Night/Sat) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Toggle Pill Group: Codes / Corners / Sectors */}
          <div className="h-8 p-0.5 inline-flex items-center rounded-full liquid-glass-pill text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setShowDriverCodes(!showDriverCodes)}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                showDriverCodes
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Toggle rider 3-letter codes on map"
            >
              Codes
            </button>
            <button
              type="button"
              onClick={() => setShowCorners(!showCorners)}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                showCorners
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Toggle corner numbers (1-15)"
            >
              Corners
            </button>
            <button
              type="button"
              onClick={() => setShowSectorTint(!showSectorTint)}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                showSectorTint
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Overlay Dorna S1-S4 sector colors on asphalt"
            >
              Sectors
            </button>
          </div>

          {/* Mode Pill: 3D | 2D | Onboard */}
          <div className="h-8 p-0.5 inline-flex items-center rounded-full liquid-glass-pill text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handleSetView('3d')}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => handleSetView('2d')}
              className={`h-full px-2.5 rounded-full transition-all cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              2D
            </button>
            <button
              type="button"
              onClick={() => handleSetView('onboard')}
              className={`h-full px-2.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'onboard'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Onboard 3D Cockpit Simulator"
            >
              <Video className="w-3 h-3" />
              <span className="hidden sm:inline">Onboard</span>
            </button>
          </div>

          {/* Theme & Smart Weather Lighting Pill: Auto (Clock) | Day | Dusk | Night | Satellite */}
          <div className="h-8 p-0.5 inline-flex items-center rounded-full liquid-glass-pill">
            {[
              {
                id: 'auto' as MapLightingMode,
                icon: Clock,
                title: 'Auto Smart Lighting (Syncs with Real Event Time & Weather)',
              },
              { id: 'day' as MapLightingMode, icon: Sun, title: 'Daylight Clear Mode' },
              { id: 'dusk' as MapLightingMode, icon: Sunset, title: 'Sunset / Golden Hour Mode' },
              { id: 'night' as MapLightingMode, icon: Moon, title: 'Night Floodlit Mode' },
              { id: 'satellite' as MapLightingMode, icon: Globe, title: 'Aerial Satellite Imagery' },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = lightingMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightingMode(item.id)}
                  title={item.title}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-xs'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Reset Camera & Fullscreen Circle Buttons */}
          {viewMode !== 'onboard' && (
            <button
              type="button"
              onClick={() => {
                setBattleCamActive(false);
                mapRef.current?.flyTo({
                  center: circuitCoords,
                  zoom: 15.25,
                  pitch: viewMode === '3d' ? 54 : 0,
                  bearing: viewMode === '3d' ? -18 : 0,
                  duration: 750,
                });
              }}
              className="w-8 h-8 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
              title="Reset Camera to Circuit Center"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-8 h-8 liquid-glass-circle text-neutral-300 hover:text-white cursor-pointer"
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

      {/* MAIN MAP VIEWPORT */}
      <div className="w-full flex-1 min-h-0 relative bg-[#090D14] overflow-hidden">
        {/* 1. Broadcast Race Control & Wet Weather Notification Banner */}
        <RaceControlEventBanner
          alert={activeAlert || null}
          onDismiss={() => onDismissAlert?.()}
        />

        {/* 2. Simulated Rain & Wet Track Ripples Overlay Canvas */}
        <RainOverlayCanvas intensity={rainIntensity} windSpeedMs={windSpeedMs} />

        {/* 3. Auto Lighting Status Badge (Top Left Floating Pill) */}
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-neutral-300 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isWet ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span>
              {lightingMode === 'auto'
                ? isWet
                  ? 'Auto Lighting · Overcast Wet'
                  : elapsedSeconds > 5400
                  ? 'Auto Lighting · Late Afternoon'
                  : 'Auto Lighting · Tropical Daylight'
                : `Lighting · ${lightingMode.toUpperCase()}`}
            </span>
          </div>
        </div>

        {viewMode === 'onboard' ? (
          <div className="w-full h-full relative">
            <CircuitCanvas
              circuitName={circuitName}
              selectedRiderNumber={activeSelectedList[0] || '93'}
              onSelectRider={onSelectRider}
              hideHeader={true}
            />
          </div>
        ) : (
          <div
            className="w-full h-full relative transition-[filter] duration-500"
            style={{ filter: mapAtmosphereFilter }}
          >
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          </div>
        )}

        {/* 4. Floating 2-Driver Real-Time Battle Comparison HUD (Image 4 + Image 5 Hybrid) */}
        {isDualComparison && selectedRiderA && selectedRiderB && (
          <DriverBattleOverlayHUD
            riderA={selectedRiderA}
            riderB={selectedRiderB}
            activeSector={leaderKin?.sector || 4}
            sectorProgress={leaderKin?.sectorProgress || 0.65}
            currentLap={currentLap}
            battleCamActive={battleCamActive}
            onToggleBattleCam={() => setBattleCamActive(!battleCamActive)}
            onClose={onClearComparison}
          />
        )}

        {/* 5. Compact Bottom Track Info Strip */}
        <div className="pointer-events-none absolute bottom-2 left-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] z-10 font-sans">
          <div className="flex items-center gap-3 text-neutral-300 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="text-white font-bold">S1:</span> 1,322m
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span className="text-white font-bold">S2:</span> 1,094m
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <span className="text-white font-bold">S3:</span> 1,562m
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-white font-bold">S4:</span> 1,565m
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-neutral-400">
            <span>
              Asphalt: <strong className="text-white">{isWet ? 'Wet Surface' : 'Dry Grip'}</strong>
            </span>
            <span>
              Length: <strong className="text-white">5.543 km</strong>
            </span>
            <span>
              Kerbs: <strong className="text-white">15 FIA/FIM Pianos</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
