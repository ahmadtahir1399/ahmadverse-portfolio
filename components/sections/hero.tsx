"use client";

import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { gsap } from "gsap";

// Layout effect on the client (runs BEFORE paint - no splash flash when
// skipping), plain effect during SSR to avoid the server warning
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Intro plays once per browser session: sessionStorage survives reloads
// (even hard refresh), but clears when the tab/browser closes - so
// reopening the site plays the intro again.
const INTRO_SEEN_KEY = "ahmadverse-intro-seen";

const Hero = () => {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const skipIntroRef = useRef(false);

  // Refs for GSAP animations
  const splashScreenRef = useRef<HTMLDivElement>(null);
  const greenScreenRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const isARef = useRef<HTMLDivElement>(null);
  const designPortfolioRef = useRef<HTMLDivElement>(null);
  const yearTextRef = useRef<HTMLSpanElement>(null);

  // Refs for book-opening animation of main title
  const frontendTextRef = useRef<HTMLDivElement>(null);
  const webTextRef = useRef<HTMLSpanElement>(null);
  const developerTextRef = useRef<HTMLSpanElement>(null);
  const mobileFrontendTextRef = useRef<HTMLDivElement>(null);
  const mobileWebTextRef = useRef<HTMLSpanElement>(null);
  const mobileDeveloperTextRef = useRef<HTMLDivElement>(null);

  // Refs for side info text
  const desktopAvailableTextRef = useRef<HTMLDivElement>(null);
  const desktopTimeTextRef = useRef<HTMLDivElement>(null);
  const mobileAvailableTextRef = useRef<HTMLDivElement>(null);
  const mobileTimeTextRef = useRef<HTMLDivElement>(null);

  // Generate refs for each letter
  const ahmadLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tahirLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const aLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const designPortfolioLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    // Already seen this session (reload, or back-navigation to home):
    // drop the splash instantly and leave the hero text visible.
    // Layout effect: this happens before the browser paints, so the
    // splash never flashes on screen when it's being skipped.
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
      skipIntroRef.current = true;
      setShowSplash(false);
      return;
    }

    // Immediately hide all the hero text elements with smooth transformations
    if (frontendTextRef.current)
      gsap.set(frontendTextRef.current, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
      });
    if (webTextRef.current)
      gsap.set(webTextRef.current, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
      });
    if (developerTextRef.current)
      gsap.set(developerTextRef.current, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
      });
    if (mobileFrontendTextRef.current)
      gsap.set(mobileFrontendTextRef.current, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
      });
    if (mobileWebTextRef.current)
      gsap.set(mobileWebTextRef.current, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
      });
    if (mobileDeveloperTextRef.current)
      gsap.set(mobileDeveloperTextRef.current, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
      });

    // Hide side info text
    if (desktopAvailableTextRef.current)
      gsap.set(desktopAvailableTextRef.current, { autoAlpha: 0, x: -30 });
    if (desktopTimeTextRef.current)
      gsap.set(desktopTimeTextRef.current, { autoAlpha: 0, x: -30 });
    if (mobileAvailableTextRef.current)
      gsap.set(mobileAvailableTextRef.current, { autoAlpha: 0, y: 20 });
    if (mobileTimeTextRef.current)
      gsap.set(mobileTimeTextRef.current, { autoAlpha: 0, y: 20 });

    // Handle splash screen timing
    const splashTimer = setTimeout(() => {
      // Start the exit animation
      startExitAnimation();
    }, 1500); // Reduced display time before exit animation

    return () => clearTimeout(splashTimer);
  }, []);

  // Function to handle the exit animation
  const startExitAnimation = () => {
    // Animate "Ahmad" letters
    ahmadLetterRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: -60, // Straight up movement
          opacity: 0,
          duration: 0.6,
          delay: index * 0.03,
          ease: "power2.out", // Smoother animation
        });
      }
    });

    // Animate "Tahir" letters (with a small delay after Ahmad)
    tahirLetterRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: -60, // Straight up movement
          opacity: 0,
          duration: 0.6,
          delay: 0.15 + index * 0.03, // Slightly shorter delay for smoother transition
          ease: "power2.out", // Smoother animation
        });
      }
    });

    // Animate "is" letters
    isLetterRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: -60, // Straight up movement
          opacity: 0,
          duration: 0.6,
          delay: 0.3 + index * 0.03, // Slightly shorter delay
          ease: "power2.out", // Smoother animation
        });
      }
    });

    // Animate "a" letters
    aLetterRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: -60, // Straight up movement
          opacity: 0,
          duration: 0.6,
          delay: 0.35 + index * 0.03, // Slightly shorter delay
          ease: "power2.out", // Smoother animation
        });
      }
    });

    // Animate design portfolio letters - same straight up movement
    designPortfolioLetterRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: -60, // Straight up movement (matching main text animation)
          opacity: 0,
          duration: 0.6,
          delay: index * 0.02, // Faster sequence
          ease: "power2.out", // Smoother animation
        });
      }
    });

    // Animate the year text separately
    if (yearTextRef.current) {
      gsap.to(yearTextRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.6,
        delay: 0.5, // Slightly shorter delay
        ease: "power2.out",
        onComplete: () => {
          // After all text animations are done, start the sheet transitions
          startSheetTransitions();
        },
      });
    }
  };

  // Function to handle the sheet transitions after text animation
  const startSheetTransitions = () => {
    const tl = gsap.timeline();

    // First slide the black screen up with improved easing
    tl.to(splashScreenRef.current, {
      y: "-100%", // Move up completely off screen
      duration: 0.7, // Faster transition
      ease: "power4.inOut", // Smoother, more elegant easing
    });

    // Then reveal green screen (which was positioned under the black screen)
    // Slightly delayed start for a layered effect
    tl.to(
      greenScreenRef.current,
      {
        y: "-100%", // Move up completely off screen
        duration: 0.8, // Smooth duration
        ease: "power4.inOut", // Matching smooth easing
        onStart: () => {
          // Start the book opening animation exactly when green screen starts moving
          startBookOpeningAnimation();
        },
        onComplete: () => {
          // Mark seen only once the intro finished - setting it earlier
          // makes StrictMode's double-run of effects skip the intro in dev
          sessionStorage.setItem(INTRO_SEEN_KEY, "1");
          setShowSplash(false);
        },
      },
      "-=0.6" // Better overlap for seamless layered transition
    );
  };

  // Improved function for book opening animation (bottom to top)
  const startBookOpeningAnimation = () => {
    // Create timeline for desktop animation
    const desktopTl = gsap.timeline({
      defaults: {
        ease: "power2.out", // Consistent easing for smooth animations
      },
    });

    // For desktop version
    if (
      frontendTextRef.current &&
      webTextRef.current &&
      developerTextRef.current
    ) {
      // Animate "Frontend" title
      desktopTl.to(frontendTextRef.current, {
        autoAlpha: 1,
        scaleY: 1,
        duration: 0.9, // Slightly longer for smoother appearance
        ease: "back.out(1.2)", // Add slight bounce effect
      });

      // Animate "WEB" text
      desktopTl.to(
        webTextRef.current,
        {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.9,
          ease: "back.out(1.2)", // Match the bounce effect
        },
        "-=0.6" // Improved overlap timing
      );

      // Animate "Developer" text
      desktopTl.to(
        developerTextRef.current,
        {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.9,
          ease: "back.out(1.2)", // Match the bounce effect
        },
        "-=0.6" // Improved overlap timing
      );

      // Animate desktop side info text after main text animations
      if (desktopAvailableTextRef.current && desktopTimeTextRef.current) {
        desktopTl.to(
          desktopAvailableTextRef.current,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.3" // Start slightly before main animations finish
        );

        desktopTl.to(
          desktopTimeTextRef.current,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5" // Overlap with previous animation
        );
      }
    }

    // Create timeline for mobile animation
    const mobileTl = gsap.timeline({
      defaults: {
        ease: "power2.out", // Consistent easing
      },
    });

    // For mobile version
    if (
      mobileFrontendTextRef.current &&
      mobileWebTextRef.current &&
      mobileDeveloperTextRef.current
    ) {
      // Animate "Frontend" title
      mobileTl.to(mobileFrontendTextRef.current, {
        autoAlpha: 1,
        scaleY: 1,
        duration: 0.9,
        ease: "back.out(1.2)", // Add slight bounce effect
      });

      // Animate "WEB" text
      mobileTl.to(
        mobileWebTextRef.current,
        {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.9,
          ease: "back.out(1.2)", // Match the bounce effect
        },
        "-=0.6" // Improved overlap timing
      );

      // Animate "Developer" text
      mobileTl.to(
        mobileDeveloperTextRef.current,
        {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.9,
          ease: "back.out(1.2)", // Match the bounce effect
        },
        "-=0.6" // Improved overlap timing
      );

      // Animate mobile side info text
      if (mobileAvailableTextRef.current && mobileTimeTextRef.current) {
        mobileTl.to(
          [mobileAvailableTextRef.current, mobileTimeTextRef.current],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15, // Add slight stagger between the two elements
            ease: "power2.out",
          },
          "-=0.2" // Start slightly before main animations finish
        );
      }
    }
  };

  // GSAP Animation for the splash screen entrance
  useEffect(() => {
    if (skipIntroRef.current) return;
    if (
      showSplash &&
      splashScreenRef.current &&
      firstNameRef.current &&
      lastNameRef.current &&
      isARef.current
    ) {
      // Initial setup - position elements
      gsap.set(firstNameRef.current, { opacity: 1 });
      gsap.set(lastNameRef.current, { opacity: 1 });

      // Position "is a" completely off screen to the right with opacity 0
      // This ensures it's not visible at all until animation begins
      gsap.set(isARef.current, {
        opacity: 0,
        x: window.innerWidth, // Position completely off screen to the right
      });

      // Create animation timeline
      const tl = gsap.timeline({
        delay: 0.3, // Slightly shorter delay for better timing
      });

      // Animate "is a" sliding in from right to left
      tl.to(isARef.current, {
        opacity: 1,
        x: 0,
        duration: 1.7, // Slightly longer for smoother motion
        ease: "power3.out", // Smoother deceleration
      });
    }
  }, [showSplash]);

  useEffect(() => {
    const updateTime = () => {
      // Pakistan is UTC+5, calculate the time directly
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pakistanTime = new Date(utc + 3600000 * 5); // UTC+5 for Pakistan

      const hours = pakistanTime.getHours().toString().padStart(2, "0");
      const minutes = pakistanTime.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    setIsLoading(false);
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // If splash screen is showing, apply styling to prevent scrolling
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up on unmount
    };
  }, [showSplash]);

  // Helper function to create letter spans with refs
  const createLetterSpans = (
    text: string,
    refsArray: React.MutableRefObject<(HTMLSpanElement | null)[]>
  ) => {
    return text.split("").map((letter: string, index: number) => {
      const isSpace = letter === " ";
      return (
        <span
          key={index}
          ref={(el) => {
            if (!isSpace && el) refsArray.current[index] = el;
          }}
          className={isSpace ? "inline-block mx-1" : "inline-block"}
        >
          {letter}
        </span>
      );
    });
  };

  return (
    <>
      {/* Splash Screen and Transition Layers */}
      {showSplash && (
        <>
          {/* Black splash screen layer (top layer) */}
          <div
            ref={splashScreenRef}
            className="fixed inset-0 bg-black z-80 flex items-center justify-center"
            style={{ transform: "translateY(0)" }}
          >
            <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto text-center relative">
              {/* Top text */}
              <div className="absolute -top-25 sm:-top-37.5 md:-top-45 lg:-top-50 left-0 right-0 text-white text-[10px] sm:text-[11px] md:text-[12px] font-[350]">
                <div ref={designPortfolioRef}>
                  {createLetterSpans(
                    "DESIGN PORTFOLIO ",
                    designPortfolioLetterRefs
                  )}{" "}
                  <br />
                  <span ref={yearTextRef}>©{new Date().getFullYear()}</span>
                </div>
              </div>

              {/* Main text animation - all on one line */}
              <div className="flex items-center justify-center text-white overflow-x-hidden">
                <div
                  ref={firstNameRef}
                  className="font-[450] text-[1.8rem] xs:text-[2.2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[5.5rem]"
                >
                  {createLetterSpans("Ahmad", ahmadLetterRefs)}
                </div>
                <div
                  ref={lastNameRef}
                  className="text-blue luxurious-roman-semibold-italic font-[350] ml-1 xs:ml-2 sm:ml-3 md:ml-4 text-[1.8rem] xs:text-[2.2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[5.5rem]"
                >
                  {createLetterSpans("Tahir", tahirLetterRefs)}
                </div>
                <div
                  ref={isARef}
                  className="text-white tracking-wide ml-2.5 xs:ml-[15px] sm:ml-6.25 md:ml-8.75 lg:ml-10.5 overflow-hidden whitespace-nowrap opacity-0"
                  style={{ transform: "translateX(100vw)" }}
                >
                  <span className="inline-block text-[1.8rem] xs:text-[2.2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[5.5rem]">
                    {createLetterSpans("is", isLetterRefs)}
                  </span>
                  <span className="inline-block mx-2.5 xs:mx-[15px] sm:mx-5 md:mx-6.25 lg:mx-7.5 text-[1.8rem] xs:text-[2.2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[5.5rem]">
                    {createLetterSpans("a", aLetterRefs)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Green transition layer (positioned under black layer) */}
          <div
            ref={greenScreenRef}
            className="fixed inset-0 bg-blue z-79"
            style={{ transform: "translateY(0)" }}
          ></div>
        </>
      )}
      {/* Your existing Hero content */}
      {/* Fills the first screen: 100svh minus everything above it - the page
          wrapper's 80px pt-20 plus the navbar, which is 81px on mobile (the
          Menu button makes it taller) and 65px from md up. svh, not vh, so
          mobile browser chrome collapsing doesn't make the hero jump. */}
      <div className="container-app relative flex min-h-[calc(100svh-161px)] flex-col justify-center md:min-h-[calc(100svh-145px)]">
        {/* Single real H1 for the page. The two big animated headlines
            below are desktop/mobile duplicates of the same words, so they
            are aria-hidden presentation copies - this keeps exactly one H1
            (with the name + role keyword) for search engines and screen
            readers without touching the GSAP animations. */}
        <h1 className="sr-only">
          Ahmad Tahir - Full Stack Web Developer
        </h1>
        {/* Side info - positioned to vertically center with the main heading - only on md and lg screens */}
        {/* Was top-[23.333%], a percentage hand-tuned to the old content-sized
            box - it drifts the moment the hero height changes. Now centred,
            which is what it was always meant to line up with. */}
        <div className="absolute hidden md:flex top-1/2 right-16 space-x-8 md:space-x-12 lg:space-x-16 transform -translate-y-1/2">
          <div
            ref={desktopAvailableTextRef}
            className="text-black-shade text-[9px] md:text-[10px] lg:text-[11px] font-[450] tracking-wide"
          >
            CURRENTLY AVAILABLE{" "}
            <span className="italic luxurious-roman-medium-italic text-blue">
              FOR
            </span>
            <br />
            FREELANCE WORLDWIDE
          </div>
          <div
            ref={desktopTimeTextRef}
            className="text-black-shade text-[9px] md:text-[10px] lg:text-[11px] font-[450] tracking-wide"
          >
            MY LOCAL TIME {currentTime}
            <br />
            GMT (+5:00)
          </div>
        </div>

        {/* Desktop/Laptop/Medium version */}
        <div className="hidden md:block md:pt-16 lg:pt-20">
          <div aria-hidden="true" className="font-normal text-grey-shade tracking-tight">
            <div
              ref={frontendTextRef}
              className="text-[5rem] md:text-[6.5rem] lg:text-[9.5rem] font-[450] leading-[0.85]"
            >
              Full-stack
            </div>
            <div className="flex items-baseline mt-0 ml-10 md:ml-15 lg:ml-20">
              <span
                ref={webTextRef}
                className="luxurious-roman-medium-italic  text-[5rem] md:text-[6.5rem] lg:text-[9.5rem] text-blue font-[450] italic leading-none"
              >
                WEB
              </span>
              <span
                ref={developerTextRef}
                className="text-[10rem] md:text-[6.5rem] lg:text-[9.5rem] font-[450] text-grey-shade ml-3 md:ml-5 lg:ml-8"
              >
                Developer
              </span>
            </div>
          </div>
        </div>

        {/* Mobile version (small screens only) */}
        <div className="flex justify-center items-center md:hidden">
          <div className="md:hidden text-start px-4 pt-10">
            <div aria-hidden="true" className="font-normal text-grey-shade tracking-tight">
              <div
                ref={mobileFrontendTextRef}
                className="mobile-title-text text-[6rem] font-[450] leading-[0.9]"
              >
                Full-stack
              </div>
              <div className="mobile-subtitle-wrapper flex justify-end items-center mt-3">
                <span className="mobile-subtitle-line inline-block h-1.25 w-22.5 bg-blue mr-3"></span>
                <span
                  ref={mobileWebTextRef}
                  className="mobile-subtitle-text luxurious-roman-medium-italic text-[5rem] text-blue font-[450] italic leading-none"
                >
                  WEB
                </span>
              </div>
              <div
                ref={mobileDeveloperTextRef}
                className="mobile-developer-text text-[6rem] font-[450] leading-26.5"
              >
                Developer
              </div>
            </div>
          </div>
        </div>

        {/* Mobile version of the side info - at the bottom (small screens only) */}
        <div className="md:hidden flex justify-between mt-16 px-4">
          <div
            ref={mobileAvailableTextRef}
            className="mobile-available-text text-[11px] font-[450] tracking-wide text-black-shade"
          >
            CURRENTLY AVAILABLE{" "}
            <span className="italic luxurious-roman-medium-italic text-blue">
              FOR
            </span>
            <br />
            FREELANCE WORLDWIDE
          </div>
          <div
            ref={mobileTimeTextRef}
            className="mobile-time-text text-[11px] font-[450] tracking-wide text-black-shade"
          >
            MY LOCAL TIME {currentTime}
            <br />
            GMT (+5:00)
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
