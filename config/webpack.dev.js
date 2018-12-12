const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const packageConfig = require('../package.json')

//开发模式的ip和端口号
let host = '127.0.0.1';
let port = 20000;

//错误提示信息
let createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

module.exports = {
  //基础目录，默认当前文件夹
  context: path.resolve(__dirname, '../'),
  //解析入口，可配置多个入口起点
  entry: {
    app: path.resolve(__dirname, '../src/index.js')
  },
  //输出目录
  output: {
    //文件名
    filename: '[name].bundle.js',
    //输出路径
    path:path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  resolve: {
    //自动解析确定的扩展,引用test.vue/js/json，直接用import test from './test'，无需写后缀
    extensions: ['.js', '.vue', '.json'],
    //别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
    }
  },
  //源码映射
  devtool: 'cheap-module-eval-source-map',
  //启动本地服务，方便联调
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') },
      ],
    },
    hot: true,//热重载
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,//启用gzip压缩
    host: host,
    port: port,  //端口号
    open: true,  //自动打开浏览器
    overlay: false,
    publicPath: '/',
    proxy: {},  //代理地址
    quiet: true, // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。使用FriendlyErrorsPlugin插件时，设置为true
    watchOptions: { //监视文件是否有改动，也可改为定期轮询文件
      poll: false,
    }
  },
  module: {
    rules: [
      //eslint检查
      {
        test: /\.(vue|js)$/,
        enforce: 'pre',
        //检查范围
        include: [path.resolve(__dirname, '../src')],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter'),
              emitWarning: true
            }
          }
        ]
      },
      /**
       * babel编辑js文件，es6 -> es5
       */
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: [
          {
            loader: 'babel-loader', 
            options: {
              presets: ['env']
            }
          }
        ] 
      },
      //vue文件编译
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      //图片编译，图片小于固定尺寸就采用base64编码
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '/img/[name].[hash:7].[ext]')
        }
      },
      //视频编译
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '/media/[name].[hash:7].[ext]')
        }
      },
       //视频编译
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    //热重载
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    //处理html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    //提示插件，错误提示等等
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${host}:${port}`],
      },
      onErrors: createNotifierCallback()
    })
  ]
}