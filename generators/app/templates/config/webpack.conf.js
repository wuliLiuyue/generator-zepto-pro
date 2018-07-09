const path = require('path');
const fs = require('fs');
const yargs = require('yargs');
const webpack = require('webpack');
const mode = yargs.argv.mode;
const srcDir = path.resolve(__dirname, `../src/${mode}`);

//获取多页面的每个入口文件, 用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    return files;
}

module.exports = {
    mode: 'development',
    cache: true,
    devtool: true,
    entry: getEntry(),
    output: {
        path: path.join(__dirname, `../dist/${mode}/js`),
        publicPath: `../dist/${mode}/js`,
        filename: '[name].js',
        chunkFilename: '[chunkhash].js'
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.resolve('src')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory=true',
                include: [path.resolve('src')]
            },
            {
                test: /\.(woff2?|eot|ttf|otf|png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    }
};