from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.naive_bayes import GaussianNB
from commons import field_names, table_path, scoring, classifier_save_path
from prettytable import PrettyTable
import os
import pickle

from model_util import evaluate_model
from pickle_util import save_classifier

best_smoothing = 1e-9

def train_NB_Validate(X, y):
   table = PrettyTable()
   table.field_names = field_names
   csv_path = os.path.join(table_path, "NB_Validation.csv")
   k = 4
   skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=10)
   smoothings =  [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4]
   with open(csv_path, "w+") as f:
      for smoothing in smoothings:
         model = GaussianNB(var_smoothing=smoothing)
         scores = cross_validate(model, X=X, y=y, cv=skf, scoring=scoring)
         table.add_row([f"smoothing={smoothing}", scores["test_accu"].mean(), scores["test_prec"].mean(), scores["test_rec"].mean(), scores["test_f1"].mean(), scores["test_matt_cor"].mean()])
      f.write(table.get_csv_string())

def test_NB(X_train, y_train, X_test, y_test):
   save_path = os.path.join(classifier_save_path, "NB.pkl")
   model = GaussianNB(var_smoothing=best_smoothing)
   model.fit(X_train, y_train)

   save_classifier(model, save_path)

   csv_path = os.path.join(table_path, "NB_test.csv")

   y_pred = model.predict(X_test)
   [accuracy, precision, recall, f1, mcc] = evaluate_model(y_test, y_pred)

   table = PrettyTable()
   table.field_names = field_names

   with open(csv_path, "w+") as f:
      table.add_row([f"smoothing={best_smoothing}", accuracy, precision, recall, f1, mcc])
      f.write(table.get_csv_string())