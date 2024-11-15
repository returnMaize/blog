import { defineConfig4CustomTheme, UserPlugins } from 'vuepress/config'

export default defineConfig4CustomTheme({
  locales: {
    '/': {
      lang: 'zh-CN',
      title: `hx's blog`,
      description: `hx's blog`,
    },
  },
  base: '/blog/',
  themeConfig: {
    name: [{ text: '首页', link: '/index.md' }],

    sidebar: [
      {
        title: '基础篇',
        children: [
          {
            title: '浅谈函数式编程',
            path: '/basics/functional-program.md',
          },
          {
            title: '作用域、闭包、this',
            path: '/basics/scope.md',
          },
          {
            title: '事件循环',
            path: '/basics/event-loop.md',
          },
          {
            title: 'TypeScript',
            path: '/basics/typescript.md',
          },
          {
            title: '深入理解 JS 中的对象',
            path: '/basics/deeply-understand-the-obj.md',
          },
          {
            title: '字符发展史',
            path: '/basics/char-history.md',
          },
          {
            title: '垃圾回收机制',
            path: '/basics/gc.md',
          },
          // {
          //   title: '异步编程之 Promise 原理',
          //   path: '/basics/promise.md',
          // },
        ],
      },
      {
        title: '红宝书（第四版）',
        children: [
          {
            title: '第一章：什么是 JavaScript',
            path: '/RedTreasureBook/Chapter1.md',
          }
        ],
      },

      {
        title: 'Vue原理篇',
        children: [
          {
            title: '从模版到视图原理（2.x）',
            path: '/vue/template-to-dom-2.x.md',
          },
          {
            title: '组件原理（2.x）',
            path: '/vue/component-2.x.md',
          },
          {
            title: '响应式原理之组件更新（2.x）',
            path: '/vue/reactive-component-update.md',
          },
          {
            title: '组件更新之diff算法（2.x）',
            path: '/vue/reactive-diff.md',
          },
          {
            title: '响应式原理之计算属性（2.x）',
            path: '/vue/reactive-computed.md',
          },
          {
            title: '响应式原理之watch（2.x）',
            path: '/vue/reactive-watch.md',
          },
          {
            title: '事件原理（2.x）',
            path: '/vue/event-2.x.md',
          },
          {
            title: '路由原理',
            path: '/vue/vue-router.md',
          },
          {
            title: '3.x vs 2.x',
            path: '/vue/2.x-to-3.x-optimize.md',
          },
          {
            title: '组件渲染原理（3.x）',
            path: '/vue/template-to-dom-3.x.md',
          },
          {
            title: '响应式原理之组件更新（3.x）',
            path: '/vue/reactive-component-update-3.x.md',
          },
          {
            title: '响应式 API ref 和 toRefs（3.x）',
            path: '/vue/reactive-api.md',
          },
          {
            title: '响应式原理之计算属性（3.x）',
            path: '/vue/reactive-computed-3.x.md',
          },
          {
            title: '组件更新之diff算法（3.x）',
            path: '/vue/component-update-diff-3.x.md',
          },
        ],
      },

      {
        title: '工程化篇',
        children: [
          {
            title: 'eslint',
            children: [
              { title: 'eslint基础知识', path: '/engineering/eslint.md' },
              { title: 'eslint + ts', path: '/engineering/eslint-ts.md' },
              { title: 'eslint + vue', path: '/engineering/eslint-vue.md' },
              {
                title: 'eslint + prettier',
                path: '/engineering/eslint-prettier.md',
              },
              {
                title: 'eslint自定义插件',
                path: '/engineering/eslint-custom-plugin.md',
              },
            ],
          },

          {
            title: 'prettier',
            path: '/engineering/prettier.md',
          },

          {
            title: 'commitlint',
            path: '/engineering/commitlint.md',
          },

          {
            title: '编码规范工程化',
            path: '/engineering/code-standard.md',
          },

          {
            title: 'vite',
            path: '/engineering/vite.md',
          },

          {
            title: 'webpack',
            children: [
              { title: 'webpack 使用篇', path: '/engineering/webpack-use.md' },
              {
                title: 'webpack 原理篇',
                path: '/engineering/webpack-sourcecode.md',
              },
            ],
          },
        ],
      },

      {
        title: '性能优化篇',
        children: [
          { title: '性能指标', path: '/perf/performance-index.md' },
          {
            title: '性能优化-页面生命周期',
            path: '/perf/page-lifecycle.md',
          },
        ],
      },

      {
        title: 'Node',
        children: [{ title: 'node 基础', path: '/node/node-basics.md' }],
      },

      {
        title: '算法',
        children: [
          { title: '包含 min 函数的栈', path: '/algorithm/stack.md' },
          { title: '每日温度', path: '/algorithm/daily-temperature.md' },
        ],
      },

      {
        title: 'go',
        children: [
          { title: '基础', path: '/go-study/basic-syntax/1.基础.md' },
          { title: '变量', path: '/go-study/basic-syntax/2.变量.md' },
          { title: '基础类型', path: '/go-study/basic-syntax/3.基础类型.md' },
          { title: '指针-类型转换', path: '/go-study/basic-syntax/4.指针-类型转换.md' },
          { title: '复杂数据类型', path: '/go-study/basic-syntax/5.复杂数据类型.md' },
          { title: '语句', path: '/go-study/basic-syntax/6.语句.md' },
          { title: '函数-defer-错误', path: '/go-study/basic-syntax/7.函数-defer-错误.md' },
          { title: '结构体', path: '/go-study/basic-syntax/8.结构体.md' },
          { title: '接口-IO', path: '/go-study/basic-syntax/9.接口-IO.md' },
          { title: '包', path: '/go-study/basic-syntax/10.包.md' },
          { title: '并发-管道-锁', path: '/go-study/basic-syntax/11.并发-管道-锁.md' },
          { title: '网络', path: '/go-study/basic-syntax/12.网络.md' },
          { title: 'mysql-redis', path: '/go-study/basic-syntax/13.mysql-redis.md' },

          { title: 'fmt标准库', path: '/go-study/basic-lib/01-fmt标准库/01.md' },
          { title: 'os标准库', path: '/go-study/basic-lib/02-os标准库/02.md' },
          { title: 'time标准库', path: '/go-study/basic-lib/03-time标准库/03.md' },
          { title: 'log标准库', path: '/go-study/basic-lib/04-log标准库/04.md' },
          { title: 'errors标准库', path: '/go-study/basic-lib/05-errors标准库/05.md' },
          { title: 'bytes标准库', path: '/go-study/basic-lib/06-bytes标准库/06.md' },
          { title: 'io标准库', path: '/go-study/basic-lib/07-io标准库/07.md' },
          { title: 'ioutil标准库', path: '/go-study/basic-lib/08-ioutil标准库/08.md' },
          { title: 'bufio标准库', path: '/go-study/basic-lib/09-bufio标准库/09.md' },
          { title: 'builtin标准库', path: '/go-study/basic-lib/10-builtin标准库/10.md' },
          { title: 'json标准库', path: '/go-study/basic-lib/11-json标准库/11.md' },
          { title: 'sort标准库', path: '/go-study/basic-lib/12-sort标准库/12.md' },
          { title: 'math标准库', path: '/go-study/basic-lib/13-math标准库/13.md' },
          { title: 'flag标准库', path: '/go-study/basic-lib/14-flag标准库/14.md' },
          { title: 'runtime标准库', path: '/go-study/basic-lib/15-runtime标准库/15.md' },
          { title: 'context标准库', path: '/go-study/basic-lib/16-context标准库/16.md' },
        ],
      },
    ],

    logo: '/img/logo.png',
    repo: 'returnMaize/blog',
    searchMaxSuggestions: 10,
    docsDir: 'docs',
    footer: {
      createYear: 2023,
      copyrightInfo:
        'encode studio | <a href="https://github.com/returnMaize/blog" target="_blank">github</a>',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/img/logo.png' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'blog',
      },
    ],
  ],

  plugins: <UserPlugins>[
    [
      'one-click-copy',
      {
        copySelector: [
          'div[class*="language-"] pre',
          'div[class*="aside-code"] aside',
        ],
        copyMessage: '复制成功',
        duration: 1000,
        showInMobile: false,
      },
    ],

    [
      'vuepress-plugin-zooming',
      {
        selector: '.theme-vdoing-content img:not(.no-zoom)',
        options: {
          bgColor: 'rgba(0,0,0,0.6)',
        },
      },
    ],
  ],
  extraWatchFiles: ['.vuepress/config.ts'],
})
