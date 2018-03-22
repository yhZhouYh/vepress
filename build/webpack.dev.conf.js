var fs = require('fs')
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpack = require('./webpack.base.conf')
var baseWebpackConfig = baseWebpack.webpackConfig
var projectDir = baseWebpack.projectDir
var htmls = baseWebpack.htmls
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var PreloadWebpackPlugin = require('preload-webpack-plugin')
var plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),
  // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  // https://github.com/ampedandwired/html-webpack-plugin
  // new HtmlWebpackPlugin({
  //   filename: 'enroll.html',
  //   template: 'enroll.html',
  //   inject: 'body',
  // }),
  new PreloadWebpackPlugin({
    rel: 'preload',
    as(entry) {
      if (/\.css$/.test(entry)) return 'style';
      if (/\.woff$/.test(entry)) return 'font';
      // if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(entry)) return 'image';
      return 'script';
    }
  }),
  new FriendlyErrorsPlugin()
]
// add hot-reload related code to entry chunks


Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  var split = name.split('/')
  var htmlname = split[split.length - 1]
  plugins.push(new HtmlWebpackPlugin({
    filename: path.posix.join(projectDir, htmlname + '.html'),
    template: path.posix.join('client/pages/' , projectDir , htmlname + '.html'),
    inject: true,
    chunks: [name]
  }))
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: plugins
})
