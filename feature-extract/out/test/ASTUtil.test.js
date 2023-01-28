import { scanJSFileByAST } from "../src/ASTUtil";
test('createBufferFromASCII works on [] and b = []', () => {
    let result = {
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
    scanJSFileByAST("let a = Buffer.from([11,20]);", result, false, "");
    expect(result.useBufferFrom).toBe(true);
});
//# sourceMappingURL=ASTUtil.test.js.map