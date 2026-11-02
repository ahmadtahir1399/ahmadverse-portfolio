"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticBall from "@/components/common/MagneticBall";
import { SPACING } from "@/constants/spacing";
import { useBallSize } from "@/hooks/useBallSize";
import { PERSON } from "@/lib/site";

// Smooth "ease-out-expo"-ish curve reused across the About page reveals.
const EASE = [0.22, 1, 0.36, 1] as const;

/** Seven-stop rainbow the ball eases through while hovered. Starts on the
    brand blue so the cycle grows out of the ball's resting colour instead of
    jumping to it. Module-level so the array identity stays stable and the
    loop is never restarted. */
const BALL_HOVER_COLORS = [
  "#0a85ed", // brand blue (matches the ball at rest)
  "#4e56e8", // indigo
  "#af52de", // violet
  "#ff3b30", // red
  "#ff9500", // orange
  "#ffcc00", // yellow
  "#34c759", // green
];

/** One full turn of the globe, in seconds. */
const SPIN = 9;

/**
 * Wireframe globe - the "works worldwide" mark that sits inside the ball.
 *
 * The two meridians are great circles a quarter-turn apart. Projected onto a
 * flat viewport their width traces cos/sin of the spin angle, so easing their
 * `rx` between full and flat reads as the globe actually revolving - the
 * outline, equator and latitude lines stay put, exactly as on a real globe.
 */
const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.05}
    strokeLinecap="round"
    className="h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.25" />

    <motion.ellipse
      cx="12"
      cy="12"
      ry="9.25"
      initial={{ rx: 9.25 }}
      animate={{ rx: [9.25, 0.15, 9.25] }}
      transition={{ duration: SPIN, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.ellipse
      cx="12"
      cy="12"
      ry="9.25"
      initial={{ rx: 0.15 }}
      animate={{ rx: [0.15, 9.25, 0.15] }}
      transition={{ duration: SPIN, repeat: Infinity, ease: "easeInOut" }}
    />

    <path d="M2.9 12h18.2" />
    <path d="M4.2 6.7c2.2 1.3 4.9 2 7.8 2s5.6-.7 7.8-2" />
    <path d="M4.2 17.3c2.2-1.3 4.9-2 7.8-2s5.6.7 7.8 2" />
  </svg>
);

/** Ball diameter tracks the viewport (~12.3vw) the way the reference does. */
const desktopBallSize = (w: number) => Math.round(w * 0.123);

const AboutHero = () => {
  const ballSize = useBallSize(92, 140, desktopBallSize);

  // The arrow starts pointing right and swings down as the page scrolls,
  // matching the reference's "-> then \" behaviour.
  const { scrollY } = useScroll();
  const arrowRotate = useTransform(scrollY, [0, 600], [0, 45]);

  // Parallax: the portrait drifts down inside its frame as the page scrolls,
  // so it lags slightly behind the rest of the column. Measured from when the
  // frame enters the viewport to when it leaves.
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section className="pt-16 text-black-shade md:pt-24 lg:pt-[150px]">
      {/* Headline + divider sit in the narrow text column (16% -> 84%) */}
      <div className={SPACING.container}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-[13vw] font-[450] leading-[0.96] tracking-tight text-grey-shade sm:text-[10vw] md:text-[8vw] lg:text-[6.4vw]"
        >
          Full-stack products, <br className="hidden sm:block" />
          built end to end
        </motion.h1>

        {/* Divider line with the globe ball centred on it at ~82% across */}
        <div className="relative mt-16 md:mt-28 lg:mt-[122px]">
          <div className="h-px w-full bg-grey-shade/25" />
          <div className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 sm:left-[76%] lg:left-[82%]">
            <MagneticBall
              size={ballSize}
              bgColor="var(--color-blue)"
              hoverBgColor="var(--color-blue)"
              hoverColors={BALL_HOVER_COLORS}
              textColor="var(--color-off-white-shade)"
              href={`mailto:${PERSON.email}`}
            >
              <GlobeIcon />
            </MagneticBall>
          </div>
        </div>
      </div>

      {/* Intro row breaks out to the wide stage (8% -> 92%): the arrow hangs
          left of the text column and the portrait runs to the wide right edge */}
      <div className={SPACING.containerWide}>
        <div className="mt-14 flex flex-col-reverse gap-12 md:mt-24 lg:mt-40 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
          {/* Arrow - its own column, outside the text column */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ rotate: arrowRotate }}
            className="h-6 w-6 shrink-0 text-black-shade lg:col-span-1 lg:mt-1"
            aria-hidden="true"
          >
            <path d="M4 12h15" />
            <path d="M13 6l6 6-6 6" />
          </motion.svg>

          {/* Copy - narrow measure, aligned with the headline column */}
          <div className="lg:col-span-3 lg:col-start-2 lg:pl-4">
            <p className="max-w-[21rem] text-[17px] leading-[2] text-black-shade lg:text-[19px]">
              I build production web apps end to end - AI assistants, real-time
              platforms and two-sided marketplaces - from the first schema to
              the live deploy.
            </p>
            <p className="mt-10 text-[17px] leading-[2] text-grey-shade/45 lg:text-[19px]">
              Always shipping.
            </p>
          </div>

          {/* Portrait - runs from ~35% to the wide right edge */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="lg:col-span-7 lg:col-start-6"
          >
            <div
              ref={frameRef}
              className="relative aspect-4/3 w-full overflow-hidden lg:aspect-9/10"
            >
              {/* Oversized plate (124% tall, pulled up 12%) so the +/-9% drift
                  never uncovers an edge of the frame */}
              <motion.div
                style={{ y: imageY }}
                className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform"
              >
                <Image
                  src={PERSON.photo}
                  alt="Portrait of Ahmad Tahir, full stack web developer"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 92vw, 49vw"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
