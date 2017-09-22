module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "comma-spacing": [
            "error",
            {
                "after": true,
                "before": false
            }
        ],
        "indent": ["error", 2],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-len": [1, 125, 2, {"ignoreComments": true}],
        "quotes": [
            "error",
            "single"
        ],
        "unicode-bom": [
            "error",
            "never"
        ],
        "no-console": [ 
            'error', 
            { 
                "allow": ["log", "warn", "error"]
            },
        ]
    }
};