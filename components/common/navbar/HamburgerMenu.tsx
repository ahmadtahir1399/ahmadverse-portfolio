"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MenuIcon } from "@/components/animate-ui/icons/menu";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePageTransition } from "@/components/common/PageTransition";
import { SOCIALS } from "@/lib/site";

interface NavItemType {
  heading: string;
  href: string;
}

interface NavLinkProps extends NavItemType {
  setIsActive: (isActive: boolean) => void;
  isHovered: boolean;
  isCurrentPage: boolean;
  onHover: (isHovered: boolean) => void;
  isMobile: boolean;
}

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: {
    x: "0",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const navItems: NavItemType[] = [
  { heading: "Home", href: "/" },
  { heading: "Work", href: "/work" },
  { heading: "About", href: "/about" },
  { heading: "Contact", href: "/contact" },
];

// Social link with underline animation from middle + magnetic effect
const SocialLink = ({
  label,
  href,
  isMobile,
}: {
  label: string;
  href: string;
  isMobile: boolean;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Magnetic cursor-following effect using GSAP (disabled on mobile)
  useEffect(() => {
    // Skip magnetic effect on mobile/tablet
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    const link = linkRef.current;

    if (!wrapper || !link) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 40% magnetic pull toward cursor
      const deltaX = (e.clientX - centerX) * 0.4;
      const deltaY = (e.clientY - centerY) * 0.4;

      const maxMove = 10;
      const targetX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const targetY = Math.max(-maxMove, Math.min(maxMove, deltaY));

      gsap.to(link, {
        x: targetX,
        y: targetY,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(link, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <div ref={wrapperRef} className="relative py-1.5 px-2 -mx-2 cursor-pointer">
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-social-link group relative inline-block will-change-transform"
      >
        {label}
        {/* Underline that expands from middle */}
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-0 group-hover:w-full transition-all duration-300 ease-out"
          style={{ backgroundColor: "var(--color-off-white-shade)" }}
        />
      </a>
    </div>
  );
};

// NavLink with magnetic cursor effect like the main navbar
const NavLink = ({
  heading,
  href,
  setIsActive,
  isHovered,
  isCurrentPage,
  onHover,
  isMobile,
}: NavLinkProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textSpanRef = useRef<HTMLSpanElement>(null);

  // Magnetic cursor-following effect using GSAP (disabled on mobile)
  useEffect(() => {
    // Skip magnetic effect on mobile/tablet
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    const link = linkRef.current;
    const textSpan = textSpanRef.current;

    if (!wrapper || !link || !textSpan) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use the text span's bounding rect for accurate center calculation
      const rect = textSpan.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 55% magnetic pull toward cursor (same as navbar)
      const deltaX = (e.clientX - centerX) * 0.55;
      const deltaY = (e.clientY - centerY) * 0.55;

      const maxMove = 20;
      const targetX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const targetY = Math.max(-maxMove, Math.min(maxMove, deltaY));

      gsap.to(link, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(link, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  const { navigateWithTransition } = usePageTransition();

  const handleClick = () => {
    setIsActive(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative py-1 cursor-pointer w-full md:w-auto flex items-center justify-between md:justify-start"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={handleClick}
    >
      <Link
        ref={linkRef}
        href={href}
        onClick={(e) => {
          // Route links go through the curtain transition; hash links scroll
          if (href.startsWith("/")) {
            e.preventDefault();
            navigateWithTransition(href, heading);
          }
        }}
        className="relative inline-flex items-center will-change-transform"
      >
        {/* Dot indicator - left side (desktop only) */}
        <span
          className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 hidden md:block"
          style={{
            backgroundColor: "var(--color-blue)",
            opacity: isHovered || isCurrentPage ? 1 : 0,
            transform:
              isHovered || isCurrentPage
                ? "translateY(-50%) scale(1)"
                : "translateY(-50%) scale(0)",
          }}
        />
        <span
          ref={textSpanRef}
          className="nav-menu-item transition-colors duration-300"
        >
          {heading}
        </span>
      </Link>
      {/* Mobile dot - far right */}
      <span
        className="w-2 h-2 rounded-full transition-all duration-300 md:hidden"
        style={{
          backgroundColor: "var(--color-blue)",
          opacity: isHovered || isCurrentPage ? 1 : 0,
          transform: isHovered || isCurrentPage ? "scale(1)" : "scale(0)",
        }}
      />
    </div>
  );
};

const Curve = () => {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowHeight === 0) return null;

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${
    windowHeight / 2
  } 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${
    windowHeight / 2
  } 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <svg
      className="absolute top-0 -left-24.75 w-25 stroke-none h-full"
      style={{ fill: "var(--color-dark-shade)" }}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

interface CurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  isMobile: boolean;
}

const CurvedNavbar = ({ setIsActive, isMobile }: CurvedNavbarProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();

  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-dvh w-full md:w-120 fixed right-0 top-0 z-40"
      style={{ backgroundColor: "var(--color-dark-shade)" }}
    >
      <div className="h-full pt-28 pb-12 flex flex-col justify-between px-8 md:pl-24 md:pr-12">
        {/* Navigation section */}
        <div className="flex flex-col gap-2">
          <div
            className="nav-menu-label border-b mb-3 pb-3"
            style={{
              borderColor: "rgba(252, 250, 248, 0.3)",
            }}
          >
            <p>Navigation</p>
          </div>
          <section className="mt-2 md:ml-6">
            <div>
              {navItems.map((item, index) => (
                <NavLink
                  key={item.href}
                  heading={item.heading}
                  href={item.href}
                  setIsActive={setIsActive}
                  isHovered={hoveredIndex === index}
                  isCurrentPage={pathname === item.href}
                  onHover={(isHovered: boolean) =>
                    setHoveredIndex(isHovered ? index : null)
                  }
                  isMobile={isMobile}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer with social links */}
        {SOCIALS.length > 0 && (
          <div className="pb-6">
            <div className="nav-menu-label mb-3">
              <p>Socials</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              {SOCIALS.map((link) => (
                <SocialLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Curve />
    </motion.div>
  );
};

interface HamburgerMenuProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const HamburgerMenu = ({ isOpen, setIsOpen }: HamburgerMenuProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [openedExternally, setOpenedExternally] = useState(false);
  const isMobile = useIsMobile();

  // Use external state if provided, otherwise use internal state
  const isMenuOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const setIsMenuOpen = setIsOpen || setInternalIsOpen;

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Show close button when menu is opened externally (via Navbar Menu button)
  useEffect(() => {
    const button = buttonRef.current;
    const icon = iconRef.current;
    if (!button || !icon) return;

    if (isMenuOpen && !isButtonVisible) {
      // Menu opened externally - show button immediately and mark as external
      setOpenedExternally(true);
      gsap.set(button, { scale: 1, opacity: 1 });
      gsap.set(icon, { opacity: 1, scale: 1 });
    } else if (!isMenuOpen && !isButtonVisible) {
      // Menu closed and button wasn't visible from scroll - hide it
      setOpenedExternally(false);
      gsap.set(button, { scale: 0, opacity: 0 });
      gsap.set(icon, { opacity: 0, scale: 0.5 });
    } else if (!isMenuOpen) {
      // Menu closed but button still visible from scroll
      setOpenedExternally(false);
    }
  }, [isMenuOpen, isButtonVisible]);

  // Scroll animation - slow animated appear on scroll down, instant shrink on scroll up
  useEffect(() => {
    const button = buttonRef.current;
    const icon = iconRef.current;
    if (!button || !icon) return;

    // Set initial state
    gsap.set(button, { scale: 0, opacity: 0 });
    gsap.set(icon, { opacity: 0, scale: 0.5 });

    const triggerScroll = 200; // Trigger point
    let lastScrollY = window.scrollY;
    let hasAppeared = false;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const scrollingDown = scrolled > lastScrollY;
      lastScrollY = scrolled;

      if (scrollingDown && scrolled >= triggerScroll && !hasAppeared) {
        // SCROLL DOWN - slow animated grow
        hasAppeared = true;
        setIsButtonVisible(true);
        gsap.killTweensOf(button);
        gsap.killTweensOf(icon);

        // Start from tiny dot
        gsap.set(button, { scale: 0.1, opacity: 1 });
        gsap.set(icon, { opacity: 0, scale: 0.5 });

        // Animate to full size
        gsap.to(button, {
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.4)",
        });

        gsap.to(icon, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.2,
          ease: "power2.out",
        });
      } else if (!scrollingDown && scrolled < triggerScroll) {
        // SCROLL UP - instant shrink based on scroll position
        hasAppeared = false;
        setIsButtonVisible(false);
        gsap.killTweensOf(button);
        gsap.killTweensOf(icon);

        // Map scroll position to scale (0 to triggerScroll -> 0 to 0.1)
        const progress = scrolled / triggerScroll;
        const scale = progress * 0.1;

        gsap.set(button, { scale, opacity: scale > 0 ? 1 : 0 });
        gsap.set(icon, { opacity: 0, scale: 0.5 });
      } else if (
        !scrollingDown &&
        scrolled >= triggerScroll &&
        scrolled < triggerScroll + 90
      ) {
        // SCROLL UP in transition zone - shrink with scroll
        const progress = (scrolled - triggerScroll) / 90;
        const scale = 0.1 + progress * 0.9;
        const iconOpacity = Math.max(0, (progress - 0.3) / 0.7);
        const iconScale = 0.5 + iconOpacity * 0.5;

        gsap.killTweensOf(button);
        gsap.killTweensOf(icon);
        gsap.set(button, { scale, opacity: 1 });
        gsap.set(icon, { opacity: iconOpacity, scale: iconScale });

        if (progress < 0.5) {
          hasAppeared = false;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Magnetic cursor-following effect - moves the button and icon (disabled on mobile)
  useEffect(() => {
    // Skip magnetic effect on mobile/tablet
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    const button = buttonRef.current;
    const icon = iconRef.current;

    if (!wrapper || !button || !icon) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center (magnetic pull toward cursor)
      const deltaX = (e.clientX - centerX) * 0.5;
      const deltaY = (e.clientY - centerY) * 0.5;

      // Limit the movement range
      const maxMove = 12;
      const targetX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const targetY = Math.max(-maxMove, Math.min(maxMove, deltaY));

      // Move the whole button
      gsap.to(button, {
        x: targetX,
        y: targetY,
        duration: 0.4,
        ease: "power3.out",
      });

      // Icon moves more towards cursor (additional movement)
      gsap.to(icon, {
        x: targetX * 0.5,
        y: targetY * 0.5,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      // Button returns smoothly
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      // Icon returns with elastic effect
      gsap.to(icon, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.4)",
      });
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  // Track previous menu state to avoid animation on menu close
  const prevIsMenuOpenRef = useRef(isMenuOpen);

  // Smooth water wave hover animation using ellipse for proper curve
  useEffect(() => {
    const bgOverlay = bgOverlayRef.current;
    if (!bgOverlay) return;

    const wasMenuOpen = prevIsMenuOpenRef.current;
    prevIsMenuOpenRef.current = isMenuOpen;

    // When menu just closed and still hovering, show the hover state
    if (wasMenuOpen && !isMenuOpen && isHovered) {
      gsap.killTweensOf(bgOverlay);
      gsap.set(bgOverlay, { clipPath: "ellipse(70% 100% at 50% 100%)" });
      return;
    }

    // Skip animation if menu just closed and not hovering
    if (wasMenuOpen && !isMenuOpen && !isHovered) {
      gsap.set(bgOverlay, { clipPath: "ellipse(70% 0% at 50% 100%)" });
      return;
    }

    if (isHovered && !isMenuOpen) {
      // Kill any existing animations
      gsap.killTweensOf(bgOverlay);

      // Smooth wave rising from bottom - using ellipse for natural curve
      gsap.fromTo(
        bgOverlay,
        {
          clipPath: "ellipse(70% 0% at 50% 100%)",
        },
        {
          clipPath: "ellipse(70% 100% at 50% 100%)",
          duration: 0.5,
          ease: "power2.out",
        }
      );
    } else if (!isMenuOpen && !isHovered) {
      // Kill any existing animations
      gsap.killTweensOf(bgOverlay);

      // Smooth wave exiting to top - curved exit
      gsap.to(bgOverlay, {
        clipPath: "ellipse(70% 0% at 50% 0%)",
        duration: 0.45,
        ease: "power2.inOut",
      });
    }
  }, [isHovered, isMenuOpen]);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Floating button - appears on scroll (both mobile and desktop) */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="container-app flex justify-end">
          <div
            ref={wrapperRef}
            className={`py-4 cursor-pointer ${
              isButtonVisible || isMenuOpen
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              ref={buttonRef}
              onClick={handleClick}
              className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer will-change-transform"
              style={{
                backgroundColor: isMenuOpen
                  ? "var(--color-blue)"
                  : "var(--color-dark-shade)",
                border: "1px solid rgba(200, 200, 200, 0.35)",
                transform: "scale(0)",
                opacity: 0,
              }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {/* Blue hover background overlay - smooth ellipse animation.
                  rounded-full: clips itself to the circle (the button no
                  longer has overflow-hidden - that combo with border +
                  transform makes Chrome clip the border's corner arcs) */}
              <div
                ref={bgOverlayRef}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  backgroundColor: "var(--color-blue)",
                  clipPath: "ellipse(70% 0% at 50% 100%)",
                  display: isMenuOpen ? "none" : "block",
                }}
              />

              {/* Animated Menu Icon */}
              <div
                ref={iconRef}
                className="relative z-10 will-change-transform"
              >
                <MenuIcon
                  size={23}
                  isOpen={isMenuOpen}
                  color="var(--color-off-white-shade)"
                  immediate={openedExternally}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay - closes menu on click */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/50 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <CurvedNavbar setIsActive={setIsMenuOpen} isMobile={isMobile} />
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
