# Portfolio redesign plan

Audit date: 16 November 2026.

## Objective and scope

Transform the portfolio into a professional, fast engineering showcase that answers three questions quickly: what Binit builds, how he solves difficult problems, and where the visitor can inspect the evidence. Retain the existing Next.js foundation and valuable technical writing; improve content hierarchy, navigation, semantics, and purposeful interaction.

This is a repository audit and implementation plan only. No application code, dependencies, configuration, or assets were changed. The review covers tracked application source, every component and stylesheet, content files, configuration, dependency declarations and lockfile versions, static asset inventory, and repository tooling. Generated `.next` output and dependency internals are not treated as authored source.

Evidence levels used below:

- **Confirmed:** directly observable in source, local file metadata, or executed checks.
- **Risk:** a plausible runtime or usability consequence requiring browser measurement.
- **Proposal:** a future implementation decision, not existing functionality.

No production build, browser walkthrough, Lighthouse run, screen-reader session, deployed-link check, or production traffic measurement was performed. Performance budgets below are proposed acceptance criteria, not current scores. Claims about the projects described by the portfolio were reviewed as content, not independently verified against their external repositories.

## 1. Current architecture

### Framework, libraries, and tooling

| Area          | Current implementation                                                                 | Implication                                                                                       |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Framework     | Next.js App Router, pinned `14.1.4`; React/React DOM locked to `18.2.0`                | Keep routing and server rendering; assess framework maintenance separately before implementation. |
| Language      | Strict TypeScript; locked compiler `5.4.5`; `allowJs` enabled                          | Good starting point, but CSS Module keys and several `any` APIs remain unchecked.                 |
| Styling       | Tailwind CSS 3, CSS Modules, global CSS variables, PostCSS/Autoprefixer                | Retain both with explicit ownership rules.                                                        |
| Motion        | Framer Motion locked to `11.1.7`, CSS keyframes and transitions                        | Multiple mechanisms exist; reduced-motion support is inconsistent.                                |
| 3D            | Three.js `0.163.0`, React Three Fiber, Drei, three-globe                               | Used for the about-card globe, not an engineering explanation.                                    |
| Utilities     | `clsx`, `tailwind-merge`, `react-icons`; `mini-svg-data-uri` in Tailwind configuration | `cn` is useful; avoid additional styling abstraction without a concrete need.                     |
| Theme         | `next-themes` provider with dark default and system support                            | Portfolio colors are mostly fixed dark values; no theme switch exists.                            |
| Monitoring    | Sentry Next.js `7.105.0`, browser/server/edge configuration and global error boundary  | Build integration is conditional; runtime configuration needs explicit environment policy.        |
| Quality tools | ESLint, Stylelint, Prettier; npm lockfile                                              | No tracked application tests, test runner setup, CI workflow, or performance budgets.             |
| Deployment    | README points to Netlify; `deploy` script invokes Vercel production deployment         | Document one intended deployment target and verify its Next.js/image behavior.                    |

Versions above describe this repository, not recommended upgrade targets. No package installation or vulnerability audit was performed.

### Folder structure

```text
app/
  layout.tsx, provider.tsx          metadata, theme wrapper
  page.tsx, page.module.css        homepage composition and background
  globals.css                     base styles and palette
  global-error.jsx                Sentry error reporting
  case-studies/
    sneaky-recommendation-system/  Markdown reader + article CSS
    cache-first-recommendation-api/ duplicated Markdown reader
components/
  hero/, grid/, experience/, project/, case-studies/, client/, footer/
  approach/, stats/                currently unmounted sections
  button/                         currently unrendered shimmer action
  ui/                             navigation, bento, text, borders, globe
data/
  index.ts                        nav, bento, projects, work, social links
  case-studies/*.md                two long-form articles
  globe.json                      geographic FeatureCollection
lib/utils.ts                      class merging, download helper, nav scaling
public/assests/                    images and SVGs; spelling is existing API
```

There is no portfolio backend, database, authentication, API route, middleware, CMS, or remote data-fetching layer. Spring Boot, Kafka, Redis, Appwrite, Prisma, and other technologies in project descriptions belong to showcased projects; they are not portfolio runtime dependencies.

### Routes and navigation

