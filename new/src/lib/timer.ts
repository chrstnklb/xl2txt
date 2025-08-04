// Legacy timer utility from old/src/server/utils/timer.js
// Refactored for TypeScript and ES module usage.

export class Timer {
    private static start: number;
    private static end: number;

    static startTimer() {
        Timer.start = new Date().getTime();
    }

    static endTimer(): number {
        Timer.end = new Date().getTime();
        return Timer.end - Timer.start;
    }
}
