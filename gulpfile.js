var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    rev         = require('gulp-rev'),
    zip = require('gulp-zip'),
    revReplace  = require("gulp-rev-replace"),
    clean = require('gulp-clean'),
    http = require('http'),
    st = require('st');
var fs = require('fs');

var json = JSON.parse(fs.readFileSync('./package.json'));

var tsProject = tsc.createProject("tsconfig.json");
var outputFolder = "build/";
var distFolder = "dist";

gulp.task("default", function () {
    return tsProject.src().pipe(tsProject())
    .js.pipe(gulp.dest(outputFolder));
});

gulp.task('server', function(done) {
    http.createServer(
      st({ path: __dirname + '/build', index: 'index.html', cache: false })
    ).listen(8888, done);
});
gulp.task("run", ['default','server'],function(){
    gulp.watch(["js/**.ts"], ["default"]);
})