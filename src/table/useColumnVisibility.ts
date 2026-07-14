import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from './types'

/**
 * Column show/hide state. Tracks hidden column ids and derives the visible
 * subset of the (already ordered) columns.
 */
export function useColumnVisibility(orderedColumns: ColumnDef[]) {
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(new Set())

  const toggleColumn = useCallback((columnId: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      if (next.has(columnId)) next.delete(columnId)
      else next.add(columnId)
      return next
    })
  }, [])

  const visibleColumns = useMemo(
    () => orderedColumns.filter((column) => !hiddenIds.has(column.id)),
    [orderedColumns, hiddenIds],
  )

  return { visibleColumns, hiddenIds, toggleColumn }
}
