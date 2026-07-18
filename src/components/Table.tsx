import { useCallback, useMemo, useState } from 'react';
import type { CellValue } from '../data/database';
import { mockTableDataFaker } from '../data/mockDataFaker';
import ColumnSelector from './ColumnSelector';
import DataGrid from './DataGrid';

export default function Table() {
  const { columns } = mockTableDataFaker;
  const [data, setData] = useState(mockTableDataFaker.data);
  const [visibleColumnIds, setVisibleColumnIds] = useState<Set<string>>(
    () => new Set(columns.map((c) => c.id))
  );
  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.ordinalNo - b.ordinalNo),
    [columns]
  );
  const displayedColumns = useMemo(
    () => sortedColumns.filter((c) => visibleColumnIds.has(c.id)),
    [sortedColumns, visibleColumnIds]
  );

  const handleChange = useCallback((rowId: string, columnId: string, value: CellValue) => {
    setData((prev) => prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)));
  }, []);

  const toggleColumn = useCallback((id: string) => {
    setVisibleColumnIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="mb-3">
        <ColumnSelector
          columns={sortedColumns}
          visibleColumnIds={visibleColumnIds}
          onToggle={toggleColumn}
        />
      </div>

      <DataGrid
        columns={displayedColumns}
        data={data}
        onChange={handleChange}
        className="flex-1 min-h-0"
      />
    </div>
  );
}
