"use client";

import { motion } from "framer-motion";
import { SPACING } from "@/constants/spacing";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Service {
  no: string;
  title: string;
  body: string;
  star?: boolean;
}

const SERVICES: Service[] = [
  {
    no: "01",
    title: "AI & real-time apps",
    body: "Voice and chat products on Groq Whisper, OpenAI and streaming LLMs - with the WebSocket and WebRTC plumbing that gets answers back in milliseconds, not minutes.",
  },
  {
    no: "02",
    title: "Marketplaces & payments",
    body: "Two-sided platforms built on Stripe and Stripe Connect - pay-to-unlock jobs, multi-vendor payouts, queue-backed notifications, and the admin tooling to run them.",
  },
  {
    no: "03",
    title: "The full package",
    body: "Empty repo to live product: design, frontend, backend, payments, admin panel and infra. Next.js and React on top; Node, NestJS or FastAPI underneath.",
    star: true,
  },
];

/** Four-point sparkle that precedes "The full package". */
const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="mr-3 inline-block h-7 w-7 shrink-0 fill-current align-[-0.15em] md:h-8 md:w-8"
    aria-hidden="true"
  >
    <path d="M12 1c.5 5.9 4.1 9.5 10 10-5.9.5-9.5 4.1-10 10-.5-5.9-4.1-9.5-10-10C7.9 10.5 11.5 6.9 12 1z" />
  </svg>
);

/** Blinking ellipsis that trails the heading, like the reference. */
const AnimatedDots = () => (
  <span className="ml-1 inline-flex" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          delay: i * 0.22,
          ease: "easeInOut",
        }}
      >
        .
      </motion.span>
    ))}
  </span>
);

const AboutServices = () => {
  return (
    <section className="mt-28 w-full bg-about-surface py-24 md:mt-40 md:py-32 lg:py-40">
      {/* Full-bleed tinted band; content sits on the wide stage so the column
          rules line up with the portrait edge above */}
      <div className={SPACING.containerWide}>
        <h2 className="text-[11vw] font-[450] leading-none tracking-tight text-grey-shade sm:text-[8.5vw] md:text-[6.5vw] lg:text-[4.25rem]">
          <motion.span
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline"
          >
            I can help you with
          </motion.span>
          <AnimatedDots />
        </h2>

        {/* Three columns - ~104px gutters at desktop, matching the reference */}
        <div className="mt-16 grid grid-cols-1 gap-14 md:mt-[6.5rem] md:grid-cols-3 md:gap-10 lg:gap-[6.4%]">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
            >
              <span className="text-[15px] text-grey-shade/45">{s.no}</span>
              <div className="mt-8 h-px w-full bg-grey-shade/25" />
              <h3 className="mt-12 flex items-center text-[2rem] font-[450] tracking-tight text-black-shade md:text-[2.25rem] lg:text-[2.75rem]">
                {s.star && <StarIcon />}
                {s.title}
              </h3>
              <p className="mt-10 text-[17px] leading-[2] text-grey-shade lg:text-[19px]">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutServices;
