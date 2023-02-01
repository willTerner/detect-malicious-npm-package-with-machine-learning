import { opendir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { PackageFeatureInfo } from "../PackageFeatureInfo";
import {parse} from 'csv-parse/sync';

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

export async function removeDuplicatePackage(targetDir: string) {
   const dir = await opendir(targetDir);
   const saveDir = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious-dedupli";
   for await (const dirent of dir) {
      if (dirent.name === "@bynder-private-dragula.csv") {
         debugger;
      }
      const csvPath = join(targetDir, dirent.name);
      const csvContent = await readFile(csvPath, {encoding: "utf-8"});
      const featureArr = await parse(csvContent);
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