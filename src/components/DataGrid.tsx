import { memo, useCallback, useMemo, useRef, type CSSProperties } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CellValue, ColumnDef, Row as RowData } from '../data/database';
import { CellRenderer } from './cells/CellRenderer';

const ROW_ESTIMATE_HEIGHT = 40;
const ROW_OVERSCAN = 10;

interface DataGridProps {
  columns: ColumnDef[];
  data: RowData[];
  onChange: (rowId: string, columnId: string, value: CellValue) => void;
  className?: string;
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
      className={`flex absolute w-full transition-colors hover:bg-slate-100/70 ${
        virtualIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
      }`}
      style={{ transform: `translateY(${virtualStart}px)` }}
      ref={measureElement}
      data-index={virtualIndex}
    >
      {columns.map((col) => (
        <td
          key={col.id}
          style={columnStyles.get(col.id)}
          className="box-border px-3 py-2 border-b border-slate-100"
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

export default function DataGrid({ columns, data, onChange, className = '' }: DataGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_ESTIMATE_HEIGHT,
    overscan: ROW_OVERSCAN,
  });

  const columnStyles = useMemo(
    () => new Map(columns.map((col) => [col.id, { width: col.width, flexShrink: 0 }])),
    [columns]
  );

  return (
    <div
      ref={parentRef}
      className={`overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
          <tr className="flex border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.id}
                style={columnStyles.get(col.id)}
                className="box-border px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody style={{ height: rowVirtualizer.getTotalSize() }} className="relative block">
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
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
      </table>
    </div>
  );
}
