import { extractFeatureFromDir } from "./ExtractFeature";

const knifePath = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife";

const momnetPath = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/momnet/2.28.0";

const pornhub_alert = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/@pornhub_alerts/94.0.1";

const event_stream = "/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/event-stream/3.3.6";

extractFeatureFromDir(event_stream, true);