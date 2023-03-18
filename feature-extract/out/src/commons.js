import { dirname, join } from "path";
import { getRootDirectory } from "./util/Util";
export const knife_path = "/Volumes/data1/code/school/graduate-design/data-set/packages/malicious/恶意数据集/knife";
export const duan_path = "/Volumes/data1/code/school/graduate-design/data-set/packages/malicious/duan";
export const malicious_csv_path = "/Volumes/data1/code/school/graduate-design/detect-malicious-npm-package-with-machine-learning/training/material/training_set/malicious";
export const normal1_path = "/Volumes/data1/code/school/graduate-design/data-set/packages/benign/normal";
export const normal2_path = "/Volumes/data1/code/school/graduate-design/data-set/packages/benign/正常数据集";
export const normal_csv_path = "/Volumes/data1/code/school/graduate-design/detect-malicious-npm-package-with-machine-learning/training/material/training_set/normal";
export const predict_py_path = join(dirname(getRootDirectory()), "training", "src", "predict.py");
export const test_set_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test";
export const test_set_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/测试/test_dataset";
export const test_set_mix_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test";
export const npm_registry_csv_path = join(getRootDirectory(), 'material', 'registry-csv');
export const should_use_console_log = false;
export const progress_json_path = join(getRootDirectory(), 'material', 'progress.json');
export const supplement_data_set_path = '/Volumes/data1/code/school/graduate-design/data-set/packages/supplement-data-set';
export const supplement_csv_path = join(dirname(getRootDirectory()), 'training', 'material', 'supplement-test-data-set');
//# sourceMappingURL=commons.js.map