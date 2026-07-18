import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CellValue, ColumnDef, Row } from '../data/database';
import { CellRenderer } from './cells/CellRenderer';

interface DataGridProps {
  columns: ColumnDef[];
  data: Row[];
  onChange: (rowId: string, columnId: string, value: CellValue) => void;
}

export default function DataGrid({ columns, data, onChange }: DataGridProps) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  return (

    <div
      ref={parentRef}
      className="h-[400px] overflow-auto rounded-md border border-gray-800"
    >

      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="flex">
            {columns.map((col) => (
              <th
                key={col.id}
                style={{ width: col.width, flexShrink: 0 }}
                className="box-border px-3 py-2 text-left font-semibold text-gray-700"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          style={{ height: rowVirtualizer.getTotalSize() }}
          className="relative block"
          >
            {
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = data[virtualRow.index];
              return (
                <tr
                  key={virtualRow.key}
                  className="flex absolute w-full"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                  ref={(el) => rowVirtualizer.measureElement(el)}
                  data-index={virtualRow.index}
                >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      style={{ width: col.width, flexShrink: 0 }}
                      className="box-border px-3 py-2 border-b border-gray-200"
                    >
                      <CellRenderer
                        column={col}
                        value={row[col.id]}
                        onChange={(value) => onChange(row.id, col.id, value)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}





          </tbody>
        {/* <tbody
          style={{ height: rowVirtualizer.getTotalSize() }}
          className="relative block"
        >
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.id}>
                  <CellRenderer
                    column={col}
                    value={row[col.id]}
                    onChange={(value) => onChange(row.id, col.id, value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody> */}
      </table>
      </div>
  );
}
