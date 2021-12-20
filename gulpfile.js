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

function perform_patches() {
    const FileTypeDeClarationPath = './node_modules/file-type/core.d.ts';

    if (fs.existsSync(FileTypeDeClarationPath)) {
        const patched = fs.readFileSync(FileTypeDeClarationPath)
            .toString() // Our TypeScript version is too old that doesn't support ReadOnly type
            .replace('readonly core.MimeType[]', 'core.MimeType[]');
        fs.writeFileSync(FileTypeDeClarationPath, patched);
    }
}

function compile_ts() {
    perform_patches();

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
    gulp.watch('src/**/*.ts', gulp.series(lint_ts, compile_ts));
    gulp.watch('package.json', gulp.series(update_ts_definition_version, ts_definition_module_files));
}

const compile = gulp.series(clean_generated, lint_ts, compile_ts, update_ts_definition_version, ts_definition_module_files);

gulp.task('bundle', bundle_sdk);

gulp.task('clean', clean_generated);

gulp.task('compile', compile);

gulp.task('default', gulp.series(compile, watch));

gulp.task('pack', gulp.series(clean_generated, lint_ts, compile_ts, shell.task([
    'npm pack'
])));

gulp.task('publish', gulp.series(clean_generated, lint_ts, compile_ts, bundle_sdk, shell.task([
    'npm publish --access public && npm pack'
], [
    'cd definition && npm publish --access public && npm pack'
])));

gulp.task('publish-beta', gulp.series(clean_generated, lint_ts, compile_ts, bundle_sdk, shell.task([
    'npm publish --access public --tag beta'
])));

gulp.task('publish-alpha', gulp.series(clean_generated, lint_ts, compile_ts, bundle_sdk, shell.task([
    'npm publish --access public --tag alpha'
])));
