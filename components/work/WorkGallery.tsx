"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import { IconMenu2, IconLayoutGrid } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMenu } from "@/context/MenuContext";
import { usePageTransition } from "@/components/common/PageTransition";
import MagneticButton from "@/components/common/MagneticButton";
import { SPACING } from "@/constants/spacing";
import { PROJECTS, type Project, type ProjectTag } from "@/data/projects";

/* ---------- Types ---------- */

type ViewMode = "list" | "grid";
type Filter = "all" | ProjectTag;

/* ---------- Data ---------- */
// Projects live in data/projects.ts (single source of truth).

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
];

/* ---------- Component ---------- */

// Floating preview panel dimensions (desktop hover)
const IMG_W = 420;
const IMG_H = 320;

const WorkGallery = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [mode, setMode] = useState<ViewMode>("list");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isTabletOrMobile = useIsMobile(1024);
  const { isMenuOpen } = useMenu();
  const { navigateWithTransition } = usePageTransition();

  const openProject = useCallback(
    (project: Project) => (e: React.MouseEvent) => {
      e.preventDefault();
      navigateWithTransition(`/work/${project.slug}`, project.title);
    },
    [navigateWithTransition]
  );

  // Wrapper around the active view, animated on list/grid switches
  const viewRef = useRef<HTMLDivElement>(null);

  // Cursor followers (desktop): image preview (list mode) + View ball
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgScrollRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const imagePos = useRef({ x: 0, y: 0 });
  const ballPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const filtered = PROJECTS.filter(
    (p) => filter === "all" || p.tags.includes(filter)
  );

  const countFor = useCallback(
    (f: Filter) =>
      f === "all"
        ? PROJECTS.length
        : PROJECTS.filter((p) => p.tags.includes(f)).length,
    []
  );

  // Reset hover state when the list changes or the menu opens
  useEffect(() => {
    setActiveIndex(null);
  }, [filter, mode, isMenuOpen]);

  // Animated list/grid switch: fade the current view down and out, swap
  // the mode, then the effect below staggers the new view in
  const changeMode = (m: ViewMode) => {
    if (m === mode) return;
    const el = viewRef.current;
    if (!el) {
      setMode(m);
      return;
    }
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: 36,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setMode(m),
    });
  };

  // Entrance animation for whichever view just rendered (mode or filter
  // change): container fades up while the items stagger in
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );

    const items = el.querySelectorAll("[data-view-item]");
    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.05,
        }
      );
    }
  }, [mode, filter]);

  // Mouse tracking + smooth follower loop (desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;

    const imgWrap = imgWrapRef.current;
    const ball = ballRef.current;
    if (!imgWrap || !ball) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    gsap.set(imgWrap, { xPercent: -50, yPercent: -50 });
    gsap.set(ball, { xPercent: -50, yPercent: -50 });

    const animate = () => {
      imagePos.current.x += (mousePos.current.x - imagePos.current.x) * 0.05;
      imagePos.current.y += (mousePos.current.y - imagePos.current.y) * 0.05;
      ballPos.current.x += (mousePos.current.x - ballPos.current.x) * 0.08;
      ballPos.current.y += (mousePos.current.y - ballPos.current.y) * 0.08;

      gsap.set(imgWrap, { x: imagePos.current.x, y: imagePos.current.y });
      gsap.set(ball, { x: ballPos.current.x, y: ballPos.current.y });

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTabletOrMobile]);

  // Show/hide the followers (image preview only in list mode)
  useEffect(() => {
    if (isTabletOrMobile) return;

    const imgWrap = imgWrapRef.current;
    const ball = ballRef.current;
    if (!imgWrap || !ball) return;

    const active = activeIndex !== null && !isMenuOpen;
    const showImg = active && mode === "list";

    gsap.killTweensOf([imgWrap, ball]);
    gsap.to(imgWrap, {
      scale: showImg ? 1 : 0.85,
      opacity: showImg ? 1 : 0,
      duration: showImg ? 0.6 : 0.45,
      ease: showImg ? "power2.out" : "power2.inOut",
    });
    gsap.to(ball, {
      scale: active ? 1 : 0.85,
      opacity: active ? 1 : 0,
      duration: active ? 0.5 : 0.4,
      ease: active ? "power2.out" : "power2.inOut",
    });
  }, [activeIndex, mode, isMenuOpen, isTabletOrMobile]);

  // Slide the preview stack to the hovered project
  useEffect(() => {
    if (isTabletOrMobile || activeIndex === null) return;
    const scroller = imgScrollRef.current;
    if (!scroller) return;

    gsap.to(scroller, {
      y: -activeIndex * IMG_H,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [activeIndex, isTabletOrMobile]);

  return (
    <section className={`${SPACING.sectionTop} ${SPACING.sectionBottom}`}>
      <div className={SPACING.container}>
        {/* Heading - same visual size/weight/color as the home hero
            (9.5rem at 1920 = 7.9vw), fluid so the longer first line always
            fits this narrower container */}
        <h1 className="text-[11vw] font-[450] leading-[0.95] tracking-tight text-grey-shade md:text-[10vw] lg:text-[7.9vw]">
          Creating next level <br /> digital products
        </h1>

        {/* Filters + view toggle */}
        <div
          className={`${SPACING.afterHeading} flex flex-wrap items-center justify-between gap-6`}
        >
          <div className="flex flex-wrap gap-3 md:gap-4">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <MagneticButton
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  variant={active ? "filled" : "outline"}
                  bgColor={active ? "var(--color-dark-shade)" : undefined}
                  borderColor="var(--color-grey-shade)"
                  hoverBgColor="var(--color-blue)"
                  hoverTextColor="var(--color-off-white-shade)"
                  disableHoverAnimation={active}
                  superscript={f.id === "all" ? undefined : countFor(f.id)}
                  rounded="full"
                  buttonClassName="px-7 py-4 md:px-11 md:py-8 text-sm md:text-xl font-normal tracking-wide"
                >
                  {f.label}
                </MagneticButton>
              );
            })}
          </div>

          {/* List / grid toggle (desktop) - same MagneticButton behavior as
              every other button on the site */}
          <div className="hidden gap-3 lg:flex">
            {(
              [
                ["list", IconMenu2],
                ["grid", IconLayoutGrid],
              ] as const
            ).map(([m, Icon]) => {
              const active = mode === m;
              return (
                <MagneticButton
                  key={m}
                  onClick={() => changeMode(m)}
                  variant={active ? "filled" : "outline"}
                  bgColor={active ? "var(--color-dark-shade)" : undefined}
                  borderColor="var(--color-grey-shade)"
                  hoverBgColor="var(--color-blue)"
                  hoverTextColor="var(--color-off-white-shade)"
                  disableHoverAnimation={active}
                  rounded="full"
                  width="96px"
                  height="96px"
                  ariaLabel={`${m} view`}
                >
                  <Icon size={24} stroke={1.5} />
                </MagneticButton>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects stage - wider than the text container so the divider
          lines outspan everything (reference); the inset padding brings
          the row text back into alignment with the heading above */}
      <div className={`${SPACING.betweenBlocks} ${SPACING.containerWide}`}>
        <div ref={viewRef}>
        {/* ---------- List view (desktop only) ---------- */}
        {mode === "list" && !isTabletOrMobile && (
          <div>
            <div className={`${SPACING.wideStageInset} hidden text-[11px] font-[450] uppercase tracking-[0.15em] text-grey-shade/50 md:grid md:grid-cols-[1fr_320px_90px]`}>
              <span>Client</span>
              <span>Services</span>
              <span>Year</span>
            </div>

            <div
              className="mt-4 border-b border-grey-shade/15"
              onMouseLeave={() => setActiveIndex(null)}
            >
              {filtered.map((project, index) => (
                <a
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  onClick={openProject(project)}
                  data-view-item
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`${SPACING.wideStageInset} grid cursor-pointer grid-cols-[1fr_auto] items-center border-t border-grey-shade/15 py-6 transition-opacity duration-300 hover:opacity-30 md:grid-cols-[1fr_320px_90px] md:py-9`}
                >
                  <span className="truncate whitespace-nowrap text-2xl font-[350] tracking-tight text-grey-shade md:text-3xl">
                    {project.title}
                  </span>
                  <span className="hidden truncate whitespace-nowrap text-[13px] text-grey-shade md:block">
                    {project.category}
                  </span>
                  <span className="whitespace-nowrap text-[13px] text-grey-shade">
                    {project.year}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Grid view (always the layout on mobile/tablet) ---------- */}
        {(mode === "grid" || isTabletOrMobile) && (
          <div
            className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:gap-x-16 lg:gap-y-16"
            onMouseLeave={() => setActiveIndex(null)}
          >
            {filtered.map((project, index) => (
              <a
                key={project.slug}
                href={`/work/${project.slug}`}
                onClick={openProject(project)}
                data-view-item
                onMouseEnter={() => setActiveIndex(index)}
                className="group block cursor-pointer"
              >
                {/* Near-square frame with a wide border of background around
                    a centered 16:10 screenshot, like the reference */}
                <div
                  className="relative flex aspect-[7/8] w-full items-center justify-center overflow-hidden"
                  style={{
                    background:
                      project.previewBg || project.bgColor || "#f5f5f4",
                  }}
                >
                  <div className="relative aspect-[16/10] w-[85%] overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image
                      src={project.cover}
                      alt={project.coverAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <h3 className="mt-4 truncate whitespace-nowrap text-xl font-[350] tracking-tight text-grey-shade md:mt-6 md:text-2xl">
                  {project.title}
                </h3>
                <div className="mt-4 h-px w-full bg-grey-shade/20 md:mt-5" />
              </a>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* ---------- Cursor followers (desktop only) ---------- */}
      {!isTabletOrMobile && (
        <>
          {/* Image preview panel - list mode */}
          <div
            ref={imgWrapRef}
            className="pointer-events-none fixed left-0 top-0 z-40"
            style={{ opacity: 0, transform: "scale(0.85)" }}
          >
            <div
              className="overflow-hidden"
              style={{
                width: `${IMG_W}px`,
                height: `${IMG_H}px`,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div ref={imgScrollRef} className="will-change-transform">
                {filtered.map((project) => (
                  <div
                    key={project.slug}
                    className="flex items-center justify-center"
                    style={{
                      width: `${IMG_W}px`,
                      height: `${IMG_H}px`,
                      background:
                        project.previewBg ||
                        project.bgColor ||
                        "var(--color-off-white-shade)",
                    }}
                  >
                    <div className="relative aspect-[16/10] w-[68%] overflow-hidden shadow-2xl">
                      <Image
                        src={project.cover}
                        alt={project.coverAlt}
                        fill
                        className="object-contain"
                        sizes="300px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View ball - both modes */}
          <div
            ref={ballRef}
            className="pointer-events-none fixed left-0 top-0 z-50"
            style={{ opacity: 0, transform: "scale(0.85)" }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue">
              <span className="text-base font-normal text-off-white-shade">
                View
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default WorkGallery;
