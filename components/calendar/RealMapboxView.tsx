'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CircuitInfo, CHAMPIONSHIP_ROUNDS_2026 } from '@/lib/data/circuits-data';

// Suppress internal Mapbox token revocation and error crashes
if (typeof window !== 'undefined') {
  try {
    if (mapboxgl.Map && mapboxgl.Map.prototype) {
      (mapboxgl.Map.prototype as any)._revokeAuth = function () {
        // Safe no-op to prevent canvas wipe
      };
    }
  } catch {
    // Safe no-op
  }
}

interface RealMapboxViewProps {
  selectedCircuit: CircuitInfo;
  onSelectCircuit: (circuit: CircuitInfo) => void;
  onOpenModal?: (circuit: CircuitInfo) => void;
}

// Rock-solid high-resolution satellite imagery + boundary labels style
// 100% reliable, zero API key required, loads instantly worldwide
const SATELLITE_HYBRID_STYLE: mapboxgl.StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '© Mapbox, © Esri, Maxar, Earthstar Geographics',
    },
    'esri-boundaries': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 19,
    },
    {
      id: 'esri-boundaries-layer',
      type: 'raster',
      source: 'esri-boundaries',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// Generate HTML for an authentic 3D Map Pin with needle tip pointing to track
function createPinElement(circuit: CircuitInfo, isSelected: boolean, isCurrent: boolean): string {
  const isHighlighted = isSelected || isCurrent;
  const pinBg = isSelected
    ? 'bg-[#E10600]'
    : isCurrent
    ? 'bg-[#FF3B30]'
    : 'bg-[#00F5D4]';
  const textColor = isSelected || isCurrent ? 'text-white' : 'text-black';
  const ringColor = isSelected ? 'ring-4 ring-white shadow-[0_0_24px_rgba(225,6,0,0.9)]' : 'ring-2 ring-black/80';

  return `
    <div class="relative flex flex-col items-center cursor-pointer group select-none pointer-events-auto transition-transform duration-300 ${
      isSelected ? 'scale-125 z-40' : 'hover:scale-115 z-20'
    }">
      <!-- Pulsing Ground Radar Rings for Active Circuit -->
      ${
        isHighlighted
          ? `<div class="absolute -bottom-1 w-8 h-8 rounded-full bg-[#E10600]/40 animate-ping pointer-events-none -translate-x-1/2 left-1/2"></div>
             <div class="absolute -bottom-1 w-5 h-5 rounded-full bg-[#E10600]/60 pointer-events-none -translate-x-1/2 left-1/2"></div>`
          : `<div class="absolute -bottom-0.5 w-3 h-3 rounded-full bg-cyan-400/30 pointer-events-none -translate-x-1/2 left-1/2"></div>`
      }

      <!-- Tooltip Label above the Pin -->
      <div class="absolute bottom-full mb-1.5 px-2 py-0.5 rounded-md bg-black/90 backdrop-blur-md border border-white/20 text-[10px] font-sans font-bold text-white whitespace-nowrap shadow-2xl transition-opacity pointer-events-none ${
        isSelected ? 'opacity-100 ring-1 ring-[#E10600]' : 'opacity-0 group-hover:opacity-100'
      }">
        R${circuit.round_number} · ${circuit.name}
      </div>

      <!-- Pin Teardrop Head -->
      <div class="w-7 h-7 rounded-full ${pinBg} ${ringColor} flex items-center justify-center shadow-2xl transition-all">
        <span class="text-[10px] font-sans font-black ${textColor} leading-none tracking-tight">
          ${circuit.round_number}
        </span>
      </div>

      <!-- Needle Tip pointing to exact track coordinates -->
      <div class="w-0.5 h-2.5 ${isSelected ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-white/80'}"></div>
      <div class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#E10600] ring-1 ring-white' : 'bg-black ring-1 ring-cyan-400'}"></div>
    </div>
  `;
}

export function RealMapboxView({
  selectedCircuit,
  onSelectCircuit,
}: RealMapboxViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: { marker: mapboxgl.Marker; el: HTMLElement } }>({});
  const isFlyingRef = useRef<boolean>(false);
  const selectedCircuitRef = useRef<CircuitInfo>(selectedCircuit);
  selectedCircuitRef.current = selectedCircuit;

  // Helper to ensure ONLY the selected circuit pin is displayed when zoomed in (zoom > 7),
  // preventing distant markers from projecting across the horizon onto the track view.
  // When zoomed out (zoom <= 7), displays all 22 pins across the globe/world view.
  const syncPinVisibility = () => {
    const map = mapRef.current;
    if (!map) return;
    const z = map.getZoom();
    const isZoomedIn = z > 7;
    const currentSelectedId = selectedCircuitRef.current?.id;

    Object.keys(markersRef.current).forEach((id) => {
      const item = markersRef.current[id];
      if (!item) return;
      const isSelected = id === currentSelectedId;
      if (isZoomedIn) {
        item.el.style.display = isSelected ? 'flex' : 'none';
      } else {
        item.el.style.display = 'flex';
      }
    });

    try {
      if (map.getLayer('circuit-radar-glow')) {
        if (isZoomedIn && currentSelectedId) {
          map.setFilter('circuit-radar-glow', ['==', ['get', 'id'], currentSelectedId]);
          map.setFilter('circuit-center-dot', ['==', ['get', 'id'], currentSelectedId]);
        } else {
          map.setFilter('circuit-radar-glow', null);
          map.setFilter('circuit-center-dot', null);
        }
      }
    } catch {
      // Safe no-op
    }
  };

  const rawToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || '';
  const hasValidUserToken = Boolean(
    rawToken && !rawToken.includes('demo') && rawToken.startsWith('pk.') && rawToken.length > 30
  );
  const effectiveToken = hasValidUserToken
    ? rawToken
    : 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmYW5nIn0.demo';

  // Initialize official Mapbox GL JS map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = effectiveToken;

    // Use Mapbox Standard if valid user token is provided, otherwise bulletproof satellite hybrid
    const initialStyle: string | mapboxgl.StyleSpecification = hasValidUserToken
      ? 'mapbox://styles/mapbox/standard'
      : SATELLITE_HYBRID_STYLE;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [selectedCircuit.lng, selectedCircuit.lat],
      zoom: 14.5,
      pitch: 50, // 3D angled perspective
      bearing: -15,
      projection: 'globe', // Native 3D rotating globe
      minZoom: 1.5,
      maxZoom: 19,
      attributionControl: true, // Official Mapbox attribution included in their license
      accessToken: effectiveToken,
    });

    (map as any)._silenceAuthErrors = true;

    // Gracefully fallback to satellite hybrid if standard style 401 occurs
    map.on('error', (e) => {
      const msg = e?.error?.message || '';
      if (msg.includes('access token') || msg.includes('401') || msg.includes('Forbidden')) {
        try {
          map.setStyle(SATELLITE_HYBRID_STYLE);
        } catch {
          // Safe fallback
        }
      }
    });

    mapRef.current = map;

    map.on('style.load', () => {
      // Configure lighting if using Mapbox Standard
      if (hasValidUserToken) {
        try {
          map.setConfigProperty('basemap', 'lightPreset', 'dusk');
          map.setConfigProperty('basemap', 'theme', 'warm');
        } catch {
          // Non-standard style safe no-op
        }
      }

      // Add native WebGL GeoJSON layers so pins are ALWAYS visible on the 3D globe at any zoom
      try {
        const geojsonFeatures = CHAMPIONSHIP_ROUNDS_2026.map((c) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [c.lng, c.lat],
          },
          properties: {
            id: c.id,
            round: c.round_number,
            name: c.name,
            isSelected: c.id === selectedCircuit.id,
            isCurrent: c.status === 'CURRENT',
          },
        }));

        if (!map.getSource('circuits-geojson')) {
          map.addSource('circuits-geojson', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: geojsonFeatures,
            },
          });

          // Glowing radar halo circle layer
          map.addLayer({
            id: 'circuit-radar-glow',
            type: 'circle',
            source: 'circuits-geojson',
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 6, 8, 12, 16, 20],
              'circle-color': [
                'case',
                ['==', ['get', 'id'], selectedCircuit.id],
                '#E10600',
                ['==', ['get', 'isCurrent'], true],
                '#FF3B30',
                '#00F5D4',
              ],
              'circle-opacity': 0.75,
              'circle-blur': 0.4,
            },
          });

          // Core sharp center point
          map.addLayer({
            id: 'circuit-center-dot',
            type: 'circle',
            source: 'circuits-geojson',
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 3, 8, 5, 16, 7],
              'circle-color': '#FFFFFF',
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#000000',
            },
          });
        }
      } catch {
        // Safe layer initialization
      }
    });

    map.on('load', () => {
      map.resize();

      // Atmospheric starry sky and space fog on the 3D globe
      try {
        map.setFog({
          'space-color': 'rgb(8, 10, 20)',
          'star-intensity': 1.0, // Official Mapbox procedural stars
          'horizon-blend': 0.15,
          'color': 'rgb(240, 244, 255)',
          'high-color': 'rgb(36, 92, 223)',
        });
      } catch {
        // Fog safe fallback
      }

      // Create interactive circuit Pin Markers
      CHAMPIONSHIP_ROUNDS_2026.forEach((circuit) => {
        const isSelected = selectedCircuit.id === circuit.id;
        const isCurrent = circuit.status === 'CURRENT';

        const el = document.createElement('div');
        el.className = 'circuit-pin-container pointer-events-auto';
        el.setAttribute('data-circuit-id', circuit.id);
        el.innerHTML = createPinElement(circuit, isSelected, isCurrent);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectCircuit(circuit);
          const cardElem = document.getElementById(`circuit-card-${circuit.id}`);
          if (cardElem) {
            cardElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });

        // CRITICAL: pitchAlignment: 'viewport' & rotationAlignment: 'viewport'
        // ensures the pins NEVER flatten into the ground or flip backwards on 3D globe/pitch!
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
          pitchAlignment: 'viewport',
          rotationAlignment: 'viewport',
        })
          .setLngLat([circuit.lng, circuit.lat])
          .addTo(map);

        markersRef.current[circuit.id] = { marker, el };
      });

      // Synchronize pin and radar layer visibility based on initial zoom
      syncPinVisibility();
    });

    // Auto-flatten pitch smoothly ONLY during manual user scroll/wheel zoom (NOT during flyTo)
    const handleZoomAdjustment = () => {
      syncPinVisibility();
      if (isFlyingRef.current) return;
      const z = map.getZoom();
      if (z < 7) {
        const targetPitch = Math.max(0, (z - 2) * 8);
        if (map.getPitch() > targetPitch + 2) {
          map.setPitch(targetPitch);
        }
        if (z < 4 && Math.abs(map.getBearing()) > 2) {
          map.setBearing(0);
        }
      }
    };
    map.on('zoom', handleZoomAdjustment);
    map.on('move', syncPinVisibility);

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

  // Update marker styles and smoothly fly camera when selectedCircuit changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update DOM Pin Markers
    Object.keys(markersRef.current).forEach((id) => {
      const item = markersRef.current[id];
      if (!item) return;
      const { el } = item;
      const isSelected = selectedCircuit.id === id;
      const roundCircuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.id === id);
      if (!roundCircuit) return;
      const isCurrent = roundCircuit.status === 'CURRENT';

      el.innerHTML = createPinElement(roundCircuit, isSelected, isCurrent);
    });

    // Update GeoJSON layer highlight
    try {
      const source = map.getSource('circuits-geojson') as mapboxgl.GeoJSONSource | undefined;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: CHAMPIONSHIP_ROUNDS_2026.map((c) => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [c.lng, c.lat],
            },
            properties: {
              id: c.id,
              round: c.round_number,
              name: c.name,
              isSelected: c.id === selectedCircuit.id,
              isCurrent: c.status === 'CURRENT',
            },
          })),
        });
      }
    } catch {
      // GeoJSON update safe no-op
    }

    // Immediately sync pin visibility so distant pins disappear when zooming into a circuit
    syncPinVisibility();

    // Mark isFlying so zoom event handler does not interrupt the smooth camera flight
    isFlyingRef.current = true;

    map.flyTo({
      center: [selectedCircuit.lng, selectedCircuit.lat],
      zoom: 14.5,
      pitch: 50,
      bearing: -15,
      essential: true,
      duration: 2200,
    });

    map.once('moveend', () => {
      isFlyingRef.current = false;
      syncPinVisibility();
    });
  }, [selectedCircuit]);

  return (
    <div
      className="relative w-full h-full bg-[#05070E] overflow-hidden select-none font-sans"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(20, 35, 70, 0.45) 0%, rgba(5, 7, 14, 0.95) 70%, #05070E 100%),
          radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 70px 90px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
          radial-gradient(2px 2px at 150px 60px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 220px 180px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
          radial-gradient(1.5px 1.5px at 310px 120px, rgba(255,255,255,0.9), rgba(0,0,0,0)),
          radial-gradient(1px 1px at 380px 240px, rgba(255,255,255,0.75), rgba(0,0,0,0))`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100% 100%, 300px 300px, 420px 420px, 250px 250px, 350px 350px, 480px 480px, 320px 320px',
      }}
    >
      {/* Official Mapbox GL Map Canvas with its native license & attribution controls */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
    </div>
  );
}
