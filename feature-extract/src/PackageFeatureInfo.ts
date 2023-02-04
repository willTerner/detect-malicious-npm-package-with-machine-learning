import { opendir, readFile, stat } from "fs/promises";
import { getPackageJSONInfo, PackageJSONInfo } from "./PackageJSONInfo";
import { basename, join } from "path";
import { minEditDistance } from "./EditDistance";
import { getDomainPattern, IP_Pattern, Network_Command_Pattern, SensitiveStringPattern } from "./Patterns";
import { getAllInstallScripts } from "./GetInstallScripts";
import { scanJSFileByAST } from "./ASTUtil";
import { matchUseRegExp } from "./RegExpUtil";
import { Worker, workerData } from "worker_threads";
import chalk from "chalk";
import { writeFile } from "fs/promises";
import { stringify } from "csv-stringify/sync";
import { fork } from "child_process";
import { IGNORE_JS_FILES } from "./IgnoreJSFiles";
import { getDirectorySizeInBytes } from "./Util";


const BABEL_STUCK_FILES_PATH = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/babel-struck-files.csv";

const ALLOWED_MAX_JS_SIZE = 2 * 1024 * 1024;

export interface PackageFeatureInfo {
   editDistance: number;
   averageBracketNumber: number;
   packageSize: number;
   dependencyNumber: number;
   devDependencyNumber: number;
   numberOfJSFiles: number;
   totalBracketsNumber: number;
   hasInstallScripts: boolean;
   containIP: boolean;
   useBase64Conversion: boolean;
   containBase64String: boolean;
   createBufferFromASCII: boolean;
   containBytestring: boolean;
   containDomain: boolean;
   useBufferFrom: boolean;
   useEval: boolean;
   requireChildProcessInJSFile: boolean;
   requireChildProcessInInstallScript: boolean;
   accessFSInJSFile: boolean;
   accessFSInInstallScript: boolean;
   accessNetworkInJSFile: boolean;
   accessNetworkInInstallScript: boolean;
   accessProcessEnvInJSFile: boolean;
   accessProcessEnvInInstallScript: boolean;
   accessCryptoAndZip: boolean;
   accessSensitiveAPI: boolean;
   containSuspiciousString: boolean;
   installCommand: string[],
   executeJSFiles: string[],
   packageName: string,
   version: string,
}

async function parseJSAsync(code: string, featureSet: PackageFeatureInfo, isInstallScript: boolean, targetJSFilePath: string): Promise<PackageFeatureInfo> {
   return new Promise(async(resolve, reject) => {
     const childProcess = fork("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/out/src/ProcessSingleFileProces.js");
     const sendData = {
         code,
         featureSet,
         isInstallScript,
         targetJSFilePath
     };

     childProcess.send(sendData);

     const MAX_WAIT_TIME = 2000;
     const start_time_stamp = Date.now();
     let timer_id = setInterval(async() => {
         const time_diff = Date.now() - start_time_stamp;
         console.log(chalk.green("时间差为" + time_diff));
         if (time_diff >= MAX_WAIT_TIME) {
            // babel处理代码卡住，停止转义，并记录在文件中
            await writeFile(BABEL_STUCK_FILES_PATH,  stringify([[targetJSFilePath]]));
            childProcess.kill();
            console.log(chalk.red("调用terminate"));
            reject(new Error("babel struck at file" + targetJSFilePath));
         }
     }, 10);

     childProcess.on('message', resolve);
     childProcess.on('error', reject);
     childProcess.on('exit', (code) => {
         console.log("babel 处理进程退出信号为" + code);
         clearInterval(timer_id);
     });
   });
};

/**
 * 
 * @param dirPath 源码包（目录下有package.json文件）的路径
 * @param tgzPath 压缩包的路径
 */
export async function getPackageFeatureInfo(dirPath: string): Promise<PackageFeatureInfo> {
   let result: PackageFeatureInfo = {
      editDistance: 0,
      averageBracketNumber: 0,
      packageSize: 0,
      dependencyNumber: 0,
      devDependencyNumber: 0,
      numberOfJSFiles: 0,
      totalBracketsNumber: 0,
      hasInstallScripts: false,
      containIP: false,
      useBase64Conversion: false,
      containBase64String: false,
      createBufferFromASCII: false,
      containBytestring: false,
      containDomain: false,
      useBufferFrom: false,
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
      packageName: "",
      version: "",
   };
   const packageJSONPath = join(dirPath, "package.json");
   const packageJSONInfo: PackageJSONInfo = await getPackageJSONInfo(packageJSONPath);
   Object.assign(result, packageJSONInfo);

   result.editDistance = await minEditDistance(packageJSONInfo.packageName);

 
   result.packageSize = getDirectorySizeInBytes(dirPath);


   // 分析install hook command
   for (const scriptContent of packageJSONInfo.installCommand) {
      {
         const matchResult = scriptContent.match(IP_Pattern);
         if (matchResult) {
            result.containIP = true;
         }
      }
      {
         const matchResult = scriptContent.match(getDomainPattern());
         if (matchResult) {
            result.containDomain = true;
         }
      }
     {
         const matchResult = scriptContent.match(Network_Command_Pattern);
         if (matchResult) {
            result.accessNetworkInInstallScript = true;
         }
      }
      {
         const matchResult = scriptContent.match(SensitiveStringPattern);
         if (matchResult) {
            result.containSuspiciousString = true;
         }
      }
   }
   
   // 分析install hook js files
   await getAllInstallScripts(result.executeJSFiles);

   async function traverseDir(dirPath: string) {
      if (basename(dirPath) === "node_modules") {
         return ;
      }
      const dir = await opendir(dirPath);
      for await (const dirent of dir) {
         const jsFilePath = join(dirPath, dirent.name);
         const isInstallScriptFile = result.executeJSFiles.findIndex(filePath => filePath === jsFilePath) >= 0;
         if (dirent.isFile() && (dirent.name.endsWith(".js") || isInstallScriptFile)) {
            result.numberOfJSFiles++;
            await new Promise((resolve) => {
               setTimeout(async () => {
                  let targetJSFilePath = join(dirPath, dirent.name);
                  let jsFileContent = await readFile(targetJSFilePath, {encoding: "utf-8"});
                  const fileInfo = await stat(targetJSFilePath);
                  console.log(chalk.blue("现在分析的js文件路径是") + chalk.red(targetJSFilePath) + "  文件大小为" + fileInfo.size);
                  if (fileInfo.size <= ALLOWED_MAX_JS_SIZE && IGNORE_JS_FILES.indexOf(targetJSFilePath) < 0) {
                     await scanJSFileByAST(jsFileContent, result, isInstallScriptFile, targetJSFilePath);
                     matchUseRegExp(jsFileContent, result);
                  }
                  resolve(true);
               }, 0);
            });
         } else if (dirent.isDirectory()) {
            await traverseDir(join(dirPath, dirent.name));
         }
      }
   }
   await traverseDir(dirPath);
   result.averageBracketNumber = result.totalBracketsNumber / result.numberOfJSFiles;
   return result;
}