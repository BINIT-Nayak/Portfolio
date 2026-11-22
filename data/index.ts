export const navItems = [
  { name: "Featured Projects", link: "#projects" },
  { name: "Experience", link: "#experience" },
  { name: "Case Studies", link: "#case-studies" },
  { name: "Open Source", link: "#open-source" },
  { name: "About", link: "#about" },
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
    description: "Engineering Toolbox",
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

export { projects } from "./projects";

export const workExperience = [
  {
    id: 1,
    slug: "software-development-engineer-i",
    title: "Software Development Engineer I",
    company: "Arrise Solutions",
    period: "Jul 2025 – Present",
    startDate: "2025-07",
    endDate: null,
    highlights: [
      "Own Plinko frontend engineering, delivering real-time gameplay with 6+ cross-functional teams.",
      "Designed Web Worker synchronization and an interruption-safe WAAPI framework for ~28 coordinated gameplay animations.",
      "Architected Toast 2.0, a shared notification platform adopted across 50+ games.",
    ],
    additionalContributions: [
      "Drive frontend quality through TypeScript-first development, Jest/Bun testing, Storybook, Visual Regression Testing, performance optimization, and CI/CD stabilization.",
      "Review major merge requests and contribute to architecture decisions, reusable engineering patterns, cross-browser reliability, and production stability across shared game infrastructure.",
    ],
    technologies: ["React", "TypeScript", "Web Workers", "WebSocket", "WAAPI"],
    systems: ["Real-time Plinko", "Toast 2.0", "Shared animation infrastructure"],
  },
  {
    id: 2,
    slug: "associate-software-engineer",
    title: "Associate Software Engineer",
    company: "Arrise Solutions",
    period: "Jul 2024 – Jul 2025",
    startDate: "2024-07",
    endDate: "2025-07",
    highlights: [
      "Delivered Free Chips across 4+ production games, supporting 130+ campaigns across 37 brands and nearly 67K free chips issued in Q2.",
      "Contributed to a parallel promotional wallet across 21 games, keeping shared Core and game-specific behavior consistent.",
      "Extended Free Chips to Blackjack’s multi-seat betting model, including side bets, seat limits, automated betting, and refunds.",
    ],
    additionalContributions: [
      "Built reusable frontend modules and business-critical betting logic covering campaign eligibility, balance validation, betting restrictions, and low-balance scenarios.",
    ],
    technologies: ["React", "TypeScript", "Java", "Kafka", "PostgreSQL"],
    systems: ["Free Chips campaigns", "Promotional wallet", "Blackjack integration"],
  },
  {
    id: 3,
    slug: "software-intern",
    title: "Software Intern",
    company: "Arrise Solutions",
    period: "Jan 2024 – Jun 2024",
    startDate: "2024-01",
    endDate: "2024-06",
    highlights: [
      "Built a reusable React History Web Component across 50+ games, replacing duplicated implementations with support for 12 game types.",
      "Packaged History as a separately bundled, S3-hosted asset for on-demand loading without coupling it to individual game bundles.",
      "Contributed to History, Game Help, localization, and common UI while resolving cross-platform and certification requirements.",
    ],
    additionalContributions: [
      "Collaborated with senior engineers and game teams to integrate reusable frontend components across existing game implementations.",
    ],
    technologies: ["React", "Web Components", "Amazon S3"],
    systems: ["Shared History component", "Game Help", "Localization"],
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
