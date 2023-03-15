var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exec } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
import path from 'path';
import { readFile, writeFile } from "node:fs/promises";
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
export function getDirectorySizeInBytes(dir) {
    let totalSize = 0;
    function walk(currentPath) {
        const files = fs.readdirSync(currentPath);
        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                totalSize += stats.size;
            }
            else if (stats.isDirectory()) {
                walk(filePath);
            }
        }
    }
    walk(dir);
    return totalSize;
}
export function getRootDirectory() {
    let currentFilePath = process.argv[1];
    let projectRootPath = currentFilePath;
    while (!fs.existsSync(path.join(projectRootPath, 'package.json'))) {
        projectRootPath = path.dirname(projectRootPath);
    }
    return projectRootPath;
}
export const asyncExec = promisify(exec);
export function getCSVFromFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return parse(yield readFile(filePath, { encoding: 'utf-8' }));
    });
}
export function writeCSVFile(filePath, arr) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield writeFile(filePath, stringify(arr));
    });
}
//# sourceMappingURL=Util.js.map