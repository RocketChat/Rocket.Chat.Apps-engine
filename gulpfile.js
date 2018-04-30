const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const shell = require('gulp-shell');

const tsp = tsc.createProject('tsconfig.json');

// Remove the tests include from the project
const testIndex = tsp.config.include.indexOf('tests');
if (testIndex > -1) {
    tsp.config.include.splice(testIndex, 1);
}

gulp.task('clean-generated', function _cleanTypescript() {
    return del(['./dist/**']);
});

gulp.task('lint-ts', function _lintTypescript() {
    return tsp.src().pipe(tslint({ formatter: 'verbose' })).pipe(tslint.report());
});

gulp.task('compile-ts', ['clean-generated', 'lint-ts'], function _compileTypescript() {
    return tsp.src().pipe(sourcemaps.init())
            .pipe(tsp())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean-generated', 'lint-ts', 'compile-ts']);

//Tasks for getting it ready and publishing
gulp.task('npm-files', ['clean-generated'], function _npmFileGathering() {
    return gulp.src(['README.md', 'LICENSE', 'package.json']).pipe(gulp.dest('dist'));
});

gulp.task('pack', ['clean-generated', 'lint-ts', 'compile-ts', 'npm-files'], shell.task([
    'cd dist && npm pack'
]));

gulp.task('publish', ['clean-generated', 'lint-ts', 'compile-ts', 'npm-files'], shell.task([
    'cd dist && npm publish --access public && npm pack'
]));
