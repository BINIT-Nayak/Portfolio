# Portfolio visual system

The visual direction is a quiet engineering workspace: graphite surfaces, a precise type hierarchy, muted blue accents, and borders that explain grouping. Existing editorial content and section order are preserved.

## Source of truth

- `styles/tokens.css`: semantic colors, typography, spacing, radii, shadows, motion, layering and sizing.
- `styles/primitives.module.css`: shared section, heading, surface, label, action, primary action and tag styles. CSS Modules compose these styles rather than copying declarations.
- Component CSS Modules: layout and component-specific states.
- `components/ui/Skeleton`: reusable line, title, media and avatar placeholders.

Use semantic tokens instead of literal palette values in components. Layout ratios, breakpoints and geometry can remain local. The grid and portrait scrim are the only intentional background gradients: one provides structure and the other text contrast.

## Typography and spacing

Use the platform sans-serif stack for readable content with no font download. Monospace is limited to labels, dates, technical tags, metrics and code. Display and section typography scale fluidly; prose uses a 1.7 line height. Weights are 400, 500, 600 and 700.

The spacing scale is based on 4px, from `--space-1` through `--space-24`. Fluid page gutters, card padding and section spacing derive from shared tokens. Radii are 6px for controls/tags, 10px for smaller panels and 14px for cards. Round radii are reserved for circular elements.

## Surfaces and accents

The hierarchy is background → surface → raised/hover surface. Use borders and subtle shadows for depth. Blue identifies primary actions and selected technical emphasis. Ordinary section titles and body text remain neutral. No blur, decorative 3D, spotlight effects or looping card borders are rendered on the homepage.

Dark mode is the default. The navigation theme switcher uses a full light semantic palette and persists the preference through next-themes. Portrait text keeps an explicit on-image color; social icons adapt for light surfaces.

## Interaction and motion

Links navigate; buttons act. Experience cards are static articles. Navigation uses a floating desktop bar and a native modal drawer below 1120px, with 64px mobile links. All controls have a minimum 44px design height and inherit a visible 2px focus ring with 4px offset.

Hover changes surface/border colors. Pressed controls use a deeper surface. Disabled actions have explicit muted styling and preserve their labels. Static cards do not lift or imply clickability. Motion durations are 120ms for controls, 180ms for standard state changes, and 260ms for longer transitions. Modal entry is a small displacement and fade. Reduced-motion preferences remove travel/looping and smooth scrolling globally.

## Skeletons

Use skeletons only for genuinely pending content, never as artificial loading delays for static pages. The decorative Skeleton primitive has four variants and is hidden from assistive technology. Give the containing loading region `aria-busy="true"` plus a concise accessible status, reserve final geometry, and clear the busy state when content arrives. Reduced motion uses a static placeholder. No skeleton is mounted on the static homepage because its content is already available.

## Responsive rules

The homepage container is capped at 76rem. Project cards switch from image/text splits to stacked content below 1024px; study cards use three, two and one columns; prose remains readable without fixed-height clipping. Long modal content scrolls with a sticky close control and dynamic viewport height. Article code blocks scroll locally.

## Scope

The navigation follow-up groups the two existing npm package case studies under Open Source without changing their text. It does not replace case-study routing, implement a new demonstration, or publish the website. Legacy unmounted globe/animation components remain available in source, but are no longer rendered by the redesigned homepage.

## Navigation behavior

The shared header appears on the homepage and article pages. Section tracking follows document position, including the short contact section at the page bottom; the progress indicator uses a transform updated through a passive, animation-frame-throttled scroll listener. The scrolled background crossfades through opacity.

The native modal drawer and command palette provide background inertness and focus containment. Opening stores focus, locks the body at its current scroll position, and focuses the close button or search input. Escape/backdrop/close restore scrolling and focus. Selecting a section restores scrolling before navigation and focuses the destination. Resizing to desktop closes an open mobile drawer.

⌘K or Ctrl+K toggles the palette. Search matches sections and a theme command; Up/Down wrap results and Enter selects. Reduced motion disables entrance motion, crossfades, and smooth section scrolling. Native dialog support is required for overlays.

Run `node --test tests/navigation.test.mjs` for active-section, scroll-boundary, and command-selection checks. Manual browser checks still needed: Tab/Shift+Tab containment, Escape and backdrop dismissal, iOS scroll restoration, reduced motion, persisted themes, and viewport changes while a drawer is open.
