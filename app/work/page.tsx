import type { Metadata } from "next";
import WorkGallery from "@/components/work/WorkGallery";
import { PROJECTS } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work - Web Development Projects",
  description:
    "Selected web development projects by Ahmad Tahir, full stack web developer: AI products, marketplaces, e-commerce stores and landing pages built with Next.js, React and TypeScript.",
  alternates: { canonical: "/work" },
};

/** ItemList of every case study - helps crawlers map the portfolio. */
const workJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Web Development Projects by Ahmad Tahir",
  url: `${SITE_URL}/work`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PROJECTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/work/${p.slug}`,
    })),
  },
};

const WorkPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <WorkGallery />
    </>
  );
};

export default WorkPage;
