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
    sidebar: [
      {
        title: 'JS基础篇',
        children: [
          {
            title: '事件循环',
            path: '/basics/event-loop.md',
          },
        ],
      },

      {
        title: 'Vue篇',
        children: [
          {
            title: '从模版到视图原理（2.x）',
            path: '/vue/template-to-dom-2.x.md',
          },
        ],
      },

      {
        title: '工程化篇',
        children: [
          {
            title: 'eslint',
            path: '/engineering/eslint.md',
          },
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
