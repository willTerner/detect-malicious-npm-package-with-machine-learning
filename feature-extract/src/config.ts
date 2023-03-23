import { PositionRecorder } from "./PositionRecorder";

interface Config {
   isRecordFeaturePos: boolean;
   positionRecorder: PositionRecorder;
}

let config: Config = {
   isRecordFeaturePos: false,
   positionRecorder: null,
};

export const getConfig = () => config;


export const setIsRecordFeaturePos = (isRecordFeaturePos: boolean) => config.isRecordFeaturePos = isRecordFeaturePos;

export const setPositionRecorder = (positionRecorder: PositionRecorder) => config.positionRecorder = positionRecorder;
