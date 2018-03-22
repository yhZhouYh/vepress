var express = require('express')
var path = require('path')
var http = require('http')
var isDev = process.env.NODE_ENV == 'development'
var app = express()
var router = require('./server/routers/router');
var template = require('art-template')
var bodyParser = require('body-parser')
var multer = require('multer')
var cookieParser = require('cookie-parser')
var config = require('./config')
var proxyMiddleware = require('http-proxy-middleware')
var logger = require('morgan');
var webpackConfig = process.env.NODE_ENV === 'testing' ?
    require('./build/webpack.prod.conf') :
    require('./build/webpack.dev.conf')
var PORT = process.env.PORT ? process.env.PORT : config.dev.port
var domain = require('./config/api').domain
var proxyTable = config.dev.proxyTable

if (isDev || PORT == 'test') {
    app.use(express.static(path.join(__dirname, 'static')))
    Object.keys(proxyTable).forEach(function (context) {
        var options = proxyTable[context]
        if (typeof options === 'string') {
            options = { target: options }
        }
        app.use(proxyMiddleware(context, options))
    })
} else {
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1000 * 60 * 60 }))
    app.use(express.static(path.join(__dirname, 'static'), { maxAge: 1000 * 60 * 60 }))
}


app.use(cookieParser())
app.use(bodyParser.json({ limit: "10000kb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

if (isDev) {
    app.set('views', path.join(__dirname, 'static'))
    app.set('views', path.join(__dirname, 'server/views'))
    app.use(logger('combined'));
} else {
    app.set('views', path.join(__dirname, 'public'))
    app.set('views', path.join(__dirname, 'server/views'))
}

//添加template模板
// template.config('extname', '.html');
// app.engine('.html', template.__express);
app.set('view engine', 'ejs');
app.use(router)
app.locals.domain = domain

if (isDev) {
    // local variables for all views
    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack')
    var compiler = webpack(webpackConfig)

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        }
    })
    var hotMiddleware = require('webpack-hot-middleware')(compiler)
    app.use(devMiddleware)
    app.use(hotMiddleware)
    var server = http.createServer(app)
    server.listen(PORT, function () {
        console.log('App (dev) is now running on PORT ' + PORT + '!')
    })
} else {
    //捕获404并对跳转错误进行处理。
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // 开发环境错误处理。
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('404');
        });
    }

    // 生产环境错误处理。
    // 没有堆栈跟踪泄露给用户。
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('404');
    });
    app.listen(PORT, function () {
        console.log('App (production) is now running on PORT ' + PORT + '!')
    })
}