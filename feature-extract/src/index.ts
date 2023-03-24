import chalk from "chalk";
import { constants } from "fs";
import { access, writeFile } from "fs/promises";
import {
  extractFeatureFromDir,
  extractFeatureFromPackage,
  ResovlePackagePath,
} from "./ExtractFeature";
import {
  duan_path,
  predict_py_path,
  normal1_path,
  knife_path,
  normal2_path,
  supplement_data_set_path,
} from "./commons";
import { asyncExec } from "./util/Util";
import { doSomething } from "./util/DownloadPackage";
import { scanNPMRegistry } from "./scanNPMRegistry";
import { pattern_test } from "./Patterns";
import { getConfig, setIsRecordFeaturePos } from "./config";
import diffPredict from "./diffPredict";
import { join } from "path";
import { measurePerformance } from "./measurePerformance";

enum Action {
  Extract,
  DoSomething,
  DepressPackageFromDir,
  ScanNPMRegistry,
  PatternTest,
  Diff,
  MeasurePerformance
}
async function extract_feature() {
  let resolve_path = ResovlePackagePath.By_Supplement
  let source_path: string;
  //@ts-ignore
  const action = Action.MeasurePerformance;
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
    source_path = normal2_path;
  } else if (resolve_path === ResovlePackagePath.By_Supplement) {
    source_path = supplement_data_set_path;
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
    // @ts-ignore
  } else if (action === Action.PatternTest) {
    await pattern_test();
    // @ts-ignore
  } else if (action === Action.Diff) {
    await diffPredict();
  } else if (action === Action.MeasurePerformance) {
    await measurePerformance();
  }
  //doSomethingAST();
}

function show_usage() {
  console.log(
    chalk.green(
      `npm run start $package_path}. package_path is absolute path of a npm package directory which should have a file named package.json.`
    )
  );
}

async function main() {
  if (process.argv.length === 3) {
   const package_path = process.argv[2];
    try {
      await access(package_path, constants.F_OK | constants.R_OK);
    } catch (error) {
      console.log(chalk.red("access" + package_path + "permission denied"));
      console.log(error);
      process.exit(0);
    }
    setIsRecordFeaturePos(true);
    const csvPath = await extractFeatureFromPackage(
      package_path,
      ResovlePackagePath.By_Single_Package
    );
    const { stderr, stdout } = await asyncExec(
      `python3 ${predict_py_path} ${csvPath}`
    );
    if (stdout) {
      console.log(
        chalk.green("finish analyzing this package.\n This package is " + stdout)
      );
      if (stdout === 'malicious\n') {
        const featurePosPath = join(package_path, 'feature-position-info.json');
        await writeFile(featurePosPath, getConfig().positionRecorder.serialRecord());
      }
    } else {
      console.log(stderr);
    }
  } else if (process.argv.length == 2) {
    console.log(
      chalk.red(
        "This usage is for personal experiment. The right usage is as follows"
      )
    );
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
