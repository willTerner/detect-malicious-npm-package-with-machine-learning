from sklearn.preprocessing import StandardScaler, MinMaxScaler
from read_feature import read_features
from train_MLP import train_MLP_validation, test_MLP
from train_NB import test_NB, train_NB_Validate
from train_RF import test_RF, test_RF_load, train_classifier_RF_Validation
from train_SVM import test_SVM, train_SVM_validate

methods = ["none", "standardlize", "min-max-scale"]
preprocess_method = methods[1]

models = ["RF", "MLP", "NB", "SVM"]
use_model = models[2]

actions = ['training', 'save', 'test']
action = actions[2]

def preprocess(X_train, X_test):
   if preprocess_method == methods[0]:
      return [X_train, X_test]
   if preprocess_method == methods[1]:
      scaler = StandardScaler()

      # Fit the scaler to the training data
      scaler.fit(X_train)

      # Transform the training and test data using the fitted scaler
      X_train_scaled = scaler.transform(X_train)
      X_test_scaled = scaler.transform(X_test)

      return [X_train_scaled, X_test_scaled]
   if preprocess_method == methods[2]:
      scaler = MinMaxScaler()
      scaler.fit(X_train)
      X_train_scaled = scaler.transform(X_train)
      X_test_scaled = scaler.transform(X_test)
      return [X_train_scaled, X_test_scaled]

if __name__ == "__main__":
   malicous_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious"
   normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/normal"
   malicous_dedupli_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/training_set/malicious-dedupli"
   test_malicous_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicious"
   test_normal_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/normal"
   test_malicous_dedupl_path = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/training/material/test_set/malicious-dedupli"
   [X_train, y_train, csv_name_arr] = read_features(malicous_dedupli_path, normal_path)
   [X_test, y_test, _] = read_features(test_malicous_dedupl_path, test_normal_path)




   #X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
   
   # preprocess data
   [X_train, X_test] = preprocess(X_train, X_test)
   if action == actions[0]:
      if use_model == models[0]:
         train_classifier_RF_Validation(X_train, y_train)
      elif use_model == models[1]:
         train_MLP_validation(X_train, y_train)
      elif use_model == models[3]:
         train_SVM_validate(X_train, y_train)
      else:
         train_NB_Validate(X_train, y_train)
   elif action == actions[1]:
      if use_model == models[0]:
         test_RF(X_train, y_train, X_test, y_test)
      elif use_model == models[1]:
         test_MLP(X_train, y_train, X_test, y_test)
      elif use_model == models[3]:
         test_SVM(X_train, y_train, X_test, y_test)
      else:
         test_NB(X_train, y_train, X_test, y_test)
   elif action == actions[2]:
      test_RF_load(X_test, y_test)
