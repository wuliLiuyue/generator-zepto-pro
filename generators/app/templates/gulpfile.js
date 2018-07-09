const gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./config/webpack.conf.js'),
    connect = require('gulp-connect'),
    yargs = require('yargs');

//移动端3000端口, pc端4000端口
const mode = yargs.argv.mode;
const host = {
    path: `dist/${mode}/`,
    port: mode == 'mobile' ? 3000 : 4000,
    html: 'index.html'
};

//mac chrome: 'Google chrome'
const browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

//将图片拷贝到目标目录
gulp.task('copy:img', function(done) {
    gulp.src([`src/${mode}/img/*`]).pipe(gulp.dest(`dist/${mode}/img`)).on('end', done);
});

//压缩合并css
gulp.task('stylus:min', function(done) {
    gulp.src([`src/${mode}/css/*`])
    .pipe(stylus())
    .pipe(concat('common.min.css'))
    .pipe(gulp.dest(`dist/${mode}/css`))
    .on('end', done);
});

//将js加上10位md5, 并修改html中的引用路径
gulp.task('md5:js', ['build:js'], function(done) {
    gulp.src(`src/${mode}/js/*.js`)
    .pipe(md5(10, `src/${mode}/**/*.html`))
    .pipe(gulp.dest(`dist/${mode}/js`))
    .on('end', done);
});

//将css加上10位md5, 并修改html中的引用路径
gulp.task('md5:css', ['sprite'], function(done) {
    gulp.src(`src/${mode}/css/*.css`)
    .pipe(md5(10, `src/${mode}/**/*.html`))
    .pipe(gulp.dest(`dist/${mode}/css`))
    .on('end', done);
});

//雪碧图操作, 应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:img', 'stylus:min'], function(done) {
    const timestamp = +new Date();
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

gulp.task('clean', function(done) {
    gulp.src(['dist'])
    .pipe(clean())
    .on('end', done);
});

gulp.task('watch', function(done) {
    gulp.watch(`src/${mode}/**/*`, ['stylus:min', 'build:js'])
    .on('end', done);
});

gulp.task('connect', function() {
    console.log('服务启动');
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

gulp.task('open', function(done) {
    gulp.src('')
    .pipe(gulpOpen({
        app: browser,
        uri: `http://localhost:${host.port}/index.html`
    }))
    .on('end', done);
});

const devCompiler = webpack(webpackConfig);

//引用webpack对js进行操作
gulp.task('build:js', function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build:js', err);
        gutil.log('[webpack:build:js]', stats.toString({ colors: true }));
        callback();
    });
});

//发布
gulp.task('default', ['connect', 'md5:css', 'md5:js', 'open']);

//开发
gulp.task('dev', ['connect', 'copy:img', 'stylus:min', 'build:js', 'watch', 'open']);