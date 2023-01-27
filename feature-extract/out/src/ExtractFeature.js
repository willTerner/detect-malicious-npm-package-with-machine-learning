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
exports.extractFeatureFromDir = void 0;
var sync_1 = require("csv-stringify/sync");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var PackageFeatureInfo_1 = require("./PackageFeatureInfo");
var malicious_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious";
var normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal";
function extractFeatureFromFile(sourcePath, isMaliciousPackage) {
    return __awaiter(this, void 0, void 0, function () {
        var result, csvPath, featureArr;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, PackageFeatureInfo_1.getPackageFeatureInfo)(sourcePath)];
                case 1:
                    result = _a.sent();
                    csvPath = (0, path_1.join)(isMaliciousPackage ? malicious_path : normal_path, result.packageName + ".csv");
                    featureArr = [];
                    featureArr.push(["editDistance", result.editDistance]);
                    featureArr.push(["averageBracket", result.averageBracketNumber]);
                    featureArr.push(["packageSize", result.packageSize]);
                    featureArr.push(["dependencyNumber", result.dependencyNumber]);
                    featureArr.push(["devDependencyNumber", result.devDependencyNumber]);
                    featureArr.push(["jsFileNumber", result.numberOfJSFiles]);
                    featureArr.push(["bracketNumber", result.totalBracketsNumber]);
                    featureArr.push(["hasInstallScript", result.hasInstallScripts]);
                    featureArr.push(["containIP", result.containIP]);
                    featureArr.push(["useBase64Conversion", result.useBase64Conversion]);
                    featureArr.push(["containBase64String", result.containBase64String]);
                    featureArr.push(["createBufferFromASCII", result.createBufferFromASCII]);
                    featureArr.push(["containBytestring", result.containBytestring]);
                    featureArr.push(["containDomain", result.containDomain]);
                    featureArr.push(["useBufferFrom", result.useBufferFrom]);
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
                    return [4 /*yield*/, new Promise(function (resolve) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, promises_1.writeFile)(csvPath, (0, sync_1.stringify)(featureArr))];
                                        case 1:
                                            _a.sent();
                                            resolve(true);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function extractFeatureFromDir(dirPath, isMaliciousPath) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var dir, _d, dir_1, dir_1_1, dirent, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.opendir)(dirPath)];
                case 1:
                    dir = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 13, 14, 19]);
                    _d = true, dir_1 = __asyncValues(dir);
                    _e.label = 3;
                case 3: return [4 /*yield*/, dir_1.next()];
                case 4:
                    if (!(dir_1_1 = _e.sent(), _a = dir_1_1.done, !_a)) return [3 /*break*/, 12];
                    _c = dir_1_1.value;
                    _d = false;
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, , 10, 11]);
                    dirent = _c;
                    if (!dirent.isDirectory()) return [3 /*break*/, 7];
                    return [4 /*yield*/, extractFeatureFromDir((0, path_1.join)(dirPath, dirent.name), isMaliciousPath)];
                case 6:
                    _e.sent();
                    return [3 /*break*/, 9];
                case 7:
                    if (!(dirent.isFile() && dirent.name.endsWith(".tgz"))) return [3 /*break*/, 9];
                    return [4 /*yield*/, extractFeatureFromFile((0, path_1.join)(dirPath, "package"), isMaliciousPath)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    _d = true;
                    return [7 /*endfinally*/];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 19];
                case 13:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 19];
                case 14:
                    _e.trys.push([14, , 17, 18]);
                    if (!(!_d && !_a && (_b = dir_1["return"]))) return [3 /*break*/, 16];
                    return [4 /*yield*/, _b.call(dir_1)];
                case 15:
                    _e.sent();
                    _e.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 18: return [7 /*endfinally*/];
                case 19: return [2 /*return*/];
            }
        });
    });
}
exports.extractFeatureFromDir = extractFeatureFromDir;
//# sourceMappingURL=ExtractFeature.js.map