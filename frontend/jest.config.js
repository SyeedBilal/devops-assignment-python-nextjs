module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^axios$": "<rootDir>/mocks/axios.js",
  },
  testMatch: ["**/tests/**/*.test.js"],
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./.babelrc" }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)",
  ],
};
