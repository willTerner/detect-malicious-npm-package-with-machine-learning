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
import { writeFile } from 'node:fs/promises';
import { stringify } from 'csv-stringify/sync';
import { opendir } from 'node:fs/promises';
test("test json", () => __awaiter(void 0, void 0, void 0, function* () {
    yield writeFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/test/test.csv", stringify([[true, false]], {
        cast: {
            "boolean": function (value) {
                if (value) {
                    return "true";
                }
                return "false";
            }
        }
    }));
}));
test("teset opendir", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const dir = yield opendir("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src");
    let counter = 0;
    try {
        for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
            _c = dir_1_1.value;
            _d = false;
            try {
                const dirent = _c;
                counter++;
                console.log(counter);
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
}));
//# sourceMappingURL=file.test.js.map