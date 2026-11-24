# Portfolio architecture and production readiness

Reviewed: 24 November 2026.

## Runtime and repository boundaries

The portfolio uses Next.js 15.5.29 App Router, React 18, strict TypeScript, CSS Modules and Tailwind CSS 3. Content is local and statically rendered; the educational demos do not connect to production gaming systems, authentication services, or databases. There is no contact backend.

Next.js was updated from 14.1.4 to address security advisories, retaining React 18 and the existing route structure. Next 15 is in maintenance support ([support policy](https://nextjs.org/support-policy)); plan the next framework upgrade before that support ends. Use Node 24 LTS for deployment. The local verification environment used Node 20.19.5; `package.json` records compatible runtime ranges rather than requiring an untested platform migration.

| Location             | Responsibility                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `app/`               | Route composition, metadata, root providers, loading/error boundaries, social images, robots and sitemap     |
| `components/`        | Section components, accessible interactive demos and shared UI primitives                                    |
| `data/`              | Typed projects, career content, case-study metadata, metrics, toolbox mappings, diagram and tour definitions |
| `data/case-studies/` | Two locally authored Markdown articles                                                                       |
| `lib/`               | Pure state machines and helpers for navigation, motion, requests, toast queues, metadata and structured data |
| `styles/`            | Design tokens, reusable motion rules and global tour highlighting                                            |
| `public/assests/`    | Local product screenshots, portrait and SVG assets; legacy spelling retained to preserve URLs                |
| `tests/`             | Node test runner coverage for state machines, contrast tokens and the Canvas engine                          |
| `scripts/`           | Repeatable browser, mobile, accessibility, tour and SEO audits                                               |

## Component architecture

```text
RootLayout
  ThemeProvider (dark default; optional light)
    PortfolioTourProvider
      PointerEffects
      ViewportMotion
      FloatingNav (navigation + native menu/palette dialog)
      RouteTransitions
        Home
          Hero → EngineeringSystem + tour trigger
          Stats (Engineering Snapshot)
          Grid → BentoGrid + EngineeringToolbox
          Experience
          RecentProjects → ProjectPreview + ProjectActions + SneakyArchitecture
          CaseStudies → filtered cards + native preview dialog + open-source links
          Clients (engineering strengths)
          Footer → CopyEmail
        Projects → RecentProjects + Footer
        Case Studies → CaseStudies + Footer
        Article routes
          EngineeringArticle + relevant interactive demo
          MarkdownArticle (two local Markdown sources)
          VibeJournal offline-sync article
        Comet lab → CometLab → shared Canvas engine
```

The root layout persists navigation, theme and tour state between routes. Client boundaries are concentrated around interaction and browser lifecycle needs. Article text, metadata and structured data remain server-rendered. Section components are reused on the home page and dedicated listing routes.

The eight `/case-studies/[slug]` pages use `generateStaticParams`, reject unknown slugs and await Next 15 route parameters. Explicit routes cover the two Markdown articles, VibeJournal offline sync and `/labs/comet`. Twelve case-study destinations and three primary pages form the 15-entry sitemap.

`data/case-studies.ts` is the typed metadata source for filters, previews, article routes, tour destinations and SEO. `data/projects.ts` owns project capabilities and actions. Unavailable demos remain visibly unavailable instead of linking to empty URLs. A resume download is intentionally unavailable because no resume file was supplied.

The duplicate Markdown parsers were consolidated in `MarkdownArticle`. Its constrained syntax supports headings, paragraphs, bold, inline/fenced code, ordered lists and both `*` and `-` unordered bullets. Input is a closed union of local filenames; React escapes content, and no raw Markdown HTML is executed. This is deliberately not a general Markdown engine.

Large interaction components such as navigation, case-study previews and the tour retain their cohesive lifecycle ownership. Their pure algorithms already live in `lib/`; splitting them further solely by line count would add coordination without changing behavior.

## Design tokens and styling

`styles/tokens.css` is the source of truth for semantic surfaces, text, borders, accent/focus colors, shadows, radii, type, spacing and motion. `.light` changes semantic colors without duplicating component styles. CSS Modules own component layout and states; `app/globals.css` owns base elements, focus treatment and shared utilities. Tailwind remains for existing utilities/preflight; compatibility aliases avoid a broad styling rewrite.

- Spacing follows a 4px base with named steps, fluid page gutters and section spacing.
- Responsive display/section typography uses `clamp`; text uses system fonts, avoiding font downloads and font-swap shifts.
- Controls use a 44px base height. Radii are 6px, 10px and 14px, plus pill shapes.
- Cards use semantic surfaces, borders and restrained shadows. Pointer highlights share the same interaction tokens.
- Focus uses a 2px visible outline and 4px offset. Contrast tests cover text and focus colors on dark and light solid surfaces.
- Root-error styling is intentionally self-contained: if the root layout fails, neither its token stylesheet nor providers can be assumed to exist.

## Motion architecture

`styles/motion.css` defines `fade-up`, `fade-in`, `scale-in`, `line-draw`, `stagger-list`, `number-reveal` and `section-reveal`. Typical durations are 150–360ms, with 4–8px travel, 0.98 scale and 35ms bounded staggering. Numbers are revealed as factual text, not invented rolling values.

`ViewportMotion` uses one IntersectionObserver and discovers newly mounted elements with a MutationObserver. Content is visible before JavaScript; viewport reveals run once. Filtering uses bounded Web Animations API opacity/transform transitions through `lib/motion.mjs`. Mobile uses simpler fades. Reduced-motion preference changes stop active motion and preserve content.

`RouteTransitions` leaves routing and history to Next/browser. An inert, aria-hidden outgoing snapshot fades while the real new route enters; navigation never waits for an exit animation. Snapshots have duplicate IDs removed, bounded retention and cleanup on completion/unmount. Desktop entry has a small vertical offset; mobile entry only fades. Browser back/forward follows normal history.

Continuous work is reserved for explicit demonstrations. Timers, animation frames, observers and listeners are cleaned up. Page progress and career-line progress need continuous geometry; their passive scroll handlers are batched through requestAnimationFrame rather than replaced by an observer that cannot provide equivalent progress.

## Interactive systems

| System              | Implementation and lifecycle                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation          | Shared active-section/progress calculation; native modal drawer; scroll locking and focus restoration                                                                             |
| Command palette     | Local fuzzy search, listbox keyboard navigation, Cmd/Ctrl+K, Escape, session-only recents; no search dependency                                                                   |
| Hero system         | Inspectable semantic buttons and SVG/CSS event flow, explanatory text and motion controls                                                                                         |
| Pointer layer       | One shared controller writes CSS custom properties through requestAnimationFrame; cached geometry; no per-move React state; disabled for coarse/touch pointers and reduced motion |
| Career timeline     | Semantic role articles with concise impact and expandable contributions; progressive selection and transform-based line progress                                                  |
| Case-study explorer | Typed categories, visible count/empty state, desktop filters and compact mobile selection; full article links remain crawlable                                                    |
| Sneaky request      | Reducer-backed ordered steps, inspectable nodes, explicit play/pause/reset and text describing the architecture                                                                   |
| Plinko pipeline     | Event/state/synchronization/scheduling/UI stages with play/pause/restart and a qualitative main-thread illustration; no fake performance measurements                             |
| Toast playground    | Isolated Pub/Sub bus and queue reducer; FIFO overflow, expiry, critical interruptions, dismiss and timer pause on focus/hover/hidden tab                                          |
| Comet               | Canvas surfaces share one scheduler; bounded launches, coordinate/DPR handling, virtual time, cleanup and hidden/offscreen pausing                                                |
| Quick tour          | Nonmodal DOM aside and seven typed stops; user-controlled Previous/Next, explore/return focus, Escape/Exit and navigation cleanup; no timed advancement                           |
| Contact             | Native mail/social actions; clipboard feedback has a live status, failure message and timeout cleanup                                                                             |

## Performance decisions

- All portfolio content routes are statically generated. Build output generated 23 entries including framework/metadata routes.
- Production build reports shared first-load JavaScript of **103kB**, home **161kB**, projects **121kB**, case-study explorer **139kB**, and Comet **114kB**. These are Next build estimates, not Lighthouse scores or field Core Web Vitals.
- `next/image` serves dimensioned screenshots with responsive sizes and lazy loading. Local product imagery is reused; decorative diagrams use SVG/CSS rather than extra image downloads.
- Removed unreachable globe, legacy animation/button/approach components, unused utilities and their Three.js/React Three Fiber/Drei/Framer Motion dependencies. This reduces installation and maintenance overhead; the old unmounted components were not necessarily shipped in page bundles.
- Removed the obsolete Vercel CLI dependency and its deployment script; the documented public site is hosted on Netlify. Build/start remain host-independent.
- No product-tour, command-search or general animation library is needed. CSS/WAAPI handle UI motion; only the Comet experiment uses Canvas.
- Dependency audit reports **zero vulnerabilities**, including development dependencies. Scoped overrides patch Next's PostCSS and the legacy minimatch branch's brace-expansion without forcing a Next 16 or ESLint 9 migration. Recheck these overrides when updating their parents.

### Monitoring

Sentry is updated to 11.17.0, following the [Next.js integration guidance](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/). Browser initialization uses `instrumentation-client.ts`; server/edge initialization uses `instrumentation.ts`. Error boundaries share a guarded lazy reporting helper.

Set `NEXT_PUBLIC_SENTRY_DSN` at build time for browser monitoring, and `SENTRY_DSN` (or the public DSN) for server monitoring. Without a DSN, the portfolio runs without monitoring requests. Automatic user info, cookies, headers, bodies and query-parameter collection are disabled. Session replay and continuous tracing are not enabled. Source-map uploading additionally requires `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT`; keep the auth token server-side. The no-credentials production build was tested; actual ingestion and authenticated source-map uploads require deployment credentials and were not exercised.

## Accessibility and responsive decisions

- One main landmark and one primary heading per content route, with a keyboard skip link and semantic section/article headings.
- Buttons perform actions, links navigate. Disabled destinations explain why they are unavailable.
- Native modal dialogs provide background isolation, keyboard containment, Escape handling and focus return. Body scroll is restored on close/unmount.
- Command search uses an accessible input, selected-option semantics and keyboard navigation. Empty results do not leave an invalid selection.
- Every visualization has an equivalent textual explanation; inspection works with buttons and focus, not hover alone. Educational simulations are identified as illustrations.
- Mobile diagrams use internal scrollers or stacked layouts. Code examples are labelled, keyboard-scrollable regions. Cards, timelines and the palette adapt to narrow/short viewports.
- Motion preferences are respected both in CSS and JavaScript, including changes during a session. Forced-colors styles retain visible focus and controls.
- Loading uses decorative skeletons plus a status message/busy region. Route and root error boundaries provide retry and home recovery without leaking error details. Recovery links deliberately reload the document to escape failed router/layout state. Unknown routes return HTTP 404 with useful navigation.

Chrome/axe scans returned no automated WCAG A/AA violations on all 15 routes, plus the existing 19 route/theme/dialog scans. Axe cannot resolve some navbar contrast because of its pseudo-element background; those were reviewed against the solid surface tokens and screenshots, with token contrast regression tests retained. Automated scans are not a claim of complete WCAG certification or a substitute for assistive-technology testing.

## Verification and maintenance

```sh
npm ci
npm run typecheck
npm run lint
npm run check
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 4188
```

`check` includes ESLint, Stylelint and Prettier. ESLint now uses its own CLI rather than deprecated `next lint`; it checks application code and audit/test scripts. The production audit exposed an existing test helper's forbidden `module` binding, which was renamed. Both original formatting failures are resolved.

Browser audits accept `AUDIT_URL`, `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `AXE_SCRIPT`. Supply installed Playwright and axe-core paths (the audit tools are intentionally not production dependencies):

```sh
node scripts/audit-production.cjs
node scripts/audit-accessibility.cjs
node scripts/audit-mobile.cjs
node scripts/audit-tour.cjs
node scripts/audit-seo.mjs
```

The final pass uses an isolated source copy under `/tmp/portfolio-production-qa` so a running development server cannot corrupt the production artifacts. Results are recorded in `docs/production-readiness.md`. Generated audit reports/screenshots live under `/tmp`, not in the shipped application. Repeat audits after changing global layout, dialog behavior, tokens, routes or dependencies.
