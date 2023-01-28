
import { scanJSFileByAST } from "./ASTUtil";




process.on("message", async(workerData: any) => {
   await scanJSFileByAST(workerData.code, workerData.featureSet, workerData.isInstallScript, workerData.targetJSFilePath);
   process.send(workerData.featureSet);
});

