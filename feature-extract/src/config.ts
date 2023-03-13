interface Config {
   isRecordFeaturePos: boolean;
}

let config: Config = {
   isRecordFeaturePos: false,
};

export const getConfig = () => config;


export const setIsRecordFeaturePos = (isRecordFeaturePos: boolean) => config.isRecordFeaturePos = isRecordFeaturePos;

