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
import { opendir, access, mkdir, readFile, unlink } from "fs/promises";
import { join, basename, dirname } from "path";
import { readdirSync } from "fs";
import { duan_path, normal_path } from "../commons";
import chalk from "chalk";
import { asyncExec } from "../Util";
export var ResolveDepressDir;
(function (ResolveDepressDir) {
    ResolveDepressDir[ResolveDepressDir["KNIFE"] = 0] = "KNIFE";
    ResolveDepressDir[ResolveDepressDir["NORMAL"] = 1] = "NORMAL";
    ResolveDepressDir[ResolveDepressDir["DUAN"] = 2] = "DUAN";
    ResolveDepressDir[ResolveDepressDir["TEST_NORMAL"] = 3] = "TEST_NORMAL";
    ResolveDepressDir[ResolveDepressDir["TEST_SET"] = 4] = "TEST_SET";
})(ResolveDepressDir || (ResolveDepressDir = {}));
function resolveDepressDir(tgzPath, resolveDepressDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (resolveDepressDir === ResolveDepressDir.KNIFE) {
            return dirname(tgzPath);
        }
        if (resolveDepressDir === ResolveDepressDir.NORMAL || resolveDepressDir === ResolveDepressDir.TEST_NORMAL || resolveDepressDir === ResolveDepressDir.TEST_SET) {
            const dotIndex = basename(tgzPath).lastIndexOf(".");
            let fileName = basename(tgzPath).substring(0, dotIndex);
            fileName = fileName.replace(/\//g, "-");
            const returnDir = join(dirname(tgzPath), fileName);
            try {
                yield access(returnDir);
                return returnDir;
            }
            catch (error) {
                yield mkdir(returnDir);
                return returnDir;
            }
        }
        if (resolveDepressDir === ResolveDepressDir.DUAN) {
            const dotIndex = basename(tgzPath).lastIndexOf(".");
            let fileName = basename(tgzPath).substring(0, dotIndex);
            fileName = fileName.replace(/\//g, "-");
            const returnDir = join(duan_path, fileName);
            try {
                yield access(returnDir);
                return returnDir;
            }
            catch (error) {
                yield mkdir(returnDir);
                return returnDir;
            }
        }
    });
}
export function depressPackageAndSetDir(targetDir, resolveDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const tgzPathArr = [];
        function resolveDepress(targetDir) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const dir = yield opendir(targetDir);
                try {
                    for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
                        _c = dir_1_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            if (dirent.isDirectory()) {
                                yield resolveDepress(join(targetDir, dirent.name));
                            }
                            else {
                                const dotIndex = dirent.name.lastIndexOf(".");
                                if (dotIndex >= 0 && dirent.name.substring(dotIndex) === ".tgz") {
                                    tgzPathArr.push(join(targetDir, dirent.name));
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
        yield resolveDepress(targetDir);
        //解压
        for (const tgzPath of tgzPathArr) {
            const { stdout, stderr } = yield new Promise((resolve) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const outputDir = yield resolveDepressDir(tgzPath, resolveDir);
                    const { stdout, stderr } = yield asyncExec(`tar -xvf ${tgzPath} -C ${outputDir}`);
                    resolve({ stdout, stderr });
                }), 0);
            });
            console.log(stdout, stderr);
        }
    });
}
export function depressSinglePackage(tgzPath, depressDir) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield asyncExec(`tar -xvf ${tgzPath} -C ${depressDir}`);
    });
}
export function depressPackage(tgzPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputDir = yield resolveDepressDir(tgzPath, ResolveDepressDir.NORMAL);
        const { stdout, stderr } = yield depressSinglePackage(tgzPath, outputDir);
        console.log(stdout, stderr);
        console.log(chalk.red("package depress directory is " + outputDir));
        return outputDir;
    });
}
function normalizeDir(targetDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = readdirSync(targetDir);
        for (const file of files) {
            if (file.endsWith(".csv")) {
                yield unlink(join(targetDir, file));
            }
        }
    });
}
export function downloadSinglePackage(packageName, saveDir) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield asyncExec(`cd ${saveDir} && npm pack ${packageName}`);
    });
}
function downloadPopularPackage() {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonContent = yield readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-10000.json", { encoding: "utf-8" });
        const saveDir = "/Users/huchaoqun/Desktop/code/school-course/毕设/测试数据集/normal";
        let packageArr = JSON.parse(jsonContent);
        packageArr = packageArr.slice(2000, 4000);
        packageArr = packageArr.map(el => el.name);
        for (let packageName of packageArr) {
            try {
                const { stdout, stderr } = yield downloadSinglePackage(packageName, saveDir);
                console.log(stdout, stderr);
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
//depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife");
//normalizeDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集/补充数据集");
export function doSomething() {
    return __awaiter(this, void 0, void 0, function* () {
        yield normalizeDir(normal_path);
        //depressPackageAndSetDir(test_normal_path, ResolveDepressDir.TEST_NORMAL);
        // downloadPopularPackage();
    });
}
//# sourceMappingURL=DownloadPackage.js.map