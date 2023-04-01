import chalk from 'chalk'
import { accessSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { output_feature_path, predict_py_path, supplement_data_set_path } from '../constants'
import { getConfig } from '../config'
import { extractFeatureFromPackage } from '../feature-extract'
import { asyncExec, getPackagesFromDir } from '../util'

let totalTime = 0

let totalNumber = 0

async function measureSinglePackage (package_path) {
  totalNumber++
  const startTime = Date.now()
  const csvPath = await extractFeatureFromPackage(
    package_path,
    output_feature_path
  )
  const { stderr, stdout } = await asyncExec(
      `python3 ${predict_py_path} ${csvPath.csvPath}`
  )
  totalTime += Date.now() - startTime
  if (stdout) {
    console.log(
      chalk.green('finish analyzing this package.\n This package is ' + stdout)
    )
    if (stdout === 'malicious\n') {
      const featurePosPath = join(package_path, 'feature-position-info.json')
      await writeFile(featurePosPath, getConfig().positionRecorder!.serialRecord())
    }
  } else {
    console.log(stderr)
  }
}

export async function measurePerformance () {
  const files = await getPackagesFromDir(supplement_data_set_path)
  for (const file of files) {
    try {
      const package_path = file
      accessSync(package_path)
      await measureSinglePackage(package_path)
    } catch (error) {
      console.log(error.name)
      console.log(error.message)
      console.log(error.message)
    }
  }
  console.log(`分析了${totalNumber}个包，花了${totalTime}ms`)
}
