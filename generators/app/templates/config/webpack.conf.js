////////////////////////////////////////////////////////////////
///                                                          ///
///                   webpack打包配置                         ///
///                   eslint、stylus、babel编译               ///
///                   代码提取优化                             ///
///                                                          ///
////////////////////////////////////////////////////////////////

const path = require('path');
const fs = require('fs');
const yargs = require('yargs');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { mode, proxy } = yargs.argv;
const srcDir = path.resolve(__dirname, `../src/${mode}`);

/**
 * 获取多页面的每个入口文件, 用于配置中的entry
 */

function getEntry() {
    const jsPath = path.resolve(srcDir, 'js');
    const dirs = fs.readdirSync(jsPath);
    let matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    return files;
}

/**
 * 打包配置
 */

module.exports = {
    mode: 'production',
    cache: true,
    devtool: 'source-map',
    entry: getEntry(),
    output: {
        path: path.join(__dirname, `../dist/${mode}/js`),
        publicPath: `../dist/${mode}/js`,
        filename: '[name].js'
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                }],
                enforce: 'pre',
                include: [ path.resolve('src') ]
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader?cacheDirectory=true'
                }],
                include: [ path.resolve('src') ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf|png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: '[name].[ext]?[hash]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          __PROXY__: proxy ? JSON.stringify(`/${proxy}`) : ''
        }),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        }),
        new webpack.optimize.SplitChunksPlugin({
            chunks: 'all',
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        })
    ]
};