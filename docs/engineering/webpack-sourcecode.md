## webpack 工作原理流程

- 初始化流程

  - 配置合并
  - 初始化 Compiler 编译器，并为赋予文件读写能力（node 中 fs 模块）
  - 内置插件和 plugins 配置项中插件的安装

- 编译流程

  - compile 执行
  - 创建 compilation 对象，触发 make 钩子
  - addEntry 根据入口开始编译
  - 读取入口 module 内容，如果不是 js 模块加载对应 loader 转化成 js
  - 将 js 转化成抽象语法树，完成语义转化，并替换文件导入为 `__webpack_require__`
  - 递归 module 处理逻辑

- 输出流程

  - 使用 seal 生成 chunk（根据 module 中的名称）
  - emit 将 chunk 输出到目标位置

## 初始化流程源码

:::tip
为了避免源码带来的心智负担，以下都会使用伪代码的形式，会移除很多不必要的源代码。
:::

我们使用 `npx webpack` 对项目进行打包是，`webpack-cli` 内部最终会调用 `webpack` 方法对我们项目进行打包

```js
// 伪代码
const wepback = reuiqre('webpack')
const config = require('./webpack.config.js')

// 初始化 compiler
const compiler = webpack(config)

// 通过 compiler 完成打包，compiler 会贯穿整个打包流程
compiler.run(callback)
```

compiler 初始化流程

```js
const webpack = (options, callback) => {
  let compiler
  // 实例化 Compiler
  compiler = new Compiler(options.context)

  // 赋予 compiler 操作文件的能力（node 中的 fs 模块封装）
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler)

  // 配置文件中插件的启用（给 compiler 挂载 hook）
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else if (plugin) {
        plugin.apply(compiler)
      }
    }
  }

  // webpack 内置插件的启用（给 compiler 挂载 hook）
  compiler.options = new WebpackOptionsApply().process(options, compiler)

  return compiler
}
```

以上就是调用 `webpack(config)` 做的事情，它也是 `webpack` 初始化流程做的事情，现在我们在重点关注一下 compiler，因为它将贯穿我们打包流程

```js
class Compiler {
  constructor(context, options = /** @type {WebpackOptions} */ ({})) {
    /**
     * 可以看到 compiler 中存在许许多多不同类型的钩子，它将贯穿整个打包流程。
     * 这些钩子会被挂载到打包开始至结束这段生命周期中的任意时刻。
     * webpack 在到达这些时刻时会通过广播的方式通知这些钩子应该完成哪些事情
     * 而初始化 compiler 过程中，会通过插件将各种钩子都挂载到 compiler 上
     * 然后在 compiler.run() 打包时在特定时机执行
     */
    this.hooks = Object.freeze({
      // ... hook
      beforeRun: new AsyncSeriesHook(['compiler']),
      /** @type {AsyncSeriesHook<[Compiler]>} */
      run: new AsyncSeriesHook(['compiler']),
      /** @type {AsyncSeriesHook<[Compilation]>} */
      emit: new AsyncSeriesHook(['compilation']),
      /** @type {AsyncSeriesHook<[string, AssetEmittedInfo]>} */
      assetEmitted: new AsyncSeriesHook(['file', 'info']),
      /** @type {AsyncSeriesHook<[Compilation]>} */
      afterEmit: new AsyncSeriesHook(['compilation']),

      /** @type {SyncHook<[Compilation, CompilationParams]>} */
      thisCompilation: new SyncHook(['compilation', 'params']),
      /** @type {SyncHook<[Compilation, CompilationParams]>} */
      compilation: new SyncHook(['compilation', 'params']),

      /** @type {SyncHook<[CompilationParams]>} */
      compile: new SyncHook(['params']),
      /** @type {AsyncParallelHook<[Compilation]>} */
      make: new AsyncParallelHook(['compilation']),

      /** @type {SyncHook<[Compiler]>} */
      afterResolvers: new SyncHook(['compiler']),
      /** @type {SyncBailHook<[string, Entry], boolean>} */
      entryOption: new SyncBailHook(['context', 'entry']),
      // ...
    })
  }
}
```

扩展：webpack 内部钩子都是通过第三方包 `tapable` 实现的，你可以通过阅读 [tapable docs](https://www.npmjs.com/package/tapable) 进行了解。

**初始化流程总结**

- 创建 compiler
- 通过 NodeEnvironmentPlugin 赋予 compiler 操作文件能力
- 安装自定义 plugin 和内置 plugin 为 compiler 挂载钩子（将在打包的各个时机执行这些钩子）

## 编译流程

**compiler.run**

```js
class Compiler {
  run() {
    // ...
    // 通知 beforeRun 钩子
    this.hooks.beforeRun.callAsync(this, (err) => {
      // 通知 run 钩子执行
      this.hooks.run.callAsync(this, (err) => {
        // 执行 compile
        this.compile(onCompiled)
      })
    })
  }

  compile(callback) {
    // 通知 beforeCompile 钩子执行
    this.hooks.beforeCompile.callAsync(params, (err) => {
      // compile 钩子执行
      this.hooks.compile.call(params)

      // 内部 compilation 钩子执行，创建出 compilation
      const compilation = this.newCompilation(params)

      // 通知 make 异步钩子执行（这里 make 钩子在安装内部插件时挂载到 compiler 上）
      this.hooks.make.callAsync(compilation, (err) => {
        compilation.finish((err) => {
          // make 使用来编译模块的，编译完成之后会调用 seal 将模块封装成 chunk
          compilation.seal((err) => {
            // ...
          })
        })
      })
    })
  }
}
```

compiler.run => compiler.compile => 生成 compilation => 通知 make 钩子
下面我们来看 make 钩子（它在安装 webpack 内置插件时被挂载到 compiler 上）

```js
compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
  const { entry, name, context } = this

  const dep = SingleEntryPlugin.createDependency(entry, name)
  compilation.addEntry(context, dep, name, callback)
})
```

make 钩子 => compilation.addEntry

**compilation.addEntry**

```js
class Compilation {
  addEntry(context, entry, optionsOrName, callback) {
    // ...
  }
}
```
