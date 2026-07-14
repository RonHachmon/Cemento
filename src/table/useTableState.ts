import { useCallback, useMemo, useRef, useState } from 'react'
import type { CellValue, Row } from './types'

/** Draft edits: rowId → (columnId → new value). Only touched rows have entries. */
export type Drafts = Map<string, Record<string, CellValue>>

/** Pure merge of draft edits into committed rows. Exported for testing. */
export function applyDrafts(rows: Row[], drafts: Drafts): Row[] {
  if (drafts.size === 0) return rows
  return rows.map((row) => {
    const draft = drafts.get(row.id)
    return draft ? { ...row, ...draft } : row
  })
}

/**
 * Local table state: committed rows + a draft overlay of unsaved edits.
 *
 * Edits never mutate the committed rows — they accumulate in `drafts` keyed by
 * row id (stable under virtualization/reordering). `save()` merges the overlay
 * into the committed rows and notifies `onSave`; `reset()` discards it. Draft
 * records are per-row objects, so untouched rows keep referentially stable
 * props and stay memoized.
 */
export function useTableState(
  initialRows: Row[],
  onSave?: (rows: Row[]) => void,
) {
  const [rows, setRows] = useState(initialRows)
  const [drafts, setDrafts] = useState<Drafts>(new Map())

  // Latest state for stable event-handler callbacks (no side effects inside
  // state updaters — StrictMode double-invokes those).
  const rowsRef = useRef(rows)
  rowsRef.current = rows
  const draftsRef = useRef(drafts)
  draftsRef.current = drafts

  const setCellDraft = useCallback(
    (rowId: string, columnId: string, value: CellValue) => {
      setDrafts((prev) => {
        const next = new Map(prev)
        const committed = rowsRef.current.find((r) => r.id === rowId)?.[
          columnId
        ]
        const draft = { ...next.get(rowId) }

        if (value === committed) {
          // Edited back to the committed value → no longer dirty.
          delete draft[columnId]
        } else {
          draft[columnId] = value
        }

        if (Object.keys(draft).length === 0) next.delete(rowId)
        else next.set(rowId, draft)
        return next
      })
    },
    [],
  )

  const save = useCallback(() => {
    const merged = applyDrafts(rowsRef.current, draftsRef.current)
    setRows(merged)
    setDrafts(new Map())
    onSave?.(merged)
  }, [onSave])

  const reset = useCallback(() => setDrafts(new Map()), [])

  const dirtyCount = useMemo(() => {
    let count = 0
    for (const draft of drafts.values()) count += Object.keys(draft).length
    return count
  }, [drafts])

  return { rows, drafts, setCellDraft, save, reset, dirtyCount }
}