| Route/surface                                  | Implementation                                                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                            | Server component composes navigation, hero, about grid, experience, projects, case studies, strengths, footer, in that order.                                                         |
| Homepage sections                              | Six hashes from `data/index.ts`: `#about`, `#experience`, `#projects`, `#case-studies`, `#what-i-bring`, `#contact`.                                                                  |
| `/case-studies/sneaky-recommendation-system`   | Server page synchronously reads local Markdown and renders a custom parser.                                                                                                           |
| `/case-studies/cache-first-recommendation-api` | Essentially the same parser; imports the first article's CSS Module.                                                                                                                  |
| Other case studies                             | Nine entries are defined inside `CaseStudies.tsx`; all open local-state modals, and only two offer a further full-page article link.                                                  |
| Project-to-study links                         | `RecentProjects.tsx` converts special hashes into a browser `CustomEvent("open-case-study")`; `CaseStudies` listens and opens a modal. These are buttons, not navigable article URLs. |

Modal state is not encoded in the URL. Reload, sharing, browser Back, and opening a case study in another tab do not reproduce that state. Article pages have a back link but no shared site navigation or footer.

### Rendering and component hierarchy

```text
RootLayout (server)
└── ThemeProvider (client; children can still be server-rendered)
    └── Home (server)
        ├── FloatingNav (client; resize listener and scale state)
        ├── Hero
        │   ├── Spotlight × 5
        │   └── TextGenerateEffect (client; initially transparent words)
        ├── Grid
        │   └── BentoGrid / BentoGridItem (client; numeric ID variants)
        │       └── GridGlobe → dynamic World → Canvas / Globe / OrbitControls
        ├── Experience
        │   └── MovingBorders.Button (client; defaults to button)
        ├── RecentProjects (client; all cards and event bridge)
        ├── CaseStudies (client; all study data, cards, modal)
        ├── Clients (actually “What I Bring”)
        └── Footer
```

Client components are not automatically client-only rendering: the explicit globe import uses `ssr: false`, while ordinary client components can have initial server-rendered HTML. The concern is unnecessary hydration and browser payload, especially the large study data array in a client module.

### Styling architecture and visual language

CSS Modules contain most section layout and BEM-like selectors. Tailwind is used in shared effects, globe layout, and presentation strings embedded in `gridItems`. Globals define a navy/slate/cyan palette alongside a second set of generic light/dark HSL tokens. Many components repeat gradients, shadows, border colors, heading sizes, and action styles.

The current language is consistent but visually repetitive: nearly every section is a glowing bordered panel. Repeated raised-card hover effects make informational cards appear actionable. Inter is named in the font stack but is not loaded by this repository, so visitors commonly see a system fallback.

Tailwind configuration includes custom SVG background utilities, a `600–1024px` breakpoint, global color-variable generation, and several animation definitions. Configuration breadth should be checked against actual use before retaining it. `components.json` is shadcn-style configuration, not evidence of an installed component library.

### Content models and case studies

- `data/index.ts` exports inferred arrays rather than explicit domain contracts. Content and presentation are mixed through `className`, `imgClassName`, and `titleClassName` fields.
- `BentoGridItem` switches behavior using IDs `2`, `5`, and `6`; technology labels are maintained inside the UI component.
- Hero links, contact constants, strengths, approach steps, statistics, study metadata, and long-form content live in different places.
- Three projects are listed: Sneaky, Snapgram, and the explicitly in-development VibeJournal. Preserve the distinction between implemented and planned functionality.
- Nine study entries cover Toast 2.0, Plinko, Free Chips, Sneaky platform, two recommendation topics, two npm packages, and Snapgram. This is valuable material but too much for equal-weight homepage cards.
- Modal fields repeat similar claims across summary, outcome, architecture, challenges, and key work. Sneaky appears in the project card, platform study, and two related technical studies.
- The two Markdown articles lack structured frontmatter, generated reading times, section IDs, and a shared content loader. The custom parser supports a limited subset: headings, paragraphs, star lists, ordered lists, fenced code, bold, and inline code. It does not implement general Markdown links, tables, or nested structures.
- The older recommendation article frames ML as future work; the newer article and platform summary describe optional ML integration. Present this as dated evolution rather than contradictory current state. Personalization-signal definitions also need reconciliation across summaries and articles.
- Figures such as code reduction, CPU reduction, and rendering improvement are useful evidence candidates, but the site contains no measurement methodology. Cache TTL, candidate count, and feature counts are configuration/scope facts, not demonstrated user outcomes.

## 2. Assessment of the existing portfolio

### 1. Components to retain

