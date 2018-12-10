const webpack = require('webpack');
const config = require('../config/index');
const merge = require('webpack-merge');
const path = require('path');

const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devWebpackConfig = merge(baseWebpackConfig, {
    
})