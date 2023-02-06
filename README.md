#### environment
+ node.js 16.18.1
+ python3
#### usage
1. clone the repository 
2. install necessary python library.please look for training/src for detail.
3.  execute these commands.
````
cd feature-extract
npm install
npm run start $package_path
````
Note that $packag_path is the absolute path of your npm package which should have a packgae.json file. It takes some time to analyze the package. At the end, this program will print if this package is malicious or not in console.
![alt result](image/截屏2023-02-04%2022.59.34.png)
#### documentation

##### feature-extract directory

This program can analyze if a package is a malicious package or not. The  directory of feature value file is output_feature.  

This program is used to extract feature values from npm package originally. It scans all the file in the package and use [babel](https://github.com/babel/babel) and regular expression to give a static analysis of package source code.These features are as follows.  
![alt features](image/截屏2023-02-04%2022.16.06.png)

#### training directory

This project is used to traing classifier model and evaluate the performance of the model. At this time, MLP,RF, NB, Kernel SVM are used as classifier.  

The train set is material/training_set. Malicious-dedupli subdirecotry contains malicous package feature vectors. Normal subdirectory contains benign package feature vectors.  


The test set is material/test_set. Malicious-dedupli subdirectory contains malicous package feature vector. Normal subdirectory contains benign package feature vectors.

Note:
You can download benign npm package in [npm registry](https://www.npmjs.com/).
The malicious package in train set is from [ohm](https://dasfreak.github.io/Backstabbers-Knife-Collection/).  
The malicious package in test set is from [Duan](https://github.com/osssanitizer/maloss).
#### experiment result
This is test experiment result when using RF  
![alt RF](image/截屏2023-02-04%2022.51.45.png)  
This is test experiment result when using MLP
![alt MLP](image/截屏2023-02-04%2022.51.16.png)