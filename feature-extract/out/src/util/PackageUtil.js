var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { accessSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { asyncExec, getFileName } from ".";
import { isEnglish } from "../config";
import { Logger } from '../Logger';
export function depressSinglePackage(tgzPath, depressDir) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield asyncExec(`tar -xvf ${tgzPath} -C ${depressDir}`);
    });
}
function getAllTgzPath(dirPath) {
    const result = [];
    function resolve(dirPath) {
        const files = readdirSync(dirPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile() && file.name.endsWith('.tgz')) {
                result.push(join(dirPath, file.name));
            }
            if (file.isDirectory()) {
                resolve(join(dirPath, file.name));
            }
        }
    }
    resolve(dirPath);
    return result;
}
function getDepressErrorMessage(tgzPath) {
    if (isEnglish()) {
        return `error happened when depressing ${tgzPath}`;
    }
    return `在解压${this.tgzPath}的过程中发生错误`;
}
function getDepressInfoMessage(tgzPath, depressPath) {
    if (isEnglish()) {
        return `depress ${tgzPath} to ${depressPath}`;
    }
    return `解压${tgzPath}至${depressPath}`;
}
/**
 * 找出dirPath中所有的npm压缩包，解压至dirPath/packageName下
 * @param dirPath 包含npm包压缩包的目录
 */
export function depressPackages(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const tgzPaths = getAllTgzPath(dirPath);
        for (const tgzPath of tgzPaths) {
            const depressDir = join(dirPath, getFileName(tgzPath));
            try {
                accessSync(depressDir);
            }
            catch (e) {
                mkdirSync(depressDir);
            }
            const { stdout, stderr } = yield depressSinglePackage(tgzPath, depressDir);
            Logger.info(stdout + stderr);
            // Logger.info(getDepressInfoMessage(tgzPath, depressDir));
        }
    });
}
export function downloadSinglePackage(packageName, saveDir) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield asyncExec(`cd ${saveDir} && npm pack ${packageName}`);
    });
}
//# sourceMappingURL=PackageUtil.js.map