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
import arr from '/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/progress.json';
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const t = [1, 3, 4];
        let newArr = [];
        for (const n of newArr) {
            if (arr.findIndex(el => el === n) < 0) {
                newArr.push(n);
            }
        }
        newArr = newArr.concat(arr);
        yield writeFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/progress.json", JSON.stringify(newArr));
    });
}
test();
//# sourceMappingURL=file.js.map