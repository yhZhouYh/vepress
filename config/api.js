const env = process.env.NODE_ENV || 'development'

const config = {
    development: {
        host: 'http://stg2.v5time.net',
        h5host: 'http://h5.stg1.v5time.net',
        domain: '/activies/',
        jump: 'stg2.v5time.net',
        open: 'http://open.v5time.net',
        zwhost: 'http://stg2.v5time.net',
        social: {
            weixin: {
                app_ID: 'wxb3b79c8f80ec2283',
                app_KEY: '53f66487ebc4f40cf5b29b479f2d1142'
            },
            QQ: {
                app_ID: '101006551',
                app_KEY: '8af57cdcce7ca3df636e277e3d3f1343'
            },
            weibo: {
                app_ID: '2889481671',
                app_KEY: 'ef247d72cbe8bdec95a9f22bc6f7f0df'
            }
        },
    },
    test: {
        host: 'http://stg2.v5time.net',
        domain: '/activies/',
        h5host: 'http://h5.stg1.v5time.net',
        jump: 'stg2.v5time.net',
        open: 'http://open.v5time.net',
        zwhost: 'http://stg2.v5time.net',
        social: {
            weixin: {
                app_ID: 'wxb3b79c8f80ec2283',
                app_KEY: '53f66487ebc4f40cf5b29b479f2d1142'
            },
            QQ: {
                app_ID: '101006551',
                app_KEY: '8af57cdcce7ca3df636e277e3d3f1343'
            },
            weibo: {
                app_ID: '2889481671',
                app_KEY: 'ef247d72cbe8bdec95a9f22bc6f7f0df'
            }
        }
    },
    production: { 
        host: 'http://www.timeface.cn',
        domain: '/activies/',
        h5host: 'http://m.timeface.cn',
        jump: 'www.timeface.cn',
        open: 'http://open.timeface.cn',
        zwhost: 'zhengwen.timeface.cn',
        social: {
            weixin: {
                app_ID: 'wxbeba82ef43c9b6a9',
                app_KEY: '9a8e08eb8d12d87e146c202479c891ac'
            },
            QQ: {
                app_ID: '101006551',
                app_KEY: '8af57cdcce7ca3df636e277e3d3f1343'
            },
            weibo: {
                app_ID: '2889481671',
                app_KEY: 'ef247d72cbe8bdec95a9f22bc6f7f0df'
            }
        }
    }
}


module.exports = config[env]