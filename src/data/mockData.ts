import type { CellValue, TableData } from './database';

export const mockTableData: TableData = {
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
      options: ['Active', 'Inactive', 'Pending'],
      isEditable: true,
      validation: (value: CellValue) =>
        typeof value === 'string' && ['Active', 'Inactive', 'Pending'].includes(value)
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
  data: [
    { id: '1', name: 'Alice Johnson', age: 29, status: 'Active', isVerified: true, email: 'alice.johnson@example.com' },
    { id: '2', name: 'Bob Smith', age: 34, status: 'Inactive', isVerified: false, email: 'bob.smith@example.com' },
    { id: '3', name: 'Carla Diaz', age: 41, status: 'Pending', isVerified: false, email: 'carla.diaz@example.com' },
    { id: '4', name: 'David Lee', age: 25, status: 'Active', isVerified: true, email: 'david.lee@example.com' },
    { id: '5', name: 'Emma Wilson', age: 37, status: 'Active', isVerified: true, email: 'emma.wilson@example.com' },
  ],
};
