﻿﻿/*

1.js/css/html文件压缩

2.文件指纹

3.include

*/

var baseDir = "src/";

var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    tap = require('gulp-tap'),
    filter = require('gulp-filter'),
    rev = require('gulp-rev-append'),
    include = require('gulp-file-include'),
    uglify = require('gulp-uglify'),
    //2018-12-08/author:liusiqi;
    // minifyCss = require('gulp-minify-css'),已经弃用,css压缩。
    minifyCss = require('gulp-clean-css'),
    minifyHtml = require('gulp-htmlmin'),
    rename = require("gulp-rename"),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    proxyMiddleware = require('http-proxy-middleware'),
    less = require('gulp-less'),
    fileinclude  = require('gulp-file-include');
    // var babel = require("gulp-babel");    // 用于ES6转化ES5
    // var sass = require('gulp-sass');

gulp.task('build', function () {

    // gulp.watch('src/js/**/*.js', ['toes5']);
    var jsFilter = filter('**/*.js', { restore: true }),
        cssFilter = filter('**/*.css', { restore: true }),
        htmlFilter = filter('**/*.html', { restore: true }),
        tempFilter = filter(baseDir + 'index.html', { restore: true });

    var options = {
        removeComments: true,                 //清除HTML注释
        collapseWhitespace: true,             //压缩HTML
        collapseBooleanAttributes: true,      //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,          //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,     //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,                       //压缩页面JS
        minifyCSS: true                       //压缩页面CSS
    };

    return gulp.src([baseDir + "**/*.*"])
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore)
        .pipe(htmlFilter)
        .pipe(rev())
        .pipe(include())
        .pipe(minifyHtml(options))
        .pipe(htmlFilter.restore)
        .pipe(tempFilter)
        .pipe(rename(function (file) { file.extname }))
        .pipe(tempFilter.restore)
        .pipe(gulp.dest('dist/'));            //输出文件夹
});


// ES6转化为ES5
// 在命令行使用 gulp toes5 启动此任务
// gulp.task('js_main', ['uglify_check'], function(){
//     return gulp.src('./src/js/*.js')
//         .pipe(concat('main.min.js'))    // 合并文件并命名
//         .pipe(babel({                   // 编译es6语法
//             presets: ["@babel/env"],
//             plugins: []
//         }))                  
//         .pipe(gulpif(env==='build', uglify()))  // 判断是否压缩压缩js
//         .pipe(gulp.dest('./dist/js'));
// });
// var middleware = proxyMiddleware('/nw', {
//     target: 'http://test.h5.yzqianbao.com',
//     changeOrigin: true,
//     pathRewrite: {
//     '^/nw': ''
//     },
//     logLevel: 'debug'
// });
const origin_1 = 'http://192.168.2.215:9000';
const origin_2 = 'http://test.h5.yzqianbao.com';
const origin_3 = 'http://192.168.2.191:9000';
const origin_4 = 'http://192.168.2.183:9000';

const proxy = proxyMiddleware('/nw', {target: origin_2, changeOrigin: true});
const proxy_ = proxyMiddleware('/web', {target: origin_2, changeOrigin: true});
const proxy1 = proxyMiddleware('/system', {target: origin_2, changeOrigin: true});
const proxy2 = proxyMiddleware('/xjbk', {target: origin_2, changeOrigin: true});
gulp.task("server", function () {
    gulp.start(["fileinclude"]);
    // gulp.start(['fileinclude']).then(function(){
        browserSync.init({
            server: {
                baseDir: baseDir,
                middleware:[proxy,proxy1,proxy2,proxy_]
            },
            port:8050
        });

        gulp.watch([baseDir + "**/*.html", baseDir + "**/*.js", baseDir + "**/*.css", ]).on('change', function(){
        //     gulp.src(baseDir + "**/*.scss")
        // // 进行Sass文件的编译
        //   .pipe(sass({
        //     outputStyle: 'expanded'
        //   })
        //   // 定义Sass文件编译过程中发生错误的响应处理(如果没有它，一旦发生错误则直接退出脚本)
        //     .on('error', sass.logError))
        //   // 编译后的css文件保存在css目录下
        //   .pipe(gulp.dest('css'));

            browserSync.reload;
        });
    // });
});
//静态页面嵌套模块
gulp.task('fileinclude', function() {
    gulp.src('src/*.html')
        .pipe(fileinclude({
          prefix: '@@'
          
        }))
    .pipe(gulp.dest('dist_/view'));
});

gulp.task("clean", function() {
    del([
        "dist"
    ]).then()
})


gulp.task('default', function () {
    gulp.start(["build"]);
});
