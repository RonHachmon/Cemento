import type { ReactNode } from 'react'
import type { CellValue, ColumnDef } from '../types'

/** Props passed to every cell Display component. */
export interface CellDisplayProps {
  value: CellValue
  column: ColumnDef
  /**
   * Present only when the cell is editable. Lets a Display commit a new value
   * directly without entering edit mode — used by types whose display *is* the
   * editor (e.g. boolean's checkbox). Most Displays ignore it.
   */
  onCommitValue?: (value: CellValue) => void
}

/** Props passed to every cell Editor component. */
export interface CellEditorProps {
  value: CellValue
  column: ColumnDef
  /** Commit the new value and leave edit mode. */
  onCommit: (value: CellValue) => void
  /** Discard the edit and leave edit mode. */
  onCancel: () => void
}

/**
 * Per-type behavior looked up by column type. The table engine only ever does
 * `cellRegistry[column.type]` — all type-specific rendering, editing and
 * validation live behind this interface, so adding a column type is one new
 * registry entry and zero engine changes.
 */
export interface CellTypeConfig {
  Display: (props: CellDisplayProps) => ReactNode
  /**
   * In-place editor opened on cell click. Omitted for types that edit directly
   * from their Display (boolean's checkbox toggles without an edit mode).
   */
  Editor?: (props: CellEditorProps) => ReactNode
  /** Validate a candidate value; return an error message or null when valid. */
  validate?: (value: CellValue, column: ColumnDef) => string | null
}
