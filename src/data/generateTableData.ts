import { faker } from '@faker-js/faker'
import type { CellValue, ColumnDef, Row, TableData } from '../table/types'
import { demoColumns } from './columns'

/** Produce a single cell value appropriate for the given column's type. */
function generateCellValue(column: ColumnDef): CellValue {
  switch (column.type) {
    case 'string':
      return column.id === 'email'
        ? faker.internet.email()
        : faker.person.fullName()
    case 'number':
      return column.id === 'salary'
        ? faker.number.int({ min: 30000, max: 200000 })
        : faker.number.int({ min: 18, max: 75 })
    case 'boolean':
      return faker.datatype.boolean()
    case 'select':
      // A select column always carries its choices; fall back to null if not.
      return column.options ? faker.helpers.arrayElement(column.options) : null
  }
}

/**
 * Generate a full {@link TableData} set using the demo column schema.
 *
 * Seeded so the data is deterministic across reloads and tests — pass a
 * different `seed` for different-but-reproducible data.
 */
export function generateTableData(rowCount: number, seed = 123): TableData {
  faker.seed(seed)

  const data: Row[] = Array.from({ length: rowCount }, (_, index) => {
    const row: Row = { id: `row-${index}` }
    for (const column of demoColumns) {
      row[column.id] = generateCellValue(column)
    }
    return row
  })

  return { columns: demoColumns, data }
}
