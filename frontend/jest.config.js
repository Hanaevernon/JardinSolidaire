module.exports = {
  babelConfig: './babel.jest.config.js',
  testEnvironment: "jsdom",
  testMatch: [
    "**/src/tests/**/*.test.js",
    "**/src/tests/**/*.spec.js"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/src/testsE2E/"
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  }
  ,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
