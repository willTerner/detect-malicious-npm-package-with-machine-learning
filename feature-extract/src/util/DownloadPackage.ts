import { opendir, access, mkdir, readdir, rm, readFile, rmdir, unlink } from "fs/promises";
import { join, basename, dirname } from "path";
import { promisify } from "util";
import {exec} from 'child_process';
import { file } from "@babel/types";
import { readdirSync } from "fs";
import { duan_path, normal_path, test_normal_path } from "../Paths";
import chalk from "chalk";
import { asyncExec } from "../Util";



export enum ResolveDepressDir {
   KNIFE,
   NORMAL,
   DUAN,
   TEST_NORMAL
}



async function resolveDepressDir(tgzPath: string, resolveDepressDir: ResolveDepressDir) {
   if (resolveDepressDir === ResolveDepressDir.KNIFE) {
      return dirname(tgzPath);
   }
   if (resolveDepressDir === ResolveDepressDir.NORMAL || resolveDepressDir === ResolveDepressDir.TEST_NORMAL) {
      const dotIndex = basename(tgzPath).lastIndexOf(".");
      let fileName = basename(tgzPath).substring(0, dotIndex);
      fileName = fileName.replace(/\//g, "-");
      const returnDir =  join(dirname(tgzPath),fileName);
      await mkdir(returnDir);
      return returnDir;
   }
   if (resolveDepressDir === ResolveDepressDir.DUAN) {
      const dotIndex = basename(tgzPath).lastIndexOf(".");
      let fileName = basename(tgzPath).substring(0, dotIndex);
      fileName = fileName.replace(/\//g, "-");
      const returnDir = join(duan_path, fileName);
      try{
         await access(returnDir);
         return returnDir;
      }catch(error) {
         await mkdir(returnDir);
         return returnDir;
      }
   }
}

export async function depressPackageAndSetDir(targetDir: string, resolveDir: ResolveDepressDir) {
   const tgzPathArr: string[] = []; 
   async function resolveDepress(targetDir: string) {
      const dir = await opendir(targetDir);
      for await (const dirent of dir) {
         if (dirent.isDirectory()) {
            await resolveDepress(join(targetDir, dirent.name));
         } else {
            const dotIndex = dirent.name.lastIndexOf(".");
            if (dotIndex >= 0 && dirent.name.substring(dotIndex) === ".tgz") {
               tgzPathArr.push(join(targetDir, dirent.name));
            }
         }
      }
   }
   await resolveDepress(targetDir);
   //解压
   for (const tgzPath of tgzPathArr) {
      const {stdout, stderr} = await new Promise<{stdout: any, stderr: any}>((resolve) => {
         setTimeout(async() => {
            const outputDir = await resolveDepressDir(tgzPath, resolveDir);
            const {stdout,stderr} = await asyncExec(`tar -xvf ${tgzPath} -C ${outputDir}`);
            resolve({stdout, stderr});
         }, 0);
      });
      console.log(stdout, stderr);
   }
}

export async function depressPackage(tgzPath: string) {
   const outputDir = await resolveDepressDir(tgzPath, ResolveDepressDir.NORMAL);
   const {stdout,stderr} = await asyncExec(`tar -xvf ${tgzPath} -C ${outputDir}`);
   console.log(stdout, stderr);
   console.log(chalk.red("package depress directory is " + outputDir));
   return outputDir;
}

async function normalizeDir(targetDir) {
   const files = readdirSync(targetDir);
   for (const file of files) {
      if (file.endsWith(".csv")) {
         await unlink(join(targetDir, file));
      }
   }
}

 async function downloadPopularPackage() {
   const jsonContent = await readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-10000.json", {encoding: "utf-8"});
   let packageArr = JSON.parse(jsonContent);
   packageArr = packageArr.slice(2000, 4000);
   packageArr = packageArr.map(el => el.name);
   for (let packageName of packageArr) {
      try {
         const {stdout, stderr} = await asyncExec(`cd /Users/huchaoqun/Desktop/code/school-course/毕设/测试数据集/normal && npm pack ${packageName}`);
         console.log(stdout, stderr);
      } catch (error) {
         console.log(error);
      }
   }
}

//depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife");

//normalizeDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集/补充数据集");
export async function doSomething() {
   await normalizeDir(normal_path);
   //depressPackageAndSetDir(test_normal_path, ResolveDepressDir.TEST_NORMAL);
  // downloadPopularPackage();
}