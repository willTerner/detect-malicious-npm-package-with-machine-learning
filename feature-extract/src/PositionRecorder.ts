import {PackageFeatureInfo} from './PackageFeatureInfo';

const MAX_RECORD_NUMBER = 1000;

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

type RecordFeatureInfo = Omit<PackageFeatureInfo, 'containBase64StringInJSFile' | 'containBase64StringInInstallScript' | 'installCommand' | 'executeJSFiles' | 'packageName' | 'version'>;

export class PositionRecorder {

   featurePosSet: {[k in keyof RecordFeatureInfo]: Record[]} = {
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

   addRecord(key: keyof PackageFeatureInfo, record: Record) {
      if (this.featurePosSet[key].length > 1000) {
         return ;
      }
      this.featurePosSet[key].push(record);
   }

   serialRecord() {
      return JSON.stringify(this.featurePosSet);
   }
}
