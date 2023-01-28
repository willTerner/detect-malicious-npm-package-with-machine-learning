import {parse} from '@babel/core';
import traversePkg from '@babel/traverse';
import { PackageFeatureInfo } from './PackageFeatureInfo';
import * as t from "@babel/types";
import { base64_Pattern, getDomainPattern, IP_Pattern, SensitiveStringPattern } from './Patterns';
import { getFileLogger } from './FileLogger';
import chalk from 'chalk';

let traverse: any;


if (process.env.NODE_ENV) {
   traverse = (traversePkg as any);
} else {
   traverse = (traversePkg as any).default;
}





export async function scanJSFileByAST(code: string, featureSet: PackageFeatureInfo, isInstallScript: boolean, targetJSFilePath: string) {
   const logger = await getFileLogger();
   let ast: any;
   try{
      ast = parse(code, {
         sourceType: "script"
      });
   }catch(error) {
      logger.log("现在分析的文件是: " + targetJSFilePath);
      const errorObj = error as Error;
      logger.log("error名称: " + errorObj.name);
      logger.log("error信息" + errorObj.message);
      logger.log("错误栈" + errorObj.stack);
   }
   traverse(ast, {
      CallExpression: function(path) {
         if (path.node.callee.name === "require") {
            if (path.node.arguments.length > 0 && path.node.arguments[0].value === "base64-js") {
               featureSet.useBase64Conversion = true;
            }
            if (path.node.arguments.length > 0 && path.node.arguments[0].value === "child_process") {
               featureSet.requireChildProcessInJSFile = true;
               if (isInstallScript) {
                  featureSet.requireChildProcessInInstallScript = true;
               }
            }
            if (path.node.arguments.length > 0) {
               const importModuleName = path.node.arguments[0].value;
               if (importModuleName === "fs" || importModuleName === "fs/promises" || importModuleName === "path" || importModuleName === "promise-fs") {
                  featureSet.accessFSInJSFile = true;
                  if (isInstallScript) {
                     featureSet.accessFSInInstallScript = true;
                  }
               }
            }
            if (path.node.arguments.length > 0) {
               const moduleName = path.node.arguments[0].value as string;
               if (moduleName === "http" || moduleName === "https" || moduleName === "nodemailer" || moduleName === "axios" || moduleName === "request" || moduleName === "node-fetch") {
                  featureSet.accessNetworkInJSFile = true;
                  if (isInstallScript) {
                     featureSet.accessNetworkInInstallScript = true;
                  }
               }
            }
            if (path.node.arguments.length > 0) {
               const moduleName = path.node.arguments[0].value as string;
               if (moduleName === "dns") {
                  featureSet.containDomain = true;
               }
            }
         }
         if (t.isMemberExpression(path.node.callee) && path.node.callee.object.name === "Buffer" && path.node.callee.property.name === "from") {
            featureSet.useBufferFrom = true;
         }
         if (t.isMemberExpression(path.node.callee) && path.node.callee.object.name === "Buffer" && path.node.callee.property.name === "from" && path.node.arguments.length > 0) {
            if (path.node.arguments[0].type === "ArrayExpression") {
               featureSet.createBufferFromASCII = true;
            }
            if (t.isIdentifier(path.node.arguments[0])) {
               featureSet.createBufferFromASCII = true;
            }
         }
      },
      StringLiteral: function(path) {
            const content = path.node.value as string;
            if (content === "base64") {
               featureSet.useBase64Conversion = true;
            }
            {
               const matchResult = content.match(IP_Pattern);
               if (matchResult) {
                  featureSet.containIP = true;
               }
            }
            {
               const matchResult = content.match(base64_Pattern);
               if (matchResult) {
                  featureSet.containBase64String = true;
               }
            }
            {
               const matchResult = content.match(getDomainPattern());
               if (matchResult) {
                  featureSet.containDomain = true;
               }
            }
            {
               const matchResult = content.match(SensitiveStringPattern);
               if (matchResult) {
                  featureSet.containSuspiciousString = true;
               }
            }
      },
      MemberExpression: function(path) {
         if (path.node.computed) {
            featureSet.totalBracketsNumber++;
         }
         if (path.get("object").isIdentifier({ name: "process" }) &&
            path.get("property").isIdentifier({ name: "env" })) {
            featureSet.accessProcessEnvInJSFile = true;
            if (isInstallScript) {
               featureSet.accessProcessEnvInInstallScript = true;
            }
         }
         const names = ["arch", "homedir", "hostname", "networkInterfaces", "networkInterfaces", "platform", "type", "userInfo", "version", "machine"];
         for (const name of names) {
            if (path.get("object").isIdentifier({name: "os"}) && path.get("property").isIdentifier({name})) {
               featureSet.accessSensitiveAPI = true;
               break;
            }
         }
      },
      NewExpression: function(path) {
         if (path.node.callee.name === 'Buffer') {
         if (path.node.arguments.length > 0 && path.node.arguments[0].type === 'ArrayExpression') {
            // Todo: 如何参数是其他类型可以生成数组的表达式，比如函数调用，如何识别
            featureSet.createBufferFromASCII = true;
         }
         if (path.node.arguments.length > 0 && path.node.arguments[0].type === "Identifier") {
               featureSet.createBufferFromASCII = true;
         }
         }
      },
      ImportDeclaration: function(path) {
         const moduleName = path.node.source.value;
         if (path.node.source.value === "base64-js") {
            featureSet.useBase64Conversion = true;
         }
         if (path.node.source.value === "child_process") {
            featureSet.requireChildProcessInJSFile = true;
            if (isInstallScript) {
               featureSet.requireChildProcessInInstallScript = true;
            }
         }
         {
               if (moduleName === "fs" || moduleName === "fs/promises" || moduleName === "path" || moduleName === "promise-fs") {
                  featureSet.accessFSInJSFile = true;
                  if (isInstallScript) {
                     featureSet.accessFSInInstallScript = true;
                  }
               }
            }
         {
            if (moduleName === "http" || moduleName === "https" || moduleName === "nodemailer" || moduleName === "aixos" || moduleName === "request" || moduleName === "node-fetch") {
               featureSet.accessNetworkInJSFile = true;
               if (isInstallScript) {
                  featureSet.accessNetworkInInstallScript = true;
               }
            }
         }
         {
            if (moduleName === "dns") {
               featureSet.containDomain = true;
            }
         }
      },
      Identifier: function(path) {
         if (path.node.name === "eval") {
            featureSet.useEval = true;
         }
      },
   });

   return featureSet;
}





