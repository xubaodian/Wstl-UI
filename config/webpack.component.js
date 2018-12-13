const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');


const Components = require('../components.json');


const spinner = ora('building for production...');
spinner.start();

let prodConfig = {
  //基础目录，默认当前文件夹
  context: path.resolve(__dirname, '../'),
  entry: Components,
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: './',
    filename: 'wstl-ui.[name].js',
    chunkFilename: '[id].js'
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
        loader: 'vue-loader',
        options: {
          // loaders: {
          //   css: ExtractTextPlugin.extract({
          //     fallback: 'style-loader',
          //     use: 'css-loader'
          //   }),
          //   less:  ExtractTextPlugin.extract({
          //     fallback: 'style-loader',
          //     use: 'css-loader!less-loader'
          //   })
          // },
          extractCSS: true
        }
      },
      //css文件loader
      {
        test: /\.css$/,
        use: [
            {
              loader: 'style-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false
              }
            }
        ]
      },
      {
        test: /\.less$/,
        use: [
            {
              loader: 'style-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false
              }
            }
        ]
      },
      //图片编译，图片小于固定尺寸就采用base64编码
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]'),
          publicPath: '../../'
        }
      },
      //视频编译
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]'),
          publicPath: '../../'
        }
      },
       //视频编译
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]'),
          publicPath: '../../'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    //压缩js文件
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      //启用源码映射
      sourceMap: false
    }),
    // //每次构建先删除上次的构建文件
    // new CleanWebpackPlugin(['lib'], {
    //   root: path.resolve(__dirname, '../')
    // }),
    // 提取css文件
    new ExtractTextPlugin({
      filename: 'wstl-ui.[name].css',
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    //压缩Css文件，尽可能去除重复样式
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    //预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}

webpack(prodConfig, (err, stats) => {
  spinner.stop()
  if (err) throw err
  //输出编译结果
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})