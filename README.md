# Cemento Data Table

A **generic, reusable, virtualized, editable** data table built in React + TypeScript for
the Cemento client-side assignment.

**Live demo:** https://ronhachmon.github.io/Cemento/

## Features (mapped to the assignment)

| Requirement                                                              | Where                                                                              |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Render different data types per column (string, number, boolean, select) | Cell type registry — [`src/table/cellTypes/`](src/table/cellTypes/)                |
| Filter columns (show/hide)                                               | Toolbar "Columns" menu + [`useColumnVisibility`](src/table/useColumnVisibility.ts) |
| Edit data directly in cells                                              | Click a cell → in-place editor; boolean toggles directly                           |
| Save data locally                                                        | Draft overlay + Save/Reset — [`useTableState`](src/table/useTableState.ts)         |
| Optimized for large data sets                                            | Row virtualization (10,000-row demo dataset)                                       |
| Generic / reusable with other datasets                                   | The engine renders purely from `columns` + `data` props                            |

Extras: unsaved-change indicators (per-cell dot + toolbar badge), input validation with
inline errors, small/large demo dataset toggle, empty states, keyboard support
(Enter to edit/commit, Esc to cancel).

## Flow of action (how genericity works)

The table engine (`src/table/`) never references a specific column id or data type. It
renders purely from the column schema, and all type-specific behavior is looked up from a
**registry keyed by `column.type`**:

```
getDataset()  ──►  { columns, data }
                        │ props
                        ▼
              <DataTable columns data onSave>
                        │  order columns (ordinalNo) · filter hidden columns
                        ▼
        Toolbar ── TableHeader ── TableBody (virtualized: only ~26 of 10,000
                        │          rows exist in the DOM at any time)
                        ▼
                   TableRow (memoized)
                        │
                        ▼
                   TableCell (memoized)  ★ the one generic dispatch point:
                        │                  cellRegistry[column.type]
                        ▼
              { Display, Editor?, validate? }
```

**Edit round-trip:** click cell → registry `Editor` opens → commit (Enter/blur) → value is
validated → written to a **draft overlay** keyed by row id (source data never mutated) →
cell shows the draft + amber dot → **Save** merges drafts into the committed rows and fires
`onSave` (local only, per the assignment) → **Reset** discards drafts. Keying drafts by row
id (not array index) means edits survive virtualization scrolling and column changes.

### Reuse with your own data

```tsx
import { DataTable } from './table'

;<DataTable columns={myColumns} data={myRows} onSave={handleSave} />
```

Any schema works — `src/data/columns.ts` is just the demo. The engine imports nothing from
`src/data/` (enforced direction: data → table via props, never the reverse).

### Add a new column type

1. Add the literal to `ColumnType` in [`src/table/types.ts`](src/table/types.ts).
2. Add one entry to [`cellRegistry`](src/table/cellTypes/registry.ts) with a `Display`
   (and optionally `Editor` + `validate`).

That's it — the registry is a `Record<ColumnType, …>`, so TypeScript **fails the build**
until the new type has an entry. No engine component changes.

## Decisions & rationale

- **TypeScript** (assignment bonus): string-literal `ColumnType` union + exhaustive
  registry make invalid schemas unrepresentable.
- **Hand-rolled table + `@tanstack/react-virtual`**: the assignment forbids table
  _libraries_; TanStack Virtual is a headless _virtualization primitive_ — a hook that
  computes which row indexes are visible and renders nothing itself. Every piece of table
  markup, state, and behavior here is custom.
- **Fixed row height** (`ROW_HEIGHT = 40`): keeps virtualization exact and simple.
- **Draft overlay for edits**: committed rows + `Map<rowId, {colId: value}>` overlay.
  Editing never mutates source data; per-row draft objects keep untouched rows
  referentially stable so `React.memo` on rows/cells actually works — only the edited
  cell re-renders.
- **Schema additions** (allowed per Q&A; additive only, documented in
  [`src/table/types.ts`](src/table/types.ts)):
  - `options?: string[]` — a select column carries its own choices, keeping the table
    generic (no external option source).
  - `editable?: boolean` — generic way to mark read-only columns (defaults to editable).
  - Row values narrowed from `any` to `string | number | boolean | null` — rows are data,
    not part of the frozen column schema; the union makes cell code type-safe.
- **Sorting deliberately skipped** to keep scope focused (assignment requires only
  render/filter/edit); the memoized view pipeline in `DataTable` is where a
  sort step would slot in.
- **Boolean has no edit mode**: its checkbox display _is_ the editor (one less click).
- **faker bundled at runtime** (~600 kB total): the live demo generates its dataset in the
  browser. Acceptable for a demo; a real app would fetch data and drop faker entirely.
- **Validation kept minimal**: numbers reject non-finite input (inline error, commit
  blocked); select/boolean editors can only produce legal values by construction.

## Tech stack

- **Vite** + **React 19** + **TypeScript**, **Tailwind CSS v4**
- **@tanstack/react-virtual** (headless virtualization primitive)
- **@faker-js/faker** (seeded, deterministic demo data: 10 / 10,000 rows)
- **oxlint** + **Prettier**; deployed to **GitHub Pages** via GitHub Actions

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

## Possible extensions

Sorting (type-aware), per-column value filters, column resize/reorder (the schema's
`width`/`ordinalNo` already support it), undo/redo, Vitest test harness.
