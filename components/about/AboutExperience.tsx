"use client";

import { motion } from "framer-motion";
import { SPACING } from "@/constants/spacing";
import { PROJECTS, type Project } from "@/data/projects";
import { usePageTransition } from "@/components/common/PageTransition";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Headline numbers, each lifted from a real project's `results` in
 * data/projects.ts - kept short here so the strip stays scannable.
 */
const STATS = [
  { value: "500+", label: "Verified pilots", source: "DroneConnect" },
  { value: "100K+", label: "Attendee capacity", source: "Bashbop" },
  { value: "45ms", label: "Feedback latency", source: "Instant Response" },
];

/** "Name - what it is" -> "what it is". Falls back to the whole string. */
const descriptorOf = (project: Project) => {
  const i = project.fullTitle.indexOf(" - ");
  return i === -1 ? project.fullTitle : project.fullTitle.slice(i + 3);
};

/**
 * Closing section of the About page: the actual track record, read straight
 * from the projects source of truth so it never drifts from /work.
 */
const AboutExperience = () => {
  const { navigateWithTransition } = usePageTransition();

  return (
    <section className="pt-28 pb-28 text-black-shade md:pt-40 md:pb-40">
      <div className={SPACING.containerWide}>
        <span className="text-[15px] text-grey-shade/45">
          Experience / Selected work
        </span>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-10 max-w-[20ch] text-[11vw] font-[450] leading-[1.02] tracking-tight text-grey-shade sm:text-[8.5vw] md:text-[6.5vw] lg:text-[4.25rem]"
        >
          {PROJECTS.length} products, shipped and live
        </motion.h2>

        {/* Headline numbers */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3 md:mt-20 md:gap-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              className="border-t border-grey-shade/20 pt-6"
            >
              <div className="text-[2.5rem] font-[450] tracking-tight text-black-shade lg:text-[3.25rem]">
                {stat.value}
              </div>
              <div className="mt-2 text-[17px] text-grey-shade lg:text-[19px]">
                {stat.label}
              </div>
              <div className="mt-1 text-[15px] text-grey-shade/45">
                {stat.source}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Every shipped project, in the same order as /work */}
        <div className="mt-20 md:mt-28">
          {PROJECTS.map((project, i) => (
            <motion.a
              key={project.slug}
              href={`/work/${project.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition(`/work/${project.slug}`, project.title);
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              className="group block border-t border-grey-shade/20 py-10 last:border-b md:py-12"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-baseline md:gap-x-6">
                <span className="text-[15px] text-grey-shade/45 md:col-span-1">
                  {project.year}
                </span>

                <h3 className="flex items-center text-[2rem] font-[450] tracking-tight text-black-shade transition-transform duration-500 ease-out md:col-span-4 md:col-start-2 md:text-[2.25rem] md:group-hover:translate-x-2 lg:text-[2.75rem]">
                  {project.title}
                </h3>

                <div className="md:col-span-6 md:col-start-7">
                  <p className="text-[17px] leading-[1.75] text-grey-shade lg:text-[19px]">
                    {descriptorOf(project)}
                  </p>
                  <p className="mt-3 text-[15px] text-grey-shade/45">
                    {project.category} - {project.techStack.slice(0, 4).join(", ")}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutExperience;
