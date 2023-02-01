from pickle_util import load_classifier

from read_feature import read_feature_from_file

def predict_single_package(classifier, feature_vec):
   return classifier.predict([feature_vec])

rf_classifier_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/src/classifier/RF.pkl"

if __name__ == "__main__":
   feature_file_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicous/alba-website.csv"
   antd_file_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/normal/antd-mobile.csv"

   rf_classifier = load_classifier(rf_classifier_path)
   feature_vec = read_feature_from_file(antd_file_path)
   print(predict_single_package(rf_classifier, feature_vec))