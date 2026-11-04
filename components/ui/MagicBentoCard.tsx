'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import './MagicBento.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function parseRgb(value?: string | null): [number, number, number] | null {
  if (!value) return null;
  const text = String(value).trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const raw = hex[1];
    const full =
      raw.length === 3
        ? raw
            .split('')
            .map((c) => c + c)
            .join('')
        : raw;
    const num = Number.parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const match = /^rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i.exec(text);
  if (match) return [Number(match[1]), Number(match[2]), Number(match[3])];
  const list = text.split(',').map((s) => Number(s.trim()));
  if (list.length >= 3 && list.slice(0, 3).every((n) => Number.isFinite(n) && n >= 0 && n <= 255)) {
    return [list[0], list[1], list[2]];
  }
  return null;
}

export interface UseMagicBentoOptions {
  glowColor?: string;
  spotlightRadius?: number;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  tiltStrength?: number;
  clickEffect?: boolean;
  spotAlpha?: number;
  glowAlpha?: number;
  disabled?: boolean;
}

/**
 * Hook to apply the MotoGP Magic Bento interactive spotlight, dynamic border glow,
 * and click shockwave ripple effect to any card element.
 */
export function useMagicBentoEffect<T extends HTMLElement = HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options: UseMagicBentoOptions = {}
) {
  const {
    glowColor = '225, 6, 0',
    spotlightRadius = 340,
    enableSpotlight = true,
    enableBorderGlow = true,
    enableTilt = false,
    tiltStrength = 2,
    clickEffect = true,
    spotAlpha = 0.08,
    glowAlpha = 0.85,
    disabled = false,
  } = options;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useIsomorphicLayoutEffect(() => {
    const el = targetRef.current;
    if (!el || disabled) return;

    const rgb = parseRgb(glowColor) ?? [225, 6, 0];
    const borderSize = Math.round(spotlightRadius * 0.75);

    el.style.setProperty('--mb-glow-rgb', rgb.join(', '));
    el.style.setProperty('--mb-spot-size', `${spotlightRadius}px`);
    el.style.setProperty('--mb-border-size', `${borderSize}px`);
    el.style.setProperty('--mb-spot-alpha', String(spotAlpha));
    el.style.setProperty('--mb-glow-alpha', String(glowAlpha));
    el.style.setProperty('--mb-edge', 'rgba(255, 255, 255, 0.08)');
    el.style.setProperty('--mb-highlight', 'rgba(255, 255, 255, 0.08)');

    const pointer = { x: -1e5, y: -1e5, inside: false, down: false };
    const light = { x: -1e5, y: -1e5, ready: false };
    const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
    let hot = 0;
    let near = 0;
    let press = 1;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let last = 0;

    const startWave = (cx: number, cy: number) => {
      const rect = el.getBoundingClientRect();
      wave.x = cx;
      wave.y = cy;
      wave.t = 0;
      wave.duration = 1.1;
      wave.reach =
        Math.max(
          Math.hypot(cx - rect.left, cy - rect.top),
          Math.hypot(cx - rect.right, cy - rect.top),
          Math.hypot(cx - rect.left, cy - rect.bottom),
          Math.hypot(cx - rect.right, cy - rect.bottom)
        ) + 140;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      const opts = optionsRef.current;
      const currentEnableSpotlight = opts.enableSpotlight ?? true;
      const currentEnableBorderGlow = opts.enableBorderGlow ?? true;
      const currentEnableTilt = opts.enableTilt ?? false;
      const currentTiltStrength = opts.tiltStrength ?? 2;
      const currentClickEffect = opts.clickEffect ?? true;

      const rect = el.getBoundingClientRect();
      const follow = 1 - Math.exp(-dt / 0.05);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;

      const lx = light.x - rect.left;
      const ly = light.y - rect.top;
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const isInside =
        pointer.inside && px >= -40 && py >= -40 && px <= rect.width + 40 && py <= rect.height + 40;

      const hotTarget = isInside && currentEnableSpotlight ? 1 : 0;
      hot += (hotTarget - hot) * (1 - Math.exp(-dt / (hotTarget > hot ? 0.14 : 0.32)));
      if (Math.abs(hotTarget - hot) < 0.002) hot = hotTarget;

      const nearTarget = isInside && currentEnableBorderGlow ? 1 : 0;
      near += (nearTarget - near) * (1 - Math.exp(-dt / (nearTarget > near ? 0.12 : 0.35)));
      if (Math.abs(nearTarget - near) < 0.002) near = nearTarget;

      let waveRadius = 0;
      let waveAlpha = 0;
      if (wave.t >= 0) {
        wave.t += dt;
        const progress = Math.min(1, wave.t / wave.duration);
        waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
        waveAlpha = Math.pow(1 - progress, 1.3);
        if (progress >= 1) {
          wave.t = -1;
          waveAlpha = 0;
        }
      }

      const pressTarget = pointer.down && currentClickEffect ? 0.985 : 1;
      press += (pressTarget - press) * (1 - Math.exp(-dt / 0.06));
      if (Math.abs(pressTarget - press) < 0.0005) press = pressTarget;

      let rxTarget = 0;
      let ryTarget = 0;
      if (isInside && currentEnableTilt) {
        const u = Math.min(1, Math.max(0, px / Math.max(1, rect.width))) - 0.5;
        const v = Math.min(1, Math.max(0, py / Math.max(1, rect.height))) - 0.5;
        rxTarget = -v * 2 * currentTiltStrength;
        ryTarget = u * 2 * currentTiltStrength;
      }
      rx += (rxTarget - rx) * (1 - Math.exp(-dt / 0.08));
      ry += (ryTarget - ry) * (1 - Math.exp(-dt / 0.08));
      if (Math.abs(rxTarget - rx) < 0.002) rx = rxTarget;
      if (Math.abs(ryTarget - ry) < 0.002) ry = ryTarget;

      el.style.setProperty('--mb-x', `${lx.toFixed(1)}px`);
      el.style.setProperty('--mb-y', `${ly.toFixed(1)}px`);
      el.style.setProperty('--mb-hot', hot.toFixed(3));
      el.style.setProperty('--mb-near', near.toFixed(3));
      el.style.setProperty('--mb-press', press.toFixed(4));
      el.style.setProperty('--mb-rx', `${rx.toFixed(3)}deg`);
      el.style.setProperty('--mb-ry', `${ry.toFixed(3)}deg`);
      el.style.setProperty('--mb-wx', `${(wave.x - rect.left).toFixed(1)}px`);
      el.style.setProperty('--mb-wy', `${(wave.y - rect.top).toFixed(1)}px`);
      el.style.setProperty('--mb-wr', `${waveRadius.toFixed(1)}px`);
      el.style.setProperty('--mb-wa', waveAlpha.toFixed(3));

      const busy =
        isInside ||
        hot > 0.002 ||
        near > 0.002 ||
        wave.t >= 0 ||
        Math.abs(press - 1) > 0.001 ||
        Math.abs(rx) > 0.01 ||
        Math.abs(ry) > 0.01 ||
        Math.abs(pointer.x - light.x) > 0.4 ||
        Math.abs(pointer.y - light.y) > 0.4;

      if (busy) {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onPointerEnter = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      if (!light.ready) {
        light.x = e.clientX;
        light.y = e.clientY;
        light.ready = true;
      }
      wake();
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      wake();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      pointer.down = false;
      wake();
    };

    const onPointerDown = () => {
      pointer.down = true;
      wake();
    };

    const onPointerUp = () => {
      pointer.down = false;
      wake();
    };

    const onClick = (e: MouseEvent) => {
      if (optionsRef.current.clickEffect ?? true) {
        startWave(e.clientX, e.clientY);
        wake();
      }
    };

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('click', onClick);
    };
  }, [glowColor, spotlightRadius, spotAlpha, glowAlpha, disabled]);
}

/**
 * Standard Magic Bento DOM overlay layers: spotlight radial illumination,
 * crisp 1px inset rim, and the reactive masked glowing border.
 */
export function MagicBentoGlow({
  enableSpotlight = true,
  enableBorderGlow = true,
  className = '',
  style,
}: {
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {enableSpotlight && (
        <span
          className={`magic-bento__light ${className}`.trim()}
          style={style}
          aria-hidden="true"
        />
      )}
      <span
        className={`magic-bento__rim ${className}`.trim()}
        style={style}
        aria-hidden="true"
      />
      {enableBorderGlow && (
        <span
          className={`magic-bento__border ${className}`.trim()}
          style={style}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default MagicBentoGlow;
