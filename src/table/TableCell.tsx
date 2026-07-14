import { memo, useCallback, useState } from 'react'
import type { CellValue, ColumnDef, Row } from './types'
import { cellRegistry } from './cellTypes/registry'

export interface TableCellProps {
  row: Row
  column: ColumnDef
  /** Unsaved value for this cell, if any (overlays the committed value). */
  draftValue: CellValue | undefined
  onCommit: (rowId: string, columnId: string, value: CellValue) => void
}

/**
 * The one generic dispatch point: looks up the column's type in the registry
 * and delegates display/editing. Knows nothing about specific columns or types.
 * Owns its own edit mode — no other component needs to know a cell is editing.
 * Memoized — with stable callbacks from DataTable, only cells whose value or
 * edit state changes re-render.
 */
function TableCellComponent({ row, column, draftValue, onCommit }: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false)

  const config = cellRegistry[column.type]
  const editable = column.editable !== false
  const isDirty = draftValue !== undefined
  const value = isDirty ? draftValue : row[column.id]

  const commitValue = useCallback(
    (next: CellValue) => {
      onCommit(row.id, column.id, next)
      setIsEditing(false)
    },
    [onCommit, row.id, column.id],
  )
  const cancelEdit = useCallback(() => setIsEditing(false), [])

  const canOpenEditor = editable && config.hasEditMode !== false
  // Handlers only attach outside edit mode: Enter inside the editor input
  // bubbles to this wrapper and would instantly re-open the editor.
  const opensOnInteraction = canOpenEditor && !isEditing

  return (
    <div
      role="cell"
      tabIndex={opensOnInteraction ? 0 : undefined}
      onClick={opensOnInteraction ? () => setIsEditing(true) : undefined}
      onKeyDown={
        opensOnInteraction
          ? (e) => {
              if (e.key === 'Enter') setIsEditing(true)
            }
          : undefined
      }
      className={`relative flex items-center border-r border-slate-100 last:border-r-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400 ${
        isEditing
          ? 'px-1.5'
          : `truncate px-3 ${canOpenEditor ? 'cursor-text' : ''} ${
              isDirty ? 'bg-amber-50' : ''
            }`
      }`}
    >
      <config.Cell
        value={value}
        column={column}
        isEditing={isEditing}
        onCommit={editable ? commitValue : undefined}
        onCancel={cancelEdit}
      />
      {isDirty && !isEditing && (
        <span
          aria-label="unsaved change"
          className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-400"
        />
      )}
    </div>
  )
}

export const TableCell = memo(TableCellComponent)
