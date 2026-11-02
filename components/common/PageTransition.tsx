"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Route labels shown on the curtain ---------- */

const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/contact": "Contact",
};

/* ---------- Context ---------- */

interface TransitionContextType {
  /** Navigate to a route behind the dark curtain animation */
  navigateWithTransition: (href: string, label?: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

/* ---------- Provider + curtain overlay ---------- */

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pendingHref = useRef<string | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [label, setLabel] = useState("");

  // Park the curtain below the viewport via GSAP itself. Never do this with
  // an inline style transform: GSAP parses "translateY(100%)" from the
  // computed matrix as y=<pixels>, a SEPARATE additive component from
  // yPercent - the yPercent tweens then play offscreen (y stays +100vh).
  useEffect(() => {
    if (curtainRef.current) gsap.set(curtainRef.current, { yPercent: 100 });
  }, []);

  // Slide the curtain up and out through the top, revealing the new page
  const reveal = useCallback(() => {
    const curtain = curtainRef.current;
    const labelEl = labelRef.current;
    if (!curtain || !labelEl) return;

    // New page = new document height; re-measure footer/scroll triggers
    ScrollTrigger.refresh();

    gsap
      .timeline({ delay: 0.3 })
      .to(labelEl, { opacity: 0, y: -28, duration: 0.3, ease: "power2.in" })
      .to(
        curtain,
        { yPercent: -100, duration: 0.75, ease: "power3.inOut" },
        "-=0.15"
      )
      .set(curtain, { visibility: "hidden", yPercent: 100 });
  }, []);

  const navigateWithTransition = useCallback(
    (href: string, customLabel?: string) => {
      if (pendingHref.current || href === pathname) return;

      const curtain = curtainRef.current;
      const labelEl = labelRef.current;
      if (!curtain || !labelEl) {
        router.push(href);
        return;
      }

      pendingHref.current = href;
      setLabel(customLabel ?? ROUTE_LABELS[href] ?? "");

      gsap
        .timeline()
        .set(curtain, { visibility: "visible" })
        .fromTo(
          curtain,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.75, ease: "power3.inOut" }
        )
        .fromTo(
          labelEl,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.35"
        )
        .add(() => {
          // Swap the route while fully covered; land the new page at the top
          window.scrollTo(0, 0);
          router.push(href);

          // Safety: never stay covered if the route fails to land
          fallbackTimer.current = setTimeout(() => {
            pendingHref.current = null;
            reveal();
          }, 3000);
        });
    },
    [pathname, router, reveal]
  );

  // The new route has rendered under the curtain - reveal it
  useEffect(() => {
    if (pendingHref.current && pathname === pendingHref.current) {
      pendingHref.current = null;
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      reveal();
    }
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}

      {/* Curtain: the button hover wave scaled to the viewport - domed top
          and bottom edges. It extends 12.5vh past both ends so the domes sit
          offscreen while covering, and become the curved leading/trailing
          edges while it slides. visibility:hidden when idle (also disables
          hit-testing); while visible it swallows clicks mid-transition. */}
      <div
        ref={curtainRef}
        className="fixed left-0 z-90 flex w-full items-center justify-center will-change-transform"
        style={{
          top: "-25vh",
          height: "150vh",
          visibility: "hidden",
          backgroundColor: "var(--color-dark-shade)",
          // deeper dome = rounder leading/trailing edge; the 25vh overshoot
          // keeps the dome corners just offscreen while fully covering
          borderRadius: "50% / 16%",
        }}
        aria-hidden="true"
      >
        <div
          ref={labelRef}
          className="flex items-center gap-4 text-off-white-shade opacity-0 md:gap-5"
        >
          <span className="h-2 w-2 rounded-full bg-off-white-shade md:h-2.5 md:w-2.5" />
          <span className="text-4xl font-[350] md:text-6xl">{label}</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;
