import { readFile } from "fs/promises";
import { PackageFeatureInfo } from "./PackageFeatureInfo";
import { bytestring_pattern2 } from "./Patterns";


export function matchUseRegExp(code: string, result: PackageFeatureInfo) {
   const matchResult1 = code.match(bytestring_pattern2);
   if (matchResult1) {
      result.containBytestring = true;
   }
}

async function test() {
   const fileContent = await readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js", {encoding: "utf-8"});
  // console.log(matchResult(fileContent));
}

//test();