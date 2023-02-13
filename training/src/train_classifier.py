from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from read_feature import read_features
from train_MLP import train_MLP_validation, test_MLP
from train_NB import test_NB, train_NB_Validate
from train_RF import test_RF, test_RF_load, train_classifier_RF_Validation
from train_SVM import test_SVM, train_SVM_validate
from test import test
from pickle_util import save_scaler
import os
from commons import getCurrentDir, rf_scaler_save_path, mlp_scaler_save_path, nb_scaler_save_path, svm_scaler_save_path, training_path, malicous_csv_path, normal_csv_path

methods = ["none", "standardlize", "min-max-scale"]
preprocess_method = methods[0]

models = ["RF", "MLP", "NB", "SVM"]
use_model = models[0]

actions = ['training', 'save', 'test']
action = actions[1]

def preprocess(X_train, X_test, scaler_save_path):
   if preprocess_method == methods[0]:
      return [X_train, X_test]
   if preprocess_method == methods[1]:
      scaler = StandardScaler()

      # Fit the scaler to the training data
      scaler.fit(X_train)

      # Transform the training and test data using the fitted scaler
      X_train_scaled = scaler.transform(X_train)
      X_test_scaled = scaler.transform(X_test)

      save_scaler(scaler, scaler_save_path)

      return [X_train_scaled, X_test_scaled]
   if preprocess_method == methods[2]:
      scaler = MinMaxScaler()
      scaler.fit(X_train)
      X_train_scaled = scaler.transform(X_train)
      X_test_scaled = scaler.transform(X_test)
      save_scaler(scaler, scaler_save_path)
      return [X_train_scaled, X_test_scaled]

if __name__ == "__main__":
   


   [X, y, csv_name_arr] = read_features(malicous_csv_path, normal_csv_path)





   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
   
   # preprocess data
   scaler_save_path = os.path.join(getCurrentDir(), 'classifier')
   if use_model == models[0]:
      scaler_save_path = rf_scaler_save_path
   elif use_model == models[1]:
      scaler_save_path = mlp_scaler_save_path
   elif use_model == models[2]:
      scaler_save_path = nb_scaler_save_path
   elif use_model == models[3]:
      scaler_save_path = svm_scaler_save_path

   [X_train, X_test] = preprocess(X_train, X_test, scaler_save_path)
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
      test(X_test, y_test)
