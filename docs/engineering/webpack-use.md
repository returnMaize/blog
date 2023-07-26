## webpack 的作用

**什么是 webpack**

> webpack is a static module bundler for modern JavaScript applications

这里引用官方的原话，webpack 是一款用来打包现代化 JavaScript 的应用程序。webpack 默认情况下只能打包 js 模块，也可以配合 loader 打包其他模块。

**作用**

- 让我们在开发期间支持各种模块化（如 css、js 模块化）
- 在生产环境时完成各种模块化的打包，打包成浏览器能够识别的代码。

## 安装和使用

**安装**

```bash
# webpack-cli 提供运行 webpack 的命令
# webpack 用于打包模块
pnpm i webpack webpack-cli -D
```

**使用**

**新增 src/index.js**

```js
import { message } from './a.js'

console.log('message', message)
```

**新增 src/a.js**

```js
export const message = 'hello webpack'
```

**执行 npx webpack**

```bash
# webpack 默认就能够打包 js 模块的代码
# webpack 打包时默认会以 src/index.js 为打包入口，然后将打包好的 js 代码输出到 dist/man.js 中
npx webpack
```

**webpack 配置文件**

如果想要自定义打包入口和文件输出，可以通过 webpack 配置文件实现打包自定义，webpack 默认会解析项目根目录下的 `webpack.config.js`，然后根据其中的配置信息完成打包工作。

**webpack.config.js**

```js
const path = require('path')

module.exports = {
  // 配置打包入口文件
  entry: './src/custom-entry.js',
  // 配置输出文件名 和 输出目录
  output: {
    filename: 'custom-output.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## loader

webpack 默认只能处理 js 模块代码，我们日开发中不仅仅只有 js 模块代码，还会存在如 css 模块、文件模块等。这时我们就需要通过 loader 去处理这些模块。

### 处理 css

处理 css 模块

**css-loader**

用来提取 css 代码，当 webpack 打包过程中发现 css 文件代码的加载时 `import 'xxx.css'`，webpack 就会使用 css-loader 处理 `xxx.css` 中的代码。

**style-loader**

将 `css-loader` 处理好的 css 代码以 style 标签的形式插入到 head 标签中

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        // 告诉 webpack，当打包过程中遇到 .css 后缀的文件加载时，使用 css-loader 和 style-loader 进行处理
        // use 配置项中的 loader 处理顺序是由后到前
      },
    ],
  },
}
```

参考

- [css-loader](https://www.npmjs.com/package/css-loader)
- [style-loader](https://www.npmjs.com/package/style-loader)

### 处理文件

**file-loader**

拷贝的方式处理文件类型

**url-loader**

将加载的文件转化成 base64 url 的形式（支持配置，根据加载文件大小决定采用拷贝还是使用 base64。但需要注意的是，如果采用这种配置，你需要安装 file-loader，针对超出文件的限制的文件，url-loader 内部会调用 file-loader 完成文件的拷贝操作）

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
}
```

### loader 工作原理

loader 是一个接受加载模块源码的为参数的一个函数。

- 拿到模块源代码
- 处理（这里处理可以是代码的转化，也可以是代码检查，也可以是标签的插入）
- 返回一段可执行的 js 代码

为了方便理解 loader，我们通过简单实现一个 md-loader 来解释它的工作原理。

要求：我们要求 md-loader 能够将加载的 md 文件转化成 html 进行返回

**代码实现**

```js
const marked = require('marked')

module.exports = (source) => {
  const html = marked(source)

  return `export default ${JSON.stringify(html)}`
}
```

这样当我们通过 `import 'xxx.md'` 加载文件时，就可以通过我们的 md-loader 将 xxx.md 中的内容转化成 html 内容了

更多 loader

- [loader list](https://webpack.js.org/loaders/)

## 插件

webpack 打包文件会经过 开始打包 => 打包结束 这个流程，而插件就是要在这个打包生命周期中的某个时间点做某些事。

常见的 plugin

**clean-webpack-plugin**

它会在打包前清除上一次打包输出的目录

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  // ...
  plugins: [new CleanWebpackPlugin()],
}
```

**html-webpack-plugin**

在打包完成后，自动生成 html 并将通过 script 标签引入打包好的 js 文件

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ...
  plugins: [new HtmlWebpackPlugin()],
}
```

### plugins 原理

webpack 从打包开始到打包介绍这一生命周期中给我们提供了很多钩子函数，插件就是通过这些钩子函数在生命周期的不同时机执行一些事情完成一些功能。

**示例**

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin'

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    // hook into the compiler before it begins reading records.
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('The webpack build process is starting!')
    })
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin
```

