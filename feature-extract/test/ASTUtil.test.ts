import { type PackageFeatureInfo } from '../src/feature-extract/PackageFeatureInfo'
import { scanJSFileByAST } from '../src/feature-extract/AST'

const result: PackageFeatureInfo = {
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
}

// scanJSFileByAST(code, result, false, '', null)
