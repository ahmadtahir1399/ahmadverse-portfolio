"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/data/projects";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMenu } from "@/context/MenuContext";
import { usePageTransition } from "@/components/common/PageTransition";
import FooterCurve from "@/components/common/footer/FooterCurve";
import { SOCIALS } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Footer data ---------- */

const LABEL_CLASS =
  "text-[10px] md:text-xs font-[450] uppercase tracking-[0.2em] text-off-white-shade/40";

/** Bottom-bar link: hairline underline that wipes in from the left on hover. */
const UNDERLINE_LINK_CLASS =
  "relative text-sm md:text-base after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-off-white-shade after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

/* Live local time, e.g. "11:01 PM GMT+2" */
const useLocalTime = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const clock = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const offsetMin = -now.getTimezoneOffset();
      const sign = offsetMin >= 0 ? "+" : "-";
      const hours = Math.floor(Math.abs(offsetMin) / 60);
      const mins = Math.abs(offsetMin) % 60;
      const gmt = `GMT${sign}${hours}${mins ? `:${String(mins).padStart(2, "0")}` : ""}`;
      setTime(`${clock} ${gmt}`);
    };
    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

/**
 * The full, custom footer for project detail pages. It uses the EXACT same
 * reveal mechanism as the global "Let's work together" footer - a fixed panel
 * progressively revealed behind a clipped, measured in-flow spacer - so both
 * footers slide in identically. Only the middle block differs: instead of the
 * "Let's work together" heading + contact pills, it shows the "Next case"
 * project (image hidden by default, revealed as the title dims on hover, with a
 * cursor-following ball). This replaces the global site footer on /work/[slug].
 */
