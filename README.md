## environment

+ node.js 16.18.1

+ python3

## usage

1. clone the repository 
2. install necessary python library.please look for training/src for detail.
3. install npm dependency

```bash
cd feature-extract
npm install
```

4.   
+ If you want to detect single package, please use following command.

```bash
node --es-module-specifier-resolution=node out/src/index.js -s $package_path [-c $classifier]
```

   Note that $packag_path is the absolute path of your npm package which should have a packgae.json file. It takes some time to analyze the package. At the end, this program will print if this package is malicious or not in console.

<img title="" src="./image/截屏2023-03-26 23.12.14.png" alt="">

+ If you want to detect all npm packages in certain directory, please use following command.

```bash
node --es-module-specifier-resolution=node out/src/index.js -b $dir [-c $classifier]
```

+ Note that $classifier is optional classifier from RF, SVM, NB, MLP. Default classifier is SVM.

## documentation

### feature-extract directory

This program can analyze if a package is a malicious package or not. 

This program is used to extract feature values from npm package originally. It scans all the file in the package and use [babel](https://github.com/babel/babel) and regular expression to give a static analysis of package source code.These features are as follows.  
<img title="" src="./image/截屏2023-03-26 23.22.15.png" alt="">

### training directory

This project is used to traing classifier model and evaluate the performance of the model. At this time, MLP,RF, NB, Kernel SVM are used as classifier.  

Note:
You can download benign npm package in [npm registry](https://www.npmjs.com/).
The malicious package in train set is from [ohm](https://dasfreak.github.io/Backstabbers-Knife-Collection/).  
The malicious package in test set is from [Duan](https://github.com/osssanitizer/maloss).

## experiment result

<img title="" src="./image/截屏2023-03-26 23.24.38.png" alt="">