import { useState } from 'react'
import type { CellDisplayProps, CellEditorProps } from './types'
import { validateNumber } from './validators'

/** Renders a number cell right-aligned with thousands separators. */
export function NumberCell({ value }: CellDisplayProps) {
  const text = typeof value === 'number' ? value.toLocaleString() : ''
  return <span className="block w-full text-right tabular-nums">{text}</span>
}

/**
 * Numeric input editor. Enter/blur commits; invalid input blocks the commit and
 * shows an inline error instead (Esc still cancels).
 */
export function NumberEditor({ value, onCommit, onCancel }: CellEditorProps) {
  const [raw, setRaw] = useState(value == null ? '' : String(value))
  const [error, setError] = useState<string | null>(null)

  const tryCommit = () => {
    const parsed = raw.trim() === '' ? NaN : Number(raw)
    const problem = validateNumber(parsed)
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
        inputMode="numeric"
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
        className={`h-7 w-full rounded border bg-white px-2 text-right text-sm tabular-nums outline-none ring-2 ${
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
