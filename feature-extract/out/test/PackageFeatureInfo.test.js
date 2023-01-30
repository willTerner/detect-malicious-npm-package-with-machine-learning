var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPackageFeatureInfo } from "../src/PackageFeatureInfo";
import { extractJSFilePath } from "../src/PackageJSONInfo";
test("test extract js file", () => __awaiter(void 0, void 0, void 0, function* () {
    expect(extractJSFilePath("start /B node preinstall.js & node preinstall.js")).toBe("preinstall.js");
}));
test("test package feature", () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield getPackageFeatureInfo("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/@azure-tests/perf-ai-form-recognizer/99.10.9/package");
    expect(result.packageSize).toBe(1454);
}));
//# sourceMappingURL=PackageFeatureInfo.test.js.map