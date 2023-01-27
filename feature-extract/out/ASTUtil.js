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
import * as t from '@babel/types';
import { base64_Pattern, getDomainPattern, IP_Pattern, SensitiveStringPattern } from './Patterns';
const traverse = traversePkg.default;
export function scanJSFileByAST(code, featureSet, isInstallScript) {
    const ast = parse(code, {
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
                    const importModuleName = path.node.arguments[0].value;
                    if (importModuleName === "fs" || importModuleName === "fs/promises" || importModuleName === "path" || importModuleName === "promise-fs") {
                        featureSet.accessFSInJSFile = true;
                        if (isInstallScript) {
                            featureSet.accessFSInInstallScript = true;
                        }
                    }
                }
                if (path.node.arguments.length > 0) {
                    const moduleName = path.node.arguments[0].value;
                    if (moduleName === "http" || moduleName === "https" || moduleName === "nodemailer" || moduleName === "axios" || moduleName === "request" || moduleName === "node-fetch") {
                        featureSet.accessNetworkInJSFile = true;
                        if (isInstallScript) {
                            featureSet.accessNetworkInInstallScript = true;
                        }
                    }
                }
                if (path.node.arguments.length > 0) {
                    const moduleName = path.node.arguments[0].value;
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
                    const type = path.scope.getBinding(path.node.arguments[0].name).path.node.init.type;
                    if (type === "ArrayExpression") {
                        featureSet.createBufferFromASCII = true;
                    }
                }
            }
        },
        StringLiteral: function (path) {
            const content = path.node.value;
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
            const names = ["arch", "homedir", "hostname", "networkInterfaces", "networkInterfaces", "platform", "type", "userInfo", "version", "machine"];
            for (const name of names) {
                if (path.get("object").isIdentifier({ name: "os" }) && path.get("property").isIdentifier({ name })) {
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
                    let typeName = "";
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
        Identifier: function (path) {
            if (path.node.name === "eval") {
                featureSet.useEval = true;
            }
        },
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            editDistance: 0,
            averageBracketNumber: 0,
            packageSize: 0,
            dependencyNumber: 0,
            devDependencyNumber: 0,
            numberOfJSFiles: 0,
            totalBracketsNumber: 0,
            hasInstallScripts: false,
            containIP: false,
            useBase64Conversion: false,
            containBase64String: false,
            createBufferFromASCII: false,
            containBytestring: false,
            containDomain: false,
            useBufferFrom: false,
            useEval: false,
            requireChildProcessInJSFile: false,
            requireChildProcessInInstallScript: false,
            accessFSInJSFile: false,
            accessFSInInstallScript: false,
            accessNetworkInJSFile: false,
            accessNetworkInInstallScript: false,
            accessProcessEnvInJSFile: false,
            accessProcessEnvInInstallScript: false,
            containSuspiciousString: false,
            useCrpytoAndZip: false,
            accessSensitiveAPI: false,
            installCommand: [],
            executeJSFiles: [],
            packageName: "",
            version: ""
        };
        let b = "\xaa";
        const code = `let b = os.homedir();let a = eva`;
        scanJSFileByAST(code, result, true);
        console.log(result);
    });
}
//test();
//# sourceMappingURL=ASTUtil.js.map