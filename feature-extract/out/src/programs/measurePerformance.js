var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { accessSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";
import { output_feature_path, predict_py_path, supplement_data_set_path } from "../constants";
import { getConfig } from "../config";
import { extractFeatureFromPackage } from "../feature-extract";
import { asyncExec, getPackagesFromDir } from "../util";
let totalTime = 0;
let totalNumber = 0;
function measureSinglePackage(package_path) {
    return __awaiter(this, void 0, void 0, function* () {
        totalNumber++;
        const startTime = Date.now();
        const csvPath = yield extractFeatureFromPackage(package_path, output_feature_path);
        const { stderr, stdout } = yield asyncExec(`python3 ${predict_py_path} ${csvPath}`);
        totalTime += Date.now() - startTime;
        if (stdout) {
            console.log(chalk.green("finish analyzing this package.\n This package is " + stdout));
            if (stdout === 'malicious\n') {
                const featurePosPath = join(package_path, 'feature-position-info.json');
                yield writeFile(featurePosPath, getConfig().positionRecorder.serialRecord());
            }
        }
        else {
            console.log(stderr);
        }
    });
}
export function measurePerformance() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield getPackagesFromDir(supplement_data_set_path);
        for (const file of files) {
            try {
                const package_path = file;
                accessSync(package_path);
                yield measureSinglePackage(package_path);
            }
            catch (error) {
                console.log(error.name);
                console.log(error.message);
                console.log(error.message);
            }
        }
        console.log(`分析了${totalNumber}个包，花了${totalTime}ms`);
    });
}
//# sourceMappingURL=measurePerformance.js.map