/**
 * ============================================================
 *  PROJECTS - single source of truth
 * ============================================================
 *
 * Every projects surface reads from this one array:
 *   - Home "Recent Work"      -> components/work/Work.tsx      (RECENT = first 3)
 *   - /work gallery           -> components/work/WorkGallery.tsx (all)
 *   - /work/[slug] case study -> components/work/ProjectDetail.tsx
 *
 * To add / edit a project you only ever touch THIS file (plus dropping
 * the images into public/projects/<slug>/). Keep it to ~4-6 projects.
 *
 * Images live locally in  public/projects/<slug>/  and are referenced with
 * absolute public paths ("/projects/<slug>/1.png"). Filenames are
 * case-sensitive on deploy (Linux/Vercel), so match them exactly.
 */

export type ProjectTag = "design" | "development";

export interface Project {
  /* ---- identity / routing ---- */
  /** URL segment: /work/<slug> - lowercase, kebab-case, unique */
  slug: string;
  /** Short name for lists, cards & the detail hero heading, e.g. "Launch" */
  title: string;
  /** One-line descriptor under the About heading, e.g. the full product name */
  fullTitle: string;

  /* ---- hero columns (Role / Industry / Location & Year) ---- */
  /** Role / Services, e.g. "Design & Development" */
  category: string;
  industry: string;
  location: string;
  year: string;

  /* ---- extra facts (shown as a strip under the hero image) ---- */
  platform: string;
  projectLength: string;
  /** e.g. "Jul 2020" */
  since: string;
  /** Rendered as chips */
  techStack: string[];

  /** Drives the filter chips on /work */
  tags: ProjectTag[];

  /* ---- visuals ---- */
  /** Thumbnail used by the list hover-preview and the grid card */
  cover: string;
  /** Descriptive alt text for the cover image (accessibility + image SEO) */
  coverAlt: string;
  /** Solid tint painted behind images in their frame (detail page) */
  bgColor?: string;
  /**
   * Themed background for the hover-preview panel in Work / the /work
   * gallery. A full CSS `background` shorthand, so it can be a solid color,
   * a gradient, or a layered pattern (grids, dots, glows, diagonal lines).
   * Falls back to bgColor when omitted.
   */
  previewBg?: string;
  /** 1-4 images for the case study. images[0] is the hero. */
  images: string[];
  /** Alt text for each entry in `images`, same order (a11y + image SEO). */
  imageAlts: string[];

  /* ---- detail copy ---- */
  /** Live site / repo - powers the blue "Live site" ball */
  url?: string;
  /** "About the project" - 1-3 short paragraphs */
  about: string[];
  /** "Project goals" - intro line + bullet points */
  goals: {
    intro: string;
    points: string[];
  };

  /* ---- rich case-study sections (all optional; render only when present) ---- */
  /** "The problem" - a single paragraph */
  problem?: string;
  /** Feature highlights, rendered as a numbered grid */
  features?: string[];
  /** Grouped tech breakdown (Frontend / Backend / AI / Infrastructure ...) */
  technologies?: { group: string; items: string[] }[];
  /** "Development journey" - phases in order */
  journey?: { phase: string; title: string; description: string; tags: string[] }[];
  /** "Challenges & solutions" - challenge → solution pairs */
  challenges?: { challenge: string; solution: string }[];
  /** "Results & impact" - headline metrics */
  results?: { value: string; label: string; detail: string }[];
  /** "Key learnings" - bullet points */
  learnings?: string[];
}

/**
 * Every project, defined once. Order here does NOT drive the site - the
 * display order is controlled by DISPLAY_ORDER below.
 */
