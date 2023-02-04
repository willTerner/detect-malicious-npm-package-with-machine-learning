from model_util import evaluate_model
from pickle_util import save_classifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_validate
from prettytable import PrettyTable
import os
import numpy as np

from commons import table_path, field_names,classifier_save_path,scoring


rf_best_estimator = 64
rf_best_depth = 15

def train_classifier_RF_Validation(X, y):
   k = 4
   skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=10)


   table_validate_path = os.path.join(table_path, "RF_table_Validation.csv")


   estimators = [16, 32, 64, 100, 128, 256, 512]
   max_depths = [3, 5, 7, 11, 15]

   validate_table = PrettyTable()
   validate_table.field_names = field_names


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

   save_path = os.path.join(classifier_save_path, "RF.pkl")

   save_classifier(model, save_path)

   test_table_path = os.path.join(table_path, "RF_table_test.csv")
   table = PrettyTable()
   table.field_names = field_names
   y_pred = model.predict(X_test)
   [accuracy, precision, recall, f1, mcc] = evaluate_model(y_test, y_pred)
   table.add_row([f'estimators = {rf_best_estimator}; max_depth={rf_best_depth}', accuracy, precision, recall, f1, mcc])
   with open(test_table_path, "w+") as f:
      f.write(table.get_csv_string())