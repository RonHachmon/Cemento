import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CellValue } from '../data/database';
import { mockTableDataFaker } from '../data/mockDataFaker';
import DataGrid from './DataGrid';

export default function Table() {
  const { columns } = mockTableDataFaker;
  const [data, setData] = useState(mockTableDataFaker.data);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleColumnIds, setVisibleColumnIds] = useState<Set<string>>(
    () => new Set(columns.map((c) => c.id))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.ordinalNo - b.ordinalNo),
    [columns]
  );
  const displayedColumns = useMemo(
    () => sortedColumns.filter((c) => visibleColumnIds.has(c.id)),
    [sortedColumns, visibleColumnIds]
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        {
            setIsOpen(false);
        }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleChange = useCallback((rowId: string, columnId: string, value: CellValue) => {
    setData((prev) => prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)));
  }, []);

  function toggleColumn(id: string) {
    setVisibleColumnIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="w-full bg-transparent text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 flex items-center justify-between transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md cursor-pointer"
        >
          <span>{visibleColumnIds.size} of {sortedColumns.length} columns shown</span>
          <span aria-hidden="true">▾</span>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded shadow-md max-h-64 overflow-auto">
            {sortedColumns.map((col) => (
              <label key={col.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="border-2"
                  checked={visibleColumnIds.has(col.id)}
                  onChange={() => toggleColumn(col.id)}
                />
                {col.title}
              </label>
            ))}
          </div>
        )}
      </div>

      <DataGrid columns={displayedColumns} data={data} onChange={handleChange} />
    </>
  );
}
