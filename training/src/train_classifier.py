from read_feature import read_features
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, get_scorer_names, make_scorer
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.metrics import matthews_corrcoef
from prettytable import PrettyTable
import os
import numpy as np

table_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/src/table"
field_names = ["hyperparamter", "accuracy", "precision", "recall", "f1", "MCC"]

rf_best_estimator = 64
rf_best_depth = 15

def train_classifier_RF_Validation(X, y, csv_name_arr):
   X = np.array(X)
   y = np.array(y)
   k = 4
   skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=10)


   table_validate_path = os.path.join(table_path, "RF_table_Validation.csv")


   estimators = [16, 32, 64, 100, 128, 256, 512]
   max_depths = [3, 5, 7, 11, 15]

   validate_table = PrettyTable()
   validate_table.field_names = field_names

   scoring = {
      "prec": make_scorer(precision_score, pos_label="malicous"),
      "accu": make_scorer(accuracy_score),
      "rec": make_scorer(recall_score, pos_label="malicous"),
      "f1": make_scorer(f1_score, pos_label="malicous"),
      "matt_cor": make_scorer(matthews_corrcoef)
   }
   with open(table_validate_path, "w+") as validate_file:
      for estimator in estimators:
            for depth in max_depths:
               model = RandomForestClassifier(n_estimators=estimator, max_depth=depth)
               scores = cross_validate(model, X, y, cv=skf,scoring=scoring)
               validate_table.add_row([f'estimators = {estimator}; max_depth={depth}', scores["test_accu"].mean(), scores["test_prec"].mean(), scores["test_rec"].mean(), scores["test_f1"].mean(), scores["test_matt_cor"].mean()])
      validate_file.write(validate_table.get_csv_string())

def test_RF(X_train, y_train, X_test, y_test):
   model = RandomForestClassifier(n_estimators=rf_best_estimator, max_depth=rf_best_depth)
   model.fit(X_train, y_train)
   test_table_path = os.path.join(table_path, "RF_table_test.csv")
   table = PrettyTable()
   table.field_names = field_names
   y_pred = model.predict(X_test)
   [accuracy, precision, recall, f1, mcc] = evaluate_model(y_test, y_pred)
   table.add_row([f'estimators = {rf_best_estimator}; max_depth={rf_best_depth}', accuracy, precision, recall, f1, mcc])
   with open(test_table_path, "w+") as f:
      f.write(table.get_csv_string())

def evaluate_model(y_test, y_pred):
   # Evaluate the model
   acc = accuracy_score(y_test, y_pred)

   precision = precision_score(y_test, y_pred, pos_label="malicous")

   recall = recall_score(y_test, y_pred, pos_label="malicous")

   f1 = f1_score(y_test, y_pred, pos_label="malicous")

   mcc = matthews_corrcoef(y_test, y_pred)
   
   return [acc, precision, recall, f1, mcc]

if __name__ == "__main__":
   malicous_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious"
   normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal"
   malicous_dedupli_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious-dedupli"
   [X, y, csv_name_arr] = read_features(malicous_dedupli_path, normal_path)
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
   train_classifier_RF_Validation(X_train, y_train, csv_name_arr)
   test_RF(X_train, y_train, X_test, y_test)
