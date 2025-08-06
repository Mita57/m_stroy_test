module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
    '@vue/cli-plugin-unit-jest'
  ],
  "moduleFileExtensions": [
    "js",
    "ts",
    "vue",
    "svg",
  ],
  "roots": [
    "<rootDir>",
  ],
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  "modulePaths": [
    "<rootDir>",
  ],
  "transform": {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.svg$": "jest-transform-stub",
  },
  "testEnvironment": "jsdom"
};
