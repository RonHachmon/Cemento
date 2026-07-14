# Cemento Data Table

A generic, reusable, virtualization-optimized editable data table built in React +
TypeScript for the Cemento client-side assignment.

**Live demo:** https://ronhachmon.github.io/Cemento/



## Tech stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **oxlint** + **Prettier** for linting/formatting
- Deployed to **GitHub Pages** via GitHub Actions

## Getting started

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
npm run lint       # oxlint
npm run format     # prettier --write
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and
publishes `dist/` to GitHub Pages. The Vite `base` is set to `/Cemento/` to match the
repository name so assets resolve on the Pages subpath.