| Retain                                                                                                 | Why / required refinement                                                                   |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| App Router and server page composition                                                                 | Suitable for static content plus small interactive islands.                                 |
| CSS Modules, palette foundation, `cn` helper                                                           | Existing conventions can support a coherent design system without a rewrite.                |
| `next/image` usage and reserved project aspect ratios                                                  | Useful layout-stability foundations; correct sizing and asset weight remain necessary.      |
| Project screenshots, real repositories, contact/social destinations                                    | Concrete evidence and clear conversion paths.                                               |
| Case-study writing and work history                                                                    | Strong substance; edit and reorganize rather than discard.                                  |
| Article server rendering                                                                               | Keep content readable without browser JavaScript.                                           |
| Globe visibility/reduced-motion guards and moving-border observer cleanup patterns                     | Good patterns to carry into any future interactive demo, even if these visuals are retired. |
| Metadata title template, language, named social links, decorative empty alt text where already correct | Extend these existing accessibility/SEO foundations.                                        |

### 2. Components to redesign

| Current component                                  | Proposed treatment                                                                                                                 |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`                                             | Short positioning statement, one primary work CTA, secondary contact CTA, one concise evidence line. Use a real visible `h1`.      |
| `FloatingNav`                                      | Shared responsive header with readable mobile disclosure navigation and active-section indication. Remove transform-based scaling. |
| `Grid` / `BentoGridItem`                           | Compact about section and evidence-linked capabilities. Replace ID-driven rendering with named components/variants.                |
| `Experience`                                       | Short impact-led timeline after selected work; role details in native disclosures. Render articles, not inert buttons.             |
| `RecentProjects`                                   | Reusable project cards with problem, contribution, result/status, selective stack, and real study URLs.                            |
| `CaseStudies`                                      | Server-rendered study previews plus canonical article routes; remove the event bridge and long-form modal dependency.              |
| `Clients`                                          | Rename to match meaning or merge into capabilities linked to concrete projects. It contains no client testimonials.                |
| `Footer`                                           | Compact contact block with consistently sized email/social actions and optional copy-email enhancement.                            |
| `TextGenerateEffect`, `Spotlight`, `MovingBorders` | Retire from essential text and repeated card chrome; retain only restrained effects with a purpose.                                |
| `GridGlobe` / `Globe`                              | Remove from the default about experience; an unrelated rotating globe offers less evidence than a small engineering demo.          |

### 3. Dead, duplicated, and inconsistent code

Confirmed cleanup candidates, to remove or consolidate during implementation:

- `Stats` is commented out in `app/page.tsx`; `Approach` has no mounted consumer. Their styles and constants remain in the repository.
- `Hero.tsx` imports `Button` and `ScrollExploreIcon` without rendering either. The shimmer button and scroll-icon styles are therefore not part of the active UI.
- `downloadFile` has no consumer. `Footer` defines unused `RESUME`, `LINKEDIN`, and `GITHUB` constants. The referenced resume PDF is absent, but there is no active resume link to fail today.
- The README advertises resume download and a scroll-to-about CTA that the current render does not provide.
- The two 181-line article pages duplicate the parser and template. One route imports styling from its sibling route.
- `Hero` references three undefined spotlight CSS keys. `RecentProjects` references an undefined featured-card modifier. `CaseStudies` references an undefined card-body class. Ordinary CSS Module typings did not catch these.
- `Hero.module.css` ends with an empty `@media (prefers-reduced-motion: reduce);` rule; it changes nothing.
- The two bento spare-image wrapper selectors have identical declarations. Heading, tag, panel, and action styling is repeated across sections.
- `GridGlobe` retains commented tutorial markup and sample arc data. Random color selection uses `colors.length - 1`, so the last color is never selected.
- Five spotlights reuse the same SVG filter ID, introducing duplicate IDs in the document.
- Every project displays “Featured Project,” even though only Sneaky sets `featured: true`.

Unused Tailwind animation/plugin definitions are **candidates**, not proven removable dependencies. Audit references and generated output before deleting packages. The Three.js dependency family is currently active; it becomes removable only if the globe is removed and no replacement uses it.

### 4. Components that should become reusable

Extract `Container`, `Section`, `SectionHeading`, `Surface`, `ActionLink`, `Button`, `TagList`, `ProjectCard`, `CaseStudyCard`, `EvidenceMetric`, `Disclosure`, `ArticleLayout`, `ArticleContents`, and `CodeBlock` where repeated use exists. Share appearance between actions while keeping links and buttons semantically distinct.

Avoid a large polymorphic component framework. Separate static content composition from behavior. A small demo may need its own state machine and controls without making every card a client component.

### 5. Sections that feel too much like a résumé

- The hero repeats a broad role summary and a long technology-heavy paragraph before the visitor sees work.
- Six about cards restate skills, architecture, practices, and ongoing learning; the technology cloud adds another keyword list.
- Three experience entries with 13 total bullets precede the projects. This makes chronology the primary homepage narrative.
- Project cards combine a paragraph, 8–10 technology tags, five highlights, and multiple actions each.
- Six “What I Bring” cards restate claims already present in hero/about/work sections.
- Case-study modals repeat contribution statements across several long lists.

Change the homepage order to **positioning → selected work → engineering demonstration → production impact → about → contact**. Put longer writing in a searchable-by-navigation study index, not all on the homepage. Keep a résumé as an optional download only when an actual up-to-date asset is supplied.

### 6. Opportunities for meaningful interaction

Prioritize one polished demonstration tied to the strongest frontend story: a notification lifecycle playground inspired by Toast 2.0. Let a visitor enqueue, pause, dismiss, and trigger duplicate notifications, then inspect a concise event/state explanation. Use original sample content and label it an illustrative reconstruction.

Useful follow-ons are a cache hit/miss/failure walkthrough in the Sneaky article, a small interruption-safe animation example for Plinko, and preset input/output examples for the npm packages. Each demonstrates decisions, recovery, and constraints rather than decoration. Build follow-ons only after the first demo meets accessibility and payload budgets.

### 7. Mobile UX problems and risks

- **Confirmed:** `getResponsiveScale()` shrinks the entire navigation to `0.55` at 300px and approximately `0.65` at 375px. Text and hit targets shrink with it. At 375px, the nominal 0.78rem text becomes about 8px at a 16px root size.
- **Risk:** the `max-content` fixed nav is not a true narrow-screen layout and changes scale after hydration. Test overlap, clipping, and layout jumps at intermediate widths and zoom.
- **Confirmed:** case-study cards jump directly from one column to three at 768px, leaving little width for long titles. Use an intermediate two-column layout only when content fits.
- **Confirmed:** experience wrappers span two grid columns from 768px even when the parent declares one; at desktop they also span both declared columns. The wrapper defeats the apparent intended two-card layout and can introduce implicit tracks.
- **Risk:** long modal content scrolls within `88vh`; the absolutely positioned close button scrolls away. Test short landscape viewports and browser-toolbar changes.
- **Risk:** bento images/globe use absolute positioning within clipped cards. Text, portrait crop, and globe placement need real viewport validation.
- **Confirmed:** project action minimum height is 2.35rem and social controls are 2.5rem; standardize to a comfortable 44px minimum design target.
- **Confirmed:** the footer uses two action columns from 640px despite having one email action, producing an unnecessarily half-width action.
- Broad horizontal overflow hiding can conceal layout defects. Fix the source of overflow and allow local horizontal scrolling for code samples.

### 8. Accessibility problems

Highest priority is semantics and keyboard access:

- Experience cards render as `<button>` through `MovingBorders.Button`, with no action. Their headings and lists are inside an inappropriate interactive wrapper.
- The hero name is rendered in `div`/`span` elements, while section and project/role titles repeatedly use `h1`. Establish one page title, section `h2`s, and nested `h3`s.
- The modal supplies a dialog role, label, Escape close, and body scroll lock, but lacks initial focus, focus containment, focus restoration, and inert background handling. `aria-modal` alone does not implement these behaviors.
- There is no skip link. Header/footer currently sit inside homepage `main`; move global chrome outside the main landmark.
- The animated hero words start at opacity zero and depend on JavaScript to appear. Core identity must remain visible when scripts fail or are disabled.
- Reduced motion is handled in the globe and moving border, but not across text reveals, spotlights, modal transitions, card transforms, or globally forced smooth scrolling.
- Focus treatment is inconsistent. Some study/article controls have custom focus styles, others rely on browser defaults, and the dormant shimmer button explicitly removes focus outlines. Define a clear shared `:focus-visible` ring.
- `--portfolio-muted` (`#64748b`) against base navy (`#0f172a`) has a calculated contrast of approximately **3.75:1**. It is used for small experience dates; choose a lighter text token. Verify actual composited panel colors in-browser.
- Portrait alt text repeats a long capability statement; use a concise description of the portrait. The footer grid has `alt="grid"` despite being decoration. Decorative SVGs should be hidden from assistive technology.
- Long article headings have no fragment IDs/contents navigation. Improve orientation for keyboard and screen-reader readers.

