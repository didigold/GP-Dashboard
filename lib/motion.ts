import type { Transition, Variants } from 'framer-motion';

/**
 * Motion tokens — calibrated for the GP-Dashboard industrial aesthetic:
 * fast, precise, mechanical. No playful overshoot.
 */
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
} as const;

export const EASE = {
  precision: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  enter: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const SPRING_TAP: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE.precision } as Transition,
  base: { duration: DURATION.base, ease: EASE.precision } as Transition,
  slow: { duration: DURATION.slow, ease: EASE.enter } as Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.precision },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE.smooth } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.precision },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.precision },
  },
};
