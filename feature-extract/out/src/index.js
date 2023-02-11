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
import { duan_path, knife_csv_path, knife_dedupl_saveDir, knife_path, normal_csv_path, predict_py_path, test_malicious_dedupl_path, test_malicious_path, test_normal_csv_path, test_normal_path, test_set_mix_csv_path, test_set_path } from "./commons";
import { asyncExec } from "./Util";
import { depressPackageAndSetDir, doSomething, ResolveDepressDir } from "./util/DownloadPackage";
import { doSomethingRemove } from "./util/RemoveDuplicatePackage";
import { scanNPMRegistry } from "./scanNPMRegistry";
const momnetPath = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/momnet/2.28.0";
const pornhub_alert = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/@pornhub_alerts/94.0.1";
const event_stream = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/event-stream/3.3.6";
const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集";
var Action;
(function (Action) {
    Action[Action["Extract"] = 0] = "Extract";
    Action[Action["DoSomething"] = 1] = "DoSomething";
    Action[Action["DepressPackageFromDir"] = 2] = "DepressPackageFromDir";
    Action[Action["ScanNPMRegistry"] = 3] = "ScanNPMRegistry";
})(Action || (Action = {}));
function extract_feature() {
    return __awaiter(this, void 0, void 0, function* () {
        let resolve_path = ResovlePackagePath.By_Test_Set;
        let source_path;
        let csv_path;
        let csv_dedupli_path;
        //@ts-ignore
        let is_malicous = false;
        const action = Action.ScanNPMRegistry;
        // @ts-ignore
        if (resolve_path === ResovlePackagePath.By_Knife) {
            source_path = knife_path;
            csv_path = knife_csv_path;
            csv_dedupli_path = knife_dedupl_saveDir;
            // @ts-ignore
        }
        else if (resolve_path === ResovlePackagePath.By_Normal) {
            source_path = normal_path;
            csv_path = normal_csv_path;
            // @ts-ignore
        }
        else if (resolve_path === ResovlePackagePath.By_Duan) {
            source_path = duan_path;
            csv_path = test_malicious_path;
            csv_dedupli_path = test_malicious_dedupl_path;
            // @ts-ignore
        }
        else if (resolve_path === ResovlePackagePath.By_Test_Normal) {
            source_path = test_normal_path;
            csv_path = test_normal_csv_path;
        }
        else if (resolve_path === ResovlePackagePath.By_Test_Set) {
            source_path = test_set_path;
            csv_path = test_set_mix_csv_path;
        }
        // @ts-ignore
        if (action === Action.Extract) {
            yield extractFeatureFromDir(source_path, resolve_path);
            if (is_malicous) {
                yield doSomethingRemove(csv_path, csv_dedupli_path);
            }
            // @ts-ignore
        }
        else if (action === Action.DoSomething) {
            yield doSomething();
            // @ts-ignore
        }
        else if (action === Action.DepressPackageFromDir) {
            yield depressPackageAndSetDir(test_set_path, ResolveDepressDir.TEST_SET);
        }
        else if (action === Action.ScanNPMRegistry) {
            yield scanNPMRegistry();
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