// Legacy server logs utilities from old/src/server/utils/logs.js
// Refactored for TypeScript and ES module usage.

export function logServerRouteUpload(describer: string, value: string) {
    logServerRoute(`upload:${describer}:\n\t${value}`);
}

export function logServerRouteDownload(describer: string, value: string) {
    logServerRoute(`download:${describer}:\n\t${value}`);
}

export function logServerRoute(route: string) {
    logServer(`route:${route}`);
}

export function logServer(message: string) {
    // new line in console.log
    console.log(`server:${message}`);
}

export function logAttribute(attribute: string, value: string) {
    logServer(`attribute:${attribute}:\n\t${value}`);
}

export function logDeletedFile(filename: string) {
    console.log(`Deleted file:\n\t${filename}`);
}

export function logCreatedFile(filename: string) {
    console.log(`Created file:\n\t${filename}`);
}
