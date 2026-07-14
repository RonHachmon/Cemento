import type { ColumnDef } from './types'
import { ROW_HEIGHT } from './constants'

/** Sticky header row. Renders each column's title in ordinal order. */
export function TableHeader({ columns }: { columns: ColumnDef[] }) {
  return (
    <div role="rowgroup" className="sticky top-0 z-10">
      <div
        role="row"
        className="grid border-b border-slate-200 bg-slate-50 font-medium text-slate-600"
        style={{ gridTemplateColumns: 'var(--grid-cols)', height: ROW_HEIGHT }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            role="columnheader"
            className="flex items-center truncate border-r border-slate-100 px-3 last:border-r-0"
          >
            {column.title}
          </div>
        ))}
      </div>
    </div>
  )
}
