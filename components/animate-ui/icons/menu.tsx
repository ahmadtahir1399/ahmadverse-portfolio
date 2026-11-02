'use client';

import * as React from 'react';
import { motion, useAnimation, type Variants } from 'framer-motion';

interface MenuIconProps {
  size?: number;
  isOpen?: boolean;
  className?: string;
  color?: string;
  immediate?: boolean;
}

const SPRING = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
} as const;

// Two tight lines like an "=" - top line thinner and dimmer, bottom line
// bolder. On open they equalize and cross into an X.
const animations = {
  lineTop: {
    closed: {
      rotate: 0,
      y: 0,
      opacity: 0.75,
      strokeWidth: 1,
    },
    open: {
      rotate: 45,
      y: 2.5,
      opacity: 1,
      strokeWidth: 2,
      transformOrigin: 'center',
      transition: SPRING,
    },
  } satisfies Variants,
  lineBottom: {
    closed: {
      rotate: 0,
      y: 0,
      strokeWidth: 2,
    },
    open: {
      rotate: -45,
      y: -2.5,
      strokeWidth: 2,
      transformOrigin: 'center',
      transition: SPRING,
    },
  } satisfies Variants,
} as const;

function MenuIcon({ size = 24, isOpen = false, className, color = 'currentColor', immediate = false }: MenuIconProps) {
  const controls = useAnimation();

  React.useEffect(() => {
    if (immediate) {
      controls.set(isOpen ? 'open' : 'closed');
    } else {
      controls.start(isOpen ? 'open' : 'closed');
    }
  }, [isOpen, controls, immediate]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.line
        x1={1}
        y1={9.5}
        x2={23}
        y2={9.5}
        variants={animations.lineTop}
        initial="closed"
        animate={controls}
      />
      <motion.line
        x1={1}
        y1={14.5}
        x2={23}
        y2={14.5}
        variants={animations.lineBottom}
        initial="closed"
        animate={controls}
      />
    </motion.svg>
  );
}

export { MenuIcon, type MenuIconProps };
