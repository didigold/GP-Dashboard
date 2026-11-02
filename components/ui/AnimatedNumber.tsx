'use client';

import { useEffect, useRef } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Animates a telemetry value between updates with a precise ease-out.
 * The initial render is static so there is no count-from-zero flash;
 * subsequent value changes glide to the new reading.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  duration = 0.45,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const initialText = useRef(`${prefix}${value.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduceMotion) {
      node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: EASE.precision,
      onUpdate: (latest) => {
        node.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, decimals, prefix, suffix, duration, reduceMotion, motionValue]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {initialText.current}
    </span>
  );
}
