import { useMemo } from 'react'
import { DataTable } from './table'
import { generateTableData } from './data/generateTableData'

export default function App() {
  const { columns, data } = useMemo(() => generateTableData(10_000), [])

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 p-6 text-slate-800">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cemento Data Table
          </h1>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
