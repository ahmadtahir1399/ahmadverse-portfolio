"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

interface MagneticBallProps {
  text?: string;
  children?: React.ReactNode;
  size?: number | string;
  bgColor?: string;
  hoverBgColor?: string;
  /** Optional colour cycle played on loop while hovered. Pass a stable
      (module-level) array - a new array each render restarts the loop. */
  hoverColors?: string[];
  textColor?: string;
  hoverTextColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  disableMagneticOnMobile?: boolean;
  href?: string;
  target?: string;
  fontSize?: string;
  fontWeight?: string;
}

const MagneticBall = ({
  text,
  children,
  size = 150,
  bgColor = "var(--color-black-shade)",
  hoverBgColor = "var(--color-blue)",
  hoverColors,
  textColor = "var(--color-off-white-shade)",
  hoverTextColor,
  className = "",
  style = {},
  onClick,
  onHover,
  disableMagneticOnMobile = true,
  href,
  target = "_self",
  fontSize = "1rem",
  fontWeight = "400",
}: MagneticBallProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const shouldDisableMagnetic = disableMagneticOnMobile && isMobile;
  const sizeNum = typeof size === "number" ? size : parseInt(size);

  // Magnetic cursor-following effect
  useEffect(() => {
    if (shouldDisableMagnetic) return;

    const wrapper = wrapperRef.current;
    const ball = ballRef.current;
    const content = contentRef.current;

    if (!wrapper || !ball) return;

    let isActivated = false; // Only activate when cursor enters the ball
    const ballRadius = sizeNum / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center
      const rawDeltaX = e.clientX - centerX;
      const rawDeltaY = e.clientY - centerY;
      const distance = Math.sqrt(rawDeltaX * rawDeltaX + rawDeltaY * rawDeltaY);

      // Activate only when cursor enters the ball area
      if (!isActivated && distance <= ballRadius) {
        isActivated = true;
        setIsHovered(true);
        onHover?.(true);
      }

      // Only move if activated
      if (!isActivated) return;

      // Calculate offset from center (magnetic pull toward cursor)
      const deltaX = rawDeltaX * 0.4;
      const deltaY = rawDeltaY * 0.4;

      // Movement range
      const maxMoveX = 30;
      const maxMoveY = 18;
      const targetX = Math.max(-maxMoveX, Math.min(maxMoveX, deltaX));
      const targetY = Math.max(-maxMoveY, Math.min(maxMoveY, deltaY));

      // Move the whole ball
      gsap.to(ball, {
        x: targetX,
        y: targetY,
        duration: 0.4,
        ease: "power3.out",
      });

      // Content follows cursor with additional movement
      if (content) {
        gsap.to(content, {
          x: targetX * 0.3,
          y: targetY * 0.3,
          duration: 0.3,
          ease: "power3.out",
        });
      }
    };

    const handleMouseLeave = () => {
      isActivated = false;
      setIsHovered(false);
      onHover?.(false);

      // Ball returns with slight bounce
      gsap.to(ball, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1.1, 0.5)",
      });

      // Content returns with smaller bounce
      if (content) {
        gsap.to(content, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.05, 0.6)",
        });
      }
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldDisableMagnetic, sizeNum, onHover]);

  // Hover background animation - smooth ellipse wave like HamburgerMenu
  useEffect(() => {
    const bgOverlay = bgOverlayRef.current;
    if (!bgOverlay) return;

    if (isHovered) {
      gsap.killTweensOf(bgOverlay, "clipPath");
      gsap.fromTo(
        bgOverlay,
        { clipPath: "ellipse(70% 0% at 50% 100%)" },
        {
          clipPath: "ellipse(70% 100% at 50% 100%)",
          duration: 0.5,
          ease: "power2.out",
        }
      );
    } else {
      gsap.killTweensOf(bgOverlay, "clipPath");
      gsap.to(bgOverlay, {
        clipPath: "ellipse(70% 0% at 50% 0%)",
        duration: 0.45,
        ease: "power2.inOut",
      });
    }
  }, [isHovered]);

  // Optional rainbow cycle: while hovered the revealed overlay eases from one
  // colour to the next on a seamless loop, then settles back on unhover.
  // Scoped to "backgroundColor" so it never fights the clipPath reveal above.
  useEffect(() => {
    const bgOverlay = bgOverlayRef.current;
    if (!bgOverlay || !hoverColors || hoverColors.length === 0) return;

    gsap.killTweensOf(bgOverlay, "backgroundColor");

    if (!isHovered) {
      gsap.to(bgOverlay, {
        backgroundColor: hoverBgColor,
        duration: 0.4,
        ease: "sine.out",
      });
      return;
    }

    gsap.set(bgOverlay, { backgroundColor: hoverColors[0] });

    // ...and back to the first colour so the loop has no visible seam
    const cycle = [...hoverColors.slice(1), hoverColors[0]];
    const tl = gsap.timeline({ repeat: -1 });
    cycle.forEach((color) => {
      tl.to(bgOverlay, {
        backgroundColor: color,
        duration: 0.55,
        ease: "sine.inOut",
      });
    });

    return () => {
      tl.kill();
    };
  }, [isHovered, hoverColors, hoverBgColor]);

  const handleClick = useCallback(() => {
    if (href) {
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
    onClick?.();
  }, [href, target, onClick]);

  const sizeValue = typeof size === "number" ? `${size}px` : size;
  // Wrapper is larger to give more hover area
  const wrapperSize = sizeNum + 60;

  return (
    <div
      ref={wrapperRef}
      className={`cursor-pointer flex items-center justify-center ${className}`}
      style={{
        width: `${wrapperSize}px`,
        height: `${wrapperSize}px`,
        ...style,
      }}
    >
      <button
        ref={ballRef}
        onClick={handleClick}
        className="relative rounded-full flex items-center justify-center overflow-hidden will-change-transform cursor-pointer"
        style={{
          width: sizeValue,
          height: sizeValue,
          backgroundColor: bgColor,
        }}
      >
        {/* Hover background overlay */}
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: hoverBgColor,
            clipPath: "ellipse(70% 0% at 50% 100%)",
          }}
        />

        {/* Content */}
        <div
          ref={contentRef}
          className="relative z-10 will-change-transform"
          style={{
            // hoverTextColor must win while hovered, otherwise a light
            // hoverBgColor renders light text invisible against it
            color: isHovered && hoverTextColor ? hoverTextColor : textColor,
            fontSize,
            fontWeight,
            transition: "color 0.3s ease",
          }}
        >
          {children || text}
        </div>
      </button>
    </div>
  );
};

export default MagneticBall;
