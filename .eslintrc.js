module.exports =  {
  parser:  '@typescript-eslint/parser',  // ESlint Parser
  extends:  [
    'plugin:react/recommended',  // @eslint-plugin-react 规则
    'plugin:@typescript-eslint/recommended',  // @typescript-eslint/eslint-plugin 规则
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',  // 允许 imports 的用法
    ecmaFeatures:  {
      jsx:  true,  // JSX 兼容
    },
  },
  rules:  {
    quotes: ['error', 'single'], // 使用单引号
    indent: ['error', 2],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'always']
  },
  settings:  {
    react:  {
      version:  'detect',  // eslint-plugin-react 自动检测最新版本的 react
    },
  },
};
