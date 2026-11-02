"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is mobile/tablet.
 * Uses a combination of touch detection and screen width.
 * @param breakpoint - Max width in pixels to consider as mobile (default: 1024 for tablets)
 * @returns boolean indicating if device is mobile/tablet
 */
export function useIsMobile(breakpoint: number = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check for touch capability
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

      // Check screen width
      const isSmallScreen = window.innerWidth <= breakpoint;

      // Consider mobile if it has touch AND is small screen
      // OR if it's a very small screen (phone-sized)
      setIsMobile((hasTouch && isSmallScreen) || window.innerWidth <= 768);
    };

    // Initial check
    checkIsMobile();

    // Listen for resize events
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to check if device has touch capability (doesn't use state, SSR-safe)
 * @returns boolean indicating if device supports touch
 */
export function useHasTouch(): boolean {
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    setHasTouch(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  return hasTouch;
}
