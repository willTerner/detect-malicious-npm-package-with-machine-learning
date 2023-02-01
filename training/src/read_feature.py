#! /usr/bin/env python
import csv
import os

feature_name_arr = ["editDistance","averageBracket","packageSize","dependencyNumber","devDependencyNumber","jsFileNumber",
"bracketNumber",
"hasInstallScript",
"containIP",
"useBase64Conversion",
"containBase64String",
"createBufferFromASCII",
"containBytestring",
"containDomain",
"useBufferFrom",
"useEval",
"requireChildProcessInJSFile",
"requireChildProcessInInstallScript",
"accessFSInJSFile",
"accessFSInInstallScript",
"accessNetworkInJSFile",
"accessNetworkInInstallScript",
"accessProcessEnvInJSFile",
"accessProcessEnvInInstallScript",
"containSuspicousString",
"useCrpytoAndZip",
"accessSensitiveAPI"]

def read_features(malicousPath, normalPath):
   feature_arr = []
   label_arr = []
   csv_name_arr = []
   read_features_from_di(malicousPath, feature_arr, label_arr, True, csv_name_arr)
   read_features_from_di(normalPath, feature_arr, label_arr, False, csv_name_arr)
   return [feature_arr, label_arr, csv_name_arr]

def read_features_from_di(dirPath, feature_arr: list, label_arr: list, isMalicous: bool, csv_name_arr: list):
   for root, _ , files in os.walk(dirPath):
      for f in files:
         csvPath = os.path.join(root, f)
         csv_name_arr.append(f)
         with open(csvPath, "r") as feature_file:
            i = 0
            feature_vec = []
            for row in csv.reader(feature_file):
               feature, value = row
               if i < 7:
                  if value == "NaN":
                     value = 0
                  else:
                     value = float(value)
               else:
                  if value == "true":
                     value = True
                  else:
                     value = False
               i += 1
               feature_vec.append(value)
            feature_arr.append(feature_vec)
            label_arr.append("malicous" if isMalicous  else "benign")
                  