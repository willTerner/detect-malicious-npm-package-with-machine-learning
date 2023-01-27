"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getAllInstallScripts = void 0;
var core_1 = require("@babel/core");
var traverse_1 = __importDefault(require("@babel/traverse"));
var fs_1 = require("fs");
var path_1 = require("path");
var traverse = traverse_1["default"]["default"];
/**
 *
 * @param installScripts install hook中js file的路径
 * @return 所有在install hook中执行的js file路径
 */
function getAllInstallScripts(installScripts) {
    function resolveAllInstallScripts(installScripts, idx) {
        if (idx >= installScripts.length) {
            return;
        }
        try {
            var codeContent = (0, fs_1.readFileSync)(installScripts[idx], {
                encoding: "utf-8"
            });
            var ast = (0, core_1.parse)(codeContent, {
                sourceType: "script"
            });
            traverse(ast, {
                CallExpression: function (path) {
                    if (path.node.callee.name === "require") {
                        if (path.node.arguments.length > 0) {
                            var moduleName = path.node.arguments[0].value;
                            if (moduleName.startsWith("/") || moduleName.startsWith("./") || moduleName.startsWith("../")) {
                                var importScript = (0, path_1.join)((0, path_1.dirname)(installScripts[idx]), moduleName);
                                if (importScript.endsWith(".js") || importScript.indexOf(".") < 0) {
                                    if (!importScript.endsWith(".js")) {
                                        importScript = importScript + ".js";
                                    }
                                    try {
                                        (0, fs_1.accessSync)(importScript);
                                        installScripts.push(importScript);
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                }
                            }
                        }
                    }
                }
            });
            resolveAllInstallScripts(installScripts, idx + 1);
        }
        catch (error) {
            console.log(error);
        }
    }
    resolveAllInstallScripts(installScripts, 0);
}
exports.getAllInstallScripts = getAllInstallScripts;
// let filePaths = ["/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/src/example.js"];
// getAllInstallScripts(filePaths);
// console.log(filePaths);
//# sourceMappingURL=GetInstallScripts.js.map