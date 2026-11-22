export type ToolboxCategory = "Frontend" | "Backend" | "Data / Infrastructure" | "Quality";
export type ToolboxEvidence = {
  title: string;
  detail: string;
  href?: string;
  studyId?: string;
};
export type ToolboxTechnology = {
  name: string;
  category: ToolboxCategory;
  summary: string;
  evidence: ToolboxEvidence[];
};
export const toolboxCategories: ToolboxCategory[] = [
  "Frontend",
  "Backend",
  "Data / Infrastructure",
  "Quality",
];
const gaming = {
  title: "Production gaming applications",
  detail: "Shared interfaces, real-time gameplay, and reusable infrastructure at Arrise.",
  href: "#experience",
};
const sneaky = (detail: string): ToolboxEvidence => ({
  title: "Sneaky",
  detail,
  href: "#case-study-sneaky-platform",
  studyId: "sneaky-platform",
});
const snapgram = (detail: string): ToolboxEvidence => ({
  title: "Snapgram",
  detail,
  href: "#case-study-snapgram",
  studyId: "snapgram",
});
const journal = (detail: string): ToolboxEvidence => ({
  title: "VibeJournal · in development",
  detail,
  href: "#case-study-vibejournal",
  studyId: "vibejournal",
});
const quality = (detail: string): ToolboxEvidence => ({
  title: "Frontend quality at Arrise",
  detail,
  href: "#career-software-development-engineer-i",
});

export const toolboxTechnologies: ToolboxTechnology[] = [
  {
    name: "React",
    category: "Frontend",
    summary: "Component systems, interactive products, and shared production interfaces.",
    evidence: [
      gaming,
      sneaky("Swipe discovery, cart, wishlist, and authenticated product flows."),
      snapgram("Social feeds, profiles, post creation, and responsive navigation."),
      journal("Mood check-ins and dashboard components built with Next.js and React."),
    ],
  },
  {
    name: "TypeScript",
    category: "Frontend",
    summary: "Typed contracts across interfaces, application state, and reusable packages.",
    evidence: [
      quality("TypeScript-first development across shared frontend systems."),
      sneaky("Typed React UI and Redux Toolkit state."),
      snapgram("Typed forms and schema-driven validation."),
      journal("Typed mood-entry flows and visual analytics foundations."),
    ],
  },
  {
    name: "JavaScript",
    category: "Frontend",
    summary: "Browser behavior and small, independently tested interaction modules.",
    evidence: [
      {
        title: "This portfolio",
        detail:
          "JavaScript modules handle command search, navigation, request playback, and the isolated toast event bus. Their behavior is checked with Node tests.",
      },
    ],
  },
  {
    name: "Next.js",
    category: "Frontend",
    summary: "React application structure and server-rendered portfolio pages.",
    evidence: [
      journal("Application foundation for the mood journal and dashboard prototype."),
      {
        title: "This portfolio",
        detail:
          "App Router pages with focused client components for interactive engineering demonstrations.",
      },
    ],
  },
  {
    name: "Redux",
    category: "Frontend",
    summary: "Coordinated product state and predictable feed updates.",
    evidence: [
      sneaky(
        "Redux Toolkit slices and async thunks coordinate swipe state, cached feed pages, cart, wishlist, and duplicate-free prefetch."
      ),
    ],
  },
  {
    name: "Web Workers",
    category: "Frontend",
    summary: "Synchronization work separated from the main UI thread.",
    evidence: [
      {
        title: "Real-Time Plinko",
        detail:
          "Worker-driven timing and event ordering coordinate gameplay state with scheduled UI animations.",
        href: "#case-study-plinko-ui",
        studyId: "plinko-ui",
      },
    ],
  },
  {
    name: "Java",
    category: "Backend",
    summary: "Backend product logic and integrations behind interactive interfaces.",
    evidence: [
      sneaky(
        "Spring Boot APIs implement authentication, product logic, and recommendation requests."
      ),
      {
        title: "Free Chips Promotional Wallet",
        detail:
          "Full-stack promotional-wallet integration across shared Core and game-specific behavior.",
        href: "#case-study-free-chips",
        studyId: "free-chips",
      },
    ],
  },
  {
    name: "Spring Boot",
    category: "Backend",
    summary: "API boundaries for authentication, commerce, and recommendation services.",
    evidence: [
      sneaky(
        "JWT-secured APIs support merchant checkout, product discovery, and recommendation orchestration."
      ),
    ],
  },
  {
    name: "PostgreSQL",
    category: "Data / Infrastructure",
    summary: "Persistent product records behind cached recommendation IDs.",
    evidence: [
      sneaky(
        "Product data stays authoritative in PostgreSQL; API enrichment preserves Redis ranking order."
      ),
      journal(
        "Prisma models are designed for PostgreSQL; persisted entries remain planned, not shipped."
      ),
    ],
  },
  {
    name: "Redis",
    category: "Data / Infrastructure",
    summary: "Cache-aside reads that avoid repeated recommendation scoring.",
    evidence: [
      sneaky(
        "Guest and user-specific ranked product IDs are cached for recommendation reads, with scoring fallback on cache misses."
      ),
    ],
  },
  {
    name: "Kafka",
    category: "Data / Infrastructure",
    summary: "Activity events decoupled from synchronous product requests.",
    evidence: [
      sneaky(
        "Analytics and event pipelines process views, passes, wishlist, and cart signals outside the feed request path."
      ),
    ],
  },
  {
    name: "Docker",
    category: "Data / Infrastructure",
    summary: "Repeatable local development across application and data services.",
    evidence: [
      sneaky(
        "Docker Compose brings up frontend, backend, PostgreSQL, Redis, and supporting services together."
      ),
    ],
  },
  {
    name: "Jest",
    category: "Quality",
    summary: "Automated checks as part of frontend delivery.",
    evidence: [
      quality(
        "Jest/Bun testing is documented alongside production frontend quality and stability work."
      ),
    ],
  },
  {
    name: "RTL",
    category: "Quality",
    summary: "React Testing Library · behavior-focused component testing.",
    evidence: [],
  },
  {
    name: "Storybook",
    category: "Quality",
    summary: "Component coverage and verification across responsive gameplay layouts.",
    evidence: [
      {
        title: "Real-Time Plinko",
        detail:
          "Storybook coverage, Figma verification, and visual regression testing support desktop and portrait/landscape layouts.",
        href: "#case-study-plinko-ui",
        studyId: "plinko-ui",
      },
    ],
  },
  {
    name: "CI/CD",
    category: "Quality",
    summary: "Delivery reliability alongside frontend testing and performance work.",
    evidence: [
      quality(
        "CI/CD stabilization supports shared game infrastructure and production frontend delivery."
      ),
    ],
  },
];
