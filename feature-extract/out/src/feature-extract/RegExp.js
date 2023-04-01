import { bytestring_pattern2 } from './Patterns';
export function matchUseRegExp(code, result, positionRecorder, targetJSFilePath) {
    const matchResult1 = code.match(bytestring_pattern2);
    if (matchResult1 != null) {
        result.containBytestring = true;
        positionRecorder.addRecord('containBytestring', {
            filePath: targetJSFilePath,
            content: matchResult1[1]
        });
    }
}
//# sourceMappingURL=RegExp.js.map