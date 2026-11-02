import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/common/AppShell";
import NavbarWrapper from "@/components/common/navbar/NavbarWrapper";
import ConditionalFooter from "@/components/common/footer/ConditionalFooter";
import { ThemeProvider } from "next-themes";
import SmoothScroll from "@/components/common/SmoothScroll";
import TransitionProvider from "@/components/common/PageTransition";
import { MenuProvider } from "@/context/MenuContext";
import { PERSON, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Ahmad Tahir",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  keywords: [
    "Ahmad Tahir",
    "full stack web developer",
    "freelance web developer",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "web developer Pakistan",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: PERSON.photo,
        alt: "Portrait of Ahmad Tahir, full stack web developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [PERSON.photo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Person + WebSite structured data, served on every page.
 * The Person node is the "entity home" Google's Knowledge Graph and
 * AI search use to understand who Ahmad Tahir is; `sameAs` ties the
 * entity to off-site profiles.
 */
const identityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PERSON.name,
      alternateName: PERSON.alternateName,
      jobTitle: PERSON.jobTitle,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}${PERSON.photo}`,
      email: `mailto:${PERSON.email}`,
      sameAs: PERSON.profiles,
      address: { "@type": "PostalAddress", addressCountry: "PK" },
      knowsAbout: PERSON.skills,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(identityJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <MenuProvider>
            <SmoothScroll>
              <TransitionProvider>
                <AppShell>
                  <NavbarWrapper />
                  {children}
                  <ConditionalFooter />
                </AppShell>
              </TransitionProvider>
            </SmoothScroll>
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
