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

// Tasks for bundling AppsEngineUIClient SDK
const bundle_sdk = shell.task([
    `echo "window.AppsEngineUIClient = require('./AppsEngineUIClient').AppsEngineUIClient;" > client/glue.js`,
    'cd client && npx browserify glue.js | npx uglifyjs > AppsEngineUIClient.min.js'
]);

function clean_generated() {
    return del(['./server', './client', './definition']);
}

function lint_ts() {
    return tsp.src().pipe(tslint({ formatter: 'verbose' })).pipe(tslint.report());
}

function compile_ts() {
    return tsp.src().pipe(sourcemaps.init())
            .pipe(tsp())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('.'));
}

function update_ts_definition_version() {
    const { version } = JSON.parse(fs.readFileSync('./package.json'));

    return gulp.src('src/definition/package.json')
            .pipe(bump({ version }))
            .pipe(gulp.dest('src/definition/'));
}

//Tasks for getting it ready and publishing
function ts_definition_module_files() {
    return gulp.src(['LICENSE', 'src/definition/package.json'])
            .pipe(gulp.dest('definition/'));
}

function watch() {
    gulp.watch('src/**/*.ts', gulp.series(compile_ts));
}

const compile = gulp.series(clean_generated, compile_ts, update_ts_definition_version, ts_definition_module_files);

gulp.task('bundle', bundle_sdk);

gulp.task('clean', clean_generated);

gulp.task('compile', gulp.series(compile));

gulp.task('default', gulp.series(compile, watch));

gulp.task('pack', gulp.series(lint_ts, compile, shell.task([
    'npm pack'
])));

gulp.task('publish', gulp.series(lint_ts, compile, bundle_sdk, shell.task([
    'npm publish --access public && npm pack'
], [
    'cd definition && npm publish --access public && npm pack'
])));

gulp.task('publish-beta', gulp.series(lint_ts, compile, bundle_sdk, shell.task([
    'npm publish --access public --tag beta'
])));

gulp.task('publish-alpha', gulp.series(lint_ts, compile, bundle_sdk, shell.task([
    'npm publish --access public --tag alpha'
])));

gulp.task('publish-videoconf', gulp.series(lint_ts, compile, bundle_sdk, shell.task([
    'npm publish --access public --tag videoconf'
])));
