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
  /** Column id currently being edited in this row, or null. */
  editingColumnId: string | null
  onStartEdit: (rowId: string, columnId: string) => void
  onCommit: (rowId: string, columnId: string, value: CellValue) => void
  onCancelEdit: () => void
  /** Absolute-position style supplied by the virtualizer. */
  style?: CSSProperties
}

function TableRowComponent({
  row,
  columns,
  draft,
  editingColumnId,
  onStartEdit,
  onCommit,
  onCancelEdit,
  style,
}: TableRowProps) {
  return (
    <div
      role="row"
      className="grid border-b border-slate-100 bg-white hover:bg-slate-50"
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
          isEditing={editingColumnId === column.id}
          onStartEdit={onStartEdit}
          onCommit={onCommit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  )
}

export const TableRow = memo(TableRowComponent)
