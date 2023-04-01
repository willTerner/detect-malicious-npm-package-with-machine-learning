import { accessSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import { asyncExec, getFileName } from '.'
import { isEnglish } from '../config'
import { Logger } from '../Logger'

export async function depressSinglePackage (tgzPath: string, depressDir: string) {
  return await asyncExec(`tar -xvf ${tgzPath} -C ${depressDir}`)
}

function getAllTgzPath (dirPath: string) {
  const result: string[] = []

  function resolve (dirPath: string) {
    const files = readdirSync(dirPath, { withFileTypes: true })
    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.tgz')) {
        result.push(join(dirPath, file.name))
      }
      if (file.isDirectory()) {
        resolve(join(dirPath, file.name))
      }
    }
  }

  resolve(dirPath)

  return result
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDepressErrorMessage (tgzPath: string) {
  if (isEnglish()) {
    return `error happened when depressing ${tgzPath}`
  }
  return `在解压${tgzPath}的过程中发生错误`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDepressInfoMessage (tgzPath: string, depressPath: string) {
  if (isEnglish()) {
    return `depress ${tgzPath} to ${depressPath}`
  }
  return `解压${tgzPath}至${depressPath}`
}

/**
 * 找出dirPath中所有的npm压缩包，解压至dirPath/packageName下
 * @param dirPath 包含npm包压缩包的目录
 */
export async function depressPackages (dirPath: string) {
  const tgzPaths = getAllTgzPath(dirPath)
  for (const tgzPath of tgzPaths) {
    const depressDir = join(dirPath, getFileName(tgzPath))
    try {
      accessSync(depressDir)
    } catch (e) {
      mkdirSync(depressDir)
    }
    const { stdout, stderr } = await depressSinglePackage(tgzPath, depressDir)
    Logger.info(stdout + stderr)
    // Logger.info(getDepressInfoMessage(tgzPath, depressDir));
  }
}

export async function downloadSinglePackage (packageName: string, saveDir: string) {
  return await asyncExec(`cd ${saveDir} && npm pack ${packageName}`)
}
