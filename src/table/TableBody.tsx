import { useVirtualizer } from '@tanstack/react-virtual'
import type { CellValue, ColumnDef, Row } from './types'
import type { Drafts } from './useTableState'
import { TableRow } from './TableRow'
import { ROW_HEIGHT } from './constants'

export interface TableBodyProps {
  columns: ColumnDef[]
  rows: Row[]
  drafts: Drafts
  onCommit: (rowId: string, columnId: string, value: CellValue) => void
  /** The scroll container element, null until mounted. Passed as an element
   * (not a ref) so its arrival re-renders this component and the virtualizer
   * picks it up — a ref set after mount would go unnoticed. */
  scrollEl: HTMLDivElement | null
}

/**
 * Virtualized body: only the rows in (and near) the viewport exist in the DOM,
 * so DOM size stays constant regardless of row count. Rows are absolutely
 * positioned inside a spacer sized to the full list, keeping the scrollbar
 * honest. TableRow/TableCell are untouched by virtualization.
 */
export function TableBody({
  columns,
  rows,
  drafts,
  onCommit,
  scrollEl,
}: TableBodyProps) {
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollEl,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    // Assumed viewport until the real scroll element is measured — without it
    // the virtualizer starts from a 0×0 rect and renders no rows on first paint.
    initialRect: { width: 800, height: 600 },
  })

  return (
    <div
      role="rowgroup"
      className="relative"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        return (
          <TableRow
            key={row.id}
            row={row}
            columns={columns}
            draft={drafts.get(row.id)}
            onCommit={onCommit}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        )
      })}
    </div>
  )
}
