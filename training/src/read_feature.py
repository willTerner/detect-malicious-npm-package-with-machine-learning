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

def normalize_feature(value, i):
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
   return value

def read_feature_from_file(file_path):
   feature_vec = []
   with open(file_path, "r") as f:
      i = 0
      for row in csv.reader(f):
         _, value = row
         feature_vec.append(normalize_feature(value, i))
         i += 1
   return feature_vec
      


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
         feature_arr.append(read_feature_from_file(csvPath))
         label_arr.append("malicous" if isMalicous  else "benign")
                  