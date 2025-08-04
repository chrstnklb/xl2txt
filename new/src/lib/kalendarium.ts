// Refactored from old/src/server/kalendarium.js for TypeScript and ES module usage.
import { Metric } from './metric';
import * as excel from './excel';
import * as felder from './felder';
import * as fileHandler from './fileHandler';

export function transformKalendariumToTxt(excelFile: string): string {
    const metric = new Metric();
    let allLines = "";
    for (let sheetNumber = 1; sheetNumber < excel.getNumberOfSheets(); sheetNumber++) {
        const workSheet = excel.initExcelFile(excelFile, sheetNumber);
        const lastDataRow = excel.getNumberOfLastDataRow();
        const colCount = excel.getColCount();
        metric.setRowCount(lastDataRow - DATA_START_ROW);
        metric.setColCount(colCount);
        const firmennummer = felder.readMandantennummer();
        const abrechnungszeitraum = felder.readAbrechnungsZeitraum();
        felder.readPersonalnummer('A4');
        const personalnummer = felder.readPersonalnummer('A' + DATA_START_ROW);
        for (let col = KALENDARIUM_FIXED_COLUMNS; col < colCount; col++) {
            let colSum = 0;
            if (excel.cellExists(workSheet[excel.getCellCoordinate(col, DATA_START_ROW)]) !== undefined) {
                colSum = getSumOfColumn(workSheet, col, DATA_START_ROW, lastDataRow);
            }
            if (colSum !== 0) {
                const headerCellContent = workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)].v;
                allLines += createOneLine(firmennummer, personalnummer, headerCellContent, abrechnungszeitraum, colSum);
            }
        }
    }
    fileHandler.deleteUploadedFiles();
    metric.writeMetric();
    return fileHandler.writeTxtFile(allLines);
}

export function getSumOfColumn(workSheet: any, col: number, startRow: number, endRow: number): number {
    let sum = 0;
    for (let row = startRow; row <= endRow; row++) {
        const cellCoord = excel.getCellCoordinate(col, row);
        const cell = workSheet[cellCoord];
        if (cell && typeof cell.v === 'number') {
            sum += cell.v;
        } else if (cell && typeof cell.v === 'string') {
            // Try to parse numbers from strings, replacing comma with dot if needed
            const parsed = parseFloat(cell.v.replace(',', '.'));
            if (!isNaN(parsed)) {
                sum += parsed;
            }
        }
    }
    return sum;
}

export function findCellsWithContent(workSheet: any, startRow: number, endRow: number, col: number): boolean {
    for (let row = startRow; row <= endRow; row++) {
        if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
            return true;
        }
    }
    return false;
}

export async function processKalendarium(data: any): Promise<any> {
    if (!data || !data.excelFile) {
        throw new Error('No Excel file provided');
    }
    const txtContent = transformKalendariumToTxt(data.excelFile);
    return { txtContent };
}

export const DATA_START_ROW = 2;
export const KALENDARIUM_FIXED_COLUMNS = 3;
export const LOHNART_ROW = 1;

export function createOneLine(
    firmennummer: string | number | undefined,
    personalnummer: string | number | undefined,
    headerCellContent: string | number | undefined,
    abrechnungszeitraum: string | number | undefined,
    colSum: number
): string {
    // Replace undefined with empty string and join with semicolon
    return [
        firmennummer ?? '',
        personalnummer ?? '',
        headerCellContent ?? '',
        abrechnungszeitraum ?? '',
        replaceDots(colSum)
    ].join(';') + '\n';
}

export function replaceDots(val: any): any {
    if (typeof val === 'number') {
        // Convert to string with 2 decimals and replace dot with comma
        return val.toFixed(2).replace('.', ',');
    }
    if (typeof val === 'string') {
        return val.replace('.', ',');
    }
    return val;
}
