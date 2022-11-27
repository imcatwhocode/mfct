module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "airbnb-typescript/base"],
  parserOptions: {
		project: './tsconfig.json'
  },
  rules: {},

};
