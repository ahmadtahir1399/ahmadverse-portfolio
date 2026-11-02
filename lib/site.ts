/**
 * ============================================================
 *  SITE - single source of truth for SEO / identity data
 * ============================================================
 *
 * Every SEO surface (metadata, JSON-LD, sitemap, robots) reads from
 * this file so the name, role, and URLs never drift apart.
 *
 * IMPORTANT: set NEXT_PUBLIC_SITE_URL (or edit the fallback below) to
 * the real production domain before deploying - canonical URLs, Open
 * Graph tags, and the sitemap are all built from it.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmadverse.vercel.app";

export const PERSON = {
  name: "Ahmad Tahir",
  alternateName: "Muhammad Ahmad Tahir",
  jobTitle: "Full Stack Web Developer",
  email: "ahmadtahir1399@gmail.com",
  /** Portrait photo - also used as the Open Graph fallback image. */
  photo: "/assets/ahmad-tahir-full-stack-web-developer.jpg",
  location: "Pakistan",
  /** Public profiles - add more here as they go live.
   *  These feed the Person JSON-LD `sameAs` array (entity signals). */
  profiles: [
    "https://github.com/ahmadtahir1399",
    "https://www.linkedin.com/in/ahmad-ai-enginner/",
  ],
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "NestJS",
    "FastAPI",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "Stripe integration",
    "WebSockets & real-time apps",
    "AI application development",
  ],
} as const;

/**
 * Contact + business details, used by the footer and the /contact page.
 * Anything left as an empty string is simply not rendered, so a detail you
 * have not filled in yet never ships as a broken-looking placeholder.
 */
export const CONTACT: {
  email: string;
  phone: string;
  location: string;
  availability: string;
} = {
  email: PERSON.email,
  /** TODO: real number. Left empty so no placeholder phone ships. */
  phone: "",
  location: "Pakistan",
  availability: "Available worldwide, remote",
};

/** Public profiles rendered as "Socials". Add entries as they go live.
 *  Every "Socials" list on the site (footer, menu, /contact) reads from here,
 *  so a profile is added once and shows up everywhere. */
export const SOCIALS: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/ahmadtahir1399" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ahmad-ai-enginner/" },
];

export const SITE_TITLE = "Ahmad Tahir - Full Stack Web Developer";

export const SITE_DESCRIPTION =
  "Ahmad Tahir is a full stack web developer building fast, modern web apps with Next.js, React, TypeScript and Node.js - from AI products to marketplaces. Available for freelance work worldwide.";
