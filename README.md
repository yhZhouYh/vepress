

## 如何打包？
 在build文件夹下webpack.base.conf.js里配置项目html路径，会自动寻找对应项目下同名的js文件，此文件作为每个html打包的入口文件；

## 优化了啥？
 
 ```
 服务端开发：路由文件与先前保持一致（路由不要与文件夹同名 TODO）；现在默认client/pages下面的html作为模板文件，由此，不需要在server/views下单独写模板了

 ```
 静态文件：与服务端相同，都写在client/pages下面，测试环境打包会生成在static里,生产环境在public里

 基于vue-cli的webpack1.x进化到了webpack2.x，打包速度更快了；所有JS和css自动引入，无需手动引入了;自动提取多个js中引入的公共的js，打成vendor包，自动引入，充分利用服务端缓存


 




