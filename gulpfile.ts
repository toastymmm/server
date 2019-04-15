'use strict';

import gulp = require('gulp');
import rimraf = require('rimraf');
import yaml = require('js-yaml');
import path = require('path');
import fs = require('fs');
import ts = require('gulp-typescript');
import sourcemaps = require('gulp-sourcemaps')
import cp = require('child_process')

// Load settings from settings.yml
const { PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

gulp.task('clean', gulp.series(clean))

gulp.task('backend', gulp.series(typescript, copy))

gulp.task('npm install frontend', function frontend(cb) {
  cp.spawnSync('npm', ['install'], { shell: true, cwd: path.join('.', 'frontend') })
  cb()
})

gulp.task('ng build frontend', function frontend(cb) {
  cp.spawnSync('ng', ['build'], { shell: true, cwd: path.join('.', 'frontend') })
  cb()
})

gulp.task('frontend', gulp.series('npm install frontend', 'ng build frontend'))

// Build the "dist" folder by running all of the below tasks
// Sass must be run later so UnCSS can search for used classes in the others assets.
gulp.task('build', gulp.series('backend', 'frontend'))

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build'));


// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

// Compile TypeScript to JavaScript
function typescript() {
  const tsProject = ts.createProject('tsconfig.json')

  return gulp.src(PATHS.typescript)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.dist));
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.swaggerFile)
    .pipe(gulp.dest(PATHS.dist + '/server'));
}
