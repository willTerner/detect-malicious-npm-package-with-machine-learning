var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { open } from "fs/promises";
export class FileLogger {
    init(logFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fileHandler = yield open(logFilePath, "w+");
            return this;
        });
    }
    log(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fileHandler.writeFile(message + "\n");
        });
    }
    close() {
        return this.fileHandler.close();
    }
}
let logger;
export function getFileLogger() {
    return __awaiter(this, void 0, void 0, function* () {
        if (logger) {
            return logger;
        }
        logger = new FileLogger();
        yield logger.init("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/log/error.log");
        return logger;
    });
}
//# sourceMappingURL=FileLogger.js.map