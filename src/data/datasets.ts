import type { TableData } from '../table/types'
import { generateTableData } from './generateTableData'

/** Selectable demo dataset sizes. */
export type DatasetSize = 'small' | 'large'

/** Row count for each dataset size. Small is for eyeballing behavior; large
 * exercises virtualization. */
export const ROW_COUNTS: Record<DatasetSize, number> = {
  small: 10,
  large: 10_000,
}

/** Build the {@link TableData} for a given dataset size. */
export const getDataset = (size: DatasetSize): TableData =>
  generateTableData(ROW_COUNTS[size])
