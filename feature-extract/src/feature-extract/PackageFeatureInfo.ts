import { opendir, readFile, stat } from 'fs/promises'
import { getPackageJSONInfo, type PackageJSONInfo } from './PackageJSONInfo'
import { basename, join } from 'path'
import { getDomainPattern, IP_Pattern, Network_Command_Pattern, SensitiveStringPattern } from './Patterns'
import { getAllInstallScripts } from './GetInstallScripts'
import { scanJSFileByAST } from './AST'
import { matchUseRegExp } from './RegExp'
import chalk from 'chalk'
import { should_use_console_log } from '../constants'
import { PositionRecorder } from './PositionRecorder'
import { setPositionRecorder } from '../config'

const ALLOWED_MAX_JS_SIZE = 2 * 1024 * 1024

export interface PackageFeatureInfo {
  hasInstallScripts: boolean
  containIP: boolean
  useBase64Conversion: boolean
  useBase64ConversionInInstallScript: boolean
  containBase64StringInJSFile: boolean
  containBase64StringInInstallScript: boolean
  containDomainInJSFile: boolean
  containDomainInInstallScript: boolean
  containBytestring: boolean
  useBuffer: boolean
  useEval: boolean
  requireChildProcessInJSFile: boolean
  requireChildProcessInInstallScript: boolean
  accessFSInJSFile: boolean
  accessFSInInstallScript: boolean
  accessNetworkInJSFile: boolean
  accessNetworkInInstallScript: boolean
  accessProcessEnvInJSFile: boolean
  accessProcessEnvInInstallScript: boolean
  accessCryptoAndZip: boolean
  accessSensitiveAPI: boolean
  containSuspiciousString: boolean
  installCommand: string[]
  executeJSFiles: string[]
  packageName: string
  version: string
}

/**
 *
 * @param dirPath 源码包（目录下有package.json文件）的路径
 * @param tgzPath 压缩包的路径
 */
export async function getPackageFeatureInfo (dirPath: string): Promise<PackageFeatureInfo> {
  const positionRecorder = new PositionRecorder()
  const result: PackageFeatureInfo = {
    hasInstallScripts: false,
    containIP: false,
    useBase64Conversion: false,
    useBase64ConversionInInstallScript: false,
    containBase64StringInJSFile: false,
    containBase64StringInInstallScript: false,
    containBytestring: false,
    containDomainInJSFile: false,
    containDomainInInstallScript: false,
    useBuffer: false,
    useEval: false,
    requireChildProcessInJSFile: false,
    requireChildProcessInInstallScript: false,
    accessFSInJSFile: false,
    accessFSInInstallScript: false,
    accessNetworkInJSFile: false,
    accessNetworkInInstallScript: false,
    accessProcessEnvInJSFile: false,
    accessProcessEnvInInstallScript: false,
    accessCryptoAndZip: false,
    accessSensitiveAPI: false,
    containSuspiciousString: false,
    installCommand: [],
    executeJSFiles: [],
    packageName: '',
    version: ''
  }
  const packageJSONPath = join(dirPath, 'package.json')
  const packageJSONInfo: PackageJSONInfo = await getPackageJSONInfo(packageJSONPath)
  Object.assign(result, packageJSONInfo)

  // result.editDistance = await minEditDistance(packageJSONInfo.packageName);

  // result.packageSize = getDirectorySizeInBytes(dirPath);

  if (packageJSONInfo.hasInstallScripts) {
    positionRecorder.addRecord('hasInstallScripts', {
      filePath: packageJSONPath,
      content: packageJSONInfo.installCommand[0]
    })
  }

  // 分析install hook command
  for (const scriptContent of packageJSONInfo.installCommand) {
    {
      const matchResult = scriptContent.match(IP_Pattern)
      if (matchResult != null) {
        result.containIP = true
        positionRecorder.addRecord('containIP', { filePath: packageJSONPath, content: scriptContent })
      }
    }
    {
      const matchResult = scriptContent.match(getDomainPattern())
      if (matchResult != null) {
        result.containDomainInInstallScript = true
        positionRecorder.addRecord('containDomainInInstallScript', {
          filePath: packageJSONPath,
          content: scriptContent
        })
      }
    }
    {
      const matchResult = scriptContent.match(Network_Command_Pattern)
      if (matchResult != null) {
        result.accessNetworkInInstallScript = true
        positionRecorder.addRecord('accessNetworkInInstallScript', {
          filePath: packageJSONPath,
          content: scriptContent
        })
      }
    }
    {
      const matchResult = scriptContent.match(SensitiveStringPattern)
      if (matchResult != null) {
        result.containSuspiciousString = true
        positionRecorder.addRecord('containSuspiciousString', {
          filePath: packageJSONPath,
          content: scriptContent
        })
      }
    }
  }

  // 分析install hook js files
  await getAllInstallScripts(result.executeJSFiles)

  async function traverseDir (dirPath: string) {
    if (basename(dirPath) === 'node_modules') {
      return
    }
    const dir = await opendir(dirPath)
    for await (const dirent of dir) {
      const jsFilePath = join(dirPath, dirent.name)
      const isInstallScriptFile = result.executeJSFiles.findIndex(filePath => filePath === jsFilePath) >= 0
      if (dirent.isFile() && (dirent.name.endsWith('.js') || isInstallScriptFile)) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            const targetJSFilePath = join(dirPath, dirent.name)
            const jsFileContent = await readFile(targetJSFilePath, { encoding: 'utf-8' })
            const fileInfo = await stat(targetJSFilePath)
            should_use_console_log && console.log(chalk.blue('现在分析的js文件路径是') + chalk.red(targetJSFilePath) + '  文件大小为' + fileInfo.size)
            if (fileInfo.size <= ALLOWED_MAX_JS_SIZE) {
              await scanJSFileByAST(jsFileContent, result, isInstallScriptFile, targetJSFilePath, positionRecorder)
              matchUseRegExp(jsFileContent, result, positionRecorder, targetJSFilePath)
            }
            resolve(true)
          }, 0)
        })
      } else if (dirent.isDirectory()) {
        await traverseDir(join(dirPath, dirent.name))
      }
    }
  }
  await traverseDir(dirPath)
  setPositionRecorder(positionRecorder)
  return result
}
