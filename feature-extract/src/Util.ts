import { exec } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
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
      } else if (stats.isDirectory()) {
        walk(filePath);
      }
    }
  }

  walk(dir);

  return totalSize;
}


export function getRootDirectory() {

  let currentFilePath = process.argv[1];
  let projectRootPath = currentFilePath;

  while (!fs.existsSync(path.join(projectRootPath, 'package.json'))) {
    projectRootPath = path.dirname(projectRootPath);
  }

  return projectRootPath;
}

export const asyncExec = promisify(exec);