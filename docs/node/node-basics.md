## 介绍

**什么是 Node**

Node 是一个 JavaScript 运行平台，在 node 出现之前 js 只能运行在浏览器环境中，node 出现之后使得我们可以在服务端运行 JavaScript。

**特点**

单线程 + 异步非阻塞 IO

**优点**

处理 IO 密集型高并发请求

**缺点**

对于一些 cpu 密集性的请求不太友好，容易阻塞主线程。

**扩展**

想要了解更多关于 node，查看 [node docs](https://nodejs.dev/en/learn/)

## 全局对象和全局变量

**全局对象**

和浏览器环境一样，node 也提供了全局对象，也可以称做宿主对象。node 中的全局对象是 global（浏览器是 window）

```js
console.log(global)
```

输出结果

```bash
Object [global] {
  ...
}
```

**全局变量**

全局对象上会存在许多属性，而这些属性又被称为全局变量

常见的全局变量

- `__filename` 当前脚本文件的绝对路径

```js
console.log(__filename)
/*
输出：/Users/hjx/Desktop/node-test/src/index.js
*/
```

- `__dirname` 当前脚本目录的绝对路径

```js
console.log(__dirname)
/*
输出：/Users/hjx/Desktop/node-test/src
*/
```

- process 当前进程相关接口
- require 导入模块的方法
- module、exports 导出模块的方法

## 全局变量 process

**常见 process API**

- process.memoryUsage() 插件进程中内存使用情况

```js
console.log(process.memoryUsage())
/*
{ rss: 21987328,
  heapTotal: 9682944,
  heapUsed: 4195240,
  external: 8279 }
*/
```

- process.cpuUsage() 插件进程中 cpu 使用情况

```js
console.log(process.cpuUsage())
/*
{ user: 68175, system: 18918 }
*/
```

- process.cwd() node 运行目录的绝对路径（注意：不是脚本目录）

```bash
node src/index.js
```

```js
// 脚本文件目录 /Users/hjx/Desktop/node-test/src
console.log(process.cwd())
// 输出： /Users/hjx/Desktop/node-test
```

- process.version 当前 node 版本
- process.arch 操作系统位数（64 ｜ 32）
- process.env 环境
- process.platform 操作系统平台
- process.argv 启动 node 是的参数

```bash
node src/index.js --config webpack.config.js
```

```js
console.log(process.argv)
/*
[ '/Users/hjx/.nvm/versions/node/v10.24.1/bin/node',
  '/Users/hjx/Desktop/node-test/src/index.js',
  '--config',
  'webpack.config.js' ]
*/
```

- process.uptime() 运行脚本的时间

```js
for (let i = 0; i < 100; i++) {}

console.log(process.uptime())
// 输出 0.072
```

- process.exit() 退出进程
