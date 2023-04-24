import { exec } from 'node:child_process'
import fs, { readdirSync } from 'node:fs'
import { promisify } from 'node:util'
import path from 'path'
import { readFile, writeFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { basename, join } from 'node:path'

export function getDirectorySizeInBytes (dir) {
  let totalSize = 0

  function walk (currentPath) {
    const files = fs.readdirSync(currentPath)

    for (const file of files) {
      const filePath = path.join(currentPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isFile()) {
        totalSize += stats.size
      } else if (stats.isDirectory()) {
        walk(filePath)
      }
    }
  }

  walk(dir)

  return totalSize
}

export function getRootDirectory () {
  if (isProduction()) {
    return __dirname
  }
  const currentFilePath = process.argv[1]
  let projectRootPath = currentFilePath

  while (!fs.existsSync(path.join(projectRootPath, 'package.json'))) {
    projectRootPath = path.dirname(projectRootPath)
  }

  return projectRootPath
}

export const asyncExec = promisify(exec)

export async function getCSVFromFile (filePath: string): Promise<string[][]> {
  return parse(await readFile(filePath, { encoding: 'utf-8' }))
}

export async function writeCSVFile (filePath: string, arr: string[][]) {
  await writeFile(filePath, stringify(arr))
}

/**
 *
 * @param dirPath 目录，目录中包含npm包，可以是多级
 * @returns 返回dirPath中所有npm包的路径
 */
export async function getPackagesFromDir (dirPath: string) {
  const result: string[] = []
  async function resolve (dirPath: string) {
    const files = readdirSync(dirPath, { withFileTypes: true })
    for (const file of files) {
      if (file.name === 'package.json' && basename(dirPath) === 'package') {
        result.push(dirPath)
        return
      }
      if (file.isDirectory() && file.name !== 'node_modules') {
        await resolve(join(dirPath, file.name))
      }
    }
  }
  await resolve(dirPath)
  return result
}

/**
 *
 * @param fileName 想要作为文件名的字符串
 * @returns 返回macos上有效的文件名字符串，对fileName中的/全部替换成-
 */
export function getValidFileName (fileName: string) {
  return fileName.replace(/\//g, '-')
}

/**
 *
 * @param path 文件路径名称
 * @return 返回path对应的文件名称，不包括扩展名
 */
export function getFileName (filePath: string) {
  const fileName = basename(filePath)
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex < 0) {
    return fileName
  }
  return fileName.substring(0, dotIndex)
}

export function getErrorInfo (error: Error) {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `error name: ${error.name}\nerror message: ${error.message}\nerror stack: ${error.stack}`
}

export function isProduction () {
  return process.env.NODE_ENV === 'development'
}
