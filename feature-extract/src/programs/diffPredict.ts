import { join } from 'node:path'
import { getCSVFromFile, getRootDirectory, writeCSVFile } from '../util'

const MATERIAL_PATH = join(getRootDirectory(), 'material')

const RF_PATH = join(MATERIAL_PATH, 'registry-malicious-package-rf-v2.csv')

const MLP_PATH = join(MATERIAL_PATH, 'registry-malicious-package-mlp.csv')

const SVM_PATH = join(MATERIAL_PATH, 'registry-malicious-package-svm.csv')

const DIFF_RESULT_PATH = join(MATERIAL_PATH, 'diff-result.csv')

export default async function diffPredict () {
  const rf = await getCSVFromFile(RF_PATH)
  const mlp = await getCSVFromFile(MLP_PATH)
  const svm = await getCSVFromFile(SVM_PATH)
  const res: string[][] = []
  diff(svm, rf, res)
  diff(svm, mlp, res)
  await writeCSVFile(DIFF_RESULT_PATH, res)
}

function diff (arr1: string[][], arr2: string[][], res: string[][]) {
  arr2.forEach((arr, idx) => {
    if (idx > 443) {
      return
    }
    if (arr1.findIndex(el => el[0] === arr[0]) < 0 && res.findIndex(el => el[0] === arr[0]) < 0) {
      res.push(arr)
    }
  }
  )
}
