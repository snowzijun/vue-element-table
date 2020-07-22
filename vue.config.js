/*
 * @Author: 子君
 * @Date: 2020-07-12 12:26:05
 * @LastEditTime: 2020-07-22 13:50:33
 * @LastEditors: 子君
 * @Description: In User Settings Edit
 * @FilePath: \vue-element-table\vue.config.js
 */
// const path = require('path')
// const resolve = dir => path.resolve(__dirname, '../', dir)

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  configureWebpack: config => {
    if (isProd) {
      // 配置webpack 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css$/,
          // 超过4kb压缩
          threshold: 4096
        })
      )
    }
  },
  chainWebpack: config => {
    // 项目标题
    config.plugin('html').tap(args => {
      args[0].title = '前端有的玩'
      return args
    })

    config
      .entry('app')
      .clear()
      .add('./example/main.js')
  },
  // 不需要生产环境的 source map
  productionSourceMap: false,
  publicPath: !isProd ? '/' : '',
  css: {
    // 是否将css 提取到独立的文件,生产环境提取，开发环境不提取
    extract: !!isProd,
    // 开发模式开启css sourcemap
    sourceMap: !isProd
  },
  devServer: {
    port: 12315
  }
}
