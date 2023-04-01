import { type PackageFeatureInfo } from './PackageFeatureInfo'
import { bytestring_pattern2 } from './Patterns'
import { type PositionRecorder } from './PositionRecorder'

export function matchUseRegExp (code: string, result: PackageFeatureInfo, positionRecorder: PositionRecorder, targetJSFilePath) {
  const matchResult1 = code.match(bytestring_pattern2)
  if (matchResult1 != null) {
    result.containBytestring = true
    positionRecorder.addRecord('containBytestring', {
      filePath: targetJSFilePath,
      content: matchResult1[1]
    })
  }
}
