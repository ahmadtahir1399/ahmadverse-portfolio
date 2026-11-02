"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticBall from "@/components/common/MagneticBall";
import MagneticButton from "@/components/common/MagneticButton";
import FooterCurve from "@/components/common/footer/FooterCurve";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLocalTime } from "@/hooks/useLocalTime";
import { usePageTransition } from "@/components/common/PageTransition";
import { CONTACT, SOCIALS } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Data ---------- */

const LABEL_CLASS =
  "text-[10px] md:text-xs font-[450] uppercase tracking-[0.2em] text-off-white-shade/40";

/** Bottom-bar link: hairline underline that wipes in from the left on hover. */
const UNDERLINE_LINK_CLASS =
  "relative text-sm md:text-base after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-off-white-shade after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

/* ---------- Main Component ---------- */

const Footer = () => {
  // In-flow element: defines the reveal window in the document
  const revealRef = useRef<HTMLElement>(null);
  // Wrapper animated by scroll for the subtle right-to-left ball drift
  const ballDriftRef = useRef<HTMLDivElement>(null);
  // Fixed panel, measured so the in-flow spacer always matches its height
  // (h-screen on desktop, content-sized on mobile)
  const panelRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState<number | null>(null);

  const isMobile = useIsMobile();
  const time = useLocalTime();
  const { navigateWithTransition } = usePageTransition();

  // Reveal window: at least the panel's height, and never so short that
  // page content shows at full scroll - only a thin blank strip (~40px)
  // of page may remain above the footer, on any viewport height
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

  // Scroll-linked (Lenis-synced via ScrollTrigger): the ball drifts slightly
  // right -> left while the footer reveals. The curve arc is handled by the
  // shared <FooterCurve /> band below.
  useEffect(() => {
    const revealEl = revealRef.current;
    const drift = ballDriftRef.current;
    if (!revealEl || !drift) return;

    const driftTween = gsap.fromTo(
      drift,
      { x: isMobile ? 16 : 120 },
      {
        x: 0,
        ease: "none",
        scrollTrigger: {
          trigger: revealEl,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1.2,
        },
      }
    );

    return () => {
      driftTween.scrollTrigger?.kill();
      driftTween.kill();
    };
  }, [isMobile]);

  return (
    <>
      {/* Curve band: the LAST element of the page flow, OUTSIDE the clipped
          footer. Shared with the project "Next case" footer so both reveal
          identically - see FooterCurve. */}
      <FooterCurve />

      <footer
        ref={revealRef}
        // bg-dark-shade: backstop so any reveal-window area not covered by the
        // fixed panel (content-sized on mobile) reads as footer, never as a
        // white gap under the curve
        className="relative w-full bg-dark-shade"
        // Confines the fixed panel below to this element's box in the document,
        // so the pinned panel is progressively revealed as the page scrolls past
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Dark panel pinned to the viewport - the footer that sits "under" the site */}
        {/* overflow-hidden: nothing inside (ball drift etc.) may poke past the
          viewport edge, or mobile browsers widen/pan the whole page.
          Content-sized on mobile, full screen from md up. */}
        <div
          ref={panelRef}
          className="fixed bottom-0 left-0 z-0 flex w-full flex-col justify-between gap-24 overflow-hidden bg-dark-shade text-off-white-shade md:h-screen md:gap-0"
          // Stretch to the reveal window so justify-between distributes the
          // space inside the panel instead of leaving dead dark above it
          style={spacerHeight ? { minHeight: spacerHeight } : undefined}
        >
          {/* Top: heading + line + ball + contact pills */}
          <div className="mx-auto w-[92%] md:w-[86%] lg:w-[68%] pt-16 md:pt-[14vh]">
            {/* Heading row */}
            <div className="flex items-center justify-between">
              <h2 className="font-[350] leading-[1.12] tracking-tight text-[clamp(2.5rem,5.8vw,7rem)]">
                <span className="flex items-center gap-4 md:gap-7">
                  <span className="relative inline-block h-[0.9em] w-[0.9em] shrink-0 overflow-hidden rounded-full bg-grey-shade">
                    <Image
                      src="/assets/ahmad-tahir-full-stack-web-developer.jpg"
                      alt="Portrait of Ahmad Tahir, full stack web developer"
                      fill
                      className="object-cover"
                      sizes="130px"
                    />
                  </span>
                  Let&apos;s work
                </span>
                <span className="block">together</span>
              </h2>

              {/* Down-left arrow */}
              <svg
                className="mr-[2%] h-5 w-5 self-center md:h-7 md:w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 7L7 17" />
                <path d="M7 9v8h8" />
              </svg>
            </div>

            {/* Divider line with the Get in touch ball sitting on it */}
            <div className="relative mt-10 md:mt-14">
              <div className="h-px w-full bg-off-white-shade/20" />

              <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
                <div ref={ballDriftRef} className="will-change-transform">
                  <MagneticBall
                    text="Get in touch"
                    size={isMobile ? 110 : 160}
                    bgColor="var(--color-blue)"
                    hoverBgColor="var(--color-dark-blue)"
                    textColor="var(--color-off-white-shade)"
                    fontSize={isMobile ? "0.85rem" : "1rem"}
                    fontWeight="400"
                    href={`mailto:${CONTACT.email}`}
                  />
                </div>
              </div>
            </div>

            {/* Contact pills - full-width stacked on mobile (phone pill filled
              blue like the reference), inline side by side on desktop */}
            <div className="mt-32 flex flex-col items-stretch gap-3.5 md:mt-16 md:flex-row md:items-start md:gap-6">
              <MagneticButton
                href={`mailto:${CONTACT.email}`}
                variant="outline"
                borderColor="rgba(252, 250, 248, 0.3)"
                textColor="var(--color-off-white-shade)"
                hoverBgColor="var(--color-blue)"
                hoverTextColor="var(--color-off-white-shade)"
                className="w-full md:w-auto"
                buttonClassName="w-full md:w-auto px-6 py-3.5 md:px-10 md:py-5 text-sm md:text-base font-normal tracking-wide"
                rounded="full"
              >
                {CONTACT.email}
              </MagneticButton>

              {CONTACT.phone && (
                <MagneticButton
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  variant="outline"
                  borderColor="rgba(252, 250, 248, 0.3)"
                  textColor="var(--color-off-white-shade)"
                  hoverBgColor="var(--color-blue)"
                  hoverTextColor="var(--color-off-white-shade)"
                  className="w-full md:w-auto"
                  buttonClassName="w-full md:w-auto px-6 py-3.5 md:px-10 md:py-5 text-sm md:text-base font-normal tracking-wide"
                  rounded="full"
                >
                  {CONTACT.phone}
                </MagneticButton>
              )}
            </div>
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
                  <p className="mt-2 text-sm md:text-base">{time || " "}</p>
                </div>
              </div>

              {/* Divider between socials and version/time (mobile only) */}
              <div className="order-2 h-px w-full bg-off-white-shade/20 md:hidden" />

              {/* Contact left / socials right on mobile; grouped right on desktop */}
              <div className="order-1 flex items-end justify-between gap-8 md:order-2 md:justify-start md:gap-14">
                <div>
                  <p className={LABEL_CLASS}>Contact</p>
                  {/* Goes through the curtain transition like every other
                      in-site link, instead of a hard document load */}
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
    </>
  );
};

export default Footer;
