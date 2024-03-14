module.exports = {
  "verbose": true,
  "setupFiles": [
    "<rootDir>/public/assets/scripts/setupTests.js"
  ],
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "transformIgnorePatterns": [
    // Change MODULE_NAME_HERE to your module that isn't being compiled
    "/node_modules/.+\\.js$"
  ]
}