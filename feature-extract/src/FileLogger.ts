
import { type FileHandle, open } from 'fs/promises'
import { join } from 'path'
import { getRootDirectory } from './util'

export class FileLogger {
  fileHandler: FileHandle
  async init (logFilePath: string) {
    this.fileHandler = await open(logFilePath, 'w+')
    return this
  }

  async log (message: string) {
    await this.fileHandler.writeFile(message + ' ' + new Date().toLocaleString() + '\n')
  }

  async close () {
    await this.fileHandler.close()
  }
}

let logger: FileLogger | undefined

export async function getFileLogger (): Promise<FileLogger> {
  if (logger != null) {
    return logger
  }
  logger = new FileLogger()
  const logPath = join(getRootDirectory(), 'log', 'error.log')
  await logger.init(logPath)
  return logger
}
