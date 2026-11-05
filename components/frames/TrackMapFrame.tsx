'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  SEPANG_OFFICIAL_GPS_COORDS,
  SEPANG_CORNERS,
  getInterpolatedSepangSpline,
  getSepangSectorGeoJSON,
} from '@/lib/data/sepang-gps-track';
import {
  generateSepangKerbsGeoJSON,
  generatePitAndStartFinishGeoJSON,
} from '@/lib/utils/track-geometry';
import { getLatestRadarTimestamp, radarTileUrl } from '@/lib/utils/rainviewer';
import {
  Maximize2,
  Minimize2,
  Compass,
  Sun,
  Sunset,
  Moon,
  Settings2,
} from 'lucide-react';
import {
  GiRoad,
  GiSun,
} from 'react-icons/gi';
import { FrameContentProps } from './types';

const DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

export function TrackMapFrame({ ctx }: FrameContentProps) {
  const { circuitCoords, circuitName, weather } = ctx;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const cornerMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [view3d, setView3d] = useState(true);
  const [lighting, setLighting] = useState<'day' | 'dusk' | 'night'>('night');
  const [showCorners, setShowCorners] = useState(true);
  const [showSectors, setShowSectors] = useState(false);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [radarTs, setRadarTs] = useState<number | null>(null);
  const [radarReady, setRadarReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const closedSplineCoords = useMemo(() => getInterpolatedSepangSpline(720), []);
  const kerbsGeoJSON = useMemo(() => generateSepangKerbsGeoJSON(), []);
  const { startFinishGeoJSON, pitLaneGeoJSON } = useMemo(
    () => generatePitAndStartFinishGeoJSON(),
    []
  );

  // Fetch radar timestamp on mount + refresh every 5 minutes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const ts = await getLatestRadarTimestamp();
      if (!cancelled) setRadarTs(ts);
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const addTrackLayers = useCallback(
    (map: maplibregl.Map) => {
      try {
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
            paint: { 'fill-color': '#0f291e', 'fill-opacity': 0.35 },
          });
        }

        if (!map.getSource('sepang-pit-lane')) {
          map.addSource('sepang-pit-lane', { type: 'geojson', data: pitLaneGeoJSON });
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

        if (!map.getSource('sepang-kerbs')) {
          map.addSource('sepang-kerbs', { type: 'geojson', data: kerbsGeoJSON });
          map.addLayer({
            id: 'sepang-kerbs-white',
            type: 'line',
            source: 'sepang-kerbs',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#FFFFFF',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3, 17, 8],
              'line-opacity': 0.95,
            },
          });
          map.addLayer({
            id: 'sepang-kerbs-red-pianos',
            type: 'line',
            source: 'sepang-kerbs',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#E10600',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3, 17, 8],
              'line-dasharray': [2, 2],
              'line-opacity': 0.98,
            },
          });
        }

        if (!map.getSource('sepang-full-track')) {
          map.addSource('sepang-full-track', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: closedSplineCoords },
            },
          });
          map.addLayer({
            id: 'sepang-track-shadow',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#05070B',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 13, 17, 30],
              'line-opacity': 0.78,
            },
          });
          map.addLayer({
            id: 'sepang-track-white-edges',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#F8FAFC',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 10, 17, 24],
              'line-opacity': 0.92,
            },
          });
          map.addLayer({
            id: 'sepang-track-asphalt',
            type: 'line',
            source: 'sepang-full-track',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#262B35',
              'line-width': ['interpolate', ['linear'], ['zoom'], 13, 8.2, 17, 20],
              'line-opacity': 1,
            },
          });
        }

        if (!map.getSource('sepang-sectors')) {
          map.addSource('sepang-sectors', { type: 'geojson', data: getSepangSectorGeoJSON() });
          const colors: Record<number, string> = {
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
                visibility: showSectors ? 'visible' : 'none',
              },
              paint: {
                'line-color': colors[sec],
                'line-width': ['interpolate', ['linear'], ['zoom'], 13, 2.5, 16, 4.5],
                'line-opacity': 0.9,
              },
            });
          });
        }

        if (!map.getSource('sepang-start-finish')) {
          map.addSource('sepang-start-finish', { type: 'geojson', data: startFinishGeoJSON });
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

        try {
          if (map.getSource('openmaptiles') && !map.getLayer('3d-buildings')) {
            map.addLayer({
              id: '3d-buildings',
              source: 'openmaptiles',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': '#1e293b',
                'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 16],
                'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                'fill-extrusion-opacity': 0.85,
              },
            });
          }
        } catch {
          // ignore
        }
      } catch (err) {
        console.warn('[MAP] track layer error', err);
      }
    },
    [closedSplineCoords, kerbsGeoJSON, pitLaneGeoJSON, startFinishGeoJSON, showSectors]
  );

  const addRadar = useCallback(
    (map: maplibregl.Map, ts: number) => {
      try {
        if (map.getSource('radar')) {
          (map.getSource('radar') as maplibregl.RasterTileSource).setTiles([radarTileUrl(ts)]);
        } else {
          map.addSource('radar', {
            type: 'raster',
            tiles: [radarTileUrl(ts)],
            tileSize: 256,
            attribution: 'Radar © RainViewer',
          });
          const before = map.getLayer('sepang-infield-fill') ? 'sepang-infield-fill' : undefined;
          map.addLayer(
            {
              id: 'radar-layer',
              type: 'raster',
              source: 'radar',
              paint: { 'raster-opacity': 0.55 },
            },
            before
          );
        }
        if (map.getLayer('radar-layer')) {
          map.setLayoutProperty('radar-layer', 'visibility', showRadar ? 'visible' : 'none');
        }
        setRadarReady(true);
      } catch {
        setRadarReady(false);
      }
    },
    [showRadar]
  );

  // Init map
  useEffect(() => {
    if (!containerRef.current) return;

    if (typeof window !== 'undefined') {
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: circuitCoords,
      zoom: 14.6,
      pitch: view3d ? 50 : 0,
      bearing: view3d ? -15 : 0,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.resize();
      addTrackLayers(map);
      if (radarTs) addRadar(map, radarTs);
    });
    map.on('style.load', () => {
      addTrackLayers(map);
      if (radarTs) addRadar(map, radarTs);
    });
    map.on('idle', () => addTrackLayers(map));

    // Satellite-like atmosphere for night
    const container = containerRef.current;
    container.style.filter =
      lighting === 'day'
        ? 'none'
        : lighting === 'dusk'
        ? 'sepia(0.22) saturate(1.3) hue-rotate(-12deg) brightness(0.95)'
        : 'brightness(0.9) contrast(1.08)';

    return () => {
      cornerMarkersRef.current.forEach((m) => m.remove());
      cornerMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuitCoords.lat, circuitCoords.lng]);

  // Apply lighting atmosphere filter
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.filter =
      lighting === 'day'
        ? 'none'
        : lighting === 'dusk'
        ? 'sepia(0.22) saturate(1.3) hue-rotate(-12deg) brightness(0.95)'
        : 'brightness(0.9) contrast(1.08)';
  }, [lighting]);

  // Radar updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !radarTs) return;
    if (map.isStyleLoaded()) addRadar(map, radarTs);
  }, [radarTs, addRadar]);

  // Toggle radar visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('radar-layer')) return;
    map.setLayoutProperty('radar-layer', 'visibility', showRadar ? 'visible' : 'none');
  }, [showRadar]);

  // Toggle sectors
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    ([1, 2, 3, 4] as const).forEach((sec) => {
      const id = `sepang-sector-s${sec}`;
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', showSectors ? 'visible' : 'none');
      }
    });
  }, [showSectors]);

  // Toggle buildings
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('3d-buildings')) return;
    map.setLayoutProperty('3d-buildings', 'visibility', showBuildings ? 'visible' : 'none');
  }, [showBuildings]);

  // Corner markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    cornerMarkersRef.current.forEach((m) => m.remove());
    cornerMarkersRef.current = [];
    if (!showCorners) return;
    SEPANG_CORNERS.forEach((c) => {
      const el = document.createElement('div');
      el.style.cssText =
        'width:16px;height:16px;border-radius:9999px;background:rgba(11,13,20,0.92);' +
        'border:1.5px solid rgba(255,255,255,0.45);display:flex;align-items:center;' +
        'justify-content:center;font-size:8px;font-weight:800;color:#fff;' +
        'box-shadow:0 2px 6px rgba(0,0,0,0.65);';
      el.textContent = c.name.replace('T', '');
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
  }, [showCorners]);

  const setView = (is3d: boolean) => {
    setView3d(is3d);
    mapRef.current?.easeTo({
      pitch: is3d ? 50 : 0,
      bearing: is3d ? -15 : 0,
      duration: 600,
    });
  };

  const resetCamera = () => {
    mapRef.current?.flyTo({
      center: circuitCoords,
      zoom: 14.6,
      pitch: view3d ? 50 : 0,
      bearing: view3d ? -15 : 0,
      duration: 600,
    });
  };

  const toggleFullscreen = () => {
    if (!cardRef.current) return;
    if (!document.fullscreenElement) {
      cardRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div ref={cardRef} className="relative w-full h-full rounded-lg overflow-hidden bg-[#090D14]">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Floating controls: left column */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
        {/* View toggle */}
        <div className="rounded-full bg-black/70 backdrop-blur border border-white/15 p-0.5 flex flex-col">
          <button
            type="button"
            onClick={() => setView(true)}
            className={`text-[9px] font-bold w-7 h-6 rounded-full cursor-pointer ${
              view3d ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => setView(false)}
            className={`text-[9px] font-bold w-7 h-6 rounded-full cursor-pointer ${
              !view3d ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            2D
          </button>
        </div>

        {/* Options */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/15 flex items-center justify-center text-white cursor-pointer"
            title="Map options"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute top-0 left-10 w-44 rounded-xl bg-black/90 backdrop-blur border border-white/15 p-1.5 text-[10px] space-y-0.5 z-30">
              <ToggleRow label="Corners" active={showCorners} onClick={() => setShowCorners((v) => !v)} />
              <ToggleRow label="Sectors" active={showSectors} onClick={() => setShowSectors((v) => !v)} />
              <ToggleRow label="Buildings" active={showBuildings} onClick={() => setShowBuildings((v) => !v)} />
              <ToggleRow
                label="Weather Radar"
                active={showRadar}
                onClick={() => setShowRadar((v) => !v)}
                disabled={!radarTs}
              />
            </div>
          )}
        </div>

        {/* Lighting cycle */}
        <button
          type="button"
          onClick={() => setLighting(lighting === 'day' ? 'dusk' : lighting === 'dusk' ? 'night' : 'day')}
          className="w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/15 flex items-center justify-center text-white cursor-pointer"
          title={`Lighting: ${lighting}`}
        >
          {lighting === 'day' ? <Sun className="w-4 h-4" /> : lighting === 'dusk' ? <Sunset className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={resetCamera}
          className="w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/15 flex items-center justify-center text-white cursor-pointer"
          title="Reset camera"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/15 flex items-center justify-center text-white cursor-pointer"
          title="Fullscreen"
        >
          {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Weather badge (real Open-Meteo) */}
      {weather && (
        <div className="absolute top-2 right-12 z-20 px-2 py-1 rounded-full bg-black/70 backdrop-blur border border-white/15 text-[10px] text-white flex items-center gap-1.5">
          <GiSun className="w-3.5 h-3.5 text-white" />
          <span className="tabular-nums">{weather.airTemp.toFixed(0)}°C</span>
          <span className="text-white/30">·</span>
          <span className="tabular-nums">{weather.humidity.toFixed(0)}%</span>
          {weather.isRaining && (
            <>
              <span className="text-white/30">·</span>
              <span className="text-sky-300">RAIN</span>
            </>
          )}
        </div>
      )}

      {!radarReady && showRadar && radarTs === null && (
        <div className="absolute bottom-2 left-2 z-20 px-2 py-1 rounded-md bg-black/70 border border-white/10 text-[9px] text-neutral-400">
          Radar unavailable for this circuit
        </div>
      )}

      {/* Circuit label */}
      <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur border border-white/10 text-[9px] text-neutral-300">
        <GiRoad className="w-3.5 h-3.5 text-white" />
        <span className="truncate max-w-[180px]">{circuitName}</span>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/[0.08]'
      }`}
    >
      <span className={active ? 'text-white font-bold' : 'text-neutral-400'}>{label}</span>
      <span className={`w-6 h-3 rounded-full relative ${active ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
        <span
          className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${
            active ? 'left-3' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}
