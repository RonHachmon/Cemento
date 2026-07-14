import type { ColumnType } from '../types'
import type { CellTypeConfig } from './types'
import { StringCell, StringEditor } from './StringCell'
import { NumberCell, NumberEditor } from './NumberCell'
import { validateNumber } from './validators'
import { BooleanCell } from './BooleanCell'
import { SelectCell, SelectEditor } from './SelectCell'

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
