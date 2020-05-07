module.exports = {
  devServer: {
    proxy: {
      '/musicsearch': {
        target: 'https://api.qq.jsososo.com',
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/musicsearch': '',
        },
      },
    },
  },
}
