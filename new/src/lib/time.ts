// Legacy time utilities from old/src/server/utils/time.js
// Refactored for TypeScript and ES module usage.

export function getActualTimeStampHHMMSS(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}-${minutes}-${seconds}`;
}

export function getActualTimeStampYYYYMMDDhhmmss(): string {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}-` + getActualTimeStampHHMMSS();
}
