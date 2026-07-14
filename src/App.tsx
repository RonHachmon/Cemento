import { useMemo, useState } from 'react'
import { DataTable } from './table'
import { getDataset, ROW_COUNTS, type DatasetSize } from './data/datasets'

export default function App() {
  const [size, setSize] = useState<DatasetSize>('small')
  const { columns, data } = useMemo(() => getDataset(size), [size])

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 p-6 text-slate-800">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cemento Data Table
          </h1>
          <p className="text-sm text-slate-500">
            Generic, virtualized, editable — click a cell to edit, then Save.
          </p>
        </div>

        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Dataset size"
        >
          {(Object.keys(ROW_COUNTS) as DatasetSize[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={size === option}
              onClick={() => setSize(option)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 ${
                size === option
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option} ({ROW_COUNTS[option].toLocaleString()} rows)
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        {/* key={size} remounts the table on dataset switch, resetting edits. */}
        <DataTable key={size} columns={columns} data={data} />
      </div>
    </div>
  )
}
