import os

from prettytable import PrettyTable

from model_util import evaluate_model

from pickle_util import load_classifier
from commons import table_path, classifier_path, field_names


def test(X_test, y_test):
   model = load_classifier(classifier_path)
   test_table_path = os.path.join(table_path, "test.csv")
   table = PrettyTable()
   table.field_names = field_names[1:]
   y_pred = model.predict(X_test)
   [accuracy, precision, recall, f1, mcc] = evaluate_model(y_test, y_pred)
   table.add_row([accuracy, precision, recall, f1, mcc])
   with open(test_table_path, "w+") as f:
      f.write(table.get_csv_string())