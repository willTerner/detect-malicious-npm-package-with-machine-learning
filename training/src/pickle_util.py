import pickle


def save_classifier(classifier, file_path):
   with open(file_path, "wb") as f:
      pickle.dump(classifier, f)

def load_classifier(file_path):
   with open(file_path, "rb") as f:
      return pickle.load(f)
