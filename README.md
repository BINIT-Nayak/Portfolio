# Binit Nayak Portfolio

A responsive personal portfolio built with Next.js, TypeScript, Tailwind CSS, CSS Modules, Framer Motion, and Three.js. The site showcases projects, work experience, testimonials, tech stack, social links, resume download, and contact actions.

## Live Links

- Live site: [https://binit-nayak.netlify.app/](https://binit-nayak.netlify.app/)
- Repository: [https://github.com/BINIT-Nayak/my-portfolio-website](https://github.com/BINIT-Nayak/my-portfolio-website)

## Features

- Sticky responsive navigation with smooth section scrolling
- Hero section with scroll-to-about CTA
- Bento-style about and tech stack section
- Interactive globe and animated visual effects
- Responsive project cards with repository links
- Work experience cards
- Infinite testimonial carousel
- Contact section with email and social links
- Resume download
- SEO metadata with Open Graph and Twitter card support

## Design System

Current palette:

- Background: `#0F172A`
- Primary text: `#F4F4F4`
- Layout elements: `#64748B`
- Accent / CTA: `#22D3EE`

Shared palette variables live in [app/globals.css](app/globals.css).

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- CSS Modules
- Framer Motion
- Three.js / React Three Fiber
- Sentry integration, enabled only when Sentry env vars are present

## Project Structure

```text
app/                  App Router pages, layout, providers, global styles
components/           UI sections and shared interactive components
data/                 Navigation, projects, testimonials, and experience data
public/assests/       Images, SVGs, resume, and static media
lib/                  Shared utility helpers
```
