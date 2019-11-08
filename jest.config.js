module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests/server'],
    coverageDirectory: 'coverage',
    transform: {
        '^.+\\.ts?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFilesAfterEnv: ['jest-extended'],
};
