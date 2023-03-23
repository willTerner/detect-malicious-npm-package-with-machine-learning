const MAX_RECORD_NUMBER = 1000;
export class PositionRecorder {
    constructor() {
        this.featurePosSet = {
            hasInstallScripts: [],
            containIP: [],
            useBase64Conversion: [],
            useBase64ConversionInInstallScript: [],
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
        };
    }
    addRecord(key, record) {
        if (this.featurePosSet[key].length > 1000) {
            return;
        }
        this.featurePosSet[key].push(record);
    }
    serialRecord() {
        return JSON.stringify(this.featurePosSet);
    }
}
//# sourceMappingURL=PositionRecorder.js.map