﻿(function (module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp-help')(require('gulp')),
        // common gulp
            watch = require('gulp-watch'),
            concat = require('gulp-concat'),
            inject = require("gulp-inject"),
            debug = require('gulp-debug'),
            rename = require('gulp-rename'),
            rev = require('gulp-rev'),
        // stream
            addStream = require('add-stream'),
            runSequence = require('run-sequence'),
        // img
            imagemin = require('gulp-imagemin'),
        // js
            eslint = require('gulp-eslint'),
            uglify = require('gulp-uglify'),
            ngAnnotate = require('gulp-ng-annotate'),
        // css
            less = require('gulp-less'),
            minCss = require('gulp-minify-css'),
            autoprefixer = require('gulp-autoprefixer'),
        // template
            header = require('gulp-header'),
            footer = require('gulp-footer'),
            beautify = require('gulp-beautify'),
            ngHtml2js = require('gulp-ng-html2js'),
            minifyHtml = require('gulp-minify-html'),
        // others
            del = require('del'),
            path = require('path'),
            utils = require('./gulp.utils')(parameters),
            browserSync = require('browser-sync').create();

        /**
         * @description Build tasks : Merge all the files of the application and dependencies to the dist folder and
         * reference them in the index.html.
         */
        gulp.task('build', 'Build the entire application in the dist folder.', [], function (callback) {
            runSequence(
                'clean',
                [
                    'merge-js-files-to-dist',
                    'merge-template-files-to-dist',
                    'merge-css-files-to-dist',
                    'merge-libraries-to-dist',
                    'copy-images-to-dist'
                ],
                'reference-dist-files-to-index',
                callback);
        });
        gulp.task('build-w', 'Build the entire application in the dist folder and watch changes.', ['build'], function () {
            browserSync.init({
                server: {
                    baseDir: parameters.distFolderPath
                }
            });

            watchAndRefreshWithBrowserSync(parameters.jsFiles, ['merge-js-files-to-dist']);
            watchAndRefreshWithBrowserSync(parameters.htmlTemplateFiles, ['merge-template-files-to-dist']);
            watchAndRefreshWithBrowserSync(parameters.cssFiles.concat(parameters.lessFiles), ['merge-css-files-to-dist']);
            watchAndRefreshWithBrowserSync(parameters.startupFile, ['reference-dist-files-to-index']);
            watchAndRefreshWithBrowserSync(parameters.imgFiles, ['copy-images-to-dist']);

        });
        gulp.task('build-min', 'Build the entire minified application in the dist folder.', [], function (callback) {
            runSequence(
                'clean',
                [
                    'merge-minify-js-files-to-dist',
                    'merge-minify-template-files-to-dist',
                    'merge-minify-css-files-to-dist',
                    'merge-minify-libraries-to-dist',
                    'copy-images-to-dist'
                ],
                'reference-dist-files-to-index',
                callback);
        });
        gulp.task('build-min-w', 'Build the entire minified application in the dist folder and watch changes.', ['build-min'], function () {
            browserSync.init({
                server: {
                    baseDir: parameters.distFolderPath
                }
            });

            watchAndRefreshWithBrowserSync(parameters.jsFiles, ['merge-minify-js-files-to-dist']);
            watchAndRefreshWithBrowserSync(parameters.htmlTemplateFiles, ['merge-minify-template-files-to-dist']);
            watchAndRefreshWithBrowserSync(parameters.cssFiles.concat(parameters.lessFiles), ['merge-minify-css-files-to-dist']);
            watchAndRefreshWithBrowserSync(parameters.startupFile, ['reference-dist-files-to-index']);
            watchAndRefreshWithBrowserSync(parameters.imgFiles, ['copy-images-to-dist']);
        });

        var prefix = 'bs-';
        var taskNameToBrowserSyncTaskName = {};

        function watchAndRefreshWithBrowserSync(filePatterns, taskNames) {
            var browserSyncTaskNames = [];
            taskNames.forEach(function (taskName) {
                if (taskNameToBrowserSyncTaskName[taskName] === undefined) {
                    taskNameToBrowserSyncTaskName[taskName] = buildBrowserSyncTaskDecorator(taskName);
                }
                browserSyncTaskNames.push(taskNameToBrowserSyncTaskName[taskName]);
            });
            return watch(filePatterns, function() {
                gulp.start(browserSyncTaskNames);
            });
        }

        function buildBrowserSyncTaskDecorator(taskName) {
            var browserSyncTaskName = prefix + taskName;
            gulp.task(browserSyncTaskName, false, [taskName], function (callback) {
                browserSync.reload();
                callback();
            });
            return browserSyncTaskName;
        }

        /**
         * @description Clean task : Remove all files of the dist folder.
         */
        gulp.task('clean', 'Clean the dist folder.', [], function () {
            return del(parameters.distFolderPath + '/*');
        });

        /**
         * @description Javascript tasks : Aggregate all the javascript files of the application to a single file
         * in the dist folder.
         */
        gulp.task('merge-js-files-to-dist', false, [], function () {
            // Merge javascript application files in a single one to the dist folder.
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withAutomaticDependencyNamesInjection()
                .build();
        }, {aliases: ['js']});
        gulp.task('merge-minify-js-files-to-dist', false, [], function () {
            // Merge and minify javascript application files in a single one to the dist folder.
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withAutomaticDependencyNamesInjection()
                .withMinification()
                .build();
        }, {aliases: ['js-min']});

        function JavascriptFileAggregationTaskBuilder() {
            var self = this;

            self.withSyntaxValidation = function () {
                self.shouldValidateSyntax = true;
                return self;
            };

            self.withMinification = function () {
                self.shouldMinifyJs = true;
                return self;
            };

            self.withAutomaticDependencyNamesInjection = function () {
                self.shouldInjectDependencyNamesInAngularFunction = true;
                return self;
            };

            self.withRevision = function () {
                self.shouldReviseVersion = true;
                return self;
            };

            self.build = function () {
                var jsFilesToBuild = []
                    .concat(parameters.jsFiles)
                    .concat(concatForeach('!', parameters.jsSpecFiles));

                var process = gulp.src(jsFilesToBuild);

                if (self.shouldInjectDependencyNamesInAngularFunction) {
                    process = process.pipe(ngAnnotate({
                        add: true,
                        single_quotes: true
                    }));
                }

                if (self.shouldValidateSyntax) {
                    process = process
                        .pipe(eslint())
                        .pipe(eslint.format())
                        .pipe(eslint.failAfterError());
                }

                if (self.shouldMinifyJs) {
                    process = process
                        .pipe(concat(parameters.applicationFileName + '.min.js'))
                        .pipe(uglify());
                }
                else {
                    process = process
                        .pipe(concat(parameters.applicationFileName + '.js'));
                }

                if (self.shouldReviseVersion) {
                    process = process.pipe(rev());
                }

                return process.pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        /**
         * @description Template tasks : Aggregate all the html template files of the application (controller + directive)
         * to a single file in the dist folder.
         */
        gulp.task('merge-template-files-to-dist', false, [], function () {
            return new TemplateFileAggregationTaskBuilder().build();
        }, {aliases: ['template']});
        gulp.task('merge-minify-template-files-to-dist', false, [], function () {
            return new TemplateFileAggregationTaskBuilder()
                .withMinification()
                .build();
        }, {aliases: ['template-min']});

        function TemplateFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyCode = true;
                return self;
            };

            self.withRevision = function () {
                self.shouldReviseVersion = true;
                return self;
            };

            self.build = function () {
                var headerStr = '(function(angular){\'use strict\';angular.module(\'${moduleName}\', []).run(processTemplates);processTemplates.$inject = [\'$templateCache\'];function processTemplates($templateCache){';
                var footerStr = '}})(window.angular);\r\n';

                var process = gulp
                    .src(parameters.htmlTemplateFiles)
                    .pipe(minifyHtml({}))
                    .pipe(ngHtml2js({
                        moduleName: parameters.templateModuleName,
                        template: '$templateCache.put(\'<%= template.url %>\',\'<%= template.escapedContent %>\');'
                    }))
                    .pipe(concat('temp'))
                    .pipe(header(headerStr, {moduleName: parameters.templateModuleName}))
                    .pipe(footer(footerStr));

                if (self.shouldMinifyCode) {
                    process = process
                        .pipe(uglify())
                        .pipe(rename(parameters.templateFileName + '.min.js'));
                }
                else {
                    process = process
                        .pipe(beautify())
                        .pipe(rename(parameters.templateFileName + '.js'));
                }

                if (self.shouldReviseVersion) {
                    process = process.pipe(rev());
                }

                return process
                    .pipe(gulp.dest(parameters.distFolderPath));
            }
        }

        /**
         * @description Style tasks : Aggregate all the css files of the application to a single file
         * in the dist folder.
         */
        gulp.task('merge-css-files-to-dist', false, [], function () {
            // Merge the application css files in a single one to the dist folder.
            return new CssFileAggregationTaskBuilder().build();
        }, {aliases: ['css']});
        gulp.task('merge-minify-css-files-to-dist', false, [], function () {
            // Merge and minify the application css files in a single one to the dist folder
            return new CssFileAggregationTaskBuilder()
                .withMinification()
                .build();
        }, {aliases: ['css-min']});

        function CssFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyJs = true;
                return this;
            };

            self.withRevision = function () {
                self.shouldReviseVersion = true;
                return self;
            };

            self.build = function () {
                var process = gulp
                    .src(parameters.cssFiles)
                    .pipe(addStream.obj(
                        gulp.src(parameters.lessFiles)
                            .pipe(less()))
                    )
                    .pipe(autoprefixer({
                        browsers: ['last 2 versions']
                    }));

                if (self.shouldMinifyJs) {
                    process = process
                        .pipe(concat(parameters.applicationFileName + '.min.css'))
                        .pipe(minCss());
                }
                else {
                    process = process
                        .pipe(concat(parameters.applicationFileName + '.css'));
                }
                if (self.shouldReviseVersion) {
                    process = process.pipe(rev());
                }
                return process.pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        /**
         * @description Dependency tasks : Aggregate all the javascript files of bower dependencies to a single
         * file and all the css files of bower dependencies in another single file. Both are copied to the
         * dist folder.
         */
        gulp.task('merge-js-libraries-to-dist', false, [], function () {
            // Merge the library javascript files in a single one to the dist folder.
            return new JavascriptLibraryFileAggregationTaskBuilder().build();
        }, {aliases: ['js-dep']});
        gulp.task('merge-css-libraries-to-dist', false, [], function () {
            // Merge the library css files in a single one to the dist folder.
            return new CssLibraryFileAggregationTaskBuilder().build();
        }, {aliases: ['css-dep']});
        gulp.task('merge-minify-js-libraries-to-dist', false, [], function () {
            // Merge and minify the library javascript files in a single one to the dist folder.
            return new JavascriptLibraryFileAggregationTaskBuilder()
                .withMinification()
                .build();
        }, {aliases: ['js-dep-min']});
        gulp.task('merge-minify-css-libraries-to-dist', false, [], function () {
            // Merge and minify the library css files in a single one to the dist folder.
            return new CssLibraryFileAggregationTaskBuilder()
                .withMinification()
                .build();
        }, {aliases: ['css-dep-min']});
        gulp.task('merge-libraries-to-dist', false, ['merge-js-libraries-to-dist', 'merge-css-libraries-to-dist'], null, {aliases: ['dep']});
        gulp.task('merge-minify-libraries-to-dist', false, ['merge-minify-js-libraries-to-dist', 'merge-minify-css-libraries-to-dist'], null, {aliases: ['dep-min']});

        function JavascriptLibraryFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyJs = true;
                return this;
            };

            self.withRevision = function () {
                self.shouldReviseVersion = true;
                return self;
            };

            self.build = function () {
                var jsProcess = gulp.src(utils.bower.getJsLibraries({devDependencies: false, dependencies: true}));
                if (self.shouldMinifyJs) {
                    jsProcess = jsProcess
                        .pipe(concat(parameters.libraryFileName + '.min.js'))
                        .pipe(uglify());
                }
                else {
                    jsProcess = jsProcess
                        .pipe(concat(parameters.libraryFileName + '.js'));
                }
                if (self.shouldReviseVersion) {
                    jsProcess = jsProcess.pipe(rev());
                }
                return jsProcess
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        function CssLibraryFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyJs = true;
                return this;
            };

            self.withRevision = function () {
                self.shouldReviseVersion = true;
                return self;
            };

            self.build = function () {
                var cssProcess = gulp
                    .src(utils.bower.getCssLibraries({devDependencies: false, dependencies: true}))
                    .pipe(addStream.obj(
                        gulp.src(utils.bower.getLessLibraries({devDependencies: false, dependencies: true}))
                            .pipe(less()))
                    );

                if (self.shouldMinifyJs) {
                    cssProcess = cssProcess
                        .pipe(concat(parameters.libraryFileName + '.min.css'))
                        .pipe(minCss());
                }
                else {
                    cssProcess = cssProcess
                        .pipe(concat(parameters.libraryFileName + '.css'));
                }
                if (self.shouldReviseVersion) {
                    cssProcess = cssProcess.pipe(rev());
                }
                return cssProcess
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        /**
         * @description Reference tasks : Reference the javascript and style files of the application and libraries
         * in the index.html
         */
        gulp.task('reference-dist-files-to-index', false, [], function () {
            // Copy the root html file to the dist folder and inject built dependencies.
            return new ReferenceAggregatedFilesTaskBuilder().build();
        }, {aliases: ['ref']});

        function ReferenceAggregatedFilesTaskBuilder() {
            var self = this;

            self.build = function () {
                var files = [
                    path.join(parameters.distFolderPath, 'libraries*js'),
                    path.join(parameters.distFolderPath, 'libraries*css'),
                    path.join(parameters.distFolderPath, 'application*js'),
                    path.join(parameters.distFolderPath, 'application*css'),
                    path.join(parameters.distFolderPath, 'templates*js')
                ];
                var filesToReference = gulp.src(files, {read: false});
                return gulp
                    .src(parameters.startupFile)
                    .pipe(gulp.dest(parameters.distFolderPath))
                    .pipe(inject(filesToReference, {addRootSlash: false, relative: true}))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        /**
         * @description Copy images : Copy all images in the dist folder.
         */
        gulp.task('copy-images-to-dist', false, [], function () {
            return gulp.src(parameters.imgFiles)
                .pipe(imagemin({optimizationLevel: 5}))
                .pipe(gulp.dest(path.join(parameters.distFolderPath, 'img')));
        }, {aliases: ['img']});

        // ----- Utils
        function concatForeach(character, array) {
            var results = [];
            array.forEach(function (path) {
                results.push(character + path);
            });
            return results;
        }
    }

}(module, require));