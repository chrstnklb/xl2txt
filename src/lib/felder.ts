import * as excel from './excel';
import { ErrorList } from './error';

export const KOSTEN_ST = 'KOSTENST';
export const L_SATZ = 'LSATZ';
export const ANZ_STD = 'ANZSTD';
export const KOSTEN_TR = 'KOSTENTR';
export const P_SATZ = 'PSATZ';
export const BETRAG = 'BETRAG';
export const ABRECHNUNGSTAG = 'Abrechnungstag';
export const ANZ_TAGE = 'ANZTAGE';

export function readFirmennummer(cellCoordinate = 'B2'): number | undefined {
    const firmennummer = excel.readCell(cellCoordinate, 'number');
    if (firmennummer === undefined) {
        ErrorList.getInstance().addError(
            `Die Mandantennummer wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return firmennummer;
}

export function readPersonalnummer(cellCoordinate: string): string | undefined {
    const personalnummer = excel.readCell(cellCoordinate, 'string');
    if (personalnummer === undefined) {
        ErrorList.getInstance().addError(
            `Die Personalnummer wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return personalnummer;
}

/**
 * Returns an object with all relevant fields extracted from the Excel sheet.
 * You may want to adjust the cell coordinates and logic as needed.
 */
export function getFelder(sheetName = 'Sheet1'): Record<string, any> {
    return {
        firmennummer: readFirmennummer('B2'),
        personalnummer: readPersonalnummer('B3'),
        abrechnungsZeitraum: readAbrechnungsZeitraum(sheetName),
        kostenstelle: excel.readCell('C2', 'string'),
        lSatz: excel.readCell('D2', 'number'),
        anzStd: excel.readCell('E2', 'number'),
        kostenTr: excel.readCell('F2', 'string'),
        pSatz: excel.readCell('G2', 'number'),
        betrag: excel.readCell('H2', 'number'),
        abrechnungstag: excel.readCell('I2', 'string'),
        anzTage: excel.readCell('J2', 'number'),
    };
}

/**
 * Reads the Mandantennummer (client number) from a default cell.
 */
export function readMandantennummer(cellCoordinate = 'B2'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (!value) {
        ErrorList.getInstance().addError(
            `Die Mandantennummer wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return value;
}

/**
 * Reads the AbrechnungsZeitraum (billing period) from a default cell or sheet.
 */
export function readAbrechnungsZeitraum(sheetName = 'Sheet1', cellCoordinate = 'C1'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (!value) {
        ErrorList.getInstance().addError(
            `Der Abrechnungszeitraum wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return value;
}

/**
 * Reads the Kostenstelle (cost center) from a given cell.
 */
export function readKostenstelle(cellCoordinate = 'C2'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (!value) {
        ErrorList.getInstance().addError(
            `Die Kostenstelle wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return value;
}

/**
 * Reads the Lohnsatz (wage rate) from a given cell.
 */
export function readLSatz(cellCoordinate = 'D2'): number | undefined {
    const value = excel.readCell(cellCoordinate, 'number');
    if (value === undefined) {
        ErrorList.getInstance().addError(
            `Der Lohnsatz wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return value;
}

/**
 * Reads the Anzahl Stunden (number of hours) from a given cell.
 */
export function readAnzStd(cellCoordinate = 'E2'): number | undefined {
    const value = excel.readCell(cellCoordinate, 'number');
    if (value === undefined) {
        ErrorList.getInstance().addError(
            `Die Anzahl Stunden wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return value;
}

/**
 * Reads the Kostenträger (cost unit) from a given cell.
 */
export function readKostenTr(cellCoordinate = 'F2'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (!value) {
        ErrorList.getInstance().addError(
            `Der Kostenträger wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return value;
}

/**
 * Reads the Prozentsatz (percentage rate) from a given cell.
 */
export function readPSatz(cellCoordinate = 'G2'): number | undefined {
    const value = excel.readCell(cellCoordinate, 'number');
    if (value === undefined) {
        ErrorList.getInstance().addError(
            `Der Prozentsatz wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return value;
}

/**
 * Reads the Betrag (amount) from a given cell.
 */
export function readBetrag(cellCoordinate = 'H2'): number | undefined {
    const value = excel.readCell(cellCoordinate, 'number');
    if (value === undefined) {
        ErrorList.getInstance().addError(
            `Der Betrag wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return value;
}

/**
 * Reads the Abrechnungstag (billing day) from a given cell.
 */
export function readAbrechnungstag(cellCoordinate = 'I2'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (!value) {
        ErrorList.getInstance().addError(
            `Der Abrechnungstag wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return value;
}

/**
 * Reads the Anzahl Tage (number of days) from a given cell.
 */
export function readAnzTage(cellCoordinate = 'J2'): number | undefined {
    const value = excel.readCell(cellCoordinate, 'number');
    if (value === undefined) {
        ErrorList.getInstance().addError(
            `Die Anzahl Tage wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
    }
    return value;
}
