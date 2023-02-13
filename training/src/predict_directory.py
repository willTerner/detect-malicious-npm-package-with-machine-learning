from pickle_util import load_classifier

from read_feature import read_features_from_di
import sys
import os
import csv

rf_classifier_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "classifier", "RF.pkl")

def predict(classifier, feature_vec):
   return classifier.predict(feature_vec)

def predict_packages(csv_path):
    rf_classifier = load_classifier(rf_classifier_path)
    feature_arr = []
    label_arr = []
    csv_name_arr = []
    read_features_from_di(csv_path, feature_arr, label_arr, False ,csv_name_arr)
    results = predict(rf_classifier, feature_arr)
    result_path = os.path.join(os.path.dirname(csv_path), "0000-result.csv")
    i = 0
    length = len(csv_name_arr)
    with open(result_path, "w+") as f:
      writer = csv.writer(f)
      while i < length:
         writer.writerow([csv_name_arr[i], results[i]])
         i += 1



if __name__ == "__main__":
   target = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test"
   predict_packages(target)