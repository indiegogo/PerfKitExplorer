var gulp = require('gulp');

try {
  var closureCompiler = require('gulp-closure-compiler');
  var minifyHtml = require('gulp-minify-html');
  var ngHtml2Js = require('gulp-ng-html2js');
  var concat = require('gulp-concat');
  var uglify = require('gulp-uglify');
  var flatten = require('gulp-flatten');
} catch (e) {
  console.log(e.stack);
  console.error('Required module not found. Please re-run "npm install".');
  process.exit(1);
}


var jsSourceFiles = [
      'client/**/*.js', '!client/**/*_test.js', '!client/karma.conf.js',
      'lib/closure-library/closure/goog/**/*.js',
      '!lib/closure-library/closure/goog/**/*_test.js'];

gulp.task('default', ['prod']);

gulp.task('third_party', function() {
  gulp.src('third_party/py/**/*.*')
    .pipe(gulp.dest('deploy/server/third_party'));

  gulp.src('node_modules/angular/angular.min.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('node_modules/angular-animate/angular-animate.min.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('node_modules/angular-aria/angular-aria.min.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('node_modules/angular-mocks/angular-mocks.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('node_modules/angular-material/angular-material.min.*')
    .pipe(gulp.dest('deploy/client/third_party/angular-material'));

  gulp.src('node_modules/angular-ui-router/release/angular-ui-router.min.js')
    .pipe(gulp.dest('deploy/client/third_party/angular-ui-router'));

  gulp.src('node_modules/jquery/dist/jquery.min.*')
    .pipe(gulp.dest('deploy/client/third_party/jquery'));

  gulp.src('third_party/js/uiGrid/ui-grid.*')
    .pipe(gulp.dest('deploy/client/third_party/ui-grid'));
});

gulp.task('common', ['third_party'], function() {
  gulp.src(['*.yaml', '*.py'])
    .pipe(gulp.dest('deploy'));

  gulp.src('config/*.json')
    .pipe(gulp.dest('deploy/config'));

  gulp.src('server/**/*.py')
    .pipe(gulp.dest('deploy/server'));

  gulp.src('client/**/*.json')
    .pipe(gulp.dest('deploy/client'));

  gulp.src('client/**/*.css')
    .pipe(concat('perfkit_styles.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('test', ['common'], function() {

  gulp.src(jsSourceFiles)
    .pipe(closureCompiler({
      compilerPath: 'bin/closure-compiler.jar',
      fileName: 'client/perfkit_scripts.js',
      compilerFlags: {
        angular_pass: true,
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        formatting: 'PRETTY_PRINT',
        manage_closure_dependencies: true,
        only_closure_dependencies: true,
        process_closure_primitives: true,
        closure_entry_point: 'p3rf.perfkit.explorer.application.module'
      }
    }))
    .pipe(gulp.dest('deploy'));

  gulp.src('server/**/*.html')
    .pipe(gulp.dest('deploy/server'));

  gulp.src('client/**/*.html')
    .pipe(ngHtml2Js({
        moduleName: 'p3rf.perfkit.explorer.templates',
        prefix: '/static/'
    }))
    .pipe(concat('perfkit_templates.js'))
    .pipe(gulp.dest('deploy/client'));
});


gulp.task('prod', ['common'], function() {

  gulp.src(jsSourceFiles)
    .pipe(closureCompiler({
      compilerPath: 'bin/closure-compiler.jar',
      fileName: 'build/perfkit_scripts.js',
      compilerFlags: {
        angular_pass: true,
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        manage_closure_dependencies: true,
        only_closure_dependencies: true,
        process_closure_primitives: true,
        closure_entry_point: 'p3rf.perfkit.explorer.application.module'
      }
    }))
    .pipe(flatten())
    .pipe(gulp.dest('deploy/client'));

  gulp.src('server/**/*.html')
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(gulp.dest('deploy/server'));

  gulp.src('client/**/*.html')
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(ngHtml2Js({
        moduleName: 'p3rf.perfkit.explorer.templates',
        prefix: '/static/'
    }))
    .pipe(concat('perfkit_templates.js'))
    .pipe(uglify())
    .pipe(gulp.dest('deploy/client'));
});