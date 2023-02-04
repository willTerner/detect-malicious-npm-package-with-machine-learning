from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.neural_network import MLPClassifier
import random 
import numpy as np
from commons import table_path, field_names,classifier_save_path, scoring
from prettytable import PrettyTable
import os
from model_util import evaluate_model
import pickle

best_layer_size = (100,)
best_activation="logistic"
best_solver="lbfgs"
best_learn_rate_init=0.05045994670005887
best_max_iter=400

def train_MLP_validation(X_train, y_train):
   layer_sizes = [(16, ), (32, ), (100, ), (150, )]
   activations = [ 'logistic']
   solvers = ['lbfgs', 'adam']
   learning_rate_inits = [0.05045994670005887, 0.10144109595857453, 0.17385803166469083, 0.17382621884779412, 0.05255545233279812]


   max_iters = [400, 600]
   alphas = []

   table = PrettyTable()
   table.field_names = field_names

   validation_path = os.path.join(table_path, "MLP_Validation.csv")

   k = 4

   skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=10)

   with open(validation_path, "w+") as f:
      for layer_size in layer_sizes:
         for activation in activations:
            for solver in solvers:
               for learn_rate_init in learning_rate_inits:
                  for max_iter in max_iters:
                        model = MLPClassifier(hidden_layer_sizes=layer_size,
                     solver=solver,  random_state=21, max_iter=max_iter, learning_rate_init=learn_rate_init, activation=activation)

                        scores = cross_validate(model, X_train, y_train, cv = skf, scoring=scoring)

                        table.add_row([f'layer_size = {layer_size}; activation={activation}; solver={solver};learn_rate_int={learn_rate_init};max_iter={max_iter}', scores["test_accu"].mean(), scores["test_prec"].mean(), scores["test_rec"].mean(), scores["test_f1"].mean(), scores["test_matt_cor"].mean()])
      f.write(table.get_csv_string())

def test_MLP(X_train, y_train, X_test, y_test):
   test_path = os.path.join(table_path, "MLP_Test.csv")
   save_path = os.path.join(classifier_save_path, "MLP.pkl")

   model = MLPClassifier(hidden_layer_sizes=best_layer_size, activation=best_activation, solver=best_solver, learning_rate_init=best_learn_rate_init, max_iter=best_max_iter)
   
   model.fit(X_train, y_train)
   y_pred = model.predict(X_test)

   with open(save_path, "wb") as f:
      pickle.dump(model, f)

   [accuracy, precision, recall, f1, mcc] = evaluate_model(y_test, y_pred)

   table = PrettyTable()
   table.field_names = field_names
   
   table.add_row([f'layer_size = {best_layer_size}; activation={best_activation}; solver={best_solver};learn_rate_int={best_learn_rate_init};max_iter={best_max_iter}', accuracy, precision, recall, f1, mcc])

   with open(test_path, "w+") as f:
      f.write(table.get_csv_string())


   