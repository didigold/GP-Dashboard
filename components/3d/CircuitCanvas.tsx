'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Sun, Moon, Sunrise, Eye, Play, Pause } from 'lucide-react';

interface CircuitCanvasProps {
  circuitName?: string;
  selectedRiderNumber?: string;
  onSelectRider?: (num: string) => void;
}

export function CircuitCanvas({
  circuitName = 'Autodromo del Mugello',
  selectedRiderNumber = '1',
  onSelectRider,
}: CircuitCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'top' | 'helicopter' | 'chase'>('orbit');
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // References for Three.js loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bikesRef = useRef<{ mesh: THREE.Mesh; progress: number; speed: number; number: string; color: string }[]>([]);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080a0f);
    scene.fog = new THREE.FogExp2(0x080a0f, 0.002);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 350, 450);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111622, 1.2);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    dirLight.position.set(200, 450, 250);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 5. Track Geometry (Mugello inspired 3D Spline with elevation)
    const trackPoints = [
      new THREE.Vector3(-350, 0, -180),  // Start/Finish straight
      new THREE.Vector3(-150, 0, -200),
      new THREE.Vector3(100, 5, -210),   // Turn 1 San Donato
      new THREE.Vector3(260, 15, -150),
      new THREE.Vector3(320, 25, -60),   // Luco - Poggio Secco
      new THREE.Vector3(260, 30, 40),
      new THREE.Vector3(180, 22, 80),    // Materassi
      new THREE.Vector3(120, 18, 140),   // Borgo San Lorenzo
      new THREE.Vector3(60, 10, 220),    // Casanova - Savelli downhill
      new THREE.Vector3(-40, -5, 260),
      new THREE.Vector3(-160, 5, 230),   // Arrabbiata 1
      new THREE.Vector3(-270, 25, 170),  // Arrabbiata 2 uphill crest
      new THREE.Vector3(-310, 35, 70),   // Scarperia
      new THREE.Vector3(-250, 25, 0),    // Palagio
      new THREE.Vector3(-180, 10, -50),  // Correntaio
      new THREE.Vector3(-240, 5, -100),  // Biondetti chicanes
      new THREE.Vector3(-320, 2, -140),  // Bucine final turn
    ];

    const curve = new THREE.CatmullRomCurve3(trackPoints, true);
    curveRef.current = curve;

    // Asphalt Ribbon
    const tubeGeo = new THREE.TubeGeometry(curve, 250, 7, 12, true);
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.85,
      metalness: 0.1,
    });
    const trackMesh = new THREE.Mesh(tubeGeo, asphaltMat);
    trackMesh.receiveShadow = true;
    scene.add(trackMesh);

    // Glowing Racing Line
    const racingLineGeo = new THREE.TubeGeometry(curve, 350, 0.4, 6, true);
    const racingLineMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: false });
    const racingLineMesh = new THREE.Mesh(racingLineGeo, racingLineMat);
    scene.add(racingLineMesh);

    // Ground Plane with subtle grid
    const groundGeo = new THREE.PlaneGeometry(1200, 1000);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090c12,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    ground.receiveShadow = true;
    scene.add(ground);

    // 6. Bike Markers on Track
    const ridersConfig = [
      { number: '1', color: 0xcc0000, speed: 0.00075, start: 0.08 },   // Bagnaia (Ducati Red)
      { number: '89', color: 0x9333ea, speed: 0.00074, start: 0.07 },  // Martin (Pramac Purple)
      { number: '93', color: 0x38bdf8, speed: 0.000745, start: 0.05 }, // Marquez (Gresini Blue)
      { number: '23', color: 0xcc0000, speed: 0.00073, start: 0.04 },  // Bastianini
      { number: '31', color: 0xef4444, speed: 0.00072, start: 0.02 },  // Acosta (GASGAS Red)
      { number: '12', color: 0x22c55e, speed: 0.00071, start: 0.00 },  // Viñales (Aprilia)
      { number: '33', color: 0xf97316, speed: 0.00070, start: 0.97 },  // Binder (KTM)
      { number: '20', color: 0x2563eb, speed: 0.00069, start: 0.94 },  // Quartararo (Yamaha)
    ];

    const bikes: { mesh: THREE.Mesh; progress: number; speed: number; number: string; color: string }[] = [];

    ridersConfig.forEach((cfg) => {
      // Bike Body geometry
      const bikeGroup = new THREE.Group();

      const bodyGeo = new THREE.ConeGeometry(2.5, 7, 8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.3,
        metalness: 0.6,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      body.castShadow = true;
      bikeGroup.add(body);

      // Light glow
      const glowGeo = new THREE.SphereGeometry(1.2, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(0, 1.5, 0);
      bikeGroup.add(glow);

      scene.add(bikeGroup);

      bikes.push({
        mesh: bikeGroup as any,
        progress: cfg.start,
        speed: cfg.speed,
        number: cfg.number,
        color: `#${cfg.color.toString(16)}`,
      });
    });

    bikesRef.current = bikes;

    // 7. Animation Loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Advance bikes along track curve
      bikes.forEach((bike) => {
        bike.progress = (bike.progress + bike.speed) % 1;
        const pt = curve.getPointAt(bike.progress);
        const tangent = curve.getTangentAt(bike.progress);

        bike.mesh.position.copy(pt);
        bike.mesh.position.y += 2.5;

        // Orient bike along curve tangent
        const lookTarget = pt.clone().add(tangent);
        bike.mesh.lookAt(lookTarget);
      });

      // Camera Position Management based on Mode
      const targetBike = bikes.find((b) => b.number === selectedRiderNumber) || bikes[0];

      if (cameraMode === 'chase' && targetBike) {
        const bikePos = targetBike.mesh.position;
        const tangent = curve.getTangentAt(targetBike.progress);
        const camPos = bikePos.clone().sub(tangent.clone().multiplyScalar(40)).add(new THREE.Vector3(0, 18, 0));
        camera.position.lerp(camPos, 0.08);
        camera.lookAt(bikePos.clone().add(tangent.clone().multiplyScalar(20)));
      } else if (cameraMode === 'top') {
        camera.position.lerp(new THREE.Vector3(0, 520, 0), 0.05);
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === 'helicopter') {
        angle += 0.002;
        const camX = Math.cos(angle) * 380;
        const camZ = Math.sin(angle) * 380;
        camera.position.lerp(new THREE.Vector3(camX, 220, camZ), 0.05);
        camera.lookAt(0, 15, 0);
      } else {
        // Orbit mode default
        angle += 0.001;
        const camX = Math.cos(angle) * 450;
        const camZ = Math.sin(angle) * 450;
        camera.position.set(camX, 280, camZ);
        camera.lookAt(0, 10, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [cameraMode, selectedRiderNumber]);

  // Handle lighting changes dynamically
  useEffect(() => {
    if (!dirLightRef.current || !hemiLightRef.current || !sceneRef.current) return;

    if (lightingMode === 'sunset') {
      dirLightRef.current.color.setHex(0xff7722);
      dirLightRef.current.intensity = 2.8;
      dirLightRef.current.position.set(400, 120, 200);
      hemiLightRef.current.color.setHex(0xffaa66);
      sceneRef.current.background = new THREE.Color(0x1a0d0d);
      sceneRef.current.fog = new THREE.FogExp2(0x1a0d0d, 0.0015);
    } else if (lightingMode === 'night') {
      dirLightRef.current.color.setHex(0x5588ff);
      dirLightRef.current.intensity = 0.8;
      dirLightRef.current.position.set(100, 300, 100);
      hemiLightRef.current.color.setHex(0x112244);
      sceneRef.current.background = new THREE.Color(0x040508);
      sceneRef.current.fog = new THREE.FogExp2(0x040508, 0.002);
    } else {
      // Daylight
      dirLightRef.current.color.setHex(0xfff5e6);
      dirLightRef.current.intensity = 2.5;
      dirLightRef.current.position.set(200, 450, 250);
      hemiLightRef.current.color.setHex(0xffffff);
      sceneRef.current.background = new THREE.Color(0x080a0f);
      sceneRef.current.fog = new THREE.FogExp2(0x080a0f, 0.002);
    }
  }, [lightingMode]);

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden border border-racing-border glass-panel">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Circuit Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-racing-dark/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-racing-border">
        <div className="w-2.5 h-2.5 rounded-full bg-racing-cyan animate-pulse"></div>
        <div>
          <div className="text-xs font-bold text-white tracking-wide">{circuitName}</div>
          <div className="text-[10px] font-mono text-slate-400">3D REAL-TIME SPLINE</div>
        </div>
      </div>

      {/* Floating Camera Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-racing-dark/85 backdrop-blur-md p-1.5 rounded-xl border border-racing-border">
        {(['orbit', 'top', 'helicopter', 'chase'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setCameraMode(mode)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg uppercase transition-all ${
              cameraMode === mode
                ? 'bg-racing-cyan text-black font-extrabold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Floating Lighting Mode Toggle */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-racing-dark/85 backdrop-blur-md p-1.5 rounded-xl border border-racing-border">
        <button
          onClick={() => setLightingMode('day')}
          className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
            lightingMode === 'day' ? 'bg-racing-yellow/20 text-racing-yellow border border-racing-yellow/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Daylight mode"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setLightingMode('sunset')}
          className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
            lightingMode === 'sunset' ? 'bg-racing-orange/20 text-racing-orange border border-racing-orange/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Golden hour sunset mode"
        >
          <Sunrise className="w-4 h-4" />
        </button>
        <button
          onClick={() => setLightingMode('night')}
          className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
            lightingMode === 'night' ? 'bg-racing-purple/20 text-racing-purple border border-racing-purple/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Night / Lusail floodlights mode"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>

      {/* Rider Focus Selector */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-racing-dark/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-racing-border text-xs font-mono text-slate-300">
        <Eye className="w-3.5 h-3.5 text-racing-cyan" />
        <span>FOCUS:</span>
        {['1', '89', '93', '31'].map((num) => (
          <button
            key={num}
            onClick={() => onSelectRider && onSelectRider(num)}
            className={`w-6 h-6 rounded-md font-bold text-center transition-all ${
              selectedRiderNumber === num
                ? 'bg-racing-cyan text-black shadow-glow-cyan'
                : 'bg-racing-card hover:bg-slate-700 text-white'
            }`}
          >
            #{num}
          </button>
        ))}
      </div>
    </div>
  );
}
