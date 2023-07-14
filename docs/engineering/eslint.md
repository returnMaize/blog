## 概念

问：eslint 是干嘛的？

答：根据制定的规则来检查你的 ECMAScript/JavaScript 代码，能对不符合规则的代码进行提示和一键修复功能（这里的规则可以是 eslint 内置的规则，也可以是自定义的规则）

## 安装

:::warning
eslint 需要 Node.js 版本（^12.22.0、^14.17.0 或 >=16.0.0）
:::

安装 eslint 的两种方式：

#### 自动安装

通过官方提供的 `@eslint/create-config` 脚本（cli 也好）交互式的方式进行 eslint 的安装和配置文件的自动生成。通过这种方式，你将会得到最新的 eslint 包和一份你自己选择的 eslint 配置文件。

```bash
npm init @eslint/config
```

这里你可能对 `npm init` 这个命令有些疑惑，如果想要了解更多关于 `npm init` 相关内容，可以阅读 [npm Docs](https://docs.npmjs.com/cli/v6/commands/npm-init)

对于 `npm init @eslint/config`，你可以直接理解成 npm 会给我们执行 `npx @eslint/create-config`。

#### 手动安装

1. 安装 eslint

```bash
npm install eslint -D
```

2. 新增 eslint 配置文件 `.eslintrc.js`

```bash
touch .eslintrc.js
```

3. 增加一些配置到 `.eslintrc.js` 中

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
```

## 基本使用

```bash
# filepath 为指定的文件，告诉 eslint 需要检查那个文件
# eslint 会检测该文件中的代码内容是否符合配置文件中定义的规则，然后将检查结果输出到命令行
npx eslint <filepath>
```

简单了解了 `eslint` 的安装和使用之后，我们接下来就深入到 `eslint` 的配置中去。它是 `eslint` 的核心，它将告诉 `eslint` 如何去检查我们的代码。

## 配置文件

### 配置文件格式

`eslint` 支持单文件配置 `.eslintrc.<js | cjs | yaml | yml | json>`，以及内嵌到 `package.json`配置。对于不同格式，`eslint` 的读取优先级如下

- .eslintrc.js
- .eslintrc.cjs
- .eslintrc.yaml
- .eslintrc.yml
- .eslint.json
- package.json

### eslint 读取配置文件规则

`eslint` 会从需要检查的文件目录下开始查找 `.eslintrc.*` 和 `package.json` 文件。如果没有找到，会开始向父目录进行查找，直到找到文件系统根目录或则指定了 `root: true` 时停止。

你也可以通过命令行参数 `--config` 手动指定具体的配置文件。

### 扩展配置

针对不同项目的 `eslint` 配置，我们不可能每次都需要自己配置。因为它们大多情况下都是相同的，这时我们便可以通过 `eslint` 提供的 `extends` 配置项来扩展我们的配置。它会继承我们指定好的所有配置（规则、插件和语言选项）。

`extends` 值类型：

- 【字符】具体的文件路径或发布到 `npm` 上的包名称（如 `airbnb`，包名称规则为 `eslint-config-*`，使用 `extends` 可以省略前缀 `eslint-config-`。）
- 【字符数组】同上（多个扩展，再遇到冲突规则时，后面的扩展会覆盖掉前面的扩展）

如果继承的规则与配置文件中的规则发生冲突，配置文件的规则优先级更高

## 配置之语言特性

### env

总所周知，我们的代码可以运行在不同的环境中。而不同的环境会给我提供不同的全局变量，如在浏览器环境中。我们能够使用 `window`，而在其他环境中这个全局变量将不存在。而 `eslint` 并不知道我们的代码运行在什么环境中，拥有那些全局变量，所以这时候就需要一个配置项来告诉 `eslint` 我们的代码会运行在什么环境中。而这个配置就是 `env`

`env` 值选项

- browser
- node
- commonjs
- es6
- es2016
- es2017
- ... （如果想了解更多，可以参考 [eslint 文档](https://eslint.org/docs/latest/use/configure/language-options)）

除了使用 `eslint` 提供给我们的环境，我们也可以使用插件中的 env

```json
{
  "plugins": ["example"],
  "env": {
    "example/custom": true
  }
}
```

如果上述两种方式依然不能给你提供你想要的全局变量，你也可以通过 `globals` 配置你想要的全局变量

```json
{
  "globals": {
    "var1": "writable",
    "var2": "readonly",
    "Promise": "off" // 禁用
  }
}
```

### 语法

`env` 告诉了 `eslint` 我们代码环境中内置了哪些全局变量，而 `parserOptions` 告诉了 `eslint` 该用什么样的语法去检查我们的代码。默认 `eslint` 使用的是 ECMAScript 5 的语法进行检查。
`parserOptions` 属性

- ecmaVersion 可选配置值 3、5（默认）、6、7、8...、（你也可以设置成 2015、2016）、latest（最新版）
- sourceType 默认为 script、也可以是 module
- allowReserved 是否允许使用 ES 保留字作为标识符（如果 ecmaVersion 为 3）
- ecmaFeatures
  - globalReturn 允许全局范围内的 return 语句
  - impliedStrict - 启用全局严格模式（如果 ecmaVersion 是 5 或更高版本）
  - jsx - 启用 JSX

示例

```json
{
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "semi": "error"
  }
}
```

## 配置之规则

规则是 `eslint` 的核心模块，它将告诉 `eslint` 该如何去检查我们的代码。
`eslint` 拥有大量的[内置规则](https://eslint.org/docs/latest/rules/)，这些规则如果你不进行任何配置的话，默认都是关闭的。当然你可以直接通过配置 `extends: 'eslint:recommended'` 来直接开启所有 `eslint` 推荐的规则。也可以去内置规则中选择你需要的规则进行手动开启和关闭。

:::tip
不推荐你使用 `extends: eslint:all` 来开启所有的 `eslint` 规则，虽然它能在一定程度上带来严格的规则校验，但它会随着你 `eslint` 版本的变化而变化。对于不同版本的 `eslint` ，它可能会拥有不同的规则（如新版本新增的规则、废弃的规则）
:::

### 配置规则

指定规则 ID 和规则对应的值（规则 ID 可以通过查看[内置规则](https://eslint.org/docs/latest/rules/)进行获取）
规则对应的值：

- "off" 或 0 - 关闭规则
- "warn" 或 1 - 启用并视作警告（不影响退出）。
- "error" 或 2 - 启用并视作错误（触发时退出代码为 1）

### 插件规则

`eslint` 默认只支持 JS 的规则检查，对于一些特殊的文件（如 .vue）。这时候使用 `eslint` 内置的规则就有点不够看了，`eslint` 对于 vue 的规则和语法并没有很好的一个支持，针对这种情况，我们可以使用 eslint 插件中的规则

```json
{
  "plugins": ["plugin1"],
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"],
    "plugin1/rule1": "error"
  }
}
```

### 禁用规则

虽然我不推荐禁用 `eslint` 的规则，但是在某些场景下它确实有必要的。关于如何禁用 `eslint` 中的规则，可以查看 [Eslint 文档](https://eslint.org/docs/latest/use/configure/rules#disabling-rules)

简单示例

```js
/* eslint-disable no-alert, no-console */

