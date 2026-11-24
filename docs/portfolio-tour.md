# Quick portfolio tour

The hero’s **Take the quick tour** button starts a seven-stop introduction. “~90 seconds” is a reading estimate, not a countdown. There is no autoplay, scheduled scrolling, automatic demo playback, or third-party tour dependency.

| Stop                           | Destination                                         |
| ------------------------------ | --------------------------------------------------- |
| Who I am                       | Home hero copy                                      |
| Production experience          | Home career timeline                                |
| Plinko real-time architecture  | `/case-studies/plinko-ui`, interactive pipeline     |
| Toast shared architecture      | `/case-studies/toast-messages`, isolated playground |
| Sneaky full-stack architecture | `/projects`, recommendation architecture            |
| Open-source work               | Home Open Source section                            |
| Contact                        | Home contact section                                |

`data/portfolio-tour.ts` contains typed stop descriptions, routes and target names. `PortfolioTourProvider` lives in the root layout so Previous/Next can retain the current stop across ordinary Next.js route transitions. Targets use `data-tour-target`; only the current target receives `data-tour-highlight`.

## Interaction and accessibility

- Starting, Previous and Next explicitly request navigation and a scroll to the target. No idle interaction advances the tour. Reduced motion uses immediate scrolling.
- The panel is a labelled non-modal aside. It does not dim or disable the page, lock scrolling, or trap keyboard focus.
- The current tour heading receives focus without another scroll. **Explore highlighted section** moves keyboard focus into the target; **Back to tour controls** returns it to the panel. The return button is portalled into the current section only while the tour is active.
- Exit and Escape work at every stop, including a loading/unavailable stop. Finish behaves like Exit. Focus returns to the current section when available.
- Following an ordinary same-tab link, using browser history, or opening a native modal ends the tour. New-tab links leave it available in the current tab. The tour never competes with the command palette or reading dialogs.
- A bounded target-discovery observer handles route commits; its timeout only reports an unavailable section. It never advances the tour. Listeners, highlight attributes, observers, temporary focusability and layout reservations are cleaned up.
- The panel height is reserved at the end of the document and in scroll padding. Its text can scroll independently on short screens while Exit, Previous and Next remain available. Highlight styling supports forced colors.
- No progress is stored, no tour analytics are sent, and a page reload does not restart the tour.

## Verification

Run a production server, then `node scripts/audit-tour.cjs` with `PLAYWRIGHT_MODULE`, optional `CHROME_PATH`, optional `AXE_SCRIPT`, and `AUDIT_URL` configured as in the accessibility audit.

The browser regression covers desktop (1440px) and phone (320px): all seven stops, cross-route Previous/Next, stationary idle scrolling, one highlight at a time, keyboard explore/return, completion, Escape, modal handoff, ordinary-link exit, browser Back, page overflow and axe checks. Screenshots of the active tour are written to `/tmp/portfolio-tour-1440.png` and `/tmp/portfolio-tour-320.png`.

Validation passed on desktop and phone, including ordinary-link and browser-Back exit behavior, zero reported axe violations in the tested tour state, and no page overflow. Production build, type checking, lint, formatting and changed CSS checks passed.
