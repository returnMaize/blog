## 介绍

在协同开发中，规范化代码规范是非常重要的。我们期望团队所有成员的都能按照相同的代码规范和风格编写代码，并且提交信息规范也一致。这对 code review 和后期维护非常重要，并且一定的规范约束也能避免代码的故障率。

## 目标

（以 `vue` 项目为例）

- 统一单文件 vue 和 ts 代码的规范
- 统一团队格式化风格（一键格式化）
- 统一团队信息提交规范
- 代码提交仓库前一件格式化所有代码并对不符合编码规范的代码进行拦截，不允许提交

## 技术选型

- `vite` 初始化项目（vue3 + ts）
- `eslint` 规范化单文件 vue 和 ts 编码规范
- `prettier` 统一格式化
- `commitlint` 统一提交规范
- `husky` 和 `lint-staged` 实现代码提交守卫（拦截不符合规范的代码和提交信息）

## 配置

### 项目初始化

```bash
pnpm create vite
✔ Project name: … your-project
✔ Select a framework: › Vue
✔ Select a variant: › TypeScript
```

这里你可能已经注意到我们使用的是 `pnpm create`，而非 `npm create`。`pnpm` 是一款新型的包管理工具，你可以通过阅读 [pnpm docs](https://pnpm.io/motivation) 进行了解。另外如果你不了解 `npm create` 是什么命令，你同样可以通过阅读 [npm docs](https://docs.npmjs.com/cli/v8/commands/npm-init) 进行了解。它其实是 `npm init` 的别名，执行 `npm create vite` 等同于执行 `npx create-vite`。如果你想了解更多关于 `create-vite` 脚手架的内容，可以阅读 [create-vite RAEDME](https://github.com/vitejs/vite/tree/main/packages/create-vite) 进行了解

现在我们便拥有了一个 vue + ts 的项目，在规范化代码之前，我们需要对我们的项目环境进行一定的限制。团队的成员必须使用 `pnpm` 安装项目依赖，且 `node` 版本必须大于等于 `16+`。

**package.json**

```json
{
  "scripts": {
    // ...
    "preinstall": "npx only-pnpm"
  },
  "engines": {
    "node": ">=16.19.1"
  }
}
```

**.npmrc**

```
engine-strict = true
```

之所有需要对 node 版本进行一定的约束，是因为 `pnpm` 和 `vite` 对 `node` 环境都有一定的要求。

### 1. 使用 `eslint` 规范化单文件 vue 和 ts

```bash
# 安装 eslint
pnpm i eslint -D
# 安装 eslint-plugin-vue 使用 vue3 推荐规范
# 安装 vue-eslint-parser 解析 vue 语法为 AST 使得 eslint 能够完成语法检查
pnpm install --save-dev eslint-plugin-vue vue-eslint-parser
# 安装 @typescript-eslint/eslint-plugin 使用 ts 推荐的语法规范和类型规范
# 安装 @typescript-eslint/parser 解析 ts 语法为 AST 使得 eslint 能够完成语法检查
pnpm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**.eslintrc.js**

```js
/**@type {import('eslint').Linter.Config} */
const config = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    project: true,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.!(ts)'],
    },
  ],
}

module.exports = config
```

**package.json**

```json
{
  "scripts": {
    // ...
    "lint": "eslint 'src/**/*.{js,ts,vue}'"
  }
}
```

为了能够实时的观察到 `eslint` 检查之后的结果，我们可以在 `vs code` 编辑器中安装 `Eslint` 插件，它会根据我们 `.eslintrc.js` 中的配置实时的检查代码，并且将检查结果反馈到编辑器中。

另外，如果你想了解更多关于单文件 vue 和 ts 中的 lint 规则，可以查看 [eslint-plugin-vue docs](https://eslint.vuejs.org/rules/) 和 [typescript-eslint docs](https://typescript-eslint.io/rules/) 进行了解

### 2. 使用 `prettier` 规范代码格式化

```bash
# 安装 prettier 用于代码格式化（锁定版本，防止因版本导致格式化不一）
pnpm install --save-dev --save-exact prettier
# 安装 eslint-config-prettier 用于解决 prettier 和 eslint 代码风格规范的冲突
pnpm i eslint-config-prettier -D
```

**.eslintrc.js**

```js
const config = {
  // ...
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier', // 这里 prettier 需要放最后，冲突时可以覆盖以上所有规则
  ],
  // ...
}
```

**.prettierrc.js**

```js
/** @type {import("prettier").Options} */
const config = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
}

module.exports = config
```

**package.json**

```json
{
  "scripts": {
    // ...
    "prettier": "prettier . --write"
  }
}
```

为了更好的编码体验，我也建议你在 `vs code` 编辑器中安装一个 `Prettier` 插件，他能根据你项目中的 `.prettierrc.js` 配置文件和 `prettier` 版本进行格式化，安装完成后将其设置为编辑器默认的格式化工具。并在保存文件时自动运行它。

### 3. 使用 commitlint 规范化信息提交

```bash
# 安装 @commitlint/cli 用于提交信息检查
# 安装 @commitlint/config-conventional 提交规范（约定式提交）
pnpm install --save-dev @commitlint/config-conventional @commitlint/cli`
```

```bash
# 安装 husky
pnpm install husky --save-dev
```

**commitlint.config.js**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

```bash
# 安装 husky
pnpm install husky --save-dev
# 启用 git hooks
npx husky install
# 安装 commit-msg 钩子，并在此钩子中执行 commitlint 完成提交信息检查
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

**package.json**

```json
{
  "scripts": {
    // ...
    // 其他成员安装完依赖后自动启动 git hooks，这在协同开发中很有用
    "prepare": "husky install"
  }
}
```

### 4. 使用 lint-staged 完成代码提交守卫

上面我们完成了成员编码过程中的规范校验和格式化统一，虽然已经在理论上可以保证团队中的编码规范。但一个团队中往往总是有那么几个特立独行，他们可能不会修复 `linter` 工具检测出来的错误，他们可能也不会使用 `prettier` 进行代码格式化。为此我们需要在代码提交前加最后一道防线，防止不符合规范的代码被提交到仓库中。

**安装 lint-staged**

```bash
# 安装 lint-staged
pnpm install --save-dev lint-staged
# 安装 pre-commit 钩子，且在钩子中执行 lint-staged
npx husky add .husky/pre-commit "npx lint-staged"
```

**配置 lint-staged**

package.json

```json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["prettier -l", "eslint"],
    "*.{md,json,css,scss}": "prettier -l"
  }
}
```

自此，我们就完成代码提交的守卫工作。当其他成员提交代码时，首先会检查代码是否都是用 `prettier` 完成格式化，然后检查代码是否都通过 `eslint` 的规范检查，最后再校验提交信息是否符合约定式规范 🎉。

最后：如果你想了解更多关于 lint-staged 内容，可以查看 [lint-staged README](https://www.npmjs.com/package/lint-staged)
