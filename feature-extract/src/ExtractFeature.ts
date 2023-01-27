import { stringify } from "csv-stringify/sync";
import { writeFile, opendir } from "fs/promises";
import { join } from "path";
import { getPackageFeatureInfo, PackageFeatureInfo } from "./PackageFeatureInfo";


const malicious_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious";

const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal";

 async function extractFeatureFromFile(sourcePath: string, isMaliciousPackage: boolean) {
   const result: PackageFeatureInfo = await getPackageFeatureInfo(sourcePath);
   const csvPath = join(isMaliciousPackage ? malicious_path : normal_path, result.packageName + ".csv");
   const featureArr: [string, number|boolean][] = [];
   featureArr.push(["editDistance", result.editDistance]);
   featureArr.push(["averageBracket", result.averageBracketNumber]);
   featureArr.push(["packageSize", result.packageSize]);
   featureArr.push(["dependencyNumber", result.dependencyNumber]);
   featureArr.push(["devDependencyNumber", result.devDependencyNumber]);
   featureArr.push(["jsFileNumber", result.numberOfJSFiles]);
   featureArr.push(["bracketNumber", result.totalBracketsNumber]);
   featureArr.push(["hasInstallScript", result.hasInstallScripts]);
   featureArr.push(["containIP", result.containIP]);
   featureArr.push(["useBase64Conversion", result.useBase64Conversion]);
   featureArr.push(["containBase64String", result.containBase64String]);
   featureArr.push(["createBufferFromASCII", result.createBufferFromASCII]);
   featureArr.push(["containBytestring", result.containBytestring]);
   featureArr.push(["containDomain", result.containDomain]);
   featureArr.push(["useBufferFrom", result.useBufferFrom]);
   featureArr.push(["useEval", result.useEval]);
   featureArr.push(["requireChildProcessInJSFile", result.requireChildProcessInJSFile]);
   featureArr.push(["requireChildProcessInInstallScript", result.requireChildProcessInInstallScript]);
   featureArr.push(["accessFSInJSFile", result.accessFSInJSFile]);
   featureArr.push(["accessFSInInstallScript", result.accessFSInInstallScript]);
   featureArr.push(["accessNetworkInJSFile", result.accessNetworkInJSFile]);
   featureArr.push(["accessNetworkInInstallScript", result.accessNetworkInInstallScript]);
   featureArr.push(["accessProcessEnvInJSFile", result.accessProcessEnvInJSFile]);
   featureArr.push(["accessProcessEnvInInstallScript", result.accessProcessEnvInInstallScript]);
   featureArr.push(["containSuspicousString", result.containSuspiciousString]);
   await new Promise(resolve => {
      setTimeout(async() => {
        await writeFile(csvPath, stringify(featureArr));
        resolve(true);
     });
   });
}

export async function extractFeatureFromDir(dirPath: string, isMaliciousPath: boolean) {
   const dir = await opendir(dirPath);
   for await (const dirent of dir) {
      if (dirent.isDirectory()) {
         await extractFeatureFromDir(join(dirPath, dirent.name), isMaliciousPath);
      } else if (dirent.isFile() && dirent.name.endsWith(".tgz")) {
         await extractFeatureFromFile(join(dirPath, "package"), isMaliciousPath);
      }
   }
}

