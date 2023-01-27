import {parse} from '@babel/core';
import traversePkg from '@babel/traverse';
import { accessSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

const traverse = (traversePkg as any).default;


/**
 * 
 * @param installScripts install hook中js file的路径
 * @return 所有在install hook中执行的js file路径
 */
export function getAllInstallScripts(installScripts: string[]) {
   function resolveAllInstallScripts(installScripts: string[], idx: number) {
      if (idx >= installScripts.length) {
         return ;
      }
      try{
         const codeContent = readFileSync(installScripts[idx], {
            encoding: "utf-8"
         });
         const ast = parse(codeContent, {
            sourceType: "script"
         });
         traverse(ast, {
            CallExpression: function(path) {
               if (path.node.callee.name === "require") {
                  if (path.node.arguments.length > 0) {
                     const moduleName = path.node.arguments[0].value as string;
                     if (moduleName.startsWith("/") || moduleName.startsWith("./") || moduleName.startsWith("../")) {
                        let importScript = join(dirname(installScripts[idx]), moduleName);
                        if (importScript.endsWith(".js") || importScript.indexOf(".") < 0) {
                           if (!importScript.endsWith(".js")) {
                              importScript = importScript + ".js";
                           }
                           try{
                              accessSync(importScript);
                              installScripts.push(importScript);
                           }catch(error){
                              console.log(error);
                           }
                        }
                     }
                  }
               }
            }
         });
         resolveAllInstallScripts(installScripts, idx + 1);
      }catch(error) {
         console.log(error);
      }
   }

   resolveAllInstallScripts(installScripts, 0);
}

// let filePaths = ["/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js"];
// getAllInstallScripts(filePaths);
// console.log(filePaths);