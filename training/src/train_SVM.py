from prettytable import PrettyTable
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.svm import SVC
import os
from commons import table_path, scoring, field_names, classifier_save_path
from model_util import evaluate_model
import pickle

from pickle_util import save_classifier

best_C = 1.611045328589775
best_gamma = "scale"

def train_SVM_validate(X, y):
   C_arr = [1.1666208879984832, 0.5315214640416588, 1.070439127122467, 1.611045328589775, 0.5336321596105815, 1.2928]
   gamma_arr = ["scale", "auto", 0.21150505, 0.17463293, 0.12063201, 0.3218]
   k = 4
   skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=10)
   table = PrettyTable()
   csv_path = os.path.join(table_path, "SVM_Validation.csv")
   table.field_names = field_names
   with open(csv_path, "w+") as f: 
      for C_val in C_arr:
         for gamma_val in gamma_arr:
               model = SVC(kernel="rbf", C=C_val, gamma=gamma_val)
               scores = cross_validate(model, X, y, cv= skf, scoring=scoring)
               table.add_row([f"c={C_val}; gamma_val={gamma_val};", scores["test_accu"].mean(), scores["test_prec"].mean(), scores["test_rec"].mean(), scores["test_f1"].mean(), scores["test_matt_cor"].mean()])
      f.write(table.get_csv_string())

def test_SVM(X_train, y_train, X_test, y_test):
   table = PrettyTable()
   table.field_names = field_names
   model = SVC(C=best_C, gamma=best_gamma)
   model.fit(X_train, y_train)
   y_pred = model.predict(X_test)

   save_path = os.path.join(classifier_save_path, "SVM.pkl")
   save_classifier(model, save_path)
   
   [accuracy, precision, recall, f1, mcc] = evaluate_model(y_test, y_pred)

   csv_path = os.path.join(table_path, "SVM_test.csv")
   with open(csv_path, "w+") as f:
      table.add_row([f"C={best_C}; gamma={best_gamma}", accuracy, precision, recall, f1, mcc])
      f.write(table.get_csv_string())
