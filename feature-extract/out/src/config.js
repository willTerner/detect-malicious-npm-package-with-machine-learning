export var Language;
(function (Language) {
    Language[Language["CHINESE"] = 0] = "CHINESE";
    Language[Language["ENGLISH"] = 1] = "ENGLISH";
})(Language || (Language = {}));
export var Classifier;
(function (Classifier) {
    Classifier["RF"] = "RF";
    Classifier["SVM"] = "SVM";
    Classifier["NB"] = "NB";
    Classifier["MLP"] = "MLP";
})(Classifier || (Classifier = {}));
const config = {
    positionRecorder: null,
    language: Language.CHINESE,
    classifier: Classifier.SVM
};
export const getConfig = () => config;
export const setPositionRecorder = (positionRecorder) => {
    config.positionRecorder = positionRecorder;
};
export const setLanguage = (language) => {
    config.language = language;
};
export const isEnglish = () => config.language === Language.ENGLISH;
export const setClassifier = (classifier) => {
    config.classifier = classifier;
};
//# sourceMappingURL=config.js.map