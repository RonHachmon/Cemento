import type { ColumnType } from '../../data/database';
import type { CellEditorProps } from './CellEditors';
import { StringCell, NumberCell, BooleanCell, SelectCell } from './CellEditors';

export const cellComponentByType: Record<ColumnType, (props: CellEditorProps) => React.JSX.Element> = {
  string: StringCell,
  number: NumberCell,
  boolean: BooleanCell,
  select: SelectCell,
};

export function CellRenderer({ column, value, onChange }: CellEditorProps) {
  const Cell = cellComponentByType[column.type];
  return <Cell column={column} value={value} onChange={onChange} />;
}
