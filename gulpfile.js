"use strict";

// modules
var eventStream = require('event-stream');
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

//vars
var reload = browserSync.reload;
var gulpConfig = require('./gulp-config.js');

//paths
var srcJsPath     = path.join(gulpConfig.srcBasePath, gulpConfig.js.srcPath);
var srcCssPath    = path.join(gulpConfig.srcBasePath, gulpConfig.css.srcPath);
var srcImagesPath = path.join(gulpConfig.srcBasePath, gulpConfig.image.srcPath);
var srcHtmlPath   = path.join(gulpConfig.srcBasePath, gulpConfig.html.srcPath);

var targetJsPath     = path.join(gulpConfig.targetBasePath, gulpConfig.js.targetPath);
var targetCssPath    = path.join(gulpConfig.targetBasePath, gulpConfig.css.targetPath);
var targetImagesPath = path.join(gulpConfig.targetBasePath, gulpConfig.image.targetPath);
var targetHtmlPath   = path.join(gulpConfig.targetBasePath, gulpConfig.html.targetPath);

/**/

gulp.task('default', function(){
  console.log(srcJsPath);
});

var htmlGlobs = [
  srcHtmlPath + '/**/*.html',
  srcHtmlPath + '/**/*.htm',
  srcHtmlPath + '/**/*.php',
  srcHtmlPath + '/**/*.json',
];

var jsGlobs = [
  srcJsPath+'/**/*.js'
].concat(gulpConfig.js.include);

var cssGlobs = [
  srcCssPath + '/**/*.css',
  srcCssPath + '/**/*.scss',

].concat(gulpConfig.css.include);

var imagesGlobs = [
  srcImagesPath + '/**/*.*'
];

/*
  @todo feature flag
  sass
*/

// functions

//获得需要导入的css文件
function getImportCssFiles(){
  return gulp.src(gulpConfig.css.include);
}

//获得需要导入的js文件
function getImportJsFiles(){
  return gulp.src(gulpConfig.js.include);
}

//将js文件生成到目标目录
function buildJsFiles(stream, basePath){
  if(basePath === undefined)
  {
    basePath = targetJsPath;
  }
  return stream.pipe(gulp.dest(basePath));
}

//将css文件生成到目标目录
function buildCssFiles(stream, basePath){
  if(basePath === undefined)
  {
    basePath = targetCssPath;
  }
  return stream.pipe(gulp.dest(basePath));
}

function buildHtmlFiles(stream, basePath){
  if(basePath === undefined)
  {
    basePath = targetHtmlPath;
  }
  return stream.pipe($.fileInclude()).pipe(gulp.dest(basePath));
}

//tasks
//@todo 给所有的任务增加缓存
gulp.task('default', function(){
  console.log(cssGlobs);
});


gulp.task('clean', function(){
  var globs = [
    targetJsPath,
    targetCssPath,
    targetImagesPath
  ].concat([
    targetHtmlPath + '/**/*.php',
    targetHtmlPath + '/**/*.htm',
    targetHtmlPath + '/**/*.html',
  ]);
  console.log(globs);
  return gulp.src(globs).pipe($.clean());
});

//发布js
gulp.task('publish-js', function(){
  var stream = eventStream.merge(gulp.src(jsGlobs), getImportJsFiles());
  stream.pipe($.print());
  buildJsFiles(stream);
});

//发布css
gulp.task('publish-css', function () {
  var stream = gulp.src(cssGlobs).pipe($.sass());
  stream.pipe($.print());
  buildCssFiles(stream);
});

//publish images
gulp.task('publish-images',function(){
  var stream = gulp.src(imagesGlobs);
  stream.pipe($.print());
  stream.pipe(gulp.dest(targetImagesPath));
});

//@todo 发布HTML
gulp.task('publish-html', function(){
  var stream = gulp.src(htmlGlobs);
  stream.pipe($.print());

  buildHtmlFiles(stream);
});

gulp.task('publish', ['clean'], function(){
  gulp.run('publish-js', 'publish-css', 'publish-html', 'publish-images');
});

//assets watch
// @todo cached
gulp.task('fe-watch', function(){
  //js
  gulp.watch(jsGlobs, ['publish-js']);

  //css
  gulp.watch(cssGlobs, ['publish-css']);

  //images
  gulp.watch(imagesGlobs, ['publish-images']);

  // @todo html
  gulp.watch(htmlGlobs, ['publish-html']);

});

// browser sync
gulp.task('server', function(){
  gulp.run('fe-watch');

  browserSync({
    server: {baseDir: gulpConfig.targetBasePath}
  });
  gulp.watch(gulpConfig.srcBasePath+['/**/*.*'], {cwd: './'}, reload);
});
