import { extractFeatureFromDir, ResovlePackagePath } from "./ExtractFeature";
import { doSomething } from "./util/DownloadPackage";
import { removeDuplicatePackage } from "./util/RemoveDuplicatePackage";


const knifePath = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife";

const momnetPath = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/momnet/2.28.0";

const pornhub_alert = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/@pornhub_alerts/94.0.1";

const event_stream = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/event-stream/3.3.6";

 const normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/正常数据集";


//extractFeatureFromDir(normal_path, false, ResovlePackagePath.By_Normal);
//doSomething();
removeDuplicatePackage("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious");