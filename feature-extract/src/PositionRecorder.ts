import {PackageFeatureInfo} from './PackageFeatureInfo';

export type Record = {
   filePath: string;
   content: {
      start: {
         line: number;
         column: number;
      },
      end: {
         line: number;
         column: number;
      },
   } | string;
}

export class PositionRecorder {

   featurePosSet: {[k in  keyof PackageFeatureInfo]: Record[]} = {
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

   addRecord(key: keyof PackageFeatureInfo, record: Record) {
      this.featurePosSet[key].push(record);
   }

   serialRecord() {
      return JSON.stringify(this.featurePosSet);
   }
}
