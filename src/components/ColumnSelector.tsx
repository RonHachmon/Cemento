import { useEffect, useRef, useState } from 'react';
import type { ColumnDef } from '../data/database';

interface ColumnSelectorProps {
  columns: ColumnDef[];
  visibleColumnIds: Set<string>;
  onToggle: (id: string) => void;
}

export default function ColumnSelector({
  columns,
  visibleColumnIds,
  onToggle,
}: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="relative w-64" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full bg-white text-slate-700 text-sm border border-slate-300 rounded-lg pl-3 pr-8 py-2 flex items-center justify-between transition duration-200 ease-in-out focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md cursor-pointer"
      >
        <span>Select columns</span>
        <span aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {columns.map((col) => (
            <label
              key={col.id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="border-2"
                checked={visibleColumnIds.has(col.id)}
                onChange={() => onToggle(col.id)}
              />
              {col.title}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
