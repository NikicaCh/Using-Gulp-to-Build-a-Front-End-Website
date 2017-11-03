"use strict";

//Require the dependencies 
const        gulp = require("gulp"),
           concat = require("gulp-concat"),
           uglify = require("gulp-uglify"),
             sass = require("gulp-sass"),
             maps = require("gulp-sourcemaps"),
           rename = require("gulp-rename"),
        minifyCss = require("gulp-clean-css"),
            image = require("gulp-image"),
          connect = require("gulp-connect"),
              del = require("del");

//Task to concat scripts into one js file
gulp.task('concatScripts', function() {
    return gulp.src([
            'js/global.js',
            'js/circle/circle.js',
            'js/circle/autogrow.js'
            ]).pipe(concat('app.js'))
              .pipe(gulp.dest("js"));
});

//Task to minify script, create a map and place it in the dist/scripts folder
gulp.task('minifyScripts', function() {
    return gulp.src([
        'js/app.js'
           ]).pipe(maps.init())
             .pipe(uglify())
             .pipe(rename('all.min.js'))
             .pipe(maps.write('./'))
             .pipe(gulp.dest('dist/scripts'));
});
//Task to concat all style files in to one
gulp.task('concatStyles', function() {
    return gulp.src([
         'sass/**/*.scss'
           ]).pipe(concat('all.css'))
             .pipe(sass())
             .pipe(gulp.dest('sass'));
});
//Taks to minify the style file, create a map and place it in the dist/styles folder
gulp.task('minifyStyles', function() {
    return gulp.src([
        'sass/all.css'
            ]).pipe(maps.init())
              .pipe(minifyCss())
              .pipe(rename('all.min.css'))
              .pipe(maps.write('./'))
              .pipe(gulp.dest('dist/styles'));
});
//Task to optimize the images and place them in the dist/content folder
gulp.task('images', function() {
    return gulp.src([
        'images/**.*'
        ]).pipe(image())
          .pipe(gulp.dest('dist/content'));
});

gulp.task('connect', ['styles'], function() {
    connect.server({
      root: './',
      port: 3000,
      livereload: true
    });
});


//Task that first runs concatScripts task as a depencencie and then runs minifyScripts task
gulp.task('scripts', ['concatScripts'], function() {
    return gulp.start('minifyScripts');
});
//Task that first runs concatStyles and then minifyStyles task
gulp.task('styles', ['concatStyles'], function() {
    return gulp.start('minifyStyles');
});
//Deletes all the content from the dist folder
gulp.task('clean', function() {
    return del(['dist/**/*.*', 'dist/*']);
});
//Task that watches for any changes in the .scss and .sass files, if there is a change styles task is run 
gulp.task('watchFiles', function() {
    return gulp.watch('sass/**/*.s*', ['reload']);
});
gulp.task('reload', ['styles'], function () {
    return gulp.src('./index.html')
      .pipe(connect.reload());
  });
//This task runs all the tasks abowe with the confidence the clean task will run first
gulp.task('build', ['clean'], function() {
    return gulp.start('connect', ['styles', 'scripts', 'images']);
});
//The default task whick runs the build task as a depencendie then watches for style file changes
gulp.task('default', ['build'], function() {
    return gulp.start('watchFiles');  
});



