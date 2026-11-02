/**
 * Routes that render on the dark surface instead of the off-white one.
 *
 * The page background (AppShell), the navbar text colour, and whether the
 * animated "Let's work together" footer renders at all are all driven from
 * this one list, so a dark page never ends up half-light.
 */
const DARK_ROUTES = ["/contact"];

export const isDarkRoute = (pathname: string | null | undefined): boolean =>
  DARK_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );
