"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/common/footer/Footer";
import { isDarkRoute } from "@/lib/routeTheme";

/**
 * The global "Let's work together" footer, hidden on:
 *   - project detail pages (/work/[slug]) - they render their own "Next case"
 *     footer instead;
 *   - dark routes like /contact - the page IS the contact call to action, so
 *     the animated reveal footer would just repeat it. Those pages render a
 *     plain static bottom bar of their own.
 */
const ConditionalFooter = () => {
  const pathname = usePathname();
  const isProjectDetail = /^\/work\/[^/]+\/?$/.test(pathname ?? "");
  if (isProjectDetail || isDarkRoute(pathname)) return null;
  return <Footer />;
};

export default ConditionalFooter;
