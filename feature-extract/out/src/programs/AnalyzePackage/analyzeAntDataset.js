var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Classifier, setClassifier } from '../../config';
import { ant_data_set_path } from '../../constants';
import { analyzeDir } from './PackageAnalyzer';
function analyzeAntDataset() {
    return __awaiter(this, void 0, void 0, function* () {
        // await depressPackages(ant_data_set_path);
        setClassifier(Classifier.MLP);
        yield analyzeDir(ant_data_set_path, ant_data_set_path);
    });
}
analyzeAntDataset();
//# sourceMappingURL=analyzeAntDataset.js.map