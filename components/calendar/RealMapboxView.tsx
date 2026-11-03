'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CircuitInfo, CHAMPIONSHIP_ROUNDS_2026 } from '@/lib/data/circuits-data';
import {
  Globe,
  MapPin,
  FileText,
  ExternalLink,
  Crosshair,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface RealMapboxViewProps {
  selectedCircuit: CircuitInfo;
  onSelectCircuit: (circuit: CircuitInfo) => void;
  onOpenModal?: (circuit: CircuitInfo) => void;
}

// Crisp cross-platform Country Flag component
function CountryFlag({ iso, country, className = 'w-7 h-5' }: { iso?: string; country?: string; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const cleanIso = (iso || '').toLowerCase().trim();
  const isoMap: Record<string, string> = {
    gp: 'un',
    uk: 'gb',
    england: 'gb-eng',
  };
  const resolvedIso = isoMap[cleanIso] || cleanIso;

  if (resolvedIso && resolvedIso.length === 2 && !imageError) {
    return (
      <img
        src={`https://flagcdn.com/w80/${resolvedIso}.png`}
        alt={country || resolvedIso.toUpperCase()}
        loading="lazy"
        onError={() => setImageError(true)}
        className={`${className} object-cover rounded-[2px] ring-1 ring-inset ring-black/30 shrink-0`}
      />
    );
  }
  return <span className="text-base shrink-0">🏁</span>;
}

// High-definition dark raster style (Esri World Dark Gray Base + Labels)
// Completely free, rock-solid, zero watermarks, zero API key required
const DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'esri-dark-base': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '© Esri, © OpenStreetMap contributors',
    },
    'esri-dark-reference': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'dark-base-layer',
      type: 'raster',
      source: 'esri-dark-base',
      minzoom: 0,
      maxzoom: 18,
    },
    {
      id: 'dark-reference-layer',
      type: 'raster',
      source: 'esri-dark-reference',
      minzoom: 0,
      maxzoom: 18,
    },
  ],
};

