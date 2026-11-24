# Production-readiness pass

Date: 24 November 2026. Scope: application source, content, configuration, dependencies, existing tests and the built public routes. No deployment was performed.

## Changes

- Updated vulnerable Next.js 14.1.4 to 15.5.29 while preserving React 18, existing routes and layout architecture; adapted the dynamic article route to async parameters.
- Updated Sentry to 11.17.0 with current instrumentation entry points. Removed hardcoded initialization, default tracing and replay; monitoring now requires configured DSNs. Added explicit data-collection restrictions.
- Applied compatible transitive patches, including scoped PostCSS and brace-expansion overrides. Final `npm audit` reports zero vulnerabilities across production and development dependencies.
- Removed confirmed unmounted globe, legacy spotlight/text/border/approach/button components, unused helpers and their Three.js/Framer Motion dependencies. Removed the unused Vercel CLI and outdated deploy shortcut.
- Consolidated two duplicate Markdown article renderers and retained semantic headings, lists and keyboard-scrollable code. Added support for both Markdown bullet styles so formatting cannot flatten lists into paragraphs.
- Added typed route/root error recovery, a custom HTTP 404 page and accessible loading placeholders.
- Added reproducible `typecheck`/`test` scripts and switched ESLint to its direct CLI. Fixed original formatting failures and a test-helper identifier caught by broader linting.
- Added `scripts/audit-production.cjs` for all-route console, image, link, accessibility, reflow and history checks. The tour's no-timed-scroll assertion allows one CSS pixel for Chromium fractional-layout rounding.
- Updated the stale README and documented the current architecture in [portfolio-architecture.md](portfolio-architecture.md).

## Verification

| Check               | Result                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck` | Pass; also checked unused locals/parameters                                                                                |
| `npm run lint`      | Pass                                                                                                                       |
| `npm run check`     | Pass: ESLint, Stylelint, Prettier                                                                                          |
| `npm test`          | 26 tests pass                                                                                                              |
| `npm run build`     | Pass; 23 statically generated entries including framework/metadata routes                                                  |
| `npm audit`         | 0 vulnerabilities                                                                                                          |
| Production crawl    | 15 content routes, 45 internal links; all rendered images load; no browser console/page/resource errors                    |
| SEO                 | 15 unique canonical/metadata sets; 12 study destinations; sitemap, robots, icons, social image and unknown-slug 404 pass   |
| Accessibility       | No automated violations on 15 routes and 19 additional route/theme/dialog states                                           |
| Mobile interactions | Pass at 320, 375, 390, 430 and 768px, including touch inspection, drawer, filters, modals, code and short-viewport palette |
| Tour                | All seven stops pass at 1440 and 320px; Previous/Next, focus, exit, history and no autoplay                                |

The production crawl additionally checks all 15 routes at each of the five mobile widths and browser back/forward transition cleanup. The dedicated mobile script covers deeper interactions on seven representative routes. Chrome screenshots were reviewed for the narrow diagram, navigation drawer and desktop tour.

The build ran from an isolated source copy at `/tmp/portfolio-production-qa`, with shared installed dependencies. This avoids interfering with an existing development build. Browser tools were supplied from the locally installed Playwright/axe packages; the app does not depend on them at runtime.

## External links and practical limits

Seven public demo/GitHub URLs returned HTTP 200. LinkedIn returned its automation-blocking 999 response. npm website links returned 403, while registry queries confirmed `css-module-class-utils` 0.1.1 and `friendly-error-messages` 0.1.0 exist. Those blocked pages were not declared broken or silently replaced. External service availability can change after this audit.

Axe's unresolved navbar contrast group involves pseudo-element backgrounds. Solid token contrast tests pass in both themes and screenshots were reviewed; this is not a blanket WCAG certification. Real screen-reader sessions and physical iOS/Android devices were not tested. Mobile coverage uses Chromium viewport/touch emulation.

Next 15.5.29 logs an internal `NoFallbackError` when an unknown static case-study slug is requested, while correctly returning HTTP 404. The static-route restriction is retained: allowing dynamic fallback instead produces a streamed HTTP 200 not-found response, which is worse for SEO. This framework-side diagnostic remains a known limitation; normal routes have no browser console errors.

Sentry ingestion and authenticated source-map uploads were not exercised without credentials. Error/loading components were typechecked and built; the 404 recovery path was browser-tested. Root-layout crash recovery was not fault-injected into the production build.

The reported bundle figures are build estimates, not field Core Web Vitals. Monitor real deployment performance, keep dependency audits in the release process, and recheck Next's maintenance window before the next release.
