import { faker } from '@faker-js/faker';
import type { CellValue, Row, TableData } from './database';

// Seeded so the generated data is stable across runs/reloads.
faker.seed(42);

const STATUS_OPTIONS = ['Active', 'Inactive', 'Pending'];

const rows: Row[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 75 }),
  status: faker.helpers.arrayElement(STATUS_OPTIONS),
  isVerified: faker.datatype.boolean(),
  email: faker.internet.email(),
}));

export const mockTableDataFaker: TableData = {
  columns: [
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
  ],
  data: rows,
};
