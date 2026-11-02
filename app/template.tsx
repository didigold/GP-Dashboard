'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE, pageTransition } from '../lib/motion';

/**
 * Route-level enter transition. `template.tsx` remounts on every navigation,
 * so each page settles in with the same precise, mechanical motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="w-full"
      variants={pageTransition}
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      transition={{ duration: 0.3, ease: EASE.precision }}
    >
      {children}
    </motion.div>
  );
}
