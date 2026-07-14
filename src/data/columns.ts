import type { ColumnDef } from '../table/types'
import { patternValidator, rangeValidator } from '../table/cellTypes/validators'

/**
 * Demo column schema covering every supported type (at least one each).
 *
 * This array is the single source of truth for the demo table — swapping it out
 * for a different schema swaps the entire table, demonstrating the "generic /
 * reusable" requirement.
 */
export const demoColumns: ColumnDef[] = [
  { 
    id: 'name',
    ordinalNo: 1,
    title: 'Full Name',
    type: 'string',
    width: 200 },
  {
    id: 'email',
    ordinalNo: 2,
    title: 'Email',
    type: 'string',
    width: 240,
    validate: patternValidator(/^\S+@\S+\.\S+$/, 'Invalid email address'),
  },
  {
    id: 'age',
    ordinalNo: 3,
    title: 'Age',
    type: 'number',
    width: 90,
    validate: rangeValidator(1, 120),
  },
  {
    id: 'salary',
    ordinalNo: 4,
    title: 'Salary',
    type: 'number',
    width: 130,
  },
  {
    id: 'active',
    ordinalNo: 5,
    title: 'Active',
    type: 'boolean',
    width: 90,
  },
  {
    id: 'role',
    ordinalNo: 6,
    title: 'Role',
    type: 'select',
    width: 130,
    options: ['Admin', 'Editor', 'Viewer', 'Guest'],
  },
  {
    id: 'department',
    ordinalNo: 7,
    title: 'Department',
    type: 'select',
    width: 150,
    options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
  },
]
