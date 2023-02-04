import chalk from "chalk";
import { constants, readdirSync } from "fs";
import { access } from "fs/promises";
import { doSomethingAST } from "./ASTUtil";
import { extractFeatureFromDir, extractFeatureFromPackage, ResovlePackagePath } from "./ExtractFeature";
import { duan_path, knife_csv_path, knife_dedupl_saveDir, knife_path, normal_csv_path, predict_py_path, test_malicious_dedupl_path, test_malicious_path, test_normal_csv_path, test_normal_path } from "./Paths";
import { asyncExec } from "./Util";
import { depressPackage, doSomething } from "./util/DownloadPackage";
import { doSomethingRemove, removeDuplicatePackage } from "./util/RemoveDuplicatePackage";




const momnetPath = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/momnet/2.28.0";

const pornhub_alert = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/@pornhub_alerts/94.0.1";

const event_stream = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/event-stream/3.3.6";

 const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集";

 enum Action {
   Extract,
   DoSomething
 }
async function extract_feature() {
   let resolve_path = ResovlePackagePath.By_Test_Normal;
   let source_path: string;
   let csv_path: string;
   let csv_dedupli_path: string;
   //@ts-ignore
   let is_malicous = (resolve_path === ResovlePackagePath.By_Knife || resolve_path === ResovlePackagePath.By_Duan) ? true : false;
   const action = Action.Extract;
   // @ts-ignore
   if (resolve_path === ResovlePackagePath.By_Knife) {
      source_path = knife_path;
      csv_path = knife_csv_path;
      csv_dedupli_path = knife_dedupl_saveDir;
   // @ts-ignore
   } else if (resolve_path === ResovlePackagePath.By_Normal) {
      source_path = normal_path;
      csv_path = normal_csv_path;
   // @ts-ignore
   } else if (resolve_path === ResovlePackagePath.By_Duan) {
      source_path = duan_path;
      csv_path = test_malicious_path;
      csv_dedupli_path = test_malicious_dedupl_path;
   } else {
      source_path = test_normal_path;
      csv_path = test_normal_csv_path;
   }
   // @ts-ignore
   if (action === Action.Extract) {
      await extractFeatureFromDir(source_path, resolve_path);
      if (is_malicous) {
         await doSomethingRemove(csv_path, csv_dedupli_path);
      }
   } else if (action === Action.DoSomething) {
      await doSomething();
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