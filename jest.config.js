module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transform: {
        // '^.+\\.(ts|tsx)$': 'babel-jest'
        "^.+\\.[t|j]sx?$": "ts-jest"
    },
    testMatch: [
        '**/tests/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node'
};
// module.exports = {
//     "roots": [
//       "<rootDir>/tests"
//     ],
//     "testMatch": [
//       "**/tests/**/*.+(ts|tsx|js)",
//       "**/?(*.)+(spec|test).+(ts|tsx|js)"
//     ],
//     "transform": {
//       "^.+\\.(ts|tsx)$": "ts-jest"
//     },
//   }