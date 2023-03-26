var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { join } from "node:path";
import { getCSVFromFile, getRootDirectory, writeCSVFile } from "../util";
const MATERIAL_PATH = join(getRootDirectory(), 'material');
const RF_PATH = join(MATERIAL_PATH, 'registry-malicious-package-rf-v2.csv');
const MLP_PATH = join(MATERIAL_PATH, 'registry-malicious-package-mlp.csv');
const SVM_PATH = join(MATERIAL_PATH, 'registry-malicious-package-svm.csv');
const DIFF_RESULT_PATH = join(MATERIAL_PATH, 'diff-result.csv');
export default function diffPredict() {
    return __awaiter(this, void 0, void 0, function* () {
        const rf = yield getCSVFromFile(RF_PATH);
        const mlp = yield getCSVFromFile(MLP_PATH);
        const svm = yield getCSVFromFile(SVM_PATH);
        let res = [];
        diff(svm, rf, res);
        diff(svm, mlp, res);
        yield writeCSVFile(DIFF_RESULT_PATH, res);
    });
}
function diff(arr1, arr2, res) {
    arr2.forEach((arr, idx) => {
        if (idx > 443) {
            return;
        }
        if (arr1.findIndex(el => el[0] === arr[0]) < 0 && res.findIndex(el => el[0] === arr[0]) < 0) {
            res.push(arr);
        }
    });
}
//# sourceMappingURL=diffPredict.js.map