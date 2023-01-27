"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getPackageJSONInfo = exports.getPackageSize = void 0;
var promises_1 = require("fs/promises");
var path_1 = require("path");
function getPackageSize(tgzPath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.stat)(tgzPath)];
                case 1:
                    fileInfo = _a.sent();
                    return [2 /*return*/, fileInfo.size];
            }
        });
    });
}
exports.getPackageSize = getPackageSize;
/**
 *
 * @param filePath package.json文件路径
 * @return [依赖的数量，开发依赖的数量，是否有安装脚本]
 */
function getPackageJSONInfo(filePath) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var result, fileContent, metaData, executeJSFiles, preinstall, install, postinstall, parentDir, jsFile, jsFile, jsFile;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    result = {
                        dependencyNumber: 0,
                        devDependencyNumber: 0,
                        hasInstallScripts: false,
                        installCommand: [],
                        executeJSFiles: [],
                        packageName: "",
                        version: ""
                    };
                    return [4 /*yield*/, (0, promises_1.readFile)(filePath, { encoding: "utf-8" })];
                case 1:
                    fileContent = _g.sent();
                    metaData = JSON.parse(fileContent);
                    result.dependencyNumber = Object.keys((metaData === null || metaData === void 0 ? void 0 : metaData.dependencies) || {}).length;
                    result.devDependencyNumber = Object.keys((metaData === null || metaData === void 0 ? void 0 : metaData.devDependencies) || {}).length;
                    result.hasInstallScripts = Boolean((_a = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _a === void 0 ? void 0 : _a.preinstall) || Boolean((_b = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _b === void 0 ? void 0 : _b.install) || Boolean((_c = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _c === void 0 ? void 0 : _c.postinstall);
                    executeJSFiles = [];
                    result.packageName = metaData === null || metaData === void 0 ? void 0 : metaData.name;
                    result.version = metaData === null || metaData === void 0 ? void 0 : metaData.version;
                    preinstall = (_d = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _d === void 0 ? void 0 : _d.preinstall;
                    install = (_e = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _e === void 0 ? void 0 : _e.install;
                    postinstall = (_f = metaData === null || metaData === void 0 ? void 0 : metaData.scripts) === null || _f === void 0 ? void 0 : _f.postinstall;
                    parentDir = (0, path_1.dirname)(filePath);
                    if (preinstall) {
                        result.installCommand.push(preinstall);
                        jsFile = extractJSFilePath(preinstall);
                        if (jsFile) {
                            jsFile = (0, path_1.join)(parentDir, jsFile);
                            executeJSFiles.push(jsFile);
                        }
                    }
                    if (install) {
                        result.installCommand.push(install);
                        jsFile = extractJSFilePath(install);
                        if (jsFile) {
                            jsFile = (0, path_1.join)(parentDir, jsFile);
                            executeJSFiles.push(jsFile);
                        }
                    }
                    if (postinstall) {
                        result.installCommand.push(postinstall);
                        jsFile = extractJSFilePath(postinstall);
                        if (jsFile) {
                            jsFile = (0, path_1.join)(parentDir, jsFile);
                            executeJSFiles.push(jsFile);
                        }
                    }
                    result.executeJSFiles = executeJSFiles;
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.getPackageJSONInfo = getPackageJSONInfo;
function extractJSFilePath(scriptContent) {
    var jsFileReg = /node\s+(.+\.js)/;
    var matchResult = scriptContent.match(jsFileReg);
    if (matchResult) {
        return matchResult[1];
    }
    return undefined;
}
//# sourceMappingURL=PackageJSONInfo.js.map