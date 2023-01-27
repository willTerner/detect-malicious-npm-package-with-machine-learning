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
var promises_1 = require("fs/promises");
var path_1 = require("path");
var util_1 = require("util");
var child_process_1 = require("child_process");
var asyncExec = (0, util_1.promisify)(child_process_1.exec);
function depressPackageAndSetDir(targetDir) {
    return __awaiter(this, void 0, void 0, function () {
        function resolveDepress(targetDir) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var dir, _d, dir_1, dir_1_1, dirent, dotIndex, e_1_1;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, (0, promises_1.opendir)(targetDir)];
                        case 1:
                            dir = _e.sent();
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 12, 13, 18]);
                            _d = true, dir_1 = __asyncValues(dir);
                            _e.label = 3;
                        case 3: return [4 /*yield*/, dir_1.next()];
                        case 4:
                            if (!(dir_1_1 = _e.sent(), _a = dir_1_1.done, !_a)) return [3 /*break*/, 11];
                            _c = dir_1_1.value;
                            _d = false;
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, , 9, 10]);
                            dirent = _c;
                            if (!dirent.isDirectory()) return [3 /*break*/, 7];
                            return [4 /*yield*/, resolveDepress((0, path_1.join)(targetDir, dirent.name))];
                        case 6:
                            _e.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            dotIndex = dirent.name.lastIndexOf(".");
                            if (dotIndex >= 0 && dirent.name.substring(dotIndex) === ".tgz") {
                                tgzPathArr.push((0, path_1.join)(targetDir, dirent.name));
                            }
                            _e.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            _d = true;
                            return [7 /*endfinally*/];
                        case 10: return [3 /*break*/, 3];
                        case 11: return [3 /*break*/, 18];
                        case 12:
                            e_1_1 = _e.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 18];
                        case 13:
                            _e.trys.push([13, , 16, 17]);
                            if (!(!_d && !_a && (_b = dir_1["return"]))) return [3 /*break*/, 15];
                            return [4 /*yield*/, _b.call(dir_1)];
                        case 14:
                            _e.sent();
                            _e.label = 15;
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 17: return [7 /*endfinally*/];
                        case 18: return [2 /*return*/];
                    }
                });
            });
        }
        var tgzPathArr, _loop_1, _i, tgzPathArr_1, tgzPath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tgzPathArr = [];
                    return [4 /*yield*/, resolveDepress(targetDir)];
                case 1:
                    _a.sent();
                    _loop_1 = function (tgzPath) {
                        var _b, stdout, stderr;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var _a, stdout, stderr;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, asyncExec("tar -xvf ".concat(tgzPath, " -C ").concat((0, path_1.dirname)(tgzPath)))];
                                                    case 1:
                                                        _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                                                        resolve({ stdout: stdout, stderr: stderr });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 0);
                                    })];
                                case 1:
                                    _b = _c.sent(), stdout = _b.stdout, stderr = _b.stderr;
                                    console.log(stdout, stderr);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, tgzPathArr_1 = tgzPathArr;
                    _a.label = 2;
                case 2:
                    if (!(_i < tgzPathArr_1.length)) return [3 /*break*/, 5];
                    tgzPath = tgzPathArr_1[_i];
                    return [5 /*yield**/, _loop_1(tgzPath)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife");
//# sourceMappingURL=depressTgz.js.map