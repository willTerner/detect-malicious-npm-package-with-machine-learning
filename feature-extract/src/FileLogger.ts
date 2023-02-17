
import { FileHandle, open } from "fs/promises";
import { join } from "path";
import { getRootDirectory } from "./Util";



export class FileLogger {
   fileHandler: FileHandle;
   async init(logFilePath: string) {
      this.fileHandler = await open(logFilePath, "w+");
      return this;
   }

   async log(message: string) {
      await this.fileHandler.writeFile(message + " " + new Date().toLocaleString() + "\n");
   }

   async close() {
      await this.fileHandler.close();
   }
}

let logger: FileLogger;

export async function getFileLogger() {
   if (logger) {
      return logger;
   }
   logger = new FileLogger();
   const log_path = join(getRootDirectory(), 'log', 'error.log');
   await logger.init(log_path);
   return logger;
}


