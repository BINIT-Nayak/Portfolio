export type ProjectAction = {
  label: string;
  href: string;
  disabled?: boolean;
  disabledReason?: string;
};
export type ShowcaseProject = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  layout: "flagship" | "social" | "journal";
  statement: string;
  challenge: string;
  architecture: string;
  img: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageCaption: string;
  techStack: string[];
  capabilities: { value: string; label: string }[];
  roadmap?: string;
  actions: ProjectAction[];
};

export const projects: ShowcaseProject[] = [
  {
    id: "sneaky",
    title: "Sneaky",
    subtitle: "Hybrid Fashion Discovery Platform",
    category: "01 / Full-stack product engineering",
    layout: "flagship",
    statement:
      "Swipe-led discovery, backed by an explainable recommendation system and practical commerce flows.",
    challenge:
      "Keep repeat feed loads useful while new recommendations arrive, and preserve discovery when cache, analytics, or optional ML services are unavailable.",
    architecture:
      "React and Redux Toolkit coordinate a cache-first feed with JWT-secured Java/Spring Boot APIs. PostgreSQL stores product records; Redis caches ranked IDs. Opt-in Kafka analytics update preferences asynchronously. A separate FastAPI/scikit-learn reranker is implemented behind a feature flag, with rule-based fallback.",
    img: "/assests/sneaky_thumbnail.png",
    imageAlt: "Sneaky home screen with swipe discovery, wishlist, cart, and sign-in entry points",
    imageWidth: 2416,
    imageHeight: 1752,
    imageCaption: "Discovery entry point · React frontend",
    techStack: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "JWT",
      "Docker",
      "FastAPI",
      "scikit-learn",
    ],
    capabilities: [
      {
        value: "250 → 30",
        label: "Candidate scoring and bounded feed results",
      },
      {
        value: "15 min",
        label: "Redis ranking-cache TTL",
      },
      {
        value: "Cache-first UI",
        label: "Persisted feed state, deferred refresh, and service-worker image caching",
      },
    ],
    actions: [
      {
        label: "Live Demo",
        href: "https://sneaky-4zjb.onrender.com/",
      },
      {
        label: "GitHub Frontend",
        href: "https://github.com/BINIT-Nayak/Sneaky",
      },
      {
        label: "GitHub Backend",
        href: "https://github.com/BINIT-Nayak/Sneaky_Backend",
      },
      {
        label: "Case Study",
        href: "#case-study-sneaky-platform",
      },
    ],
    roadmap:
      "Checkout redirects to merchant sites; Sneaky does not process payments. Kafka and ML are optional integrations. Model-quality improvements and live deployment configuration were not verified in this review.",
  },
  {
    id: "snapgram",
    title: "Snapgram",
    subtitle: "Social Platform",
    category: "02 / Frontend application architecture",
    layout: "social",
    statement:
      "A responsive social platform with optimistic interactions, virtualized discovery, and consistent data across feeds and profiles.",
    challenge:
      "Keep likes, saves, follows, and comments responsive across cached views, then recover coherently when a mutation fails.",
    architecture:
      "React 19 and Appwrite provide auth, records, and media storage. TanStack Query coordinates optimistic updates, rollback, and invalidation; TanStack Virtual renders responsive Explore rows. React Hook Form and Zod validate forms, with RTL/MSW and Playwright test coverage in the repository.",
    img: "/assests/snapgram_thumbnail.png",
    imageAlt:
      "Snapgram feed showing sidebar navigation, a creator profile, a post, and like and save controls",
    imageWidth: 2332,
    imageHeight: 1558,
    imageCaption: "Feed and post interactions · React + Appwrite",
    techStack: [
      "React 19",
      "TypeScript",
      "Appwrite",
      "TanStack Query",
      "TanStack Virtual",
      "React Hook Form",
      "Zod",
      "Vitest / RTL",
    ],
    capabilities: [
      {
        value: "Optimistic UI",
        label: "Likes, saves, follows, and comments with rollback paths",
      },
      {
        value: "Virtualized Explore",
        label: "Responsive row virtualization and debounced search",
      },
      {
        value: "Layered tests",
        label: "Vitest/RTL components, MSW integration, and a Playwright journey",
      },
    ],
    actions: [
      {
        label: "Live Demo",
        href: "https://snapgram-two-kappa.vercel.app/",
      },
      {
        label: "GitHub",
        href: "https://github.com/BINIT-Nayak/Snapgram",
      },
      {
        label: "Case Study",
        href: "#case-study-snapgram",
      },
    ],
    roadmap:
      "Comments, likes, and follows depend on configured Appwrite collections and permissions. Denormalized counters are best-effort client updates, not transactional server aggregates.",
  },
  {
    id: "vibejournal",
    title: "VibeJournal",
    subtitle: "Mood Journal and Reflection Platform",
    category: "03 / Offline-capable full-stack systems",
    layout: "journal",
    statement:
      "A private mood journal with persisted entries, offline mutation replay, visual analytics, and consent-gated reflection.",
    challenge:
      "Preserve local edits through connection loss and concurrent changes while keeping journal ownership, privacy, and explicit conflict resolution intact.",
    architecture:
      "Next.js and Auth.js protect Prisma/PostgreSQL journal APIs. Dexie/IndexedDB stores drafts and ordered mutations; server receipts make retries idempotent. AES-256-GCM protects server-side journal content, Redis optionally caches analytics, and provider adapters isolate Anthropic reflections and iTunes catalog suggestions.",
    img: "/assests/VibeJournal_thumbnail.png",
    imageAlt:
      "VibeJournal prototype dashboard with mood summary, check-in action, journal entry point, and trend cards",
    imageWidth: 2434,
    imageHeight: 1634,
    imageCaption:
      "Earlier dashboard capture · implementation now includes persistence and offline synchronization",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Auth.js",
      "Prisma",
      "PostgreSQL",
      "Dexie / IndexedDB",
      "Redis",
      "Vitest / RTL",
    ],
    capabilities: [
      {
        value: "Offline mutations",
        label: "Ordered create/update/delete replay with explicit conflict resolution",
      },
      {
        value: "Private by design",
        label: "Owner-scoped APIs, server-side encryption, export, and account deletion",
      },
      {
        value: "Consent-gated AI",
        label: "Journal analysis and aggregate-only weekly reflections through Anthropic adapters",
      },
    ],
    roadmap:
      "Implemented in the local repository; no public demo URL was verified. Offline use requires an already-loaded app—there is no offline app shell or closed-browser sync. Encryption is server-side, not end-to-end. Music uses iTunes catalog search, not a Spotify playlist API.",
    actions: [
      {
        label: "Live Demo",
        href: "",
        disabled: true,
        disabledReason: "Demo URL not provided",
      },
      {
        label: "GitHub",
        href: "https://github.com/BINIT-Nayak/VibeJournal",
      },
      {
        label: "Case Study",
        href: "#case-study-vibejournal",
      },
      {
        label: "Offline Sync Deep Dive",
        href: "/case-studies/vibejournal-offline-sync",
      },
    ],
  },
];
