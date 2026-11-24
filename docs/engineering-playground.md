# Engineering Playground

The home page includes `EngineeringPlayground` below the case studies. `/playground` offers the same experiments on a dedicated, metadata-equipped route. The command palette links to the home section. No dependencies were added.

## Experiments

| Experiment              | Real behavior                                                                                                                                                                  | Deliberate boundary                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web Worker              | The same bounded prime-counting function runs on the main thread or in a bundled dedicated worker. Durations come from `performance.now()` inside the computation.             | Results describe this device/run, not a benchmark. Worker startup is excluded. Main-thread execution deliberately blocks briefly; worker execution can be terminated. |
| Event Driven UI         | A local synchronous Pub/Sub bus delivers to independently subscribed consumers. Unsubscribing stops delivery without clearing consumer state.                                  | No network, durability or event replay. Counts describe actual demo events.                                                                                           |
| Redis Cache-Aside       | A Map models cache entries. Manual steps reveal lookup, MISS, database fixture read, cache population and response. A later request is a HIT; eviction restores the miss path. | Explicitly a browser simulation, not a Redis connection. No fake latency, TTL or production availability claims.                                                      |
| Animation Scheduler     | Three Web Animations effects and a progress line share a start time and 2.4-second timeline. Pause/resume applies to all effects; reset/unmount cancels them.                  | Timing is a chosen presentation schedule, not measured system latency. Reduced motion presents static outcomes and text inspection.                                   |
| Recommendation Pipeline | A fixed catalog passes through availability filtering, explicit scoring, a two-per-category diversity cap, optional reranking and a four-item feed.                            | Scores are synthetic fixture inputs. The optional stage is explicitly a fixed-context-score stand-in for ML, not a trained model or inference service.                |

## Implementation

`components/playground/EngineeringPlayground.tsx` owns selection only. Each experiment lives in its own dynamically imported component and unmounts when another is selected. The real worker is emitted from `compute.worker.ts`; it imports the same `countPrimes` function used by the main-thread run. Each job is an explicitly labelled eight-pass batch, bounded at two million integers per pass. This gives users time to try input while the worker runs without inserting fake execution delays. The main-thread option is intentionally blocking and may take several seconds on slower devices.

`lib/playground.mjs` contains deterministic computation, event delivery, cache-path planning and ranking logic. These are covered by Node tests. The cache only populates when the user reaches the write step, not when the request is initially planned. Ranking has a stable product-ID tie-breaker, and reranking preserves the diversity-filtered membership.

React state tracks controls and coarse outcomes. The worker's JavaScript heartbeat writes only a transform from requestAnimationFrame, reading track geometry once per run; it does not update React per frame. Scheduler playback uses WAAPI rather than rendering a React progress counter. All animation handles, subscriptions, pending main-thread start timers and workers are released on unmount.

## Accessibility and design

Shared semantic tokens and primitive button/surface styles keep the experiments consistent with the portfolio. Selection uses ordinary buttons with `aria-pressed` and `aria-controls`, not an incomplete custom tab pattern. Each demo has a named region, heading, labelled native controls, textual explanation and a polite status message. Paths are ordered lists with `aria-current="step"`; purely visual dots and animation actors are decorative.

Nothing starts automatically. Main-thread work requires an explicit, clearly described action. Reduced motion disables the heartbeat and substitutes static scheduler results. Narrow layouts wrap controls and flow steps; no horizontal page scrolling is required. Related case-study links connect each concept to existing engineering work.

## Verification

- TypeScript, ESLint, Stylelint, formatting and production build checks.
- 30 Node tests, including prime-count correctness/bounds, unsubscribe semantics, cache HIT/MISS behavior, and ranking/diversity invariants.
- `scripts/audit-playground.cjs` exercises the built worker and matching main-thread result, subscriber isolation, cache population/hits/eviction, actual scheduler pause/resume, recommendation changes, keyboard access and command-palette navigation.
- The browser audit checks all five experiments at 320, 375, 390, 430, 768 and 1440px, with axe scans at mobile and desktop sizes, plus reduced-motion behavior.
- The sitemap/SEO audit covers the new route alongside existing pages.

Run the browser audit against a production server with `AUDIT_URL`, `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `AXE_SCRIPT` pointing to the local audit tools. Actual performance depends on the browser/device; the UI does not claim a guaranteed frame rate or speedup.
