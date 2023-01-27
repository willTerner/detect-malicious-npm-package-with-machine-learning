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
exports.minEditDistance = void 0;
var promises_1 = require("node:fs/promises");
var jsonContent = "";
/**
 * @desciption
 * + 比较packageName和流行包名称的莱文斯坦距离，求莱文斯坦的算法<https://baike.baidu.com/item/%E8%8E%B1%E6%96%87%E6%96%AF%E5%9D%A6%E8%B7%9D%E7%A6%BB/14448097#4>
 * +  top-1000.json 包含最流行的10000个包
 * @return 返回最小的距离
 */
function minEditDistance(packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var minDistance, popularPackageNames, _i, popularPackageNames_1, popularPackageName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    minDistance = Number.MAX_SAFE_INTEGER;
                    if (!!jsonContent) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, promises_1.readFile)("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-1000.json", { encoding: "utf-8" })];
                case 1:
                    jsonContent = _a.sent();
                    _a.label = 2;
                case 2:
                    popularPackageNames = JSON.parse(jsonContent);
                    for (_i = 0, popularPackageNames_1 = popularPackageNames; _i < popularPackageNames_1.length; _i++) {
                        popularPackageName = popularPackageNames_1[_i];
                        minDistance = Math.min(minDistance, editDistance(packageName, popularPackageName.name));
                    }
                    return [2 /*return*/, minDistance];
            }
        });
    });
}
exports.minEditDistance = minEditDistance;
function editDistance(s1, s2) {
    var dp = new Array(s1.length + 1);
    for (var i = 0; i < dp.length; i++) {
        dp[i] = new Array(s2.length + 1).fill(0);
    }
    for (var i = 0; i < s2.length + 1; i++) {
        dp[0][i] = i;
    }
    for (var i = 0; i < s1.length + 1; i++) {
        dp[i][0] = i;
    }
    for (var i = 1; i < s1.length + 1; i++) {
        for (var j = 1; j < s2.length + 1; j++) {
            var replaceCost = 1;
            if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
                replaceCost = 0;
            }
            dp[i][j] = Math.min(dp[i][j - 1] + 1, dp[i - 1][j] + 1, dp[i - 1][j - 1] + replaceCost);
        }
    }
    return dp[s1.length][s2.length];
}
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = console).log;
                    return [4 /*yield*/, minEditDistance("eventstream")];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
//test();
//# sourceMappingURL=EditDistance.js.map