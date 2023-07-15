## 介绍

`eslint` 是用来对我们代码规范进行检查，而 `prettier` 是用来给我们的代码进行格式化。所以我们可以将二者配合起来，就可以实现 `eslint` 代码检查、`prettier` 代码格式化。但这期间会有一个问题，我们知道 `eslint` 中的规则分为 `Possible Problems`、`Suggestions`、`Layout & Formatting` 这几类，其中 `Layout & Formatting` 这一块很容易会与 `prettier` 格式化规范发生冲突。`prettier` 是自以为是的。为此，`prettier` 官方提供了 `eslint-config-prettier` 配置，它会将 `eslint` 中与 `prettier` 中冲突的规则给禁用掉。这样我们便可以同时使用 `eslint` 的代码检查和 `prettier` 的格式化 🎉。

## 安装及配置

#### 安装

```bash
npm install --save-dev eslint-config-prettier
```

#### 配置

.eslintrc.json

```js
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}
```

:::tip
eslint 加载扩展的规则时，如果发生冲突，后面的规则会覆盖掉前面的规则。所以 `prettier` 扩展配置必须放到所有扩展配置的最后面。
:::
