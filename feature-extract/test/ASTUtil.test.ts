import { scanJSFileByAST } from "../src/util/ASTUtil";
import { PackageFeatureInfo } from "../src/PackageFeatureInfo";

test('createBufferFromASCII works on [] and b = []', () => { 
   // let result: PackageFeatureInfo = {
   //    editDistance: 0,
   //    averageBracketNumber: 0,
   //    packageSize: 0,
   //    dependencyNumber: 0,
   //    devDependencyNumber: 0,
   //    numberOfJSFiles: 0,
   //    totalBracketsNumber: 0,
   //    hasInstallScripts: false,
   //    containIP: false,
   //    useBase64Conversion: false,
   //    containBase64String: false,
   //    createBufferFromASCII: false,
   //    containBytestring: false,
   //    containDomain: false,
   //    useBufferFrom: false,
   //    useEval: false,
   //    requireChildProcessInJSFile: false,
   //    requireChildProcessInInstallScript: false,
   //    accessFSInJSFile: false,
   //    accessFSInInstallScript: false,
   //    accessNetworkInJSFile: false,
   //    accessNetworkInInstallScript: false,
   //    accessProcessEnvInJSFile: false,
   //    accessProcessEnvInInstallScript: false,
   //    containSuspiciousString: false,
   //    accessCryptoAndZip: false,
   //    accessSensitiveAPI: false,
   //    installCommand: [],
   //    executeJSFiles: [],
   //    packageName: "",
   //    version: ""
   // };
   // let code = `import zlib from "zlib"`;
   // scanJSFileByAST(code, result, false, "");
   // console.log(result)
 });