### 9. Performance problems and risks

| Evidence                                                                                      | Consequence / action                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `grid.svg`: 3,620,195 bytes; `b5.svg`: 437,737 bytes                                          | Active decorative sources are unexpectedly large. Inspect and simplify/replace with CSS or optimized artwork. SVGs should not be assumed to receive raster-style image optimization. |
| Sneaky PNG: 4,459,601 bytes; VibeJournal: 2,480,013; Snapgram: 2,336,995                      | Resize and encode suitable source assets. `next/image` can reduce delivered bytes, so these source sizes are not measured transfer sizes.                                            |
| Portrait JPEG: 493,510 bytes; globe JSON: 318,001 bytes / 244 features                        | Optimize the portrait and avoid loading geographic data without a user-facing purpose.                                                                                               |
| Full study array lives in an 840-line client component                                        | Move bodies into server-only content and hydrate only behavior; no need to ship unopened article text as application JavaScript.                                                     |
| Project image `sizes` says 24rem from 640px, while the actual card width varies substantially | Correct slot sizes to avoid undersized images on wide tablet cards or unnecessary fetching in other layouts.                                                                         |
| Five large blurred SVGs, repeated backdrop filters, shadow transitions                        | Potential paint/compositing cost; profile on a constrained device, then reduce decorative layers.                                                                                    |
| Globe is dynamically imported, visibility-gated, reduced-motion-aware, DPR-capped             | Existing mitigations are real; do not claim it loads eagerly for every visitor. Remaining visible GPU cost and remount cost need measurement.                                        |
| Moving borders call SVG geometry APIs per frame                                               | Cache path length after resize, or replace repeated animated borders with static styling. Visibility guards skip work, though frame callbacks still exist.                           |
| Sentry config requests trace sampling of 1 and replay sampling of 0.1 / 1 on error            | Verify actual SDK loading and production sampling before claiming overhead. Only the build wrapper is explicitly environment-gated in `next.config.mjs`; README wording is broader.  |

