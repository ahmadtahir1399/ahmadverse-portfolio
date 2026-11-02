import type { Metadata } from "next";
import ContactMain from "@/components/contact/ContactMain";
import ContactBottomBar from "@/components/contact/ContactBottomBar";
import { CONTACT, PERSON, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact - Start a Project",
  description:
    "Get in touch with Ahmad Tahir, a full stack web developer building AI assistants, real-time platforms and marketplaces. Available worldwide for freelance work.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    title: "Contact Ahmad Tahir - Start a Project",
    description:
      "Let's start a project together. Full-stack products built end to end, from first schema to live deploy.",
  },
};

/**
 * ContactPage node tied back to the Person entity in the root layout, so the
 * contact route is understood as belonging to the same entity as /about.
 */
const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact`,
  url: `${SITE_URL}/contact`,
  name: `Contact ${PERSON.name}`,
  mainEntity: {
    "@id": `${SITE_URL}/#person`,
    email: `mailto:${CONTACT.email}`,
  },
};

const ContactPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <div className="pt-20">
        <ContactMain />
        <ContactBottomBar />
      </div>
    </>
  );
};

export default ContactPage;
