module.exports = {
  node: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 9,
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint']
}
