import random
import numpy as np
from sklearn.model_selection import train_test_split

X = []
for i in range(25):
   X.append([i])
y = []
for i in range(25):
   if i < 15:
      y.append(1)
   else:
      y.extend()
x_train, x_test, y_train , y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)

print(x_train)
print(y_train)
print(x_test)
print(y_test)
