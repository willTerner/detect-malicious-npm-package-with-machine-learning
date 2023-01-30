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
import { opendir, readFile, stat } from "fs/promises";
import { getPackageJSONInfo } from "./PackageJSONInfo";
import { basename, join } from "path";
import { minEditDistance } from "./EditDistance";
import { getDomainPattern, IP_Pattern, Network_Command_Pattern, SensitiveStringPattern } from "./Patterns";
import { getAllInstallScripts } from "./GetInstallScripts";
import { scanJSFileByAST } from "./ASTUtil";
import { matchUseRegExp } from "./RegExpUtil";
import chalk from "chalk";
import { writeFile } from "fs/promises";
import { stringify } from "csv-stringify/sync";
import { fork } from "child_process";
import { IGNORE_JS_FILES } from "./IgnoreJSFiles";
import { getDirectorySizeInBytes } from "./FileUtil";
const BABEL_STUCK_FILES_PATH = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/babel-struck-files.csv";
const ALLOWED_MAX_JS_SIZE = 2 * 1024 * 1024;
function parseJSAsync(code, featureSet, isInstallScript, targetJSFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const childProcess = fork("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/out/src/ProcessSingleFileProces.js");
            const sendData = {
                code,
                featureSet,
                isInstallScript,
                targetJSFilePath
            };
            childProcess.send(sendData);
            const MAX_WAIT_TIME = 2000;
            const start_time_stamp = Date.now();
            let timer_id = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const time_diff = Date.now() - start_time_stamp;
                console.log(chalk.green("时间差为" + time_diff));
                if (time_diff >= MAX_WAIT_TIME) {
                    // babel处理代码卡住，停止转义，并记录在文件中
                    yield writeFile(BABEL_STUCK_FILES_PATH, stringify([[targetJSFilePath]]));
                    childProcess.kill();
                    console.log(chalk.red("调用terminate"));
                    reject(new Error("babel struck at file" + targetJSFilePath));
                }
            }), 10);
            childProcess.on('message', resolve);
            childProcess.on('error', reject);
            childProcess.on('exit', (code) => {
                console.log("babel 处理进程退出信号为" + code);
                clearInterval(timer_id);
            });
        }));
    });
}
;
/**
 *
 * @param dirPath 源码包（目录下有package.json文件）的路径
 * @param tgzPath 压缩包的路径
 */
export function getPackageFeatureInfo(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = {
            editDistance: 0,
            averageBracketNumber: 0,
            packageSize: 0,
            dependencyNumber: 0,
            devDependencyNumber: 0,
            numberOfJSFiles: 0,
            totalBracketsNumber: 0,
            hasInstallScripts: false,
            containIP: false,
            useBase64Conversion: false,
            containBase64String: false,
            createBufferFromASCII: false,
            containBytestring: false,
            containDomain: false,
            useBufferFrom: false,
            useEval: false,
            requireChildProcessInJSFile: false,
            requireChildProcessInInstallScript: false,
            accessFSInJSFile: false,
            accessFSInInstallScript: false,
            accessNetworkInJSFile: false,
            accessNetworkInInstallScript: false,
            accessProcessEnvInJSFile: false,
            accessProcessEnvInInstallScript: false,
            useCrpytoAndZip: false,
            accessSensitiveAPI: false,
            containSuspiciousString: false,
            installCommand: [],
            executeJSFiles: [],
            packageName: "",
            version: "",
        };
        const packageJSONPath = join(dirPath, "package.json");
        const packageJSONInfo = yield getPackageJSONInfo(packageJSONPath);
        Object.assign(result, packageJSONInfo);
        result.editDistance = yield minEditDistance(packageJSONInfo.packageName);
        result.packageSize = getDirectorySizeInBytes(dirPath);
        // 分析install hook command
        for (const scriptContent of packageJSONInfo.installCommand) {
            {
                const matchResult = scriptContent.match(IP_Pattern);
                if (matchResult) {
                    result.containIP = true;
                }
            }
            {
                const matchResult = scriptContent.match(getDomainPattern());
                if (matchResult) {
                    result.containDomain = true;
                }
            }
            {
                const matchResult = scriptContent.match(Network_Command_Pattern);
                if (matchResult) {
                    result.accessNetworkInInstallScript = true;
                }
            }
            {
                const matchResult = scriptContent.match(SensitiveStringPattern);
                if (matchResult) {
                    result.containSuspiciousString = true;
                }
            }
        }
        // 分析install hook js files
        yield getAllInstallScripts(result.executeJSFiles);
        function traverseDir(dirPath) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                if (basename(dirPath) === "node_modules") {
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
                            if (dirent.isFile() && (dirent.name.endsWith(".js") || isInstallScriptFile)) {
                                result.numberOfJSFiles++;
                                yield new Promise((resolve) => {
                                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                        let targetJSFilePath = join(dirPath, dirent.name);
                                        let jsFileContent = yield readFile(targetJSFilePath, { encoding: "utf-8" });
                                        const fileInfo = yield stat(targetJSFilePath);
                                        console.log(chalk.blue("现在分析的js文件路径是") + chalk.red(targetJSFilePath) + "  文件大小为" + fileInfo.size);
                                        if (fileInfo.size <= ALLOWED_MAX_JS_SIZE && IGNORE_JS_FILES.indexOf(targetJSFilePath) < 0) {
                                            yield scanJSFileByAST(jsFileContent, result, isInstallScriptFile, targetJSFilePath);
                                            matchUseRegExp(jsFileContent, result);
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
        result.averageBracketNumber = result.totalBracketsNumber / result.numberOfJSFiles;
        return result;
    });
}
//# sourceMappingURL=PackageFeatureInfo.js.map