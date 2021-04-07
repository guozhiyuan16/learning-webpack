module.exports = {
    "presets":[
       [
        "@babel/preset-env",
        {
            "useBuiltIns": "usage",
            "corejs": 2,
            "targets": {
              "ie": 10
            }
        }
       ]
        
    ],
    "plugins":[
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        "@babel/plugin-transform-runtime"
    ],
    "sourceType": "unambiguous"
}