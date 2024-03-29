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
const figlet = require('figlet');
const ora = require('ora');

module.exports = class app extends generators {
  /**
   * 继承yeoman-generator
   * 获取生命周期hook
   */

  constructor(args, opts) {
    super(args, opts);
    this.appName = path.basename(process.cwd());
    this.appAuthor = 'wulimark';
  };

  /**
   * 脚手架初始化
   */

  async initializing() {
    const _figlet = util.promisify(figlet);
    try {
      let data = await _figlet('ZEPTO PRO');
      this.log(data);
    } catch(err) {
      this.log(chalk.red('Something went wrong...'));
      console.dir(err);
      return;
    }
    this.log(chalk.green('🦄  脚手架项目开始构建准备...请稍候...'));
    const spinner = ora('进入构建流程').succeed();
    this.async();
  };

  /**
   * 用户参数输入
   */

  prompting() {
    let questions = [
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        default: this.appName
      },
      {
        type: 'input',
        name: 'projectVersion',
        message: '项目版本号',
        default: '1.0.0'
      },
      {
        type: 'list',
        name: 'mode',
        message: '请选择包含的子项目类型',
        choices: [
          {
            name: '生成mobile及pc项目',
            value: 0,
            checked: 0
          },
          {
            name: '只生成mobile项目',
            value: 1
          },
          {
            name: '只生成pc项目',
            value: 2
          }
        ]
      }
    ];
    return this.prompt(questions)
    .then(function(answers){
      for(let item in answers){
          //bind绑定上下文, prompting输入参数添加到this, 方便后续逻辑编写
          answers.hasOwnProperty(item) && (this[item] = answers[item]);
      }
      const spinner = ora('构建参数输入完毕, 进入架构配置生成流程').succeed();
    }.bind(this));
  };

  /**
   * 配置生成
   */

  configuring() {
    let defaultSettings = this.fs.readJSON(this.templatePath('package.json'));
    let packageSettings = {
      name: this.projectName,
      private: true,
      version: this.projectVersion,
      description: `${this.projectName} - Generated by generator-jquery-mobile-pc`,
      main: 'index.js',
      scripts: defaultSettings.scripts,
      repository: defaultSettings.repository || '',
      keywords: [],
      author: this.appAuthor,
      devDependencies: defaultSettings.devDependencies,
      dependencies: defaultSettings.dependencies,
      jest: defaultSettings.jest || '',
      babel: defaultSettings.babel || '',
      eslintConfig: defaultSettings.eslintConfig || '',
      proxy: defaultSettings.proxy || ''
    };
    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
    const spinner = ora('架构配置生成完毕, 进入架构目录生成流程').succeed();
  };

  /**
   * 目录生成
   */

  async writing() {
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(this.templatePath());
    const uncopy_files = [
      'dist',
      'node_modules',
      'package-lock.json',
      'package.json',
    ];
    let copy_files = files.filter(item => uncopy_files.indexOf(item) < 0);
    copy_files.map(item => this.fs.copy(
      this.templatePath(item),
      this.destinationPath(item)
    ));
    this.async();
  };

  /**
   * 安装依赖
   */

  install() {
    if (this.mode) {
      let dir = ['mobile', 'pc'];
      removeDir(this.destinationPath(`mock/${dir[dir.length - this.mode]}`));
      removeDir(this.destinationPath(`src/${dir[dir.length - this.mode]}`));
    }
    const spinner = ora('架构目录生成完毕, 进入依赖安装流程').succeed();

    /**
     * 递归删除目录
     */

    function removeDir(dir) {
      let files = fs.readdirSync(dir);
      files.map((item, i) => {
        let _path = path.join(dir, files[i]);
        let stat = fs.statSync(_path);
        if (stat.isDirectory()) {
          removeDir(_path);
        } else {
          fs.unlinkSync(_path);
        }
      });
      fs.rmdirSync(dir);
    };

    this.installDependencies({
      bower: false,
      npm: true,
      callback: function() {
        const spinner = ora('npm依赖安装完毕').succeed();
      }
    });
  };
 
  /**
   * 构建完成
   */

  end() {
    const spinner = ora('脚手架构建完毕').succeed();
    figlet('KKL FE TEAM', (err, data) => {
        if (err) {
            this.log(chalk.red('Something went wrong...'));
            console.dir(err);
            return;
        }
        this.log(chalk.green(data));
    });
  };
};
