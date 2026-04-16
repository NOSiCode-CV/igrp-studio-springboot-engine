/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    "^prettier-plugin-java$": "<rootDir>/__mocks__/prettier-java-plugin.cjs",
  },
};