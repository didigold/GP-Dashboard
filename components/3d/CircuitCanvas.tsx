'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Sun, Moon, Sunrise, Eye, Play, Pause, Layers, Zap } from 'lucide-react';
import { usePersistentState } from '@/lib/hooks/usePersistentState';
import { MOTOGP_RIDERS } from '@/lib/data/motogp-grid';

interface CircuitCanvasProps {
  circuitName?: string;
  selectedRiderNumber?: string;
  onSelectRider?: (num: string) => void;
}

export function CircuitCanvas({
  circuitName = 'Petronas Sepang International Circuit',
  selectedRiderNumber = '93',
  onSelectRider,
}: CircuitCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraMode, setCameraMode] = usePersistentState<'orbit' | 'top' | 'helicopter' | 'chase'>(
    'gp.cameraMode',
    'orbit'
  );
  const [lightingMode, setLightingMode] = usePersistentState<'day' | 'sunset' | 'night'>(
    'gp.lightingMode',
    'day'
  );
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeSector, setActiveSector] = useState<number | null>(null);

  // References for Three.js loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bikesRef = useRef<{ mesh: THREE.Group; progress: number; speed: number; number: string; color: number }[]>([]);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  useEffect(() => {
    if (viewMode !== '3d' || !containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene with subtle deep motorsport background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06080c);
    scene.fog = new THREE.FogExp2(0x06080c, 0.0015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 360, 480);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting: Bright, high-contrast motorsport lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a2233, 1.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    dirLight.position.set(220, 500, 280);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Secondary rim light for sharp silhouette edges
    const rimLight = new THREE.DirectionalLight(0x00c7ff, 1.2);
    rimLight.position.set(-300, 200, -300);
    scene.add(rimLight);

    // 5. Authentic Sepang 3D Geometry with dual high-speed straights & elevation
    const trackPoints = [
      new THREE.Vector3(-360, 0, -160),  // Main Pit Straight
      new THREE.Vector3(-180, 2, -180),
      new THREE.Vector3(80, 5, -200),    // Speed Trap
      new THREE.Vector3(240, 10, -180),  // T1 Heavy Braking Entry
      new THREE.Vector3(300, 15, -120),  // T1 Apex
      new THREE.Vector3(320, 20, -40),   // T2 Left Transition
      new THREE.Vector3(260, 25, 40),    // T3 Fast Right
      new THREE.Vector3(180, 18, 100),   // T4 Left
      new THREE.Vector3(110, 12, 160),   // T5-T6 High Speed Sweepers
      new THREE.Vector3(30, 8, 220),     // T7-T8 Double Apex
      new THREE.Vector3(-70, 4, 250),    // T9 Slow Left Uphill
      new THREE.Vector3(-180, 12, 210),  // T10 Fast Right
      new THREE.Vector3(-280, 20, 150),  // T11-T12 High G Crest
      new THREE.Vector3(-320, 15, 60),   // T13 Complex
      new THREE.Vector3(-270, 8, -20),   // T14 Back Straight Entry
      new THREE.Vector3(-200, 4, -80),   // 920m Back Straight
      new THREE.Vector3(-280, 2, -130),  // T15 Hairpin
      new THREE.Vector3(-340, 0, -150),  // Final corner onto Main Straight
    ];

    const curve = new THREE.CatmullRomCurve3(trackPoints, true);
    curveRef.current = curve;

    // A. Main Asphalt Ribbon (Wide, bold, high-contrast)
    const trackGeo = new THREE.TubeGeometry(curve, 300, 12, 16, true);
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x1f2633,
      roughness: 0.75,
      metalness: 0.2,
    });
    const trackMesh = new THREE.Mesh(trackGeo, asphaltMat);
    trackMesh.receiveShadow = true;
    scene.add(trackMesh);

    // B. Sector Color Markings (S1 Red, S2 Yellow, S3 Cyan, S4 Green)
    const sectors = [
      { start: 0.0, end: 0.25, color: 0xe10600 }, // S1 Red
      { start: 0.25, end: 0.5, color: 0xf59e0b },  // S2 Gold
      { start: 0.5, end: 0.75, color: 0x06b6d4 },  // S3 Cyan
      { start: 0.75, end: 1.0, color: 0x10b981 },  // S4 Green
    ];

    // C. Glowing High-Visibility Racing Line
    const racingLineGeo = new THREE.TubeGeometry(curve, 400, 1.2, 8, true);
    const racingLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const racingLineMesh = new THREE.Mesh(racingLineGeo, racingLineMat);
    scene.add(racingLineMesh);

    // D. Outer Glowing Neon Edge Guide
    const edgeGeo = new THREE.TubeGeometry(curve, 350, 0.4, 6, true);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xe10600 });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    edgeMesh.position.y += 1.5;
    scene.add(edgeMesh);

    // E. Ground Paddock Plane with Subtle Tactical Grid
    const groundGeo = new THREE.PlaneGeometry(1400, 1200);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x080b11,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -12;
    ground.receiveShadow = true;
    scene.add(ground);

    // F. Start/Finish Gantry & Speed Trap Radar Gate
    const gantryGeo = new THREE.BoxGeometry(4, 28, 30);
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0xe10600, metalness: 0.8, roughness: 0.2 });
    const gantry = new THREE.Mesh(gantryGeo, gantryMat);
    gantry.position.set(-360, 14, -160);
    scene.add(gantry);

    // 6. Bike Markers (2026 Official Lineup with real Dorna team colors)
    const ridersConfig = [
      { number: '37', color: 0xff6600, speed: 0.00082, start: 0.12 }, // Acosta (KTM Orange)
      { number: '93', color: 0xcc0000, speed: 0.00081, start: 0.10 }, // Marc Marquez (Ducati Red)
      { number: '72', color: 0x800020, speed: 0.00080, start: 0.08 }, // Bezzecchi (Aprilia)
      { number: '89', color: 0x800020, speed: 0.00079, start: 0.06 }, // Martin (Aprilia)
      { number: '79', color: 0x003399, speed: 0.00078, start: 0.04 }, // Ogura (Trackhouse)
      { number: '63', color: 0xcc0000, speed: 0.00077, start: 0.02 }, // Bagnaia (Ducati)
      { number: '49', color: 0xefff00, speed: 0.00076, start: 0.98 }, // Di Giannantonio (VR46)
      { number: '33', color: 0xff6600, speed: 0.00075, start: 0.95 }, // Binder (KTM)
    ];

    const bikes: { mesh: THREE.Group; progress: number; speed: number; number: string; color: number }[] = [];

    ridersConfig.forEach((cfg) => {
      const bikeGroup = new THREE.Group();

      // Bike Body: High-mass aerodynamic prototype
      const bodyGeo = new THREE.ConeGeometry(3.5, 9, 8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.2,
        metalness: 0.8,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      body.castShadow = true;
      bikeGroup.add(body);

      // Bright halo beacon
      const glowGeo = new THREE.SphereGeometry(2.0, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(0, 3, 0);
      bikeGroup.add(glow);

      scene.add(bikeGroup);
      bikes.push({
        mesh: bikeGroup,
        progress: cfg.start,
        speed: cfg.speed,
        number: cfg.number,
        color: cfg.color,
      });
    });

    bikesRef.current = bikes;

    // 7. Interactive Orbit Controls with mouse drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 520, theta: Math.PI / 4, phi: Math.PI / 3 };

    function updateCameraFromSpherical() {
      if (cameraMode !== 'orbit') return;
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = Math.max(80, spherical.radius * Math.cos(spherical.phi));
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    }

    updateCameraFromSpherical();

    const onMouseDown = (e: MouseEvent) => {
      if (cameraMode !== 'orbit') return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || cameraMode !== 'orbit') return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      spherical.theta -= deltaX * 0.006;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.006));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      updateCameraFromSpherical();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (cameraMode !== 'orbit') return;
      spherical.radius = Math.max(200, Math.min(900, spherical.radius + e.deltaY * 0.5));
      updateCameraFromSpherical();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isPlaying && curveRef.current) {
        bikes.forEach((bike) => {
          bike.progress = (bike.progress + bike.speed) % 1;
          const pos = curveRef.current!.getPointAt(bike.progress);
          const tangent = curveRef.current!.getTangentAt(bike.progress);

          bike.mesh.position.copy(pos);
          bike.mesh.position.y += 4;

          const lookTarget = pos.clone().add(tangent);
          bike.mesh.lookAt(lookTarget);
        });

        // Top, Helicopter, or Chase Camera Modes
        if (cameraMode === 'chase' && bikes[0]) {
          const leadPos = bikes[0].mesh.position;
          camera.position.set(leadPos.x - 40, leadPos.y + 25, leadPos.z - 40);
          camera.lookAt(leadPos);
        } else if (cameraMode === 'top') {
          camera.position.set(0, 680, 0);
          camera.lookAt(0, 0, 0);
        } else if (cameraMode === 'helicopter') {
          const t = Date.now() * 0.0003;
          camera.position.set(Math.sin(t) * 450, 320, Math.cos(t) * 450);
          camera.lookAt(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [viewMode, cameraMode, isPlaying]);

  return (
    <div className="relative w-full h-[620px] min-h-[500px] bg-[#06080C] overflow-hidden select-none font-mono">
      {/* Top Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-black/90 border border-neutral-800 px-3.5 py-2 pointer-events-auto flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-pulse" />
          <div>
            <div className="text-white font-bold text-xs">{circuitName}</div>
            <div className="text-[11px] text-neutral-400">15 Turns · 5,543m · High-Speed Telemetry Mesh</div>
          </div>
        </div>

        {/* Mode Switcher: 3D vs 2D Vector */}
        <div className="bg-black/90 border border-neutral-800 p-1 pointer-events-auto flex items-center gap-1 text-xs">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 font-semibold transition-colors ${
              viewMode === '3d' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            3D WebGL Paddock
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1 font-semibold transition-colors ${
              viewMode === '2d' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            2D Tactical Vector
          </button>
        </div>
      </div>

      {/* 3D WebGL Viewport */}
      {viewMode === '3d' ? (
        <div ref={containerRef} className="w-full h-[620px] min-h-[500px] cursor-grab active:cursor-grabbing" />
      ) : (
        /* 2D Crisp Vector HUD (Matching User's Reference Image) */
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#07090E] relative">
          <div className="w-full max-w-3xl h-[420px] relative flex items-center justify-center">
            {/* SVG Crisp Vector Layout */}
            <svg
              viewBox="0 0 400 240"
              className="w-full h-full filter drop-shadow-[0_0_15px_rgba(225,6,0,0.3)]"
            >
              <defs>
                <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E10600" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Main Glowing Track Path */}
              <path
                d="M 40,80 L 340,70 C 370,70 376,100 350,120 L 230,150 C 200,160 180,190 210,210 C 240,230 300,220 330,190 L 350,160 C 370,190 340,230 290,230 L 90,230 C 50,230 40,190 70,170 L 170,110 C 190,90 160,84 140,84 L 50,84 C 30,84 24,80 40,80 Z"
                fill="none"
                stroke="url(#trackGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Inner White Apex Line */}
              <path
                d="M 40,80 L 340,70 C 370,70 376,100 350,120 L 230,150 C 200,160 180,190 210,210 C 240,230 300,220 330,190 L 350,160 C 370,190 340,230 290,230 L 90,230 C 50,230 40,190 70,170 L 170,110 C 190,90 160,84 140,84 L 50,84 C 30,84 24,80 40,80 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Corner Badges */}
              <g className="text-[9px] font-mono font-bold fill-white">
                <circle cx="350" cy="95" r="8" fill="#E10600" />
                <text x="350" y="98" textAnchor="middle">T1</text>

                <circle cx="210" cy="180" r="8" fill="#F59E0B" />
                <text x="210" y="183" textAnchor="middle">T4</text>

                <circle cx="70" cy="200" r="8" fill="#06B6D4" />
                <text x="70" y="203" textAnchor="middle">T9</text>

                <circle cx="50" cy="84" r="8" fill="#10B981" />
                <text x="50" y="87" textAnchor="middle">T15</text>
              </g>

              {/* Speed Trap Radar Marker */}
              <circle cx="190" cy="74" r="5" fill="#E10600" className="animate-ping" />
              <circle cx="190" cy="74" r="4" fill="#E10600" />
              <text x="190" y="60" textAnchor="middle" fill="#E10600" className="text-[10px] font-bold">
                SPEED TRAP: 362.8 km/h
              </text>
            </svg>
          </div>

          {/* Sector Breakdown Strip */}
          <div className="grid grid-cols-4 gap-3 w-full max-w-2xl mt-4 font-mono text-xs">
            <div className="p-2.5 bg-[#10141D] border-l-2 border-[#E10600] flex items-center justify-between">
              <span className="text-neutral-400">Sector 1</span>
              <span className="text-white font-bold">28.320s</span>
            </div>
            <div className="p-2.5 bg-[#10141D] border-l-2 border-[#F59E0B] flex items-center justify-between">
              <span className="text-neutral-400">Sector 2</span>
              <span className="text-white font-bold">29.110s</span>
            </div>
            <div className="p-2.5 bg-[#10141D] border-l-2 border-[#06B6D4] flex items-center justify-between">
              <span className="text-neutral-400">Sector 3</span>
              <span className="text-white font-bold">23.850s</span>
            </div>
            <div className="p-2.5 bg-[#10141D] border-l-2 border-[#10B981] flex items-center justify-between">
              <span className="text-neutral-400">Sector 4</span>
              <span className="text-white font-bold">23.320s</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Camera Views for 3D */}
        {viewMode === '3d' && (
          <div className="bg-black/90 border border-neutral-800 p-1 pointer-events-auto flex items-center gap-1 text-xs">
            {(['orbit', 'top', 'helicopter', 'chase'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCameraMode(mode)}
                className={`px-3 py-1 font-semibold uppercase transition-colors ${
                  cameraMode === mode ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}

        {/* Quick Rider Telemetry Focus */}
        <div className="bg-black/90 border border-neutral-800 px-3 py-1.5 pointer-events-auto flex items-center gap-2 text-xs">
          <Eye className="w-3.5 h-3.5 text-[#E10600]" />
          <span className="text-neutral-400">Telemetry Dots:</span>
          {['#37 Acosta', '#93 Marquez', '#72 Bezzecchi', '#89 Martin'].map((rider, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-[#141414] border border-neutral-800 text-neutral-200 text-xs font-bold"
            >
              {rider}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
