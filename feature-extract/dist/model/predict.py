from pickle_util import load_classifier, load_scaler

from read_feature import read_feature_from_file
import sys
import os

from commons import MLP_path,mlp_scaler_save_path, nb_path,nb_scaler_save_path, svm_scaler_save_path,svm_path, rf_classifier_path, rf_scaler_save_path

def predict_single_package(classifier, feature_vec):
   return classifier.predict(feature_vec)

def predict_package_MLP(csv_path):
    rf_classifier = load_classifier(MLP_path)
    feature_vec = read_feature_from_file(csv_path)
    # 数据预处理
    scaler_path = mlp_scaler_save_path
    scaler = load_scaler(scaler_path)

    feature_vec = scaler.transform([feature_vec])
    print(predict_single_package(rf_classifier, feature_vec)[0])

def predict_package_NB(csv_path):
    rf_classifier = load_classifier(nb_path)
    feature_vec = read_feature_from_file(csv_path)
    # 数据预处理
    scaler_path = nb_scaler_save_path
    scaler = load_scaler(scaler_path)

    feature_vec = scaler.transform([feature_vec])
    print(predict_single_package(rf_classifier, feature_vec)[0])


def predict_package_SVM(csv_path):
    rf_classifier = load_classifier(svm_path)
    feature_vec = read_feature_from_file(csv_path)
    # 数据预处理
    scaler_path = svm_scaler_save_path
    scaler = load_scaler(scaler_path)

    feature_vec = scaler.transform([feature_vec])
    print(predict_single_package(rf_classifier, feature_vec)[0])

def predict_package_RF(csv_path):
    rf_classifier = load_classifier(rf_classifier_path)
    feature_vec = read_feature_from_file(csv_path)
    feature_vec = [feature_vec]
    # 数据预处理
   #  scaler_path = rf_scaler_save_path
   #  scaler = load_scaler(scaler_path)

   #  feature_vec = scaler.transform([feature_vec])
    print(predict_single_package(rf_classifier, feature_vec)[0])

if __name__ == "__main__":
   feature_file_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicous/alba-website.csv"
   antd_file_path = "/Volumes/data1/code/school/graduate-design/detect-malicious-npm-package-with-machine-learning/training/material/training_set/normal/antd-mobile.csv"
   flatmap_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious-dedupli/flatmap-stream.csv"

   modelName = sys.argv[2]
   if modelName == 'RF':
        predict_package_RF(sys.argv[1])
   elif modelName == 'SVM':
        predict_package_SVM(sys.argv[1])
   elif modelName == 'NB':
        predict_package_NB(sys.argv[1])
   elif modelName == 'MLP':
        predict_package_MLP(sys.argv[1])  

        