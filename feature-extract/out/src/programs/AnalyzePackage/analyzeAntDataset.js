var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { depressPackages } from '../../util/PackageUtil';
function analyzeAntDataset() {
    return __awaiter(this, void 0, void 0, function* () {
        yield depressPackages('/Volumes/移动硬盘/code/school/npm_malicious_package');
        // setClassifier(Classifier.MLP);
        // await analyzeDir(ant_data_set_path, ant_data_set_path);
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
analyzeAntDataset();
//# sourceMappingURL=analyzeAntDataset.js.map