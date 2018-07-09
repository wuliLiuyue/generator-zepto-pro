const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const srcDir = path.resolve(__dirname, '../src');

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
    cache: true,
    devtool: "#source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, 'js'),
        publicPath: 'js',
        filename: '[name].js',
        chunkFilename: '[chunkhash].js'
    },
    plugins: [
        new CommonsChunkPlugin('common.js'),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};