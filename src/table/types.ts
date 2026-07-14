/**
 * Core schema for the generic data table.
 *
 * These types match the shape provided in the assignment. Two properties were
 * ADDED to `ColumnDef` (`options`, `editable`); per the assignment Q&A, adding
 * properties is allowed as long as existing properties are not changed or
 * removed, and the change is documented with a rationale (see JSDoc below).
 */

/** The set of data types a column can hold. String-literal union so the type
 * registry, renderers, editors, and validators are all exhaustively typed. */
export type ColumnType = 'string' | 'number' | 'boolean' | 'select'

/** The value stored in a single cell. Narrowed from the assignment's `any` to a
 * closed union: rows are data (not part of the frozen column schema), so tightening
 * this is allowed and it makes cell rendering/editing type-safe. `null` represents
 * an empty cell. */
export type CellValue = string | number | boolean | null

export interface ColumnDef {
  /** Column id. Matches the key used on each row. */
  id: string
  /** Position of the column in the table. */
  ordinalNo: number
  /** Human-readable column header. */
  title: string
  /** Data type of the column's cells; drives rendering, editing and validation. */
  type: ColumnType
  /** Optional fixed column width in pixels. */
  width?: number
  /**
   * ADDED: the available choices for a `select` column. Required when
   * `type === 'select'`. Rationale: the assignment Q&A leaves the source/format
   * of select options up to us, so the column definition carries them directly —
   * keeping the table generic (no external option registry needed).
   */
  options?: string[]
  /**
   * ADDED: when `false`, the column's cells are read-only. Defaults to `true`.
   * Rationale: a reusable table needs a generic way to mark columns
   * non-editable without special-casing specific column ids.
   */
  editable?: boolean
  /**
   * ADDED: optional per-column validator, run when a cell in this column is
   * edited (after the type-level check from the registry). Return an error
   * message to block the commit, or `null` when valid. A function covers
   * regex, ranges, and custom rules with a single schema field — use
   * `patternValidator(regex, message)` for the common regex case (e.g. email
   * or phone columns). Rationale: validity is often a property of the column
   * (an email-shaped string), not of the data type (string).
   */
  validate?: (value: CellValue) => string | null
}

/** A single data row. `id` is required; every other key is a column id mapping to
 * that cell's value. */
export interface Row {
  id: string
  [columnId: string]: CellValue
}

/** The full input to the table: the column schema plus the row data. */
export interface TableData {
  columns: ColumnDef[]
  data: Row[]
}
