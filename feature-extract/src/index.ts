import { accessSync, constants } from "fs";
import {
  output_feature_path,
} from "./constants";
import { join } from "path";
import { Logger } from "./Logger";
import { analyzeDir, analyzeSinglePackage } from "./programs/AnalyzePackage/PackageAnalyzer";
import { Classifier, setClassifier } from "./config";



function show_usage() {
    Logger.info('\nusage:\nnode --es-module-specifier-resolution=node out/src/index.js -s $package_path [-c $classifier].  It is used to detect single package. package_path is absolute path of a npm package directory which should have a file named package.json.\nnode --es-module-specifier-resolution=node out/src/index.js -b $dir [-c $classifier]. It is used to detect all packages in the $dir\n$classifier is optional classifier from RF, SVM, NB, MLP. Default classifier is SVM.');
}

async function main() {
  if (process.argv.length === 4 || process.argv.length === 6) {

		const option = process.argv[2];

		if (process.argv.length === 6) {
			if (process.argv[4] !== '-c') {
				show_usage();
				return ;
			}
			const classifier = process.argv[5];
			if (Object.values(Classifier).findIndex(c => c === classifier) < 0) {
				show_usage();
				return ;
			} 
			setClassifier(classifier as Classifier);
		}

		if (option === '-s') {
			
			const packagePath = process.argv[3];
			const packageJSONPath = join(packagePath, 'package.json');
			
			try{
				accessSync(packagePath, constants.F_OK | constants.R_OK);
			} catch(error) {
				Logger.error(`can't access ${packagePath}. message is ${(error as Error).message}`);
				return ;
			}

			try{
				accessSync(packageJSONPath);
			} catch(error) {
				Logger.error(`can't access ${packageJSONPath}`)
				return ;
			}

			// detect single package
			await analyzeSinglePackage(packagePath, output_feature_path);
		} else if (option === '-b') {
			const dirPath = process.argv[3];
			try{
				accessSync(dirPath, constants.F_OK| constants.R_OK);
			} catch (error) {
				Logger.error(`can't access ${dirPath}. message is ${(error as Error).message}`);
				return ;
			}
			await analyzeDir(dirPath, output_feature_path);
		} else {
			show_usage();
		}

  } else {
		show_usage();
  }

}

main();