There are no measured LCP, CLS, INP, transferred-JavaScript, or frame-time results from this audit. Existing `.next` artifacts may be stale and are not a baseline.

### 10. Showcasing frontend engineering through the site itself

The portfolio should demonstrate progressive enhancement, typed content contracts, robust URL navigation, accessible stateful controls, interruption-safe animation, responsive layout under content stress, and measured asset/runtime budgets. Link a short “How this portfolio is built” note from the footer once implementation exists, including actual measurements, tradeoffs, and repository links.

Expose useful behavior through the demonstration UI; keep instrumentation and architecture explanations in optional details. Avoid a fake terminal, forced preloader, custom cursor, scroll hijacking, or a mandatory 3D introduction.

## 3. SEO assessment and strategy

Existing strengths: root metadata includes title template, description, author, Open Graph, Twitter card, metadata base, and favicon. Both article routes have unique title/description values and server-rendered content.

Confirmed gaps:

- No sitemap, robots metadata route, canonical declarations, or structured data is present.
- Seven modal-only studies have no individual indexable reading route. Their full content is not rendered until opened.
- Article routes do not define article-specific social metadata; root social fields describe the homepage.
- The Open Graph image is declared as 1200 × 630, but the actual portrait is 1070 × 1070. Use an intentional share image with correct dimensions.
- No shared article navigation, stable heading anchors, related reading, or generated reading-time calculation exists.

Generate metadata and routes from a single validated study registry. Preserve both current article URLs, provide stable new URLs for all published studies, and define canonicals using the actual deployment domain. Add sitemap/robots and descriptive share images. If adding Person/CreativeWork structured data, include only supported facts; do not invent testimonials, ratings, publication dates, or metrics.

## 4. Proposed architecture

### Architecture decisions

1. Retain Next.js, React, TypeScript, CSS Modules, and Tailwind. Do not combine the redesign with an unscoped framework migration. Review dependency maintenance as a dedicated preparatory task.
2. Default content and layouts to server components; isolate navigation state, demonstrations, and clipboard feedback in small client leaves.
3. Keep local versioned content. Use typed metadata plus Markdown bodies rendered on the server through one maintained Markdown pipeline. Add MDX only if authored interactive embeds justify it; otherwise use a typed demo registry outside Markdown.
4. Replace local-state study modals with standard routes first. An optional short preview dialog is a later enhancement, not the canonical reading surface.
5. Keep only necessary shared state. No global state library or remote CMS is justified by the current portfolio.
6. Use one documented dark palette initially. Remove the partial theme mechanism if light mode is not implemented; if light mode is later added, test every surface and asset deliberately.

