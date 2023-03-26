import chalk from 'chalk';
import { access } from 'fs/promises';
import {stat, readFile} from 'fs/promises';
import { dirname, join } from 'path';
import { should_use_console_log } from '../constants';



export async function getPackageSize(tgzPath: string) {
   const fileInfo = await stat(tgzPath);
   return fileInfo.size;
}

export interface PackageJSONInfo {
   dependencyNumber: number;
   devDependencyNumber: number;
   hasInstallScripts: boolean;
   installCommand: string[];
   executeJSFiles: string[];
   packageName: string;
   version: string;
}



/**
 * 
 * @param filePath package.json文件路径
 * @return PackageJSONINFO
 */
export async function getPackageJSONInfo(filePath: string): Promise<PackageJSONInfo> {
   const result: PackageJSONInfo = {
      dependencyNumber: 0,
      devDependencyNumber: 0,
      hasInstallScripts: false,
      installCommand: [],
      executeJSFiles: [],
      packageName: "",
      version: "",
   };
   const fileContent = await readFile(filePath, {encoding: "utf-8"});
   const metaData = JSON.parse(fileContent) as any;
   result.dependencyNumber = Object.keys(metaData?.dependencies || {}).length;
   result.devDependencyNumber = Object.keys(metaData?.devDependencies || {}).length;
   result.hasInstallScripts = Boolean(metaData?.scripts?.preinstall) || Boolean(metaData?.scripts?.install) || Boolean(metaData?.scripts?.postinstall);   
   const executeJSFiles: string[] = [];
   result.packageName = metaData?.name;
   result.version = metaData?.version;
   const preinstall = metaData?.scripts?.preinstall;
   const install = metaData?.scripts?.install;
   const postinstall = metaData?.scripts?.postinstall;
   const parentDir = dirname(filePath);
   if (preinstall) {
      result.installCommand.push(preinstall);
      let jsFile = extractJSFilePath(preinstall);
      if (jsFile) {
         try{
            jsFile = join(parentDir, jsFile);
            await access(jsFile);
            executeJSFiles.push(jsFile);
         }catch(error) {
            should_use_console_log && console.log(chalk.red(filePath + "中的node执行的脚本不存在"));
         }
      }
   }
   if (install) {
      result.installCommand.push(install);
      let jsFile = extractJSFilePath(install);
      if (jsFile) {
         try{
            jsFile = join(parentDir, jsFile);
            await access(jsFile);
            executeJSFiles.push(jsFile);
         }catch(error) {
            should_use_console_log && console.log(chalk.red(filePath + "中的node执行的脚本不存在"));
         }
      }
   }
   if (postinstall) {
      result.installCommand.push(postinstall);
      let jsFile = extractJSFilePath(postinstall);
      if (jsFile) {
         jsFile = join(parentDir, jsFile);
         try{
            await access(jsFile);
            executeJSFiles.push(jsFile);
         }catch(error) {
            should_use_console_log && console.log(chalk.red(filePath + "中的node执行的脚本不存在"));
         }
      }
   }
   result.executeJSFiles = executeJSFiles;
   return result;
}

export function extractJSFilePath(scriptContent: string): string | undefined {
   const jsFileReg = /node\s+?(.+?\.js)/;
   const matchResult = scriptContent.match(jsFileReg);
   if (matchResult) {
      return matchResult[1];
   }
   return undefined;
}