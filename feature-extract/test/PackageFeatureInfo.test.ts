import { ResovlePackagePath } from "../src/ExtractFeature";
import { getPackageFeatureInfo } from "../src/PackageFeatureInfo";
import { extractJSFilePath } from "../src/PackageJSONInfo";

test("test extract js file", async () => {
   expect(extractJSFilePath("start /B node preinstall.js & node preinstall.js")).toBe("preinstall.js");
});

test("test package feature", async() => {
   const result = await getPackageFeatureInfo("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/@azure-tests/perf-ai-form-recognizer/99.10.9/package");
});