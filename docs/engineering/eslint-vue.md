## 介绍

与检查 ts 代码一样，`eslint` 默认情况下也无法检查 `.vue` 中的代码。这时我们就需要使用官方提供的 `eslint-plugin-vue` 插件和 `vue-eslint-parser` 解析器。

## 安装

:::tip
eslint-plugin-vue 要求你的

- node 版本 v14.17.x, v16.x 或者更高
- eslint v6.2.0 或则更高
  :::

```bash
npm install --save-dev eslint eslint-plugin-vue vue-eslint-parser
```

## 使用

#### 配置

.eslintrc.js

```js
module.exports = {
  // 使用 eslint-plugin-vue 插件中的 vue3-recommend 规范
  extends: ['plugin:vue/vue3-recommended'],
  // 使用 vue-eslint-parser 解析 .vue 语法
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['vue'],
}
```

如果你想了解更多关于 `eslint-plugin-vue` 中存在的规范（如 vue2），可以查看 [eslint-plugin-vue docs](https://eslint.vuejs.org/user-guide/)。

#### 使用其他解析器

```js
{
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": {
             // Script parser for `<script>`
            "js": "espree",

             // Script parser for `<script lang="ts">`
            "ts": "@typescript-eslint/parser",

             // Script parser for vue directives (e.g. `v-if=` or `:attribute=`)
             // and vue interpolations (e.g. `{{variable}}`).
             // If not specified, the parser determined by `<script lang ="...">` is used.
            "<template>": "espree",
        }
    }
}
```

如果你还想了解更多关于 `vue-eslint-parser` 中 `parserOptions` 选项，可以参考 [vue-eslint-parser README](https://github.com/vuejs/vue-eslint-parser#readme)
