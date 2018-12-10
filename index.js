const path = require('path');


module.exports = {
    //开发模式
    env: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
    },
    //构建，打包应用
    build: {
         // Paths
         assetsRoot: path.resolve(__dirname, '../dist'),
         assetsSubDirectory: 'static',
         assetsPublicPath: '/',
    }
}