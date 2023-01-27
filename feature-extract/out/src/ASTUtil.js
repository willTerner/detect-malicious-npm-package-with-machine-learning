"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.scanJSFileByAST = void 0;
var core_1 = require("@babel/core");
var traverse_1 = __importDefault(require("@babel/traverse"));
var t = __importStar(require("@babel/types"));
var Patterns_1 = require("./Patterns");
var traverse = traverse_1["default"];
function scanJSFileByAST(code, featureSet, isInstallScript) {
    var ast = (0, core_1.parse)(code, {
        sourceType: "script"
    });
    traverse(ast, {
        CallExpression: function (path) {
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
                    var importModuleName = path.node.arguments[0].value;
                    if (importModuleName === "fs" || importModuleName === "fs/promises" || importModuleName === "path" || importModuleName === "promise-fs") {
                        featureSet.accessFSInJSFile = true;
                        if (isInstallScript) {
                            featureSet.accessFSInInstallScript = true;
                        }
                    }
                }
                if (path.node.arguments.length > 0) {
                    var moduleName = path.node.arguments[0].value;
                    if (moduleName === "http" || moduleName === "https" || moduleName === "nodemailer" || moduleName === "axios" || moduleName === "request" || moduleName === "node-fetch") {
                        featureSet.accessNetworkInJSFile = true;
                        if (isInstallScript) {
                            featureSet.accessNetworkInInstallScript = true;
                        }
                    }
                }
                if (path.node.arguments.length > 0) {
                    var moduleName = path.node.arguments[0].value;
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
                var type = path.scope.getBinding(path.node.arguments[0].name).path.node.init.type;
                if (type === "ArrayExpression") {
                    featureSet.createBufferFromASCII = true;
                }
            }
        },
        StringLiteral: function (path) {
            var content = path.node.value;
            if (content === "base64") {
                featureSet.useBase64Conversion = true;
            }
            {
                var matchResult = content.match(Patterns_1.IP_Pattern);
                if (matchResult) {
                    featureSet.containIP = true;
                }
            }
            {
                var matchResult = content.match(Patterns_1.base64_Pattern);
                if (matchResult) {
                    featureSet.containBase64String = true;
                }
            }
            {
                var matchResult = content.match((0, Patterns_1.getDomainPattern)());
                if (matchResult) {
                    featureSet.containDomain = true;
                }
            }
            {
                var matchResult = content.match(Patterns_1.SensitiveStringPattern);
                if (matchResult) {
                    featureSet.containSuspiciousString = true;
                }
            }
        },
        MemberExpression: function (path) {
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
            var names = ["arch", "homedir", "hostname", "networkInterfaces", "networkInterfaces", "platform", "type", "userInfo", "version", "machine"];
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_1 = names_1[_i];
                if (path.get("object").isIdentifier({ name: "os" }) && path.get("property").isIdentifier({ name: name_1 })) {
                    featureSet.accessSensitiveAPI = true;
                    break;
                }
            }
        },
        NewExpression: function (path) {
            if (path.node.callee.name === 'Buffer') {
                if (path.node.arguments.length > 0 && path.node.arguments[0].type === 'ArrayExpression') {
                    // Todo: 如何参数是其他类型可以生成数组的表达式，比如函数调用，如何识别
                    featureSet.createBufferFromASCII = true;
                }
                if (path.node.arguments.length > 0 && path.node.arguments[0].type === "Identifier") {
                    var typeName = "";
                    try {
                        typeName = path.scope.getBinding(path.node.arguments[0].name).path.node.init.type;
                        if (typeName === "ArrayExpression") {
                            featureSet.createBufferFromASCII = true;
                        }
                    }
                    catch (er) {
                    }
                }
            }
        },
        ImportDeclaration: function (path) {
            var moduleName = path.node.source.value;
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
        Identifier: function (path) {
            if (path.node.name === "eval") {
                featureSet.useEval = true;
            }
        }
    });
}
exports.scanJSFileByAST = scanJSFileByAST;
//# sourceMappingURL=ASTUtil.js.map