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
import { opendir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { parse } from 'csv-parse/sync';
import { readdirSync } from "fs";
import { rm } from "fs/promises";
import { knife_csv_path } from "../Paths";
const ignore_prop_names = ["editDistance", "packageSize", "packageName", "version", "installCommand", "executeJSFiles"];
const unique_features = [];
export function isDuplicatePackage(featureSet) {
    if (unique_features.findIndex((singleFeature) => {
        for (const key of Object.keys(featureSet)) {
            if (!ignore_prop_names.includes(key)) {
                if (singleFeature[key] !== featureSet[key]) {
                    return false;
                }
            }
        }
        return true;
    }) >= 0) {
        return true;
    }
    unique_features.push(featureSet);
    return false;
}
const ignore_feature_names = ["packageSize", "editDistance"];
const uniques = [];
const file_names = [];
export function removeDuplicatePackage(targetDir, saveDir) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const dir = yield opendir(targetDir);
        try {
            for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
                _c = dir_1_1.value;
                _d = false;
                try {
                    const dirent = _c;
                    const csvPath = join(targetDir, dirent.name);
                    const csvContent = yield readFile(csvPath, { encoding: "utf-8" });
                    const featureArr = yield parse(csvContent);
                    if (dirent.name === "@azure-tests-perf-storage-file-share.csv") {
                        debugger;
                    }
                    if (uniques.findIndex((feature, idx) => {
                        for (let i = 0; i < feature.length; i++) {
                            if (!ignore_feature_names.includes(feature[i][0])) {
                                if (feature[i][1] !== featureArr[i][1]) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }) < 0) {
                        // 不重复
                        uniques.push(featureArr);
                        file_names.push(dirent.name);
                        const savePath = join(saveDir, dirent.name);
                        yield writeFile(savePath, csvContent);
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
export function removeDuplicatePackageForDuan(targetDir) {
    var _a, e_2, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let dir = yield opendir(knife_csv_path);
        const csvNameArr = [];
        try {
            for (var _d = true, dir_2 = __asyncValues(dir), dir_2_1; dir_2_1 = yield dir_2.next(), _a = dir_2_1.done, !_a;) {
                _c = dir_2_1.value;
                _d = false;
                try {
                    const dirent = _c;
                    if (dirent.isFile()) {
                        const dotIndex = dirent.name.lastIndexOf(".");
                        csvNameArr.push(dirent.name.substring(0, dotIndex));
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
        const files = readdirSync(targetDir, { withFileTypes: true });
        for (const dirent of files) {
            if (dirent.isDirectory()) {
                const packageJSONPath = join(targetDir, dirent.name, "package", "package.json");
                const jsonContent = yield readFile(packageJSONPath, { encoding: "utf-8" });
                const jsonObj = JSON.parse(jsonContent);
                let packageName = jsonObj.name;
                packageName = packageName.replace(/\//g, "-");
                if (csvNameArr.includes(packageName)) {
                    yield rm(join(targetDir, dirent.name), { recursive: true, force: true });
                }
            }
        }
    });
}
export function doSomethingRemove(csv_path, dedupli_path) {
    return __awaiter(this, void 0, void 0, function* () {
        //await removeDuplicatePackageForDuan(duan_path)
        yield removeDuplicatePackage(csv_path, dedupli_path);
    });
}
//# sourceMappingURL=RemoveDuplicatePackage.js.map