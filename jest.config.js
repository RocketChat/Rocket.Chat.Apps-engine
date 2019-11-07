module.exports = {
    roots: ['<rootDir>/tests/server'],
    coverageDirectory: 'coverage',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFilesAfterEnv: ['jest-extended']
};
