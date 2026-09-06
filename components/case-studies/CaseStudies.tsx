"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaCalendarDays, FaClock, FaXmark } from "react-icons/fa6";

import style from "./CaseStudies.module.css";

const caseStudies = [
  {
    id: "toast-messages",
    title: "Toast Messages 2.0 — Event-Driven Notification Platform",
    date: "2025",
    readTime: "6 min read",

    tags: [
      "React",
      "TypeScript",
      "Pub/Sub",
      "Event-Driven Architecture",
      "WAAPI",
      "Performance",
      "Accessibility",
    ],

    summary:
      "Architected and implemented an event-driven Pub/Sub notification platform adopted across 50+ game variants, consolidating 30 legacy toast variants and 10+ blocking popup flows while reducing duplicated notification code by ~68%.",

    description:
      "Toast 2.0 replaced fragmented, game-specific notifications with a centralized event-driven platform for real-time gameplay. The system decouples notification producers from rendering and lifecycle management, supporting concurrent stacked notifications, priority and queue handling, rich actions, gesture interactions, localization, responsive layouts, and coordinated animations without forcing individual games to manage notification UI state.",

    role: "Owned frontend architecture and implementation across the Pub/Sub event model, notification lifecycle, stack orchestration, animation system, interaction design, performance optimization, migration strategy, shared APIs, and cross-game adoption.",

    outcome:
      "Established a shared notification platform adopted across 50+ game variants, reducing duplicated notification code by ~68% (2.5K → 800 LOC) and CPU usage by ~9% while replacing blocking feedback patterns with reusable, non-blocking notifications and 10 coordinated animations.",

    metrics: [
      {
        label: "Game Adoption",
        value: "50+",
        detail: "Game variants using the shared notification architecture",
      },
      {
        label: "Code Reduction",
        value: "~68%",
        detail: "Duplicated notification code reduced from ~2.5K to ~800 LOC",
      },
      {
        label: "CPU Reduction",
        value: "~9%",
        detail: "Lower CPU usage after notification lifecycle and rendering optimizations",
      },
      {
        label: "Animations",
        value: "10",
        detail: "Coordinated stack, lifecycle, and interaction animations",
      },
    ],

    architecture: [
      "Designed a centralized event-driven Pub/Sub architecture that decouples notification producers from UI rendering, allowing game features to publish notification intent without managing presentation or lifecycle state.",

      "Separated responsibilities across the notification service, stack orchestrator, and individual toast components: the service manages events and lifecycle, the stack coordinates ordering and layout, and each toast owns its isolated rendering and interactions.",

      "Built centralized lifecycle management for queued notifications, timers, pause/resume behavior, duplicate suppression, dismissal, cleanup, and persistent action-driven notifications.",

      "Designed concurrent stack orchestration with a 3-layer collapsed preview and expandable view, dynamically coordinating ordering, offsets, transforms, scaling, and z-index as notifications enter and leave the stack.",

      "Implemented 10 coordinated animation flows covering entry, exit, stack repositioning, expansion/collapse, swipe interaction, dismissal, and layout transitions.",

      "Optimized animation and interaction paths using transform-oriented updates and requestAnimationFrame, reducing layout-heavy work and contributing to ~9% lower CPU usage during notification-heavy interactions.",

      "Expanded the notification contract from a flat message/action model into configurable title + body content, primary and secondary actions, icons, timers, persistent states, and specialized interaction behavior.",

      "Designed the shared API and migration strategy for adoption across 50+ game variants while preserving compatibility with existing gameplay flows, localization requirements, responsive layouts, and different integration surfaces.",
    ],

    challengesSolved: [
      "Legacy notification behavior was fragmented across 30 toast variants and 10+ blocking popup flows. Consolidating them required identifying common behavior and designing a configurable abstraction without forcing every game into game-specific notification implementations.",

      "Notification producers were previously coupled to presentation behavior. The Pub/Sub architecture separated event producers from notification rendering and lifecycle management, making the system easier to integrate and evolve across games.",

      "Supporting multiple simultaneous notifications introduced ordering, lifecycle, layout, and animation dependencies. A centralized stack orchestrator keeps concurrent notifications visually synchronized as items enter, leave, expand, collapse, or are dismissed.",

      "Blocking dialogs interrupted time-sensitive gameplay. Eligible flows were migrated to non-blocking notifications while preserving message visibility, actions, timers, and player feedback.",

      "Rapid or repeated gameplay events could generate duplicate or overlapping notifications. Duplicate suppression, queuing, timer management, and interruption-safe cleanup were centralized instead of being reimplemented by individual consumers.",

      "Gesture-driven dismissal had to coexist with timers and stack animations. Toasts support left, right, and upward swipe interactions while coordinating pause/resume and dismissal state with the rest of the notification stack.",

      "Animation-heavy stacked UI introduced runtime overhead. Transform-oriented animation, controlled lifecycle cleanup, and optimized rendering reduced CPU usage by ~9% while maintaining 10 coordinated animation flows.",

      "The platform had to remain reusable across different screen sizes, orientations, languages, and game implementations, requiring responsive stack recalculation, localization-safe layouts, accessibility semantics, and integration compatibility.",

      "Migrating a shared system across 50+ game variants required maintaining backward compatibility and providing consistent APIs, integration patterns, documentation, testing guidance, and troubleshooting support.",
    ],

    details: [
      "Architected an event-driven Pub/Sub notification platform adopted across 50+ game variants.",

      "Consolidated 30 legacy toast variants and 10+ blocking popup flows into shared notification infrastructure.",

      "Reduced duplicated notification code by ~68%, from approximately 2.5K to 800 LOC.",

      "Reduced CPU usage by ~9% through notification lifecycle, rendering, and animation optimizations.",

      "Built a 3-layer collapsed notification stack with expandable concurrent-notification handling.",

      "Implemented 10 coordinated animations covering notification lifecycle, stack transitions, gestures, and expand/collapse interactions.",

      "Expanded notifications from a flat message/action model to title + body, primary/secondary actions, icons, timed and persistent states, and specialized interaction flows.",

      "Implemented multi-direction swipe dismissal, timer pause/resume, duplicate suppression, queuing, cleanup, and persistent action-driven notifications.",

      "Supported responsive layouts, orientation changes, localization, keyboard/focus behavior, alert semantics, and live-region accessibility.",

      "Documented the shared API, notification contracts, migration patterns, testing strategy, and troubleshooting guidance to support adoption across game teams.",
    ],
  },
  {
    id: "plinko-ui",
    title: "Real-Time Plinko — Event Synchronization & Animation Architecture",
    date: "2026",
    readTime: "7 min read",

    tags: [
      "React",
      "TypeScript",
      "WebSocket",
      "Web Workers",
      "WAAPI",
      "Performance",
      "Real-Time Systems",
    ],

    summary:
      "Owned and engineered a production real-time Plinko experience, combining WebSocket-driven gameplay, Web Worker-based synchronization, ~28 coordinated animation sequences, resilient state recovery, and responsive gameplay across 4 layouts.",

    description:
      "Plinko is an event-driven real-time game where Game Server events, sequential ball drops, betting state, multipliers, video timing, and animation-heavy UI must remain synchronized. I designed the frontend architecture that translates backend timing into deterministic React state and coordinated animation flows, while keeping the main thread responsive and recovering correctly from refreshes, reconnects, tab switches, and partially completed rounds.",

    role: "Owned core frontend gameplay architecture, Game Server-to-UI integration, Web Worker synchronization, animation infrastructure, responsive gameplay, performance optimization, recovery flows, technical coordination, MR reviews, and production stabilization while collaborating with 6+ cross-functional teams.",

    outcome:
      "Delivered a production-ready real-time gameplay system with resilient server-to-UI synchronization across 4 responsive layouts; moved timing-intensive synchronization into a dedicated Web Worker to reduce main-thread blocking time by ~20%, introduced list virtualization to improve data-heavy rendering by ~60%, and built reusable infrastructure supporting ~28 coordinated gameplay animations.",

    metrics: [
      {
        label: "Main-Thread Blocking Reduction",
        value: "~20%",
        detail: "Reduction after moving synchronization work into a dedicated Web Worker",
      },
      {
        label: "Rendering Improvement",
        value: "~60%",
        detail: "Improvement from virtualization of data-heavy statistics views",
      },
      {
        label: "Animation Flows",
        value: "~28",
        detail: "Coordinated gameplay animation sequences",
      },
      {
        label: "Recovery Scenarios",
        value: "6+",
        detail:
          "Failure and interruption scenarios handled across reconnects, refreshes, stale events, and in-progress rounds",
      },
    ],

    architecture: [
      "Integrated sequenced Game Server WebSocket events with React gameplay state, consuming phase, multiplier, timing, and recovery information and translating those events into deterministic UI transitions.",

      "Designed a dedicated Web Worker-based synchronization layer to move timing-intensive event processing away from the main UI thread, reducing main-thread blocking time by ~20% while preserving server-driven gameplay timing.",

      "Built an event-processing flow that coordinates sequential ball drops, BetSpot transitions, multiplier progression, Booster and Superball states, and animation execution from backend-provided timing information.",

      "Separated server state, synchronization logic, React gameplay state, and presentation/animation responsibilities to prevent timing logic from becoming tightly coupled to individual UI components.",

      "Built recovery-aware state handling so refreshes, reconnects, tab switches, and partially completed rounds reconstruct the latest server-authoritative state rather than replaying stale animation sequences.",

      "Developed a reusable interruption-safe animation layer around WAAPI, allowing in-flight animations to be safely interrupted, committed, cancelled, and restarted without visual snapping or rubber-banding.",

      "Coordinated ~28 gameplay animation sequences using WAAPI, requestAnimationFrame, sprite animation, and GPU-friendly transforms while keeping animation-heavy interactions responsive.",

      "Introduced list virtualization for data-heavy statistics views, limiting unnecessary DOM growth and improving rendering performance by ~60%.",

      "Designed the gameplay UI to operate consistently across desktop, portrait, large portrait, and landscape layouts while sharing the same underlying event and gameplay architecture.",
    ],

    challengesSolved: [
      "Server events represented authoritative gameplay state, but the UI also contained long-running animations. I designed synchronization boundaries so visual transitions remained aligned with backend timing without allowing animation state to become the source of truth.",

      "Sequential ball drops and independent BetSpot phases created overlapping asynchronous flows. Worker-driven sequencing and explicit state transitions prevented stale events and previous animations from corrupting the current gameplay state.",

      "Timing-intensive synchronization competed with React rendering and animation work on the browser's main thread. Moving synchronization processing into a dedicated Web Worker reduced main-thread blocking time by ~20%.",

      "Players could refresh, reconnect, switch tabs, or return while a round was already in progress. Recovery flows consume server-provided state and reconstruct the correct BetSpot, island, multiplier, Booster, Superball, and animation state without replaying completed transitions.",

      "Game Server state, video events, and frontend animations could become visibly misaligned because they travel through different runtime paths. I investigated Game Server-to-video-to-UI latency with Video and integration teams, validated event contracts, and adjusted client-side synchronization behavior.",

      "Rapid animation interruption caused visual snapping and inconsistent end states. I built reusable WAAPI infrastructure that preserves the element's live visual state before safely cancelling and transitioning into the next animation.",

      "Animation-heavy gameplay required ~28 coordinated sequences to coexist without degrading interaction responsiveness, so animation paths were built around WAAPI, requestAnimationFrame, sprites, and transform-oriented updates.",

      "Data-heavy statistics views created unnecessary DOM/rendering work. List virtualization restricted rendering to the visible range and improved rendering performance by ~60%.",

      "Four responsive layouts had to preserve gameplay semantics despite substantially different dimensions and positioning. Shared state and behavior were separated from layout-specific presentation while resolving BetSpot scaling, island alignment, Crowd Meter, tooltip, and browser-specific rendering issues.",
    ],

    details: [
      "Owned major gameplay surfaces including BetSpot, BetSpot Island, BetPool, Bet on All, Crowd Meter, Booster interactions, multipliers, Free Chips, Superball states, and win experiences.",

      "Integrated Game Server WebSocket events carrying gameplay sequencing, timing, multiplier, phase, and recovery information.",

      "Designed Web Worker-based synchronization between server-driven gameplay events and ~28 frontend animation sequences.",

      "Reduced main-thread blocking time by ~20% by moving synchronization processing away from the primary UI thread.",

      "Introduced list virtualization for data-heavy statistics views, improving rendering performance by ~60% and limiting unnecessary DOM growth.",

      "Built reusable interruption-safe WAAPI infrastructure for animation-heavy gameplay and coordinated it with requestAnimationFrame, sprite animation, and transform-based transitions.",

      "Implemented recovery for refresh, reconnect, tab switching, stale events, stream latency, and partially completed gameplay/animation sequences.",

      "Delivered consistent gameplay across desktop, portrait, large portrait, and landscape with Figma verification, Storybook coverage, and Visual Regression Testing.",

      "Resolved production-specific Safari, Linux, and iOS rendering and interaction issues across animation-heavy responsive layouts.",

      "Worked across Frontend, Game Server, Video, Core/Framework, Product, Design, QA, and Integration teams to validate contracts, investigate synchronization issues, review implementation changes, and drive the game to production readiness.",
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
    title: "Sneaky Hybrid Fashion Discovery Platform",
    date: "2026",
    readTime: "6 min read",
    tags: ["React", "Spring Boot", "PostgreSQL", "Redis", "Kafka", "ML Reranking"],
    summary:
      "Designed and built a full-stack fashion discovery platform with swipe-based browsing, Spring Boot APIs, hybrid recommendations, Redis/Kafka analytics, notifications, and merchant checkout flows.",
    description:
      "Sneaky is a full-stack fashion discovery and commerce platform built around a swipe-based shopping experience. The product goal was to make discovery feel fast and personal while still supporting practical commerce flows like wishlist, cart, merchant checkout, admin management, recommendations, product analytics, and reminder notifications.",
    role: "End-to-end product engineering across React frontend, Redux state, Spring Boot APIs, JWT authentication, PostgreSQL modeling, Redis/Kafka analytics foundations, recommendation logic, and Dockerized local development",
    outcome:
      "Created a production-style platform foundation with 20+ API flows, personalization-oriented ranking, cache-first recommendation reads, event-driven analytics, notification workflows, and a repeatable Docker Compose setup.",
    metrics: [
      {
        label: "Cache TTL",
        value: "15m",
        detail: "Redis-ranked product feed cache for faster repeat loads",
      },
      {
        label: "API Surface",
        value: "20+",
        detail: "Secured endpoints across discovery, commerce, analytics, notifications, and admin",
      },
      {
        label: "Recommendation Inputs",
        value: "10+",
        detail: "Behavior, affinity, popularity, price-fit, and diversity signals",
      },
      {
        label: "Personalization Threshold",
        value: "20",
        detail:
          "User activity signals required before switching from guest to personalized ranking",
      },
    ],
    architecture: [
      "React + TypeScript frontend uses Redux Toolkit slices and async thunks to coordinate swipe state, product hydration, cached home-feed pages, cart state, wishlist state, auth-aware UI, and recently viewed shortcuts.",
      "Java 21 + Spring Boot backend exposes JWT-secured REST APIs through controller, service, repository, DTO, validation, exception, and security layers so commerce and discovery flows stay separated by responsibility.",
      "PostgreSQL stores users, brands, products, cart, wishlist, and notification records, while admin APIs handle product and brand creation instead of relying on runtime seed data.",
      "Recommendation API runs as a cache-first pipeline: read ranked product IDs from Redis, preserve cached order when loading product records, fall back to live scoring on misses, then write refreshed rankings back with a 15-minute TTL.",
      "Hybrid ranking combines popularity, preference profiles, wishlist/cart history, recently viewed products, passed products, brand/category/merchant affinity, price fit, diversity reranking, and optional ML reranking.",
      "Kafka activity events publish product views, passes, cart actions, and wishlist actions outside the request path, allowing consumers to update Redis counters, preference profiles, and recommendation cache state asynchronously.",
      "Commerce APIs support clear-all wishlist, one-call wishlist move-to-cart, merchant-grouped outbound checkout links, cart reminders, unread notification counts, read-all notifications, and notification deletion flows.",
      "Docker Compose runs the frontend, backend, PostgreSQL, Redis, and supporting services locally so the platform can be developed and tested as an integrated system.",
    ],
    challengesSolved: [
      "The swipe feed needed to stay fast while still becoming personal, so I used Redis-ranked product IDs for repeat loads and moved expensive recommendation refresh work away from the normal request path.",
      "Cold-start users do not have enough behavior data for reliable personalization, so the system keeps them on guest ranking until enough signals exist and then switches to user-specific recommendations.",
      "Recommendation quality can become repetitive when a user likes one brand or category, so the ranking layer applies diversity penalties across category, brand, and merchant values before returning the feed.",
      "Product interactions arrive from several surfaces, so views, passes, cart actions, and wishlist actions are normalized into analytics events that can feed counters, preference profiles, and future recommendation improvements.",
      "External ML should improve ranking without becoming a hard dependency, so the optional reranking service is fail-open: disabled ML, timeouts, bad scores, or partial responses preserve the rule-based order.",
      "Cart and wishlist flows needed to feel commerce-ready rather than demo-like, so the API supports transactional wishlist move-to-cart, grouped merchant checkout links, stale-cart reminders, and in-app notification management.",
    ],
    details: [
      "Built a swipe-based fashion discovery experience where users can browse products quickly and move promising items into wishlist/cart flows.",
      "Implemented core commerce surfaces including wishlist, cart, merchant checkout groups, product analytics, notifications, and admin-oriented product management flows.",
      "Developed 20+ backend API flows across authentication, product discovery, recommendations, cart/wishlist operations, notifications, analytics, merchant, and admin behavior.",
      "Designed PostgreSQL-backed models and service boundaries to keep product, user, merchant, and activity data organized for future scaling.",
      "Implemented recommendation logic using 10+ ranking inputs with fallback popularity ranking for guests and users without enough behavior history.",
      "Implemented Redis cache-aside recommendation reads using guest and user cache keys so ranked product IDs can be reused without rescoring every feed request.",
      "Added Kafka/Redis analytics foundations so views, passes, cart actions, and wishlist actions can power recommendations, counters, preference profiles, and business insights.",
      "Added one-call wishlist move-to-cart behavior, clear-all wishlist support, recently viewed shortcuts, and cart reminder notifications.",
      "Integrated optional ML reranking through a standalone recommendation service while keeping the backend's rule-based ranking as the reliable fallback.",
      "Dockerized the development setup with frontend, backend, PostgreSQL, and Redis so the app can be run consistently across environments.",
      "Kept the project structured as a production-grade full-stack build rather than a simple UI demo, with authentication, persistence, analytics, and infrastructure concerns represented.",
    ],
  },
  {
    id: "cache-first-recommendation-api",
    title: "Building a Cache-First Recommendation API",
    date: "2026",
    readTime: "7 min read",
    detailHref: "/case-studies/cache-first-recommendation-api",
    tags: ["Redis", "Spring Boot", "Kafka", "Recommendations", "System Design"],
    summary:
      "Built Sneaky's recommendation endpoint around Redis-ranked product IDs, live scoring fallbacks, diversity reranking, Kafka-driven refresh, and fail-open ML integration.",
    description:
      "Sneaky's swipe feed needed recommendations that stayed fast under repeat loads while still adapting to wishlist, cart, view, pass, brand, category, merchant, and price signals. I designed the API so cached ranking is the first path and full scoring is only used when needed.",
    role: "Backend system design and implementation across recommendation API behavior, Redis cache-aside ranking, Kafka activity events, fallback scoring, optional ML reranking, and frontend feed coordination",
    outcome:
      "Created a cache-first recommendation API that keeps the home feed responsive, avoids unnecessary rescoring, supports guest and personalized ranking, and remains reliable when Redis or ML dependencies are unavailable.",
    metrics: [
      {
        label: "Cache TTL",
        value: "15m",
        detail: "Short-lived Redis ranking cache for repeat feed loads",
      },
      {
        label: "Candidate Pool",
        value: "250",
        detail: "Products scored before final reranking and result limiting",
      },
      {
        label: "Result Window",
        value: "30",
        detail: "Recommended products returned to the frontend per feed request",
      },
      {
        label: "Signal Threshold",
        value: "20",
        detail: "Activity signals required before personalized ranking starts",
      },
    ],
    architecture: [
      "The recommendation endpoint checks Redis first for ranked product IDs using guest and user-specific cache keys, then fetches product records from PostgreSQL while preserving the cached order.",
      "When Redis has no usable ranking, the backend scores active products with rule-based signals, applies diversity reranking, stores the ranked IDs back into Redis, and returns the result to the frontend.",
      "The cache stores product IDs instead of full product payloads so product details continue to come from PostgreSQL while Redis controls temporary ranking order.",
      "Guest users receive popularity, recency, and diversity-based ranking, while logged-in users switch to personalized scoring only after enough wishlist, cart, pass, and viewed-product signals exist.",
      "Kafka activity events move product views, passes, cart actions, and wishlist actions outside the request path so Redis counters, preference profiles, and recommendation cache state can update asynchronously.",
      "Optional ML reranking sits after rule-based candidate generation and stays fail-open, so disabled ML, timeouts, unhealthy responses, or invalid scores preserve the existing ranked order.",
    ],
    challengesSolved: [
      "Running full scoring on every home feed request would repeat expensive work, so the API was shaped around cached ranked IDs and fallback scoring only on cache misses.",
      "Database reads by ID do not automatically preserve recommendation order, so the API keeps Redis ranking order when mapping fetched product records back to the response.",
      "Caching full product payloads could serve stale product data, so the cache stores only IDs and lets PostgreSQL remain the source of truth.",
      "Early user behavior can be misleading, so personalization starts only after the user crosses a minimum activity threshold.",
      "Highly scored feeds can become repetitive, so diversity reranking reduces repeated category, brand, and merchant values in the final feed.",
      "ML should improve ranking without breaking discovery, so the integration was designed as an optional reranker rather than a required dependency.",
    ],
    details: [
      "Implemented cache-first reads for `GET /api/products/recommended` using `recommendations:guest` and `recommendations:user:{userId}` cache keys.",
      "Stored ranked product IDs in Redis with a 15-minute TTL to speed up repeat feed loads while keeping rankings fresh enough for new activity.",
      "Used a rule-based scoring fallback that combines positive affinity signals, negative pass/repetition signals, popularity, price fit, and diversity.",
      "Connected product views, passes, cart actions, and wishlist actions to the analytics flow so recommendation inputs can improve over time.",
      "Kept ML reranking behind a service boundary so the rule-based system remains the reliable baseline and ML can enhance ordering when available.",
      "Learned that recommendation work is as much about system boundaries, cache shape, and failure behavior as it is about scoring formulas.",
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
    title: "NPM package: friendly-error-messages",
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
