
import { PositionRecorder } from "./feature-extract/PositionRecorder";

export enum Language {
   CHINESE,
   ENGLISH,
}

export enum Classifier {
   RF = 'RF',
   SVM = 'SVM',
   NB = 'NB',
   MLP = 'MLP',
}

interface Config {
   positionRecorder: PositionRecorder;
   language: Language;
   classifier: Classifier;
}

const config: Config = {
   positionRecorder: null,
   language: Language.CHINESE,
   classifier: Classifier.SVM,
};

export const getConfig = () => config;



export const setPositionRecorder = (positionRecorder: PositionRecorder) => config.positionRecorder = positionRecorder;

export const setLanguage = (language: Language) => config.language = language;

export const isEnglish = () => config.language === Language.ENGLISH;

export const setClassifier = (classifier: Classifier) => config.classifier = classifier;
