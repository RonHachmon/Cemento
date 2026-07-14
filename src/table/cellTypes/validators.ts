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

/**
 * Build a column-level validator from a regex — the common case for
 * `ColumnDef.validate` (email, phone, zip…):
 *
 *   validate: patternValidator(/^\S+@\S+\.\S+$/, 'Invalid email address')
 */
export function patternValidator(pattern: RegExp, message: string) {
  return (value: CellValue): string | null =>
    typeof value === 'string' && pattern.test(value) ? null : message
}

/**
 * Build a column-level validator for a numeric range (inclusive):
 *
 *   validate: rangeValidator(1, 120)
 *
 * Runs after the type-level number check, so `value` is already a finite
 * number by the time this is called from `validateCell`.
 */
export function rangeValidator(min: number, max: number, message?: string) {
  return (value: CellValue): string | null =>
    typeof value === 'number' && value >= min && value <= max
      ? null
      : (message ?? `Must be between ${min} and ${max}`)
}
