////////////////////////////////////////////////////////////////
///                                                          ///
///                   yeoman项目构建逻辑                       ///
///                   继承自yeoman-generator类                ///
///                   在生命周期回调中注入动态逻辑               ///
///                                                          ///
////////////////////////////////////////////////////////////////

const path = require('path');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const generators = require('yeoman-generator');
const yosay = require('yosay');
const figlet = require('figlet');
const ora = require('ora');

module.exports = class app extends generators {
  constructor(args, opts) {
    super(args, opts);
    this.appName = path.basename(process.cwd());
    this.appAuthor = 'wulimark';
  };

  initializing() {
    console.log(`
 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 ||                                                      ||
 ||           mobile and pc project generator            ||
 ||           support es6 stylus zepto jquery            ||
 ||                                                      ||
 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    `);
    console.log('🦄  脚手架项目开始构建准备...请稍候...');
    const spinner = ora('进入构建流程').succeed();
  };

  

  end() {
    figlet('KKL FE TEAM', (err, data) => {
        if (err) {
            this.log(chalk.red('Something went wrong...'));
            console.dir(err);
            return;
        }
        this.log(chalk.blue(data));
    });
  };
};