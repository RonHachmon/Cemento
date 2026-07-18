import { memo, type ReactNode } from 'react';
import type { CellValue, ColumnDef } from '../../data/database';
import { Tooltip } from '../Tooltip';

export interface CellEditorProps {
  column: ColumnDef;
  value: CellValue;
  onChange: (value: CellValue) => void;
}

function withErrorTooltip(error: string | null, input: ReactNode) {
  return error ? <Tooltip content={error}>{input}</Tooltip> : input;
}

export const StringCell = memo(function StringCell({ column, value, onChange }: CellEditorProps) {
  const error = column.validation?.(value) ?? null;
  return withErrorTooltip(
    error,
    <input
      aria-label={column.title}
      disabled={!column.isEditable}
      type="text"
      className={error ? 'border border-red-400 rounded' : undefined}
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

export const NumberCell = memo(function NumberCell({ column, value, onChange }: CellEditorProps) {
  const error = column.validation?.(value) ?? null;
  return withErrorTooltip(
    error,
    <input
      aria-label={column.title}
      className={`inline-block text-right w-20 ${error ? 'border border-red-400 rounded' : ''}`}
      disabled={!column.isEditable}
      type="number"
      value={typeof value === 'number' ? value : ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
    />
  );
});

export const BooleanCell = memo(function BooleanCell({ column, value, onChange }: CellEditorProps) {
  return (
    <div className="flex justify-center items-center">
      <input
        aria-label={column.title}
        className="border-2"
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        disabled={!column.isEditable}
      />
    </div>
  );
});

export const SelectCell = memo(function SelectCell({ column, value, onChange }: CellEditorProps) {
  if (!column.isEditable) return <span>{String(value ?? '')}</span>;
  const error = column.validation?.(value) ?? null;
  return withErrorTooltip(
    error,
    <select
      aria-label={column.title}
      className={error ? 'border border-red-400 rounded' : undefined}
      disabled={!column.isEditable}
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        Select…
      </option>
      {column.options?.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
});
