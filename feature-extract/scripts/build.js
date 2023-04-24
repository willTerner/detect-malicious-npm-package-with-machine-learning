/* eslint-disable camelcase */
const { dirname, join } = require('path')
const { copyFileSync, cpSync } = require('fs')

/**
 * 复制python代码到dist目录
 */
function copyModel () {
  const modelSrc = join(dirname(dirname(__dirname)), 'training', 'src')
  const distFileNames = ['predict.py', 'pickle_util.py', 'read_feature.py', 'commons.py']
  for (const fileName of distFileNames) {
    copyFileSync(join(modelSrc, fileName), join('/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/dist/model', fileName))
  }

  const binary_files = ['MLP_scaler.pkl', 'MLP.pkl', 'NB_scaler.pkl', 'NB.pkl', 'RF_scaler.pkl', 'RF.pkl',
    'SVM_scaler.pkl', 'SVM.pkl']

  for (const fileName of binary_files) {
    copyFileSync(join(modelSrc, 'classifier', fileName), join('/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/dist/model/classifier', fileName))
  }
}

/**
 * 复制dist代码到find-mp 图形化程序
 */
async function copyDist () {
  const src = join(dirname(__dirname), 'dist')
  const dist = '/Users/huchaoqun/Desktop/code/front-end/find-mp/predictor'
  cpSync(src, dist, { recursive: true })
}

copyModel()
copyDist()