const NextCase = ({ next }: { next: Project }) => {
  // Fixed panel, measured so the in-flow spacer always matches its height
  // (h-screen on desktop, content-sized on mobile) - same as the global footer.
  const panelRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState<number | null>(null);

  // Next-case interaction refs
  const areaRef = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const ballPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const reveal = useRef({ p: 0 }); // 0 = image hidden strip, 1 = fully shown
  const [hovered, setHovered] = useState(false);

  const isTabletOrMobile = useIsMobile(1024);
  const { isMenuOpen } = useMenu();
  const { navigateWithTransition } = usePageTransition();
  const time = useLocalTime();

  // The top of the image is always visible (a preview sitting on the divider);
  // on hover the rest of the image simply comes out below the line.
  const REST_BOTTOM = 45; // % of the image clipped from the bottom at rest
  const applyClip = () => {
    const bottom = REST_BOTTOM * (1 - reveal.current.p);
    if (clipRef.current) {
      clipRef.current.style.clipPath = `inset(0% 0% ${bottom}% 0%)`;
    }
  };

  const go = (href: string, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition(href, label);
  };

  // Reveal window: at least the panel's height, and never so short that
  // page content shows at full scroll - only a thin blank strip (~40px)
  // of page may remain above the footer, on any viewport height.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const update = () => {
      const minReveal = window.innerHeight - 96;
      setSpacerHeight(Math.max(panel.offsetHeight, minReveal));
      ScrollTrigger.refresh();
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Smooth cursor-following ball (desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;
    const ball = ballRef.current;
    if (!ball) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    gsap.set(ball, { xPercent: -50, yPercent: -50 });
    const animate = () => {
      ballPos.current.x += (mousePos.current.x - ballPos.current.x) * 0.12;
      ballPos.current.y += (mousePos.current.y - ballPos.current.y) * 0.12;
      gsap.set(ball, { x: ballPos.current.x, y: ballPos.current.y });
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTabletOrMobile]);

  // Reveal image + dim title + show ball on hover.
  // On touch devices there's no hover, so the image is simply always shown.
  useEffect(() => {
    const clip = clipRef.current;
    const title = titleRef.current;
    const ball = ballRef.current;
    if (!clip || !title) return;

    if (isTabletOrMobile) {
      reveal.current.p = 1;
      applyClip();
      gsap.set(title, { color: "rgba(252,250,248,1)" });
      return;
    }

    const show = hovered && !isMenuOpen;

    gsap.killTweensOf(reveal.current);
    gsap.to(reveal.current, {
      p: show ? 1 : 0,
      duration: show ? 0.45 : 0.35,
      ease: "power2.out",
      onUpdate: applyClip,
    });

    gsap.to(title, {
      color: show ? "rgba(252,250,248,0.28)" : "rgba(252,250,248,1)",
      duration: 0.5,
      ease: "power2.out",
    });

    if (ball) {
      gsap.killTweensOf(ball);
      gsap.to(ball, {
        scale: show ? 1 : 0.6,
        opacity: show ? 1 : 0,
        duration: show ? 0.5 : 0.35,
        ease: show ? "power2.out" : "power2.inOut",
      });
    }
  }, [hovered, isMenuOpen, isTabletOrMobile]);

  return (
    <>
      {/* Curve band: the LAST element of the page flow, OUTSIDE the clipped
          footer. Shared with the global "Let's work together" footer so both
          reveal identically - see FooterCurve. */}
      <FooterCurve />

      <footer
        // bg-dark-shade: backstop so any reveal-window area not covered by the
        // fixed panel (content-sized on mobile) reads as footer, never as a
        // white gap under the curve
        className="relative w-full bg-dark-shade"
        // Confines the fixed panel below to this element's box in the document,
        // so the pinned panel is progressively revealed as the page scrolls past
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Dark panel pinned to the viewport - the footer that sits "under" the site */}
        {/* overflow-hidden: nothing inside may poke past the viewport edge, or
          mobile browsers widen/pan the whole page. Content-sized on mobile,
          full screen from md up. */}
        <div
          ref={panelRef}
          className="fixed bottom-0 left-0 z-0 flex w-full flex-col justify-between gap-24 overflow-hidden bg-dark-shade text-off-white-shade md:h-screen md:gap-0"
          // Stretch to the reveal window so justify-between distributes the
          // space inside the panel instead of leaving dead dark above it
          style={spacerHeight ? { minHeight: spacerHeight } : undefined}
        >
          {/* Top: Next case block (grows to fill, centered) */}
          <div className="flex flex-1 items-center justify-center pt-20 md:pt-24">
            <a
              ref={areaRef}
              href={`/work/${next.slug}`}
              onClick={go(`/work/${next.slug}`, next.title)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="block w-[92%] cursor-pointer text-center md:w-[86%] lg:w-[84%]"
            >
              <span className="text-sm text-off-white-shade/70 md:text-base">
                Next case
              </span>

              <h2
                ref={titleRef}
                className="mt-4 font-[450] uppercase leading-[0.95] tracking-tight text-off-white-shade text-[clamp(2rem,6.5vw,5.5rem)]"
              >
                {next.title}
              </h2>

              {/* Top preview sits on the divider; the rest of the image comes out
                  below the line on hover (the image crosses the divider). The
                  divider is full-bleed (w-screen) like the reference. */}
              <div className="relative mt-4 md:mt-8">
                <div className="pointer-events-none absolute left-1/2 top-[55%] h-px w-screen -translate-x-1/2 -translate-y-1/2 bg-off-white-shade/20" />
                <div
                  ref={clipRef}
                  className="relative z-10 mx-auto aspect-[16/10] w-[300px] overflow-hidden rounded-md md:w-[540px]"
                  style={{
                    backgroundColor: next.bgColor || "#111",
                    clipPath: "inset(0% 0% 45% 0%)",
                  }}
                >
                  <Image
                    src={next.cover}
                    alt={next.title}
                    fill
                    className="object-cover"
                    sizes="540px"
                  />
                </div>
              </div>
            </a>
          </div>

          {/* Bottom bar: version, local time, contact, socials - nearly full-bleed like the reference */}
          <div className="container-app pb-6 md:pb-10">
            <div className="flex flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:gap-0 md:px-0">
              {/* Version left / local time right on mobile; grouped left on desktop */}
              <div className="order-3 flex items-end justify-between md:order-1 md:justify-start md:gap-14">
                <div>
                  <p className={LABEL_CLASS}>Version</p>
                  <p className="mt-2 text-sm md:text-base">
                    {new Date().getFullYear()} &copy; Edition
                  </p>
                </div>
                <div className="text-right md:text-left">
                  <p className={LABEL_CLASS}>Local time</p>
                  <p className="mt-2 text-sm md:text-base">{time || " "}</p>
                </div>
              </div>

              {/* Divider between socials and version/time (mobile only) */}
              <div className="order-2 h-px w-full bg-off-white-shade/20 md:hidden" />

              {/* Contact left / socials right on mobile; grouped right on desktop */}
              <div className="order-1 flex items-end justify-between gap-8 md:order-2 md:justify-start md:gap-14">
                <div>
                  <p className={LABEL_CLASS}>Contact</p>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateWithTransition("/contact", "Contact");
                    }}
                    className={`${UNDERLINE_LINK_CLASS} mt-2 inline-block`}
                  >
                    Contact page
                  </a>
                </div>

                {SOCIALS.length > 0 && (
                  <div className="text-right md:text-left">
                    <p className={LABEL_CLASS}>Socials</p>
                    <div className="mt-2 flex flex-wrap justify-end gap-5 md:justify-start md:gap-7">
                      {SOCIALS.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={UNDERLINE_LINK_CLASS}
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* In-flow reveal window: how much scroll distance the reveal takes.
          pointer-events-none lets clicks fall through to the fixed panel.
          Sized from the measured panel/viewport (see effect above); any
          region above the panel shows the footer's dark backstop. */}
        <div
          className="pointer-events-none relative z-10 h-screen"
          style={spacerHeight ? { height: spacerHeight } : undefined}
        />
      </footer>

      {/* Cursor-following "Next case" ball (desktop only). Kept OUTSIDE the
          clipped <footer> so it renders across the whole viewport instead of
          being clipped to the footer's box. */}
      {!isTabletOrMobile && (
        <div
          ref={ballRef}
          className="pointer-events-none fixed left-0 top-0 z-50"
          style={{ opacity: 0, transform: "scale(0.6)" }}
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue">
            <span className="text-sm font-[450] text-off-white-shade">
              Next case
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default NextCase;
