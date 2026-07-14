# Cemento Data Table

A **generic, reusable, virtualized, editable** data table built in React + TypeScript for
the Cemento client-side assignment. Renders any `columns` + `data` schema, supports
in-place cell editing with local save, column show/hide, and stays fast on 10,000 rows
via row virtualization.

**Live demo:** https://ronhachmon.github.io/Cemento/

## Run locally

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
npm run lint       # oxlint
npm run format     # prettier --write
```

## Tech stack

- **Vite** + **React 19** + **TypeScript**, **Tailwind CSS v4**
- **@tanstack/react-virtual** (headless virtualization primitive)
- **@faker-js/faker** (seeded, deterministic demo data: 10,000 rows)
- **oxlint** + **Prettier**; deployed to **GitHub Pages** via GitHub Actions

