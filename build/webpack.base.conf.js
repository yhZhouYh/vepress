var path = require('path')
var utils = require('./utils')
var config = require('../config')
var glob = require('glob')
// var vueLoaderConfig = require('./vue-loader.conf')
var projectDir = ''
var htmls = []
var entries = getEntry('./client/pages/**/**.html')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  entry: entries,
  output: {
    path: config.dev.assetsRoot,
    filename: utils.assetsPath(projectDir + '/js/[name].js'),
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('client')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          minimize: true
        }
      },
      
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath(projectDir + '/img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath(projectDir + '/media/[name].[hash:7].[ext]')
        }
        
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath(projectDir + '/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

function getEntry(globPath) {
  var entries = {}
  glob.sync(globPath).map(function (entry, index) {
    var base = path.basename(entry)
    var basename = path.basename(entry, '.html')
    var dirs = path.dirname(entry).split('/')
    projectDir = dirs.slice(3).join('/')
    var res = './' + path.posix.join('client', 'pages', projectDir, '**',basename + '.js')
    glob.sync(res).map(function (result, index) {
      entries[basename] = result
    })
  })
  return entries
}
module.exports = { webpackConfig: webpackConfig, projectDir: projectDir, htmls: htmls }
