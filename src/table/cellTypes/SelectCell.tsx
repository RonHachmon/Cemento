import type { CellDisplayProps, CellEditorProps } from './types'

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
