import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import type { CellValue, ColumnDef, Row } from './types'
import type { Drafts } from './useTableState'
import { TableRow } from './TableRow'
import { ROW_HEIGHT } from './constants'

export interface TableBodyProps {
  columns: ColumnDef[]
  rows: Row[]
  drafts: Drafts
  editingCell: { rowId: string; columnId: string } | null
  onStartEdit: (rowId: string, columnId: string) => void
  onCommit: (rowId: string, columnId: string, value: CellValue) => void
  onCancelEdit: () => void
  scrollRef: RefObject<HTMLDivElement | null>
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
  editingCell,
  onStartEdit,
  onCommit,
  onCancelEdit,
  scrollRef,
}: TableBodyProps) {
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    // Assumed viewport until the real scroll element is measured — gives a
    // sensible first paint and makes the table renderable server-side.
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
            editingColumnId={
              editingCell?.rowId === row.id ? editingCell.columnId : null
            }
            onStartEdit={onStartEdit}
            onCommit={onCommit}
            onCancelEdit={onCancelEdit}
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
