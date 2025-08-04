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
    const value = excel.readCell(cellCoordinate, 'number');
    if (typeof value !== 'number') {
        ErrorList.getInstance().addError(
            `Die Mandantennummer wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer oder kein gültiger Wert!`
        );
        return undefined;
    }
    return value;
}
export function readPersonalnummer(cellCoordinate: string): string | undefined {
    const personalnummer = excel.readCell(cellCoordinate, 'string');
    if (typeof personalnummer !== 'string') {
        ErrorList.getInstance().addError(
            `Die Personalnummer wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return undefined;
    }
    return personalnummer;
}

/**
 * Returns an object with all relevant fields extracted from the Excel sheet.
 * You may want to adjust the cell coordinates and logic as needed.
 */
export interface Felder {
    firmennummer: number | undefined;
    personalnummer: string | undefined;
    abrechnungsZeitraum: string;
    kostenstelle: string | null;
    lSatz: number | null;
    anzStd: number | null;
    kostenTr: string | null;
    pSatz: number | null;
    betrag: number | null;
    abrechnungstag: string | null;
    anzTage: number | null;
}

export function getFelder(sheetName: string | undefined): Felder {
    return {
        firmennummer: readFirmennummer('B2'),
        personalnummer: readPersonalnummer('B3'),
        abrechnungsZeitraum: readAbrechnungsZeitraum(sheetName),
        kostenstelle: typeof excel.readCell('C2', 'string') === 'string' ? excel.readCell('C2', 'string') as string : null,
        lSatz: typeof excel.readCell('D2', 'number') === 'number' ? excel.readCell('D2', 'number') as number : null,
        anzStd: typeof excel.readCell('E2', 'number') === 'number' ? excel.readCell('E2', 'number') as number : null,
        kostenTr: typeof excel.readCell('F2', 'string') === 'string' ? excel.readCell('F2', 'string') as string : null,
        pSatz: typeof excel.readCell('G2', 'number') === 'number' ? excel.readCell('G2', 'number') as number : null,
        betrag: typeof excel.readCell('H2', 'number') === 'number' ? excel.readCell('H2', 'number') as number : null,
        abrechnungstag: typeof excel.readCell('I2', 'string') === 'string' ? excel.readCell('I2', 'string') as string : null,
        anzTage: typeof excel.readCell('J2', 'number') === 'number' ? excel.readCell('J2', 'number') as number : null,
    };
}

/**
 * Reads the Mandantennummer (client number) from a default cell.
 */
export function readMandantennummer(cellCoordinate = 'B2'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (typeof value !== 'string' || !value) {
        ErrorList.getInstance().addError(
            `Die Mandantennummer wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return String(value);
}

/**
 * Reads the AbrechnungsZeitraum (billing period) from a default cell or sheet.
 */
export function readAbrechnungsZeitraum(cellCoordinate = 'C1'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (!value) {
        ErrorList.getInstance().addError(
            `Der Abrechnungszeitraum wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    return typeof value === 'number' ? String(value) : '';
}

/**
 * Reads the Kostenstelle (cost center) from a given cell.
 */
export function readKostenstelle(cellCoordinate = 'C2'): string {
    const value = excel.readCell(cellCoordinate, 'string');
    if (value === null || value === undefined || value === '') {
        ErrorList.getInstance().addError(
            `Die Kostenstelle wurde erwartet. Doch die Zelle '${cellCoordinate}' ist leer!`
        );
        return '';
    }
    // Always return a string, regardless of the type
    return String(value);
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
    return typeof value === 'number' ? value : undefined;
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
    return typeof value === 'number' ? value : undefined;
    
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
    return typeof value === 'string' ? value : value ? String(value) : '';
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
    return typeof value === 'number' ? value : undefined;
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
    return typeof value === 'number' ? value : undefined;
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
    return typeof value === 'string' ? value : value ? String(value) : '';
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
    return typeof value === 'number' ? value : undefined;

}
