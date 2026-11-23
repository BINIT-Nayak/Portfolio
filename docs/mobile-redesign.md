# Mobile portfolio layouts

The mobile experience uses different information layouts, not a scaled desktop composition. Existing content and text alternatives remain available.

- **Hero:** a primary full-width work action, secondary actions in a row, tighter identity/description spacing, and a horizontally scrollable layer inspector. Layer buttons support tapping and keyboard focus; the complete text explanation remains available. At tablet widths the visualization fills the available row.
- **Navigation:** a bottom drawer with a two-column destination grid, safe-area padding, and native modal behavior. Search uses a magnifier rather than a desktop keyboard-shortcut badge. The palette sits near the top, keeps its input visible, and scrolls results within the available viewport.
- **Projects:** larger usable screenshot area with less nested framing; concrete capabilities become value/description rows; action links form a touch-friendly grid. Project-specific visual treatments remain. Pointer perspective is restricted to enabled fine-pointer desktop environments.
- **Experience:** a horizontally scrollable role picker replaces the tall navigation rail. All role articles remain in reading order below it, with an accent border marking the active role; additional contributions remain native disclosures.
- **Diagrams:** Sneaky uses stacked core nodes and paired supporting systems below 960px, including at 768px. Request steps become numbered rows on phones. Plinko uses a stacked pipeline; nested padding is reduced in full-screen phone case studies. All explanatory text and playback controls remain available.
- **Case-study explorer:** a labelled native discipline select replaces the multi-row filter-button cluster below 768px. Both controls share the same state and results announcements. Tablet layouts retain two cards per row. Phone case-study dialogs use the viewport rather than a narrow box inside another box.
- **Typography and spacing:** phone-specific section, card, header and heading tokens; body text stays readable. No global overflow clipping is used to conceal layout problems.
- **Code:** long code is contained by its own horizontal scroller. Article code regions and the toast example are keyboard focusable. Code scrolling does not widen the document.
- **Touch effects:** ambient spotlight, pointer-relative highlights and screenshot perspective remain disabled on touch-capable devices, including wide hybrid devices. Ordinary button/tap feedback remains.

## Verification

`scripts/audit-mobile.cjs` exercises 320, 375, 390, 430 and 768 CSS-pixel widths with touch input enabled. It checks all seven routes, diagram selection, drawer navigation, phone filtering, Toast/Plinko dialogs, code examples, and the palette in a 420px-tall viewport. It also checks a 1280px touch-capable hybrid for pointer-effect suppression. Screenshots are saved under `/tmp/portfolio-mobile` by default.

Validation passed at all five widths across seven routes, with no accidental horizontal page overflow detected. Production build, lint/style checks, and the 19-scan accessibility regression suite also passed (zero reported violations; scanner manual-review items remain documented in the accessibility audit).

Run against a production server with `PLAYWRIGHT_MODULE` and optional `CHROME_PATH` configured as described in `accessibility-audit.md`:

```sh
node scripts/audit-mobile.cjs
```

The script accepts `AUDIT_URL` and `MOBILE_SCREENSHOTS`. The accessibility regression suite remains available in `scripts/audit-accessibility.cjs`.

Browser emulation covers the requested widths and a shortened search viewport. It does not replace testing actual iOS/Android keyboards, browser chrome, and safe-area hardware.
