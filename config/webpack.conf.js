////////////////////////////////////////////////////////////////
///                                                          ///
///                   webpack打包配置                         ///
///                   ts编译                                 ///
///                                                          ///
////////////////////////////////////////////////////////////////

const path = require('path');
const webpack = require('webpack');

/**
 * 基础配置
 */

const BaseConf = {
    mode: 'development',
    cache: true,
    devtool: false,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader'
                }],
                include: [ path.resolve('generators') ]
            }
        ]
    }
};

/**
 * 打包配置
 */

module.exports = [
  Object.assign({}, BaseConf, {
      entry: {
          app: path.join(__dirname, '../generators/app/index.ts')
      },
      output: {
          path: path.join(__dirname, `../generators/app`),
          filename: 'index.js'
      }
  })
];