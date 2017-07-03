const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsc = require('gulp-typescript');
const shell = require('gulp-shell');
const spawn = require('child_process').spawn;

const tsp = tsc.createProject('tsconfig.json');

gulp.task('clean-generated', function _cleanTypescript() {
    const distFiles = ['./dist/**/*.*'];
    return del(distFiles);
});

gulp.task('compile-ts', ['clean-generated'], function _compileTypescript() {
    return tsp.src().pipe(sourcemaps.init())
            .pipe(tsp())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));
});

let server;
gulp.task('run-server', ['compile-ts'], function _runTheServer() {
    if (server) server.kill();

    server = spawn('node', ['server.js'], { stdio: 'inherit' });
    server.on('close', (code) => {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes....');
        }
    });
});

process.on('exit', () => {
    if (server) server.kill();
});

gulp.task('defult', ['compile-ts', 'run-server'], function _watchCodeAndRun() {
    gulp.watch('src/**/*.ts', ['compile-ts', 'run-server']);
});

//Tasks for getting it ready and publishing
gulp.task('npm-files', function _npmFileGathering() {
    return gulp.src(['README.md', 'LICENSE', 'package.json']).pipe(gulp.dest('dist'));
});

gulp.task('pack', ['clean-generated', 'compile-ts', 'npm-files'], shell.task([
    'cd dist && npm pack'
]));

gulp.task('publish', ['clean-generated', 'compile-ts', 'npm-files'], shell.task([
    'cd dist && npm publish && npm pack'
]));
