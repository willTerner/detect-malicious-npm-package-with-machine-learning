import {readFileSync} from 'fs';
import {execSync} from 'child_process';

console.log(execSync(' python3 /Volumes/data1/code/school/graduate-design/detect-malicious-npm-package-with-machine-learning/training/src/predict.py /Volumes/data1/code/school/graduate-design/detect-malicious-npm-package-with-machine-learning/feature-extract/output_feature/a-function.csv'));