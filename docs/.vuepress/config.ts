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
          { title: '基础语法', path: '/go/syntax.md' },
          { title: '基础语法', path: '/go/syntax.md' },
          { title: '1.go介绍', path: '/go/summary/1.go介绍.md' },
          { title: '2.fmt包', path: '/go/summary/2.fmt包.md' },
          { title: '3.变量', path: '/go/summary/3.变量.md' },
          { title: '4.常量', path: '/go/summary/4.常量.md' },
          { title: '5.数据类型', path: '/go/summary/5.数据类型.md' },
          { title: '6.运算符', path: '/go/summary/6.运算符.md' },
          { title: '7.流程控制语句', path: '/go/summary/7.流程控制语句.md' },
          { title: '8.数组', path: '/go/summary/8.数组.md' },
          { title: '9.切片', path: '/go/summary/9.切片.md' },
          { title: '10.排序算法', path: '/go/summary/10.排序算法.md' },
          { title: '11.map类型', path: '/go/summary/11.map类型.md' },
          { title: '12.函数', path: '/go/summary/12.函数.md' },
          { title: '13.time包', path: '/go/summary/13.time包.md' },
          { title: '14.指针', path: '/go/summary/14.指针.md' },
          { title: '15.结构体', path: '/go/summary/15.结构体.md' },
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
