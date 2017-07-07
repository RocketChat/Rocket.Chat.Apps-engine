const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const gReplace = require('gulp-replace');
const gutil = require('gulp-util');
const shell = require('gulp-shell');
const spawn = require('child_process').spawn;

const tsp = tsc.createProject('tsconfig.json');

gulp.task('clean-generated', function _cleanTypescript() {
    return del(['./dist/**', './dev-dist/**']);
});

gulp.task('lint-ts', function _lintTypescript() {
    return tsp.src().pipe(tslint({ formatter: 'verbose' })).pipe(tslint.report());
});

gulp.task('lint-dev-ts', function _lintDevTypescript() {
    const project = tsc.createProject('dev/tsconfig.json');

    return project.src().pipe(tslint({ formatter: 'verbose' })).pipe(tslint.report());
});

gulp.task('compile-ts', ['clean-generated'], function _compileTypescript() {
    return tsp.src().pipe(sourcemaps.init())
            .pipe(tsp())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));
});

gulp.task('compile-dev-ts', ['clean-generated', 'compile-ts'], function _compileDevTypescript() {
    const project = tsc.createProject('dev/tsconfig.json');

    return project.src()
            .pipe(sourcemaps.init())
            .pipe(gReplace('../src', '../dist'))
            .pipe(project())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dev-dist'));
});

gulp.task('run-dev', ['lint-ts', 'lint-dev-ts', 'compile-ts', 'compile-dev-ts'], function _runTheDevThing(cb) {
    const server = spawn('node', ['dev-dist/server.js']);

    server.stdout.on('data', (msg) => {
        gutil.log(gutil.colors.blue('Server:'), msg.toString().trim());

        if (msg.toString().includes('Completed the loading')) {
            cb();
        }
    });

    server.stderr.on('data', (msg) => {
        gutil.log(gutil.colors.blue('Server:'), msg.toString().trim());
    });

    server.on('close', (code) => {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes....');
        }
    });
});

gulp.task('default', ['clean-generated', 'lint-ts', 'lint-dev-ts', 'compile-ts', 'compile-dev-ts', 'run-dev'], function _watchAndRun() {
    return gulp.watch(['src/**/*.ts', 'dev/**/*.ts'], ['clean-generated', 'lint-ts', 'lint-dev-ts', 'compile-ts', 'compile-dev-ts', 'run-dev']);
});

//Tasks for getting it ready and publishing
gulp.task('npm-files', ['clean-generated'], function _npmFileGathering() {
    return gulp.src(['README.md', 'LICENSE', 'package.json']).pipe(gulp.dest('dist'));
});

gulp.task('pack', ['clean-generated', 'lint-ts', 'compile-ts', 'npm-files'], shell.task([
    'cd dist && npm pack'
]));

gulp.task('publish', ['clean-generated', 'lint-ts', 'compile-ts', 'npm-files'], shell.task([
    'cd dist && npm publish && npm pack'
]));
