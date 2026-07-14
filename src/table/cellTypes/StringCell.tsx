import { useState } from 'react'
import type { CellDisplayProps, CellEditorProps } from './types'

/** Renders a string cell as plain, truncated text. */
export function StringCell({ value }: CellDisplayProps) {
  return (
    <span className="block truncate">{value == null ? '' : String(value)}</span>
  )
}

/** Text input editor. Enter/blur commits, Esc cancels. */
export function StringEditor({ value, onCommit, onCancel }: CellEditorProps) {
  const [raw, setRaw] = useState(value == null ? '' : String(value))
  return (
    <input
      // eslint-disable-next-line jsx-a11y/no-autofocus -- editor opens on user action
      autoFocus
      type="text"
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={() => onCommit(raw)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(raw)
        if (e.key === 'Escape') onCancel()
      }}
      className="h-7 w-full rounded border border-blue-400 bg-white px-2 text-sm outline-none ring-2 ring-blue-100"
    />
  )
}
