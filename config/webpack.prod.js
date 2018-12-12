const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');


const spinner = ora('building for production...');
spinner.start();


let cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    less: generateLoaders('less')
  }
}

let prodConfig = {
  //基础目录，默认当前文件夹
  context: path.resolve(__dirname, '../'),
  //解析入口，可配置多个入口起点
  entry: {
    app: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: path.posix.join('static', 'js/[name].[chunkhash].js'),
    chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js')
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
  devtool: '#source-map',
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
          loaders: cssLoaders({
            sourceMap: true,
            extract: true
          }),
          cssSourceMap: true,
          cacheBusting: true,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      //css文件loader
      {
        test: /\.css$/,
        use: [
            ...ExtractTextPlugin.extract({
              fallback: 'vue-style-loader',
              use: 'css-loader'
            }),
            {
              loader: 'vue-style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }
        ]
      },
      {
        test: /\.less$/,
        use: [
            ...ExtractTextPlugin.extract({
              fallback: "vue-style-loader",
              use: "less-loader"
            }),
            {
              loader: 'vue-style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
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
        NODE_ENV: '"production"'
      }
    }),
    //压缩减少文件
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      //启用源码映射
      sourceMap: true,
      parallel: true
    }),
    // 提取css文件
    new ExtractTextPlugin({
      filename: path.posix.join('static', '/css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    //压缩Css文件，尽可能去除重复样式
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true, 
        map: { 
          inline: false 
        } 
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    //处理html文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    //该插件会根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    //预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    //提取公共的文件到一个包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../dist'),
    //     to: 'static',
    //     ignore: ['.*']
    //   }
    // ])
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