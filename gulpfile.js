const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const pugLinter = require('gulp-pug-linter');
const htmlValidator = require('gulp-w3c-html-validator');

function browsersync() {
    browserSync.init({
        server: { baseDir: './' },
        notify: false,
        online: true
    })
}

function styles() {
    return src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .pipe(concat('style.min.css')) 
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('src/css/'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src(['src/libs/masonry.js', 'src/libs/splide/js/splide.min.js', 'src/js/scripts.js'])
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream())
}

function pug2html() {
    return src('src/pug/*.pug')
        .pipe(plumber())
        .pipe(pugLinter({ reporter: 'default' }))
        .pipe(pug({ pretty: true }))
        .pipe(htmlValidator())
        .pipe(dest('./'))
        .pipe(browserSync.stream())
}

function startwatch() {
    watch('src/scss/**/*', styles);
    watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
    watch('src/**/*.pug').on('change', pug2html);
    // watch('src/**/*.pug').on('change', browserSync.reload);
}

function cleandist() {
    return del('dist/**/*', { force: true })
}

function buildcopy() {
    return src([
        'src/css/**/*.css',
        'src/js/**/*.js',
        'src/**/*.html',
    ], { base: 'src' })
        .pipe(dest('build'))
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.pug2html = pug2html;
exports.buildcopy = buildcopy;
exports.default = parallel(styles, scripts, pug2html, browsersync, startwatch);
exports.build = series(cleandist, styles, pug2html, scripts, buildcopy);