### Proposed folder structure

```text
app/
  layout.tsx                       shared header, footer, metadata
  page.tsx                         curated homepage
  globals.css                      reset, base semantics, tokens
  case-studies/
    page.tsx                       all published studies
    [slug]/page.tsx                 shared statically generated article route
  sitemap.ts, robots.ts
  not-found.tsx, global-error.jsx
components/
  layout/                          Header, MobileNav, Container, Footer
  sections/                        Hero, SelectedWork, EngineeringLab,
                                   ProductionImpact, About, Contact
  projects/                        ProjectCard, ProjectLinks
  case-studies/                    CaseStudyCard, ArticleLayout, Contents,
                                   EvidenceMetric, RelatedStudies
  demos/                           NotificationDemo and its local controls
  ui/                              ActionLink, Button, TagList, Disclosure
content/
  profile.ts, navigation.ts, projects.ts, experience.ts
  case-studies/                    typed registry and Markdown bodies
lib/
  content/                         server-only loader, validation, rendering
  demos/                           pure transitions / illustrative fixtures
  utils.ts
styles/                            token definitions if globals become crowded
public/                            optimized media and share images
tests/                             critical content and interaction checks
```

This is a target shape, not a requirement to create empty folders. Keep CSS Modules beside their components. Preserve `/assests/` references during migration unless every reference is updated together; fixing the spelling alone is not a redesign priority.

### Content contracts

