/////////////////////////////////////////////////////////////////
///                                                           ///
///                   yeoman子项目构建逻辑                      ///
///                   继承自yeoman-generator类                 ///
///                   在生命周期回调中注入动态逻辑                ///
///                                                          ///
////////////////////////////////////////////////////////////////

const path = require('path');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const generators = require('yeoman-generator');
const figlet = require('figlet');
const ora = require('ora');

module.exports = class router extends generators {
  /**
   * 继承yeoman-generator
   * 获取生命周期hook
   */

  constructor(args, opts) {
    super(args, opts);
  };

  /**
   * 脚手架初始化
   */

  async initializing() {
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(this.templatePath());
  };
};