// High-resolution satellite imagery (Esri World Imagery + Boundaries/Places)
const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '© Esri, Maxar, Earthstar Geographics',
    },
    'esri-satellite-reference': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'satellite-tiles',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 19,
    },
    {
      id: 'satellite-reference-layer',
      type: 'raster',
      source: 'esri-satellite-reference',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function RealMapboxView({
  selectedCircuit,
  onSelectCircuit,
  onOpenModal,
}: RealMapboxViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: { marker: maplibregl.Marker; el: HTMLElement } }>({});
  const [mapStyleType, setMapStyleType] = useState<'dark' | 'satellite'>('dark');
  const [viewMode, setViewMode] = useState<'globe' | 'track'>('track');

  // Initialize Real Mapbox/MapLibre map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: DARK_STYLE,
      center: [selectedCircuit.lng, selectedCircuit.lat],
      zoom: 14.2,
      pitch: 45,
      bearing: -10,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Force initial resize to fill flex parent exactly
      map.resize();

      // Create interactive circuit markers matching Reference Image 1 & 2
      CHAMPIONSHIP_ROUNDS_2026.forEach((circuit) => {
        const isSelected = selectedCircuit.id === circuit.id;
        const isCurrent = circuit.status === 'CURRENT';

        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center select-none transition-transform duration-300';
        el.setAttribute('data-circuit-id', circuit.id);

        // Marker styling: matching user's reference images
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${
              isSelected || isCurrent
                ? `<div class="absolute -inset-2.5 rounded-full bg-[#E10600]/40 animate-ping pointer-events-none"></div>`
                : ''
            }
            <div class="w-4 h-4 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-[#E10600] ring-4 ring-white shadow-xl scale-125'
                : isCurrent
                ? 'bg-[#E10600] ring-2 ring-white/90 scale-110 shadow-lg'
                : 'bg-[#00F5D4] ring-2 ring-black/80 hover:scale-125'
            }">
              <div class="w-1.5 h-1.5 rounded-full ${isSelected || isCurrent ? 'bg-white' : 'bg-black'}"></div>
            </div>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-sans font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            R${circuit.round_number} · ${circuit.name}
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectCircuit(circuit);
          const cardElem = document.getElementById(`circuit-card-${circuit.id}`);
          if (cardElem) {
            cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([circuit.lng, circuit.lat])
          .addTo(map);

        markersRef.current[circuit.id] = { marker, el };
      });
    });

    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update marker styles and fly map when selectedCircuit changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update marker classes
    Object.keys(markersRef.current).forEach((id) => {
      const { el } = markersRef.current[id];
      const isSelected = selectedCircuit.id === id;
      const roundCircuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.id === id);
      const isCurrent = roundCircuit?.status === 'CURRENT';

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${
            isSelected || isCurrent
              ? `<div class="absolute -inset-2.5 rounded-full bg-[#E10600]/40 animate-ping pointer-events-none"></div>`
              : ''
          }
          <div class="w-4 h-4 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-[#E10600] ring-4 ring-white shadow-xl scale-125'
              : isCurrent
              ? 'bg-[#E10600] ring-2 ring-white/90 scale-110 shadow-lg'
              : 'bg-[#00F5D4] ring-2 ring-black/80 hover:scale-125'
          }">
            <div class="w-1.5 h-1.5 rounded-full ${isSelected || isCurrent ? 'bg-white' : 'bg-black'}"></div>
          </div>
        </div>
        <div class="mt-1 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-sans font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          R${roundCircuit?.round_number ?? ''} · ${roundCircuit?.name ?? ''}
        </div>
      `;
    });

    // Fly smoothly to selected circuit
    map.flyTo({
      center: [selectedCircuit.lng, selectedCircuit.lat],
      zoom: viewMode === 'track' ? 14.5 : 2.2,
      pitch: viewMode === 'track' ? 50 : 0,
      bearing: viewMode === 'track' ? -15 : 0,
      essential: true,
      duration: 2200,
    });
  }, [selectedCircuit, viewMode]);

  // Toggle between Overview and Track Zoom
  const toggleViewMode = (mode: 'globe' | 'track') => {
    setViewMode(mode);
    const map = mapRef.current;
    if (!map) return;

    if (mode === 'track') {
      map.flyTo({
        center: [selectedCircuit.lng, selectedCircuit.lat],
        zoom: 14.5,
        pitch: 50,
        bearing: -15,
        essential: true,
        duration: 2400,
      });
    } else {
      map.flyTo({
        center: [selectedCircuit.lng, selectedCircuit.lat],
        zoom: 2.2,
        pitch: 0,
        bearing: 0,
        essential: true,
        duration: 2000,
      });
    }
  };

  // Toggle map style (Dark Vector vs Real Satellite)
  const toggleStyle = (style: 'dark' | 'satellite') => {
    setMapStyleType(style);
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(style === 'dark' ? DARK_STYLE : SATELLITE_STYLE);
  };

  return (
    <div
      className="relative w-full h-full bg-[#05070E] overflow-hidden select-none flex flex-col justify-between"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(13, 24, 51, 0.6) 0%, #05070E 100%), radial-gradient(1px 1px at 25px 35px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 60px 85px, rgba(255,255,255,0.7), rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 120px 50px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 180px 140px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 250px 210px, rgba(255,255,255,0.8), rgba(0,0,0,0))`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100% 100%, 250px 250px, 320px 320px, 200px 200px, 380px 380px, 290px 290px',
      }}
    >
      {/* Real Mapbox Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Top Floating Controls HUD (Matching Image 1 & 2) */}
      <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-auto bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        {/* Selected Circuit Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/15 shadow-xl">
          <CountryFlag iso={selectedCircuit.country_code} country={selectedCircuit.country} className="w-6 h-4.5" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#E10600]">
              Round {selectedCircuit.round_number}
            </span>
            <span className="text-xs text-white font-sans font-bold truncate max-w-[220px]">
              {selectedCircuit.name}
            </span>
          </div>
        </div>

        {/* View Controls: [ World Overview ] / [ Track Zoom ] + [ Dark / Satellite ] */}
        <div className="flex items-center gap-2">
          {/* Overview vs Track View */}
          <div className="flex items-center p-1 bg-black/70 backdrop-blur-xl border border-white/15 rounded-full text-xs font-sans shadow-lg">
            <button
              onClick={() => toggleViewMode('globe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'globe'
                  ? 'bg-[#E10600] text-white font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>World</span>
            </button>

            <button
              onClick={() => toggleViewMode('track')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'track'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Track Zoom</span>
            </button>
          </div>

          {/* Style Toggle (Dark vs Satellite) */}
          <button
            onClick={() => toggleStyle(mapStyleType === 'dark' ? 'satellite' : 'dark')}
            className={`p-2 rounded-full border text-xs transition-all bg-black/70 backdrop-blur-xl shadow-lg ${
              mapStyleType === 'satellite'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-white/15 text-neutral-300 hover:text-white'
            }`}
            title="Toggle Satellite Imagery"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Recenter */}
          <button
            onClick={() => {
              const map = mapRef.current;
              if (map) {
                map.flyTo({
                  center: [selectedCircuit.lng, selectedCircuit.lat],
                  zoom: viewMode === 'track' ? 14.5 : 2.5,
                  essential: true,
                });
              }
            }}
            className="p-2 rounded-full bg-black/70 backdrop-blur-xl hover:bg-[#E10600]/25 text-neutral-300 hover:text-[#FF2A24] border border-white/15 text-xs transition-colors shadow-lg"
            title="Recenter on Circuit"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mapbox Authentic Attribution Watermark (Identical to Image 1 & 2 bottom left) */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none flex items-center gap-2 text-[11px] font-sans text-white/60 bg-black/50 px-2.5 py-1 rounded backdrop-blur-md border border-white/10">
        <span className="font-extrabold tracking-tight text-white/90">mapbox</span>
        <span>© Mapbox</span>
        <span>© OpenStreetMap</span>
        <span className="hover:underline cursor-pointer pointer-events-auto">Improve this map</span>
      </div>

      {/* Bottom Floating Tactical Circuit Bar (Matching Image 1 & 2 bottom ribbon) */}
      <div className="relative z-20 m-4 p-4 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3.5">
          {/* Circuit SVG silhouette */}
          <div className="w-16 h-12 bg-white/[0.04] rounded-xl p-1 flex items-center justify-center shrink-0 border border-white/[0.08]">
            <svg viewBox="0 0 200 120" className="w-full h-full max-h-10 filter drop-shadow">
              <path
                d={selectedCircuit.svg_path}
                fill="none"
                stroke={selectedCircuit.status === 'CURRENT' ? '#E10600' : '#FFFFFF'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-sans font-extrabold text-white">
                {selectedCircuit.name}
              </span>
              <span className="text-xs text-neutral-400 font-sans">
                · {selectedCircuit.city ? `${selectedCircuit.city}, ` : ''}{selectedCircuit.country}
              </span>
            </div>

            <div className="text-xs font-sans text-neutral-300 flex items-center gap-2 mt-0.5">
              <span>{selectedCircuit.length_km} km</span>
              <span>·</span>
              <span>{selectedCircuit.corners} Turns</span>
              <span>·</span>
              <span className="text-[#FF2A24] font-semibold">{selectedCircuit.longest_straight_m}m Straight</span>
              <span>·</span>
              <span>Record: <strong className="text-white font-bold">{selectedCircuit.lap_record.time}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedCircuit.pdf_url && (
            <a
              href={selectedCircuit.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-[#E10600]/25 hover:text-[#FF2A24] text-xs font-sans font-semibold text-white transition-colors border border-white/15"
              title="Open Official MotoGP Circuit Information PDF"
            >
              <FileText className="w-3.5 h-3.5 text-[#E10600]" />
              <span>MotoGP Sheet</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}

          {selectedCircuit.osm_url && (
            <a
              href={selectedCircuit.osm_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-cyan-500/25 hover:text-cyan-300 text-xs font-sans font-semibold text-white transition-colors border border-white/15"
              title="Open on OpenStreetMap"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}

          {onOpenModal && (
            <button
              onClick={() => onOpenModal(selectedCircuit)}
              className="px-4 py-1.5 rounded-full bg-[#E10600] hover:bg-[#FF2A24] text-white text-xs font-sans font-bold transition-all shadow-md"
            >
              Specs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
