import { Classifier, setClassifier } from '../../config';
import { ant_data_set_path } from '../../constants'
import { depressPackages } from '../../util/PackageUtil'
import { analyzeDir } from './PackageAnalyzer';

async function analyzeAntDataset() {
  // await depressPackages(ant_data_set_path);

  setClassifier(Classifier.MLP);
  await analyzeDir(ant_data_set_path, ant_data_set_path);
}

analyzeAntDataset();