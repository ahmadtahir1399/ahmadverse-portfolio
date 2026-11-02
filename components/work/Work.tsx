"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMenu } from "@/context/MenuContext";
import MagneticButton from "@/components/common/MagneticButton";
import { usePageTransition } from "@/components/common/PageTransition";
import { SPACING } from "@/constants/spacing";
import { PROJECTS, RECENT_PROJECTS, type Project } from "@/data/projects";

/* ---------- Data ---------- */
// Single source of truth lives in data/projects.ts. The home section shows
// the most recent few; the full set lives on /work.
const RECENT = RECENT_PROJECTS;

/* ---------- Main Component ---------- */

const NAVBAR_HEIGHT = 80; // Height of the navbar area

const Work = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const viewButtonWrapperRef = useRef<HTMLDivElement>(null);
  const viewButtonRef = useRef<HTMLDivElement>(null);
  const viewTextRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const isTabletOrMobile = useIsMobile(1024); // Use 1024px breakpoint for card layout
  const { isMenuOpen } = useMenu();
  const { navigateWithTransition } = usePageTransition();

  const openProject = useCallback(
    (project: Project) =>
      navigateWithTransition(`/work/${project.slug}`, project.title),
    [navigateWithTransition]
  );

  // Mouse position tracking
  const mousePos = useRef({ x: 0, y: 0 });
  const imagePos = useRef({ x: 0, y: 0 });
  const buttonPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const isInContainerRef = useRef(false);

  // Check which row the cursor is over based on position
  const getActiveRowIndex = useCallback(() => {
    for (let i = 0; i < rowRefs.current.length; i++) {
      const row = rowRefs.current[i];
      if (row) {
        const rect = row.getBoundingClientRect();
        if (
          mousePos.current.y >= rect.top &&
          mousePos.current.y <= rect.bottom &&
          mousePos.current.x >= rect.left &&
          mousePos.current.x <= rect.right
        ) {
          return i;
        }
      }
    }
    return null;
  }, []);

  // Check if cursor is inside container
  const checkIsInContainer = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const rect = container.getBoundingClientRect();
    return (
      mousePos.current.x >= rect.left &&
      mousePos.current.x <= rect.right &&
      mousePos.current.y >= rect.top &&
      mousePos.current.y <= rect.bottom
    );
  }, []);

  // Close popup when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      setActiveIndex(null);
    }
  }, [isMenuOpen]);

  // Global mouse tracking + scroll detection (Desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // If menu is open, disable all interactions
      if (isMenuOpen) {
        if (isInContainerRef.current) {
          isInContainerRef.current = false;
          setActiveIndex(null);
        }
        return;
      }

      // If cursor is in navbar area (top of screen), close the popup
      if (e.clientY < NAVBAR_HEIGHT) {
        if (isInContainerRef.current) {
          isInContainerRef.current = false;
          setActiveIndex(null);
        }
        return;
      }

      const isInside = checkIsInContainer();
      const wasInside = isInContainerRef.current;
      isInContainerRef.current = isInside;

      if (isInside) {
        const rowIndex = getActiveRowIndex();
        setActiveIndex(rowIndex);
      } else if (wasInside) {
        // Only update state when leaving, not on every move outside
        setActiveIndex(null);
      }
    };

    // Handle scroll - recalculate position and close if outside
    const handleScroll = () => {
      // If menu is open, do nothing
      if (isMenuOpen) return;

      const isInside = checkIsInContainer();
      isInContainerRef.current = isInside;

      if (isInside) {
        const rowIndex = getActiveRowIndex();
        setActiveIndex(rowIndex);
      } else {
        setActiveIndex(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isTabletOrMobile, isMenuOpen, getActiveRowIndex, checkIsInContainer]);

  // Animation loop for smooth cursor following (Desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;

    const imageContainer = imageContainerRef.current;
    const viewButtonWrapper = viewButtonWrapperRef.current;

    if (!imageContainer || !viewButtonWrapper) return;

    gsap.set(imageContainer, { xPercent: -50, yPercent: -50 });
    gsap.set(viewButtonWrapper, { xPercent: -50, yPercent: -50 });

    const animate = () => {
      // Image container follows with smooth, slow lag
      const imgDx = mousePos.current.x - imagePos.current.x;
      const imgDy = mousePos.current.y - imagePos.current.y;
      imagePos.current.x += imgDx * 0.045;
      imagePos.current.y += imgDy * 0.045;

      // View button follows slightly faster but still smooth
      const btnDx = mousePos.current.x - buttonPos.current.x;
      const btnDy = mousePos.current.y - buttonPos.current.y;
      buttonPos.current.x += btnDx * 0.07;
      buttonPos.current.y += btnDy * 0.07;

      gsap.set(imageContainer, {
        x: imagePos.current.x,
        y: imagePos.current.y,
      });

      gsap.set(viewButtonWrapper, {
        x: buttonPos.current.x,
        y: buttonPos.current.y,
      });

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTabletOrMobile]);

  // Show/hide elements based on active state - smooth scale animation (Desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;

    const imageContainer = imageContainerRef.current;
    const viewButtonWrapper = viewButtonWrapperRef.current;

    if (!imageContainer || !viewButtonWrapper) return;

    if (activeIndex !== null) {
      // Opening animation - smooth and elegant
      gsap.killTweensOf(imageContainer);
      gsap.to(imageContainer, {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.killTweensOf(viewButtonWrapper);
      gsap.to(viewButtonWrapper, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: 0.05,
        ease: "power2.out",
      });
    } else {
      // Closing animation - smooth fade out
      gsap.killTweensOf(imageContainer);
      gsap.to(imageContainer, {
        scale: 0.85,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });

      gsap.killTweensOf(viewButtonWrapper);
      gsap.to(viewButtonWrapper, {
        scale: 0.85,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [activeIndex, isTabletOrMobile]);

  // Handle image transitions - scroll effect (Desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;
    if (activeIndex === null) return;

    const scrollContainer = imageScrollRef.current;
    if (!scrollContainer) return;

    const scrollY = activeIndex * 350;

    gsap.to(scrollContainer, {
      y: -scrollY,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [activeIndex, isTabletOrMobile]);

  // View button magnetic effect (Desktop only)
  useEffect(() => {
    if (isTabletOrMobile) return;

    const wrapper = viewButtonWrapperRef.current;
    const button = viewButtonRef.current;
    const text = viewTextRef.current;

    if (!wrapper || !button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.35;
      const deltaY = (e.clientY - centerY) * 0.35;

      const maxMove = 10;
      const targetX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const targetY = Math.max(-maxMove, Math.min(maxMove, deltaY));

      gsap.to(button, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.to(text, {
        x: targetX * 0.4,
        y: targetY * 0.4,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTabletOrMobile]);

  return (
    <section className="w-full flex justify-center items-center mx-auto">
      {/* Shared work container (SPACING.container) - same 68% column as the
          rest of the site so the rows line up with AboutMe above */}
      <div className={SPACING.container}>
        {/* Header */}
        <div className="px-4 md:px-0">
          <span className="text-xs font-[450] uppercase tracking-[0.2em] text-grey-shade/60">
            RECENT WORK
          </span>
        </div>

        {/* Conditional Rendering: Card Grid for Tablet/Mobile, List for Desktop */}
        {isTabletOrMobile ? (
          /* Card Grid Layout for Tablet/Mobile */
          <div className="mt-8 md:mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-0">
              {RECENT.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  onOpen={openProject}
                />
              ))}
            </div>
          </div>
        ) : (
          /* List Layout for Desktop */
          <div
            ref={containerRef}
            className="relative mt-5 border-b border-grey-shade/20"
          >
            {RECENT.map((project, index) => (
              <ProjectRow
                key={project.slug}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                project={project}
                index={index}
                isActive={activeIndex === index}
                onOpen={openProject}
              />
            ))}
          </div>
        )}

        {/* More Work Button */}
        <div className="flex justify-center mt-12 md:mt-16 ">
          <MagneticButton
            onClick={() => navigateWithTransition("/work", "Work")}
            variant="outline"
            superscript={PROJECTS.length}
            borderColor="var(--color-grey-shade)"
            hoverBgColor="var(--color-blue)"
            hoverTextColor="var(--color-off-white-shade)"
            buttonClassName="px-9 py-5 text-base font-normal tracking-wide"
            rounded="full"
          >
            More work
          </MagneticButton>
        </div>

        {/* Image Container - follows cursor with lag (Desktop only) */}
        {!isTabletOrMobile && (
          <div
            ref={imageContainerRef}
            className="pointer-events-none fixed left-0 top-0 z-40"
            style={{ opacity: 0, transform: "scale(0.85)" }}
          >
            <div
              className="overflow-hidden"
              style={{
                width: "460px",
                height: "350px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div ref={imageScrollRef} className="will-change-transform">
                {RECENT.map((project) => (
                  <div
                    key={project.slug}
                    className="flex items-center justify-center"
                    style={{
                      width: "460px",
                      height: "350px",
                      background:
                        project.previewBg ||
                        project.bgColor ||
                        "var(--color-off-white-shade)",
                    }}
                  >
                    <div
                      className="relative overflow-hidden shadow-2xl"
                      style={{ width: "300px", height: "200px" }}
                    >
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
        )}

        {/* View Button - follows cursor more closely with magnetic effect (Desktop only) */}
        {!isTabletOrMobile && (
          <div
            ref={viewButtonWrapperRef}
            className="fixed left-0 top-0 z-50"
            style={{
              opacity: 0,
              transform: "scale(0.85)",
              pointerEvents: activeIndex !== null ? "auto" : "none",
            }}
          >
            <div
              ref={viewButtonRef}
              onClick={() => {
                if (activeIndex !== null) openProject(RECENT[activeIndex]);
              }}
              className="flex h-25 w-25 items-center justify-center rounded-full bg-blue cursor-pointer will-change-transform"
            >
              <span
                ref={viewTextRef}
                className="text-base font-[450] text-off-white-shade will-change-transform"
              >
                View
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------- Project Card Component (Tablet/Mobile) ---------- */

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  return (
    <a
      href={`/work/${project.slug}`}
      onClick={(e) => {
        e.preventDefault();
        onOpen(project);
      }}
      className="group block overflow-hidden transition-all duration-300 cursor-pointer border-b border-grey-shade/20 pb-6 md:pb-8"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-grey-shade/5 mb-6 md:mb-8">
        <div
          className="absolute inset-0"
          style={{
            background:
              project.previewBg || project.bgColor || "#f5f5f5",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
            <div className="relative w-full h-full">
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div>
        <h3 className="text-2xl md:text-3xl font-[350] text-black-shade mb-3 md:mb-4">
          {project.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-grey-shade">
          <span className="font-normal">{project.category}</span>
          <span className="font-normal">{project.year}</span>
        </div>
      </div>
    </a>
  );
};

/* ---------- Project Row Component (Desktop) ---------- */

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  onOpen: (project: Project) => void;
}

const ProjectRow = React.forwardRef<HTMLDivElement, ProjectRowProps>(
  ({ project, isActive, onOpen }, ref) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const categoryRef = useRef<HTMLSpanElement>(null);

    // Fade effect - the hovered project itself fades
    useEffect(() => {
      const title = titleRef.current;
      const category = categoryRef.current;
      if (!title || !category) return;

      if (isActive) {
        // Hovered item fades
        gsap.to(title, {
          color: "rgba(56, 56, 56, 0.25)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(category, {
          opacity: 0.25,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        // Default state - full color
        gsap.to(title, {
          color: "var(--color-black-shade)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(category, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }, [isActive]);

    return (
      <div
        ref={ref}
        onClick={() => onOpen(project)}
        className="group border-t border-grey-shade/20 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex flex-col py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-baseline gap-4 md:gap-8">
            <h2
              ref={titleRef}
              className="text-4xl tracking-tight text-black-shade transition-transform duration-500 md:text-5xl lg:text-6xl"
              style={{
                fontWeight: 300,
              }}
            >
              {project.title}
            </h2>
          </div>

          <div className="mt-4 flex items-center justify-between md:mt-0">
            <span
              ref={categoryRef}
              className="text-xs font-[450] uppercase tracking-[0.15em] text-grey-shade md:text-sm"
            >
              {project.category}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ProjectRow.displayName = "ProjectRow";

export default Work;
