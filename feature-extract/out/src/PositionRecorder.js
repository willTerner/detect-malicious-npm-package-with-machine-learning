export class PositionRecorder {
    constructor() {
        this.featurePosSet = {
            hasInstallScripts: [],
            containIP: [],
            useBase64Conversion: [],
            useBase64ConversionInInstallScript: [],
            containBase64StringInJSFile: [],
            containBase64StringInInstallScript: [],
            containDomainInJSFile: [],
            containDomainInInstallScript: [],
            containBytestring: [],
            useBuffer: [],
            useEval: [],
            requireChildProcessInJSFile: [],
            requireChildProcessInInstallScript: [],
            accessFSInJSFile: [],
            accessFSInInstallScript: [],
            accessNetworkInJSFile: [],
            accessNetworkInInstallScript: [],
            accessProcessEnvInJSFile: [],
            accessProcessEnvInInstallScript: [],
            accessCryptoAndZip: [],
            accessSensitiveAPI: [],
            containSuspiciousString: [],
            installCommand: [],
            executeJSFiles: [],
            packageName: [],
            version: [],
        };
    }
    addRecord(key, record) {
        this.featurePosSet[key].push(record);
    }
    serialRecord() {
        return JSON.stringify(this.featurePosSet);
    }
}
//# sourceMappingURL=PositionRecorder.js.map