from sklearn.metrics import accuracy_score, f1_score, make_scorer, matthews_corrcoef, precision_score, recall_score


table_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/src/table/on_knife_and_duan"
field_names = ["hyperparamter", "accuracy", "precision", "recall", "f1", "MCC"]
classifier_save_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/src/classifier"

scoring = {
      "prec": make_scorer(precision_score, pos_label="malicous"),
      "accu": make_scorer(accuracy_score),
      "rec": make_scorer(recall_score, pos_label="malicous"),
      "f1": make_scorer(f1_score, pos_label="malicous"),
      "matt_cor": make_scorer(matthews_corrcoef)
}