const PROJECT_LIST: Project[] = [
  /* ---------------------------------------------------------------
   *  SCRIPTOR - AI thesis supervisor (live, in development)
   * ------------------------------------------------------------- */
  {
    slug: "scriptor",
    title: "Scriptor",
    fullTitle:
      "Scriptor - An AI thesis supervisor that anchors every finding to the exact words on the page",

    category: "Full-stack Development & Product Engineering",
    industry: "EdTech / Academic",
    location: "Remote",
    year: "2026",

    platform: "Web (responsive)",
    projectLength: "Ongoing",
    since: "2026",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "OpenAI",
      "Tailwind v4",
      "pdf.js",
    ],

    tags: ["development"],

    cover: "/projects/scriptor/scriptor-ai-thesis-supervisor-homepage.jpg",
    coverAlt:
      "Scriptor homepage with the headline 'Every note your supervisor would make, anchored to the page' beside a sample logical-errors finding card",
    // Matches the blue template the screenshots are exported on (sampled
    // #0a85ed at the image edge), so they blend into their frame.
    bgColor: "#0A85ED",
    // Ruled manuscript paper - the product's own gesture: text lines, a margin
    // rule down the left, and a highlighter band running behind the card,
    // using Scriptor's actual highlight yellow. Deliberately kept to cream,
    // deep green and that yellow; red would read as an error state here.
    previewBg:
      "linear-gradient(90deg, transparent 0 9%, rgba(28,58,42,0.18) 9% calc(9% + 1px), transparent calc(9% + 1px)), linear-gradient(0deg, transparent 0 41%, rgba(232,203,110,0.38) 41% 45%, transparent 45%), repeating-linear-gradient(0deg, rgba(28,58,42,0.10) 0 1px, transparent 1px 24px), radial-gradient(circle at 76% 22%, rgba(28,58,42,0.14), transparent 58%), #efe8db",
    images: [
      "/projects/scriptor/scriptor-ai-thesis-supervisor-homepage.jpg",
      "/projects/scriptor/scriptor-ai-thesis-supervisor-2.jpg",
    ],
    imageAlts: [
      "Scriptor homepage with the headline 'Every note your supervisor would make, anchored to the page' beside a sample logical-errors finding card",
      "Scriptor shown responsive on a laptop and a phone, both displaying the anchored-findings homepage",
    ],

    url: "https://scriptor-papercheak.vercel.app/",
    about: [
      "Scriptor reviews a student's thesis end to end: it reads the PDF, runs a catalogue of academic checks across it, scores the result, and shows every issue highlighted on the page it came from.",
      "Citation style, argumentation, coherence, logical fallacies, cover page, chapter order, inclusive language, terminology and source density - plus grammar, bibliography verification against live academic databases, a prioritised revision plan, and generated viva questions drawn from the thesis's own weakest ground.",
      "I built it end to end: the PostgreSQL schema and its row-level security, the queue-backed ingestion pipeline, the model layer and its cost accounting, and the entire Next.js 16 App Router frontend - including the PDF viewer that draws per-word highlight overlays.",
    ],
    goals: {
      intro:
        "The aim was to make automated feedback specific enough to act on. It needed to:",
      points: [
        "read any thesis PDF and anchor every finding to exact words on the page;",
        "run a catalogue of supervisor-grade checks into one weighted, explainable score;",
        "verify that every source in the bibliography actually exists, with evidence;",
        "turn a completed review into a prioritised revision plan and viva preparation;",
        "keep AI spend measured per analysis rather than invisible.",
      ],
    },

    problem:
      "A supervisor has weeks of turnaround and a hundred pages to read. Generic AI writing tools answer in seconds but say your citations are inconsistent without ever pointing at one. Neither tells a student what to fix, on which page, in what order, before the deadline. A finding that cannot be located in the source is worse than no finding at all - so Scriptor drops it rather than guessing at a highlight.",

    features: [
      "Word-anchored findings",
      "Ten-check analysis suite",
      "Reference health verification",
      "Requirements import",
      "Prioritised revision plan",
      "Viva defence practice",
    ],

    technologies: [
      {
        group: "Frontend",
        items: [
          "Next.js 16 - App Router",
          "React Server Components",
          "TypeScript (strict)",
          "Tailwind CSS v4",
          "Radix UI",
          "pdf.js",
          "TanStack Query & Zustand",
          "Recharts & Framer Motion",
        ],
      },
      {
        group: "Backend & Data",
        items: [
          "Supabase - PostgreSQL",
          "Row-level security",
          "Postgres job queue",
          "FOR UPDATE SKIP LOCKED",
          "pg_cron & Supabase Vault",
          "OpenAI",
          "Zod validation",
          "Resend",
        ],
      },
      {
        group: "Infrastructure",
        items: [
          "Vercel",
          "Supabase Storage",
          "Supabase Realtime",
          "Database-scheduled cron",
          "Vitest",
        ],
      },
    ],

    journey: [
      {
        phase: "Phase 1",
        title: "Schema & ingestion",
        description:
          "Designed the PostgreSQL schema - 38 tables, 17 enums, row-level security on every one - and built the four-stage ingestion pipeline: PDF parsing with per-word geometry, structural page classification, and a deterministic compatibility gate that costs no model call.",
        tags: ["PostgreSQL", "RLS", "PDF Parsing", "Job Queue"],
      },
      {
        phase: "Phase 2",
        title: "Analysis engine & anchored viewer",
        description:
          "Built the check runner with immutable prompt versioning, the weighted scoring model as a single pure module, and the PDF viewer that draws highlight overlays from stored word coordinates - the feature the whole product rests on.",
        tags: ["OpenAI", "Prompt Versioning", "pdf.js", "Scoring"],
      },
      {
        phase: "Phase 3",
        title: "References & requirements",
        description:
          "Bibliography extraction and in-text pairing, five-provider verification with evidence-ranked verdicts, and university requirement files parsed into checks that run beside the standard catalogue.",
        tags: ["Crossref", "OpenAlex", "Semantic Scholar", "DOI Resolution"],
      },
      {
        phase: "Phase 4",
        title: "Coaching & operations",
        description:
          "Revision to-do generation, viva question generation, the notification and digest pipeline, scheduled retention purges, and per-analysis token and cost telemetry with a spend guard on every run.",
        tags: ["Task Planning", "Notifications", "Cost Telemetry", "Retention"],
      },
    ],

    challenges: [
      {
        challenge: "Making AI output verifiable",
        solution:
          "Findings must quote the thesis verbatim. Each quote is resolved against that page's own stored words into a concrete word range at the moment the check runs. Anything that cannot be located is dropped and counted - never approximated.",
      },
      {
        challenge: "Row-level security at 50,000 rows per thesis",
        solution:
          "user_id is denormalised onto every child table and written by BEFORE INSERT triggers that overwrite whatever the client sends, so each policy becomes a single indexed equality check that cannot be forged.",
      },
      {
        challenge: "Reliable background work on serverless",
        solution:
          "A Postgres queue claimed with FOR UPDATE SKIP LOCKED, kicked immediately on enqueue and swept every minute by pg_cron in the database rather than the platform. Handlers are idempotent, and a reaper returns jobs wedged by a crashed worker.",
      },
      {
        challenge: "Model cost that stays visible",
        solution:
          "One module owns every model call and writes token usage; checks are page-scoped so a cover-page check never pays to read the body; prompt caching is measured separately; and a cost guard runs before spend, not after.",
      },
      {
        challenge: "Keeping a result true to the bytes it read",
        solution:
          "A revised draft inserts a new upload row against the same paper and never updates the old one. Entitlements are snapshotted at upload time, so an analysis from last year keeps the terms it was granted - and draft-over-draft comparison stays possible.",
      },
    ],

    results: [
      {
        value: "38",
        label: "Tables",
        detail: "Row-level security on every one, across seven aggregates",
      },
      {
        value: "~50K",
        label: "Words anchored",
        detail: "Per thesis, each with its own bounding box",
      },
      {
        value: "10",
        label: "Academic checks",
        detail: "Versioned prompts feeding one weighted score",
      },
      {
        value: "5",
        label: "Verification sources",
        detail: "Evidence-ranked, cheapest signal resolved first",
      },
    ],

    learnings: [
      "An AI finding that cannot be located in the source is worse than no finding - dropping it is a feature, not a failure.",
      "RLS policy shape sets the performance ceiling long before query tuning does.",
      "Store document geometry in document units; pixels bake in a zoom level and break the viewer at every other scale.",
      "Prompts are versioned data, not code - otherwise you cannot tell whether last month's result would still hold today.",
      "Platform limits belong in the architecture decision, not in a workaround discovered after deploy.",
    ],
  },

  /* ---------------------------------------------------------------
   *  INSTANT RESPONSE - real project (live)
   * ------------------------------------------------------------- */
  {
    slug: "instant-response",
    title: "Instant Response",
    fullTitle:
      "Instant Response - Real-time spoken-English coaching powered by Groq Whisper + LLMs",

    category: "Full-stack Development",
    industry: "EdTech / Language Learning",
    location: "Pakistan",
    year: "2025",

    platform: "Web",
    projectLength: "8 weeks",
    since: "2025",
    techStack: [
      "Next.js",
      "TypeScript",
      "Groq Whisper",
      "Groq LLM",
      "PostgreSQL",
      "WebSocket",
    ],

    tags: ["design", "development"],

    cover:
      "/projects/instant-response/instant-response-ai-english-speaking-app-homepage.jpg",
    coverAlt:
      "Homepage of Instant Response, an AI English speaking practice app, with the headline 'Level Up Your English With Smart AI'",
    // Matches the blue template the screenshots are exported on, so the
    // preview image blends seamlessly into its frame.
    bgColor: "#0A85ED",
    // Lime green + black dot grid - the playful Instant Response brand.
    previewBg:
      "radial-gradient(rgba(0,0,0,0.09) 1.5px, transparent 1.6px) 0 0 / 20px 20px, #C6F24A",
    images: [
      "/projects/instant-response/instant-response-ai-english-speaking-app-homepage.jpg",
      "/projects/instant-response/instant-response-ai-english-speaking-app-2.jpg",
    ],
    imageAlts: [
      "Homepage of Instant Response, an AI English speaking practice app, with the headline 'Level Up Your English With Smart AI'",
      "Another view of the Instant Response AI English coaching web app",
    ],

    url: "https://instant-response-app.com/",
    about: [
      "Instant Response is a full-stack Next.js app that breaks down your spoken English in real time. You talk; Groq-powered Whisper transcribes instantly and a set of LLMs score your pronunciation, fluency, and pacing - no waiting five minutes for a report.",
      "It's built for people who want to speak better English without awkward tutors or boring drills. Instead of dumping a transcript in your lap, it gives instant, specific, genuinely useful corrections while the words are still fresh.",
    ],
    goals: {
      intro:
        "The goal was real-time coaching that feels like a sharp, encouraging tutor - not a graded exam. The product needed to:",
      points: [
        "transcribe speech the instant you finish talking;",
        "score pronunciation, fluency, and pacing against phoneme maps;",
        "return short, natural-sounding feedback - never essay-length;",
        "keep learners hooked past the first week with streaks and challenges.",
      ],
    },

    problem:
      "Most 'English learning' apps either talk to you like a child, give slow and vague feedback, or just dump a transcript in your lap. Learners need instant, specific, and actually useful corrections while they're speaking - not an email report tomorrow.",

    features: [
      "Voice Analysis Engine",
      "Personalized Feedback",
      "Gamified Learning",
      "Progress Tracking",
      "Conversation Practice",
      "Accent Training",
    ],

    technologies: [
      { group: "Frontend", items: ["Next.js", "TypeScript", "Tailwind CSS", "React Query"] },
      { group: "Backend", items: ["Next.js API Routes", "PostgreSQL", "Redis", "WebSocket"] },
      { group: "AI / ML", items: ["Groq Whisper API", "Groq LLM APIs", "Custom Pronunciation Models"] },
      { group: "Infrastructure", items: ["Vercel", "AWS S3", "Docker", "GitHub Actions"] },
    ],

    journey: [
      {
        phase: "Phase 1",
        title: "Real-Time Voice Pipeline",
        description:
          "Groq Whisper handles speech-to-text insanely fast. Added noise filtering and accent tagging so transcripts are clean before hitting the feedback engine.",
        tags: ["Groq Whisper", "Noise Reduction", "Accent Detection"],
      },
      {
        phase: "Phase 2",
        title: "Feedback Brain",
        description:
          "Groq LLM scores pronunciation, fluency, and pacing while comparing against phoneme maps. Added custom rules for tricky words and accent-specific pitfalls.",
        tags: ["Groq LLM", "Pronunciation Scoring", "Adaptive Learning"],
      },
      {
        phase: "Phase 3",
        title: "Engagement Layer",
        description:
          "Gamified streaks, adaptive difficulty, and live conversation challenges to keep users hooked for more than a week.",
        tags: ["Gamification Engine", "Social Features", "Spaced Repetition"],
      },
      {
        phase: "Phase 4",
        title: "Full-Stack Delivery",
        description:
          "Next.js full stack app deployed on Vercel with persistent storage, instant API routes, and WebSocket streaming for sub-100ms feedback.",
        tags: ["Next.js", "Vercel", "PostgreSQL", "Redis"],
      },
    ],

    challenges: [
      {
        challenge: "Sub-second processing without hitting Groq API limits",
        solution:
          "Batched requests intelligently, pre-processed audio locally, and used WebSockets to stream intermediate feedback instead of waiting for a final report.",
      },
      {
        challenge: "LLM feedback that doesn't sound robotic",
        solution:
          "Fine-tuned prompts and guardrails so feedback is short, specific, and natural-sounding - no essay-length responses.",
      },
      {
        challenge: "Mobile browser audio capture inconsistencies",
        solution:
          "Built a custom recorder with fallback encoders and normalizers so every device streams audio in the same clean format.",
      },
    ],

    results: [
      { value: "92%", label: "Scoring Accuracy", detail: "Compared to human assessors" },
      { value: "85%", label: "15-day Retention", detail: "People keep coming back" },
      { value: "45ms", label: "Avg Feedback Latency", detail: "Yes, it's that fast" },
    ],

    learnings: [
      "Groq is blazing fast for real-time speech - but you must design around its API limits.",
      "If feedback sounds robotic, users ignore it - tone matters as much as accuracy.",
      "Next.js full stack ships fast, but streaming audio handling will eat your weekend if you're not prepared.",
      "Real-time scoring crushes batch processing for engagement.",
    ],
  },

  /* ---------------------------------------------------------------
   *  LUNARISFLOW - landing page rebuild (live)
   * ------------------------------------------------------------- */
  {
    slug: "lunarisflow",
    title: "Lunarisflow",
    fullTitle:
      "Lunarisflow - A sleek, fast, and fully responsive landing page rebuild",

    category: "Design & Development",
    industry: "SaaS / Web",
    location: "Remote",
    year: "2025",

    platform: "Web",
    projectLength: "2 weeks",
    since: "2025",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],

    tags: ["design", "development"],

    cover:
      "/projects/lunarisflow/lunarisflow-landing-page-rebuild-homepage.jpg",
    coverAlt:
      "Rebuilt Lunarisflow landing page hero with a glowing moon behind the lunarisflow wordmark on a starry background",
    bgColor: "#0A85ED",
    // Deep space navy with a soft "moon" glow and faint stars.
    previewBg:
      "radial-gradient(circle at 50% 40%, rgba(150,190,255,0.55), rgba(30,55,110,0.15) 32%, transparent 62%), radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1.2px) 0 0 / 40px 40px, #070c1f",
    images: [
      "/projects/lunarisflow/lunarisflow-landing-page-rebuild-homepage.jpg",
      "/projects/lunarisflow/lunarisflow-landing-page-rebuild-2.jpg",
    ],
    imageAlts: [
      "Rebuilt Lunarisflow landing page hero with a glowing moon behind the lunarisflow wordmark on a starry background",
      "Another section of the rebuilt Lunarisflow marketing site",
    ],

    url: "https://lunarisflow.com/",
    about: [
      "Lunarisflow's landing page needed to be dragged into the modern era. This was a full rebuild of the marketing site as a fast, fully responsive Next.js app - sleek, high-performance, and easy to maintain.",
      "The focus was speed and polish: a consistent design system, optimized assets, and server-side rendering so the page loads quickly and ranks well.",
    ],
    goals: {
      intro:
        "The rebuild set out to replace a slow, dated site with a fast, modern one. It needed to:",
      points: [
        "rebuild the landing page on Next.js for speed and SEO;",
        "look sharp and stay fully responsive on every device;",
        "ship a consistent Tailwind CSS design system;",
        "score high on performance with optimized, lazy-loaded assets.",
      ],
    },

    problem:
      "The old Lunarisflow website was slow, outdated, and lacked a modern UI/UX.",

    features: [
      "Next.js Rebuild",
      "Responsive Design",
      "Tailwind Styling",
      "Performance Optimization",
    ],

    technologies: [
      { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { group: "Deployment", items: ["Vercel"] },
    ],

    challenges: [
      {
        challenge: "Outdated static site",
        solution:
          "Rebuilt in Next.js with server-side rendering for speed and SEO.",
      },
      {
        challenge: "Inconsistent styling",
        solution: "Created a consistent design system with Tailwind CSS.",
      },
    ],

    learnings: [
      "Migrating to Next.js can drastically improve both performance and maintainability.",
      "A design system in Tailwind CSS speeds up development and ensures brand consistency.",
      "Image optimization and lazy loading can significantly boost page speed scores.",
    ],
  },

  /* ---------------------------------------------------------------
   *  QUANTICX - real-time AI trading chatbot (live)
   * ------------------------------------------------------------- */
  {
    slug: "quanticx",
    title: "QuanticX",
    fullTitle: "QuanticX - Your trading buddy that actually knows stuff",

    category: "Full-stack Development",
    industry: "FinTech / Trading",
    location: "Remote",
    year: "2025",

    platform: "Web",
    projectLength: "6 weeks",
    since: "2025",
    techStack: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "OpenAI GPT-4",
      "AWS EC2",
    ],

    tags: ["development"],

    cover: "/projects/quanticx/quanticx-ai-trading-chatbot-homepage.jpg",
    coverAlt:
      "Homepage of QuanticX, an AI trading chatbot, with the headline 'Trade Better Using AI' over a dark market-chart background",
    bgColor: "#0A85ED",
    // Deep navy with an electric-blue chart grid and central glow.
    previewBg:
      "radial-gradient(circle at 50% 42%, rgba(24,124,255,0.38), transparent 58%), repeating-linear-gradient(0deg, rgba(96,165,250,0.12) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(96,165,250,0.12) 0 1px, transparent 1px 26px), #060b1c",
    images: [
      "/projects/quanticx/quanticx-ai-trading-chatbot-homepage.jpg",
      "/projects/quanticx/quanticx-ai-trading-chatbot-2.jpg",
    ],
    imageAlts: [
      "Homepage of QuanticX, an AI trading chatbot, with the headline 'Trade Better Using AI' over a dark market-chart background",
      "Another view of the QuanticX AI trading assistant web app",
    ],

    url: "https://www.quanticx.ai/",
    about: [
      "QuanticX is a real-time trading chatbot that analyzes coins, surfaces market insights, and answers trader questions in plain language - a trading buddy that actually knows stuff.",
      "I built the full-stack setup end to end: a Next.js frontend, a FastAPI backend, and an OpenAI LLM wired to live market data, hosted across Vercel and AWS EC2. It talks like a human but thinks like a market analyst.",
    ],
    goals: {
      intro:
        "The goal was an assistant that turns raw market noise into quick, trustworthy answers. It needed to:",
      points: [
        "analyze coins and surface market insights on demand;",
        "answer trader questions conversationally, in real time;",
        "inject fresh market context so answers stay accurate;",
        "stream responses so traders wait seconds, not minutes.",
      ],
    },

    problem:
      "Traders are drowning in raw data but starved for quick, actionable insights. They either get spammy signals or outdated info. I wanted something that could talk like a human but think like a market analyst - in real time.",

    features: ["Coin Analysis", "Market Insights", "Conversational Chatbot"],

    technologies: [
      { group: "Frontend", items: ["Next.js", "TypeScript"] },
      { group: "Backend", items: ["FastAPI", "Python"] },
      { group: "AI / ML", items: ["OpenAI GPT-4", "Groq Whisper API"] },
      { group: "Hosting", items: ["Vercel", "AWS EC2"] },
    ],

    challenges: [
      {
        challenge: "Keeping responses snappy with live market data",
        solution:
          "Optimized FastAPI endpoints and streamed responses from the LLM so traders got answers in seconds, not minutes.",
      },
      {
        challenge: "Making the chatbot sound human but stay accurate",
        solution:
          "Fine-tuned prompts and added context injection from recent market data before sending to the LLM.",
      },
    ],

    learnings: [
      "Next.js + FastAPI is insanely fast for chat-style AI apps.",
      "Good prompt design matters more than model size for quality answers.",
      "Streaming LLM responses massively improves perceived speed.",
    ],
  },

  /* ---------------------------------------------------------------
   *  BASHBOP - full-stack event marketplace (live, team project)
   * ------------------------------------------------------------- */
  {
    slug: "bashbop",
    title: "Bashbop",
    fullTitle:
      "Bashbop - One platform to create, manage, and monetize events, in-person and virtual",

    category: "Full-stack Development",
    industry: "Events / Marketplace",
    location: "Remote",
    year: "2025",

    platform: "Web, Mobile",
    projectLength: "4 months",
    since: "2025",
    techStack: [
      "Next.js",
      "TypeScript",
      "NestJS",
      "MongoDB",
      "GetStream",
      "Stripe Connect",
    ],

    tags: ["design", "development"],

    cover: "/projects/bashbop/bashbop-event-marketplace-homepage.jpg",
    coverAlt:
      "Homepage of Bashbop, an event marketplace, with the headline 'Culture, music and community events near you' and event photos",
    bgColor: "#0A85ED",
    // Electric yellow with subtle black diagonal lines - high-energy events.
    previewBg:
      "repeating-linear-gradient(-45deg, rgba(0,0,0,0.06) 0 3px, transparent 3px 22px), #EAF200",
    images: [
      "/projects/bashbop/bashbop-event-marketplace-homepage.jpg",
      "/projects/bashbop/bashbop-event-marketplace-2.jpg",
    ],
    imageAlts: [
      "Homepage of Bashbop, an event marketplace, with the headline 'Culture, music and community events near you' and event photos",
      "Another view of the Bashbop event management platform",
    ],

    url: "https://bashbop.com/",
    about: [
      "Bashbop is a full-stack event marketplace - one platform to create, manage, and monetize events, both in-person and virtual. It handles event creation, a vendor marketplace, Stripe payouts, and live streaming/calls via GetStream.",
      "Built by a small dev team, I owned the entire Next.js frontend end to end while collaborating closely with the backend (NestJS) on integrations - from ticketing and seating to real-time streaming and multi-vendor payments.",
    ],
    goals: {
      intro:
        "The aim was to collapse a messy stack of separate tools into one real-time platform. It needed to:",
      points: [
        "let organizers create, manage, and sell tickets for any event;",
        "host a vendor marketplace with Stripe Connect payouts;",
        "stream low-latency video and calls for virtual and hybrid events;",
        "keep every device in sync in real time.",
      ],
    },

    problem:
      "Event organizers juggle separate tools for ticketing, payments, streaming, and vendor hiring. That's slow, messy, and kills engagement. Bashbop puts it all in one smooth, real-time platform so organizers can actually focus on the event itself.",

    features: [
      "Event Creation & Management",
      "Vendor Marketplace",
      "Live Streaming & Calls",
      "Stripe Connect Payouts",
      "Real-time Updates",
      "Analytics Dashboard",
    ],

    technologies: [
      {
        group: "Frontend",
        items: ["Next.js", "TypeScript", "Tailwind CSS", "Socket.io Client"],
      },
      { group: "Backend", items: ["NestJS", "Node.js", "MongoDB", "Socket.io"] },
      { group: "Infrastructure", items: ["AWS ECS", "Vercel", "Docker"] },
    ],

    journey: [
      {
        phase: "Phase 1",
        title: "Core Event Platform",
        description:
          "Led the Next.js frontend build for event creation, ticketing, seating, and user roles. Backend in NestJS handled auth, payments, and event data.",
        tags: ["Event Management", "Payment Processing", "User Management"],
      },
      {
        phase: "Phase 2",
        title: "Streaming & Call Integration",
        description:
          "Integrated GetStream for calls and WebRTC streaming, ensuring low-latency video and a smooth user experience.",
        tags: ["GetStream", "WebRTC", "Low-Latency Streaming"],
      },
      {
        phase: "Phase 3",
        title: "Analytics & Vendor Marketplace",
        description:
          "Built analytics dashboards in the frontend and implemented vendor booking flows tied to Stripe payouts.",
        tags: ["Analytics", "Marketplace", "Stripe Connect"],
      },
      {
        phase: "Phase 4",
        title: "Engagement Features",
        description:
          "Added features to keep attendees engaged during hybrid events, including gamification and vendor showcases.",
        tags: ["Gamification", "Engagement", "Personalization"],
      },
    ],

    challenges: [
      {
        challenge: "Scalable video calls & streaming",
        solution:
          "Used GetStream for calls and WebRTC for streaming with global CDN delivery to keep latency low even under heavy traffic.",
      },
      {
        challenge: "Multi-vendor payments",
        solution:
          "Integrated Stripe Connect with automated payout scheduling and multi-currency compliance.",
      },
      {
        challenge: "Real-time state sync",
        solution:
          "Built a custom Socket.io layer with offline sync + conflict resolution to keep event data consistent across devices.",
      },
    ],

    results: [
      { value: "50+", label: "Events Hosted", detail: "From small meetups to large conferences" },
      { value: "100K+", label: "Attendees", detail: "Peak concurrent capacity" },
      { value: "99.8%", label: "Stream / Call Uptime", detail: "Stable connections at scale" },
      { value: "85%", label: "Engagement Rate", detail: "Strong attendee interaction through platform features" },
    ],

    learnings: [
      "Integrating GetStream for real-time calls requires careful state management on the frontend to avoid sync issues.",
      "Adaptive bitrate + CDN is non-negotiable for large-scale streaming.",
      "Frontend optimization is critical for real-time apps - milliseconds matter.",
      "Designing for hybrid events means thinking about both physical and virtual audiences at the same time.",
    ],
  },

  /* ---------------------------------------------------------------
   *  DRONECONNECT - drone services marketplace (live)
   * ------------------------------------------------------------- */
  {
    slug: "droneconnect",
    title: "DroneConnect",
    fullTitle:
      "DroneConnect - A two-sided marketplace connecting clients with certified drone pilots across Ireland",

    category: "Full-stack Design & Development",
    industry: "Marketplace / SaaS",
    location: "Ireland",
    year: "2026",

    platform: "Web",
    projectLength: "~8 months",
    since: "2026",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Stripe",
      "Tailwind CSS",
    ],

    tags: ["design", "development"],

    cover:
      "/projects/droneconnect/droneconnect-drone-services-marketplace-homepage.jpg",
    coverAlt:
      "Homepage of DroneConnect with the headline 'Europe's Drone Services Marketplace' over a photo of a drone flying above a field",
    bgColor: "#0A85ED",
    // Dark slate with a sky-blue glow from above - aerial / drone feel.
    previewBg:
      "radial-gradient(120% 80% at 50% -10%, rgba(56,150,235,0.5), transparent 60%), #0d1b2a",
    images: [
      "/projects/droneconnect/droneconnect-drone-services-marketplace-homepage.jpg",
      "/projects/droneconnect/droneconnect-drone-services-marketplace-2.jpg",
    ],
    imageAlts: [
      "Homepage of DroneConnect with the headline 'Europe's Drone Services Marketplace' over a photo of a drone flying above a field",
      "Another view of the DroneConnect marketplace for hiring certified drone pilots",
    ],

    url: "https://droneconnect.co/",
    about: [
      "DroneConnect connects clients who need aerial work with certified, insured drone pilots. Clients post a job; pilots pay a small fee to unlock the details and apply; admins vet every pilot and manage the platform end to end - a marketplace built for the full job lifecycle: post, unlock, hire, pay.",
      "It's a production Next.js 16 application on Supabase that handles the complete flow - role-based onboarding, Stripe payments, queue-backed email and WhatsApp notifications, and a full admin control center - with a marketing identity on droneconnect.ie and the app running on its own subdomain.",
    ],
    goals: {
      intro: "What the build set out to achieve:",
      points: [
        "launch a trusted marketplace where clients find vetted, insured pilots fast;",
        "monetize through a fair pay-to-unlock model powered by Stripe;",
        "reach pilots where they already are, with email and WhatsApp notifications;",
        "give admins full control to approve pilots and run the platform;",
        "migrate ~140 existing pilots onto the platform without friction.",
      ],
    },

    problem:
      "Hiring a certified drone pilot in Ireland meant word-of-mouth and scattered phone calls - no central place to compare qualified, insured operators, and no reliable pipeline of paid work for pilots.",

    features: [
      "Two-sided marketplace",
      "Pay-to-unlock jobs",
      "Multi-channel alerts",
      "Admin control center",
    ],

    technologies: [
      {
        group: "Frontend",
        items: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind CSS v4",
          "Radix UI",
          "Framer Motion",
        ],
      },
      {
        group: "Backend & Data",
        items: [
          "Supabase - Postgres",
          "Supabase Auth & Storage",
          "pg-boss job queue",
          "Zod validation",
        ],
      },
      {
        group: "Payments & Messaging",
        items: [
          "Stripe",
          "Resend - transactional email",
          "Twilio - WhatsApp / SMS",
          "reCAPTCHA v2",
        ],
      },
      {
        group: "Deployment",
        items: ["Vercel", "Vercel Cron", "Analytics & Speed Insights"],
      },
    ],

    challenges: [
      {
        challenge: "Onboard ~140 legacy pilots without insecure password links.",
        solution:
          "A CSV import issues hashed one-time activation tokens, verified through Supabase, so each pilot sets their own password on first login.",
      },
      {
        challenge: "Notifications had to reach pilots reliably across channels.",
        solution:
          "A pg-boss queue dispatches Resend emails and Twilio WhatsApp messages with retries, decoupled from the request cycle so a slow send never blocks a user.",
      },
      {
        challenge: "Job details had to stay locked until a pilot actually paid.",
        solution:
          "Stripe payment intents gate the reveal; a signature-verified webhook - never the client - unlocks the job and records the transaction.",
      },
      {
        challenge: "The app lives on a new subdomain while the brand emails from a legacy domain.",
        solution:
          "A split-domain setup keeps one email identity on droneconnect.ie while the app runs independently on app.droneconnect.co.",
      },
    ],

    results: [
      { value: "500+", label: "Verified Pilots", detail: "IAA · CAA · EASA certified" },
      { value: "60+", label: "Jobs Completed", detail: "Across Ireland, UK & EU" },
      { value: "4.9★", label: "Avg. Rating", detail: "From clients on delivered work" },
    ],

    learnings: [
      "A queue-backed notification layer turns flaky third-party sends into reliable, retryable jobs - and keeps the request path fast.",
      "Token-hash activation is a clean, secure way to migrate existing users onto a new auth system without ever exposing credentials.",
      "In a paid marketplace, value must be gated by a verified webhook, never the client - that boundary is what keeps the model honest.",
    ],
  },

  /* ---------------------------------------------------------------
   *  FLEX FIT - gym brand site + in-house store (built from scratch)
   * ------------------------------------------------------------- */
  {
    slug: "flex-fit",
    title: "Flex Fit",
    fullTitle: "Flex Fit - Where Iron Meets Ambition, Pakistan's premier gym online",

    category: "Design & Development",
    industry: "Fitness / Gym",
    location: "Lahore, Pakistan",
    year: "2026",

    platform: "Web",
    projectLength: "5 weeks",
    since: "2026",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],

    tags: ["design", "development"],

    cover: "/projects/flex-fit/flex-fit-gym-website-homepage.jpg",
    coverAlt:
      "Homepage of the Flex Fit gym website showing gym equipment behind the FLEX FIT logo and 'Where Iron Meets Ambition' tagline",
    bgColor: "#0A85ED",
    // Charcoal with a red glow and diagonal energy lines - the gym's
    // black / red "Iron Meets Ambition" brand.
    previewBg:
      "radial-gradient(circle at 28% 22%, rgba(225,29,42,0.30), transparent 55%), repeating-linear-gradient(120deg, rgba(225,29,42,0.10) 0 2px, transparent 2px 20px), #0c0c0f",
    images: [
      "/projects/flex-fit/flex-fit-gym-website-homepage.jpg",
      "/projects/flex-fit/flex-fit-gym-website-2.jpg",
    ],
    imageAlts: [
      "Homepage of the Flex Fit gym website showing gym equipment behind the FLEX FIT logo and 'Where Iron Meets Ambition' tagline",
      "Another view of the Flex Fit gym website and supplements store",
    ],

    url: "https://flexfit-pk.vercel.app/",
    about: [
      "Flex Fit is Pakistan's premier gym - 'Where Iron Meets Ambition.' They had no website at all, so I built the whole thing in Next.js: an elite, high-energy brand site plus a built-in ecommerce store for supplements, powered by Supabase.",
      "The site covers everything the gym offers - trainers, fat-loss classes, steam & sauna recovery, branches and timings, and flexible membership packages - with an in-house supplements store wired to Supabase for products and orders.",
    ],
    goals: {
      intro:
        "The gym needed one online home that sells the brand and the memberships - and moves product. It needed to:",
      points: [
        "showcase trainers, classes, and premium wellness facilities;",
        "list branches, timings, and membership packages clearly;",
        "run an in-house supplements store on Supabase;",
        "capture leads and drive new sign-ups.",
      ],
    },

    problem:
      "Flex Fit had no website at all - just a growing gym with 500+ members across multiple branches and no way to show it off, sell memberships, or move supplements online. The whole brand lived offline.",

    features: [
      "Trainer Profiles",
      "Fat-Loss Class Programs",
      "Steam & Sauna Recovery",
      "Supplements Store (Supabase)",
      "Branches & Timings",
      "Membership Packages",
    ],

    technologies: [
      { group: "Frontend", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Store & Backend", items: ["Supabase", "Postgres"] },
    ],

    results: [
      { value: "500+", label: "Members", detail: "Training across every branch" },
      { value: "4", label: "Branches", detail: "Premium facilities across Pakistan" },
      { value: "12+", label: "Trainers", detail: "Elite, handpicked coaches" },
    ],
  },
];

/**
 * Site-wide display order. Reorder these slugs to reorder every projects
 * surface (Recent Work, the /work gallery, and the "Next case" cycle).
 * Any project not listed here is appended at the end.
 */
const DISPLAY_ORDER: string[] = [
  "scriptor",
  "quanticx",
  "droneconnect",
  "bashbop",
  "instant-response",
  "lunarisflow",
  "flex-fit",
];

/** All projects in display order - the single source every surface reads. */
export const PROJECTS: Project[] = [
  ...DISPLAY_ORDER.map((slug) =>
    PROJECT_LIST.find((p) => p.slug === slug)
  ).filter((p): p is Project => Boolean(p)),
  ...PROJECT_LIST.filter((p) => !DISPLAY_ORDER.includes(p.slug)),
];

/** Projects featured in the home "Recent Work" section. */
export const RECENT_PROJECTS = PROJECTS.slice(0, 3);

/** Look up a single project by its slug (used by the detail route). */
export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug);

/** Neighbouring project for the "Next project" link on the detail page. */
export const getNextProject = (slug: string): Project => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};
