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
import { getRootDirectory } from "./Util";
import { getPackageFeatureInfo } from "./PackageFeatureInfo";
import { malicious_csv_path, normal_csv_path, progress_json_path, should_use_console_log } from "./commons";
export var ResovlePackagePath;
(function (ResovlePackagePath) {
    ResovlePackagePath[ResovlePackagePath["By_Knife"] = 0] = "By_Knife";
    ResovlePackagePath[ResovlePackagePath["By_Normal1"] = 1] = "By_Normal1";
    ResovlePackagePath[ResovlePackagePath["By_Duan"] = 2] = "By_Duan";
    ResovlePackagePath[ResovlePackagePath["By_Normal2"] = 3] = "By_Normal2";
    ResovlePackagePath[ResovlePackagePath["By_Single_Package"] = 4] = "By_Single_Package";
    ResovlePackagePath[ResovlePackagePath["None"] = 5] = "None";
})(ResovlePackagePath || (ResovlePackagePath = {}));
function getDirectory(resolvePath) {
    if (resolvePath === ResovlePackagePath.By_Knife || resolvePath === ResovlePackagePath.By_Duan) {
        return malicious_csv_path;
    }
    if (resolvePath === ResovlePackagePath.By_Normal1 || resolvePath === ResovlePackagePath.By_Normal2) {
        return normal_csv_path;
    }
    if (resolvePath === ResovlePackagePath.By_Single_Package) {
        return join(getRootDirectory(), "output_feature");
    }
}
export function extractFeatureFromPackage(sourcePath, resolvepath, csvDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getPackageFeatureInfo(sourcePath);
        const fileName = result.packageName.replace(/\//g, "-");
        const csvPath = join(csvDir ? csvDir : getDirectory(resolvepath), fileName + ".csv");
        const featureArr = [];
        featureArr.push(["hasInstallScript", result.hasInstallScripts]);
        featureArr.push(["containIP", result.containIP]);
        featureArr.push(["useBase64Conversion", result.useBase64Conversion]);
        featureArr.push(["useBase64ConversionInInstallScript", result.useBase64ConversionInInstallScript]);
        featureArr.push(["containBase64StringInJSFile", result.containBase64StringInJSFile]);
        featureArr.push(["containBase64StringInInstallScript", result.containBase64StringInInstallScript]);
        featureArr.push(["containBytestring", result.containBytestring]);
        featureArr.push(["containDomainInJSFile", result.containDomainInJSFile]);
        featureArr.push(["containDomainInInstallScript", result.containDomainInInstallScript]);
        featureArr.push(["useBuffer", result.useBuffer]);
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
        featureArr.push(["accessCryptoAndZip", result.accessCryptoAndZip]);
        featureArr.push(["accessSensitiveAPI", result.accessSensitiveAPI]);
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
        return csvPath;
    });
}
export function extractFeatureFromDir(dirPath, resolvePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let oldPackageArr = JSON.parse(yield readFile(progress_json_path, { encoding: "utf-8" }));
        let counter = 0;
        const max_package_number = 2200;
        let idx_ = Math.floor(oldPackageArr.length / max_package_number) + 1;
        const progress_detail_path = join(getRootDirectory(), 'material', idx_ + ".csv");
        let newPackageArr = [];
        function resolveExtractByKnife(dirPath) {
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
                                yield resolveExtractByKnife(currentFilePath);
                            }
                            else if (dirent.isFile() && dirent.name.endsWith(".tgz")) {
                                const packagePath = join(dirPath, "package");
                                yield resolveExtract(packagePath);
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
        function resolveExtractByNormal(dirPath) {
            var _a, e_2, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const dir = yield opendir(dirPath);
                try {
                    for (var _d = true, dir_2 = __asyncValues(dir), dir_2_1; dir_2_1 = yield dir_2.next(), _a = dir_2_1.done, !_a;) {
                        _c = dir_2_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            if (dirent.isDirectory()) {
                                const packagePath = join(dirPath, dirent.name, "package");
                                yield resolveExtract(packagePath);
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = dir_2.return)) yield _b.call(dir_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        }
        function resolveExtract(packagePath) {
            return __awaiter(this, void 0, void 0, function* () {
                if (oldPackageArr.indexOf(packagePath) < 0) {
                    newPackageArr.push(packagePath);
                    should_use_console_log && console.log(chalk("???????????????" + counter + "??????"));
                    yield extractFeatureFromPackage(packagePath, resolvePath);
                    counter++;
                    if (counter === max_package_number) {
                        //  ??????progress.json
                        oldPackageArr = oldPackageArr.concat(newPackageArr);
                        const outputArr = newPackageArr.map(el => [el]);
                        yield writeFile(progress_json_path, JSON.stringify(oldPackageArr));
                        yield writeFile(progress_detail_path, stringify(outputArr));
                        process.exit(0);
                    }
                }
            });
        }
        if (resolvePath === ResovlePackagePath.By_Knife) {
            yield resolveExtractByKnife(dirPath);
        }
        if (resolvePath === ResovlePackagePath.By_Normal1 || resolvePath === ResovlePackagePath.By_Duan || resolvePath === ResovlePackagePath.By_Normal2) {
            yield resolveExtractByNormal(dirPath);
        }
    });
}
//# sourceMappingURL=ExtractFeature.js.map