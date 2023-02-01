import chalk from "chalk";
import { stringify } from "csv-stringify/sync";
import { writeFile, opendir, readFile, readdir } from "fs/promises";
import { join } from "path";
import { getPackageFeatureInfo, PackageFeatureInfo } from "./PackageFeatureInfo";
import { test_malicious_path, test_normal_csv_path } from "./Paths";


const malicious_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious";

const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal";

const progress_json_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/progress.json";



export enum ResovlePackagePath {
   By_Knife,
   By_Normal,
   By_Duan,
   By_Test_Normal
}

function getDirectory(resolvePath: ResovlePackagePath) {
   if (resolvePath === ResovlePackagePath.By_Knife) {
      return malicious_path;
   }
   if (resolvePath === ResovlePackagePath.By_Normal) {
      return normal_path;
   }
   if (resolvePath === ResovlePackagePath.By_Duan) {
      return test_malicious_path;
   }
   if (resolvePath === ResovlePackagePath.By_Test_Normal) {
      return test_normal_csv_path;
   }
}


export async function extractFeatureFromPackage(sourcePath: string, resolvepath: ResovlePackagePath) {
   const result: PackageFeatureInfo = await getPackageFeatureInfo(sourcePath);
   const fileName = result.packageName.replace(/\//g, "-");
   const csvPath = join(getDirectory(resolvepath), fileName + ".csv");
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

export async function extractFeatureFromDir(dirPath: string, resolvePath: ResovlePackagePath) {
   let oldPackageArr = JSON.parse(await readFile(progress_json_path, {encoding: "utf-8"})) as string[];

   let counter = 0;

   const max_package_number = 100;

   let idx_ = Math.floor(oldPackageArr.length / max_package_number) + 1;

   const progress_detail_path = join("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material", idx_ + ".csv");

   let newPackageArr: string[] = [];

   async function resolveExtractByKnife(dirPath: string) {
      const dir = await opendir(dirPath);
      for await (const dirent of dir) {
         const currentFilePath = join(dirPath, dirent.name);
         if (dirent.isDirectory()) {
            await resolveExtractByKnife(currentFilePath);
         } else if (dirent.isFile() && dirent.name.endsWith(".tgz")) {
            const packagePath = join(dirPath, "package");
            await resolveExtract(packagePath);
         }
      }
   }

   async function resolveExtractByNormal(dirPath: string) {
      const dir = await opendir(dirPath);
      for await (const dirent of dir) {
         if (dirent.isDirectory()) {
            const packagePath = join(dirPath, dirent.name, "package");
            await resolveExtract(packagePath);
         }
      }
   }

   async function resolveExtract(packagePath) {
      if (oldPackageArr.indexOf(packagePath) < 0) {
         newPackageArr.push(packagePath);
         console.log(chalk("现在分析了" + counter + "个包"));
         await extractFeatureFromPackage(packagePath, resolvePath);
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

   if (resolvePath === ResovlePackagePath.By_Knife) {
      await resolveExtractByKnife(dirPath);
   }

   if (resolvePath === ResovlePackagePath.By_Normal || resolvePath === ResovlePackagePath.By_Duan || resolvePath === ResovlePackagePath.By_Test_Normal) {
      await resolveExtractByNormal(dirPath);
   }
   
}

