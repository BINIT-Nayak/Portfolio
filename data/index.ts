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
    title:
      "Building production-grade frontend systems with React, TypeScript, responsive UI architecture, and animation-heavy user experiences.",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full myphoto-width",
    titleClassName: "justify-end  title-width title-white",
    img: "/assests/myPhoto.jpg",
    spareImg: "",
  },
  {
    id: 2,
    title:
      "Designing and developing full-stack applications using Spring Boot, PostgreSQL, Redis, Kafka, Docker, JWT, and modern React ecosystems.",
    description: "Full-Stack Product Development",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title:
      "Creating reusable component libraries, scalable frontend architecture, shared design systems, and maintainable TypeScript codebases.",
    description: "Scalable Frontend Architecture",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },

  {
    id: 4,
    title:
      "Focused on performance, testing, Figma-to-code precision, clean code reviews, and AI-assisted engineering to deliver reliable software faster.",
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
    img: "/assests/sneaky_thumbnail.png",
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
      { label: "Live Demo", href: "https://sneaky-4zjb.onrender.com/", disabled: false },
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
    img: "/assests/snapgram_thumbnail.png",
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
      { label: "Live Demo", href: "https://snapgram-two-kappa.vercel.app/", disabled: false },
      { label: "GitHub", href: "https://github.com/BINIT-Nayak/Snapgram" },
      { label: "Case Study", href: "#case-study-snapgram" },
    ],
  },
  {
    id: 3,
    title: "VibeJournal",
    subtitle: "Mood Journal and Reflection Platform",
    des: "An in-development private mood journal for quick emotional check-ins, deeper reflection, CBT-inspired insights, trend visualization, and future music recommendations.",
    img: "/assests/VibeJournal_thumbnail.png",
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
      "Owned frontend development for production React-based gaming applications, delivering responsive, interactive experiences across desktop and multiple mobile layouts.",
      "Designed and implemented Toast Messages 2.0, a reusable notification framework that replaced 5+ legacy blocking popups with lightweight, localized, and animation-driven toasts.",
      "Built reusable gameplay UI components, responsive layouts, and complex state-driven interactions while ensuring pixel-perfect Figma implementation and cross-browser compatibility.",
      "Implemented performant animation systems and optimized rendering for real-time user interactions, improving responsiveness and maintaining smooth gameplay experiences.",
      "Served as a primary merge request reviewer, improving code quality, maintainability, architecture consistency, and reducing regression risks across the team.",
      "Collaborated with Product, Design, QA, Backend, and Framework teams to deliver production features, resolve edge cases, and maintain stable releases.",
    ],
    thumbnail: "/assests/exp1.svg",
  },
  {
    id: 2,
    title: "Software Intern",
    company: "Arrise Solutions",
    period: "Jan 2024 – Jun 2024",
    highlights: [
      "Implemented the Free Chips (Free Bet Bonus Campaign) feature across multiple React games and shared frameworks, enabling bonus-based betting workflows.",
      "Developed reusable business logic for balance validation, campaign eligibility, betting restrictions, and shared gameplay flows across multiple products.",
      "Enhanced gameplay validation to support promotional balance alongside cash balance, improving campaign accessibility and user experience.",
      "Partnered with Product, QA, Backend, and Framework teams to validate APIs, troubleshoot production issues, and deliver reliable releases.",
      "Built reusable game history components and comprehensive unit tests, improving maintainability and reliability of shared frontend modules.",
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
