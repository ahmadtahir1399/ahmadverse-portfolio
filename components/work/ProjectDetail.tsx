"use client";

import { useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { Project } from "@/data/projects";
import { getNextProject } from "@/data/projects";
import { SPACING } from "@/constants/spacing";
import { useIsMobile } from "@/hooks/useIsMobile";
import MagneticBall from "@/components/common/MagneticBall";
import NextCase from "@/components/work/NextCase";

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailProps {
  project: Project;
}

/* Small label / divider / value cell used across the page. */
const Fact = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-[11px] font-[450] uppercase tracking-[0.14em] text-grey-shade/45">
      {label}
    </span>
    <div className="mt-4 h-px w-full bg-grey-shade/15" />
    <p className="mt-5 text-base text-black-shade md:text-lg">{value}</p>
  </div>
);

/* Uppercase micro-label reused across the rich sections. */
const Label = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-[450] uppercase tracking-[0.14em] text-grey-shade/45">
    {children}
  </span>
);

/* Shared section heading - same size/weight as "About the project". */
const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2
    data-reveal
    className="text-4xl font-[450] leading-[1.0] tracking-tight text-grey-shade sm:text-5xl md:text-6xl"
  >
    {children}
  </h2>
);

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ballWrapRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const hasLiveSite = Boolean(project.url && project.url !== "#");
  const heroImage = project.images[0] ?? project.cover;
  const heroAlt = project.imageAlts[0] ?? project.coverAlt;
  const galleryImages = project.images.slice(1);
  const galleryAlts = project.imageAlts.slice(1);
  const next = getNextProject(project.slug);

  const heroColumns = [
    { label: "Role / Services", value: project.category },
    { label: "Industry", value: project.industry },
    {
      label: "Location & Year",
      value: `${project.location} © ${project.year}`,
    },
  ];
  const facts = [
    { label: "Platform", value: project.platform },
    { label: "Project length", value: project.projectLength },
    { label: "Live since", value: project.since },
  ];

  /* Reveal each section on scroll - same motion language as the home page. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  /* Live-site ball parallax: drifts up a little as you scroll down (and
     back down as you scroll up), triggered while the hero is in view. */
  useEffect(() => {
    const ball = ballWrapRef.current;
    const hero = heroRef.current;
    if (!ball || !hero) return;

    const tween = gsap.fromTo(
      ball,
      { y: 0 },
      {
        y: isMobile ? -48 : -80,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobile]);

  return (
    <article ref={rootRef} className="pt-24 md:pt-28">
      {/* ---------- Title (main heading) ---------- */}
      <div className={SPACING.container}>
        <h1 className="text-6xl font-[450] leading-[0.9] tracking-tight text-grey-shade sm:text-7xl lg:text-8xl">
          {project.title}
        </h1>
      </div>

      {/* ---------- Hero columns ---------- */}
      <div className={`${SPACING.container} mt-14 md:mt-24`}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-10 md:gap-16">
          {heroColumns.map((c) => (
            <Fact key={c.label} label={c.label} value={c.value} />
          ))}
        </div>
      </div>

      {/* ---------- Hero image + Live-site ball ---------- */}
      <div className={`mt-14 md:mt-20 ${SPACING.containerWide}`}>
        <div ref={heroRef} className="relative">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]"
            style={{ backgroundColor: project.bgColor || "#f5f5f4" }}
          >
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              priority
              className="object-fit"
              sizes="(max-width: 1024px) 92vw, 84vw"
            />
          </div>

          {/* The default magnetic ball - carries the live-site link and
              drifts gently upward as you scroll (parallax). The outer wrapper
              owns the scroll transform so it never fights the ball's own
              magnetic transform. */}
          <div
            ref={ballWrapRef}
            className="absolute -top-12 right-1 z-20 will-change-transform md:-top-16 md:right-6"
          >
            <MagneticBall
              href={hasLiveSite ? project.url : undefined}
              target="_blank"
              size={isMobile ? 104 : 148}
              bgColor="var(--color-blue)"
              hoverBgColor="var(--color-dark-blue)"
              textColor="var(--color-off-white-shade)"
              fontSize={isMobile ? "0.85rem" : "1rem"}
            >
              <span className="flex items-center gap-1 whitespace-nowrap">
                Live site
                <IconArrowUpRight size={isMobile ? 15 : 18} />
              </span>
            </MagneticBall>
          </div>
        </div>
      </div>

      {/* ---------- Facts strip + tech stack ---------- */}
      <div className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
        <div
          data-reveal
          className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-10 md:gap-16"
        >
          {facts.map((f) => (
            <Fact key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        {project.techStack.length > 0 && (
          <div data-reveal className="mt-12 md:mt-16">
            <Label>Main tech stack</Label>
            <div className="mt-5 flex flex-wrap gap-3">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-grey-shade/20 px-5 py-2 text-sm text-grey-shade"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------- About the project ---------- */}
      <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
        <SectionHeading>About the project</SectionHeading>
        <p data-reveal className="mt-6 text-base text-grey-shade/60 md:text-lg">
          {project.fullTitle}
        </p>
        <div
          data-reveal
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16"
        >
          {project.about.map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-grey-shade md:text-lg"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ---------- The problem ---------- */}
      {project.problem && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <SectionHeading>The problem</SectionHeading>
            <p
              data-reveal
              className="text-lg leading-relaxed text-grey-shade md:text-2xl"
            >
              {project.problem}
            </p>
          </div>
        </section>
      )}

      {/* ---------- Case-study image ---------- */}
      {galleryImages[0] && (
        <div
          data-reveal
          className={`${SPACING.betweenBlocks} ${SPACING.containerWide}`}
        >
          <div
            className="relative aspect-[16/9] w-full overflow-hidden "
            style={{ backgroundColor: project.bgColor || "#f5f5f4" }}
          >
            <Image
              src={galleryImages[0]}
              alt={galleryAlts[0] ?? `${project.title} interface screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 92vw, 84vw"
            />
          </div>
        </div>
      )}

      {/* ---------- Features ---------- */}
      {project.features && project.features.length > 0 && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <SectionHeading>Features</SectionHeading>
          <div
            data-reveal
            className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-grey-shade/15 bg-grey-shade/15 sm:grid-cols-2 md:mt-16 md:grid-cols-3"
          >
            {project.features.map((f, i) => (
              <div
                key={f}
                className="flex items-baseline gap-4 bg-off-white-shade px-6 py-8"
              >
                <span className="text-sm text-grey-shade/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg text-black-shade md:text-xl">{f}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Technologies used ---------- */}
      {project.technologies && project.technologies.length > 0 && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <SectionHeading>Technologies used</SectionHeading>
          <div
            data-reveal
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 md:mt-16 md:grid-cols-4"
          >
            {project.technologies.map((t) => (
              <div key={t.group}>
                <Label>{t.group}</Label>
                <div className="mt-5 h-px w-full bg-grey-shade/15" />
                <ul className="mt-5 space-y-3">
                  {t.items.map((it) => (
                    <li
                      key={it}
                      className="text-base text-black-shade md:text-lg"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Project goals ---------- */}
      <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          <SectionHeading>Project goals</SectionHeading>
          <div data-reveal>
            <p className="text-base leading-relaxed text-grey-shade md:text-lg">
              {project.goals.intro}
            </p>
            <ul className="mt-8 space-y-4">
              {project.goals.points.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-lg leading-snug text-black-shade md:text-xl"
                >
                  <span className="text-grey-shade/40">-</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Development journey ---------- */}
      {project.journey && project.journey.length > 0 && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <SectionHeading>Development journey</SectionHeading>
          <div className="mt-6 md:mt-12">
            {project.journey.map((p, i) => (
              <div
                key={p.phase}
                data-reveal
                className="grid grid-cols-1 gap-6 border-t border-grey-shade/15 py-10 md:grid-cols-[auto_1fr] md:gap-16 md:py-14"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-[450] leading-none text-grey-shade/15 md:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Label>{p.phase}</Label>
                </div>
                <div>
                  <h3 className="text-2xl font-[450] text-black-shade md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-grey-shade md:text-lg">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-grey-shade/20 px-4 py-2 text-sm text-grey-shade"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Challenges & solutions ---------- */}
      {project.challenges && project.challenges.length > 0 && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <SectionHeading>Challenges &amp; solutions</SectionHeading>
          <div className="mt-6 md:mt-12">
            {project.challenges.map((c, i) => (
              <div
                key={i}
                data-reveal
                className="grid grid-cols-1 gap-8 border-t border-grey-shade/15 py-10 md:grid-cols-2 md:gap-16 md:py-14"
              >
                <div>
                  <Label>Challenge</Label>
                  <p className="mt-5 text-lg leading-snug text-black-shade md:text-xl">
                    {c.challenge}
                  </p>
                </div>
                <div>
                  <Label>Solution</Label>
                  <p className="mt-5 text-base leading-relaxed text-grey-shade md:text-lg">
                    {c.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Results & impact ---------- */}
      {project.results && project.results.length > 0 && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <SectionHeading>Results &amp; impact</SectionHeading>
          <div
            data-reveal
            className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 md:mt-16 md:gap-16"
          >
            {project.results.map((r) => (
              <div key={r.label}>
                <p className="text-6xl font-[450] tracking-tight text-blue md:text-7xl">
                  {r.value}
                </p>
                <p className="mt-4 text-lg font-[450] text-black-shade md:text-xl">
                  {r.label}
                </p>
                <p className="mt-2 text-sm text-grey-shade/60 md:text-base">
                  {r.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Key learnings ---------- */}
      {project.learnings && project.learnings.length > 0 && (
        <section className={`${SPACING.betweenBlocks} ${SPACING.container}`}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <SectionHeading>Key learnings</SectionHeading>
            <ul data-reveal className="space-y-6">
              {project.learnings.map((l, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-lg leading-snug text-black-shade md:text-xl"
                >
                  <span className="text-grey-shade/40">-</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Remaining images ---------- */}
      {galleryImages.slice(1).map((src, i) => (
        <div
          key={src}
          data-reveal
          className={`${SPACING.betweenBlocks} ${SPACING.containerWide}`}
        >
          <div
            className="relative aspect-[16/10] w-full overflow-hidden "
            style={{ backgroundColor: project.bgColor || "#f5f5f4" }}
          >
            <Image
              src={src}
              alt={galleryAlts[i + 1] ?? `${project.title} interface screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 92vw, 84vw"
            />
          </div>
        </div>
      ))}

      {/* ---------- Next case ---------- */}
      <NextCase next={next} />
    </article>
  );
};

export default ProjectDetail;
