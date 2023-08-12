const { readCell } = require('./excelUtils');

describe('readCell', () => {

    test('should return undefined if the cell is empty', () => {
        const result = readCell('A1', 'string');
        expect(result).toBeUndefined();
    });

    test('should return the value of cell A1 as a string', () => {
        const result = readCell('A3', 'string');
        expect(result).toBe('Zeitraum');
    });

    test('should return the value of cell B2 as a number', () => {
        const result = readCell('A15', 'number');
        expect(result).toBe(54);
    });

    test('should return the value of cell C3 as a date', () => {
        const result = readCell('B3', 'date');
        const date = new Date(result.y, result.m, result.d);
        expect(date).toEqual(new Date(2023, 7, 1));
    });
});