
import { FileHandle, open } from "fs/promises";



export class FileLogger {
   fileHandler: FileHandle;
   async init(logFilePath: string) {
      this.fileHandler = await open(logFilePath, "w+");
      return this;
   }

   async log(message: string) {
      return this.fileHandler.writeFile(message + "\n");
   }

   close() {
      return this.fileHandler.close();
   }
}

let logger: FileLogger;

export async function getFileLogger() {
   if (logger) {
      return logger;
   }
   logger = new FileLogger();
   await logger.init("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/log/error.log");
   return logger;
}


