"use client";

import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaXmark } from "react-icons/fa6";

import style from "./CaseStudies.module.css";

const caseStudies = [
  {
    id: "toast-messages",
    title: "Toast Messages 2.0",
    summary:
      "Replaced 5+ legacy blocking popups with a shared, localized, gesture-supported toast notification system for React casino games.",
    description:
      "A production UI refactor focused on reducing interruption in real-time game flows while keeping critical feedback visible, localized, and reusable across multiple React game surfaces.",
    role: "Frontend ownership, shared UI patterns, localization-ready behavior, interaction review",
    outcome:
      "Reduced blocking UI friction and created a lighter feedback pattern that could scale across game experiences.",
    details: [
      "Moved high-friction blocking popups into lightweight non-blocking toast flows.",
      "Supported localized messaging, gesture interactions, and reusable frontend patterns across game UI surfaces.",
      "Improved production UX by reducing interruption while preserving critical feedback visibility.",
    ],
  },
  {
    id: "plinko-ui",
    title: "Plinko Game UI",
    summary:
      "Built responsive, animation-heavy betting UI across 4 layouts with BetSpot, Bet on All, BetPool, crowd meter, tooltips, and gameplay animations.",
    description:
      "A production casino game UI implementation with responsive layout work, animation-heavy state changes, betting interactions, browser-specific fixes, and MR review responsibility.",
    role: "Primary UI contributor and MR reviewer for feature logic, edge cases, maintainability, and regressions",
    outcome:
      "Stabilized a complex real-time betting interface across desktop, portrait, large portrait, and landscape layouts.",
    details: [
      "Delivered game UI across desktop, portrait, large portrait, and landscape experiences.",
      "Owned multiple betting and gameplay surfaces including BetSpot, BetPool, tooltips, and animation flows.",
      "Reviewed feature logic, edge cases, and regression risk as a primary MR reviewer for Plinko.",
    ],
  },
  {
    id: "sneaky-platform",
    title: "Sneaky Full-Stack Platform",
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
    id: "css-module-class-utils",
    title: "css-module-class-utils",
    summary:
      "Published a lightweight npm utility package for cleaner, type-safe CSS Module class composition in React and TypeScript projects.",
    description:
      "css-module-class-utils is a small developer utility package built to simplify class name composition when using CSS Modules. It solves the repeated frontend pattern of combining a base CSS Module class, conditional modifier classes, and optional external class names without verbose arrays or manual filter/join logic.",
    role: "Package author responsible for API design, TypeScript utility design, CSS Modules-first behavior, npm publishing, documentation, and developer experience decisions",
    outcome:
      "Published a focused npm package that reduces repetitive class-composition code, improves component readability, standardizes CSS Module modifier handling, and demonstrates reusable frontend tooling beyond application feature work.",
    metrics: [
      { label: "Package Type", value: "npm", detail: "Reusable frontend utility package" },
      { label: "API Surface", value: "1", detail: "Focused getClasses helper" },
      { label: "Dependencies", value: "0", detail: "Lightweight utility-first approach" },
      { label: "Language", value: "TS", detail: "TypeScript-friendly API design" },
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
      "Published the package to npm, gaining experience with package naming, versioning, documentation, and distribution.",
      "Improved developer experience by reducing boilerplate and encouraging consistent CSS Module class handling across reusable components.",
      "Demonstrated the ability to turn a repeated engineering pain point into a small reusable tool.",
    ],
  },
  {
    id: "snapgram",
    title: "Snapgram Social Platform",
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
              <h2 className={style.caseStudies__title}>{caseStudy.title}</h2>
              <p className={style.caseStudies__summary}>{caseStudy.summary}</p>
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
              <h2 className={style.caseStudies__modal_title} id="case-study-modal-title">
                {activeCaseStudy.title}
              </h2>
              <p className={style.caseStudies__modal_summary}>{activeCaseStudy.summary}</p>
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
          </article>
        </div>
      )}
    </section>
  );
};
