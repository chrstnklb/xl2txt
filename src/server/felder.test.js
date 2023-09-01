const {
    readFirmennummer,
    readPersonalnummer,
    readLohnart,
    readAbrechnungsZeitraum
 } = require('./contentReader');

describe('readCell', () => {

    test('calling readFirmennummer, the result should be 117310', () => {
        const result = readFirmennummer();
        expect(result.toString()).toBe("117310");
    });

    test('calling readFirmennummer wrong, the result should be undefined', () => {
        const result = readFirmennummer('A1');
        expect(result).toBeUndefined();
    });

    test('calling readPersonalnummer, the result should be 000008', () => {
        const result = readPersonalnummer();
        expect(result.toString()).toBe("000008");
    });

    test('calling readPersonalnummer wrong, the result should be undefined', () => {
        const result = readPersonalnummer('A1');
        expect(result).toBeUndefined();
    });

    test('calling readLohnart, the result should be 2000', () => {
        const result = readLohnart();
        expect(result.toString()).toBe("2000");
    });

    test('calling readLohnart wrong, the result should be undefined', () => {
        const result = readLohnart('A1');
        expect(result).toBeUndefined();
    });

    test('calling readAbrechnungsZeitraum, the result should be 01.07.2023', () => {
        const result = readAbrechnungsZeitraum();
        expect(result.toString()).toBe("01.07.2023");
    });

    test('calling readAbrechnungsZeitraum wrong, the result should be undefined', () => {
        const result = readAbrechnungsZeitraum('A1');
        expect(result).toBeUndefined();
    });
});