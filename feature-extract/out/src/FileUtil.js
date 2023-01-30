import fs from 'node:fs';
import path from 'path';
export function getDirectorySizeInBytes(dir) {
    let totalSize = 0;
    function walk(currentPath) {
        const files = fs.readdirSync(currentPath);
        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                totalSize += stats.size;
            }
            else if (stats.isDirectory()) {
                walk(filePath);
            }
        }
    }
    walk(dir);
    return totalSize;
}
//# sourceMappingURL=FileUtil.js.map