import { PackageFeatureInfo } from "../src/PackageFeatureInfo";
import { isDuplicatePackage } from "../src/util/RemoveDuplicatePackage";


test("test featureinfo judge function", () => {
   const feauture1:PackageFeatureInfo = {
      editDistance:23,
averageBracketNumber:10,
packageSize:1454,
dependencyNumber:0,
devDependencyNumber:0,
numberOfJSFiles:1,
totalBracketsNumber:10,
hasInstallScripts:true,
containIP:false,
useBase64Conversion:false,
containBase64String:true,
createBufferFromASCII:true,
containBytestring:false,
containDomain:true,
useBufferFrom:true,
useEval:false,
requireChildProcessInJSFile:false,
requireChildProcessInInstallScript:false,
accessFSInJSFile:true,
accessFSInInstallScript:true,
accessNetworkInJSFile:true,
accessNetworkInInstallScript:true,
accessProcessEnvInJSFile:false,
accessProcessEnvInInstallScript:false,
containSuspiciousString:false,
accessCryptoAndZip: false,
accessSensitiveAPI:true,
packageName: "df",
version: "1.0",
installCommand: [],
executeJSFiles: []
   };

 
});