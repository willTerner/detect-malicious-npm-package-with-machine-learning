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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.getPackageFeatureInfo = void 0;
var promises_1 = require("fs/promises");
var PackageJSONInfo_1 = require("./PackageJSONInfo");
var path_1 = require("path");
var EditDistance_1 = require("./EditDistance");
var Patterns_1 = require("./Patterns");
var GetInstallScripts_1 = require("./GetInstallScripts");
var ASTUtil_1 = require("./ASTUtil");
var RegExpUtil_1 = require("./RegExpUtil");
/**
 *
 * @param dirPath 源码包（目录下有package.json文件）的路径
 * @param tgzPath 压缩包的路径
 */
function getPackageFeatureInfo(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        function traverseDir(dirPath) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var dir, _loop_1, _d, dir_1, dir_1_1, e_1_1;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if ((0, path_1.basename)(dirPath) === "node_modules") {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, (0, promises_1.opendir)(dirPath)];
                        case 1:
                            dir = _e.sent();
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 8, 9, 14]);
                            _loop_1 = function () {
                                var dirent, jsFilePath, isInstallScriptFile;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            _c = dir_1_1.value;
                                            _d = false;
                                            _f.label = 1;
                                        case 1:
                                            _f.trys.push([1, , 6, 7]);
                                            dirent = _c;
                                            jsFilePath = (0, path_1.join)(dirPath, dirent.name);
                                            isInstallScriptFile = result.executeJSFiles.findIndex(function (filePath) { return filePath === jsFilePath; }) >= 0;
                                            if (!(dirent.isFile() && (dirent.name.endsWith(".js") || isInstallScriptFile))) return [3 /*break*/, 3];
                                            result.numberOfJSFiles++;
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                        var jsFileContent;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, (0, promises_1.readFile)((0, path_1.join)(dirPath, dirent.name), { encoding: "utf-8" })];
                                                                case 1:
                                                                    jsFileContent = _a.sent();
                                                                    (0, ASTUtil_1.scanJSFileByAST)(jsFileContent, result, isInstallScriptFile);
                                                                    (0, RegExpUtil_1.matchUseRegExp)(jsFileContent, result);
                                                                    resolve(true);
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }, 0);
                                                })];
                                        case 2:
                                            _f.sent();
                                            return [3 /*break*/, 5];
                                        case 3:
                                            if (!dirent.isDirectory()) return [3 /*break*/, 5];
                                            return [4 /*yield*/, traverseDir((0, path_1.join)(dirPath, dirent.name))];
                                        case 4:
                                            _f.sent();
                                            _f.label = 5;
                                        case 5: return [3 /*break*/, 7];
                                        case 6:
                                            _d = true;
                                            return [7 /*endfinally*/];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            };
                            _d = true, dir_1 = __asyncValues(dir);
                            _e.label = 3;
                        case 3: return [4 /*yield*/, dir_1.next()];
                        case 4:
                            if (!(dir_1_1 = _e.sent(), _a = dir_1_1.done, !_a)) return [3 /*break*/, 7];
                            return [5 /*yield**/, _loop_1()];
                        case 5:
                            _e.sent();
                            _e.label = 6;
                        case 6: return [3 /*break*/, 3];
                        case 7: return [3 /*break*/, 14];
                        case 8:
                            e_1_1 = _e.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 14];
                        case 9:
                            _e.trys.push([9, , 12, 13]);
                            if (!(!_d && !_a && (_b = dir_1["return"]))) return [3 /*break*/, 11];
                            return [4 /*yield*/, _b.call(dir_1)];
                        case 10:
                            _e.sent();
                            _e.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 13: return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        }
        var result, packageJSONPath, packageJSONInfo, _a, fileInfo, _i, _b, scriptContent, matchResult, matchResult, matchResult, matchResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    result = {
                        editDistance: 0,
                        averageBracketNumber: 0,
                        packageSize: 0,
                        dependencyNumber: 0,
                        devDependencyNumber: 0,
                        numberOfJSFiles: 0,
                        totalBracketsNumber: 0,
                        hasInstallScripts: false,
                        containIP: false,
                        useBase64Conversion: false,
                        containBase64String: false,
                        createBufferFromASCII: false,
                        containBytestring: false,
                        containDomain: false,
                        useBufferFrom: false,
                        useEval: false,
                        requireChildProcessInJSFile: false,
                        requireChildProcessInInstallScript: false,
                        accessFSInJSFile: false,
                        accessFSInInstallScript: false,
                        accessNetworkInJSFile: false,
                        accessNetworkInInstallScript: false,
                        accessProcessEnvInJSFile: false,
                        accessProcessEnvInInstallScript: false,
                        useCrpytoAndZip: false,
                        accessSensitiveAPI: false,
                        containSuspiciousString: false,
                        installCommand: [],
                        executeJSFiles: [],
                        packageName: "",
                        version: ""
                    };
                    packageJSONPath = (0, path_1.join)(dirPath, "package.json");
                    return [4 /*yield*/, (0, PackageJSONInfo_1.getPackageJSONInfo)(packageJSONPath)];
                case 1:
                    packageJSONInfo = _c.sent();
                    Object.assign(result, packageJSONInfo);
                    _a = result;
                    return [4 /*yield*/, (0, EditDistance_1.minEditDistance)(packageJSONInfo.packageName)];
                case 2:
                    _a.editDistance = _c.sent();
                    return [4 /*yield*/, (0, promises_1.stat)(dirPath)];
                case 3:
                    fileInfo = _c.sent();
                    result.packageSize = fileInfo.size;
                    // 分析install hook command
                    for (_i = 0, _b = packageJSONInfo.installCommand; _i < _b.length; _i++) {
                        scriptContent = _b[_i];
                        {
                            matchResult = scriptContent.match(Patterns_1.IP_Pattern);
                            if (matchResult) {
                                result.containIP = true;
                            }
                        }
                        {
                            matchResult = scriptContent.match((0, Patterns_1.getDomainPattern)());
                            if (matchResult) {
                                result.containDomain = true;
                            }
                        }
                        {
                            matchResult = scriptContent.match(Patterns_1.Network_Command_Pattern);
                            if (matchResult) {
                                result.accessNetworkInInstallScript = true;
                            }
                        }
                        {
                            matchResult = scriptContent.match(Patterns_1.SensitiveStringPattern);
                            if (matchResult) {
                                result.containSuspiciousString = true;
                            }
                        }
                    }
                    // 分析install hook js files
                    (0, GetInstallScripts_1.getAllInstallScripts)(result.executeJSFiles);
                    return [4 /*yield*/, traverseDir(dirPath)];
                case 4:
                    _c.sent();
                    result.averageBracketNumber = result.totalBracketsNumber / result.numberOfJSFiles;
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.getPackageFeatureInfo = getPackageFeatureInfo;
//# sourceMappingURL=PackageFeatureInfo.js.map