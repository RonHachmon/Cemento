// TableData


export type ColumnType = 'string' | 'number' | 'boolean' | 'select';
export type CellValue = string | number | boolean | null



export interface ColumnDef {
    id: string; 
    ordinalNo: number; 
    title: string; 
    type: ColumnType; 
    width?: number; 



    //added properties
    options?: string[]; 
    isEditable?: boolean; 
    validation?: (value: CellValue) => string | null; 

}


export interface Row {
  id: string
  [columnId: string]: CellValue
}

export interface TableData {
  columns: ColumnDef[]
  data: Row[]
}
