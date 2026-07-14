import type { CellValue, ColumnDef, ColumnType } from '../types'
import type { CellTypeConfig } from './types'
import { validateNumber } from './validators'
import { BooleanCell, NumberCell, SelectCell, StringCell } from './cells'

/**
 * The single seam for type-specific cell behavior. Keyed by {@link ColumnType} as a
 * `Record`, so adding a new column type is a compile error until it has an entry
 * here — exhaustiveness by construction. The table engine only ever does
 * `cellRegistry[column.type]`, never a per-type branch.
 *
 * `boolean` sets `hasEditMode: false`: its checkbox commits directly from the display.
 * `select`/`boolean` need no validate: their edit UIs can only produce legal values.
 */
export const cellRegistry: Record<ColumnType, CellTypeConfig> = {
  string: { Cell: StringCell },
  number: { Cell: NumberCell, validate: validateNumber },
  boolean: { Cell: BooleanCell, hasEditMode: false },
  select: { Cell: SelectCell },
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
