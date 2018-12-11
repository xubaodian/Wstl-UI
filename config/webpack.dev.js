const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, '../src/index.js'),
    print: path.resolve(__dirname, '../src/print.js')
  },
  output: {
    filename: '[name].bundle.js',
    path:path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
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
              presets: ['@babel/preset-env']
            }
          }
        ] 
      },
      //vue文件编译
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'vue-style-loader' },
          { 
            loader: 'css-loader',
            options: {
              sourceMap: true
            } 
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new ManifestPlugin(),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['../dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['print', 'app', 'manifest'],
      inject: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}