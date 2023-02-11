import { dirname, join } from "path";
import { getRootDirectory } from "./Util";

export const knife_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife";

export const  knife_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious";

export const knife_dedupl_saveDir = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious-dedupli";


export const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集";

export const normal_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal";


export const test_normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/测试数据集/normal";

export const test_normal_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/normal";


export const duan_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/测试数据集/duan";


export const test_malicious_dedupl_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicious-dedupli";

export const test_malicious_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicious";


export const predict_py_path = join(dirname(getRootDirectory()), "training", "src", "predict.py");

export const test_set_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test";

export const test_set_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/测试/test_dataset";

export const test_set_mix_csv_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test";

export const npm_registry_csv_path = join(getRootDirectory(), 'material', 'registry-csv');

export const should_use_console_log = true;