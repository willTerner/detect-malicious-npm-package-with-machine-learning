import { opendir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { PackageFeatureInfo } from "../PackageFeatureInfo";
import {parse} from 'csv-parse/sync';
import { readdirSync } from "fs";
import { rm } from "fs/promises";
import {  malicious_csv_path } from "../commons";

const ignore_prop_names = ["editDistance", "packageSize", "packageName", "version", "installCommand", "executeJSFiles"];


const unique_features: PackageFeatureInfo[] = [];



export function isDuplicatePackage(featureSet: PackageFeatureInfo): boolean {
   if (unique_features.findIndex((singleFeature) => {
      for (const key of Object.keys(featureSet)) {
         if (!ignore_prop_names.includes(key)) {
            if (singleFeature[key] !== featureSet[key]) {
               return false;
            }
         }
      }
      return true;
   }) >= 0) {
     return true; 
   }
   unique_features.push(featureSet);
   return false;
}

const ignore_feature_names = ["packageSize", "editDistance"];

const uniques: any[] = [];

const file_names: string[] = []

export async function removeDuplicatePackage(targetDir: string, saveDir: string) {
   const dir = await opendir(targetDir);
   for await (const dirent of dir) {
      const csvPath = join(targetDir, dirent.name);
      const csvContent = await readFile(csvPath, {encoding: "utf-8"});
      const featureArr = await parse(csvContent);
      if (dirent.name === "@azure-tests-perf-storage-file-share.csv") {
         debugger;
      }
      if (uniques.findIndex((feature, idx) => {
         for (let i = 0; i < feature.length; i++) {
            if (!ignore_feature_names.includes(feature[i][0])) {
               if (feature[i][1] !== featureArr[i][1]) {
                  return false;
               }
            }
         }
         return true;
      }) < 0) {
         // 不重复
         uniques.push(featureArr);
         file_names.push(dirent.name);
         const savePath = join(saveDir, dirent.name);
         await writeFile(savePath, csvContent);
      } 
   }
}

export async function removeDuplicatePackageForDuan(targetDir) {
   let dir = await opendir(malicious_csv_path);
   const csvNameArr: string[] = [];
   for await (const dirent of dir) {
      if (dirent.isFile()) {
         const dotIndex = dirent.name.lastIndexOf(".");
         csvNameArr.push(dirent.name.substring(0, dotIndex));
      }
   }
   const files = readdirSync(targetDir, {withFileTypes: true});
   for (const dirent of files) {
      if (dirent.isDirectory()) {
         const packageJSONPath = join(targetDir, dirent.name,"package", "package.json");
         const jsonContent = await readFile(packageJSONPath, {encoding: "utf-8"});
         const jsonObj = JSON.parse(jsonContent);
         let packageName = jsonObj.name;
         packageName = packageName.replace(/\//g, "-");
         if (csvNameArr.includes(packageName)) {
            await rm(join(targetDir, dirent.name), {recursive: true, force: true});
         }
      }
   }
}

export async function doSomethingRemove(csv_path, dedupli_path) {
   //await removeDuplicatePackageForDuan(duan_path)
   await removeDuplicatePackage(csv_path, dedupli_path);
}