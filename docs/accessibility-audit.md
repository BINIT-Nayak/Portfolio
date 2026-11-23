# Portfolio accessibility audit

Audit date: 23 November 2026. Target: WCAG 2.2 AA where practical.

This is a source review plus automated and keyboard-driven browser testing, not a claim of full WCAG conformance. VoiceOver/NVDA and physical mobile-device testing remain release checks.

## Scope and method

Reviewed all rendered routes: Home, Projects, Case Studies, the three individual articles (VibeJournal offline sync, cache-first API, recommendation system), and Comet. Reviewed the navigation drawer, command palette, case-study dialogs, hero diagram, Sneaky diagram, Plinko pipeline, toast playground, metrics, career timeline, toolbox, filters, and contact controls. Dormant Globe/Three.js and legacy components that are not imported into these routes are not part of the rendered experience.

Used a production build, Chrome/Playwright, axe-core 4.11.4 with WCAG 2 A/AA, 2.1 AA, 2.2 AA and best-practice rules, source inspection, and computed design-token contrast. Checked dark/light desktop layouts and 390px/320px reflow. A 320 CSS-pixel viewport checks narrow reflow; it is not a substitute for testing actual browser zoom and text-only enlargement with assistive technology.

## Findings and fixes

| Area                   | Finding and decision                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal isolation        | Case studies used `article role="dialog"` and `aria-modal` without making the background inert. Replaced this with native `dialog.showModal()`. The browser now isolates the background, including programmatic focus. Escape, close, backdrop dismissal, scroll locking, Tab/Shift+Tab containment, and opener focus restoration are preserved. The trap includes visible inputs, selects, textareas, and disclosures. |
| Headings               | Standalone listings skipped from h1 to h3. Cards and project subsections now select appropriate levels based on context. Strength cards use h3 under their h2 section. Added an About heading. Every tested page has one h1.                                                                                                                                                                                            |
| Landmarks              | Moved the site contact footer outside main so it is a real contentinfo landmark. Each route keeps one main and the existing skip-link target. Roadmap notes and the pipeline’s thread explanation use ordinary content/groups rather than unnecessary nested complementary landmarks.                                                                                                                                   |
| ARIA                   | Named generic action containers now have a group role. The conceptual toast code panel also has an explicit group role. Removed ambiguous pressed-state semantics from controls whose accessible label already changes between Play/Pause or Pause/Resume. Decorative modal icons are hidden from assistive technology.                                                                                                 |
| Keyboard behavior      | Tested skip-to-main, diagram focus/selection, metric dismissal with Escape, toolbox selection, timeline disclosures, filters, modal wrapping and return, palette commands and empty results. Mobile links preserve modifier-key behavior. Navigation uses links; actions use buttons; disclosures use summary/details.                                                                                                  |
| Focus visibility       | Retained the shared visible-focus outline and forced-color override. Added scroll margins to focused elements for the sticky navigation. Entrance animations stop when their content receives focus, so keyboard targets do not remain transparent during reveals.                                                                                                                                                      |
| Contrast               | Existing solid text/focus tokens meet their tested thresholds in both themes. Portrait text now has an opaque theme-aware backing rather than relying on the brightness of an image beneath a gradient. Canvas effects render behind Comet’s controls and origin label.                                                                                                                                                 |
| Motion                 | Verified reduced-motion disables continuous hero packets, route transitions, ambient pointer effects and decorative CSS animation. Existing Sneaky/Plinko controls use static highlights under reduced motion; explanatory content does not depend on the timing. Comet renders static paths. Playback is user initiated and pausable.                                                                                  |
| Touch targets          | Primary controls use the 44px control-height token. The two case-study title links whose text boxes measure 23px high have full-card pseudo-element hit areas. Comet’s 20px checkbox is wrapped in a clickable label at least 44px high. These are not isolated 20–23px hit targets.                                                                                                                                    |
| Toast timing           | Moved Pause timers and Clear playground ahead of the notification surface, making the timing control available before a keyboard user traverses the demo. Existing focus/hover/hidden-tab pauses, critical interruption and dismiss-focus restoration are retained.                                                                                                                                                     |
| Range values           | Comet’s flight-duration slider exposes its value in milliseconds through `aria-valuetext`.                                                                                                                                                                                                                                                                                                                              |
| Alt text               | Product images retain content-specific descriptions; the portrait identifies Binit. Decorative icons/connectors are hidden. Canvas retains an accessible image description and separate controls/status/text explanation.                                                                                                                                                                                               |
| Screen-reader feedback | Retained concise polite status regions for filters, toolbox results, request playback, demo notifications, Comet, and email-copy feedback. Full reading content is not placed inside live regions; frame-by-frame animation is not announced.                                                                                                                                                                           |

