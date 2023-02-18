import { mkdir, open, readFile, rm } from "fs/promises";
import { basename, join } from "path";
import { asyncExec, getRootDirectory } from "./Util";
import { parse } from "csv-parse/sync";
import {
  depressSinglePackage,
  downloadSinglePackage,
} from "./util/DownloadPackage";
import { getFileLogger } from "./FileLogger";
import { readdirSync } from "node:fs";
import { access, writeFile } from "fs/promises";
import {
  extractFeatureFromPackage,
  ResovlePackagePath,
} from "./ExtractFeature";
import { predict_py_path, should_use_console_log } from "./commons";
import { stringify } from "csv-stringify/sync";
import chalk from "chalk";
import { EOL } from "os";

async function get_all_packages() {
  const names_path = join(getRootDirectory(), "material", "names.json");
  const fileContent = await readFile(names_path, { encoding: "utf-8" });
  let names = JSON.parse(fileContent) as string[];
  names = names.filter((name) => name === name.toLowerCase());
  return names;
}

export async function scanNPMRegistry(haveFeatureChanged: boolean) {
  const names = await get_all_packages();

  const progress_path = join(
    getRootDirectory(),
    "material",
    "scan-registry-progress.json"
  );
  const progress_content = await readFile(progress_path, { encoding: "utf-8" });
  const idx = JSON.parse(progress_content).progress as number;

  const malicious_pacakage_path = join(
    getRootDirectory(),
    "material",
    "registry-malicious-package.csv"
  );

  const malicious_file_handler = await open(malicious_pacakage_path, "w+");

  const logger = await getFileLogger();

  const unit_size = 50;

  const counter = Math.ceil(names.length / unit_size);

  for (let i = 0; i < counter; i++) {
    const saveDir = join(getRootDirectory(), "material", "registry", String(i));
    try {
      await access(saveDir);
    } catch (error) {
      await mkdir(saveDir);
      process.stdout.write(`mkdir ${saveDir} ${new Date().toLocaleString()}\n`);
    }
    // 对于之前下载解压过的包，不需要再下载解压
    if (i >= idx) {
      // 下载unit_size个包
      for (let j = 0; j < unit_size && j + i * unit_size < names.length; j++) {
        try {
          const { stdout, stderr } = await downloadSinglePackage(
            names[j + i * unit_size],
            saveDir
          );
          process.stdout.write(
            `${new Date().toLocaleString()}: The package being downloaded:${
              names[j + i * unit_size]
            }.\n`
          );
          should_use_console_log && console.log(stdout, stderr);
        } catch (error) {
          await logger.log(
            `The package being downloaded:${names[j + i * unit_size]}`
          );
          await logger.log(`error name: ${error.name}`);
          await logger.log(`error message: ${error.message}`);
          await logger.log(`error stack: ${error.stack}`);
        }
      }
      // 解压包
      const files = readdirSync(saveDir).filter((fileName) =>
        fileName.endsWith(".tgz")
      );
      for (let file of files) {
        const dotIdx = basename(file).lastIndexOf(".");
        const fileName = basename(file).substring(0, dotIdx);
        const depressDir = join(saveDir, fileName.replace(/\//g, "-"));
        try {
          await access(depressDir);
        } catch (error) {
          await mkdir(depressDir);
        }
        try {
          let { stdout, stderr } = await depressSinglePackage(
            join(saveDir, file),
            depressDir
          );
          process.stdout.write(
            `${new Date().toLocaleString()}: The package being depressed : ${basename(
              file
            )} \n`
          );
          should_use_console_log && console.log(stdout, stderr);
        } catch (error) {
          await logger.log(`The package being depressed: ${file}`);
          await logger.log(`error name: ${error.name}`);
          await logger.log(`error message: ${error.message}`);
          await logger.log(`error stack: ${error.stack}`);
        }
      }
      // 更新下载解压的进度
      // 进度为此次运行前下载解压的进度
      await writeFile(progress_path, JSON.stringify({ progress: i }));
    }

    // 下载包后和特征发生变化时需要提取特征
    if (i >= idx || haveFeatureChanged) {
      const package_files = readdirSync(saveDir, { withFileTypes: true });
      for (const packageDir of package_files) {
        if (packageDir.isDirectory()) {
          const source_path = join(saveDir, packageDir.name, "package");
          try {
            await access(source_path);
          } catch (error) {
            await logger.log(
              `The package being analyzed: ${packageDir.name};找不到package目录`
            );
            continue;
          }
          try {
            await extractFeatureFromPackage(
              source_path,
              ResovlePackagePath.None,
              saveDir
            );
            process.stdout.write(
              `${new Date().toLocaleString()}: The package being analyzed: ${
                packageDir.name
              } \n`
            );
          } catch (error) {
            await logger.log(`The package being analyzed: ${packageDir.name}`);
            await logger.log(`error name: ${error.name}`);
            await logger.log(`error message: ${error.message}`);
            await logger.log(`error stack: ${error.stack}`);
          }
        }
      }
    }

    const malicious_packages: string[][] = [];
    // 使用分类器判断是否为恶意包
    let all_files = readdirSync(saveDir);
    all_files = all_files.filter((fileName) => fileName.endsWith(".csv"));
    for (let file of all_files) {
      try {
        const { stderr, stdout } = await asyncExec(
          `python3  ${predict_py_path} ${join(saveDir, file)}`
        );
        process.stdout.write(
          `${new Date().toLocaleString()}: ***************finish analyze ${basename(
            file
          )}. It is ${stdout} `
        );
        if (basename(file) === "0.workspace.csv") {
          debugger;
        }
        if (stdout) {
          if (stdout === `malicious${EOL}`) {
            malicious_packages.push([basename(file), String(i)]);
          }
        }
      } catch (error) {
        await logger.log(
          `The package being analyzed by classifier: ${basename(file)}`
        );
        await logger.log(`error name: ${error.name}`);
        await logger.log(`error message: ${error.message}`);
        await logger.log(`error stack: ${error.stack}`);
      }
    }
    // 之间检测过的恶意包不需要再写入

    await malicious_file_handler.writeFile(stringify(malicious_packages));
  }
  await malicious_file_handler.close();
}
