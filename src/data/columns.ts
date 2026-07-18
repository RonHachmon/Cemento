import type { CellValue, ColumnDef } from './database';

export const STATUS_OPTIONS = ['Active', 'Inactive', 'Pending'];

export const columns: ColumnDef[] = [
  {
    id: 'name',
    ordinalNo: 0,
    title: 'Name',
    type: 'string',
    width: 200,
    isEditable: true,
    validation: (value: CellValue) =>
      typeof value === 'string' && value.trim().length > 0 ? null : 'Name is required',
  },
  {
    id: 'age',
    ordinalNo: 1,
    title: 'Age',
    type: 'number',
    width: 80,
    isEditable: true,
    validation: (value: CellValue) =>
      typeof value === 'number' && value >= 0 && value <= 120 ? null : 'Age must be between 0 and 120',
  },
  {
    id: 'status',
    ordinalNo: 2,
    title: 'Status',
    type: 'select',
    width: 140,
    options: STATUS_OPTIONS,
    isEditable: true,
    validation: (value: CellValue) =>
      typeof value === 'string' && STATUS_OPTIONS.includes(value)
        ? null
        : 'Status must be one of the available options',
  },
  { id: 'isVerified', ordinalNo: 3, title: 'Verified', type: 'boolean', width: 100, isEditable: true },
  {
    id: 'email',
    ordinalNo: 4,
    title: 'Email',
    type: 'string',
    width: 220,
    isEditable: true,
    validation: (value: CellValue) =>
      typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address',
  },
];
