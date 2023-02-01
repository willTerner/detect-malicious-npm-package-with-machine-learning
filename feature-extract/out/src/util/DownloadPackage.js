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
import { opendir, mkdir, rm, readFile } from "fs/promises";
import { join, basename, dirname } from "path";
import { promisify } from "util";
import { exec } from 'child_process';
import { readdirSync } from "fs";
const asyncExec = promisify(exec);
export var ResolveDepressDir;
(function (ResolveDepressDir) {
    ResolveDepressDir[ResolveDepressDir["KNIFE"] = 0] = "KNIFE";
    ResolveDepressDir[ResolveDepressDir["NORMAL"] = 1] = "NORMAL";
})(ResolveDepressDir || (ResolveDepressDir = {}));
function resolveDepressDir(tgzPath, resolveDepressDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (resolveDepressDir === ResolveDepressDir.KNIFE) {
            return dirname(tgzPath);
        }
        if (resolveDepressDir === ResolveDepressDir.NORMAL) {
            const dotIndex = basename(tgzPath).lastIndexOf(".");
            let fileName = basename(tgzPath).substring(0, dotIndex);
            fileName = fileName.replace(/\/g/, "-");
            const returnDir = join(dirname(tgzPath), fileName);
            yield mkdir(returnDir);
            return returnDir;
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
function normalizeDir(targetDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = readdirSync(targetDir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory() && file.name.length > 5) {
                yield rm(join(targetDir, file.name), { force: true, recursive: true });
            }
        }
    });
}
function downloadPopularPackage() {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonContent = yield readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-10000.json", { encoding: "utf-8" });
        let packageArr = JSON.parse(jsonContent);
        packageArr = packageArr.slice(0, 2000);
        packageArr = packageArr.map(el => el.name);
        for (let packageName of packageArr) {
            try {
                const { stdout, stderr } = yield asyncExec(`cd /Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集 && npm pack ${packageName}`);
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
        normalizeDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集");
        //depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集", ResolveDepressDir.NORMAL);
    });
}
//# sourceMappingURL=DownloadPackage.js.map