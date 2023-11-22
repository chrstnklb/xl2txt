const time = require('./time');

describe('Time module', () => {
    test('getActualTimeStampHHMMSS returns a string', () => {
        expect(typeof time.getActualTimeStampHHMMSS()).toBe('string');
    });

    test('getActualTimeStampHHMMSS returns a string of length 8', () => {
        expect(time.getActualTimeStampHHMMSS().length).toBe(8);
    });

    test('getActualTimeStampYYYYMMDDhhmmss returns a string', () => {
        expect(typeof time.getActualTimeStampYYYYMMDDhhmmss()).toBe('string');
    });

    test('getActualTimeStampYYYYMMDDhhmmss returns a string of length 19', () => {
        expect(time.getActualTimeStampYYYYMMDDhhmmss().length).toBe(19);
    });
});