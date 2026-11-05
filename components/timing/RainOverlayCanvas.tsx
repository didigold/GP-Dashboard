'use client';

import React, { useEffect, useRef } from 'react';

interface RainOverlayCanvasProps {
  intensity: 'none' | 'light' | 'heavy';
  windSpeedMs?: number;
  className?: string;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

interface SplashRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function RainOverlayCanvas({
  intensity,
  windSpeedMs = 2.5,
  className = '',
}: RainOverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (intensity === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const dropCount = intensity === 'heavy' ? 140 : 65;
    const maxRipples = intensity === 'heavy' ? 28 : 12;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();

    const drops: RainDrop[] = Array.from({ length: dropCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: intensity === 'heavy' ? 16 + Math.random() * 14 : 11 + Math.random() * 9,
      speed: intensity === 'heavy' ? 13 + Math.random() * 7 : 9 + Math.random() * 5,
      alpha: intensity === 'heavy' ? 0.28 + Math.random() * 0.32 : 0.16 + Math.random() * 0.2,
    }));

    const ripples: SplashRipple[] = Array.from({ length: maxRipples }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 8,
      maxRadius: intensity === 'heavy' ? 12 + Math.random() * 10 : 8 + Math.random() * 6,
      alpha: 0.35,
    }));

    const windDriftX = Math.min(4.5, Math.max(0.8, windSpeedMs * 0.75));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Subtle wet mist atmospheric tint
      ctx.fillStyle =
        intensity === 'heavy'
          ? 'rgba(14, 28, 54, 0.16)'
          : 'rgba(14, 28, 54, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw angled rain streaks
      ctx.lineCap = 'round';
      ctx.lineWidth = intensity === 'heavy' ? 1.35 : 1.0;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(186, 230, 253, ${d.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + windDriftX * (d.length / 10), d.y + d.length);
        ctx.stroke();

        d.x += windDriftX;
        d.y += d.speed;

        if (d.y > canvas.height) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
        if (d.x > canvas.width) {
          d.x = 0;
        }
      }

      // 3. Draw surface puddle splash ripples
      ctx.lineWidth = 1;
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const progress = r.radius / r.maxRadius;
        const currentAlpha = Math.max(0, r.alpha * (1 - progress));

        ctx.strokeStyle = `rgba(125, 211, 252, ${currentAlpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        r.radius += intensity === 'heavy' ? 0.35 : 0.22;
        if (r.radius >= r.maxRadius) {
          r.x = Math.random() * canvas.width;
          r.y = Math.random() * canvas.height;
          r.radius = 0.5;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, windSpeedMs]);

  if (intensity === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-[5] w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
