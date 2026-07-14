---
name: verify
description: Build, launch, and drive the Cemento data table app to verify changes end-to-end in a real browser.
---

# Verifying the Cemento data table

## Build / lint

```powershell
npm run build   # tsc -b && vite build
npm run lint    # oxlint
```

## Launch

```powershell
npm run dev     # Vite; serves at http://localhost:5173/Cemento/ (note the /Cemento/ base path!)
```

Gotchas:
- The URL includes the `/Cemento/` base path — `http://localhost:5173/` 404s.
- If 5173 is busy (user often has their own dev server running), Vite picks 5174+ — read the port from the dev-server output, and remember the user's server on 5173 serves *stale* code.

## Drive (headless browser)

Playwright is not a project dep. Chromium is already cached in `~\AppData\Local\ms-playwright`. Install the `playwright` package into the scratchpad dir (`npm init -y; npm i playwright`) and run a `.cjs` script from there.

DOM handles (the table uses ARIA roles on divs, no `<table>`):
- Wait for `[role="table"]`.
- Header rowgroup is `[role="rowgroup"]` nth(0), body is nth(1); body rows are `[role="row"]`, cells `[role="cell"]`.
- Column order (demo data): 0 Full Name (string), 1 Email (string + pattern validator), 2 Age (number, range 1–120), 3 Salary (number), 4 Active (boolean checkbox), 5 Role (select), 6 Department (select).
- Editors: click a cell → `input[type="text"]` (string/number) or `select`; boolean toggles directly via its checkbox.
- Error bubble: `span.bg-red-600`. Dirty dot: `[aria-label="unsaved change"]`.
- Scroll container for virtualization: `.overflow-auto`.

Flows worth driving: edit string/number/select, toggle boolean → dirty dot + "N unsaved change(s)" badge; invalid email / out-of-range age → error bubble, commit blocked, Esc cancels; edit back to the committed value → dirty clears; Save merges + clears badge; Reset discards; hide a column via the Columns menu; scroll to bottom (only ~24 rows in DOM).

Script gotcha: `page.fill('input[type="text"]')` targets the *first* matching input — make sure no earlier editor is still open (an editor blurred with a validation error stays open; Esc only works while it has focus).
