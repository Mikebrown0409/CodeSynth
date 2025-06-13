module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        window: "readonly",
        document: "readonly",
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
      },
    },

    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        { args: "after-used", ignoreRestSiblings: true },
      ],
      "no-console": "warn",
      "no-debugger": "warn",
      eqeqeq: ["error", "smart"],
      curly: ["error", "multi-line", "consistent"],

      /* Best Practices / Modern JS */
      "consistent-return": "error",
      "arrow-body-style": ["warn", "as-needed"],
      "prefer-const": "warn",
      "no-var": "error",

      /* Stylistic */
      semi: ["error", "always"],
      quotes: ["error", "single", { avoidEscape: true }],
      indent: ["error", 2, { SwitchCase: 1 }],
      "max-len": ["warn", { code: 100, ignoreUrls: true, ignoreStrings: true }],
    },
  },
];

// Needed if we add back to file for react plugin
// overrideConfigFile: true,
// overrideConfig:
