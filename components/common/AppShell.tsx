"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isDarkRoute } from "@/lib/routeTheme";

/**
 * Paints the page surface. Dark routes (see lib/routeTheme) get the dark
 * shade behind everything - navbar included - so the whole page reads as one
 * surface rather than a dark section under a light header.
 */
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const dark = isDarkRoute(usePathname());

  // globals.css paints <body> off-white. Match it to the route so overscroll
  // bounce never flashes a white band above/below a dark page.
  useEffect(() => {
    document.body.style.backgroundColor = dark
      ? "var(--color-dark-shade)"
      : "";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [dark]);

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-dark-shade text-off-white-shade"
          : "bg-off-white-shade"
      }
    >
      {children}
    </div>
  );
};

export default AppShell;
