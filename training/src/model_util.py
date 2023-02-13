from sklearn.metrics import accuracy_score, f1_score, matthews_corrcoef, precision_score, recall_score


def evaluate_model(y_test, y_pred):
   # Evaluate the model
   acc = accuracy_score(y_test, y_pred)

   precision = precision_score(y_test, y_pred, pos_label="malicious")

   recall = recall_score(y_test, y_pred, pos_label="malicious")

   f1 = f1_score(y_test, y_pred, pos_label="malicious")

   mcc = matthews_corrcoef(y_test, y_pred)
   
   return [acc, precision, recall, f1, mcc]