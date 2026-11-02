"use client";

import { useEffect, useState } from "react";

/**
 * Viewport-aware diameter for <MagneticBall>, which needs a real number - it
 * uses the radius for its hover hit test, so a CSS unit will not do.
 *
 * `desktop` receives the viewport width so a ball can track it (e.g. 12.3vw)
 * or ignore it and return a fixed size.
 */
export const useBallSize = (
  mobile: number,
  tablet: number,
  desktop: (viewportWidth: number) => number
) => {
  const [size, setSize] = useState(tablet);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSize(w < 640 ? mobile : w < 1024 ? tablet : desktop(w));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mobile, tablet, desktop]);

  return size;
};
