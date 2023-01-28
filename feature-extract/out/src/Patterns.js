var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFileSync } from "fs";
export const IP_Pattern = /(\d{1,3}\.){3}\d{1,3}/;
export const base64_Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
export const bytestring_Pattern1 = /^(0x[0-9a-f]{1,4})+$/i; // 没用，这个是16进制
export const bytestring_pattern2 = /\".*(\\x[0-9a-f]{2})+.*\"/i;
let domain_pattern;
if (!domain_pattern) {
}
export function getDomainPattern() {
    if (domain_pattern) {
        return domain_pattern;
    }
    let domain_pattern_string = "([a-zA-Z0-9\\-]+\\.)+";
    const fileContent = readFileSync("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-domains.json", { encoding: "utf-8" });
    const domainArr = JSON.parse(fileContent)["most-used-tlds"];
    for (let i = 0; i < domainArr.length; i++) {
        const domain = domainArr[i].substring(1);
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
export const Network_Command_Pattern = /(curl)|(wget)|(host)|(ping)|(\/dev\/tcp)|(ping)/;
export const SensitiveStringPattern = /(\/etc\/shadow)|(\.bashrc)|(.zshrc)|(\/etc\/hosts)|(\/etc\/passwd)|(aes)|(des)|(\/bin\/sh)|(shutdown)/;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const pattern = yield getDomainPattern();
        console.log("taobao-cn/etc".match(SensitiveStringPattern));
    });
}
//test();
//# sourceMappingURL=Patterns.js.map