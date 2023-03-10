import { opendir, access, mkdir, readFile, unlink } from "fs/promises";
import { join, basename, dirname } from "path";
import { readdirSync } from "fs";
import { duan_path, normal1_path } from "../commons";
import chalk from "chalk";
import { asyncExec } from "../Util";



export enum ResolveDepressDir {
   KNIFE,
   NORMAL,
   DUAN,
   TEST_NORMAL,
   TEST_SET,
}



async function resolveDepressDir(tgzPath: string, resolveDepressDir: ResolveDepressDir) {
   if (resolveDepressDir === ResolveDepressDir.KNIFE) {
      return dirname(tgzPath);
   }
   if (resolveDepressDir === ResolveDepressDir.NORMAL || resolveDepressDir === ResolveDepressDir.TEST_NORMAL || resolveDepressDir === ResolveDepressDir.TEST_SET) {
      const dotIndex = basename(tgzPath).lastIndexOf(".");
      let fileName = basename(tgzPath).substring(0, dotIndex);
      fileName = fileName.replace(/\//g, "-");
      const returnDir =  join(dirname(tgzPath),fileName);
      try{
         await access(returnDir);
         return returnDir;
      } catch(error) {
         await mkdir(returnDir);
         return returnDir;
      }
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
   //??????
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

export async function depressSinglePackage(tgzPath: string, depressDir: string) {
   return await asyncExec(`tar -xvf ${tgzPath} -C ${depressDir}`);
}

export async function depressPackage(tgzPath: string) {
   const outputDir = await resolveDepressDir(tgzPath, ResolveDepressDir.NORMAL);
   const {stdout,stderr} = await depressSinglePackage(tgzPath, outputDir);
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

export async function downloadSinglePackage(packageName: string, saveDir: string) {
   return await asyncExec(`cd ${saveDir} && npm pack ${packageName}`);
}

 async function downloadPopularPackage() {
   const jsonContent = await readFile("/Users/huchaoqun/Desktop/code/school-course/??????/source-code/feature-extract/material/top-10000.json", {encoding: "utf-8"});
   const saveDir = "/Users/huchaoqun/Desktop/code/school-course/??????/???????????????/normal";
   let packageArr = JSON.parse(jsonContent);
   packageArr = packageArr.slice(2000, 4000);
   packageArr = packageArr.map(el => el.name);
   for (let packageName of packageArr) {
      try {
         const {stdout, stderr} = await downloadSinglePackage(packageName, saveDir);
         console.log(stdout, stderr);
      } catch (error) {
         console.log(error);
      }
   }
}

//depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/??????/?????????/???????????????/knife");

//normalizeDir("/Users/huchaoqun/Desktop/code/school-course/??????/?????????/???????????????/???????????????");
export async function doSomething() {
   await normalizeDir(normal1_path);
   //depressPackageAndSetDir(test_normal_path, ResolveDepressDir.TEST_NORMAL);
  // downloadPopularPackage();
}