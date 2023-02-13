import chalk from "chalk";
import { constants } from "fs";
import { access } from "fs/promises";
import { extractFeatureFromDir, extractFeatureFromPackage, ResovlePackagePath } from "./ExtractFeature";
import { duan_path, predict_py_path,  normal1_path, knife_path, normal2_path } from "./commons";
import { asyncExec } from "./Util";
import { doSomething } from "./util/DownloadPackage";
import { scanNPMRegistry } from "./scanNPMRegistry";



 enum Action {
   Extract,
   DoSomething,
   DepressPackageFromDir,
   ScanNPMRegistry,
 }
async function extract_feature() {
   let resolve_path = ResovlePackagePath.By_Normal2;
   let source_path: string;
   //@ts-ignore
   const action = Action.ScanNPMRegistry;
   const haveFeatureChanged = false;
   // @ts-ignore
   if (resolve_path === ResovlePackagePath.By_Knife) {
      source_path = knife_path;
   // @ts-ignore
   } else if (resolve_path === ResovlePackagePath.By_Normal1) {
      source_path = normal1_path;
   // @ts-ignore
   } else if (resolve_path === ResovlePackagePath.By_Duan) {
      source_path = duan_path;
   // @ts-ignore
   } else if (resolve_path === ResovlePackagePath.By_Normal2) {
      source_path = normal2_path
   }
   // @ts-ignore
   if (action === Action.Extract) {
      await extractFeatureFromDir(source_path, resolve_path);
   // @ts-ignore
   } else if (action === Action.DoSomething) {
      await doSomething();
   // @ts-ignore
   } else if (action === Action.ScanNPMRegistry) {
      await scanNPMRegistry(haveFeatureChanged);
   }
   //doSomethingAST();
}


function show_usage() {
   console.log(chalk.green(`npm run start $package_path}. package_path is absolute path of a npm package directory which should have a file named package.json.`));
}



async function main() {
   if (process.argv.length === 3) {
      const package_path = process.argv[2];
      try{
         await access(package_path, constants.F_OK | constants.R_OK);
      }catch(error) {
         console.log(chalk.red("access" + package_path + "permission denied"));
         console.log(error);
         process.exit(0);
      }
      const csvPath = await extractFeatureFromPackage(package_path, ResovlePackagePath.By_Single_Package);
      const {stderr, stdout} = await asyncExec(`python3 ${predict_py_path} ${csvPath}`);
      if (stdout) {
         console.log(chalk.green("finish analyzing this package. This package is " + stdout));
      } else {
         console.log(stderr);
      }
   } else if (process.argv.length == 2) {
      console.log(chalk.red("This usage is for personal experiment. The right usage is as follows"));
      show_usage();
      const username = process.env.USER || process.env.USERNAME;
      if (username === "huchaoqun") {
         await extract_feature();
      }
      process.exit(0);
   } else {
      show_usage();
      process.exit(0);
   }
}


main();