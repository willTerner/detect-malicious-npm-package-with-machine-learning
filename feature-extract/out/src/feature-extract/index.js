var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { stringify } from "csv-stringify/sync";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getPackagesFromDir, getValidFileName } from "../util";
import { getPackageFeatureInfo } from "./PackageFeatureInfo";
/**
 *
 * @param sourcePath npm包的目录，目录下应该有package.json文件
 * @param csvDir 特征文件的保存目录
 * @returns 返回特征文件的路径
 */
export function extractFeatureFromPackage(sourcePath, csvDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getPackageFeatureInfo(sourcePath);
        const fileName = getValidFileName(result.packageName);
        const csvPath = join(csvDir, fileName + ".csv");
        const featureArr = [];
        featureArr.push(["hasInstallScript", result.hasInstallScripts]);
        featureArr.push(["containIP", result.containIP]);
        featureArr.push(["useBase64Conversion", result.useBase64Conversion]);
        featureArr.push(["useBase64ConversionInInstallScript", result.useBase64ConversionInInstallScript]);
        featureArr.push(["containBase64StringInJSFile", result.containBase64StringInJSFile]);
        featureArr.push(["containBase64StringInInstallScript", result.containBase64StringInInstallScript]);
        featureArr.push(["containBytestring", result.containBytestring]);
        featureArr.push(["containDomainInJSFile", result.containDomainInJSFile]);
        featureArr.push(["containDomainInInstallScript", result.containDomainInInstallScript]);
        featureArr.push(["useBuffer", result.useBuffer]);
        featureArr.push(["useEval", result.useEval]);
        featureArr.push(["requireChildProcessInJSFile", result.requireChildProcessInJSFile]);
        featureArr.push(["requireChildProcessInInstallScript", result.requireChildProcessInInstallScript]);
        featureArr.push(["accessFSInJSFile", result.accessFSInJSFile]);
        featureArr.push(["accessFSInInstallScript", result.accessFSInInstallScript]);
        featureArr.push(["accessNetworkInJSFile", result.accessNetworkInJSFile]);
        featureArr.push(["accessNetworkInInstallScript", result.accessNetworkInInstallScript]);
        featureArr.push(["accessProcessEnvInJSFile", result.accessProcessEnvInJSFile]);
        featureArr.push(["accessProcessEnvInInstallScript", result.accessProcessEnvInInstallScript]);
        featureArr.push(["containSuspicousString", result.containSuspiciousString]);
        featureArr.push(["accessCryptoAndZip", result.accessCryptoAndZip]);
        featureArr.push(["accessSensitiveAPI", result.accessSensitiveAPI]);
        yield new Promise(resolve => {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield writeFile(csvPath, stringify(featureArr, {
                    cast: {
                        "boolean": function (value) {
                            if (value) {
                                return "true";
                            }
                            return "false";
                        }
                    }
                }));
                resolve(true);
            }));
        });
        return {
            csvPath,
            featureInfo: result,
        };
    });
}
/**
 *
 * @param dirPath 包含npm包的目录，对该目录下的所有npm包进行特征提取
 * @param csvDir 特征提取文件的目录
 */
export function extractFeatureFromDir(dirPath, csvDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const packagesPath = yield getPackagesFromDir(dirPath);
        for (const packagePath of packagesPath) {
            yield new Promise(resolve => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield extractFeatureFromPackage(packagePath, csvDir);
                }), 0);
            });
        }
    });
}
//# sourceMappingURL=index.js.map