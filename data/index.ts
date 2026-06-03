export const navItems = [
  { name: "About", link: "#about" },
  { name: "Experience", link: "#experience" },
  { name: "Projects", link: "#projects" },
  { name: "Case Studies", link: "#case-studies" },
  { name: "What I Bring", link: "#what-i-bring" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: " Production Frontend Engineering.",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full myphoto-width",
    titleClassName: "justify-end  title-width title-black",
    img: "/assests/myPhoto.jpg",
    spareImg: "",
  },
  {
    id: 2,
    title:
      "I build full-stack projects using Spring Boot, PostgreSQL, Redis, Kafka, Docker, JWT, and React.",
    description: "Full-Stack Product Building",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title:
      "I work on shared components, scalable frontend patterns, reusable betting logic, and maintainable React/TypeScript systems.",
    description: "Reusable UI Architecture",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },

  {
    id: 4,
    title:
      "TypeScript discipline, Jest testing, Figma-to-code accuracy, performance-aware implementation, code reviews, and AI-assisted productivity.",
    description: "Modern Engineering Practices",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/assests/grid.svg",
    spareImg: "/assests/b4.svg",
  },

  {
    id: 5,
    title: "",
    description: "Tech Stack",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "",
    spareImg: "/assests/b5.svg",
  },
  {
    id: 6,
    title:
      "System design, Next.js, performance optimization, CI/CD, and production-grade full-stack deployment.",
    description: "Currently Improving",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full text-start",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Sneaky",
    subtitle: "Full-Stack Fashion Discovery Platform",
    des: "A swipe-based fashion discovery platform with personalized recommendations, wishlist, cart, merchant checkout, product analytics, admin flows, and Dockerized development.",
    img: "/assests/p1.svg",
    techStack: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Docker",
      "JWT",
    ],
    highlights: [
      "Built 2 applications: React frontend and Spring Boot backend",
      "Developed 20+ API flows",
      "Implemented recommendation engine using 8+ ranking signals",
      "Added Kafka/Redis analytics for 3+ user activity types",
      "Added Docker Compose setup for frontend, backend, PostgreSQL, and Redis",
    ],
    actions: [
      { label: "Live Demo", href: "", disabled: true },
      { label: "GitHub Frontend", href: "https://github.com/BINIT-Nayak/Sneaky" },
      {
        label: "GitHub Backend",
        href: "https://github.com/BINIT-Nayak/Sneaky_Backend",
      },
      { label: "Case Study", href: "#case-study-sneaky-platform" },
    ],
    featured: true,
  },
  {
    id: 2,
    title: "Snapgram",
    subtitle: "Social Media Web Application",
    des: "A responsive social media app with authentication, post creation/editing, image uploads, feed browsing, profile pages, likes, saves, search, and responsive navigation.",
    img: "/assests/snapgramBanner.png",
    techStack: [
      "React 18",
      "TypeScript",
      "Appwrite",
      "TanStack React Query",
      "React Hook Form",
      "Zod",
      "Tailwind CSS",
      "Radix UI",
    ],
    highlights: [
      "Built 8+ core features",
      "Integrated 3 Appwrite services: Auth, Database, Storage",
      "Designed 3 primary collections: users, posts, saves",
      "Used React Query for caching, query keys, and invalidation",
      "Used React Hook Form + Zod for type-safe validation",
    ],
    actions: [
      { label: "Live Demo", href: "", disabled: true },
      { label: "GitHub", href: "https://github.com/BINIT-Nayak/Snapgram" },
      { label: "Case Study", href: "#case-study-snapgram" },
    ],
  },
  {
    id: 3,
    title: "VibeJournal",
    subtitle: "Mood Journal and Reflection Platform",
    des: "An in-development private mood journal for quick emotional check-ins, deeper reflection, CBT-inspired insights, trend visualization, and future music recommendations.",
    img: "/assests/p2.svg",
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "CSS Modules",
      "Canvas Charts",
      "OpenAI",
      "Spotify API",
    ],
    highlights: [
      "Built an MVP flow for mood check-ins with energy, stress, valence, notes, and tags",
      "Designed Prisma models for users, mood entries, journal entries, and playlist recommendation runs",
      "Added native Canvas chart foundations for visualizing mood and emotional patterns",
      "Planned OpenAI-powered reflection insights and Spotify-based playlist suggestions",
      "Upcoming: authentication, persisted database entries, journal history, and recommendation workflows",
    ],
    actions: [
      { label: "Live Demo", href: "", disabled: true },
      { label: "GitHub", href: "https://github.com/BINIT-Nayak/VibeJournal" },
    ],
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Software Development Engineer I",
    company: "Arrise Solutions",
    period: "Jul 2024 – Present",
    highlights: [
      "Built production-level React casino game UI across desktop, portrait, large portrait, and landscape layouts.",
      "Delivered Toast Messages 2.0, replacing 5+ legacy blocking popups with lightweight, localized toast notifications.",
      "Owned major Plinko UI areas across 20+ feature areas including BetSpot, Bet on All, BetPool, crowd meter, animations, tooltips, store setup, and browser-specific fixes.",
      "Implemented 8+ gameplay animation flows including chip placement, win chip, BetSpot transitions, booster animations, and ball drop interactions.",
      "Acted as a primary MR reviewer for Plinko, reviewing feature logic, edge cases, maintainability, and regression risks.",
      "Collaborated with Product, Design, QA, Video, and Game Framework teams to clarify requirements and stabilize production delivery.",
    ],
    thumbnail: "/assests/exp1.svg",
  },
  {
    id: 4,
    title: "Software Intern",
    company: "Arrise Solutions",
    period: "Jan 2024 – Jun 2024",
    highlights: [
      "Implemented frontend logic for Free Chips / Free Bet Bonus Campaign across multiple React games and shared frameworks.",
      "Worked on bonus chip-based betting flows including balance validation, chip selection, bet restrictions, campaign eligibility, and low-balance handling.",
      "Revised Privé table validation to support both real-money balance and Free Chips.",
      "Collaborated with Product, QA, Backend, and Game Framework teams to validate API behavior and release production-ready features.",
      "Built reusable game history UI components with unit tests.",
    ],
    thumbnail: "/assests/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/assests/git.svg",
    link: "https://github.com/BINIT-Nayak",
  },
  {
    id: 2,
    img: "/assests/twit.svg",
    link: "https://x.com/BinitNayak48",
  },
  {
    id: 3,
    img: "/assests/link.svg",
    link: "https://www.linkedin.com/in/binitnayak2002/",
  },
];
