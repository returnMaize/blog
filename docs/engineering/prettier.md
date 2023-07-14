## 介绍

prettier 是一款自以为是的代码格式化程序。

以上是来自 `prettier` 官方给出的定义，之所以说它是自以为是的格式化。是因为它几乎完全按照自己的定制的规则去进行代码的格式化。如果你想按照自己的意愿去格式化，对不起，`prettier` 可能不太适合你（大笑）。

优点：

- 开箱即用，使用简单，几乎不需要任何配置
- 统一了前端格式化
- 开发者无需再关心如何格式化自己的代码（就像乔布斯每天穿同样的衣服一样，面对每天数百个决定，不应该把时间花在怎么穿会让我更好看这件事上）

## 安装使用

#### 安装

```bash
npm install --save-dev --save-exact prettier
```

如果你细心观察你会发现，这里我们使用的是 `--save-exact`。如果你不太了解它的含义，可以通过查阅 [npm Docs](https://docs.npmjs.com/cli/v6/commands/npm-install)进行了解。为了你的阅读体验，这里你只需要知道如果加上它，你安装的 `prettier` 将会是一个固定版本。

之所以要这么做，我想你应该也猜到了。正如我们前面所说的那样，`prettier` 是个自以为是的格式化程序。我们的代码如何格式化几乎都是它自己说了算。我想谁都不会想因为 `prettier` 的版本变化而影响到自己代码的格式化方式。

#### 使用

格式化目标文件

```bash
npx prettier <filepath> --write
```

格式化所有文件

```bash
npx prettier . --write
```

检查出没有被 `prettier` 格式化的文件

```bash
npx prettier . --check
```

## 配置

#### 配置文件格式

虽然 `prettier` 的配置文件支持多种不同格式，但是这里我推荐使用 `.prettierrc.js`。作为一个前端开发人员，js 对我们有着先天的亲和感。除此之外它配合 `/** @type {import("prettier").Options} */` 和 vs code 能够得到一个很好的语法提示。如果你执意想使用其他格式的配置文件，那你可以自行阅读 [prettier docs](https://prettier.io/docs/en/configuration.html) 了解更多格式以及它们加载的优先级。

`.prettierrc.js` 示例

```js
/** @type {import("prettier").Options} */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
}

module.exports = config
```

`prettier` 在格式化代码过程中会根据我们定义的配置文件中的规则去格式化我们的代码，如果没有配置文件便会通过默认的规则进行格式化。虽然前面有说过 `prettier` 是自以为是的，但是它还是给我们暴露了一些配置使得我们能够实现一些个性化需求。

#### 配置项

常见的配置项：

- printWidth 代码的最大宽度（默认 80）
- tabWidth 缩紧，一个 tab 的宽度（默认 2）
- semi 末尾分号（默认为 true）
- singleQuote 字符使用单引号（默认是 false）
- ...

如果你想了解跟多配置项，可以查阅 [prettier docs](https://prettier.io/docs/en/options.html#file-path)

#### 忽略文件

我们日常开发中不可能将所有的代码都进行格式化，那将是相当愚蠢的。`prettier` 当然也想到了这点，你可以通过新增一个 `.prettierignore` 文件来告诉 `prettier` 忽略那些文件。在默认情况下，`prettier` 会忽略一下目录中的文件。

```
**/.git
**/.svn
**/.hg
**/node_modules
```

除此之外，你也可以通过代码注释的方式对局部代码进行格式化的忽略。

```js
// prettier-ignore
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)
```

如果你还想了解更多关于局部忽略的方式，可以阅读 [prettier docs](https://prettier.io/docs/en/ignore.html)

## 集成（Vs Code）

虽然 `prettier` 给我们提供了命令行工具，让我们能够通过命令的方式对我们的代码进行格式化。但对于开发来说这也是相当鸡肋的。想象一下，如果我们每次写完代码都需要进入命令行中输入命令才能完成代码的格式化，这是一件多么令人悲痛的事情。如果能够在保存的时候就自动执行 `prettier` 进行代码的格式化，那是不是令人兴奋。

#### 安装 vs code 插件（prettier）

我们可以在 vs code 插件商店中找到 `prettier` 插件进行安装，安装完成之后重启一下 vs code。然后将 vs code 的默认格式化工具改为 `prettier`，并且在保存时自动进行格式化。这样在每次保存时 vs code 插件 `prettier` 就会对我们的代码进行格式化。

插件 `prettier` 运行原理：

首先它内置了一套自己的 `prettier` 格式化规则，并且也对应一个自己的版本。如果我们的项目中不存在 `prettier`
的包，并且也存在 `.prettierrc.js` 配置文件。那么它将以最新的 `prettier` 和内置的配置进行代码格式化。如果你仅仅是为了实验一下 `prettier` 功能，你可以这样做。但如果你的项目是协同开发，推荐在项目本地安装固定版本的 `prettier` 和增加对应的配置文件。这样插件在运行时就会按照你项目中的 `prettier`版本及配置进行代码的格式化。
