var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from "fs/promises";
import { bytestring_pattern2 } from "./Patterns";
export function matchUseRegExp(code, result, positionRecorder, targetJSFilePath) {
    const matchResult1 = code.match(bytestring_pattern2);
    if (matchResult1) {
        result.containBytestring = true;
        positionRecorder.addRecord('containBytestring', {
            filePath: targetJSFilePath,
            content: matchResult1[1],
        });
    }
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = yield readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js", { encoding: "utf-8" });
        // console.log(matchResult(fileContent));
    });
}
//test();
//# sourceMappingURL=RegExpUtil.js.map