var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parse } from '@babel/core';
import traversePkg from '@babel/traverse';
import { accessSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import * as babelTypes from '@babel/types';
import { getFileLogger } from './FileLogger';
const t = babelTypes.default;
const traverse = traversePkg.default;
/**
 *
 * @param installScripts install hook中js file的路径
 * @return 所有在install hook中执行的js file路径
 */
export function getAllInstallScripts(installScripts) {
    return __awaiter(this, void 0, void 0, function* () {
        function resolveAllInstallScripts(installScripts, idx) {
            return __awaiter(this, void 0, void 0, function* () {
                if (idx >= installScripts.length) {
                    return;
                }
                const logger = yield getFileLogger();
                const codeContent = readFileSync(installScripts[idx], {
                    encoding: "utf-8"
                });
                let ast;
                try {
                    ast = parse(codeContent, {
                        sourceType: "unambiguous",
                        plugins: ["@babel/plugin-syntax-flow"]
                    });
                }
                catch (error) {
                    logger.log("现在分析的文件是: " + installScripts[idx]);
                    const errorObj = error;
                    logger.log("error名称: " + errorObj.name);
                    logger.log("error信息" + errorObj.message);
                    logger.log("错误栈" + errorObj.stack);
                }
                traverse(ast, {
                    CallExpression: function (path) {
                        if (path.node.callee.name === "require") {
                            if (path.node.arguments.length > 0) {
                                if (t.isStringLiteral(path.node.arguments[0])) {
                                    const moduleName = path.node.arguments[0].value;
                                    try {
                                        if (moduleName.startsWith("/") || moduleName.startsWith("./") || moduleName.startsWith("../")) {
                                            let importScript = join(dirname(installScripts[idx]), moduleName);
                                            if (importScript.endsWith(".js") || importScript.indexOf(".") < 0) {
                                                if (!importScript.endsWith(".js")) {
                                                    importScript = importScript + ".js";
                                                }
                                                try {
                                                    accessSync(importScript);
                                                    installScripts.push(importScript);
                                                }
                                                catch (error) {
                                                    console.log(error);
                                                }
                                            }
                                        }
                                    }
                                    catch (error) {
                                        throw error;
                                    }
                                }
                            }
                        }
                    }
                });
                yield resolveAllInstallScripts(installScripts, idx + 1);
            });
        }
        yield resolveAllInstallScripts(installScripts, 0);
    });
}
// let filePaths = ["/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js"];
// getAllInstallScripts(filePaths);
// console.log(filePaths);
//# sourceMappingURL=GetInstallScripts.js.map