export type ProjectAction = { label: string; href: string; disabled?: boolean };
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
      "Keep the feed fast and personal without repetitive results—or making an external ML service a dependency for discovery.",
    architecture:
      "React and Redux coordinate the feed with JWT-secured Spring Boot APIs. PostgreSQL owns product data; Redis cache-aside reads preserve ranked product IDs. Kafka analytics events update preference signals, while optional ML reranking falls back to the rule-based order.",
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
    ],
    capabilities: [
      { value: "20+", label: "API flows across discovery and commerce" },
      { value: "15 min", label: "Redis ranking-cache TTL" },
      {
        value: "Merchant checkout",
        label: "Grouped outbound links, wishlist-to-cart, and reminders",
      },
    ],
    actions: [
      { label: "Live Demo", href: "https://sneaky-4zjb.onrender.com/" },
      { label: "GitHub Frontend", href: "https://github.com/BINIT-Nayak/Sneaky" },
      { label: "GitHub Backend", href: "https://github.com/BINIT-Nayak/Sneaky_Backend" },
      { label: "Case Study", href: "#case-study-sneaky-platform" },
    ],
  },
  {
    id: "snapgram",
    title: "Snapgram",
    subtitle: "Social Platform",
    category: "02 / Frontend application architecture",
    layout: "social",
    statement:
      "A responsive social experience that keeps feeds, profiles, and post interactions consistent as users create and explore.",
    challenge:
      "Keep likes, saves, uploads, and edited posts in sync across screens while validating forms before they reach the backend.",
    architecture:
      "React connects to Appwrite Auth, Database, and Storage. React Query manages query keys, caching, and mutation invalidation; React Hook Form and Zod handle typed forms and validation. Responsive navigation keeps the same flows usable on smaller screens.",
    img: "/assests/snapgram_thumbnail.png",
    imageAlt:
      "Snapgram feed showing sidebar navigation, a creator profile, a post, and like and save controls",
    imageWidth: 2332,
    imageHeight: 1558,
    imageCaption: "Feed and post interactions · React + Appwrite",
    techStack: [
      "React",
      "TypeScript",
      "Appwrite",
      "React Query",
      "React Hook Form",
      "Zod",
      "Tailwind CSS",
    ],
    capabilities: [
      { value: "8+", label: "Core flows, including auth, posts, search, likes, and saves" },
      { value: "3", label: "Appwrite services: Auth, Database, Storage" },
      { value: "Typed forms", label: "Schema validation with React Hook Form + Zod" },
    ],
    actions: [
      { label: "Live Demo", href: "https://snapgram-two-kappa.vercel.app/" },
      { label: "GitHub", href: "https://github.com/BINIT-Nayak/Snapgram" },
      { label: "Case Study", href: "#case-study-snapgram" },
    ],
  },
  {
    id: "vibejournal",
    title: "VibeJournal",
    subtitle: "Mood Journal and Reflection Platform",
    category: "03 / In development",
    layout: "journal",
    statement:
      "A mood-journaling product in progress: quick check-ins, visual patterns, and a foundation for deeper reflection.",
    challenge:
      "Make emotional check-ins lightweight while creating useful visual analytics from energy, stress, valence, notes, and tags.",
    architecture:
      "A Next.js interface pairs mood-entry flows with native Canvas chart foundations. Prisma models are designed for PostgreSQL persistence; authentication, saved history, AI reflection, and Spotify recommendation workflows are upcoming.",
    img: "/assests/VibeJournal_thumbnail.png",
    imageAlt:
      "VibeJournal prototype dashboard with mood summary, check-in action, journal entry point, and trend cards",
    imageWidth: 2434,
    imageHeight: 1634,
    imageCaption: "Current prototype · mood dashboard and check-in entry point",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Canvas",
      "Prisma models",
      "PostgreSQL (planned persistence)",
      "OpenAI (planned)",
      "Spotify API (planned)",
    ],
    capabilities: [
      { value: "5 inputs", label: "Energy, stress, valence, notes, and tags in the check-in flow" },
      { value: "Canvas", label: "Visual analytics foundations for emotional patterns" },
      {
        value: "Data models",
        label: "Users, mood entries, journals, and playlist recommendation runs",
      },
    ],
    roadmap:
      "Next: authentication and persisted history, followed by AI reflection and Spotify recommendations. These integrations are planned, not shipped features.",
    actions: [
      { label: "Live Demo", href: "", disabled: true },
      { label: "GitHub", href: "https://github.com/BINIT-Nayak/VibeJournal" },
      { label: "Case Study", href: "#case-study-vibejournal" },
    ],
  },
];
