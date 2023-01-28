import { FileLogger } from "../src/FileLogger";

test("file logger", async() => {
   const logger = new FileLogger();
   await logger.init("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/log/error.log");
   await logger.log("hello");
   await logger.log("world");
   await logger.close();
});