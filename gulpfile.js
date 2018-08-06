const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const shell = require('gulp-shell');
const bump = require('gulp-bump');
const fs = require('fs');

const tsp = tsc.createProject('tsconfig.json');

// Remove the tests include from the project
const testIndex = tsp.config.include.indexOf('tests');
if (testIndex > -1) {
    tsp.config.include.splice(testIndex, 1);
}

gulp.task('clean-generated', function _cleanTypescript() {
    return del(['./server', './client', './definition']);
});

gulp.task('lint-ts', function _lintTypescript() {
    return tsp.src().pipe(tslint({ formatter: 'verbose' })).pipe(tslint.report());
});

gulp.task('compile-ts', ['ts-definition-module-files', 'update-ts-definition-version'], function _compileTypescript() {
    return tsp.src().pipe(sourcemaps.init())
            .pipe(tsp())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('.'));
});

gulp.task('update-ts-definition-version', function _updateTsDefinitionVersion() {
    const { version } = JSON.parse(fs.readFileSync('./package.json'));

    return gulp.src('src/definition/package.json')
            .pipe(bump({ version }))
            .pipe(gulp.dest('src/definition/'));
});

//Tasks for getting it ready and publishing
gulp.task('ts-definition-module-files', function _npmFileGathering() {
    return gulp.src(['LICENSE', 'src/definition/README.md', 'src/definition/package.json'])
            .pipe(gulp.dest('definition'));
});

gulp.task('compile', ['clean-generated', 'lint-ts', 'compile-ts']);

gulp.task('default', ['compile'], function() {
    gulp.watch('src/**/*.ts', ['lint-ts', 'compile-ts']);
});

gulp.task('pack', ['clean-generated', 'lint-ts', 'compile-ts'], shell.task([
    'npm pack'
]));

gulp.task('publish', ['clean-generated', 'lint-ts', 'compile-ts'], shell.task([
    'npm publish --access public && npm pack'
], [
    'cd definition && npm publish --access public && npm pack'
]));
