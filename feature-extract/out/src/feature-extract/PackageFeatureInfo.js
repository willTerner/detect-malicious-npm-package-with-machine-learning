var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { opendir, readFile, stat } from 'fs/promises';
import { getPackageJSONInfo } from './PackageJSONInfo';
import { basename, join } from 'path';
import { getDomainPattern, IP_Pattern, Network_Command_Pattern, SensitiveStringPattern } from './Patterns';
import { getAllInstallScripts } from './GetInstallScripts';
import { scanJSFileByAST } from './AST';
import { matchUseRegExp } from './RegExp';
import chalk from 'chalk';
import { should_use_console_log } from '../constants';
import { PositionRecorder } from './PositionRecorder';
import { setPositionRecorder } from '../config';
const ALLOWED_MAX_JS_SIZE = 2 * 1024 * 1024;
/**
 *
 * @param dirPath 源码包（目录下有package.json文件）的路径
 * @param tgzPath 压缩包的路径
 */
export function getPackageFeatureInfo(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const positionRecorder = new PositionRecorder();
        const result = {
            hasInstallScripts: false,
            containIP: false,
            useBase64Conversion: false,
            useBase64ConversionInInstallScript: false,
            containBase64StringInJSFile: false,
            containBase64StringInInstallScript: false,
            containBytestring: false,
            containDomainInJSFile: false,
            containDomainInInstallScript: false,
            useBuffer: false,
            useEval: false,
            requireChildProcessInJSFile: false,
            requireChildProcessInInstallScript: false,
            accessFSInJSFile: false,
            accessFSInInstallScript: false,
            accessNetworkInJSFile: false,
            accessNetworkInInstallScript: false,
            accessProcessEnvInJSFile: false,
            accessProcessEnvInInstallScript: false,
            accessCryptoAndZip: false,
            accessSensitiveAPI: false,
            containSuspiciousString: false,
            installCommand: [],
            executeJSFiles: [],
            packageName: '',
            version: ''
        };
        const packageJSONPath = join(dirPath, 'package.json');
        const packageJSONInfo = yield getPackageJSONInfo(packageJSONPath);
        Object.assign(result, packageJSONInfo);
        // result.editDistance = await minEditDistance(packageJSONInfo.packageName);
        // result.packageSize = getDirectorySizeInBytes(dirPath);
        if (packageJSONInfo.hasInstallScripts) {
            positionRecorder.addRecord('hasInstallScripts', {
                filePath: packageJSONPath,
                content: packageJSONInfo.installCommand[0]
            });
        }
        // 分析install hook command
        for (const scriptContent of packageJSONInfo.installCommand) {
            {
                const matchResult = scriptContent.match(IP_Pattern);
                if (matchResult != null) {
                    result.containIP = true;
                    positionRecorder.addRecord('containIP', { filePath: packageJSONPath, content: scriptContent });
                }
            }
            {
                const matchResult = scriptContent.match(getDomainPattern());
                if (matchResult != null) {
                    result.containDomainInInstallScript = true;
                    positionRecorder.addRecord('containDomainInInstallScript', {
                        filePath: packageJSONPath,
                        content: scriptContent
                    });
                }
            }
            {
                const matchResult = scriptContent.match(Network_Command_Pattern);
                if (matchResult != null) {
                    result.accessNetworkInInstallScript = true;
                    positionRecorder.addRecord('accessNetworkInInstallScript', {
                        filePath: packageJSONPath,
                        content: scriptContent
                    });
                }
            }
            {
                const matchResult = scriptContent.match(SensitiveStringPattern);
                if (matchResult != null) {
                    result.containSuspiciousString = true;
                    positionRecorder.addRecord('containSuspiciousString', {
                        filePath: packageJSONPath,
                        content: scriptContent
                    });
                }
            }
        }
        // 分析install hook js files
        yield getAllInstallScripts(result.executeJSFiles);
        function traverseDir(dirPath) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                if (basename(dirPath) === 'node_modules') {
                    return;
                }
                const dir = yield opendir(dirPath);
                try {
                    for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
                        _c = dir_1_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            const jsFilePath = join(dirPath, dirent.name);
                            const isInstallScriptFile = result.executeJSFiles.findIndex(filePath => filePath === jsFilePath) >= 0;
                            if (dirent.isFile() && (dirent.name.endsWith('.js') || isInstallScriptFile)) {
                                yield new Promise((resolve) => {
                                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                        const targetJSFilePath = join(dirPath, dirent.name);
                                        const jsFileContent = yield readFile(targetJSFilePath, { encoding: 'utf-8' });
                                        const fileInfo = yield stat(targetJSFilePath);
                                        should_use_console_log && console.log(chalk.blue('现在分析的js文件路径是') + chalk.red(targetJSFilePath) + '  文件大小为' + fileInfo.size);
                                        if (fileInfo.size <= ALLOWED_MAX_JS_SIZE) {
                                            yield scanJSFileByAST(jsFileContent, result, isInstallScriptFile, targetJSFilePath, positionRecorder);
                                            matchUseRegExp(jsFileContent, result, positionRecorder, targetJSFilePath);
                                        }
                                        resolve(true);
                                    }), 0);
                                });
                            }
                            else if (dirent.isDirectory()) {
                                yield traverseDir(join(dirPath, dirent.name));
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = dir_1.return)) yield _b.call(dir_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        }
        yield traverseDir(dirPath);
        setPositionRecorder(positionRecorder);
        return result;
    });
}
//# sourceMappingURL=PackageFeatureInfo.js.map