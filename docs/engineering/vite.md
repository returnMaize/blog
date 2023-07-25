## Vite vs Webpack

**webpack 开发环境下工作原理**

webpack 会通过打包入口文件找到项目中所有依赖，通过这些依赖构建出依赖图谱，然后根据依赖图谱进行代码的转化打包，将打包好的代码放到目标文件夹中，并且以该目录为服务器根路径启动一个本地服务。

**vite 开发环境下工作原理**

直接以项目根目录为服务器根目录启动本地服务，当我们通过页面的方式请求文件时，vite 会对请求文件进行处理，将处理好的文件返回给浏览器。

- 第三方模块文件，通过 esbuild 预构建完成打包，并将该请求通过响应头设置为强缓存
- 单文件 vue，通过 `@vue/complier-sfc` 将单文件 vue 转化成 js 对象返回，并将 `template` 编译成 `render` 函数

**相较 webpack 的优点**

- 第三方模块使用 esbuild 预构建，并在请求第三方模块时采用强缓存。使得第三方模块只需要打包一次，且请求一次。

## 初始化 vite 项目

在搭建间，了解 `create-vite` 和 `vite` 的区别

**create-vite**

提供交互式的服务，快速初始化项目。

**vite**

用来启动开发服务器和打包项目，它是一个现代化的前端构建工具

```bash
pnpm create vite
```

上述命令就是使用 `create-vite` 初始化项目，我们可以通过它快速初始化一个 vite + vue3 的项目

```bash
✔ Project name: … vite-vue3-project
✔ Select a framework: › Vue
✔ Select a variant: › TypeScript

Scaffolding project in /Users/hjx/Desktop/vite-vue3-project...

Done. Now run:

  cd vite-vue3-project
  pnpm install
  pnpm run dev
```

## vite 配置文件

在使用 vite 启动本地服务和打包时，vite 会自动解析 `vite-config.[js|ts]` 配置文件，并根据配置文件中的配置进行打包构建。

通常在企业级项目中，我们通常存在多个环境，不同的环境需要不同的配置，这时就需要多个配置文件用来区分不同环境。这时我们可以通过 `defineConfig` 中的 `mode` 参数实现此功能。

**vite.config.ts**

```ts
import baseConfig from './vite.base.config'
import devConfig from './vite.dev.config'
import prodConfig from './vite.prod.config'

const envResolver = {
  serve: Object.assign({}, baseConfig, devConfig),
  build: Object.assign({}, baseConfig, prodConfig),
}

export default defineConfig(({ mode }) => {
  // mode = serve | build
  envResolver[mode]
})
```

## vite 配置之环境变量

**内置环境变量**

- `import.meta.env.MODE` 项目运行环境 development ｜ production
- `import.meta.env.BASE_URL` 配置项 base 决定
- `import.meta.env.PROD` 运行环境是否是 production
- `import.meta.env.DEV` 运行环境是否是 development
- `import.meta.env.SSR` 运行环境是否运行在服务端

**环境变量文件的加载**

`vite` 会通过 `dotenv` 这个工具包加载项目根目录中的 .env 开头的文件中的变量（当然你也可以通过 `envDir` 配置项指定环境变量目录）

不同环境下加载的环境变量文件（当然你也可以通过命令行 --mode 新增其他模式）

```
.env          # 两种模式下都会加载
.env.[mode]   # 指定模式下加载 mode = production | development
```

加载的环境变量会挂载到 `import.meta.env` 上，你可以在客户端的源码中通过它访问你定义的环境变量，当然为了防止将一些隐私性的变量暴露给客户端，vite 只会将以 VITE 开头的环境变量挂载到 `import.meta.env` 上（你也可以通过 envPrefix 自定义前缀）。

**.env**

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

**main.ts**

