var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileLogger } from "../src/FileLogger";
test("file logger", () => __awaiter(void 0, void 0, void 0, function* () {
    const logger = new FileLogger();
    yield logger.init("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/log/error.log");
    yield logger.log("hello");
    yield logger.log("world");
    yield logger.close();
}));
//# sourceMappingURL=FileLogger.test.js.map