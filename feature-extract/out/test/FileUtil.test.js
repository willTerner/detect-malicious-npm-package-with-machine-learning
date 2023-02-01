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
test("test dir size func", () => __awaiter(void 0, void 0, void 0, function* () {
    const jsonContent = yield readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-10000.json", { encoding: "utf-8" });
    expect(JSON.parse(jsonContent).length).toBe(9998);
}));
//# sourceMappingURL=FileUtil.test.js.map