var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parse } from "@babel/core";
import traversePkg from "@babel/traverse";
import * as t from "@babel/types";
import { base64_Pattern, getDomainPattern, IP_Pattern, SensitiveStringPattern, } from "./Patterns";
import { getFileLogger } from "./FileLogger";
let traverse;
if (process.env.NODE_ENV) {
    traverse = traversePkg;
}
else {
    traverse = traversePkg.default;
}
const MAX_STRING_LENGTH = 66875;
export function scanJSFileByAST(code, featureSet, isInstallScript, targetJSFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = yield getFileLogger();
        let ast;
        try {
            ast = parse(code, {
                sourceType: "unambiguous",
                plugins: ["@babel/plugin-syntax-flow"],
            });
        }
        catch (error) {
            logger.log("现在分析的文件是: " + targetJSFilePath);
            const errorObj = error;
            logger.log("error名称: " + errorObj.name);
            logger.log("error信息" + errorObj.message);
            logger.log("错误栈" + errorObj.stack);
        }
        traverse(ast, {
            CallExpression: function (path) {
                if (path.node.callee.name === "require") {
                    if (path.node.arguments.length > 0 &&
                        path.node.arguments[0].value === "base64-js") {
                        featureSet.useBase64Conversion = true;
                        if (isInstallScript) {
                            featureSet.useBase64ConversionInInstallScript = true;
                        }
                    }
                    if (path.node.arguments.length > 0 &&
                        path.node.arguments[0].value === "child_process") {
                        featureSet.requireChildProcessInJSFile = true;
                        if (isInstallScript) {
                            featureSet.requireChildProcessInInstallScript = true;
                        }
                    }
                    if (path.node.arguments.length > 0) {
                        const importModuleName = path.node.arguments[0].value;
                        if (importModuleName === "fs" ||
                            importModuleName === "fs/promises" ||
                            importModuleName === "path" ||
                            importModuleName === "promise-fs") {
                            featureSet.accessFSInJSFile = true;
                            if (isInstallScript) {
                                featureSet.accessFSInInstallScript = true;
                            }
                        }
                    }
                    if (path.node.arguments.length > 0) {
                        const moduleName = path.node.arguments[0].value;
                        if (moduleName === "http" ||
                            moduleName === "https" ||
                            moduleName === "nodemailer" ||
                            moduleName === "axios" ||
                            moduleName === "request" ||
                            moduleName === "node-fetch" ||
                            moduleName === "got") {
                            featureSet.accessNetworkInJSFile = true;
                            if (isInstallScript) {
                                featureSet.accessNetworkInInstallScript = true;
                            }
                        }
                    }
                    if (path.node.arguments.length > 0) {
                        const moduleName = path.node.arguments[0].value;
                        if (moduleName === "dns") {
                            featureSet.containDomainInJSFile = true;
                            if (isInstallScript) {
                                featureSet.containDomainInInstallScript = true;
                            }
                        }
                    }
                    if (path.node.arguments.length > 0) {
                        const moduleName = path.node.arguments[0].value;
                        if (moduleName === "crypto" || moduleName === "zlib") {
                            featureSet.accessCryptoAndZip = true;
                        }
                    }
                }
                if (t.isMemberExpression(path.node.callee) &&
                    path.node.callee.object.name === "os") {
                    featureSet.accessSensitiveAPI = true;
                }
            },
            StringLiteral: function (path) {
                const content = path.node.value;
                if (content === "base64") {
                    featureSet.useBase64Conversion = true;
                    if (isInstallScript) {
                        featureSet.useBase64ConversionInInstallScript = true;
                    }
                }
                if (content.length >= MAX_STRING_LENGTH) {
                    return;
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
                        if (isInstallScript) {
                            featureSet.containDomainInInstallScript = true;
                        }
                    }
                }
                {
                    const matchResult = content.match(SensitiveStringPattern);
                    if (matchResult) {
                        featureSet.containSuspiciousString = true;
                    }
                }
            },
            MemberExpression: function (path) {
                if (path.get("object").isIdentifier({ name: "process" }) &&
                    path.get("property").isIdentifier({ name: "env" })) {
                    featureSet.accessProcessEnvInJSFile = true;
                    if (isInstallScript) {
                        featureSet.accessProcessEnvInInstallScript = true;
                    }
                }
                if (path.get("object").isIdentifier({ name: "Buffer" }) &&
                    path.get("property").isIdentifier({ name: "from" })) {
                    featureSet.useBuffer = true;
                }
            },
            NewExpression: function (path) {
                if (path.node.callee.name === "Buffer") {
                    featureSet.useBuffer = true;
                }
            },
            ImportDeclaration: function (path) {
                const moduleName = path.node.source.value;
                if (path.node.source.value === "base64-js") {
                    featureSet.useBase64Conversion = true;
                    if (isInstallScript) {
                        featureSet.useBase64ConversionInInstallScript = true;
                    }
                }
                if (path.node.source.value === "child_process") {
                    featureSet.requireChildProcessInJSFile = true;
                    if (isInstallScript) {
                        featureSet.requireChildProcessInInstallScript = true;
                    }
                }
                {
                    if (moduleName === "fs" ||
                        moduleName === "fs/promises" ||
                        moduleName === "path" ||
                        moduleName === "promise-fs") {
                        featureSet.accessFSInJSFile = true;
                        if (isInstallScript) {
                            featureSet.accessFSInInstallScript = true;
                        }
                    }
                }
                {
                    if (moduleName === "http" ||
                        moduleName === "https" ||
                        moduleName === "nodemailer" ||
                        moduleName === "aixos" ||
                        moduleName === "request" ||
                        moduleName === "node-fetch") {
                        featureSet.accessNetworkInJSFile = true;
                        if (isInstallScript) {
                            featureSet.accessNetworkInInstallScript = true;
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
                    }
                }
            },
            Identifier: function (path) {
                if (path.node.name === "eval") {
                    featureSet.useEval = true;
                }
            },
        });
        return featureSet;
    });
}
export function doSomethingAST() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
//# sourceMappingURL=ASTUtil.js.map