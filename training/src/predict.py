from pickle_util import load_classifier

from read_feature import read_feature_from_file
import sys
import os

rf_classifier_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "classifier", "RF.pkl")

def predict_single_package(classifier, feature_vec):
   return classifier.predict([feature_vec])

def predict_package(csv_path):
    rf_classifier = load_classifier(rf_classifier_path)
    feature_vec = read_feature_from_file(csv_path)
    print(predict_single_package(rf_classifier, feature_vec)[0])



if __name__ == "__main__":
   feature_file_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicous/alba-website.csv"
   antd_file_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/normal/antd-mobile.csv"
   flatmap_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious-dedupli/flatmap-stream.csv"
   predict_package(sys.argv[1])