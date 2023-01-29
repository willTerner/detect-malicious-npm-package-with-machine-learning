import chalk from "chalk";
import { stringify } from "csv-stringify/sync";
import { writeFile, opendir, readFile } from "fs/promises";
import { join } from "path";
import { getPackageFeatureInfo, PackageFeatureInfo } from "./PackageFeatureInfo";


const malicious_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious";

const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal";

const progress_json_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/progress.json";



export async function extractFeatureFromPackage(sourcePath: string, isMaliciousPackage: boolean, tgzPath: string) {
   const result: PackageFeatureInfo = await getPackageFeatureInfo(sourcePath, tgzPath);
   const fileName = result.packageName.replace(/\//g, "-");
   const csvPath = join(isMaliciousPackage ? malicious_path : normal_path, fileName + ".csv");
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
   featureArr.push(["useCrpytoAndZip", result.useCrpytoAndZip]);
   featureArr.push(["accessSensitiveAPI", result.accessSensitiveAPI]);
   await new Promise(resolve => {
      setTimeout(async() => {
        await writeFile(csvPath, stringify(featureArr, {
         cast: {
            "boolean": function(value) {
               if (value) {
                  return "true";
               }
               return "false";
            }
         }
        }));
        resolve(true);
     });
   });
}

export async function extractFeatureFromDir(dirPath: string, isMaliciousPath: boolean) {
   let oldPackageArr = JSON.parse(await readFile(progress_json_path, {encoding: "utf-8"})) as string[];

   let counter = 0;

   const max_package_number = 1900;

   let idx_ = Math.floor(oldPackageArr.length / max_package_number) + 1;

   const progress_detail_path = join("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material", idx_ + ".csv");

   let newPackageArr: string[] = [];

   async function resolveExtract(dirPath: string) {
      const dir = await opendir(dirPath);
      for await (const dirent of dir) {
         const currentFilePath = join(dirPath, dirent.name);
         if (dirent.isDirectory()) {
            await resolveExtract(currentFilePath);
         } else if (dirent.isFile() && dirent.name.endsWith(".tgz")) {
            const tgzPath = join(dirPath, dirent.name);
            const packagePath = join(dirPath, "package");
            if (oldPackageArr.indexOf(packagePath) < 0) {
               newPackageArr.push(packagePath);
               console.log(chalk("现在分析了" + counter + "个包"));
               await extractFeatureFromPackage(packagePath, isMaliciousPath, tgzPath);
               counter++;
               if (counter === max_package_number) {
                  //  更新progress.json
                  oldPackageArr = oldPackageArr.concat(newPackageArr);
                  const outputArr = newPackageArr.map(el => [el]);
                  await writeFile(progress_json_path, JSON.stringify(oldPackageArr));
                  await writeFile(progress_detail_path, stringify(outputArr));
                  process.exit(0);
               }
            }
         }
      }
   }

   await resolveExtract(dirPath);
}

