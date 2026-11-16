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

Dark mode is the supported primary theme. The provider is explicitly dark to avoid partially light UI; light mode is deferred until a complete semantic palette and contrast review are implemented.

## Interaction and motion

Links navigate; buttons act. Experience cards are static articles. Navigation wraps into a three-column mobile layout without shrinking text or targets. All controls have a minimum 44px design height and inherit a visible 2px focus ring with 4px offset.

Hover changes surface/border colors. Pressed controls use a deeper surface. Disabled actions have explicit muted styling and preserve their labels. Static cards do not lift or imply clickability. Motion durations are 120ms for controls, 180ms for standard state changes, and 260ms for longer transitions. Modal entry is a small displacement and fade. Reduced-motion preferences remove travel/looping and smooth scrolling globally.

## Skeletons

Use skeletons only for genuinely pending content, never as artificial loading delays for static pages. The decorative Skeleton primitive has four variants and is hidden from assistive technology. Give the containing loading region `aria-busy="true"` plus a concise accessible status, reserve final geometry, and clear the busy state when content arrives. Reduced motion uses a static placeholder. No skeleton is mounted on the static homepage because its content is already available.

## Responsive rules

The homepage container is capped at 76rem. Project cards switch from image/text splits to stacked content below 1024px; study cards use three, two and one columns; prose remains readable without fixed-height clipping. Long modal content scrolls with a sticky close control and dynamic viewport height. Article code blocks scroll locally.

## Scope

This pass does not reorganize content, replace the case-study routing model, implement a new demonstration, or publish the website. Legacy unmounted globe/animation components remain available in source, but are no longer rendered by the redesigned homepage.
