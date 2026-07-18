import Table from './components/Table'

export default function App() {
  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-800 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-4xl flex flex-col flex-1 min-h-0">
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900">
          Cemento Data Table
        </h1>
        <Table />
      </div>
    </div>
  )
}
