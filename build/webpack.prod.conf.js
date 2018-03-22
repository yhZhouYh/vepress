var fs = require('fs')
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpack = require('./webpack.base.conf')
var baseWebpackConfig = baseWebpack.webpackConfig
var projectDir = baseWebpack.projectDir
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
var loadMinified = require('./load-minified')
var PreloadWebpackPlugin = require('preload-webpack-plugin')

var plugins = [
  // http://vuejs.github.io/vue-loader/en/workflow/production.html
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: true
  }),
  // extract css into its own file
  new ExtractTextPlugin({
    // name: name,
    filename: utils.assetsPath(projectDir + '/css/[name].[contenthash].css'),
    // allChunks: true
  }),
  // Compress extracted CSS. We are using this plugin so that possible
  // duplicated CSS from different components can be deduped.
  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }),

  // new PreloadWebpackPlugin({
  //   rel: 'preload',
  //   as(entry) {
  //     if (/\.css$/.test(entry)) return 'style';
  //     // if (/\.woff$/.test(entry)) return 'font';
  //     if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(entry)) return 'image';
  //     return 'script';
  //   }
  // }),
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: utils.assetsPath(projectDir + '/js/vendor.[hash].js')
  }),
  // extract webpack runtime and module manifest to its own file in order to
  // prevent vendor hash from being updated whenever app bundle is updated
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'manifest',
  //   filename: projectDir + '/manifest',
  //   chunks: ['vendor']
  // }),
  // copy custom static assets
  // new CopyWebpackPlugin([
  //   {
  //     from: path.resolve(__dirname, '../static'),
  //     to: config.build.assetsSubDirectory,
  //     ignore: ['.*']
  //   }
  // ]),
]

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  var split = name.split('/')
  var htmlname = split[split.length - 1]
  plugins.push(new HtmlWebpackPlugin({
    filename: path.posix.join(projectDir, htmlname + '.html'),
    template: path.posix.join('client/pages/', projectDir, htmlname + '.html'),
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunks: ['vendor', name],
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }))

})

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {

  module: {

    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath(projectDir + '/js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath(projectDir + '/js/[id].[chunkhash].js')
  },
  plugins: plugins
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
