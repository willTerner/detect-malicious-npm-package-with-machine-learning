// Sync object
const config = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testPathIgnorePatterns: ['<rootDir>/out/', '<rootDir>/node_modules/']
};
export default config;
//# sourceMappingURL=jest.config.js.map