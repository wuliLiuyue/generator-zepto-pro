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
    devtool: "#source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, `../dist/${mode}/js`),
        publicPath: `../dist/${mode}/js`,
        filename: '[name].js',
        chunkFilename: '[chunkhash].js'
    }
};