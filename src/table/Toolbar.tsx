import { useEffect, useRef, useState } from 'react'
import type { ColumnDef } from './types'

export interface ToolbarProps {
  columns: ColumnDef[]
  hiddenIds: ReadonlySet<string>
  onToggleColumn: (columnId: string) => void
  dirtyCount: number
  onSave: () => void
  onReset: () => void
}

/**
 * Table toolbar: column visibility menu on the left, unsaved-changes controls
 * on the right. Table-owned (generic) — it only knows the column schema.
 */
export function Toolbar({
  columns,
  hiddenIds,
  onToggleColumn,
  dirtyCount,
  onSave,
  onReset,
}: ToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the dropdown on any click outside it.
  useEffect(() => {
    if (!menuOpen) return
    const onMouseDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [menuOpen])

  const visibleCount = columns.length - hiddenIds.size

  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2">
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
        >
          Columns ({visibleCount}/{columns.length}) ▾
        </button>
        {menuOpen && (
          <div className="absolute left-0 top-full z-30 mt-1 w-52 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
            {columns.map((column) => (
              <label
                key={column.id}
                className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={!hiddenIds.has(column.id)}
                  onChange={() => onToggleColumn(column.id)}
                  className="h-4 w-4 accent-slate-700"
                />
                {column.title}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {dirtyCount > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            {dirtyCount} unsaved change{dirtyCount === 1 ? '' : 's'}
          </span>
        )}
        <button
          type="button"
          onClick={onReset}
          disabled={dirtyCount === 0}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={dirtyCount === 0}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:pointer-events-none disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  )
}
