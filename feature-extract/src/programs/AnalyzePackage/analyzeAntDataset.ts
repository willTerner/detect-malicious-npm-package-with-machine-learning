import { Classifier, setClassifier } from '../../config'
import { ant_data_set_path } from '../../constants'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { depressPackages } from '../../util/PackageUtil'
import { analyzeDir } from './PackageAnalyzer'

async function analyzeAntDataset () {
  // await depressPackages(ant_data_set_path);

  setClassifier(Classifier.MLP)
  await analyzeDir(ant_data_set_path, ant_data_set_path)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
analyzeAntDataset()
