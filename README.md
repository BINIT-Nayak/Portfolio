# Binit Nayak Portfolio

An interactive engineering portfolio built with Next.js 15, React 18 and TypeScript. It presents production experience, project architecture, accessible educational demos and open-source work.

- [Live portfolio](https://binit-nayak.netlify.app/)
- [Repository](https://github.com/BINIT-Nayak/my-portfolio-website)
- [Architecture and engineering decisions](docs/portfolio-architecture.md)
- [Production-readiness results](docs/production-readiness.md)

## Development

Use Node 24 LTS and npm.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run typecheck
npm run check
npm test
npm run build
npm start
```

`check` runs ESLint, Stylelint and Prettier. Browser audit setup is documented in the architecture guide.

## Features

- Responsive navigation, theme switching and a keyboard command palette
- Engineering snapshot, interactive career timeline and project showcases
- Filterable case studies with shareable article routes
- Sneaky architecture, Plinko event pipeline and isolated Pub/Sub toast demos
- Comet Canvas engineering lab and a user-controlled seven-stop portfolio tour
- Accessible text explanations, reduced-motion support and mobile-specific layouts
- Contact actions with copy-email feedback
- Per-route metadata, structured data, sitemap and social previews

Design tokens live in `styles/tokens.css`; CSS Modules own component styling. Motion uses CSS, SVG and Web Animations API. Sentry is optional and environment-configured. No resume download or backend contact form is configured.