如果你想了解更多关于 webpack plugins 的内容，可以阅读 [webpack docs](https://webpack.js.org/concepts/plugins/)

更多插件

- [plugin list](https://webpack.js.org/plugins/)

## 构建开发环境-服务器

上面我们了解了 webpack 是如何通过 loader 打包不同模块和插件的使用，但这些内容都是应用于打包上线时。对于开发过程中，我们肯定不希望每次查看效果都需要将源代码打包好再放到服务器上，这样太低效了。下面我们就开始探索如果通过 webpack 构建出我们理想的开发环境。

**webpack-dev-server**

`webpack-dev-server` 能够根据 webpack 中的配置文件使用 webpack 将我们的项目进行打包，并且将打包好的内容放到内存中去，然后在以打包好的目录为根目录启动一个开发服务器。

**安装使用**

```bash
# 安装
pnpm i webpack-dev-server -D
# 使用
npx webpack serve
# 结果
hjx@huangjunxian blog-webpack % npx webpack serve
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8081/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.10.101:8081/
```

**配置开发服务器**

我们可以通过 webpackConfig.devServer 配置项来配置我们的开发服务器

常用配置

```js
module.exports = {
  devServer: {
    // 当我们请求地址中存在 /api 时，我们本地服务器就会对这个请求进行拦截
    // 然后服务器去请求 target 域名下服务器的资源，然后将资源进行返回
    // 我们通常使用 proxy 配置解决跨域问题
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        // 实际请求的地址中的 api 替换成空
        pathRewrite: { '^/api': '' },
        // 改变请求的主机名
        changeOrigin: true,
      },
    },
  },
}
```

如果你还想了解其他关于 devServer 配置，可以阅读 [webpack docs](https://webpack.js.org/configuration/dev-server/)

## 构建开发环境-sourceMap

前面我们了解到了 webpack-dev-server 能够将我们代码打包到内存中并启动一个服务器供我们实时观察到应用结果。但是这样预览方式也存在一些问题。试想一下，如果我们代码中存在一些错误，而由于浏览器浏览的是我们打包好的代码，这些错误的位置肯定和源代码的位置是不同的，这时我们就很难定位到这个问题是由那一行代码导致的。

对于这个问题，我们就可以使用 webpack 中的 sourceMap，它维护着打包后的代码和源代码之间的映射关系。通过它我们就可以很好的定位到错误代码的具体位置了。

**配置 source-map**

```js
module.exports = {
  // ...
  // devtool 的值就是用来指定源码映射的方式
  devtool: 'eval-cheap-module-source-map',
}
```

源码映射的方式存在很多种，映射关系越具体，打包速度就越慢，映射关系越模糊，打包速度就越快。

**开发环境推荐**

`eval-cheap-module-source-map`，它能够定位到错误在源代码的具体那一行。

推荐原因：它在二次构建中拥有较快的速度，并且提供的代码映射也足够开发者定位到错误。

**生成环境推荐**

`none`，不存在源码映射。

推荐原因：生成环境的源码映射会泄漏源代码。如果对自己的代码不自信，实在想用，推荐使用 `nosources-source-map`，它能够定位到错误代码位置且不会暴露源代码。

## 构建开发环境-HMR

`webpack-dev-server` 在开发过程中会监听源代码，一旦源代码进行修改，它就会重新进行打包并刷新浏览器。这样的体验是很好的，但还没到达极致。因为页面的刷新会导致页面中状态的丢失，想象一下，如果我们想要在开发中调试编辑器中的内容样式，刷新页面会使得每次样式代码的变化都导致编辑器中的内容被清空，这种情况下体验极其不友好。HMR 就能解决这个问题，它的全称为 Hot Module Replacement（热替换，也叫热更新），它能在不刷新页面的情况下完成更新。

**配置 HMR**

样式文件的 HMR 在 style-loader 中就已经进行了处理，如果你使用了 css-loader，那么样式的热替换开箱即用

对于 js 模块的 HRM，你可以阅读 webpack 官方文档 [webpack docs](https://webpack.js.org/guides/hot-module-replacement)。

对于日常使用框架来开发项目，这些框架大多都内置 HMR 的代码，开箱即用。

对于 HMR 的代码，在生产环境下没有开启 HMR 的情况下，这些代码都不会被打包到线上。

## 多环境配置文件

在企业项目开发中，我们通常会将不同环境的配置放到不同的文件中去，方便后期的维护。

**webpack.common.js**

```js
module.exports = {
  // ...
}
```

**webpack.dev.js**

```js
// webpack-merge 用来合并配置
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = merge(commonConfig, {
  mode: 'development',
  // ...
})
```

**webpack.prod.js**

```js
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = merge(commonConfig, {
  mode: 'production',
  // ...
})
```
