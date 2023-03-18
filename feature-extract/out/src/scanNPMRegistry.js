var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mkdir, open, readFile } from "fs/promises";
import { basename, join } from "path";
import { asyncExec, getRootDirectory } from "./util/Util";
import { depressSinglePackage, downloadSinglePackage, } from "./util/DownloadPackage";
import { getFileLogger } from "./FileLogger";
import { readdirSync } from "node:fs";
import { access, writeFile } from "fs/promises";
import { extractFeatureFromPackage, ResovlePackagePath, } from "./ExtractFeature";
import { predict_py_path, should_use_console_log } from "./commons";
import { stringify } from "csv-stringify/sync";
import { EOL } from "os";
function get_all_packages() {
    return __awaiter(this, void 0, void 0, function* () {
        const names_path = join(getRootDirectory(), "material", "names.json");
        const fileContent = yield readFile(names_path, { encoding: "utf-8" });
        let names = JSON.parse(fileContent);
        names = names.filter((name) => name === name.toLowerCase());
        return names;
    });
}
export function scanNPMRegistry(haveFeatureChanged) {
    return __awaiter(this, void 0, void 0, function* () {
        const names = yield get_all_packages();
        const progress_path = join(getRootDirectory(), "material", "scan-registry-progress.json");
        const progress_content = yield readFile(progress_path, { encoding: "utf-8" });
        const idx = JSON.parse(progress_content).progress;
        const malicious_pacakage_path = join(getRootDirectory(), "material", "registry-malicious-package.csv");
        const malicious_file_handler = yield open(malicious_pacakage_path, "w+");
        const logger = yield getFileLogger();
        const unit_size = 50;
        const counter = Math.ceil(names.length / unit_size);
        for (let i = 0; i < counter; i++) {
            const saveDir = join(getRootDirectory(), "material", "registry", String(i));
            try {
                yield access(saveDir);
            }
            catch (error) {
                yield mkdir(saveDir);
                process.stdout.write(`mkdir ${saveDir} ${new Date().toLocaleString()}\n`);
            }
            // 对于之前下载解压过的包，不需要再下载解压
            if (i >= idx) {
                // 下载unit_size个包
                for (let j = 0; j < unit_size && j + i * unit_size < names.length; j++) {
                    try {
                        const { stdout, stderr } = yield downloadSinglePackage(names[j + i * unit_size], saveDir);
                        process.stdout.write(`${new Date().toLocaleString()}: The package being downloaded:${names[j + i * unit_size]}.\n`);
                        should_use_console_log && console.log(stdout, stderr);
                    }
                    catch (error) {
                        yield logger.log(`The package being downloaded:${names[j + i * unit_size]}`);
                        yield logger.log(`error name: ${error.name}`);
                        yield logger.log(`error message: ${error.message}`);
                        yield logger.log(`error stack: ${error.stack}`);
                    }
                }
                // 解压包
                const files = readdirSync(saveDir).filter((fileName) => fileName.endsWith(".tgz"));
                for (let file of files) {
                    const dotIdx = basename(file).lastIndexOf(".");
                    const fileName = basename(file).substring(0, dotIdx);
                    const depressDir = join(saveDir, fileName.replace(/\//g, "-"));
                    try {
                        yield access(depressDir);
                    }
                    catch (error) {
                        yield mkdir(depressDir);
                    }
                    try {
                        let { stdout, stderr } = yield depressSinglePackage(join(saveDir, file), depressDir);
                        process.stdout.write(`${new Date().toLocaleString()}: The package being depressed : ${basename(file)} \n`);
                        should_use_console_log && console.log(stdout, stderr);
                    }
                    catch (error) {
                        yield logger.log(`The package being depressed: ${file}`);
                        yield logger.log(`error name: ${error.name}`);
                        yield logger.log(`error message: ${error.message}`);
                        yield logger.log(`error stack: ${error.stack}`);
                    }
                }
                // 更新下载解压的进度
                // 进度为此次运行前下载解压的进度
                yield writeFile(progress_path, JSON.stringify({ progress: i }));
            }
            // 下载包后和特征发生变化时需要提取特征
            if (i >= idx || haveFeatureChanged) {
                const package_files = readdirSync(saveDir, { withFileTypes: true });
                for (const packageDir of package_files) {
                    if (packageDir.isDirectory()) {
                        const source_path = join(saveDir, packageDir.name, "package");
                        try {
                            yield access(source_path);
                        }
                        catch (error) {
                            yield logger.log(`The package being analyzed: ${packageDir.name};找不到package目录`);
                            continue;
                        }
                        try {
                            yield extractFeatureFromPackage(source_path, ResovlePackagePath.None, saveDir);
                            process.stdout.write(`${new Date().toLocaleString()}: The package being analyzed: ${packageDir.name} \n`);
                        }
                        catch (error) {
                            yield logger.log(`The package being analyzed: ${packageDir.name}`);
                            yield logger.log(`error name: ${error.name}`);
                            yield logger.log(`error message: ${error.message}`);
                            yield logger.log(`error stack: ${error.stack}`);
                        }
                    }
                }
            }
            const malicious_packages = [];
            // 使用分类器判断是否为恶意包
            let all_files = readdirSync(saveDir);
            all_files = all_files.filter((fileName) => fileName.endsWith(".csv"));
            for (let file of all_files) {
                try {
                    const { stderr, stdout } = yield asyncExec(`python3  ${predict_py_path} ${join(saveDir, file)}`);
                    process.stdout.write(`${new Date().toLocaleString()}: ***************finish analyze ${basename(file)}. It is ${stdout} `);
                    if (basename(file) === "0.workspace.csv") {
                        debugger;
                    }
                    if (stdout) {
                        if (stdout === `malicious${EOL}`) {
                            malicious_packages.push([basename(file), String(i)]);
                        }
                    }
                }
                catch (error) {
                    yield logger.log(`The package being analyzed by classifier: ${basename(file)}`);
                    yield logger.log(`error name: ${error.name}`);
                    yield logger.log(`error message: ${error.message}`);
                    yield logger.log(`error stack: ${error.stack}`);
                }
            }
            // 之间检测过的恶意包不需要再写入
            yield malicious_file_handler.writeFile(stringify(malicious_packages));
        }
        yield malicious_file_handler.close();
    });
}
//# sourceMappingURL=scanNPMRegistry.js.map