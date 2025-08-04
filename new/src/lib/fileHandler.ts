import path from 'path';
import fs from 'fs';
import * as time from './time';
import * as logs from './server-logs';

export const TARGET_FILENAME = 'Imp_lbw.txt';

export function writeToFile(folder: string, filename: string, data: string): string {
    writeDirectory(folder);
    const filepath = path.join(folder, filename);
    fs.writeFileSync(filepath, data);
    logs.logCreatedFile?.(filepath);
    return filepath;
}

export function writeDirectory(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
}

export async function deleteFile(filename: string): Promise<void> {
    await fs.promises.unlink(filename);
    logs.logDeletedFile?.(filename);
}

export async function deleteDirectoryOfFile(dirPath: string): Promise<void> {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
}

export async function deleteFiles(folder: string): Promise<void> {
    const files = await fs.promises.readdir(folder);
    for (const file of files) {
        await deleteFile(path.join(folder, file));
    }
}

export function directoryExists(dirPath: string): boolean {
    return fs.existsSync(dirPath);
}

export function writeTxtFile(content: string): string {
    const timestamp = time.getActualTimeStampYYYYMMDDhhmmss();
    const folder = path.join(__dirname, '../../exchange/download/' + timestamp);
    return writeToFile(folder, TARGET_FILENAME, content);
}

export function deleteUploadedFiles(): void {
    deleteFiles(path.join(__dirname, '../../exchange/upload/'));
}
