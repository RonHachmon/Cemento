import { memo } from 'react'
import type { CSSProperties } from 'react'
import type { CellValue, ColumnDef, Row } from './types'
import { TableCell } from './TableCell'
import { ROW_HEIGHT } from './constants'

export interface TableRowProps {
  row: Row
  columns: ColumnDef[]
  /** This row's unsaved edits (columnId → value), if any. */
  draft: Record<string, CellValue> | undefined
  onCommit: (rowId: string, columnId: string, value: CellValue) => void
  /** Absolute-position style supplied by the virtualizer. */
  style?: CSSProperties
}

function TableRowComponent({ row, columns, draft, onCommit, style }: TableRowProps) {
  return (
    <div
      role="row"
      // focus-within:z-10 — the virtualizer's transform makes each row its own
      // stacking context, so a z-index inside a cell cannot beat sibling rows.
      // While an editor holds focus, lift the row above its neighbors so the
      // editor's error bubble (which spills below the row) stays visible.
      className="grid border-b border-slate-100 bg-white hover:bg-slate-50 focus-within:z-10"
      style={{
        gridTemplateColumns: 'var(--grid-cols)',
        height: ROW_HEIGHT,
        ...style,
      }}
    >
      {columns.map((column) => (
        <TableCell
          key={column.id}
          row={row}
          column={column}
          draftValue={draft?.[column.id]}
          onCommit={onCommit}
        />
      ))}
    </div>
  )
}

export const TableRow = memo(TableRowComponent)
