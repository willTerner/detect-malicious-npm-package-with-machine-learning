import { readFile } from "fs/promises";
import { PackageFeatureInfo } from "./PackageFeatureInfo";
import { bytestring_pattern2 } from "./Patterns";
import { PositionRecorder } from "./PositionRecorder";


export function matchUseRegExp(code: string, result: PackageFeatureInfo, positionRecorder: PositionRecorder, targetJSFilePath) {
   const matchResult1 = code.match(bytestring_pattern2);
   if (matchResult1) {
      result.containBytestring = true;
      positionRecorder.addRecord('containBytestring', {
         filePath: targetJSFilePath,
         content: matchResult1[1],
      });
   }
}

async function test() {
   const fileContent = await readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js", {encoding: "utf-8"});
  // console.log(matchResult(fileContent));
}

//test();