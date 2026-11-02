import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Work from "@/components/work/Work";
import AboutMe from "@/components/about/AboutMe";
// FAQ section removed from the landing page.
// import AboutFaq, { FAQ_ITEMS } from "@/components/about/AboutFaq";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// FAQPage structured data - re-enable together with the <AboutFaq /> section
// below (structured data must mirror visible on-page content).
// const faqJsonLd = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: FAQ_ITEMS.map((item) => ({
//     "@type": "Question",
//     name: item.question,
//     acceptedAnswer: { "@type": "Answer", text: item.answer },
//   })),
// };

const page = () => {
  return (
    <div>
      {/* pb: blank breathing room above the footer reveal, like the reference */}
      <div className="pt-20 pb-28 md:pb-40">
        <Hero />
        <AboutMe />
        <div>
          <Work />
        </div>
        {/* FAQ section removed */}
      </div>
    </div>
  );
};

export default page;
