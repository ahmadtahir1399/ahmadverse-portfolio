import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutServices from "@/components/about/AboutServices";
import AboutExperience from "@/components/about/AboutExperience";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About - Full Stack Web Developer",
  description:
    "About Ahmad Tahir - a full stack web developer building AI assistants, real-time platforms and two-sided marketplaces with Next.js, React, TypeScript and Node.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/about`,
    title: "About Ahmad Tahir - Full Stack Web Developer",
    description:
      "Full-stack products built end to end - AI assistants, real-time platforms and marketplaces, from first schema to live deploy.",
  },
};

/**
 * AboutPage node tied back to the Person entity defined in the root layout,
 * so search + AI engines connect this page to who Ahmad Tahir is.
 */
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about`,
  url: `${SITE_URL}/about`,
  name: "About Ahmad Tahir",
  mainEntity: { "@id": `${SITE_URL}/#person` },
};

const AboutPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="pt-20">
        <AboutHero />
        <AboutServices />
        <AboutExperience />
      </div>
    </>
  );
};

export default AboutPage;