## Visualization text equivalents

| Visualization                  | Equivalent content available without playback                                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero engineering system        | Ordered layer controls plus a native “Read the system explanation” disclosure containing every layer and responsibility.                                                                                                        |
| Sneaky architecture            | Core-path description, node descriptions, and “Read the architecture and request flow”: all components and the entire ordered request sequence with explanations. Cache-hit/miss and asynchronous Kafka caveats remain visible. |
| Real-Time Plinko               | An ordered semantic pipeline with each stage’s responsibility, main-thread explanation, and “Read all example event outcomes” disclosure. No simulated performance numbers.                                                     |
| Toast Messages 2.0             | Producer-to-subscriber flow text, conceptual code, lifecycle rules, visible messages and queue, and status announcements. Timer controls precede the surface.                                                                   |
| Comet                          | Canvas description, named destination buttons, range/checkbox controls, scheduler status, and an ordered measure/schedule/render/cleanup explanation. Canvas motion is optional.                                                |
| Career timeline                | Every role remains a real article with heading, dates, impact list and disclosure; scrolling never removes inactive roles from the accessibility tree.                                                                          |
| Engineering snapshot / toolbox | Metric context works with focus/tap as well as hover. Technology selection shows semantic evidence and announces the result count.                                                                                              |

## Validation

- Production build and TypeScript validation pass.
- ESLint, changed CSS style checks, and formatting checks pass.
- Browser suite: 19 axe scans across seven routes in two themes, two active case-study demos, a palette search and two mobile drawers; zero reported violations for the enabled rules.
- Keyboard/browser checks cover skip focus, node selection, tooltip Escape, toolbox selection, contribution expansion, filter focus, modal background isolation, forward/reverse focus boundaries, focus return, demo controls, palette selection and no-results handling.
- Every route fits 390px and 320px viewports without document-level horizontal overflow. The mobile case-study dialog also fits its viewport.
- Reduced-motion resting page has no running animations or pointer-effect enablement. Forced-color focus uses a visible solid outline.
- Automated token tests require at least 4.5:1 for primary/secondary/muted text on the four solid surfaces, 4.5:1 for primary-button text, and 3:1 for focus color against the four surfaces.
- The lowest tested muted-text surface pair is 5.33:1 in dark mode and 4.83:1 in light mode. The lowest focus pair is 8.11:1 dark and 5.40:1 light.

### Scanner items requiring interpretation

Axe cannot reliably resolve the navigation’s pseudo-element backgrounds, content overlapped by a sticky header after scrolling, or some overlay/canvas compositions. These results are retained as `incomplete` in the generated JSON report rather than hidden or counted as passes. Header text and focus colors were checked against both opaque background endpoints; portrait text now has a solid backing. A palette hint contains only an arrow symbol; its command has an ordinary text name. Native closed/hidden dialog ID references can also require manual verification depending on axe version; the referenced elements exist and the open dialog paths are exercised.

### Reproduce

Build and run the portfolio locally, then run:

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 4188
```

In another terminal, with Playwright and its Chromium browser available:

```sh
node scripts/audit-accessibility.cjs
node --test tests/accessibility-tokens.test.mjs tests/motion.test.mjs tests/command-palette.test.mjs tests/toast-playground.test.mjs
```

The browser script defaults to the repository’s existing `axe-core` installation (4.7.0). This audit used axe-core 4.11.4 from the adjacent VibeJournal workspace via `AXE_SCRIPT`. It accepts `AXE_SCRIPT` (path to axe.min.js), `PLAYWRIGHT_MODULE` (an installed Playwright module path), `CHROME_PATH` (an optional Chrome executable), `AUDIT_URL`, and `AUDIT_REPORT`. No runtime dependency was added. This audit used the Playwright installation in the adjacent VibeJournal workspace and the installed Chrome executable. By default the detailed report is written to `/tmp/portfolio-accessibility-report.json`.

## Remaining manual release checks

1. VoiceOver with Safari and NVDA with Firefox/Chrome: confirm reading order, live-region announcements, native modal naming, and focus return. Browser keyboard automation does not validate spoken output.
2. Actual 200% text enlargement and 400% browser zoom, including long disclosures and labels; verify focus is not obscured at intermediate widths and when the virtual keyboard is open.
3. Physical iOS/Android touch and screen-reader navigation, especially modal scrolling and clipboard permissions.
4. Review any future screenshot, theme-token, route or visualization change with the same checks. New diagrams must ship semantic explanations; new loading surfaces must provide region-level loading status while keeping decorative skeletons hidden.

## Standards informing decisions

- [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus containment, inert background, meaningful labels and focus return.
- [WCAG 2.2 target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 24px minimum or applicable spacing/equivalent-target exceptions; 44px remains the portfolio’s default control size.
