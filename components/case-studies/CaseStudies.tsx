"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaCalendarDays, FaClock, FaXmark } from "react-icons/fa6";

import style from "./CaseStudies.module.css";

const caseStudies = [
  {
    id: "toast-messages",
    title: "Toast Messages 2.0 — Shared Notification Platform",
    date: "2025",
    readTime: "6 min read",
    tags: [
      "React",
      "TypeScript",
      "UI Architecture",
      "Gestures",
      "Animations",
      "Accessibility",
      "Production UX",
    ],

    summary:
      "Architected and implemented a configurable notification system adopted across 50+ games, consolidating ~120 toast variants and 20+ blocking popups into a shared, service-driven architecture.",

    description:
      "Toast 2.0 redesigned game notifications from a single-message, blocking feedback model into a scalable notification platform supporting concurrent messages, richer content, actions, gesture interactions, coordinated animations, localization, and responsive behavior across real-time gaming experiences.",

    role: "Architecture, implementation, interaction design, shared component engineering, migration strategy, performance optimization, and cross-game integration",

    outcome:
      "Established a reusable notification architecture for 50+ games, reducing fragmented toast and popup implementations while enabling richer, non-blocking player feedback through a consistent configurable API.",

    metrics: [
      {
        label: "Game Adoption",
        value: "50+",
        detail: "Games supported by the shared notification architecture",
      },
      {
        label: "Toast Variants",
        value: "~120",
        detail: "Existing notification variants consolidated",
      },
      {
        label: "Legacy Popups",
        value: "20+",
        detail: "Blocking popup use cases migrated toward Toast 2.0",
      },
      {
        label: "Animations",
        value: "10",
        detail: "Coordinated stack and interaction animations",
      },
    ],

    architecture: [
      "Designed a service-driven architecture that separates notification creation and lifecycle management from rendering, allowing game features to trigger Toast 2.0 through a consistent API.",
      "Structured the system around service, stack, and individual-toast responsibilities: event orchestration, stack/layout management, and isolated notification rendering.",
      "Expanded the content model from a single message and action into title + body content with primary and secondary actions, custom icons, timers, and specialized notification behavior.",
      "Built stack orchestration for multiple concurrent notifications using ordering, transforms, offsets, scaling, and z-index management, with a 3-layer collapsed preview and expandable stack.",
      "Implemented 10 coordinated animations covering toast entry/exit, stack movement, expansion/collapse, gesture interactions, and layout transitions.",
      "Used transform-based animations and requestAnimationFrame-driven layout updates to minimize layout-heavy work during interaction and stack changes.",
      "Designed lifecycle handling for timers, pause/resume behavior, queued notifications, duplicate removal, cleanup, and interruption-safe dismissal.",
      "Kept the architecture localization-ready and reusable across different game surfaces, screen sizes, orientations, and notification use cases.",
    ],

    challengesSolved: [
      "Legacy notifications were fragmented across ~120 toast variants and 20+ blocking popup use cases, so I consolidated them behind a configurable shared architecture instead of maintaining feature-specific implementations.",

      "The previous model could effectively surface one flat notification at a time. Toast 2.0 supports multiple concurrent notifications through coordinated stacking, visual hierarchy, and expand/collapse interactions.",

      "Blocking dialogs interrupted time-sensitive gameplay, so eligible feedback was redesigned as non-blocking notifications while preserving visibility and actionable player communication.",

      "Concurrent notifications introduced complex layout and animation dependencies, requiring coordinated transitions so entering, leaving, expanding, and collapsing toasts did not visually conflict.",

      "Duplicate events could repeatedly surface identical messages, so duplicate detection and lifecycle handling were centralized at the service layer.",

      "Different notifications required different interaction models, so the API supports title/body content, up to 2 actions, custom icons, timed and persistent notifications, undo flows, betting feedback, and support-related messaging.",

      "Touch and desktop interactions required different behavior, so dismissal supports left, right, and upward swipe gestures alongside desktop interaction and timer pause behavior.",

      "Responsive gameplay layouts required notifications to remain usable across desktop, tablet, mobile, and orientation changes, including dynamic stack sizing and automatic layout recalculation.",

      "Long-running game sessions required predictable cleanup, so timers, subscriptions, animation state, and component destruction were handled explicitly to avoid stale UI behavior and resource leaks.",

      "Accessibility requirements were incorporated through alert semantics, live-region behavior, keyboard/focus considerations, and interaction states that did not rely exclusively on gestures.",
    ],

    details: [
      "Architected and implemented Toast 2.0 as a shared notification system intended for adoption across 50+ games.",
      "Consolidated ~120 notification variants and 20+ popup use cases behind a configurable service-driven interface.",
      "Expanded notifications from 1 text slot + 1 action to title + body + primary/secondary actions.",
      "Implemented a 7-second default timer with pause/resume behavior and support for persistent action-driven notifications.",
      "Built a 3-layer collapsed stack with expand/collapse behavior for handling multiple concurrent notifications without overwhelming gameplay.",
      "Implemented 10 coordinated animations and multi-direction swipe dismissal while keeping transitions transform-oriented for smoother runtime performance.",
      "Added duplicate handling, queue/pause behavior, configurable actions, custom icons, undo flows, and support-related notification use cases.",
      "Handled responsive behavior across multiple layouts and orientation changes while maintaining localization and accessibility support.",
      "Documented APIs, notification types, integration patterns, migration guidance, testing recommendations, and troubleshooting practices to support wider adoption.",
    ],
  },
  {
    id: "plinko-ui",
    title: "Project: Real-Time Plinko Game",
    date: "2026",
    readTime: "7 min read",
    tags: ["React", "TypeScript", "WebSocket", "Web Workers", "WAAPI", "Real-Time Systems"],

    summary:
      "Owned and engineered a real-time Plinko game spanning frontend architecture, backend-to-UI event integration, Web Worker-based synchronization, ~28 coordinated animation sequences, and responsive gameplay across 4 layouts.",

    description:
      "A production real-time game where backend-driven events, sequential ball drops, betting state, multipliers, video timing, and animation-heavy UI must remain synchronized. My work covered frontend architecture, Game Server/WebSocket integration, event-processing flows, responsive UI, animation systems, reconnection handling, performance optimization, and production stabilization.",

    role: "Primary frontend contributor with ownership across gameplay architecture, real-time Game Server integration, animation systems, responsive UI, technical coordination, MR reviews, and production readiness while collaborating with 6+ cross-functional teams.",

    outcome:
      "Delivered a production-ready real-time gameplay system connecting server-driven events to a responsive React UI, with resilient event synchronization, reusable animation infrastructure, refresh/reconnection recovery, and consistent behavior across 4 responsive layouts.",

    challengesSolved: [
      "Integrated real-time backend-to-frontend WebSocket communication, consuming sequenced Game Server events carrying gameplay phase, multiplier, and time-to-hit data and translating them into deterministic UI state and gameplay transitions.",

      "Designed an event-processing architecture around a dedicated Web Worker to process server-driven timing outside the main UI flow and coordinate sequential ball drops, BetSpot state changes, multiplier updates, and animation execution.",

      "Handled complex asynchronous gameplay where multiple BetSpots and gameplay phases progress independently while remaining synchronized with backend timing, requiring careful sequencing and prevention of overlapping or stale UI transitions.",

      "Built recovery flows for refresh, reconnection, tab switching, and partially completed rounds, including server-provided recovery states so the UI could reconstruct the correct BetSpot, island, multiplier, Booster, and Superball state instead of replaying stale animations.",

      "Investigated Game Server-to-video-to-UI latency with the Video and integration teams, validated event contracts and timing behavior, and adjusted client-side synchronization to reduce visible desynchronization between server state, stream events, and gameplay animations.",

      "Built ~28 coordinated gameplay animation sequences using interruption-safe WAAPI, requestAnimationFrame, sprite animation, and GPU-friendly transforms while keeping animation-heavy gameplay responsive.",

      "Delivered responsive gameplay across desktop, portrait, large portrait, and landscape while resolving BetSpot scaling, island alignment, Crowd Meter behavior, tooltip interactions, and Safari/Linux/iOS-specific rendering issues.",
    ],

    details: [
      "Integrated Game Server WebSocket events with React gameplay state, processing server-provided sequencing, timing, multiplier, and recovery information.",

      "Designed Web Worker-based synchronization between backend gameplay events and ~28 frontend animation sequences.",

      "Implemented resilience for refresh, reconnect, tab-switch, stream-latency, stale-event, and partially completed animation scenarios.",

      "Owned major gameplay surfaces including BetSpot, BetSpot Island, BetPool, Bet on All, Crowd Meter, Booster interactions, multipliers, Free Chips, Superball states, and win experiences.",

      "Developed responsive gameplay across 4 layout modes with extensive Figma verification, Storybook coverage, and Visual Regression Testing.",

      "Worked across frontend, Game Server, Video, Core/Framework, Product, Design, QA, and integration boundaries to validate contracts, investigate synchronization issues, and drive features to production readiness.",
    ],
  },
  {
    id: "free-chips",
    title: "Project: Free Chips Promotional Wallet",
    date: "2025",
    readTime: "7 min read",
    tags: ["React", "TypeScript", "Java", "Kafka", "PostgreSQL", "Event-Driven Architecture"],

    summary:
      "Contributed to a cross-game promotional wallet spanning ~21 games, enabling players to participate using Free Chips instead of their cash balance while maintaining complex eligibility, betting, settlement, refund, and campaign rules.",

    description:
      "Free Chips is a production promotional betting system spanning frontend games, shared Core infrastructure, Game Server, Bonus Promotion services, Kafka workflows, databases, and reporting systems. I worked primarily on frontend and game integration while also contributing to backend flows around promotional campaign processing, event propagation, validation, and cross-system communication.",

    role: "Contributed across frontend game integration, shared betting infrastructure, business-rule implementation, Blackjack-specific workflows, API contracts, testing, and backend promotional flows while collaborating with Game Server, Bonus Promotion, Core, QA, Product, and other platform teams.",

    outcome:
      "Helped deliver Free Chips across 4+ production games as part of a promotional wallet spanning ~21 games, contributing to 130+ campaigns across 37 brands and nearly 67K Free Chips issued to players in Q2.",

    challengesSolved: [
      "Free Chips introduced a parallel promotional balance alongside the normal casino balance, requiring betting flows to distinguish between cash and promotional funds while preventing invalid combinations and maintaining consistent behavior across shared and game-specific implementations.",

      "Implemented 10+ business-critical betting rules covering campaign eligibility, promotional balance validation, chip selection, betting restrictions, low-balance handling, campaign limits, refunds, and gameplay-specific conditions.",

      "The feature had a large integration footprint across ~110 Core files and ~273 game files, requiring changes to shared betting infrastructure while preserving compatibility with game-specific implementations across ~21 games.",

      "Extended Free Chips into Blackjack's complex multi-seat betting model, handling main and side bets, seat-level limits, automated betting, refunds, Double/Split/Insurance-related conditions, and other game-specific edge cases across ~123 Blackjack-related files.",

      "Contributed to Kafka-based asynchronous promotional workflows designed to process tens of thousands of bonus awards within minutes, with campaign requests validated before entering asynchronous processing and bonus records prepared and persisted in batches.",

      "Worked with batch bonus creation where Kafka consumers could process 50–200 requests per poll, grouping messages by promotion ID and type so casinos, players, rules, campaigns, and bonuses belonging to the same promotion remained consistent.",

      "Supported duplicate-safe bonus creation using a fast batch-insert path with per-record fallback, allowing valid player bonuses to succeed even when individual duplicate records were encountered.",

      "Contributed to silent-round handling where Bonus Promotion validation determines whether platform balance updates should be bypassed, requiring coordinated behavior across Game Server, transaction persistence, reconciliation, reporting, and player history.",

      "Supported multi-casino promotional campaigns through parent/child campaign modeling and shared game-table mappings, allowing casino-specific campaigns to reuse common configuration while avoiding duplicated game-detail records and unnecessary database joins.",
    ],

    details: [
      "Delivered Free Chips integrations across 4+ production games and contributed to the wider promotional wallet architecture spanning ~21 games.",

      "Implemented reusable frontend modules and 10+ promotional betting rules across eligibility, balances, restrictions, refunds, limits, and low-balance scenarios.",

      "Worked across a ~383-file Core and game-code footprint, including ~123 Blackjack-related files for multi-seat and game-specific promotional behavior.",

      "Contributed to Kafka-based asynchronous bonus-processing flows designed for tens of thousands of awards within minutes, including validation, grouping, batch persistence, duplicate handling, and lifecycle events.",

      "Worked with cross-system flows spanning UI, shared Core, Game Server, Bonus Promotion services, Kafka, PostgreSQL/MSSQL persistence, reconciliation, and reporting.",

      "Handled complex Blackjack promotional scenarios including multi-seat betting, side bets, seat-level limits, automated betting, refunds, and Free Chip-specific player actions.",

      "Contributed to campaign and eligibility flows supporting promotions across multiple casinos while maintaining efficient game-table mappings and backward compatibility.",

      "Collaborated across frontend, backend, Game Server, Core, QA, Product, and platform teams to validate business rules, API contracts, edge cases, and production behavior.",
    ],
  },
  {
    id: "sneaky-platform",
    title: "Sneaky Full-Stack Platform",
    date: "2026",
    readTime: "5 min read",
    tags: ["React", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
    summary:
      "Designed and built a full-stack fashion discovery platform with Spring Boot APIs, Redis/Kafka analytics, recommendations, Docker setup, and React frontend.",
    description:
      "Sneaky is a full-stack fashion discovery platform built around a swipe-based shopping experience. The product goal was to make fashion discovery feel fast and personal while still supporting practical commerce flows like wishlist, cart, merchant checkout, admin management, recommendations, and product analytics.",
    role: "End-to-end product engineering across React frontend, Redux state, Spring Boot APIs, JWT authentication, PostgreSQL modeling, Redis/Kafka analytics foundations, recommendation logic, and Dockerized local development",
    outcome:
      "Created a production-style full-stack platform foundation with 20+ API flows, personalization-oriented ranking signals, analytics-friendly service boundaries, and a Docker Compose setup for frontend, backend, PostgreSQL, and Redis.",
    metrics: [
      { label: "Apps Built", value: "2", detail: "React frontend and Spring Boot backend" },
      {
        label: "API Flows",
        value: "20+",
        detail: "Auth, products, wishlist, cart, merchant, admin",
      },
      {
        label: "Ranking Signals",
        value: "8+",
        detail: "Recommendation inputs for discovery scoring",
      },
      {
        label: "Analytics Types",
        value: "3+",
        detail: "User activity events using Kafka/Redis foundations",
      },
    ],
    architecture: [
      "React + TypeScript frontend with Redux Toolkit for product discovery state, cart/wishlist state, and UI flow coordination.",
      "Spring Boot backend with JWT-secured APIs, PostgreSQL persistence, merchant/product/admin flows, and service boundaries shaped around real product use cases.",
      "Recommendation engine designed around 8+ ranking signals so product discovery can move beyond static listing into personalized matching.",
      "Redis/Kafka analytics foundation for tracking user activity such as swipes, product interactions, and commerce-oriented behavior.",
      "Docker Compose setup to run frontend, backend, PostgreSQL, and Redis locally with a repeatable development environment.",
    ],
    details: [
      "Built a swipe-based fashion discovery experience where users can browse products quickly and move promising items into wishlist/cart flows.",
      "Implemented core commerce surfaces including wishlist, cart, merchant checkout, product analytics, and admin-oriented product management flows.",
      "Developed 20+ backend API flows across authentication, product discovery, user actions, recommendations, cart/wishlist operations, and merchant/admin behavior.",
      "Designed PostgreSQL-backed models and service boundaries to keep product, user, merchant, and activity data organized for future scaling.",
      "Implemented recommendation logic using 8+ ranking signals to score products based on user behavior and product metadata.",
      "Added Kafka/Redis analytics foundations for 3+ user activity types so discovery interactions can later power recommendations and business insights.",
      "Dockerized the development setup with frontend, backend, PostgreSQL, and Redis so the app can be run consistently across environments.",
      "Kept the project structured as a production-grade full-stack build rather than a simple UI demo, with authentication, persistence, analytics, and infrastructure concerns represented.",
    ],
  },
  {
    id: "sneaky-recommendations",
    title:
      "Building Sneaky’s Recommendation System: Why I Chose Points-Based Recommendation Before Machine Learning",
    date: "2026",
    readTime: "8 min read",
    detailHref: "/case-studies/sneaky-recommendation-system",
    tags: ["Recommendations", "Redis", "Kafka", "System Design", "Ranking"],
    summary:
      "Built a practical points-based recommendation system for Sneaky before moving to ML, using explainable product signals, Redis caching, diversity reranking, and frontend prefetching.",
    description:
      "Sneaky needed a recommendation flow that could feel personal without waiting for a large ML dataset. The system had to promote wishlist/cart/recently viewed preferences, reduce rejected or repeated products, support guest users, and stay fast for swipe-based browsing.",
    role: "Backend and product-engineering design across scoring signals, recommendation API behavior, Redis cache strategy, Kafka-ready refresh flow, and frontend prefetch coordination",
    outcome:
      "Created an explainable, tunable recommendation architecture that works with existing product behavior data today and can evolve into ML-based reranking later.",
    metrics: [
      { label: "Signals", value: "8+", detail: "Wishlist, cart, views, passes, metadata" },
      { label: "Threshold", value: "20", detail: "Minimum signals before personalization" },
      { label: "Candidates", value: "250", detail: "Scored before diversity reranking" },
      { label: "Cache TTL", value: "15m", detail: "Redis ranked product cache" },
    ],
    architecture: [
      "Recommendation API follows a cache-first flow: check Redis, fetch cached product IDs in ranked order, or run scoring when the cache is missing.",
      "Positive scoring boosts brand, category, merchant, price similarity, and popularity signals from wishlist, cart, viewed, and product metadata.",
      "Negative scoring reduces products already passed, recently viewed, or already saved/carted so the feed does not feel repetitive.",
      "Diversity reranking applies recent-window penalties for repeated category, brand, and merchant values before returning the final product list.",
      "Kafka-ready analytics refresh flow can update recommendation caches in the background when product views, passes, wishlist, or cart events happen.",
      "Frontend prefetch sends excludeIds near the end of the current feed so Redux can append fresh unique products before users hit an empty state.",
    ],
    challengesSolved: [
      "ML would have added pipeline complexity before Sneaky had enough behavior data, so I chose an explainable points-based recommender as the first production-ready version.",
      "Weak early signals could over-personalize the feed, so the system uses a minimum personalization threshold of 20 signals before switching from guest ranking to user-specific ranking.",
      "Positive and negative preferences can conflict, so the scoring model combines boosts and penalties instead of relying only on liked products.",
      "High-scoring products can become repetitive, so diversity reranking temporarily penalizes repeated category, brand, and merchant values within a recent window.",
      "Full scoring on every request would become expensive, so Redis stores ranked product IDs and the API preserves cached ranking order for faster responses.",
      "Swipe feeds can feel broken when duplicates appear, so the frontend sends already loaded product IDs and appends only new products.",
    ],
    details: [
      "Used guest ranking based on popularity, recency, and diversity for users without enough personal behavior signals.",
      "Used user-specific cache keys such as recommendations:user:{userId} and a guest recommendation cache for logged-out users.",
      "Kept popularity as a small boost instead of allowing it to overpower personal preferences.",
      "Limited recently viewed and passed-product memory so ranking stays relevant without growing unbounded.",
      "Designed the future ML path as reranking, where rules generate candidate products and ML improves ordering once enough real behavior data exists.",
      "Kept the system practical for Sneaky's stage: fast to build, easy to debug, easy to tune, Redis-compatible, and future-ready.",
    ],
  },
  {
    id: "css-module-class-utils",
    title: "NPM package: css-module-class-utils",
    date: "2026",
    readTime: "5 min read",
    tags: ["npm", "TypeScript", "CSS Modules", "DX"],
    summary:
      "Published a lightweight npm utility package for cleaner, type-safe CSS Module class composition in React and TypeScript projects.",
    description:
      "css-module-class-utils is a small developer utility package built to simplify class name composition when using CSS Modules. It solves the repeated frontend pattern of combining a base CSS Module class, conditional modifier classes, and optional external class names without verbose arrays or manual filter/join logic.",
    role: "Package author responsible for API design, TypeScript utility design, CSS Modules-first behavior, npm publishing, documentation, and developer experience decisions",
    outcome:
      "Published a focused npm package that reduces repetitive class-composition code, improves component readability, standardizes CSS Module modifier handling, and demonstrates reusable frontend tooling beyond application feature work.",
    metrics: [
      { label: "Package Type", value: "npm", detail: "Reusable frontend utility package" },
      { label: "Dependencies", value: "0", detail: "No runtime dependencies" },
      { label: "Package Size", value: "5.5 kB", detail: "Unpacked npm package size" },
      { label: "Runtime JS", value: "855 B", detail: "Small published JavaScript output" },
    ],
    externalLinks: [
      { label: "View on npm", href: "https://www.npmjs.com/package/css-module-class-utils" },
    ],
    architecture: [
      "CSS Modules-first API accepts the imported styles object directly, keeping usage aligned with real React component styling patterns.",
      "Base class support ensures every component can start from a predictable block class before adding state or variant modifiers.",
      "Object-based modifiers let developers describe component state such as active, disabled, loading, selected, variant, or glow using readable boolean keys.",
      "Optional external class support allows parent components to pass className values without breaking internal CSS Module encapsulation.",
      "The utility intentionally stays small and dependency-free so it remains easy to understand, test, publish, and reuse across projects.",
    ],
    details: [
      "Identified a repeated React/CSS Modules pattern where components manually joined base classes, variants, disabled/loading states, and external className values.",
      "Designed a small helper API that accepts styles, a base block name, optional modifiers, and optional external classes.",
      "Moved repetitive class array/filter/join logic into one reusable utility so component code can describe state instead of string-building details.",
      "Kept the modifier API object-based, making class conditions easier to scan in components with multiple states or variants.",
      "Kept TypeScript types simple with a readable modifier shape instead of over-engineering the package API.",
      "Published the package to npm as a dependency-free TypeScript utility with declarations, about 2.1 kB compressed and 5.5 kB unpacked.",
      "Improved developer experience by reducing boilerplate and encouraging consistent CSS Module class handling across reusable components.",
      "Demonstrated the ability to turn a repeated engineering pain point into a small reusable tool.",
    ],
  },
  {
    id: "friendly-error-messages",
    title: "friendly-error-messages",
    date: "2026",
    readTime: "6 min read",
    tags: ["npm", "TypeScript", "Error Handling", "Developer Experience"],
    summary:
      "Published a dependency-free TypeScript package that turns unknown application and API errors into safe, user-friendly messages and actionable UI metadata.",
    description:
      "Frontend applications receive failures in many inconsistent shapes: native Error objects, strings, fetch failures, Axios-style responses, HTTP payloads, and rejected state-library values. Showing raw technical messages creates poor UX, while rewriting error parsing in every component creates duplicated and inconsistent behavior.",
    role: "Package author responsible for API design, unknown-error normalization, TypeScript types, category detection, configurable rules, ESM packaging, tests, documentation, and npm publishing",
    outcome:
      "Published version 0.1.0 as a focused, dependency-free utility that gives applications consistent user-facing messages while also exposing metadata for retries, auth redirects, severity, and category-aware UI behavior.",
    metrics: [
      { label: "Error Categories", value: "10", detail: "Network through unknown fallbacks" },
      { label: "Runtime Deps", value: "0", detail: "Small dependency-free package" },
      { label: "Core APIs", value: "3", detail: "Message, parser, and mapper APIs" },
      { label: "Published", value: "v0.1.0", detail: "Typed ESM package on npm" },
    ],
    externalLinks: [
      { label: "View on npm", href: "https://www.npmjs.com/package/friendly-error-messages" },
    ],
    architecture: [
      "The normalization layer accepts unknown values and reads common fields such as message, status, statusCode, code, response.status, and response.data.message.",
      "The classification layer maps normalized failures into network, timeout, unauthorized, forbidden, notFound, conflict, validation, rateLimit, server, or unknown categories.",
      "getFriendlyErrorMessage provides a safe UI string for toasts, alerts, form errors, and modals without exposing raw technical details.",
      "parseFriendlyError returns structured metadata including category, message, status, rawMessage, code, shouldRetry, and severity for behavior-aware interfaces.",
      "createErrorMessageMapper creates reusable app-specific handlers with shared fallback messages, category copy, and custom matching rules.",
      "The package ships as side-effect-free ESM with bundled TypeScript declarations and no additional type package requirement.",
    ],
    challengesSolved: [
      "Error values can be almost anything at runtime, so I designed the public API around unknown input instead of assuming every failure is an Error instance.",
      "Fetch, Axios, backend APIs, and state libraries expose status and message data differently, so the parser safely inspects several common nested shapes through one consistent normalization path.",
      "Raw backend messages are often too technical for users, so category-based defaults separate diagnostic input from safe UI copy.",
      "Applications still need custom product language, so messages can override category copy without replacing the package's detection logic.",
      "Domain-specific errors cannot all be predicted by a generic package, so custom rules can match status codes, error codes, and message patterns while controlling retry behavior.",
      "Some interfaces need more than text, so the structured parser exposes metadata for redirecting unauthorized users, showing retry actions, and selecting severity-aware UI.",
    ],
    details: [
      "Supports native Error instances, string errors, fetch/network failures, Axios-style response objects, API payloads, and rejected state-library values.",
      "Provides built-in friendly messages for ten common failure categories with a configurable fallback for unknown errors.",
      "Supports custom category messages and ordered matching rules using status, code, and message patterns.",
      "Keeps simple use cases concise while allowing advanced consumers to read status, retry, severity, category, and raw-message metadata.",
      "Includes TypeScript declarations, an explicit ESM export map, sideEffects: false, build-before-publish behavior, and Node-based package tests.",
      "Documented when to use message generation, structured parsing, custom messages, custom rules, and reusable mappers.",
    ],
  },
  {
    id: "snapgram",
    title: "Snapgram Social Platform",
    date: "2025",
    readTime: "5 min read",
    tags: ["React", "Appwrite", "React Query", "Zod"],
    summary:
      "Built a React social media application with Appwrite Auth, Database, Storage, query caching, form validation, and responsive navigation.",
    description:
      "Snapgram is a social media web application built to practice production-style frontend flows: authenticated user sessions, post creation and editing, image upload, feed browsing, profile pages, likes, saves, search, and responsive navigation.",
    role: "Frontend application implementation across React 18, TypeScript, Appwrite services, TanStack React Query, React Hook Form, Zod validation, Tailwind CSS, and Radix UI components",
    outcome:
      "Built a complete social app experience with 8+ core features, 3 Appwrite services, structured collections for users/posts/saves, query caching, mutation invalidation, and type-safe form workflows.",
    metrics: [
      {
        label: "Core Features",
        value: "8+",
        detail: "Auth, posts, uploads, feed, profile, likes, saves, search",
      },
      { label: "Appwrite Services", value: "3", detail: "Auth, Database, and Storage integration" },
      {
        label: "Data Collections",
        value: "3",
        detail: "Users, posts, and saves modeled for app flows",
      },
      { label: "Validation Flow", value: "Typed", detail: "React Hook Form with Zod schemas" },
    ],
    architecture: [
      "React 18 + TypeScript frontend structured around reusable UI surfaces for feed, post cards, forms, profile pages, and navigation.",
      "Appwrite Auth manages user sessions, while Appwrite Database stores users, posts, and saves as the primary application collections.",
      "Appwrite Storage handles image upload flows so posts can include user-generated media with database references.",
      "TanStack React Query coordinates server data, query keys, caching, mutation updates, and invalidation after create/edit/like/save actions.",
      "React Hook Form + Zod provide type-safe form validation for auth and post workflows, reducing invalid client-side state before API calls.",
      "Tailwind CSS and Radix UI support responsive layouts and accessible interaction primitives across desktop and mobile navigation.",
    ],
    details: [
      "Implemented authentication and protected user flows so users can create, browse, and manage social content after signing in.",
      "Built post creation and editing flows with image upload support, form validation, and Appwrite-backed persistence.",
      "Created feed browsing, profile pages, responsive navigation, search, likes, and saved-post interactions.",
      "Integrated Appwrite Auth, Database, and Storage to cover identity, structured records, and media asset workflows.",
      "Designed the core data model around 3 primary collections: users, posts, and saves.",
      "Used TanStack React Query for query keys, caching, mutation handling, and invalidation so UI data stays consistent after user actions.",
      "Used React Hook Form with Zod schemas for type-safe validation and cleaner form state management.",
      "Focused on responsive UI behavior so the app works naturally across mobile and desktop layouts.",
    ],
  },
];

const getCaseStudyById = (id: string) => caseStudies.find((caseStudy) => caseStudy.id === id);

export const CaseStudies = () => {
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string | null>(null);

  const activeCaseStudy = useMemo(
    () => caseStudies.find((caseStudy) => caseStudy.id === activeCaseStudyId),
    [activeCaseStudyId]
  );

  useEffect(() => {
    if (!activeCaseStudy) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCaseStudyId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCaseStudy]);

  useEffect(() => {
    const handleOpenCaseStudy = (event: Event) => {
      const caseStudyId = (event as CustomEvent<string>).detail;

      if (caseStudyId && getCaseStudyById(caseStudyId)) {
        setActiveCaseStudyId(caseStudyId);
      }
    };

    window.addEventListener("open-case-study", handleOpenCaseStudy);

    return () => {
      window.removeEventListener("open-case-study", handleOpenCaseStudy);
    };
  }, []);

  return (
    <section className={style.caseStudies} id="case-studies">
      <div className={style.caseStudies__header}>
        <h1 className={style.caseStudies__heading}>
          Engineering <span className={style.caseStudies__heading_highlight}>Case Studies</span>
        </h1>
        <p className={style.caseStudies__intro}>
          A deeper look into real production and full-stack problems I worked on.
        </p>
      </div>

      <div className={style.caseStudies__grid}>
        {caseStudies.map((caseStudy) => (
          <button
            className={style.caseStudies__card}
            type="button"
            key={caseStudy.id}
            onClick={() => setActiveCaseStudyId(caseStudy.id)}
            aria-label={`Open ${caseStudy.title} case study`}
          >
            <div className={style.caseStudies__card_body}>
              <p className={style.caseStudies__eyebrow}>Case Study</p>
              <div className={style.caseStudies__meta}>
                <span className={style.caseStudies__meta_item}>
                  <FaCalendarDays />
                  {caseStudy.date}
                </span>
                <span className={style.caseStudies__meta_item}>
                  <FaClock />
                  {caseStudy.readTime}
                </span>
              </div>
              <h2 className={style.caseStudies__title}>{caseStudy.title}</h2>
              <p className={style.caseStudies__summary}>{caseStudy.summary}</p>
              <div className={style.caseStudies__tags}>
                {caseStudy.tags.slice(0, 3).map((tag) => (
                  <span className={style.caseStudies__tag} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <span className={style.caseStudies__link}>
              View Case Study
              <FaArrowRight className={style.caseStudies__link_icon} />
            </span>
          </button>
        ))}
      </div>

      {activeCaseStudy && (
        <div
          className={style.caseStudies__modal_overlay}
          role="presentation"
          onClick={() => setActiveCaseStudyId(null)}
        >
          <article
            className={style.caseStudies__modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={style.caseStudies__modal_close}
              type="button"
              onClick={() => setActiveCaseStudyId(null)}
              aria-label="Close case study"
            >
              <FaXmark />
            </button>

            <div className={style.caseStudies__modal_header}>
              <p className={style.caseStudies__modal_eyebrow}>Engineering Case Study</p>
              <div className={style.caseStudies__modal_meta}>
                <span className={style.caseStudies__meta_item}>
                  <FaCalendarDays />
                  {activeCaseStudy.date}
                </span>
                <span className={style.caseStudies__meta_item}>
                  <FaClock />
                  {activeCaseStudy.readTime}
                </span>
              </div>
              <h2 className={style.caseStudies__modal_title} id="case-study-modal-title">
                {activeCaseStudy.title}
              </h2>
              <p className={style.caseStudies__modal_summary}>{activeCaseStudy.summary}</p>
              <div className={style.caseStudies__modal_tags}>
                {activeCaseStudy.tags.map((tag) => (
                  <span className={style.caseStudies__tag} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {activeCaseStudy.externalLinks && (
                <div className={style.caseStudies__modal_actions}>
                  {activeCaseStudy.externalLinks.map((link) => (
                    <Link
                      className={style.caseStudies__detail_link}
                      href={link.href}
                      key={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                      <FaArrowRight className={style.caseStudies__link_icon} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={style.caseStudies__modal_body}>
              <div className={style.caseStudies__modal_panel}>
                <p className={style.caseStudies__modal_label}>Context</p>
                <p className={style.caseStudies__modal_text}>{activeCaseStudy.description}</p>
              </div>

              <div className={style.caseStudies__modal_panel}>
                <p className={style.caseStudies__modal_label}>My Role</p>
                <p className={style.caseStudies__modal_text}>{activeCaseStudy.role}</p>
              </div>

              <div className={style.caseStudies__modal_panel}>
                <p className={style.caseStudies__modal_label}>Outcome</p>
                <p className={style.caseStudies__modal_text}>{activeCaseStudy.outcome}</p>
              </div>
            </div>

            {activeCaseStudy.metrics && (
              <div className={style.caseStudies__metric_grid}>
                {activeCaseStudy.metrics.map((metric) => (
                  <div className={style.caseStudies__metric} key={metric.label}>
                    <p className={style.caseStudies__metric_value}>{metric.value}</p>
                    <p className={style.caseStudies__metric_label}>{metric.label}</p>
                    <p className={style.caseStudies__metric_detail}>{metric.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {activeCaseStudy.architecture && (
              <div className={style.caseStudies__modal_details}>
                <p className={style.caseStudies__modal_label}>Architecture</p>
                <ul className={style.caseStudies__detail_list}>
                  {activeCaseStudy.architecture.map((detail) => (
                    <li className={style.caseStudies__detail_item} key={detail}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeCaseStudy.challengesSolved && (
              <div className={style.caseStudies__modal_details}>
                <p className={style.caseStudies__modal_label}>Challenges Solved</p>
                <ul className={style.caseStudies__detail_list}>
                  {activeCaseStudy.challengesSolved.map((detail) => (
                    <li className={style.caseStudies__detail_item} key={detail}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={style.caseStudies__modal_details}>
              <p className={style.caseStudies__modal_label}>Key Work</p>
              <ul className={style.caseStudies__detail_list}>
                {activeCaseStudy.details.map((detail) => (
                  <li className={style.caseStudies__detail_item} key={detail}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {activeCaseStudy.detailHref && (
              <div className={style.caseStudies__modal_actions}>
                <Link className={style.caseStudies__detail_link} href={activeCaseStudy.detailHref}>
                  Read in Detail
                  <FaArrowRight className={style.caseStudies__link_icon} />
                </Link>
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  );
};
