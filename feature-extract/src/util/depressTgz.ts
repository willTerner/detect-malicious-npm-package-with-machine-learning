import { opendir, access, mkdir } from "fs/promises";
import { join, basename, dirname } from "path";
import { promisify } from "util";
import {exec} from 'child_process';

const asyncExec = promisify(exec);

async function depressPackageAndSetDir(targetDir: string) {
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
            const {stdout,stderr} = await asyncExec(`tar -xvf ${tgzPath} -C ${dirname(tgzPath)}`);
            resolve({stdout, stderr});
         }, 0);
      });
      console.log(stdout, stderr);
   }
}

depressPackageAndSetDir("/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife");