// Legacy logging logic from old/src/client/logs.js
// Refactored for Next.js and TypeScript.

export function clientLog(message: string, textColor: string = 'white') {
    // eslint-disable-next-line no-console
    console.log(`%c client :: ${message}`, `color: ${textColor}`);
}
