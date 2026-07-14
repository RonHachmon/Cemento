import type { CellValue, ColumnDef } from '../types'

/**
 * Validate a candidate number cell value. Exported pure so it is testable
 * outside React. Non-finite values (including NaN from empty/garbage input)
 * are rejected.
 */
export function validateNumber(
  value: CellValue,
  _column?: ColumnDef,
): string | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? null
    : 'Must be a number'
}
