/* eslint-disable no-useless-catch */
import { parse } from '@babel/core'
import traverse from '@babel/traverse'
import { accessSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { isStringLiteral } from '@babel/types'
import { getFileLogger } from '../FileLogger'

/**
 *
 * @param installScripts install hook中js file的路径
 * @return 所有在install hook中执行的js file路径
 */
export async function getAllInstallScripts (installScripts: string[]) {
  async function resolveAllInstallScripts (installScripts: string[], idx: number) {
    if (idx >= installScripts.length) {
      return
    }
    const logger = await getFileLogger()
    const codeContent = readFileSync(installScripts[idx], {
      encoding: 'utf-8'
    })
    let ast: any
    try {
      ast = parse(codeContent, {
        sourceType: 'unambiguous'
      })
    } catch (error) {
      await logger.log('现在分析的文件是: ' + installScripts[idx])
      const errorObj = error as Error
      await logger.log('error名称: ' + errorObj.name)
      await logger.log('error信息' + errorObj.message)
      await logger.log('错误栈' + errorObj.stack)
    }
    try {
      traverse(ast, {
        CallExpression: function (path) {
          // @ts-expect-error uselesss lint error
          if (path.node.callee.name === 'require') {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                const moduleName = path.node.arguments[0].value
                try {
                  if (moduleName.startsWith('/') || moduleName.startsWith('./') || moduleName.startsWith('../')) {
                    let importScript = join(dirname(installScripts[idx]), moduleName)
                    if (importScript.endsWith('.js') || !importScript.includes('.')) {
                      if (!importScript.endsWith('.js')) {
                        importScript = importScript + '.js'
                      }
                      try {
                        accessSync(importScript)
                        installScripts.push(importScript)
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  }
                } catch (error) {
                  throw error
                }
              }
            }
          }
        }
      })
    } catch (error) {
      await logger.log('现在分析的文件是: ' + installScripts[idx])
      const errorObj = error as Error
      await logger.log('error名称: ' + errorObj.name)
      await logger.log('error信息' + errorObj.message)
      await logger.log('错误栈' + errorObj.stack)
    }
    await resolveAllInstallScripts(installScripts, idx + 1)
  }

  await resolveAllInstallScripts(installScripts, 0)
}

// let filePaths = ["/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js"];
// getAllInstallScripts(filePaths);
// console.log(filePaths);
