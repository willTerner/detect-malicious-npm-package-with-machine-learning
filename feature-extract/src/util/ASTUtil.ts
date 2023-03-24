import { parse } from "@babel/core";
import traversePkg from "@babel/traverse";
import { PackageFeatureInfo } from "../PackageFeatureInfo";
import * as babelTypes from "@babel/types";
import {
  base64_Pattern,
  getDomainPattern,
  IP_Pattern,
  SensitiveStringPattern,
} from "../Patterns";
import { getFileLogger } from "../FileLogger";
import { PositionRecorder } from "../PositionRecorder";
import type {Record} from '../PositionRecorder';

const t = (babelTypes as any).default;

let traverse: any;

if (process.env.NODE_ENV) {
  traverse = traversePkg as any;
} else {
  traverse = (traversePkg as any).default;
}

const MAX_STRING_LENGTH = 66875;

export async function scanJSFileByAST(
  code: string,
  featureSet: PackageFeatureInfo,
  isInstallScript: boolean,
  targetJSFilePath: string,
  positionRecorder: PositionRecorder,
) {

  function getRecord(path: any) {
    return {
      filePath: targetJSFilePath,
      content: path.node.loc,
    } as Record;
  }

  const logger = await getFileLogger();
  let ast: any;
  try {
    ast = parse(code, {
      sourceType: "unambiguous",
      plugins: ["@babel/plugin-syntax-flow"],
    });
  } catch (error) {
    logger.log("现在分析的文件是: " + targetJSFilePath);
    const errorObj = error as Error;
    logger.log("error名称: " + errorObj.name);
    logger.log("error信息" + errorObj.message);
    logger.log("错误栈" + errorObj.stack);
  }
  try{
    traverse(ast, {
      CallExpression: function (path) {
        if (path.node.callee.name === "require") {
          if (
            path.node.arguments.length > 0 &&
            path.node.arguments[0].value === "base64-js"
          ) {
            featureSet.useBase64Conversion = true;
            positionRecorder.addRecord('useBase64Conversion', getRecord(path));
            if (isInstallScript) {
              featureSet.useBase64ConversionInInstallScript = true;
              positionRecorder.addRecord('useBase64ConversionInInstallScript', getRecord(path));
            }
          }
          if (
            path.node.arguments.length > 0 &&
            path.node.arguments[0].value === "child_process"
          ) {
            featureSet.requireChildProcessInJSFile = true;
            positionRecorder.addRecord('requireChildProcessInJSFile', getRecord(path));
            if (isInstallScript) {
              featureSet.requireChildProcessInInstallScript = true;
              positionRecorder.addRecord('requireChildProcessInInstallScript', getRecord(path));
            }
          }
          if (path.node.arguments.length > 0) {
            const importModuleName = path.node.arguments[0].value;
            if (
              importModuleName === "fs" ||
              importModuleName === "fs/promises" ||
              importModuleName === "path" ||
              importModuleName === "promise-fs"
            ) {
              featureSet.accessFSInJSFile = true;
              positionRecorder.addRecord('accessFSInJSFile', getRecord(path));
              if (isInstallScript) {
                featureSet.accessFSInInstallScript = true;
                positionRecorder.addRecord('accessFSInInstallScript', getRecord(path));
              }
            }
          }
          if (path.node.arguments.length > 0) {
            const moduleName = path.node.arguments[0].value as string;
            if (
              moduleName === "http" ||
              moduleName === "https" ||
              moduleName === "nodemailer" ||
              moduleName === "axios" ||
              moduleName === "request" ||
              moduleName === "node-fetch" ||
              moduleName === "got"
            ) {
              featureSet.accessNetworkInJSFile = true;
              positionRecorder.addRecord('accessNetworkInJSFile', getRecord(path));
              if (isInstallScript) {
                featureSet.accessNetworkInInstallScript = true;
                positionRecorder.addRecord('accessNetworkInInstallScript', getRecord(path));
              }
            }
          }
          if (path.node.arguments.length > 0) {
            const moduleName = path.node.arguments[0].value as string;
            if (moduleName === "dns") {
              featureSet.containDomainInJSFile = true;
              if (isInstallScript) {
                featureSet.containDomainInInstallScript = true;
              }
            }
          }
          if (path.node.arguments.length > 0) {
            const moduleName = path.node.arguments[0].value as string;
            if (moduleName === "crypto" || moduleName === "zlib") {
              featureSet.accessCryptoAndZip = true;
              positionRecorder.addRecord('accessCryptoAndZip', getRecord(path));
            }
          }
        }
        if (
          t.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === "os"
        ) {
          featureSet.accessSensitiveAPI = true;
          positionRecorder.addRecord('accessSensitiveAPI', getRecord(path));
        }
      },
      StringLiteral: function (path) {
        const content = path.node.value as string;
        if (content === "base64") {
          featureSet.useBase64Conversion = true;
          positionRecorder.addRecord('useBase64Conversion', getRecord(path));
          if (isInstallScript) {
            featureSet.useBase64ConversionInInstallScript = true;
            positionRecorder.addRecord('useBase64ConversionInInstallScript', getRecord(path));
          }
        }
        if (content.length >= MAX_STRING_LENGTH) {
          return;
        }
        {
          const matchResult = content.match(IP_Pattern);
          if (matchResult) {
            featureSet.containIP = true;
            positionRecorder.addRecord('containIP', getRecord(path));
          }
        }
        {
          const matchResult = content.match(base64_Pattern);
          if (matchResult) {
            featureSet.containBase64StringInJSFile = true;
            if (isInstallScript) {
              featureSet.containBase64StringInInstallScript = true;
            }
          }
        }
        {
          const matchResult = content.match(getDomainPattern());
          if (matchResult) {
            featureSet.containDomainInJSFile = true;
            positionRecorder.addRecord('containDomainInJSFile', getRecord(path));
            if (isInstallScript) {
              featureSet.containDomainInInstallScript = true;
              positionRecorder.addRecord('containDomainInInstallScript', getRecord(path));
            }
          }
        }
        {
          const matchResult = content.match(SensitiveStringPattern);
          if (matchResult) {
            featureSet.containSuspiciousString = true;
            positionRecorder.addRecord('containSuspiciousString', getRecord(path));
          }
        }
      },
      MemberExpression: function (path) {
        if (
          path.get("object").isIdentifier({ name: "process" }) &&
          path.get("property").isIdentifier({ name: "env" })
        ) {
          featureSet.accessProcessEnvInJSFile = true;
          positionRecorder.addRecord('accessProcessEnvInJSFile', getRecord(path));
          if (isInstallScript) {
            featureSet.accessProcessEnvInInstallScript = true;
            positionRecorder.addRecord('accessProcessEnvInInstallScript', getRecord(path));
          }
        }
        if (
          path.get("object").isIdentifier({ name: "Buffer" }) &&
          path.get("property").isIdentifier({ name: "from" })
        ) {
          featureSet.useBuffer = true;
          positionRecorder.addRecord('useBuffer', getRecord(path));
        }
      },
      NewExpression: function (path) {
        if (path.node.callee.name === "Buffer") {
          featureSet.useBuffer = true;
          positionRecorder.addRecord('useBuffer', getRecord(path));
        }
      },
      ImportDeclaration: function (path) {
        const moduleName = path.node.source.value;
        if (path.node.source.value === "base64-js") {
          featureSet.useBase64Conversion = true;
          positionRecorder.addRecord('useBase64Conversion', getRecord(path));
          if (isInstallScript) {
            featureSet.useBase64ConversionInInstallScript = true;
            positionRecorder.addRecord('useBase64ConversionInInstallScript', getRecord(path));
          }
        }
        if (path.node.source.value === "child_process") {
          featureSet.requireChildProcessInJSFile = true;
          positionRecorder.addRecord('requireChildProcessInJSFile', getRecord(path));
          if (isInstallScript) {
            featureSet.requireChildProcessInInstallScript = true;
            positionRecorder.addRecord('requireChildProcessInInstallScript', getRecord(path));
          }
        }
        {
          if (
            moduleName === "fs" ||
            moduleName === "fs/promises" ||
            moduleName === "path" ||
            moduleName === "promise-fs"
          ) {
            featureSet.accessFSInJSFile = true;
            positionRecorder.addRecord('accessFSInJSFile', getRecord(path));
            if (isInstallScript) {
              featureSet.accessFSInInstallScript = true;
              positionRecorder.addRecord('accessFSInInstallScript', getRecord(path));
            }
          }
        }
        {
          if (
            moduleName === "http" ||
            moduleName === "https" ||
            moduleName === "nodemailer" ||
            moduleName === "aixos" ||
            moduleName === "request" ||
            moduleName === "node-fetch"
          ) {
            featureSet.accessNetworkInJSFile = true;
            positionRecorder.addRecord('accessNetworkInJSFile', getRecord(path));
            if (isInstallScript) {
              featureSet.accessNetworkInInstallScript = true;
              positionRecorder.addRecord('accessNetworkInInstallScript', getRecord(path));
            }
          }
        }
        {
          if (moduleName === "dns") {
            featureSet.containDomainInJSFile = true;
            if (isInstallScript) {
              featureSet.containDomainInInstallScript = true;
            }
          }
        }
        {
          if (moduleName === "crypto" || moduleName === "zlib") {
            featureSet.accessCryptoAndZip = true;
            positionRecorder.addRecord('accessCryptoAndZip', getRecord(path));
          }
        }
      },
      Identifier: function (path) {
        if (path.node.name === "eval") {
          featureSet.useEval = true;
          positionRecorder.addRecord('useEval', getRecord(path));
        }
      },
    });
  } catch(error) {
    logger.log("现在分析的文件是: " + targetJSFilePath);
    const errorObj = error as Error;
    logger.log("error名称: " + errorObj.name);
    logger.log("error信息" + errorObj.message);
    logger.log("错误栈" + errorObj.stack);
  }

  return featureSet;
}

export async function doSomethingAST() {
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
  // let code = `require("crypto")`;
  // await scanJSFileByAST(code, result, true, "");
  // console.log(result)
}