```ts
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

## vite 配置之 css

vite 天生支持 css，当 vite 遇到文件中 css 请求时，会通过 node 中的 fs 读取该 css 的代码，并生成将该 css 插入到 body 中的 js 代码进行返回，并将 content-type 设置为 application/javascript；

### css.modules

css.modules.localsConvention 配置 css 导出类名命名规则 camelCase ｜ dashes

css.modules.scopeBehaviour 配置 css 作用域行为 global | local

css.modules.generateScopedName 配置 css 生成的类名规则

css.modules.hashPrefix 配置生成的 hash 的前缀

css.modules.globalModulePaths 不需要模块化的 css 文件路径

### css.preprocessorOptions

css.preprocessorOptions.scss 配置 sass 解析规则（参考 [scss docs](https://sass-lang.com/documentation/js-api/interfaces/legacystringoptions/)）

css.preprocessorOptions.less 配置 less 解析规则（参考 [less docs](https://lesscss.org/usage/#less-options)）

### css.postcss

vite 内置 postcss，你可以通过 `css.postcss` 直接配置 postcss，你也可以通过 `postcss.config.js` 进行配置。

如果你还不知道什么是 `postcss`，你可以把它当作一个 css 语法转化器，类似于 babel。

**postcss 工作原理**

postcss 处理 css 时首先会将 css 转化成抽象语法树 AST，再通过 postcss 插件完成 AST 的转化操作（比如语法降级、sass 转换等），然后将转化好的 AST 转化成浏览器能够识别的 css。

:::tip
postcss 不同于其他预处理器（如 sass、less），它凌驾于它们之上。

预处理器用来将如 sass、less 语法转化成 css，而 postcss 是构建一个 css 转化工作流，这条工作流中可以包含 sass、less 的处理（通过 postcss 相关插件）。

由于 postcss 停止了对 sass、less 转化插件的维护，现在我们通常会在 sass、less 等预处理器将代码转化成 css 之后再通过 postcss 对 css 进行降级、代码补全等 css 处理。所以 postcss 又被称为后处理器。
:::

有关 `postcss` 的相关配置，你可以参考 [postcss docs](https://postcss.org/)

### css.devSourcemap

开启 css 源码映射，方便定位 css 代码错误位置

## vite 配置之 alias

`resolve.alias` 用来配置文件系统别名，这对于开发中导入一些层级相差很远的文件时非常有用。

**vite.config.ts**

```ts
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
```

**src/a/b/c.ts**

```ts
import AComponent from '@components/A.vue'
```

## vite 插件

vite 中的插件就是在 vite 不同生命周期钩子时做一些事情。你可以通过阅读 [vite docs](https://cn.vitejs.dev/guide/api-plugin.html#vite-specific-hooks) 了解关于 vite 生命周期钩子的内容

常用插件

- vite-aliases

原理：在 vite 中的 config 钩子执行时将配置文件中的 resolve.alias 进行修改（config 钩子会在 vite 解析配置文件前执行）

- vite-plugin-html

原理：使用 transformIndexHtml 钩子将转化好的 html 替换掉原来的 html，但需要使用 enforce 配置项将钩子执行时机提前

- vite-plugin-mock （mockjs）

原理：使用 configureServer 钩子给 vite 服务器增加中间件，劫持掉请求返回 mock 数据。

**扩展**

- [vite plugin API](https://cn.vitejs.dev/guide/api-plugin.html#vite-specific-hooks)
- [vite 官方插件](https://cn.vitejs.dev/plugins/)
- [vite 社区插件](https://github.com/vitejs/awesome-vite#plugins)

## vite 性能优化

- 将 `node_modules` 下的包单独打包成一个 chunk，这样有利于浏览器的缓存。

**vite.config.ts**

```ts
export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
```

- 对于一些路由使用到的组件，使用动态引入 `import` 配合 rollup 实现代码分割，完成按需加载，提高首屏加载速度。

```ts
const routes = [
  {
    path: 'xxx',
    name: 'xxx',
    meta: {
      title: 'xxx',
    },
    component: () => import('@/views/xxx/xxx/xxx/index.vue'),
  },
]
```

- 对于非常大的文件可以采用 gzip 压缩，小文件不要使用（浏览器解压也需要时间，小文件会适得其反）

使用插件 `vite-plugin-compression`

- 对于第三方包使用 cdn 加速

使用插件 `vite-plugin-cdn-import`

原理：在 transformIndexHtml 动态拥有 cdn 地址的 script 标签

## 结尾

本章只列出了 vite 一些常用配置，如果你想了解更多关于 vite 的内容，可以阅读 [vite docs](https://cn.vitejs.dev/)
