'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CircuitInfo, CHAMPIONSHIP_ROUNDS_2026 } from '@/lib/data/circuits-data';
import { Crosshair } from 'lucide-react';

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
        className={`${className} object-cover rounded-[2px] ring-1 ring-inset ring-black/30 shrink-0`}
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

// Simplified but recognizable continent outlines (equirectangular, lng/lat)
const CONTINENTS: [number, number][][] = [
  // North America
  [
    [-168, 65], [-160, 71], [-140, 70], [-125, 70], [-110, 68], [-95, 70], [-85, 73],
    [-80, 70], [-75, 62], [-65, 60], [-55, 52], [-60, 45], [-70, 42], [-75, 35],
    [-81, 25], [-90, 29], [-97, 26], [-105, 22], [-115, 30], [-125, 40], [-130, 48],
    [-140, 58], [-150, 60], [-165, 62],
  ],
  // Central America
  [
    [-92, 17], [-85, 16], [-80, 9], [-77, 8], [-82, 12], [-88, 18],
  ],
  // South America
  [
    [-81, 10], [-75, 11], [-70, 12], [-60, 10], [-52, 5], [-45, -2], [-38, -6],
    [-35, -10], [-40, -20], [-45, -24], [-50, -30], [-55, -38], [-60, -42],
    [-65, -48], [-68, -55], [-72, -52], [-73, -45], [-75, -38], [-71, -30],
    [-70, -20], [-75, -15], [-78, -5], [-80, 2],
  ],
  // Africa
  [
    [-17, 15], [-10, 20], [0, 24], [10, 32], [20, 33], [30, 32], [35, 25], [40, 15],
    [43, 10], [51, 12], [48, 2], [42, -5], [40, -15], [35, -22], [32, -28],
    [25, -34], [18, -34], [13, -25], [10, -15], [9, -5], [0, 5], [-8, 5], [-15, 10],
  ],
  // Eurasia (Europe + Asia)
  [
    [-10, 36], [-9, 44], [-2, 49], [3, 52], [6, 58], [12, 60], [18, 60], [22, 65],
    [28, 70], [35, 72], [45, 70], [60, 70], [75, 72], [90, 75], [105, 76], [120, 73],
    [135, 72], [150, 72], [165, 68], [170, 62], [160, 58], [150, 55], [143, 48],
    [138, 42], [130, 35], [122, 32], [120, 25], [112, 22], [105, 10], [100, 8],
    [98, 15], [92, 20], [88, 22], [80, 15], [76, 8], [72, 20], [66, 25], [58, 25],
    [50, 28], [44, 38], [38, 42], [34, 36], [28, 38], [22, 38], [16, 42], [12, 45],
    [8, 44], [3, 43], [-2, 37], [-6, 36],
  ],
  // Australia
  [
    [113, -22], [115, -33], [120, -34], [129, -32], [137, -35], [145, -38], [150, -37],
    [153, -28], [153, -25], [146, -19], [142, -11], [136, -12], [130, -11], [125, -14],
    [117, -20],
  ],
  // Greenland
  [
    [-45, 60], [-30, 68], [-22, 70], [-20, 76], [-30, 82], [-45, 83], [-58, 82],
    [-68, 77], [-55, 70], [-50, 65],
  ],
  // Japan
  [
    [130, 32], [136, 35], [140, 36], [142, 40], [145, 44], [142, 45], [140, 42],
    [136, 37], [132, 34],
  ],
  // United Kingdom / Ireland
  [
    [-8, 50], [-2, 50], [1, 51], [2, 53], [-1, 56], [-3, 58], [-6, 58], [-5, 55],
    [-6, 53], [-5, 52],
  ],
  // Madagascar
  [
    [44, -12], [50, -15], [50, -22], [46, -26], [43, -22], [43, -16],
  ],
  // Indonesia / Malaysia archipelago
  [
    [95, 5], [105, 2], [115, -1], [125, 1], [135, -2], [140, -5], [130, -8],
    [120, -9], [110, -8], [100, -5], [95, 0],
  ],
  // New Zealand
  [
    [172, -34], [176, -38], [178, -40], [174, -45], [168, -47], [166, -44], [170, -40],
  ],
];

