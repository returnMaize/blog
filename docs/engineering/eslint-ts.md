## 介绍

eslint 在默认情况下只会对 js 文件进行检查，并且也只能解析 js 文件。如果我们想要让它具备检查 TypeScript 的能力，就需要自定义规则和解析器。这是非常耗时的，但令人庆幸的是，TypeScript 官方已经给我们写好插件 `@typescript-eslint/eslint-plugin` 和解析器 `@typescript-eslint/parser`。如果你想了解更多关于 `eslint` 插件和解析器相关的内容，你可以阅读 [eslint docs](https://eslint.org/docs/latest/extend/plugins)

## 安装和配置

#### 安装

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

#### 配置

.eslintrc.js

```js
/* eslint-env node */
module.exports = {
  // 使用 eslint 推荐规则 和 @typescript-eslint 插件中的推荐规则
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  // 使用 @typescript-eslint/parser 解析 ts 文件（transform AST）
  parser: '@typescript-eslint/parser',
  // 解析器配置
  parserOptions: {
    // 告诉解析器就近查找 tsconfig.json
    project: true,
    // 告诉解析器项目根目录
    tsconfigRootDir: __dirname,
  },
  // 导入 @typescript-eslint 插件
  plugins: ['@typescript-eslint'],
  // 针对 js 文件，禁用 @typescript-eslint 类型检查
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.js'],
    },
  ],
  root: true,
}
```

#### 使用

```bash
npx eslint .
```
