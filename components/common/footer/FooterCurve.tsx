"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Deep dome at rest -> flat straight edge once revealed. The fill overshoots
   to y=102 so the band's bottom row is always solid dark against the dark
   footer below (no anti-aliased hairline at any pixel density). */
const DEEP_CURVE = "M0 0 Q50 200 100 0 L100 102 L0 102 Z";
const FLAT_CURVE = "M0 0 Q50 0 100 0 L100 102 L0 102 Z";

interface FooterCurveProps {
  /** Extra classes for the band wrapper - e.g. top margin before the footer. */
  className?: string;
  /** Fill of the dark band. Defaults to the footer's dark shade. */
  fill?: string;
}

/**
 * The dark curved reveal band that sits directly above a dark footer: a deep
 * arc that flattens to a straight edge as it scrolls up into view.
 *
 * Shared by the global "Let's work together" footer and the project "Next
 * case" footer so both reveal identically. Self-contained - it drives the
 * tween off its own band element, so the flatten always spans one viewport of
 * scroll regardless of how tall the footer beneath it is. Manipulate it purely
 * through props (spacing via `className`, colour via `fill`).
 */
const FooterCurve = ({
  className = "",
  fill = "var(--color-dark-shade)",
}: FooterCurveProps) => {
  const bandRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const path = pathRef.current;
    if (!band || !path) return;

    // power2.in keeps the arc deep through most of the reveal and only
    // flattens it near the end. Triggering on the band itself makes the
    // flatten span exactly one viewport of scroll as it rises into view.
    const tween = gsap.fromTo(
      path,
      { attr: { d: DEEP_CURVE } },
      {
        attr: { d: FLAT_CURVE },
        ease: "power2.in",
        scrollTrigger: {
          trigger: band,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={bandRef}
      // -mb-px overlaps the footer top by 1px, dark over dark, as a final
      // guard against sub-pixel rounding gaps under the arc.
      className={`pointer-events-none relative -mb-px h-14 w-full md:h-24 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={DEEP_CURVE} fill={fill} />
      </svg>
    </div>
  );
};

export default FooterCurve;
