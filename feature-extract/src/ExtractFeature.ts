import chalk from "chalk";
import { stringify } from "csv-stringify/sync";
import { writeFile, opendir, readFile } from "fs/promises";
import { join } from "path";
import { getRootDirectory } from "./Util";
import { getPackageFeatureInfo, PackageFeatureInfo } from "./PackageFeatureInfo";
import { malicious_csv_path, normal_csv_path, progress_json_path, should_use_console_log } from "./commons";




export enum ResovlePackagePath {
   By_Knife,
   By_Normal1,
   By_Duan,
   By_Normal2,
   By_Single_Package,
   None,
}

function getDirectory(resolvePath: ResovlePackagePath) {
   if (resolvePath === ResovlePackagePath.By_Knife || resolvePath === ResovlePackagePath.By_Duan) {
      return malicious_csv_path;
   }
   if (resolvePath === ResovlePackagePath.By_Normal1 || resolvePath === ResovlePackagePath.By_Normal2) {
      return normal_csv_path;
   }
   if (resolvePath === ResovlePackagePath.By_Single_Package) {
      return join(getRootDirectory(), "output_feature");
   }
}


export async function extractFeatureFromPackage(sourcePath: string, resolvepath: ResovlePackagePath, csvDir?: string) {
   const result: PackageFeatureInfo = await getPackageFeatureInfo(sourcePath);
   const fileName = result.packageName.replace(/\//g, "-");
   const csvPath = join(csvDir ? csvDir : getDirectory(resolvepath), fileName + ".csv");
   const featureArr: [string, number|boolean][] = [];
   featureArr.push(["hasInstallScript", result.hasInstallScripts]);
   featureArr.push(["containIP", result.containIP]);
   featureArr.push(["useBase64Conversion", result.useBase64Conversion]);
   featureArr.push(["useBase64ConversionInInstallScript", result.useBase64ConversionInInstallScript]);
   featureArr.push(["containBase64StringInJSFile", result.containBase64StringInJSFile]);
   featureArr.push(["containBase64StringInInstallScript", result.containBase64StringInInstallScript]);
   featureArr.push(["containBytestring", result.containBytestring]);
   featureArr.push(["containDomainInJSFile", result.containDomainInJSFile]);
   featureArr.push(["containDomainInInstallScript", result.containDomainInInstallScript])
   featureArr.push(["useBuffer", result.useBuffer]);
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
   featureArr.push(["accessCryptoAndZip", result.accessCryptoAndZip]);
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
   return csvPath;
}

export async function extractFeatureFromDir(dirPath: string, resolvePath: ResovlePackagePath) {
   let oldPackageArr = JSON.parse(await readFile(progress_json_path, {encoding: "utf-8"})) as string[];

   let counter = 0;

   const max_package_number = 2200;

   let idx_ = Math.floor(oldPackageArr.length / max_package_number) + 1;

   const progress_detail_path = join(getRootDirectory(),'material', idx_ + ".csv");

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
         should_use_console_log && console.log(chalk("现在分析了" + counter + "个包"));
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

   if (resolvePath === ResovlePackagePath.By_Normal1 || resolvePath === ResovlePackagePath.By_Duan || resolvePath === ResovlePackagePath.By_Normal2) {
      await resolveExtractByNormal(dirPath);
   }
   
}

