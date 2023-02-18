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
import { constants } from "fs";
import { access } from "fs/promises";
import { extractFeatureFromDir, extractFeatureFromPackage, ResovlePackagePath } from "./ExtractFeature";
import { duan_path, predict_py_path, normal1_path, knife_path, normal2_path } from "./commons";
import { asyncExec } from "./Util";
import { doSomething } from "./util/DownloadPackage";
import { scanNPMRegistry } from "./scanNPMRegistry";
import { pattern_test } from "./Patterns";
var Action;
(function (Action) {
    Action[Action["Extract"] = 0] = "Extract";
    Action[Action["DoSomething"] = 1] = "DoSomething";
    Action[Action["DepressPackageFromDir"] = 2] = "DepressPackageFromDir";
    Action[Action["ScanNPMRegistry"] = 3] = "ScanNPMRegistry";
    Action[Action["PatternTest"] = 4] = "PatternTest";
})(Action || (Action = {}));
function extract_feature() {
    return __awaiter(this, void 0, void 0, function* () {
        let resolve_path = ResovlePackagePath.By_Normal2;
        let source_path;
        //@ts-ignore
        const action = Action.PatternTest;
        const haveFeatureChanged = false;
        // @ts-ignore
        if (resolve_path === ResovlePackagePath.By_Knife) {
            source_path = knife_path;
            // @ts-ignore
        }
        else if (resolve_path === ResovlePackagePath.By_Normal1) {
            source_path = normal1_path;
            // @ts-ignore
        }
        else if (resolve_path === ResovlePackagePath.By_Duan) {
            source_path = duan_path;
            // @ts-ignore
        }
        else if (resolve_path === ResovlePackagePath.By_Normal2) {
            source_path = normal2_path;
        }
        // @ts-ignore
        if (action === Action.Extract) {
            yield extractFeatureFromDir(source_path, resolve_path);
            // @ts-ignore
        }
        else if (action === Action.DoSomething) {
            yield doSomething();
            // @ts-ignore
        }
        else if (action === Action.ScanNPMRegistry) {
            yield scanNPMRegistry(haveFeatureChanged);
        }
        else if (action === Action.PatternTest) {
            yield pattern_test();
        }
        //doSomethingAST();
    });
}
function show_usage() {
    console.log(chalk.green(`npm run start $package_path}. package_path is absolute path of a npm package directory which should have a file named package.json.`));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv.length === 3) {
            const package_path = process.argv[2];
            try {
                yield access(package_path, constants.F_OK | constants.R_OK);
            }
            catch (error) {
                console.log(chalk.red("access" + package_path + "permission denied"));
                console.log(error);
                process.exit(0);
            }
            const csvPath = yield extractFeatureFromPackage(package_path, ResovlePackagePath.By_Single_Package);
            const { stderr, stdout } = yield asyncExec(`python3 ${predict_py_path} ${csvPath}`);
            if (stdout) {
                console.log(chalk.green("finish analyzing this package. This package is " + stdout));
            }
            else {
                console.log(stderr);
            }
        }
        else if (process.argv.length == 2) {
            console.log(chalk.red("This usage is for personal experiment. The right usage is as follows"));
            show_usage();
            const username = process.env.USER || process.env.USERNAME;
            if (username === "huchaoqun") {
                yield extract_feature();
            }
            process.exit(0);
        }
        else {
            show_usage();
            process.exit(0);
        }
    });
}
main();
//# sourceMappingURL=index.js.map