import { useState } from 'react'
import type { CellValue } from '../types'
import type { CellDisplayProps, CellEditorProps } from './types'
import { validateCell } from './registry'

/* ---------------------------------------------------------------- shared */

interface BaseTextEditorProps extends CellEditorProps {
  /** Turn the raw input text into a candidate cell value. */
  parse: (raw: string) => CellValue
  inputMode?: 'text' | 'numeric'
  align?: 'left' | 'right'
}

/**
 * Shared text-input editor: owns raw/error state and the inline-error UI.
 * Enter/blur parses the input and runs full validation (type-level +
 * column-level); an error blocks the commit and keeps the editor open, Esc
 * always cancels. String and number editors are thin wrappers over this.
 */
function BaseTextEditor({
  value,
  column,
  onCommit,
  onCancel,
  parse,
  inputMode = 'text',
  align = 'left',
}: BaseTextEditorProps) {
  const [raw, setRaw] = useState(value == null ? '' : String(value))
  const [error, setError] = useState<string | null>(null)

  const tryCommit = () => {
    const parsed = parse(raw)
    const problem = validateCell(parsed, column)
    if (problem) {
      setError(problem)
      return
    }
    onCommit(parsed)
  }

  return (
    <div className="relative w-full">
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus -- editor opens on user action
        autoFocus
        type="text"
        inputMode={inputMode}
        value={raw}
        aria-invalid={error != null}
        title={error ?? undefined}
        onChange={(e) => {
          setRaw(e.target.value)
          setError(null)
        }}
        onBlur={tryCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') tryCommit()
          if (e.key === 'Escape') onCancel()
        }}
        className={`h-7 w-full rounded border bg-white px-2 text-sm outline-none ring-2 ${
          align === 'right' ? 'text-right tabular-nums' : ''
        } ${
          error
            ? 'border-red-400 ring-red-100'
            : 'border-blue-400 ring-blue-100'
        }`}
      />
      {error && (
        <span className="absolute left-0 top-full z-20 mt-0.5 rounded bg-red-600 px-1.5 py-0.5 text-xs text-white">
          {error}
        </span>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- string */

/** Renders a string cell as plain, truncated text. */
export function StringCell({ value }: CellDisplayProps) {
  return (
    <span className="block truncate">{value == null ? '' : String(value)}</span>
  )
}

/** Text input editor. Enter/blur commits (after validation), Esc cancels. */
export function StringEditor(props: CellEditorProps) {
  return <BaseTextEditor {...props} parse={(raw) => raw} />
}

/* ---------------------------------------------------------------- number */

/** Renders a number cell right-aligned with thousands separators. */
export function NumberCell({ value }: CellDisplayProps) {
  const text = typeof value === 'number' ? value.toLocaleString() : ''
  return <span className="block w-full text-right tabular-nums">{text}</span>
}

/**
 * Numeric input editor. Enter/blur commits; invalid input (non-finite, or a
 * failing column validator) blocks the commit and shows an inline error
 * instead. Esc cancels.
 */
export function NumberEditor(props: CellEditorProps) {
  return (
    <BaseTextEditor
      {...props}
      parse={(raw) => (raw.trim() === '' ? NaN : Number(raw))}
      inputMode="numeric"
      align="right"
    />
  )
}

/* --------------------------------------------------------------- boolean */

/**
 * Boolean cells edit directly from the display: the checkbox *is* the editor,
 * so this type registers no separate Editor. When the cell is read-only
 * (no `onCommitValue`), the checkbox is disabled.
 */
export function BooleanCell({
  value,
  column,
  onCommitValue,
}: CellDisplayProps) {
  const checked = value === true
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={!onCommitValue}
      aria-label={`${column.title}: ${checked}`}
      onChange={() => onCommitValue?.(!checked)}
      className="h-4 w-4 accent-slate-700 disabled:opacity-40"
    />
  )
}

/* ---------------------------------------------------------------- select */

/** Renders a selected value as a subtle pill badge. */
export function SelectCell({ value }: CellDisplayProps) {
  if (value == null || value === '') return <span />
  return (
    <span className="inline-block max-w-full truncate rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      {String(value)}
    </span>
  )
}

/**
 * Native select over the column's `options`. Choosing a value commits
 * immediately; Esc or blur cancels.
 */
export function SelectEditor({
  value,
  column,
  onCommit,
  onCancel,
}: CellEditorProps) {
  return (
    <select
      // eslint-disable-next-line jsx-a11y/no-autofocus -- editor opens on user action
      autoFocus
      value={value == null ? '' : String(value)}
      onChange={(e) => onCommit(e.target.value)}
      onBlur={onCancel}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
      }}
      className="h-7 w-full rounded border border-blue-400 bg-white px-1 text-sm outline-none ring-2 ring-blue-100"
    >
      {(column.options ?? []).map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
