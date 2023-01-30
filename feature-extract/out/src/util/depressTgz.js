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
import { opendir, readdir, rm } from "fs/promises";
import { join, dirname } from "path";
import { promisify } from "util";
import { exec } from 'child_process';
const asyncExec = promisify(exec);
function depressPackageAndSetDir(targetDir) {
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
                    const { stdout, stderr } = yield asyncExec(`tar -xvf ${tgzPath} -C ${dirname(tgzPath)}`);
                    resolve({ stdout, stderr });
                }), 0);
            });
            console.log(stdout, stderr);
        }
    });
}
function normalizeDir(targetDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield readdir(targetDir, {
            withFileTypes: true
        });
        for (const file of files) {
            const filePath = join(targetDir, file.name);
            if (file.isFile() && (file.name === "analyze-result.json" || file.name === "changes-feature.csv")) {
                yield rm(filePath);
            }
            else if (file.isDirectory()) {
                yield normalizeDir(filePath);
            }
        }
    });
}
//depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife");
normalizeDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集/补充数据集");
//# sourceMappingURL=depressTgz.js.map