var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { accessSync, constants } from "fs";
import { output_feature_path, } from "./constants";
import { join } from "path";
import { Logger } from "./Logger";
import { analyzeDir, analyzeSinglePackage } from "./programs/AnalyzePackage/PackageAnalyzer";
import { Classifier, setClassifier } from "./config";
function show_usage() {
    Logger.info('\nusage:\nnode --es-module-specifier-resolution=node out/src/index.js -s $package_path [-c $classifier].  It is used to detect single package. package_path is absolute path of a npm package directory which should have a file named package.json.\nnode --es-module-specifier-resolution=node out/src/index.js -b $dir [-c $classifier]. It is used to detect all packages in the $dir\n$classifier is optional classifier from RF, SVM, NB, MLP. Default classifier is SVM.');
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv.length === 4 || process.argv.length === 6) {
            const option = process.argv[2];
            if (process.argv.length === 6) {
                if (process.argv[4] !== '-c') {
                    show_usage();
                    return;
                }
                const classifier = process.argv[5];
                if (Object.values(Classifier).findIndex(c => c === classifier) < 0) {
                    show_usage();
                    return;
                }
                setClassifier(classifier);
            }
            if (option === '-s') {
                const packagePath = process.argv[3];
                const packageJSONPath = join(packagePath, 'package.json');
                try {
                    accessSync(packagePath, constants.F_OK | constants.R_OK);
                }
                catch (error) {
                    Logger.error(`can't access ${packagePath}. message is ${error.message}`);
                    return;
                }
                try {
                    accessSync(packageJSONPath);
                }
                catch (error) {
                    Logger.error(`can't access ${packageJSONPath}`);
                    return;
                }
                // detect single package
                yield analyzeSinglePackage(packagePath, output_feature_path);
            }
            else if (option === '-b') {
                const dirPath = process.argv[3];
                try {
                    accessSync(dirPath, constants.F_OK | constants.R_OK);
                }
                catch (error) {
                    Logger.error(`can't access ${dirPath}. message is ${error.message}`);
                    return;
                }
                yield analyzeDir(dirPath, output_feature_path);
            }
            else {
                show_usage();
            }
        }
        else {
            show_usage();
        }
    });
}
main();
//# sourceMappingURL=index.js.map