/**
 * Shared layout spacing tokens.
 *
 * Every page section should compose these instead of hardcoding widths and
 * paddings, so all pages breathe the same. Values are full Tailwind class
 * strings (Tailwind statically scans this file, so classes must stay
 * complete literals - never build them dynamically).
 */
export const SPACING = {
  /** Centered content column - same side spacing as the footer/heading (~16% on desktop) */
  container: "mx-auto w-[92%] md:w-[86%] lg:w-[68%]",

  /** Wider stage (~8% margins on desktop) - full-bleed blocks like project
      lists/grids whose divider lines outspan the text container */
  containerWide: "mx-auto w-[92%] md:w-[86%] lg:w-[84%]",

  /** Inner padding that brings text inside the wide stage back into
      alignment with the text container above ((84-68)/2 / 84) */
  wideStageInset: "px-4 lg:px-[9.5%]",

  /** Vertical padding of a top-level page section */
  sectionTop: "pt-28 md:pt-36",
  sectionBottom: "pb-24 md:pb-32",

  /** Gap between a section heading and the content under it */
  afterHeading: "mt-10 md:mt-14",

  /** Gap between major blocks inside a section (e.g. filters -> list) */
  betweenBlocks: "mt-14 md:mt-28",
} as const;
