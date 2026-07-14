import type { CellDisplayProps } from './types'

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
