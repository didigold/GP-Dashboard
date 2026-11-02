'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CircuitInfo, CHAMPIONSHIP_ROUNDS_2026 } from '@/lib/data/circuits-data';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  MapPin,
  ExternalLink,
  FileText,
  ChevronRight,
  Maximize2,
  Crosshair,
  Sparkles,
  Info,
  Globe,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface GlobeCalendarViewProps {
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
        className={`${className} object-cover rounded shadow border border-white/10 shrink-0`}
      />
    );
  }
  return <span className="text-lg shrink-0">🏁</span>;
}

// Convert latitude and longitude to 3D Cartesian coordinates on a sphere of radius R
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedural tactical Earth texture with vibrant continents, navy ocean, and graticule grid (matching Image 1)
function createTacticalEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich deep navy ocean base
    ctx.fillStyle = '#0B1426';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle latitude and longitude graticule grid
    ctx.strokeStyle = 'rgba(70, 110, 180, 0.15)';
    ctx.lineWidth = 1;

    for (let lat = -75; lat <= 75; lat += 15) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    for (let lng = -180; lng <= 180; lng += 15) {
      const x = ((lng + 180) / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Equator line in vibrant racing red
    ctx.strokeStyle = 'rgba(225, 6, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Stylized continent landmasses (tactical aerospace theme)
    const landClusters = [
      { x: 460, y: 320, rx: 220, ry: 140 }, // North America
      { x: 620, y: 680, rx: 130, ry: 200 }, // South America
      { x: 1060, y: 300, rx: 130, ry: 90 }, // Europe
      { x: 1090, y: 550, rx: 160, ry: 180 }, // Africa
      { x: 1470, y: 340, rx: 290, ry: 160 }, // Asia
      { x: 1660, y: 730, rx: 130, ry: 100 }, // Australia
      { x: 990, y: 260, rx: 35, ry: 40 },   // UK
      { x: 1720, y: 380, rx: 40, ry: 60 },  // Japan
      { x: 1540, y: 640, rx: 90, ry: 45 },  // Indonesia / Malaysia
    ];

    // Land base fill
    ctx.fillStyle = '#182740';
    landClusters.forEach((cluster) => {
      ctx.beginPath();
      ctx.ellipse(cluster.x, cluster.y, cluster.rx, cluster.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Coastal glowing outline
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
    ctx.lineWidth = 2;
    landClusters.forEach((cluster) => {
      ctx.beginPath();
      ctx.ellipse(cluster.x, cluster.y, cluster.rx, cluster.ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // High density telemetry dot grid over land
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    landClusters.forEach((cluster) => {
      const dotsX = Math.floor(cluster.rx / 7);
      const dotsY = Math.floor(cluster.ry / 7);
      for (let i = -dotsX; i <= dotsX; i++) {
        for (let j = -dotsY; j <= dotsY; j++) {
          const normDist = (i * i) / (dotsX * dotsX) + (j * j) / (dotsY * dotsY);
          if (normDist <= 0.95 && Math.random() > 0.18) {
            const px = cluster.x + i * 7 + (Math.random() * 2 - 1);
            const py = cluster.y + j * 7 + (Math.random() * 2 - 1);
            ctx.beginPath();
            ctx.arc(px, py, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function GlobeCalendarView({
  selectedCircuit,
  onSelectCircuit,
  onOpenModal,
}: GlobeCalendarViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState<'globe' | 'map'>('globe');
  const [hoveredCircuit, setHoveredCircuit] = useState<CircuitInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const globeGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Directly center the globe on the selected circuit
  const focusOnCircuit = useCallback((circuit: CircuitInfo) => {
    if (!globeGroupRef.current) return;

    // Mathematical formula to align (lat, lng) with +Z camera vector
    const targetY = (-90 - circuit.lng) * (Math.PI / 180);
    const targetX = -(circuit.lat) * (Math.PI / 180);

    targetRotationRef.current = { x: targetX, y: targetY };
  }, []);

  useEffect(() => {
    if (selectedCircuit) {
      focusOnCircuit(selectedCircuit);
    }
  }, [selectedCircuit, focusOnCircuit]);

  useEffect(() => {
    if (displayMode !== 'globe' || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Space Starfield (twinkling star background like Image 1)
    const starCount = 1600;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1600;
      starPositions[i + 1] = (Math.random() - 0.5) * 1600;
      starPositions[i + 2] = (Math.random() - 0.5) * 1600;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xaaccff,
      size: 1.3,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2500);
    camera.position.set(0, 0, 310);
    cameraRef.current = camera;

    // 4. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 5. Globe Root Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 100;

    // 6. Earth Sphere Mesh
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthTexture = createTacticalEarthTexture();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: 0xffffff,
      emissive: 0x07111e,
      specular: 0x4466aa,
      shininess: 25,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 7. Atmospheric Fresnel Rim Glow
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Outer Cyan Halo
    const outerHaloGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.065, 32, 32);
    const outerHaloMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const outerHaloMesh = new THREE.Mesh(outerHaloGeometry, outerHaloMaterial);
    globeGroup.add(outerHaloMesh);

    // 8. Lighting (Direct Front Light to ensure entire earth is beautifully visible)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.4);
    frontLight.position.set(0, 50, 320);
    scene.add(frontLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(300, 200, 250);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x2266cc, 1.8);
    rimLight.position.set(-300, -100, -150);
    scene.add(rimLight);

    // 9. Add Grand Prix Markers
    const markerHitMeshes: THREE.Mesh[] = [];

    CHAMPIONSHIP_ROUNDS_2026.forEach((circuit) => {
      const position = latLngToVector3(circuit.lat, circuit.lng, GLOBE_RADIUS);
      const isSelected = selectedCircuit?.id === circuit.id;
      const isCurrent = circuit.status === 'CURRENT';

      // Matching colors from user's Image 1: Green for scheduled/finished events, Red with pulse for selected/active
      const markerColor = isSelected ? 0xe10600 : isCurrent ? 0xe10600 : 0x00f5d4;

      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize());

      // Vertical laser beacon
      const pinHeight = isSelected || isCurrent ? 14 : 9;
      const pinGeom = new THREE.CylinderGeometry(0.7, 0.7, pinHeight, 8);
      pinGeom.translate(0, pinHeight / 2, 0);
      const pinMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: isSelected || isCurrent ? 0.95 : 0.75,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      markerGroup.add(pinMesh);

      // Marker Head Sphere (prominent pin head)
      const headGeom = new THREE.SphereGeometry(isSelected ? 3.6 : 2.5, 16, 16);
      headGeom.translate(0, pinHeight, 0);
      const headMat = new THREE.MeshBasicMaterial({
        color: markerColor,
      });
      const headMesh = new THREE.Mesh(headGeom, headMat);
      markerGroup.add(headMesh);

      // Selected white ring around pin head (matching Image 1!)
      if (isSelected) {
        const ringBorderGeom = new THREE.RingGeometry(3.6, 4.4, 32);
        ringBorderGeom.translate(0, pinHeight, 0);
        const ringBorderMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
        const ringBorderMesh = new THREE.Mesh(ringBorderGeom, ringBorderMat);
        markerGroup.add(ringBorderMesh);
      }

      // Radar pulse ring on ground for selected or active circuit
      if (isSelected || isCurrent) {
        const ringGeom = new THREE.RingGeometry(2, 6.5, 32);
        ringGeom.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: markerColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.name = 'radarRing';
        markerGroup.add(ringMesh);
      }

      // Hit mesh for clicking & hovering
      const hitGeom = new THREE.SphereGeometry(7, 12, 12);
      hitGeom.translate(0, pinHeight, 0);
      const hitMat = new THREE.MeshBasicMaterial({
        visible: false,
      });
      const hitMesh = new THREE.Mesh(hitGeom, hitMat);
      hitMesh.userData = { circuit };
      markerGroup.add(hitMesh);
      markerHitMeshes.push(hitMesh);

      globeGroup.add(markerGroup);
    });

    if (selectedCircuit) {
      focusOnCircuit(selectedCircuit);
    }

    // 10. Pointer Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      targetRotationRef.current = null;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingRef.current && globeGroupRef.current) {
        const deltaX = clientX - previousMousePositionRef.current.x;
        const deltaY = clientY - previousMousePositionRef.current.y;

        globeGroupRef.current.rotation.y += deltaX * 0.005;
        globeGroupRef.current.rotation.x += deltaY * 0.005;

        globeGroupRef.current.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroupRef.current.rotation.x));

        previousMousePositionRef.current = { x: clientX, y: clientY };
        return;
      }

      // Hover Raycast
      if ('clientX' in e && containerRef.current && cameraRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(markerHitMeshes);

        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData.circuit as CircuitInfo;
          setHoveredCircuit(hovered);
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          container.style.cursor = 'pointer';
        } else {
          setHoveredCircuit(null);
          setTooltipPos(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(markerHitMeshes);

      if (intersects.length > 0) {
        const clickedCircuit = intersects[0].object.userData.circuit as CircuitInfo;
        onSelectCircuit(clickedCircuit);
        focusOnCircuit(clickedCircuit);

        const cardElem = document.getElementById(`circuit-card-${clickedCircuit.id}`);
        if (cardElem) {
          cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    domElement.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('click', handleClick);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    domElement.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.15;
      cameraRef.current.position.z = Math.max(180, Math.min(450, cameraRef.current.position.z));
    };
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 11. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Pulsing radar ring
      const radar = globeGroup.getObjectByName('radarRing') as THREE.Mesh | undefined;
      if (radar) {
        const scale = 1 + (time * 1.5) % 2.5;
        radar.scale.set(scale, scale, scale);
        const mat = radar.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.8 - (scale - 1) * 0.35);
      }

      // Smooth camera interpolation towards target circuit
      if (targetRotationRef.current && globeGroupRef.current) {
        const target = targetRotationRef.current;
        globeGroupRef.current.rotation.x += (target.x - globeGroupRef.current.rotation.x) * 0.08;

        let diffY = target.y - globeGroupRef.current.rotation.y;
        while (diffY > Math.PI) diffY -= Math.PI * 2;
        while (diffY < -Math.PI) diffY += Math.PI * 2;

        globeGroupRef.current.rotation.y += diffY * 0.08;

        if (
          Math.abs(diffY) < 0.005 &&
          Math.abs(target.x - globeGroupRef.current.rotation.x) < 0.005
        ) {
          targetRotationRef.current = null;
        }
      } else if (isAutoRotating && !isDraggingRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0018;
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 580;
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('click', handleClick);
      domElement.removeEventListener('touchstart', handlePointerDown);
      domElement.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);

      earthGeometry.dispose();
      earthMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [displayMode, focusOnCircuit, isAutoRotating, onSelectCircuit, selectedCircuit]);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] rounded-3xl bg-[#060810] border border-white/[0.08] overflow-hidden select-none shadow-2xl flex flex-col justify-between">
      {/* Top HUD Controls Overlay (Inspired by reference Image 1 & 2) */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2.5">
          <CountryFlag iso={selectedCircuit.country_code} country={selectedCircuit.country} className="w-7 h-5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E10600]">
                Round {selectedCircuit.round_number}
              </span>
              <span className="text-xs text-neutral-400 font-sans">· {selectedCircuit.country}</span>
            </div>
            <div className="text-sm font-sans font-bold text-white leading-tight">
              {selectedCircuit.name}
            </div>
          </div>
        </div>

        {/* View mode toggle: 3D Globe vs Circuit Map (Direct inspired by Image 1 & 2 transition!) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-white/[0.06] border border-white/[0.1] rounded-full text-xs font-sans">
            <button
              onClick={() => setDisplayMode('globe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                displayMode === 'globe'
                  ? 'bg-[#E10600] text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Globe</span>
            </button>

            <button
              onClick={() => setDisplayMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                displayMode === 'map'
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Circuit Map</span>
            </button>
          </div>

          {displayMode === 'globe' && (
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2 rounded-full border text-xs transition-all ${
                isAutoRotating
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-white'
              }`}
              title="Toggle Auto Rotation"
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}

          {displayMode === 'globe' && (
            <button
              onClick={() => focusOnCircuit(selectedCircuit)}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-[#E10600]/20 text-neutral-300 hover:text-[#FF2A24] border border-white/[0.08] text-xs transition-colors"
              title="Recenter on Track"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main View Area: 3D Globe or Circuit Map (Image 2 Street View!) */}
      {displayMode === 'globe' ? (
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing" />
      ) : (
        /* Circuit Map Mode (High-res dark OpenStreetMap view showing exact track roads & layout in town, exactly like Image 2!) */
        <div className="absolute inset-0 w-full h-full z-10 bg-[#090C15] overflow-hidden">
          <iframe
            title={`Map of ${selectedCircuit.name}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCircuit.lng - 0.035}%2C${selectedCircuit.lat - 0.02}%2C${selectedCircuit.lng + 0.035}%2C${selectedCircuit.lat + 0.02}&layer=mapnik&marker=${selectedCircuit.lat}%2C${selectedCircuit.lng}`}
            className="w-full h-full border-none filter invert-[90%] hue-rotate-180 contrast-[115%] brightness-[90%]"
            loading="lazy"
          />
          {/* Subtle dark vignette overlay */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />
        </div>
      )}

      {/* Hover Tooltip in 3D mode */}
      {hoveredCircuit && tooltipPos && displayMode === 'globe' && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-2xl bg-[#11131C]/95 backdrop-blur-xl border border-white/[0.15] shadow-2xl text-left min-w-[200px]"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#E10600]">
            <CountryFlag iso={hoveredCircuit.country_code} country={hoveredCircuit.country} className="w-5 h-3.5" />
            <span className="font-bold">Round {hoveredCircuit.round_number}</span>
          </div>
          <div className="text-sm font-sans font-bold text-white mt-0.5 leading-snug">
            {hoveredCircuit.name}
          </div>
          <div className="text-xs text-neutral-400 font-sans mt-0.5">
            {hoveredCircuit.city ? `${hoveredCircuit.city}, ` : ''}{hoveredCircuit.country}
          </div>
        </div>
      )}

      {/* Bottom Floating Tactical Circuit Bar */}
      <div className="relative z-30 p-3.5 sm:p-4 bg-[#0B0F1C] backdrop-blur-2xl border-t border-white/[0.12] rounded-b-3xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Track SVG mini preview */}
          <div className="w-14 h-11 bg-white/[0.04] rounded-xl p-1 flex items-center justify-center shrink-0 border border-white/[0.08]">
            <svg viewBox="0 0 200 120" className="w-full h-full max-h-9">
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
            <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
              <span>{selectedCircuit.length_km} km</span>
              <span>·</span>
              <span>{selectedCircuit.corners} Turns</span>
              <span>·</span>
              <span className="text-[#FF2A24] font-semibold">{selectedCircuit.longest_straight_m}m Straight</span>
            </div>
            <div className="text-xs text-neutral-300 font-mono mt-0.5">
              Lap Record: <span className="text-white font-bold">{selectedCircuit.lap_record.time}</span> ({selectedCircuit.lap_record.rider})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedCircuit.pdf_url && (
            <a
              href={selectedCircuit.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#E10600]/25 hover:text-[#FF2A24] text-xs font-sans font-semibold text-neutral-200 transition-colors border border-white/[0.08]"
              title="Official MotoGP Circuit Information Sheet (PDF)"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-cyan-500/25 hover:text-cyan-300 text-xs font-sans font-semibold text-neutral-200 transition-colors border border-white/[0.08]"
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
              className="px-3.5 py-1.5 rounded-full bg-[#E10600] hover:bg-[#FF2A24] text-white text-xs font-sans font-bold transition-all shadow-md"
            >
              Specs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
