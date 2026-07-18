import { faker } from '@faker-js/faker';
import type { Row, TableData } from './database';
import { columns, STATUS_OPTIONS } from './columns';

// Seeded so the generated data is stable across runs/reloads.
faker.seed(42);

const ROW_COUNT = 10_000;

const rows: Row[] = Array.from({ length: ROW_COUNT }, (_, index) => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 75 }),
  status: faker.helpers.arrayElement(STATUS_OPTIONS),
  isVerified: faker.datatype.boolean(),
  email: faker.internet.email(),
}));

export const mockTableDataFaker: TableData = {
  columns,
  data: rows,
};
