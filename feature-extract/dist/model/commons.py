import os
from sklearn.metrics import accuracy_score, f1_score, make_scorer, matthews_corrcoef, precision_score, recall_score

def getCurrentDir():
      return os.path.dirname(os.path.abspath(__file__))

table_path = os.path.join(getCurrentDir(), 'table', 'on_knife_and_duan')

field_names = ["hyperparamter", "accuracy", "precision", "recall", "f1", "MCC"]

classifier_save_path = os.path.join(getCurrentDir(), 'classifier')

rf_classifier_path = os.path.join(classifier_save_path, "RF.pkl")
MLP_path = os.path.join(classifier_save_path, "MLP.pkl")
nb_path = os.path.join(classifier_save_path, 'NB.pkl')
svm_path = os.path.join(classifier_save_path, 'SVM.pkl')

classifier_path = svm_path

scaler_save_path = os.path.join(getCurrentDir(), 'classifier')
rf_scaler_save_path = os.path.join(scaler_save_path, 'RF_scaler.pkl')
mlp_scaler_save_path = os.path.join(scaler_save_path, 'MLP_scaler.pkl')
nb_scaler_save_path = os.path.join(scaler_save_path, 'NB_scaler.pkl')
svm_scaler_save_path = os.path.join(scaler_save_path, 'SVM_scaler.pkl')

scoring = {
      "prec": make_scorer(precision_score, pos_label="malicious"),
      "accu": make_scorer(accuracy_score),
      "rec": make_scorer(recall_score, pos_label="malicious"),
      "f1": make_scorer(f1_score, pos_label="malicious"),
      "matt_cor": make_scorer(matthews_corrcoef)
}

training_path = os.path.join(os.path.dirname(getCurrentDir()), 'material', 'training_set')
normal_csv_path = os.path.join(training_path, 'normal')
malicous_csv_path = os.path.join(training_path, 'malicious')
supplement_csv_path = os.path.join(os.path.dirname(getCurrentDir()), 'material', 'supplement-test-data-set')