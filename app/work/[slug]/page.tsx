import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/data/projects";
import ProjectDetail from "@/components/work/ProjectDetail";
import { PERSON, SITE_URL } from "@/lib/site";

/** Pre-render every project page at build time (fully static). */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  // First "about" paragraph makes a natural, unique meta description;
  // fall back to the one-line fullTitle.
  const description = project.about[0] ?? project.fullTitle;

  return {
    title: `${project.title} - ${project.category} Case Study`,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/work/${project.slug}`,
      title: `${project.title} - case study by ${PERSON.name}`,
      description,
      images: [{ url: project.cover, alt: project.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - case study by ${PERSON.name}`,
      description,
      images: [project.cover],
    },
  };
}

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  /* CreativeWork + breadcrumb structured data: ties each case study to
     the Ahmad Tahir Person entity defined in the root layout. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        headline: project.fullTitle,
        description: project.about[0] ?? project.fullTitle,
        url: `${SITE_URL}/work/${project.slug}`,
        image: `${SITE_URL}${project.cover}`,
        dateCreated: project.year,
        keywords: project.techStack.join(", "),
        creator: { "@id": `${SITE_URL}/#person` },
        ...(project.url ? { sameAs: project.url } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${SITE_URL}/work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `${SITE_URL}/work/${project.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} />
    </>
  );
};

export default ProjectPage;
