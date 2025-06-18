module.exports = {
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}; 