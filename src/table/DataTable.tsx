import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ColumnDef, Row } from './types'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { Toolbar } from './Toolbar'
import { useTableState } from './useTableState'
import { useColumnVisibility } from './useColumnVisibility'

export interface DataTableProps {
  columns: ColumnDef[]
  data: Row[]
  /** Called with the full merged row set whenever the user saves. Save is
   * local-only: the table keeps working from its own state. */
  onSave?: (rows: Row[]) => void
}

/**
 * Generic, reusable, virtualized, editable data table. Driven entirely by the
 * `columns` schema and `data` props — it references no specific column id or
 * type; all type-specific behavior lives in the cell registry.
 *
 * Note: `data` seeds the internal editable state. To load a different dataset,
 * remount with a `key` (e.g. `<DataTable key={datasetId} …/>`).
 */
export function DataTable({ columns, data, onSave }: DataTableProps) {
  // Callback ref + state (not useRef): the scroll element renders here but the
  // virtualizer lives in TableBody, whose mount effects run before an ancestor
  // ref would be attached. Storing the element in state re-renders TableBody
  // once it exists, so the virtualizer can subscribe to scroll events.
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)

  const orderedColumns = useMemo(
    () => [...columns].sort((a, b) => a.ordinalNo - b.ordinalNo),
    [columns],
  )
  const { visibleColumns, hiddenIds, toggleColumn } =
    useColumnVisibility(orderedColumns)
  const { rows, drafts, setCellDraft, save, reset, dirtyCount } = useTableState(
    data,
    onSave,
  )

  // One shared column template keeps header and body cells aligned. Fixed widths
  // use pixels; width-less columns flex with a sensible minimum.
  const gridTemplateColumns = useMemo(
    () =>
      visibleColumns
        .map((column) =>
          column.width ? `${column.width}px` : 'minmax(120px, 1fr)',
        )
        .join(' '),
    [visibleColumns],
  )

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
      <Toolbar
        columns={orderedColumns}
        hiddenIds={hiddenIds}
        onToggleColumn={toggleColumn}
        dirtyCount={dirtyCount}
        onSave={save}
        onReset={reset}
      />

      <div
        ref={setScrollEl}
        className="min-h-0 flex-1 overflow-auto"
        style={{ '--grid-cols': gridTemplateColumns } as CSSProperties}
      >
        {visibleColumns.length === 0 || rows.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-slate-400">
            {rows.length === 0
              ? 'No data to display.'
              : 'All columns are hidden , use the Columns menu to show some.'}
          </div>
        ) : (
          /* w-max min-w-full: grow to fit fixed columns (horizontal scroll) but
             never narrower than the viewport. */
          <div role="table" className="w-max min-w-full">
            <TableHeader columns={visibleColumns} />
            <TableBody
              columns={visibleColumns}
              rows={rows}
              drafts={drafts}
              onCommit={setCellDraft}
              scrollEl={scrollEl}
            />
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
        {rows.length.toLocaleString()} rows · {visibleColumns.length} of{' '}
        {orderedColumns.length} columns visible
        {dirtyCount > 0 && ` · ${dirtyCount} unsaved`}
      </div>
    </div>
  )
}
