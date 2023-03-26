import { predict_py_path } from '../../constants';
import { extractFeatureFromPackage } from '../../feature-extract';
import { asyncExec, getErrorInfo, getPackagesFromDir, writeCSVFile } from '../../util';
import { getConfig, isEnglish } from '../../config';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { Logger } from '../../Logger'

function getAnalyzeResult(fileName: string, isMalicious: boolean, featurePosPath: string) {
   if (isEnglish()) {
      return `Finish analyze ${fileName}. It is ${ isMalicious ? "malicious" : "benign"}. ${isMalicious ? 'Malicious feature position is recorded at' + featurePosPath : ''}`;
   }
   return `完成对${fileName}的分析. 它是 ${isMalicious ? '恶意包' : '正常包'}. ${isMalicious ? '恶意特征位置记录在' + featurePosPath : ''}`;
}


/**
 * 检测单个npm包是否为恶意包
 * @param packagePath npm包路径
 * @param csvDir 保存csv文件路径
 */
 export  async function analyzeSinglePackage(packagePath: string, csvDir: string) {

      const result = await extractFeatureFromPackage(
         packagePath,
         csvDir
      );
      
      const packageName = `${result.featureInfo.packageName}@${result.featureInfo.version}`;
      
      try{
         const { stderr, stdout } = await asyncExec(
            `python3 ${predict_py_path} ${result.csvPath} ${getConfig().classifier}`
         );
   
         if (stdout) {
            const featurePosPath = join(packagePath, 'feature-position-info.json');
            
            if (stdout === 'malicious\n') {
               Logger.warning(getAnalyzeResult(packageName, true,featurePosPath));
               await writeFile(featurePosPath, getConfig().positionRecorder.serialRecord());
               return result;
            } else {
               Logger.info(getAnalyzeResult(packageName, false, featurePosPath));
               return null;
            }
         }
      } catch (error) {
         Logger.error(getErrorInfo(error));
         return null;
      }
      
}

/**
 * 检测目录中所有的npm包
 * @param dirPath 
 * @param csvDir 
 */
export  async  function analyzeDir(dirPath: string, csvDir: string) {
   const packagsPath = await getPackagesFromDir(dirPath);
   let counter = 0;
   let total = 0;
   let maliciousPackages: string[][] = [];
   const malPkgCSVPath = join(dirPath, 'malicious-packages.csv');

   for (const packagePath of packagsPath) {
      total++;
      const result = await analyzeSinglePackage(packagePath, csvDir);
      if (result) {
         counter++;
         maliciousPackages.push([result.featureInfo.packageName, result.featureInfo.version]);
      }
   }

   Logger.info(`总共分析了${total}个包。包含${counter}个恶意包`);
   if (counter > 0) {
      await writeCSVFile(malPkgCSVPath, maliciousPackages);
   }
}