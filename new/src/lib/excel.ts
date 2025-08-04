import xlsx from 'xlsx';
import path from 'path';
import { ErrorList } from './error';

const HEADER_ROW = 3;
const ROW_OF_FIRST_PERSONALNUMMER = 5;
const COLUMN_OF_PERSONALNUMMER = 'A';

let workSheet: xlsx.WorkSheet | undefined;
let workBook: xlsx.WorkBook | undefined;

export function hasSeveralSheets(excelFile: string): boolean {
    const wb = getWorkBook(excelFile);
    return wb.SheetNames.length > 1;
}

export function initExcelFile(excelFile: string, sheetNumber = 0): xlsx.WorkSheet {
    const wb = getWorkBook(excelFile);
    const actualFirstSheetName = wb.SheetNames[sheetNumber];
    workSheet = wb.Sheets[actualFirstSheetName];
    return workSheet;
}

export function getWorkBook(excelFile: string): xlsx.WorkBook {
    workBook = xlsx.readFile(path.join(__dirname, '../exchange', excelFile));
    return workBook;
}

export function getNumberOfSheets(): number {
    return workBook ? workBook.SheetNames.length : 0;
}

export function getNumberOfLastDataRow(): number {
  if (!workSheet) return 0;
  const range = xlsx.utils.decode_range(workSheet['!ref'] as string);
  return range.e.r + 1;
}

export function getColCount(): number {
  if (!workSheet) return 0;
  const range = xlsx.utils.decode_range(workSheet['!ref'] as string);
  return range.e.c + 1;
}

export function cellExists(cell: any): boolean {
  if (!workSheet) return false;
  return !!workSheet[cell];
}

export function getCellCoordinate(col: number, row: number): string {
  return `${xlsx.utils.encode_col(col)}${row}`;
}

export function readCell(cell: string, type: string): any {
  if (!workSheet) return null;
  const cellObj = workSheet[cell];
  if (!cellObj) return null;
  switch (type) {
    case 'string':
      return cellObj.w ?? cellObj.v?.toString() ?? '';
    case 'number':
      return typeof cellObj.v === 'number' ? cellObj.v : Number(cellObj.v);
    case 'boolean':
      return Boolean(cellObj.v);
    default:
      return cellObj.v;
  }
}

export async function handleExcelUpload(formData: FormData): Promise<any> {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }
  const arrayBuffer = await file.arrayBuffer();
  const wb = xlsx.read(arrayBuffer, { type: 'array' });
  workBook = wb;
  workSheet = wb.Sheets[wb.SheetNames[0]];
  return { message: 'Excel file uploaded successfully', sheetNames: wb.SheetNames };
}
