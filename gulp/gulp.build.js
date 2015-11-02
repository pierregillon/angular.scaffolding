(function (module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp'),
            concat = require('gulp-concat'),
            cssmin = require('gulp-cssmin'),
            uglify = require('gulp-uglify'),
            inject = require("gulp-inject"),
            debug = require("gulp-debug"),
            wiredep = require('wiredep'),
            help = require('gulp-task-listing'),
            minifyHtml = require("gulp-minify-html"),
            runSequence = require('run-sequence'),
            streamqueue = require('streamqueue'),
            del = require('del'),
            path = require('path');

        // ----- Javascript : Creation of a single file with all the javascript application.
        gulp.task('js', function () {
            var jsFilesToBuild = []
                .concat(parameters.jsFiles)
                .concat(parameters.jsStartupFiles)
                .concat(concatForeach('!', parameters.jsTestFiles));
            return gulp
                .src(jsFilesToBuild)
                .pipe(concat(parameters.distFileName + '.js'))
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('js-min', function () {
            var jsFilesToBuild = []
                .concat(parameters.jsFiles)
                .concat(parameters.jsStartupFiles)
                .concat(concatForeach('!', parameters.jsTestFiles));
            return gulp
                .src(jsFilesToBuild)
                .pipe(concat(parameters.distFileName + '.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest(parameters.distFolderPath));
        });

        // ----- Html
        gulp.task('html', function () {
            var htmlFilesToBuild = []
                .concat(parameters.viewFiles)
                .concat(parameters.indexLocation);
            return gulp
                .src(htmlFilesToBuild)
                .pipe(gulp.dest(parameters.distFolderPath + '/templates'));
        });
        gulp.task('html-min', function () {
            var htmlFilesToBuild = []
                .concat(parameters.viewFiles)
                .concat(parameters.indexLocation);
            return gulp
                .src(htmlFilesToBuild)
                .pipe(minifyHtml({
                    empty: true,
                    spare: true,
                    quotes: true
                }))
                .pipe(gulp.dest(parameters.distFolderPath + '/templates'));
        });

        // ----- Styles : Creation of a single file with all the css of the application.
        gulp.task('css', function () {
            return gulp
                .src([parameters.cssFiles, '!' + parameters.minCssFiles])
                .pipe(concat(parameters.distFileName + '.css'))
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('css-min', function () {
            return gulp
                .src([parameters.cssFiles, '!' + parameters.minCssFiles])
                .pipe(cssmin())
                .pipe(concat(parameters.distFileName + '.min.css'))
                .pipe(gulp.dest(parameters.distFolderPath));
        });

        // ----- Dependencies : Creation of a single file with all the bower dependencies (js / css).
        gulp.task('dep', function () {
            var js = gulp
                .src(getJsBowerDependencies())
                .pipe(concat(parameters.libraryFileName + '.js'));

            var css = gulp
                .src(getCssBowerDependencies())
                .pipe(concat(parameters.libraryFileName + '.css'));

            return streamqueue({objectMode: true}, js, css)
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('dep-min', function () {
            var js = gulp
                .src(getJsBowerDependencies())
                .pipe(uglify())
                .pipe(concat(parameters.libraryFileName + '.min.js'));

            var css = gulp
                .src(getCssBowerDependencies())
                .pipe(cssmin())
                .pipe(concat(parameters.libraryFileName + '.min.css'));

            return streamqueue({objectMode: true}, js, css)
                .pipe(gulp.dest(parameters.distFolderPath));
        });

        // ----- Link : Reference the javascript, style and library files in the index.html.
        gulp.task('link', function () {
            var filesToLink = gulp.src([
                path.join(parameters.distFolderPath, parameters.libraryFileName + '.js'),
                path.join(parameters.distFolderPath, parameters.libraryFileName + '.css'),
                path.join(parameters.distFolderPath, parameters.distFileName + '.css'),
                path.join(parameters.distFolderPath, parameters.distFileName + '.js')
            ], {read: false});

            return gulp
                .src(parameters.indexLocation)
                .pipe(gulp.dest(parameters.distFolderPath))
                .pipe(inject(filesToLink, {addRootSlash: false, relative: true}))
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('link-min', function () {
            var filesToLink = gulp.src([
                path.join(parameters.distFolderPath, parameters.libraryFileName + '.min.js'),
                path.join(parameters.distFolderPath, parameters.distFileName + '.min.js'),
                path.join(parameters.distFolderPath, parameters.libraryFileName + '.min.css'),
                path.join(parameters.distFolderPath, parameters.distFileName + '.min.css')
            ], {read: false});

            return gulp
                .src(parameters.indexLocation)
                .pipe(gulp.dest(parameters.distFolderPath))
                .pipe(inject(filesToLink, {addRootSlash: false, relative: true}))
                .pipe(gulp.dest(parameters.distFolderPath));
        });

        // ----- Clean : Remove all files in the dist folder.
        gulp.task('clean', function () {
            return del(parameters.distFolderPath + '/*');
        });

        // ----- Help
        gulp.task('help', help);

        // ----- Global build
        gulp.task('build', function (callback) {
            runSequence('clean', 'js', 'css', 'dep', 'html', 'link', callback);
        });
        gulp.task('build-w', ['build'], function () {
            gulp.watch([parameters.jsFiles, parameters.jsStartupFiles], ['js']);
            gulp.watch([parameters.viewFiles], ['html']);
            gulp.watch([parameters.cssFiles], ['css']);
            gulp.watch([parameters.indexLocation], ['link']);
        });
        gulp.task('build-min', function (callback) {
            runSequence('clean', 'js-min', 'css-min', 'dep-min', 'html-min', 'link-min', callback);
        });
        gulp.task('build-min-w', ['build-min'], function () {
            gulp.watch([parameters.jsFiles], ['js-min']);
            gulp.watch([parameters.viewFiles], ['html-min']);
            gulp.watch([parameters.cssFiles], ['css-min']);
            gulp.watch([parameters.indexLocation], ['link-min']);
        });

        // ----- Utils
        function getJsBowerDependencies() {
            return getBowerDependencies(wiredep().js);
        }

        function getCssBowerDependencies() {
            return getBowerDependencies(wiredep().css);
        }

        function getBowerDependencies(values) {
            var dependencies = [];
            if (values) {
                values.forEach(function (dependency) {
                    var index = dependency.indexOf('bower_components');
                    var wellFormattedDependency = dependency.substr(index, dependency.length - index).split("\\").join('/');
                    dependencies.push(wellFormattedDependency);
                });
            }
            return dependencies;
        }

        function concatForeach(character, array) {
            var results = [];
            array.forEach(function (path) {
                results.push(character + path);
            });
            return results;
        }
    };

}(module, require))