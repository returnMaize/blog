## 自定义规则

eslint 默认给我们提供了了许多内置规则，我们可以通过这些规则来约束和规范化我们的代码。但是 eslint 并不能了解到不同公司的业务开发，对于这些个性化的规范，我们也应该通过 eslint 来进行检查，毕竟在协同开发中口头约束的规范是愚蠢的。

### 需求

在小程序开发中会要求接口请求的协议必须为 `https`，这是我们可以编写一个 eslint 自定义规则用来校验 url 是否是 `https`，如果不是抛出一个 `eslint` 提示。并且提供一件修复功能，将所有的 `http` 转化成 `https`

### 编写规则

eslint 中的自定义个规则是一个 commonjs 导出的对象

**新建 rules/only-https.js 文件**

```js
module.exports = {
  // meta 表示规则的描述（元数据）
  meta: {
    /**
     * type 表示规则的类型（"problem", "suggestion", or "layout"）
     * problem 表示问题级别的规则（如果编写的代码不符合规则，可能会导致程序出问题）
     * suggestion 推荐规则（你可以遵守，也可以不遵守）
     * layout 风格类的规则（不会影响到代码，例如代码间的空格啥的）
     */
    type: 'problem',
    docs: {
      // 规则介绍
      description: 'url协议必须使用https',
    },
    // 开启修复规则功能（不符合规则可以一键修复）
    fixable: 'code',
  },

  /**
   * create 返回一个对象
   * 对象中包含着各种选择器方法
   * 这些方法会在 eslint 遍历 AST 节点过程中调用
   * AST（抽象语法树） 本质就是由一个个的语法节点组成，而这些选择器对应的就是这些节点
   * eslint 访问到这些节点时就会调用对应的选择器方法
   */
  create(context) {
    return {
      // 字面量选择器，遇到字面量时调用
      Literal: function handleRequires(node) {
        if (
          node.value &&
          typeof node.value === 'string' &&
          node.value.startsWith('http:')
        ) {
          // 报告代码中的问题
          context.report({
            // 告诉 eslint 那个节点存在问题
            node,
            // 错误提示
            message: 'Recommended "{{url}}" switch to HTTPS',
            // 数据，可以在 message 使用
            data: {
              url: node.value,
            },
            // 修复方法，会在调用 eslint . --fix 时调用
            fix(fixer) {
              return fixer.replaceText(
                node,
                `'${node.value.replace('http:', 'https:')}'`
              )
            },
          })
        }
      },
    }
  },
}
```

## 自定义插件

在 eslint 中插件是一个比规则更宽泛的概念，它可以包含规则、配置、解析器等。

**新建 plugins/custom.js 文件**

```js
const onlyHttps = require('../rules/only-https.js')

module.exports = { rules: { 'only-https': onlyHttps } }
```

## 测试自定义规则

### RuleTester 测试

编写好了我们自己的插件和规则后，我们需要先对规则进行测试，没有问题后便可以发布到远程仓库供其他人使用了。

**新建 test/only-https.js 文件**

```js
const { RuleTester } = require('eslint')
const onlyHttps = require('../rules/only-https.js')

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015 },
})

ruleTester.run(
  'only-https', // rule name
  onlyHttps, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: `const url = 'https://hjx.com'`,
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: `const url = 'http://hjx.com'`,
        output: `const url = 'http://hjx.com'`,
        errors: 1,
      },
    ],
  }
)

console.log('All tests passed!')
```

除了使用 `eslint` 中的 API 测试规则外，我们还可以通过使用来测试我们编写的规则是否有用。

### 测试代码测试

**新建 eslint.config.js 文件**

```js
const customPlugin = require('./plugins/custom.js')

/**@type {import('eslint').ESLint.ConfigData} */
module.exports = {
  plugins: { custom: customPlugin },

  rules: {
    'custom/only-https': 'error',
  },
}
```

**新建 index.js 文件（测试代码）**

```js
const url = 'http://hjx.com'

console.log('url', url)
```

**运行 eslint**

```bash
npx eslint ./index.js

/Users/hjx/Desktop/eslint-plugin-test/index.js
  1:13  error  Recommended "http://hjx.com" switch to HTTPS  custom/only-https

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

**使用 fix 快速修复**

```bash
npx eslint ./index.js --fix
```

**完结！🎉🎉🎉，如果想要了解更多关于自定义规则的内容，可以阅读 [eslint docs](https://eslint.org/docs/latest/extend/custom-rule-tutorial)。**
