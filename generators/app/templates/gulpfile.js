const gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    del = require('del'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./config/webpack.conf.js'),
    connect = require('gulp-connect'),
    yargs = require('yargs'),
    browserSync = require('browser-sync').create(),
    sequence = require('run-sequence');

/**
 * 移动端8000端口, pc端9000端口
 */

const mode = yargs.argv.mode;
const host = {
    path: `dist/${mode}/`,
    port: mode == 'mobile' ? 8000 : 9000,
    html: 'index.html'
};

/**
 * mac chrome: 'Google chrome'
 */

const browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

/**
 * 创建静态服务
 */

gulp.task('connect', function() {
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

/**
 * 图片文件转移
 */

gulp.task('copy:img', function(done) {
    gulp.src([`src/${mode}/img/*`])
    .pipe(gulp.dest(`dist/${mode}/img`))
    .on('end', done);
});

/**
 * extend文件转移
 */

gulp.task('extend', function (done) {
    gulp.src([`src/${mode}/extend/*`])
    .pipe(gulp.dest(`dist/${mode}/extend`))
    .on('end', done);
});

/**
 * html文件转移
 */

gulp.task('html', ['extend'], function (done) {
    gulp.src([`src/${mode}/**/*.html`])
    .pipe(gulp.dest(`dist/${mode}`))
    .on('end', done);
});

/**
 * 压缩合并css
 */

gulp.task('stylus:min', function(done) {
    gulp.src([`src/${mode}/css/*`])
    .pipe(stylus())
    .pipe(concat('common.min.css'))
    .pipe(gulp.dest(`dist/${mode}/css`))
    .on('end', done);
});

/**
 * 雪碧图操作, 应该先拷贝图片并压缩合并css
 */

gulp.task('sprite', ['copy:img', 'stylus:min'], function(done) {
    const timestamp = Number(new Date());
    gulp.src(`dist/${mode}/css/common.min.css`)
    .pipe(spriter({
        spriteSheet: `dist/${mode}/img/spritesheet` + timestamp + '.png',
        pathToSpriteSheetFromCSS: '../img/spritesheet' + timestamp + '.png',
        spritesmithOptions: { padding: 10 }
    }))
    .pipe(base64())
    .pipe(cssmin())
    .pipe(gulp.dest(`dist/${mode}/css`))
    .on('end', done);
});

/**
 * 将css加上10位md5, 并修改html中的引用路径
 */

gulp.task('md5:css', [], function(done) {
    gulp.src(`dist/${mode}/css/*.css`)
    .pipe(md5(10, `dist/${mode}/**/*.html`))
    .pipe(gulp.dest(`dist/${mode}/css`))
    .on('end', done);
});

/**
 * 引用webpack对js进行操作
 */

const devCompiler = webpack(webpackConfig);

gulp.task('build:js', function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build:js', err);
        gutil.log('[webpack:build:js]', stats.toString({ colors: true }));
        callback();
    });
});

/**
 * 将js加上10位md5, 并修改html中的引用路径
 */

gulp.task('md5:js', ['build:js'], function(done) {
    gulp.src(`dist/${mode}/js/*.js`)
    .pipe(md5(10, `dist/${mode}/**/*.html`))
    .pipe(gulp.dest(`dist/${mode}/js`))
    .on('end', done);
});

/**
 * 清理编译目录
 */

gulp.task('del', function() {
    return del([`dist/${mode}`])
});

/**
 * 实时编译
 */

gulp.task('watch', function(done) {
    gulp.watch(`src/${mode}/**/*`, ['copy:img', 'html', 'stylus:min', 'build:js'])
    .on('end', done);
});

/**
 * 浏览器重载
 */

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: `127.0.0.1:${host.port}`
    });
    gulp.watch('src/**/*', ['copy:img', 'html', 'stylus:min', 'build:js']);
    gulp.watch('src/**/*').on('change', browserSync.reload);
});

/**
 * 打开浏览器
 */

gulp.task('open', function(done) {
    gulp.src('')
    .pipe(gulpOpen({
        app: browser,
        uri: `http://localhost:${host.port}/index.html`
    }))
    .on('end', done);
});

/**
 * 编译
 */

gulp.task('make', sequence('del', 'copy:img', 'html', 'stylus:min', 'build:js'));

/**
 * 打包
 */

gulp.task('pack', ['connect', 'md5:css', 'md5:js', 'open']);

/**
 * 开发
 */

gulp.task('default', ['connect', 'make', 'browser-sync']);
