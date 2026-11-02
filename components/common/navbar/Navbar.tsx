"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { IconCopyright } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePageTransition } from "@/components/common/PageTransition";
import { isDarkRoute } from "@/lib/routeTheme";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const nameRef = useRef<HTMLAnchorElement>(null);
  const nameInnerRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLSpanElement>(null);
  const weberRef = useRef<HTMLSpanElement>(null);
  const ahmadRef = useRef<HTMLSpanElement>(null);
  const tahirRef = useRef<HTMLSpanElement>(null);
  const navLinksRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { navigateWithTransition } = usePageTransition();
  const pathname = usePathname();

  const navItems = [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Dark routes flip the nav to light type so it reads on the dark surface
  const textClass = isDarkRoute(pathname)
    ? "text-off-white-shade"
    : "text-black-shade";

  // Track if name animation is in "expanded" state (for mobile tap toggle)
  const isNameExpandedRef = useRef(false);

  // Name hover animation - weber exits left, ahmad moves to position 1, tahir enters from right
  // On desktop: hover to trigger, on mobile: tap to toggle
  useEffect(() => {
    const nameEl = nameRef.current;
    const copyright = copyrightRef.current;
    const weber = weberRef.current;
    const ahmad = ahmadRef.current;
    const tahir = tahirRef.current;

    if (!nameEl || !copyright || !weber || !ahmad || !tahir) return;

    // Get weber width for ahmad movement
    const weberWidth = weber.offsetWidth + 4; // +4 for margin

    // Set initial state only once
    gsap.set(tahir, { opacity: 0 });
    gsap.set(weber, { opacity: 1 });
    gsap.set(ahmad, { x: 0 });

    const animateToExpanded = () => {
      // Kill any running animations first
      gsap.killTweensOf([copyright, weber, ahmad, tahir]);

      // Spin the © symbol 360°
      gsap.to(copyright, {
        rotation: 360,
        duration: 0.8,
        ease: "power3.inOut",
      });

      // weber fades out to left
      gsap.to(weber, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: "power3.inOut",
      });

      // ahmad moves left to take weber's position
      gsap.to(ahmad, {
        x: -weberWidth,
        duration: 0.5,
        ease: "power3.inOut",
      });

      // tahir moves left with ahmad and fades in
      gsap.to(tahir, {
        x: -weberWidth,
        opacity: 1,
        duration: 0.5,
        ease: "power3.inOut",
      });
    };

    const animateToCollapsed = () => {
      // Kill any running animations first
      gsap.killTweensOf([copyright, weber, ahmad, tahir]);

      // Spin back
      gsap.to(copyright, {
        rotation: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });

      // tahir moves back right and fades out
      gsap.to(tahir, {
        x: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // ahmad moves back to original position
      gsap.to(ahmad, {
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // weber fades back in
      gsap.to(weber, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    // Mobile: use click/tap to toggle
    const handleClick = (e: MouseEvent) => {
      if (!isMobile) return;
      e.preventDefault();

      if (isNameExpandedRef.current) {
        animateToCollapsed();
        isNameExpandedRef.current = false;
      } else {
        animateToExpanded();
        isNameExpandedRef.current = true;
      }
    };

    // Desktop: use hover
    const handleMouseEnter = () => {
      if (isMobile) return;
      animateToExpanded();
    };

    const handleMouseLeave = () => {
      if (isMobile) return;
      animateToCollapsed();
    };

    nameEl.addEventListener("click", handleClick);
    nameEl.addEventListener("mouseenter", handleMouseEnter);
    nameEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nameEl.removeEventListener("click", handleClick);
      nameEl.removeEventListener("mouseenter", handleMouseEnter);
      nameEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  // Cursor follow effect for name (left side) - smooth magnetic pull with GSAP (disabled on mobile)
  useEffect(() => {
    // Skip magnetic effect on mobile/tablet
    if (isMobile) return;

    const nameEl = nameRef.current;
    const nameInner = nameInnerRef.current;

    if (!nameEl || !nameInner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nameEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 55% magnetic pull toward cursor
      const deltaX = (e.clientX - centerX) * 0.55;
      const deltaY = (e.clientY - centerY) * 0.55;

      const maxMove = 20;
      const targetX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const targetY = Math.max(-maxMove, Math.min(maxMove, deltaY));

      gsap.to(nameInner, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(nameInner, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    nameEl.addEventListener("mousemove", handleMouseMove);
    nameEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nameEl.removeEventListener("mousemove", handleMouseMove);
      nameEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  // Cursor follow effect for nav links - smooth magnetic pull with GSAP (disabled on mobile)
  useEffect(() => {
    // Skip magnetic effect on mobile/tablet
    if (isMobile) return;

    const links = navLinksRef.current.filter(Boolean) as HTMLDivElement[];

    const handleMouseMove = (
      e: MouseEvent,
      link: HTMLDivElement,
      index: number
    ) => {
      const rect = link.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 55% magnetic pull toward cursor
      const deltaX = (e.clientX - centerX) * 0.55;
      const deltaY = (e.clientY - centerY) * 0.55;

      const maxMove = 20;
      const targetX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const targetY = Math.max(-maxMove, Math.min(maxMove, deltaY));

      const innerText = link.querySelector("a");
      if (innerText) {
        gsap.to(innerText, {
          x: targetX,
          y: targetY,
          duration: 0.6,
          ease: "power3.out",
        });
      }

      setActiveLink(index);
    };

    const handleMouseLeave = (link: HTMLDivElement) => {
      setActiveLink(null);

      // Smooth slow return to center
      const innerText = link.querySelector("a");
      if (innerText) {
        gsap.to(innerText, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    };

    const listeners: {
      link: HTMLDivElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }[] = [];

    links.forEach((link, index) => {
      const moveHandler = (e: MouseEvent) => handleMouseMove(e, link, index);
      const leaveHandler = () => handleMouseLeave(link);

      link.addEventListener("mousemove", moveHandler);
      link.addEventListener("mouseleave", leaveHandler);

      listeners.push({ link, move: moveHandler, leave: leaveHandler });
    });

    return () => {
      listeners.forEach(({ link, move, leave }) => {
        link.removeEventListener("mousemove", move);
        link.removeEventListener("mouseleave", leave);
      });
    };
  }, [isMobile]);

  return (
    <nav className="relative z-50 flex items-center justify-between container-app py-6">
      {/* Left side - Name with hover effect */}
      <a
        href="/"
        ref={nameRef}
        onClick={(e) => {
          // Mobile taps toggle the name animation (handled elsewhere);
          // desktop clicks go home through the curtain transition
          if (!isMobile) {
            e.preventDefault();
            navigateWithTransition("/", "Home");
          }
        }}
        className="relative flex items-center h-6 cursor-pointer py-6 px-4 -my-6 -mx-4"
      >
        <div
          ref={nameInnerRef}
          className="flex items-center gap-2 will-change-transform"
        >
          {/* © symbol that spins */}
          <span
            ref={copyrightRef}
            className={`inline-block text-sm font-[350] ${textClass} tracking-wide`}
          >
            <IconCopyright stroke={1} />
          </span>

          {/* Text: weber ahmad -> ahmad tahir */}
          <div
            className={`flex items-center h-6 text-sm font-[350] ${textClass} tracking-wide whitespace-nowrap`}
          >
            {/* weber - fades out on hover */}
            <span ref={weberRef} className="inline-block">
              Weber&nbsp;
            </span>
            {/* ahmad - moves left on hover */}
            <span ref={ahmadRef} className="inline-block">
              Ahmad&nbsp;
            </span>
            {/* tahir - fades in on hover */}
            <span ref={tahirRef} className="inline-block opacity-0">
              Tahir
            </span>
          </div>
        </div>
      </a>

      {/* Right side - Navigation links (desktop) */}
      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item, index) => (
          <div
            key={item.label}
            ref={(el) => {
              navLinksRef.current[index] = el;
            }}
            className="relative px-3 py-3 -my-3 cursor-pointer"
          >
            <a
              href={item.href}
              onClick={(e) => {
                // Route links go through the curtain transition; hash links scroll
                if (item.href.startsWith("/")) {
                  e.preventDefault();
                  navigateWithTransition(item.href, item.label);
                }
              }}
              className={`relative flex flex-col items-center text-sm font-[350] ${textClass} tracking-wide`}
            >
              <span>{item.label}</span>
              {/* Dot indicator: shown on hover and kept on for the page
                  the user is currently on */}
              <span
                className={`absolute -bottom-2 w-1 h-1 rounded-full bg-blue transition-all duration-300 z-50 ${
                  activeLink === index || pathname === item.href
                    ? "opacity-100 scale-100 "
                    : "opacity-0 scale-0"
                }`}
              />
            </a>
          </div>
        ))}
      </div>

      {/* Right side - Menu button (mobile) */}
      {onMenuClick && (
        <button
          type="button"
          onClick={() => {
            onMenuClick();
          }}
          className={`md:hidden flex items-center gap-2 text-sm font-[350] ${textClass} tracking-wide cursor-pointer py-2`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue" />
          <span>Menu</span>
        </button>
      )}

    </nav>
  );
};

export default Navbar;