| Model             | Core fields and rules                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Project`         | Stable ID, title, short problem statement, contribution, outcome, status (`live`, `in-progress`, `archived`), preview with alt/dimensions, selective technologies, typed links, related study slugs. |
| `CaseStudy`       | Slug, title, summary, category, role, dates when known, tags, body source, related project IDs, optional evidence and demo ID.                                                                       |
| `Evidence`        | Value, label, scope, source/context, measurement method/date where available; distinguish measured impact from configuration or feature counts.                                                      |
| `Experience`      | Role, company, period, concise impact, optional details, linked studies; keep employer facts in one location.                                                                                        |
| `Profile` / links | Name, positioning, contact, named social destinations, optional verified resume path.                                                                                                                |

Validate unique IDs/slugs, file existence, article references, required alt text, status labels, and internal destinations at build/check time. Separate layout variants from editorial data. Compute reading time from article text. Do not silently turn missing information into invented evidence.

### Proposed component hierarchy

```text
RootLayout [server]
├── SkipLink
├── Header [server] → MobileNav / ActiveSection [client leaves]
├── main
│   ├── Home [server]
│   │   ├── Hero → ActionLink
│   │   ├── SelectedWork → ProjectCard × 3
│   │   ├── EngineeringLab → static explanation + loadable NotificationDemo
│   │   ├── ProductionImpact → impact summaries + Disclosure
│   │   ├── About → portrait + concise capabilities
│   │   └── Contact → mailto link + optional CopyEmail [client]
│   ├── CaseStudyIndex [server] → CaseStudyCard
│   └── CaseStudyPage [server]
│       └── ArticleLayout
│           ├── Summary / role / evidence
│           ├── Contents with native fragment links
│           ├── Markdown body + optional lazy demo
│           └── RelatedStudies
└── Footer [server]
```

When replacing the explicit article routes with `[slug]`, preserve exact existing slugs, generate known pages statically, and return a real not-found response for unknown slugs. Do not leave explicit routes shadowing divergent copies of the same article. Retain useful existing homepage hashes or map them to appropriate sections so incoming links remain useful.

## 5. Interaction strategy

| Interaction               | Behavior and fallback                                                                                                                                                                    | Priority          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Work and study navigation | Real links with stable URLs; normal Back, reload, open-in-new-tab behavior. Core content works without JS.                                                                               | Required          |
| Mobile navigation         | Semantic disclosure button with `aria-expanded` / `aria-controls`; close on selection and Escape; restore focus when appropriate. Do not trap focus in a nonmodal disclosure.            | Required          |
| Article contents          | Native fragment links; optional active-section enhancement via IntersectionObserver. No scroll hijacking.                                                                                | Required          |
| Role detail disclosure    | Native `details` / `summary`, preserving visible role and impact context.                                                                                                                | Required          |
| Notification demo         | Explicit “Try demo” loads the interactive code. Controls for enqueue, pause/resume, duplicate event, dismiss, reset. State explanation and keyboard-operable controls accompany visuals. | First showcase    |
| Copy email                | Keep the `mailto` link and readable address; report copy success/failure through a polite status message.                                                                                | Small enhancement |
| Cache flow walkthrough    | Preset hit, miss, Redis-unavailable, ML-timeout scenarios with a static diagram/text fallback. Label timings as illustrative unless measured.                                            | Later             |
| Package examples          | Small preset inputs and outputs; no arbitrary code execution requirement.                                                                                                                | Later             |

For the notification demo, define bounded queue size, deterministic sample IDs, lifecycle states (`queued`, `visible`, `paused`, `dismissed`), timer ownership, and cleanup on reset/unmount. Rapid actions must not create stale timers or orphaned elements. Avoid repeatedly announcing every animation frame; only announce meaningful state changes. Do not run demos automatically or connect them to employer/production services.

Do not add filtering for only three projects. If the study index grows enough to need filters, implement an accessible control group with URL-backed state and a clear reset action; keep all studies discoverable without scripts.

## 6. Animation strategy

Motion should clarify hierarchy and state, not delay reading.

- Render the hero title and primary actions visible in initial HTML. Optional entrance motion affects a wrapper only and must never be required to reveal content.
- Use CSS for hover/focus/pressed states. Prefer opacity and small transforms; avoid continuously animating layout, blur, and large shadows.
- Proposed motion tokens: 120–180ms control feedback, 180–260ms disclosure/state transitions, up to 320ms for deliberate demonstration transitions. These are design targets, adjustable through testing.
- Limit section reveal to a few nonessential elements. Avoid per-word animation across headings and repeated looping borders.
- Use Framer Motion only where its coordination helps. Use a small WAAPI example inside a dedicated demo if showcasing interruption handling; do not run two animation engines on the same element.
- Reduced-motion mode removes travel, scale, stagger, auto-rotation, and smooth scrolling while preserving immediate state feedback and all content.
- Pause demo activity when the document is hidden or the demo is offscreen. Cancel frames, observers, timers, and animation handles on teardown.
- If 3D is retained in a later experiment, load it on request, supply a static fallback and pause control, and handle WebGL failure without breaking the page.

## 7. Responsive and accessibility strategy

Design mobile-first around content rather than scaled desktop UI. Use a shared container, fluid spacing/type tokens, and a reading measure near 65–75 characters. Use one-column cards until their content comfortably supports two columns; reserve three-column study lists for genuinely wide layouts.

| Width / condition        | Intended behavior                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 320–479px                | Readable title, compact header/disclosure menu, stacked primary actions, single-column cards, no clipped content. |
| 480–767px                | Modest spacing increase; two actions may share a row when their labels fit.                                       |
| 768–1023px               | Two study columns if content permits; maintain single-column article reading.                                     |
| 1024px+                  | Selected projects can use image/text splits; article contents can become a sidebar.                               |
| Landscape / short height | No forced full-screen sections; navigation remains usable; demonstrations fit or scroll naturally.                |
| 200% zoom / 400% reflow  | Natural wrapping, no transformed nav, no hidden essential text or fixed-height text boxes.                        |

Use at least 44 × 44px as the design target for primary touch controls, visible keyboard focus, semantic landmarks, logical headings, and labeled controls. Ensure pointer hover never reveals the only access to information. Stack diagrams into a readable step list on narrow screens; constrain code overflow to the code block.

If any dialog remains, use a tested native or established accessible dialog primitive with focus entry/containment/restoration, background inertness, Escape, scroll restoration, and a persistent close action. Prefer full-page reading on all devices.

Test at 320, 375, 390, 768, 1024, and 1440px, plus landscape, increased text size, keyboard-only operation, reduced motion, forced colors, and a screen reader. These tests are future work, not completed audit results.

## 8. Performance and quality acceptance criteria

Provisional budgets for the redesigned production build:

- Initial homepage compressed JavaScript: target at most 170 KiB, with a separately reported optional demo chunk target at most 75 KiB. Measure the actual baseline before finalizing; document any justified exception.
- No Three.js bundle or demo code fetched on the default static homepage path before its activation condition.
- Above-the-fold transferred imagery: target at most 200 KiB. Decorative individual assets: target at most 30 KiB; project preview variants: target at most 150 KiB at their intended display size.
- Lab mobile targets: LCP at most 2.5s, CLS at most 0.1, no substantial interaction-blocking work in the scripted primary flows. Collect real-user INP with a target at most 200ms when sufficient traffic exists; do not substitute a Lighthouse score for field INP.
- Compare three repeatable production-build Lighthouse runs under the same documented viewport/network/CPU settings and use the median. Track regressions separately from absolute targets.
- Idle homepage has no continuous decorative animation work. Optional demos stop unnecessary work when inactive.
- All canonical routes and local media resolve; study bodies and essential navigation are usable with JavaScript disabled.
- No critical/serious automated accessibility findings, followed by manual keyboard and screen-reader verification. Automated checks alone do not establish accessibility.

Use server-generated HTML, accurate image `sizes`, reserved image geometry, and only justified LCP image priority. Keep system fonts for predictable cost unless a locally hosted font provides meaningful benefit. Review Sentry loading/sampling against measured overhead and the site's monitoring needs.

## 9. Implementation phases

| Phase                               | Deliverables                                                                                                                                                    | Exit criteria                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 0. Baseline and editorial inventory | Production build measurements, viewport captures, keyboard audit, route/asset inventory, reconcile project status and metric evidence, document hosting target. | Repeatable baseline and agreed content priorities; no invented outcome claims.                                                              |
| 1. Content and routing foundations  | Typed registries, shared Markdown loader/renderer, canonical study pages/index, preserved existing URLs, remove browser event bridge.                           | All nine published study destinations resolve; existing two URLs preserved; unknown slugs return not found; no-JS article navigation works. |
| 2. Semantics and design system      | Tokens, action primitives, section components, responsive header, skip link, focus and reduced-motion rules, correct experience semantics.                      | Keyboard and small-screen navigation pass; content visible without animation; text contrast verified.                                       |
| 3. Homepage and article redesign    | Reordered homepage, concise hero, selected work, impact timeline, focused about/contact, article contents and related reading.                                  | Primary work is easy to find; duplicates reduced; status labels remain accurate; specified viewports/zoom pass.                             |
| 4. One engineering demonstration    | Notification lifecycle example, static explanation, deliberate lazy loading, deterministic behavior, cleanup and reduced-motion support.                        | Rapid-action, pause, reset, keyboard, and unmount scenarios pass; demo fits payload budget.                                                 |
| 5. Performance, SEO, and cleanup    | Optimize assets, remove unused UI/dependencies after reference audit, metadata/canonicals/social images/sitemap, monitoring policy, README updates.             | Budgets measured; no broken internal links; metadata matches routes; old assets removed only after migration.                               |
| 6. Release verification             | Production smoke tests, browser/device review, screen-reader pass, hosting validation and rollback notes.                                                       | Build/checks pass; route/media and image optimization work on the chosen host; before/after evidence recorded.                              |

Build the content and accessibility foundation before optional interaction work. Do not ship all proposed demos in the first release. No deployment is part of this planning task.

### Focused verification during implementation

- Content validation: unique slugs, related IDs, valid assets and destinations, metadata and article presence.
- Route smoke checks: homepage, study index, all studies, missing slug, direct fragment navigation and Back behavior.
- Behavior tests: menu keyboard flow, optional clipboard failure, demo transitions under rapid actions and pause/reset/unmount.
- Accessibility checks: landmarks/headings, accessible names, keyboard focus, contrast, reduced motion, no-JS content, and screen-reader announcements.
- Visual checks: selected representative viewports, long titles, long words, large text, landscape, and content overflow.
- Performance checks: production bundles, network requests before/after demo activation, optimized image sizes, constrained-device traces, and repeatable Lighthouse runs.

## 10. Checks completed for this audit

| Check                                            | Result                                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `tsc --noEmit --incremental false`               | Passed.                                                                                                                            |
| `next lint --no-cache`                           | Passed with no warnings or errors.                                                                                                 |
| `stylelint 'app/**/*.css' 'components/**/*.css'` | Passed.                                                                                                                            |
| Source/reference inspection                      | Confirmed unused components/imports/helpers, duplicated article renderer, undefined CSS references, modal and navigation behavior. |
| Local asset metadata                             | Confirmed byte sizes and portrait/screenshot dimensions; no delivered-byte assumptions.                                            |
| Browser/performance/build validation             | Not run; explicitly scheduled in Phase 0.                                                                                          |

Passing lint and type checks does not establish sound semantics, usable mobile navigation, reliable focus behavior, or good runtime performance. Those are the most important next validation steps before implementing the visual redesign.
