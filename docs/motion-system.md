# Portfolio motion system

Motion communicates entry, selection, and system behavior. Content is visible without JavaScript and without animation. Do not add a reveal to every heading, paragraph, icon, or card.

## Shared API

`styles/tokens.css` owns timing, distance, scale, and easing. `styles/motion.css` owns entry keyframes. `ViewportMotion`, mounted once in the root layout, observes annotated content using one IntersectionObserver per route. It unobserves each target after activation; React does not update on scroll or on animation frames.

| Pattern          | Usage                          | Purpose                                                                                |
| ---------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| `fade-up`        | `data-motion="fade-up"`        | Small 8px entrance for a coherent block                                                |
| `fade-in`        | `data-motion="fade-in"`        | Opacity-only appearance                                                                |
| `scale-in`       | `data-motion-enter="scale-in"` | Dialog opening, 0.98 → 1                                                               |
| `line-draw`      | `data-motion="line-draw"`      | Horizontal decorative line, scaleX rather than width; use an empty aria-hidden element |
| `stagger-list`   | `data-motion="stagger-list"`   | One group reveal, direct children only                                                 |
| `number-reveal`  | `data-motion="number-reveal"`  | Reveal the final factual number; never fabricate intermediate counts                   |
| `section-reveal` | `data-motion="section-reveal"` | A heading group or role body enters once                                               |

Use `data-motion` for viewport activation and `data-motion-enter` for an explicit mount/open interaction. Section reveal and stagger-list are viewport-only. A stagger-list can set `data-motion-child-pattern="number-reveal"`, as the Engineering Snapshot does. Do not nest reveal targets or put a parent reveal around an independently animated child group.

There is no hidden pre-hydration state. Reveals activate at 15% intersection; avoid placing them on very tall page sections. Use a short heading group instead. Initial route content is discovered once; dynamically mounted dialog/toast content uses `data-motion-enter`, not additional mutation or scroll observers.

## Timing and accessibility

- Feedback tokens: 150ms / 180ms / 260ms.
- Entry: 260ms; section: 360ms; standard easing, no springs.
- Stagger: 35ms, capped at five increments. The entire entry ends within 435ms regardless of list length.
- Mobile (767px and below): opacity-only entry, 180ms, no stagger or scale.
- Reduced motion: no entry animations, immediate content, no staged reveal. Changing the preference cancels ongoing CSS and case-filter Web Animations. Targets seen under reduced motion are not replayed when the preference changes back.
- The shared observer marks one-time targets and never hides content. Route changes disconnect old observers. Missing IntersectionObserver degrades to visible, static content.
- `lib/motion.mjs` centralizes the filter layout keyframes and token lookup. Geometry is read in a batch, then retained cards animate from their old position using transforms. New items fade in; mobile uses only opacity. Filtering may repeat because it responds to user intent.

## Audit and migration

| Existing behavior                                                     | Result                                                                                 |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Snapshot had its own observer, inline frames, and timing lookup       | Shared stagger-list / number-reveal; original numbers stay rendered                    |
| Career body replayed whenever a role became active                    | Each body uses a one-time section-reveal                                               |
| Case dialog, palette, and mobile drawer had different entry keyframes | Shared scale-in / fade-up; shared backdrop fade                                        |
| Toast playground had a local entry animation                          | Shared fade-up on each new notification                                                |
| Explorer owned its layout animation implementation                    | Shared token-driven layout helper; opacity-only mobile filtering                       |
| TextGenerateEffect animated every word over multiple seconds          | One readable section-reveal block; no Framer Motion                                    |
| Unused MovingBorders component ran a perpetual geometry-driven loop   | Compatibility button is static and uses shared action styling; decorative slot retired |
| Project screenshot tilt and pointer spotlight                         | Retained restrained desktop-only interaction; existing reduced-motion/touch safeguards |
| Hero system continuously ran on arrival                               | Starts paused; user starts educational event playback                                  |
| Unused GridGlobe                                                      | Remains unmounted; no 3D motion introduced into the live portfolio                     |

## Deliberate exceptions

Navbar page progress and career line progress remain rAF-coalesced scroll calculations: these communicate continuous position, not merely viewport entry. Their geometric reads precede writes. The navbar also calculates section selection in that same pass. No new scroll listener was introduced for reveals.

Plinko/Sneaky request playback and the user-started hero event stream retain their educational timing, pause controls, and reduced-motion handling. Their packet paths represent actual steps in the explanation; forcing a full request into 260ms would make it unreadable. Their local path animations are not decorative entry patterns. Toast expiry is a lifecycle timer, not a visual animation duration.

Skeleton opacity pulse remains an intentional loading-state loop (1600ms), disabled under reduced motion. No width/height/top/left animation or spring behavior was added.

## Validation

Run `node --test tests/motion.test.mjs` for desktop position continuity and opacity-only compact layout behavior. Run the production build and CSS lint for integration. Browser QA should cover first entry, re-entry without replay, rapid filtering, reduced-motion changes during an animation, mobile static layout, and dialog/toast opening; these visual checks have not been automated in this workspace.
