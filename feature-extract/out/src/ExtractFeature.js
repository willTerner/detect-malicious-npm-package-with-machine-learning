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
import chalk from "chalk";
import { stringify } from "csv-stringify/sync";
import { writeFile, opendir, readFile } from "fs/promises";
import { join } from "path";
import { getPackageFeatureInfo } from "./PackageFeatureInfo";
const malicious_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious";
const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal";
const progress_json_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/progress.json";
export function extractFeatureFromPackage(sourcePath, isMaliciousPackage) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getPackageFeatureInfo(sourcePath);
        const csvPath = join(isMaliciousPackage ? malicious_path : normal_path, result.packageName + ".csv");
        const featureArr = [];
        featureArr.push(["editDistance", result.editDistance]);
        featureArr.push(["averageBracket", result.averageBracketNumber]);
        featureArr.push(["packageSize", result.packageSize]);
        featureArr.push(["dependencyNumber", result.dependencyNumber]);
        featureArr.push(["devDependencyNumber", result.devDependencyNumber]);
        featureArr.push(["jsFileNumber", result.numberOfJSFiles]);
        featureArr.push(["bracketNumber", result.totalBracketsNumber]);
        featureArr.push(["hasInstallScript", result.hasInstallScripts]);
        featureArr.push(["containIP", result.containIP]);
        featureArr.push(["useBase64Conversion", result.useBase64Conversion]);
        featureArr.push(["containBase64String", result.containBase64String]);
        featureArr.push(["createBufferFromASCII", result.createBufferFromASCII]);
        featureArr.push(["containBytestring", result.containBytestring]);
        featureArr.push(["containDomain", result.containDomain]);
        featureArr.push(["useBufferFrom", result.useBufferFrom]);
        featureArr.push(["useEval", result.useEval]);
        featureArr.push(["requireChildProcessInJSFile", result.requireChildProcessInJSFile]);
        featureArr.push(["requireChildProcessInInstallScript", result.requireChildProcessInInstallScript]);
        featureArr.push(["accessFSInJSFile", result.accessFSInJSFile]);
        featureArr.push(["accessFSInInstallScript", result.accessFSInInstallScript]);
        featureArr.push(["accessNetworkInJSFile", result.accessNetworkInJSFile]);
        featureArr.push(["accessNetworkInInstallScript", result.accessNetworkInInstallScript]);
        featureArr.push(["accessProcessEnvInJSFile", result.accessProcessEnvInJSFile]);
        featureArr.push(["accessProcessEnvInInstallScript", result.accessProcessEnvInInstallScript]);
        featureArr.push(["containSuspicousString", result.containSuspiciousString]);
        yield new Promise(resolve => {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield writeFile(csvPath, stringify(featureArr, {
                    cast: {
                        "boolean": function (value) {
                            if (value) {
                                return "true";
                            }
                            return "false";
                        }
                    }
                }));
                resolve(true);
            }));
        });
    });
}
export function extractFeatureFromDir(dirPath, isMaliciousPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let oldPackageArr = JSON.parse(yield readFile(progress_json_path, { encoding: "utf-8" }));
        let counter = 0;
        const max_package_number = 150;
        let idx_ = Math.floor(oldPackageArr.length / max_package_number) + 1;
        const progress_detail_path = join("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material", idx_ + ".csv");
        let newPackageArr = [];
        function resolveExtract(dirPath) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const dir = yield opendir(dirPath);
                try {
                    for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
                        _c = dir_1_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            const currentFilePath = join(dirPath, dirent.name);
                            if (dirent.isDirectory()) {
                                yield resolveExtract(currentFilePath);
                            }
                            else if (dirent.isFile() && dirent.name.endsWith(".tgz")) {
                                const packagePath = join(dirPath, "package");
                                if (oldPackageArr.indexOf(packagePath) < 0) {
                                    newPackageArr.push(packagePath);
                                    console.log(chalk("现在分析了" + counter + "个包"));
                                    yield extractFeatureFromPackage(packagePath, isMaliciousPath);
                                    counter++;
                                    if (counter === max_package_number) {
                                        //  更新progress.json
                                        oldPackageArr = oldPackageArr.concat(newPackageArr);
                                        const outputArr = newPackageArr.map(el => [el]);
                                        yield writeFile(progress_json_path, JSON.stringify(oldPackageArr));
                                        yield writeFile(progress_detail_path, stringify(outputArr));
                                        process.exit(0);
                                    }
                                }
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
        yield resolveExtract(dirPath);
    });
}
//# sourceMappingURL=ExtractFeature.js.map