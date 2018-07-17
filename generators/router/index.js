/////////////////////////////////////////////////////////////////
///                                                           ///
///                   yeoman子项目构建逻辑                      ///
///                   继承自yeoman-generator类                 ///
///                   在生命周期回调中注入动态逻辑                ///
///                                                          ///
////////////////////////////////////////////////////////////////

const fs = require('fs');
const util = require('util');
const generators = require('yeoman-generator');
const ora = require('ora');
const yargs = require('yargs');

module.exports = class router extends generators {
  /**
   * 继承yeoman-generator
   * 获取生命周期hook
   */

  constructor(args, opts) {
    super(args, opts);
    this.mode = yargs.argv.mode;
    this.name = yargs.argv.name;
  };

  /**
   * 脚手架初始化
   * 判断命令运行目录是否正确
   */

  async initializing() {
    const cwd_src = this.destinationPath().endsWith('src');
    if (!cwd_src) {
      const spinner = ora('请在src目录下运行该命令').fail();
      process.exit(1);
    }
    if (!this.name) {
      const spinner = ora('请添加--name=参数').fail();
      process.exit(1);
    }
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(this.destinationPath(`${this.mode}/html`));
    const add_file = files.indexOf(`${this.name}.html`);
    if (add_file > -1) {
      const spinner = ora(`${this.name}新页面已存在, 请更换新页面名称`).fail();
      process.exit(1);
    }
  };

   /**
   * 模版文件写入
   */

  writing() {
    const copy_files = [
      'js',
      'styl'
    ];
    copy_files.map(item => this.fs.copy(
      this.templatePath(`tmp/tmp.${item}`),
      this.destinationPath(`${this.mode}/${ item == 'styl' ? 'css' : item }/${this.name}.${item}`)
    ));
    this.fs.copyTpl(
      this.templatePath('tmp/tmp.html'),
      this.destinationPath(`${this.mode}/html/${this.name}.html`),
      { is_mobile: this.mode == 'mobile' ? true : false, name: this.name }
    );
  };

  /**
   * 构建完成
   */

  end() {
    const spinner = ora('新页面模版添加完成').succeed();
  };
};