// Procedural Earth texture: deep ocean gradient, recognizable continents, soft coastal glow
function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const project = (lng: number, lat: number): [number, number] => [
    ((lng + 180) / 360) * canvas.width,
    ((90 - lat) / 180) * canvas.height,
  ];

  if (ctx) {
    // Ocean depth gradient (lighter equator, darker poles)
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#060d1a');
    oceanGradient.addColorStop(0.5, '#0d2145');
    oceanGradient.addColorStop(1, '#060d1a');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Soft radial ocean light around the equator
    const oceanGlow = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.5,
      40,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.55
    );
    oceanGlow.addColorStop(0, 'rgba(40, 110, 200, 0.22)');
    oceanGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = oceanGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Graticule
    ctx.strokeStyle = 'rgba(90, 140, 210, 0.12)';
    ctx.lineWidth = 1;
    for (let lat = -75; lat <= 75; lat += 15) {
      const [, y] = project(0, lat);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 15) {
      const [x] = project(lng, 0);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Equator
    ctx.strokeStyle = 'rgba(225, 6, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Build combined land path
    const landPath = new Path2D();
    CONTINENTS.forEach((poly) => {
      poly.forEach(([lng, lat], i) => {
        const [x, y] = project(lng, lat);
        if (i === 0) landPath.moveTo(x, y);
        else landPath.lineTo(x, y);
      });
      landPath.closePath();
    });

    // Land base fill
    const landGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    landGradient.addColorStop(0, '#1d3a2f');
    landGradient.addColorStop(0.5, '#274b38');
    landGradient.addColorStop(1, '#1d3a2f');
    ctx.fillStyle = landGradient;
    ctx.fill(landPath);

    // Subtle terrain patches clipped to land
    ctx.save();
    ctx.clip(landPath);
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = 6 + Math.random() * 26;
      const shade = Math.random() > 0.5 ? 'rgba(70, 110, 70, 0.18)' : 'rgba(30, 55, 40, 0.20)';
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Coastal glow
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke(landPath);

    // Coastline highlight
    ctx.strokeStyle = 'rgba(180, 255, 240, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke(landPath);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function GlobeCalendarView({
  selectedCircuit,
  onSelectCircuit,
}: GlobeCalendarViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCircuit, setHoveredCircuit] = useState<CircuitInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const isAutoRotatingRef = useRef(true);
  const selectedCircuitRef = useRef(selectedCircuit);
  selectedCircuitRef.current = selectedCircuit;

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
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Starfield
    const starCount = 1400;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1600;
      starPositions[i + 1] = (Math.random() - 0.5) * 1600;
      starPositions[i + 2] = (Math.random() - 0.5) * 1600;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x9fc4ff,
      size: 1.1,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2500);
    camera.position.set(0, 0, 310);
    cameraRef.current = camera;

    // Renderer
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

    // Globe root group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 100;

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const earthTexture = createEarthTexture();
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: 0xffffff,
      emissive: 0x020a14,
      specular: 0x2a4a78,
      shininess: 18,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Atmosphere rim glow
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.02, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x2f6fcc,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.8);
    frontLight.position.set(0, 50, 320);
    scene.add(frontLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(300, 200, 250);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x2266cc, 1.2);
    rimLight.position.set(-300, -100, -150);
    scene.add(rimLight);

    // GP markers
    const markerHitMeshes: THREE.Mesh[] = [];

    CHAMPIONSHIP_ROUNDS_2026.forEach((circuit) => {
      const position = latLngToVector3(circuit.lat, circuit.lng, GLOBE_RADIUS);
      const isSelected = selectedCircuit?.id === circuit.id;
      const isCurrent = circuit.status === 'CURRENT';
      const markerColor = isSelected || isCurrent ? 0xe10600 : 0x00f5d4;

      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize());

      const pinHeight = isSelected || isCurrent ? 12 : 8;
      const pinGeom = new THREE.CylinderGeometry(0.6, 0.6, pinHeight, 8);
      pinGeom.translate(0, pinHeight / 2, 0);
      const pinMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: isSelected || isCurrent ? 0.95 : 0.75,
      });
      markerGroup.add(new THREE.Mesh(pinGeom, pinMat));

      const headGeom = new THREE.SphereGeometry(isSelected ? 3.2 : 2.2, 16, 16);
      headGeom.translate(0, pinHeight, 0);
      markerGroup.add(new THREE.Mesh(headGeom, new THREE.MeshBasicMaterial({ color: markerColor })));

      if (isSelected) {
        const ringBorderGeom = new THREE.RingGeometry(3.2, 4.0, 32);
        ringBorderGeom.translate(0, pinHeight, 0);
        markerGroup.add(
          new THREE.Mesh(
            ringBorderGeom,
            new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
          )
        );
      }

      if (isSelected || isCurrent) {
        const ringGeom = new THREE.RingGeometry(2, 6, 32);
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

      const hitGeom = new THREE.SphereGeometry(6, 12, 12);
      hitGeom.translate(0, pinHeight, 0);
      const hitMesh = new THREE.Mesh(hitGeom, new THREE.MeshBasicMaterial({ visible: false }));
      hitMesh.userData = { circuit };
      markerGroup.add(hitMesh);
      markerHitMeshes.push(hitMesh);

      globeGroup.add(markerGroup);
    });

    if (selectedCircuit) {
      focusOnCircuit(selectedCircuit);
    }

    // Pointer events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      targetRotationRef.current = null;
      isAutoRotatingRef.current = false;
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

      if ('clientX' in e && containerRef.current && cameraRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(markerHitMeshes);

        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData.circuit as CircuitInfo;
          setHoveredCircuit(hovered);
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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
        if (cardElem) cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      const radar = globeGroup.getObjectByName('radarRing') as THREE.Mesh | undefined;
      if (radar) {
        const scale = 1 + ((time * 1.5) % 2.5);
        radar.scale.set(scale, scale, scale);
        const mat = radar.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.8 - (scale - 1) * 0.35);
      }

      if (targetRotationRef.current && globeGroupRef.current) {
        const target = targetRotationRef.current;
        globeGroupRef.current.rotation.x += (target.x - globeGroupRef.current.rotation.x) * 0.08;

        let diffY = target.y - globeGroupRef.current.rotation.y;
        while (diffY > Math.PI) diffY -= Math.PI * 2;
        while (diffY < -Math.PI) diffY += Math.PI * 2;
        globeGroupRef.current.rotation.y += diffY * 0.08;

        if (Math.abs(diffY) < 0.005 && Math.abs(target.x - globeGroupRef.current.rotation.x) < 0.005) {
          targetRotationRef.current = null;
        }
      } else if (isAutoRotatingRef.current && !isDraggingRef.current && globeGroupRef.current) {
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
      earthTexture.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [focusOnCircuit, onSelectCircuit, selectedCircuit]);

  const handleRecenter = () => {
    isAutoRotatingRef.current = true;
    focusOnCircuit(selectedCircuitRef.current);
  };

  return (
    <div className="relative w-full h-full bg-[#05070E] overflow-hidden select-none">
      {/* Top-left circuit identity */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 pointer-events-none">
        <CountryFlag iso={selectedCircuit.country_code} country={selectedCircuit.country} className="w-7 h-5" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#E10600]">
              Round {selectedCircuit.round_number}
            </span>
            <span className="text-[11px] text-neutral-400 font-sans">· {selectedCircuit.country}</span>
          </div>
          <div className="text-sm font-sans font-bold text-white leading-tight">
            {selectedCircuit.name}
          </div>
        </div>
      </div>

      {/* Globe canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing" />

      {/* Recenter / auto-locate icon */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-5 right-5 z-30 p-2.5 rounded-full bg-black/70 backdrop-blur-xl hover:bg-[#E10600]/25 text-neutral-300 hover:text-[#FF2A24] border border-white/15 transition-colors shadow-xl"
        title="Recenter on selected circuit"
      >
        <Crosshair className="w-4 h-4" />
      </button>

      {/* Hover tooltip */}
      {hoveredCircuit && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-xl bg-[#11131C]/95 backdrop-blur-xl border border-white/[0.15] shadow-2xl text-left min-w-[200px]"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between gap-2 text-xs font-sans text-[#E10600]">
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
    </div>
  );
}
