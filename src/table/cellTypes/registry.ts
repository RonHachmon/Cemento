import type { CellValue, ColumnDef, ColumnType } from '../types'
import type { CellTypeConfig } from './types'
import { validateNumber } from './validators'
import {
  BooleanCell,
  NumberCell,
  NumberEditor,
  SelectCell,
  SelectEditor,
  StringCell,
  StringEditor,
} from './cells'

/**
 * The single seam for type-specific cell behavior. Keyed by {@link ColumnType} as a
 * `Record`, so adding a new column type is a compile error until it has an entry
 * here — exhaustiveness by construction. The table engine only ever does
 * `cellRegistry[column.type]`, never a per-type branch.
 *
 * `boolean` registers no Editor: its Display checkbox commits directly.
 * `select`/`boolean` need no validate: their editors can only produce legal values.
 */
export const cellRegistry: Record<ColumnType, CellTypeConfig> = {
  string: { Display: StringCell, Editor: StringEditor },
  number: {
    Display: NumberCell,
    Editor: NumberEditor,
    validate: validateNumber,
  },
  boolean: { Display: BooleanCell },
  select: { Display: SelectCell, Editor: SelectEditor },
}

/**
 * Full validation for a candidate cell value: the type-level check from the
 * registry first, then the column's own `validate` (e.g. a regex from
 * `patternValidator`). Returns the first error message, or null when valid.
 * Lives here (not validators.ts) to avoid an import cycle with the registry.
 */
export function validateCell(
  value: CellValue,
  column: ColumnDef,
): string | null {
  return (
    cellRegistry[column.type].validate?.(value, column) ??
    column.validate?.(value) ??
    null
  )
}
