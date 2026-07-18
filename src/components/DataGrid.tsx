import { memo, useCallback, useMemo, useRef, type CSSProperties } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CellValue, ColumnDef, Row as RowData } from '../data/database';
import { CellRenderer } from './cells/CellRenderer';

interface DataGridProps {
  columns: ColumnDef[];
  data: RowData[];
  onChange: (rowId: string, columnId: string, value: CellValue) => void;
}

interface GridRowProps {
  row: RowData;
  columns: ColumnDef[];
  columnStyles: Map<string, CSSProperties>;
  virtualIndex: number;
  virtualStart: number;
  measureElement: (el: Element | null) => void;
  onChange: (rowId: string, columnId: string, value: CellValue) => void;
}

const GridRow = memo(function GridRow({
  row,
  columns,
  columnStyles,
  virtualIndex,
  virtualStart,
  measureElement,
  onChange,
}: GridRowProps) {
  const handleCellChange = useCallback(
    (columnId: string, value: CellValue) => onChange(row.id, columnId, value),
    [row.id, onChange]
  );

  return (
    <tr
      className="flex absolute w-full"
      style={{ transform: `translateY(${virtualStart}px)` }}
      ref={measureElement}
      data-index={virtualIndex}
    >
      {columns.map((col) => (
        <td
          key={col.id}
          style={columnStyles.get(col.id)}
          className="box-border px-3 py-2 border-b border-gray-200"
        >
          <CellRenderer
            column={col}
            value={row[col.id]}
            onChange={(value) => handleCellChange(col.id, value)}
          />
        </td>
      ))}
    </tr>
  );
});

export default function DataGrid({ columns, data, onChange }: DataGridProps) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const columnStyles = useMemo(
    () => new Map(columns.map((col) => [col.id, { width: col.width, flexShrink: 0 }])),
    [columns]
  );

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
                style={columnStyles.get(col.id)}
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
                <GridRow
                  key={virtualRow.key}
                  row={row}
                  columns={columns}
                  columnStyles={columnStyles}
                  virtualIndex={virtualRow.index}
                  virtualStart={virtualRow.start}
                  measureElement={rowVirtualizer.measureElement}
                  onChange={onChange}
                />
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
