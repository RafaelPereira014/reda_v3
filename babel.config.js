module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  plugins: [
    ["babel-plugin-root-import", {
      paths : [
        {
          "rootPathSuffix": "public/assets/scripts",
          "rootPathPrefix": "#"
        },
        {
          "rootPathSuffix": "public/assets/scripts/admin",
          "rootPathPrefix": "%"
        },
        {
          "rootPathSuffix": "server",
          "rootPathPrefix": "#%"
        }
      ]      
    }],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ],
  env: {
    test: {
      presets: [
        "@babel/preset-env",
        "@babel/preset-react"
      ]
    }
  }
}