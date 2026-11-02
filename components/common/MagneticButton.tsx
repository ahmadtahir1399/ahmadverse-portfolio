"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ---------- Types ---------- */

type ButtonVariant = "outline" | "filled" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface MagneticButtonProps {
  children: React.ReactNode;
  /** Additional class names for the wrapper */
  className?: string;
  /** Additional class names for the button */
  buttonClassName?: string;
  /** Button variant style */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Click handler */
  onClick?: () => void;
  /** Link href - renders as anchor if provided */
  href?: string;
  /** Open link in new tab */
  openInNewTab?: boolean;
  /** Disable magnetic effect */
  disableMagnetic?: boolean;
  /** Disable hover animation */
  disableHoverAnimation?: boolean;
  /** Custom background color */
  bgColor?: string;
  /** Custom hover background color */
  hoverBgColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom hover text color */
  hoverTextColor?: string;
  /** Custom border color */
  borderColor?: string;
  /** Custom border radius (e.g., "full", "lg", "md", "none") */
  rounded?: "full" | "lg" | "md" | "sm" | "none";
  /** Magnetic pull strength (0-1) */
  magneticStrength?: number;
  /** Maximum magnetic movement in pixels */
  magneticMaxMove?: number;
  /** Superscript text (e.g., count badge) */
  superscript?: string | number;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon to display before text */
  iconBefore?: React.ReactNode;
  /** Icon to display after text */
  iconAfter?: React.ReactNode;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Custom width (e.g., "200px", "auto") */
  width?: string;
  /** Custom height (e.g., "50px", "auto") */
  height?: string;
  /** Wave overlay border radius (e.g., "50% / 20%") */
  waveRounded?: string;
  /** Wave overlay vertical extension percentage (default: 20) */
  waveExtend?: number;
}

/* ---------- Size Presets ---------- */

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const ROUNDED_CLASSES: Record<string, string> = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded-sm",
  none: "rounded-none",
};

/* ---------- Component ---------- */

const MagneticButton = ({
  children,
  className = "",
  buttonClassName = "",
  variant = "outline",
  size = "md",
  onClick,
  href,
  openInNewTab = false,
  disableMagnetic = false,
  disableHoverAnimation = false,
  bgColor,
  hoverBgColor = "var(--color-grey-shade)",
  textColor,
  hoverTextColor,
  borderColor = "var(--color-grey-shade)",
  rounded = "full",
  magneticStrength = 0.35,
  magneticMaxMove = 6,
  superscript,
  disabled = false,
  fullWidth = false,
  iconBefore,
  iconAfter,
  ariaLabel,
  width,
  height,
  waveRounded = "50% / 20%",
  waveExtend = 20,
}: MagneticButtonProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Magnetic cursor-following effect
  useEffect(() => {
    if (isMobile || disableMagnetic || disabled) return;

    const wrapper = wrapperRef.current;
    const button = buttonRef.current;
    const text = textRef.current;

    if (!wrapper || !button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * magneticStrength;
      const deltaY = (e.clientY - centerY) * magneticStrength;

      const targetX = Math.max(
        -magneticMaxMove,
        Math.min(magneticMaxMove, deltaX)
      );
      const targetY = Math.max(
        -magneticMaxMove,
        Math.min(magneticMaxMove, deltaY)
      );

      gsap.to(button, {
        x: targetX,
        y: targetY,
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.to(text, {
        x: targetX * 0.5,
        y: targetY * 0.5,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to(text, {
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
  }, [isMobile, disableMagnetic, disabled, magneticStrength, magneticMaxMove]);

  // Water wave hover animation with curved top and bottom edges
  useEffect(() => {
    if (disableHoverAnimation || disabled) return;

    const bgOverlay = bgOverlayRef.current;
    if (!bgOverlay) return;

    if (isHovered) {
      gsap.killTweensOf(bgOverlay);
      // Wave rising from bottom - curved top edge, starts below button
      gsap.fromTo(
        bgOverlay,
        { y: "100%" },
        {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        }
      );
    } else {
      gsap.killTweensOf(bgOverlay);
      // Wave exiting to top - curved bottom edge visible as it leaves
      gsap.to(bgOverlay, {
        y: "-100%",
        duration: 0.45,
        ease: "power2.inOut",
      });
    }
  }, [isHovered, disableHoverAnimation, disabled]);

  // Compute styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "filled":
        return {
          backgroundColor: bgColor || "var(--color-black-shade)",
          border: "none",
          color: textColor || "var(--color-off-white-shade)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          border: "none",
          color: textColor || "var(--color-black-shade)",
        };
      case "outline":
      default:
        return {
          backgroundColor: bgColor || "transparent",
          border: `1px solid ${borderColor}`,
          color: textColor || "var(--color-black-shade)",
        };
    }
  };

  const variantStyles = {
    ...getVariantStyles(),
    ...(width && { width }),
    ...(height && { height }),
  };

  const buttonClasses = `
    relative cursor-pointer will-change-transform
    flex items-center justify-center gap-2
    transition-colors duration-300
    ${SIZE_CLASSES[size]}
    ${ROUNDED_CLASSES[rounded]}
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${buttonClassName}
  `.trim();

  const content = (
    <>
      {/* Hover background overlay - has curved top and bottom.
          Clipped by its own borderless container: putting overflow-hidden on
          the bordered, transformed button makes Chrome clip the border's
          corner arcs. */}
      {!disableHoverAnimation && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div
            ref={bgOverlayRef}
            className="absolute inset-x-0"
            style={{
              backgroundColor: hoverBgColor,
              top: `-${waveExtend}%`,
              bottom: `-${waveExtend}%`,
              borderRadius: waveRounded,
              transform: "translateY(100%)",
            }}
          />
        </div>
      )}

      {/* Content wrapper */}
      <span
        ref={textRef}
        className="relative z-10 flex items-center will-change-transform"
        style={{
          color: isHovered && hoverTextColor ? hoverTextColor : "inherit",
        }}
      >
        {iconBefore}
        {children}
        {superscript !== undefined && (
          <sup className="text-[0.65em] ml-0.5 -top-[0.5em] relative opacity-70">
            {superscript}
          </sup>
        )}
        {iconAfter}
      </span>
    </>
  );

  const commonProps = {
    className: buttonClasses,
    style: variantStyles,
    "aria-label": ariaLabel,
    "aria-disabled": disabled,
  };

  return (
    <div
      ref={wrapperRef}
      className={`inline-block cursor-pointer ${fullWidth ? "w-full" : ""} ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {href ? (
        <a
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          {...commonProps}
        >
          {content}
        </a>
      ) : (
        <button
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          type="button"
          {...commonProps}
        >
          {content}
        </button>
      )}
    </div>
  );
};

export default MagneticButton;
