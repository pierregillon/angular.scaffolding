(function (module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp-help')(require('gulp')),
            concat = require('gulp-concat'),
            cssmin = require('gulp-cssmin'),
            uglify = require('gulp-uglify'),
            inject = require("gulp-inject"),
            debug = require('gulp-debug'),
            eslint = require('gulp-eslint'),
            runSequence = require('run-sequence'),
            del = require('del'),
            path = require('path'),
            utils = require('./gulp.utils'),

            // for templates merge
            header = require('gulp-header'),
            footer = require('gulp-footer'),
            concat = require('gulp-concat'),
            beautify = require('gulp-beautify'),
            ngHtml2js = require('gulp-ng-html2js'),
            minifyHtml = require('gulp-minify-html');

        /**
         * @description Build tasks : Merge all the files of the application and dependencies to the dist folder and
         * reference them in the index.html.
         */
        gulp.task('build', 'Build the entire application in the dist folder.', [], function (callback) {
            runSequence(
                'clean',
                'merge-js-files-to-dist',
                'merge-template-files-to-dist',
                'merge-css-files-to-dist',
                'merge-libraries-to-dist',
                'reference-dist-files-to-index',
                callback);
        });
        gulp.task('build-w', 'Build the entire application in the dist folder and watch changes.', ['build'], function () {
            gulp.watch([parameters.jsFiles], ['merge-js-files-to-dist']);
            gulp.watch([parameters.viewFiles], ['merge-template-files-to-dist']);
            gulp.watch([parameters.cssFiles], ['merge-css-files-to-dist']);
            gulp.watch([parameters.indexLocation], ['reference-dist-files-to-index']);
        });
        gulp.task('build-min', 'Build the entire minified application in the dist folder.', [], function (callback) {
            runSequence(
                'clean',
                'merge-minify-js-files-to-dist',
                'merge-minify-template-files-to-dist',
                'merge-minify-css-files-to-dist',
                'merge-minify-libraries-to-dist',
                'reference-minified-dist-files-to-index',
                callback);
        });
        gulp.task('build-min-w', 'Build the entire minified application in the dist folder and watch changes.', ['build-min'], function () {
            gulp.watch([parameters.jsFiles], ['merge-minify-js-files-to-dist']);
            gulp.watch([parameters.viewFiles], ['merge-minify-template-files-to-dist']);
            gulp.watch([parameters.cssFiles], ['merge-minify-css-files-to-dist']);
            gulp.watch([parameters.indexLocation], ['reference-minified-dist-files-to-index']);
        });

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
                .withExtension('.js')
                .build();
        }, {aliases: ['js']});
        gulp.task('merge-minify-js-files-to-dist', false, [], function () {
            // Merge and minify javascript application files in a single one to the dist folder.
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withMinification()
                .withExtension('.min.js')
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

            self.withExtension = function (extension) {
                self.fileExtension = extension;
                return self;
            };

            self.build = function () {
                var jsFilesToBuild = []
                    .concat(parameters.jsFiles)
                    .concat(concatForeach('!', parameters.jsTestFiles));

                var process = gulp
                    .src(jsFilesToBuild);

                if (self.shouldValidateSyntax) {
                    process = process
                        .pipe(eslint())
                        .pipe(eslint.format())
                        .pipe(eslint.failAfterError());
                }

                process = process.pipe(concat(parameters.applicationFileName + self.fileExtension));

                if (self.shouldMinifyJs) {
                    process = process.pipe(uglify());
                }

                return process.pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        /**
         * @description Template tasks : Aggregate all the html template files of the application (controller + directive)
         * to a single file in the dist folder.
         */
        gulp.task('merge-template-files-to-dist', false, [], function () {
            return new TemplateFileAggregationTaskBuilder()
                .withExtension('.js')
                .build();
        }, {aliases: ['template']});
        gulp.task('merge-minify-template-files-to-dist', false, [], function () {
            return new TemplateFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.js')
                .build();
        }, {aliases: ['template-min']});

        function TemplateFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyCode = true;
                return self;
            };

            self.withExtension = function (extension) {
                self.fileExtension = extension;
                return self;
            };

            self.build = function () {
                var headerStr = '(function(angular){\'use strict\';angular.module(\'${moduleName}\', []).run(processTemplates);processTemplates.$inject = [\'$templateCache\'];function processTemplates($templateCache){';
                var footerStr = '}})(window.angular);\r\n';

                var process = gulp
                    .src(parameters.viewFiles)
                    .pipe(minifyHtml({}))
                    .pipe(ngHtml2js({
                        moduleName: parameters.templateModuleName,
                        template: '$templateCache.put(\'<%= template.url %>\',\'<%= template.escapedContent %>\');'
                    }))
                    .pipe(concat(parameters.templateFileName + self.fileExtension))
                    .pipe(header(headerStr, {moduleName: parameters.templateModuleName}))
                    .pipe(footer(footerStr));

                if (self.shouldMinifyCode) {
                    process = process.pipe(uglify())
                }
                else {
                    process = process.pipe(beautify())
                }

                return process.pipe(gulp.dest(parameters.distFolderPath));
            }
        }

        /**
         * @description Style tasks : Aggregate all the css files of the application to a single file
         * in the dist folder.
         */
        gulp.task('merge-css-files-to-dist', false, [], function () {
            // Merge the application css files in a single one to the dist folder.
            return new CssFileAggregationTaskBuilder()
                .withExtension('.css')
                .build();
        }, {aliases: ['css']});
        gulp.task('merge-minify-css-files-to-dist', false, [], function () {
            // Merge and minify the application css files in a single one to the dist folder
            return new CssFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.css')
                .build();
        }, {aliases: ['css-min']});

        function CssFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyJs = true;
                return this;
            };

            self.withExtension = function (extension) {
                self.fileExtension = extension;
                return this;
            };

            self.build = function () {
                var cssFilesToAggregate = [
                    parameters.cssFiles,
                    '!' + parameters.minCssFiles
                ];

                var process = gulp.src(cssFilesToAggregate);
                if (self.shouldMinifyJs) {
                    process = process.pipe(cssmin())
                }
                return process
                    .pipe(concat(parameters.applicationFileName + self.fileExtension))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        /**
         * @description Dependency tasks : Aggregate all the javascript files of bower dependencies to a single
         * file and all the css files of bower dependencies in another single file. Both are copied to the
         * dist folder.
         */
        gulp.task('merge-js-libraries-to-dist', false, [], function () {
            // Merge the library javascript files in a single one to the dist folder.
            return new JavascriptLibraryFileAggregationTaskBuilder()
                .withExtension('.js')
                .build();
        }, {aliases: ['js-dep']});
        gulp.task('merge-css-libraries-to-dist', false, [], function () {
            // Merge the library css files in a single one to the dist folder.
            return new CssLibraryFileAggregationTaskBuilder()
                .withExtension('.css')
                .build();
        }, {aliases: ['css-dep']});
        gulp.task('merge-minify-js-libraries-to-dist', false, [], function () {
            // Merge and minify the library javascript files in a single one to the dist folder.
            return new JavascriptLibraryFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.js')
                .build();
        }, {aliases: ['js-dep-min']});
        gulp.task('merge-minify-css-libraries-to-dist', false, [], function () {
            // Merge and minify the library css files in a single one to the dist folder.
            return new CssLibraryFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.css')
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

            self.withExtension = function (extension) {
                self.fileExtension = extension;
                return this;
            };

            self.build = function () {
                var jsProcess = gulp.src(utils.bower.getJsLibraries({devDependencies: false, dependencies: true}));
                if (self.shouldMinifyJs) {
                    jsProcess = jsProcess.pipe(uglify());
                }
                return jsProcess
                    .pipe(concat(parameters.libraryFileName + self.fileExtension))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        function CssLibraryFileAggregationTaskBuilder() {
            var self = this;

            self.withMinification = function () {
                self.shouldMinifyJs = true;
                return this;
            };

            self.withExtension = function (extension) {
                self.fileExtension = extension;
                return this;
            };

            self.build = function () {
                var cssProcess = gulp.src(utils.bower.getCssLibraries({devDependencies: false, dependencies: true}));
                if (self.shouldMinifyJs) {
                    cssProcess = cssProcess.pipe(cssmin());
                }
                return cssProcess
                    .pipe(concat(parameters.libraryFileName + self.fileExtension))
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
        gulp.task('reference-minified-dist-files-to-index', false, [], function () {
            // Copy the root html file to the dist folder and inject minified built dependencies.
            return new ReferenceAggregatedFilesTaskBuilder()
                .withMinifiedFiles()
                .build();
        }, {aliases: ['ref-min']});

        function ReferenceAggregatedFilesTaskBuilder() {
            var self = this;

            self.withMinifiedFiles = function () {
                self.useMinifiedFiles = true;
                return this;
            };

            self.build = function () {
                var jsExtension = '.js';
                var cssExtension = '.css';
                if (self.useMinifiedFiles) {
                    jsExtension = '.min.js';
                    cssExtension = '.min.css';
                }

                var files = [
                    path.join(parameters.distFolderPath, parameters.libraryFileName + jsExtension),
                    path.join(parameters.distFolderPath, parameters.templateFileName + jsExtension),
                    path.join(parameters.distFolderPath, parameters.applicationFileName + jsExtension),
                    path.join(parameters.distFolderPath, parameters.libraryFileName + cssExtension),
                    path.join(parameters.distFolderPath, parameters.applicationFileName + cssExtension)
                ];
                var filesToReference = gulp.src(files, {read: false});
                return gulp
                    .src(parameters.indexLocation)
                    .pipe(gulp.dest(parameters.distFolderPath))
                    .pipe(inject(filesToReference, {addRootSlash: false, relative: true}))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

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