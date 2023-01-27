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
exports.SensitiveStringPattern = exports.Network_Command_Pattern = exports.getDomainPattern = exports.bytestring_pattern2 = exports.bytestring_Pattern1 = exports.base64_Pattern = exports.IP_Pattern = void 0;
var fs_1 = require("fs");
exports.IP_Pattern = /(\d{1,3}\.){3}\d{1,3}/;
exports.base64_Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
exports.bytestring_Pattern1 = /^(0x[0-9a-f]{1,4})+$/i; // 没用，这个是16进制
exports.bytestring_pattern2 = /\".*(\\x[0-9a-f]{2})+.*\"/i;
var domain_pattern;
if (!domain_pattern) {
}
function getDomainPattern() {
    if (domain_pattern) {
        return domain_pattern;
    }
    var domain_pattern_string = "([a-zA-Z0-9\\-]+\\.)+";
    var fileContent = (0, fs_1.readFileSync)("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-domains.json", { encoding: "utf-8" });
    var domainArr = JSON.parse(fileContent)["most-used-tlds"];
    for (var i = 0; i < domainArr.length; i++) {
        var domain = domainArr[i].substring(1);
        if (i === 0) {
            domain_pattern_string += "(" + domain + "|";
        }
        else if (i < domainArr.length - 1) {
            domain_pattern_string += domain + "|";
        }
        else {
            domain_pattern_string += domain + ")";
        }
    }
    domain_pattern = new RegExp(domain_pattern_string);
    return domain_pattern;
}
exports.getDomainPattern = getDomainPattern;
exports.Network_Command_Pattern = /(curl)|(wget)|(host)|(ping)|(\/dev\/tcp)|(ping)/;
exports.SensitiveStringPattern = /(\/etc\/shadow)|(\.bashrc)|(.zshrc)|(\/etc\/hosts)|(\/etc\/passwd)|(aes)|(des)|(\/bin\/sh)|(shutdown)/;
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var pattern;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDomainPattern()];
                case 1:
                    pattern = _a.sent();
                    console.log("taobao-cn/etc".match(exports.SensitiveStringPattern));
                    return [2 /*return*/];
            }
        });
    });
}
//test();
//# sourceMappingURL=Patterns.js.map