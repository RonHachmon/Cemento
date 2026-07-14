import type { ReactNode } from 'react'
import type { CellValue, ColumnDef } from '../types'

/** Props passed to every cell component. */
export interface CellProps {
  value: CellValue
  column: ColumnDef
  /** True while the cell is in edit mode. Never true when `hasEditMode` is false. */
  isEditing: boolean
  /**
   * Commit a new value and leave edit mode. Absent when the cell is read-only —
   * types that edit directly from their display (boolean's checkbox) use its
   * absence to disable themselves.
   */
  onCommit?: (value: CellValue) => void
  /** Leave edit mode without committing. */
  onCancel: () => void
}

/**
 * Per-type behavior looked up by column type. The table engine only ever does
 * `cellRegistry[column.type]` — all type-specific rendering, editing and
 * validation live behind this interface, so adding a column type is one new
 * registry entry and zero engine changes.
 */
export interface CellTypeConfig {
  /** Single component for the type; branches on `isEditing` when it has an edit mode. */
  Cell: (props: CellProps) => ReactNode
  /**
   * false for types that edit directly from their display (boolean's checkbox
   * toggles without an edit mode). Default true.
   */
  hasEditMode?: boolean
  /** Validate a candidate value; return an error message or null when valid. */
  validate?: (value: CellValue, column: ColumnDef) => string | null
}