alert('foo')
console.log('bar')

/* eslint-enable no-alert, no-console */
```

## 配置之插件和解析器

### 插件

`eslint` 支持第三方插件，它们遵循 `eslint` 插件命名规范（以 eslint-plugin-开头）。在插件使用时，我们省略掉 eslint-plugin- 前缀。也可以不省略
示例

```json
{
  "plugins": ["plugin1", "eslint-plugin-plugin2"]
}
```

`eslint` 插件中可以包含自定义规则、配置、环境等
示例

```json
{
  // 插件引入
  "plugins": [
    "jquery", // eslint-plugin-jquery
    "@foo/foo", // @foo/eslint-plugin-foo
    "@bar" // @bar/eslint-plugin
  ],
  // 使用插件中的配置（如 eslint 内置规则的配置对象）
  "extends": ["plugin:@foo/foo/recommended", "plugin:@bar/recommended"],
  // 使用插件中的自定义规则
  "rules": {
    "jquery/a-rule": "error",
    "@foo/foo/some-rule": "error",
    "@bar/another-rule": "error"
  },
  // 使用插件中的环境（插件环境内置的全局变量）
  "env": {
    "jquery/jquery": true,
    "@foo/foo/env-foo": true,
    "@bar/env-bar": true
  }
  // ...
}
```

### 解析器

`eslit` 工作原理：我们知道，eslint 之所以能过对我们的代码进行检查，是因为它将我们的代码解析成了抽象语法（AST），如果不太了解抽象语法树，你可以简单理解成它使用一个 JavaScript 对象来描述我们的代码。然后通过分析抽象语法树，看它是否符合配置的规则。如果不符合再给出相应的提示。而解析器要做的事情就是将代码解析成 AST

默认情况下，`eslint` 使用 [Espree](https://github.com/eslint/espree)为

与 `eslint` 兼容的解析器

- Esprima
- @babel/eslint-parser - 使 Babel 解析器与 ESLint 兼容的的包装器
- @typescript-eslint/parser - 一个将 TypeScript 转换为与 ESTree 兼容的形式的解析器，因此它可以在 ESLint 中使用。

自定义解析器示例

```json
{
  "parser": "esprima",
  "rules": {
    "semi": "error"
  }
}
```

## 配置之忽略文件

`eslint` 在不指定具体检查文件的情况下会对所有的文件进行检查，这种行为是愚蠢的。为了让它看起来不那么愚蠢，`eslint` 给我们提供了 `ignorePatterns` 配置项去配置该忽略那些文件的检查。当然你也可新建一个 `.eslintignore` 文件来告诉 `eslint` 该忽略掉哪些文件的检查，如果你不嫌麻烦的话。

```json
{
  "ignorePatterns": ["temp.js", "**/vendor/*.js"],
  "rules": {
    //...
  }
}
```

如果你想了解更多关于 `eslint` 忽略文件的更多骚操作，你可以阅读它们提供的[Eslint 文档](https://eslint.org/docs/latest/use/configure/ignore)

## 集成（VS Code）

在日常开发中，如果我们每次都需要通过命令行允许 `eslint` 命令来查看我们编写的代码是否符合预期。那将是令人头痛的一件事，为了减少我们访问命令行的次数。我们可以通过给 VS Code 安装一个 `Eslint` 插件来实现实时的 lint 结果反馈。

### 安装

我们只需要在 VS Code 插件市场中安装 `Eslint` 插件，安装完成之后重启一下 Vs code。重启之后你就会发现我们可以实时的观察到 `eslint` 检查之后的结果（`Eslint` 插件默认会读取当前项目中的配置文件完成该项目检查）
