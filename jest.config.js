module.exports = {
    roots: ['<rootDir>/tests/server'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['jest-extended'],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
};
