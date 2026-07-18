import type { ReactNode } from 'react';
import type { CellValue, ColumnDef } from '../../data/database';
import { Tooltip } from '../Tooltip';

export interface CellEditorProps {
  column: ColumnDef;
  value: CellValue;
  onChange: (value: CellValue) => void;
}

function getValidationError(column: ColumnDef, value: CellValue) {
  return column.validation?.(value) ?? null;
}

function withErrorTooltip(error: string | null, input: ReactNode) {
  return error ? <Tooltip content={error}>{input}</Tooltip> : input;
}

export function StringCell({ column, value, onChange }: CellEditorProps) {
  const error = getValidationError(column, value);
  return withErrorTooltip(
    error,
    <input
      disabled={!column.isEditable}
      type="text"
      className={error ? 'border border-red-400 rounded' : undefined}
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NumberCell({ column, value, onChange }: CellEditorProps) {
  const error = getValidationError(column, value);
  return withErrorTooltip(
    error,
    <input
      className={`inline-block text-right w-20 ${error ? 'border border-red-400 rounded' : ''}`}
      disabled={!column.isEditable}
      type="number"
      value={typeof value === 'number' ? value : ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
    />
  );
}

export function BooleanCell({ column, value, onChange }: CellEditorProps) {
  return (
    <div className="flex justify-center items-center">
      <input
        className="border-2"
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        disabled={!column.isEditable}
      />
    </div>
  );
}

export function SelectCell({ column, value, onChange }: CellEditorProps) {
  if (!column.isEditable) return <span>{String(value ?? '')}</span>;
  const error = getValidationError(column, value);
  return withErrorTooltip(
    error,
    <select
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
}
