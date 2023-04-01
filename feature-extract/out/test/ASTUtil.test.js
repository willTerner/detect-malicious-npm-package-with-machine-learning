const result = {
    hasInstallScripts: false,
    containIP: false,
    useBase64Conversion: false,
    useBase64ConversionInInstallScript: false,
    containBase64StringInJSFile: false,
    containBase64StringInInstallScript: false,
    containBytestring: false,
    containDomainInJSFile: false,
    containDomainInInstallScript: false,
    useBuffer: false,
    useEval: false,
    requireChildProcessInJSFile: false,
    requireChildProcessInInstallScript: false,
    accessFSInJSFile: false,
    accessFSInInstallScript: false,
    accessNetworkInJSFile: false,
    accessNetworkInInstallScript: false,
    accessProcessEnvInJSFile: false,
    accessProcessEnvInInstallScript: false,
    accessCryptoAndZip: false,
    accessSensitiveAPI: false,
    containSuspiciousString: false,
    installCommand: [],
    executeJSFiles: [],
    packageName: '',
    version: ''
};
export {};
// scanJSFileByAST(code, result, false, '', null)
//# sourceMappingURL=ASTUtil.test.js.map