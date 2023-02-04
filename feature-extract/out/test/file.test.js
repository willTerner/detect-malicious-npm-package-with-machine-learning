var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { writeFile } from 'node:fs/promises';
import { stringify } from 'csv-stringify/sync';
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
}));
//# sourceMappingURL=file.test.js.map