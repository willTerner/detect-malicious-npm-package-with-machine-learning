var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { stat, readFile } from 'fs/promises';
import { dirname, join } from 'path';
export function getPackageSize(tgzPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileInfo = yield stat(tgzPath);
        return fileInfo.size;
    });
}
/**
 *
 * @param filePath package.json文件路径
 * @return [依赖的数量，开发依赖的数量，是否有安装脚本]
 */
export function getPackageJSONInfo(filePath) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            dependencyNumber: 0,
            devDependencyNumber: 0,
            hasInstallScripts: false,
            installCommand: [],
            executeJSFiles: [],
            packageName: "",
            version: "",
        };
        const fileContent = yield readFile(filePath, { encoding: "utf-8" });
        const metaData = JSON.parse(fileContent);
        result.dependencyNumber = Object.keys((metaData === null || metaData === void 0 ? void 0 : metaData.dependencies) || {}).length;
        result.devDependencyNumber = Object.keys((metaData === null || metaData === void 0 ? void 0 : metaData.devDependencies) || {}).length;
        result.hasInstallScripts = Boolean((_a = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _a === void 0 ? void 0 : _a.preinstall) || Boolean((_b = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _b === void 0 ? void 0 : _b.install) || Boolean((_c = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _c === void 0 ? void 0 : _c.postinstall);
        const executeJSFiles = [];
        result.packageName = metaData === null || metaData === void 0 ? void 0 : metaData.name;
        result.version = metaData === null || metaData === void 0 ? void 0 : metaData.version;
        const preinstall = (_d = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _d === void 0 ? void 0 : _d.preinstall;
        const install = (_e = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _e === void 0 ? void 0 : _e.install;
        const postinstall = (_f = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _f === void 0 ? void 0 : _f.postinstall;
        const parentDir = dirname(filePath);
        if (preinstall) {
            result.installCommand.push(preinstall);
            let jsFile = extractJSFilePath(preinstall);
            if (jsFile) {
                jsFile = join(parentDir, jsFile);
                executeJSFiles.push(jsFile);
            }
        }
        if (install) {
            result.installCommand.push(install);
            let jsFile = extractJSFilePath(install);
            if (jsFile) {
                jsFile = join(parentDir, jsFile);
                executeJSFiles.push(jsFile);
            }
        }
        if (postinstall) {
            result.installCommand.push(postinstall);
            let jsFile = extractJSFilePath(postinstall);
            if (jsFile) {
                jsFile = join(parentDir, jsFile);
                executeJSFiles.push(jsFile);
            }
        }
        result.executeJSFiles = executeJSFiles;
        return result;
    });
}
function extractJSFilePath(scriptContent) {
    const jsFileReg = /node\s+(.+\.js)/;
    const matchResult = scriptContent.match(jsFileReg);
    if (matchResult) {
        return matchResult[1];
    }
    return undefined;
}
//# sourceMappingURL=PackageJSONInfo.js.map