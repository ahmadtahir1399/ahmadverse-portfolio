"use client";

import React, { useRef, useEffect } from "react";
import { TextAnimate } from "@/components/ui/text-animate";
import MagneticBall from "@/components/common/MagneticBall";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SPACING } from "@/constants/spacing";

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
  const ballContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ballContainer = ballContainerRef.current;
    const section = sectionRef.current;

    if (!ballContainer || !section) return;

    // Initial translateY - 150px for mobile/tablet, 200px for desktop
    // Using transform instead of margin so it doesn't affect content below
    const initialY = isMobile ? 150 : 200;
    gsap.set(ballContainer, { y: initialY });

    const scrollTrigger = gsap.to(ballContainer, {
      y: 30,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 80%", // Start when section top hits 80% of viewport
        end: "top 20%", // End when section top hits 20% of viewport
        scrub: 1.5, // Smooth scrubbing with 1 second delay
      },
    });

    return () => {
      scrollTrigger.scrollTrigger?.kill();
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className={`${SPACING.container} mt-20 text-black-shade md:mt-30 lg:mt-45`}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-0">
        {/* Left side - Main statement */}
        <div className="w-full lg:w-[65%] px-4 md:px-0">
          <TextAnimate
            animation="slideUp"
            by="word"
            as="h2"
            className="text-lg sm:text-xl md:text-2xl lg:text-[1.8rem] leading-relaxed md:leading-normal font-[450] tracking-tight"
          >
            Helping brands to stand out in the digital era. Together we will set
            the new status quo. No nonsense, always on the cutting edge.
          </TextAnimate>
        </div>

        {/* Right side - Description + Ball */}
        <div className="w-full lg:w-[27%] lg:pt-2 flex flex-col px-4 md:px-0">
          <p className="text-sm md:text-[15px] lg:text-[16px] leading-[1.7] text-grey-shade">
            The combination of my passion for design, code & interaction
            positions me in a unique place in the web design world.
          </p>

          {/* About me ball - scroll-animated wrapper */}
          <div
            ref={ballContainerRef}
            className="flex justify-end lg:justify-start mt-6 lg:mt-0 -mr-4 md:-mr-6 lg:-ml-6"
          >
            {/* Inner div prevents scroll animation from conflicting with magnetic effect */}
            <div>
              <MagneticBall
                text="About me"
                size={160}
                bgColor="var(--color-black-shade)"
                hoverBgColor="var(--color-blue)"
                textColor="var(--color-off-white-shade)"
                fontSize="1rem"
                fontWeight="400"
                href="#about"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
