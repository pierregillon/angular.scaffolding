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
            rename = require('gulp-rename'),
            header = require('gulp-header'),
            footer = require('gulp-footer'),
            beautify = require('gulp-beautify'),
            ngHtml2js = require('gulp-ng-html2js'),
            wiredep = require('wiredep'),
            minifyHtml = require('gulp-minify-html'),
            runSequence = require('run-sequence'),
            streamqueue = require('streamqueue'),
            addStream = require('add-stream'),
            del = require('del'),
            path = require('path');

        // ----- Javascript : Creation of a single file with all the javascript application.
        gulp.task('js', 'Merge javascript application files in a single one to the dist folder.', [], function () {
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withTemplateCache()
                .withExtension('.js')
                .build();
        }, 'test');
        gulp.task('js-min', 'Merge and minify javascript application files in a single one to the dist folder.', [], function () {
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withTemplateCache()
                .withMinification()
                .withExtension('.min.js')
                .build();
        });

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

            self.withTemplateCache = function () {
                self.shouldInjectTemplateCache = true;
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

                if (self.shouldInjectTemplateCache) {
                    process = process.pipe(addStream.obj(getTemplateCacheProcess()))
                }

                process = process.pipe(concat(parameters.distFileName + self.fileExtension));

                if (self.shouldMinifyJs) {
                    process = process.pipe(uglify());
                }

                return process.pipe(gulp.dest(parameters.distFolderPath));
            };

            // ----- Internal logics

            function getTemplateCacheProcess() {
                var headerStr = '(function(angular){\'use strict\';angular.module(\'${moduleName}\', []).run(processTemplates);processTemplates.$inject = [\'$templateCache\'];function processTemplates($templateCache){';
                var footerStr = '}})(window.angular);\r\n';

                return gulp
                    .src(parameters.viewFiles)
                    .pipe(minifyHtml({}))
                    .pipe(ngHtml2js({
                        moduleName: 'templates',
                        template: '$templateCache.put(\'<%= template.url %>\',\'<%= template.escapedContent %>\');'
                    }))
                    .pipe(concat('concat.js'))
                    .pipe(header(headerStr, {moduleName: 'templates'}))
                    .pipe(footer(footerStr))
                    .pipe(beautify());
            }
        }

        // ----- Styles : Creation of a single file with all the css of the application.
        gulp.task('css', 'Merge the application css files in a single one to the dist folder.', [], function () {
            return new CssFileAggregationTaskBuilder()
                .withExtension('.css')
                .build();
        });
        gulp.task('css-min', 'Merge and minify the application css files in a single one to the dist folder', [], function () {
            return new CssFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.css')
                .build();
        });

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
                    .pipe(concat(parameters.distFileName + self.fileExtension))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        // ----- Dependencies : Creation of a single file with all the bower dependencies (js / css).
        gulp.task('dep', 'Merge the library javascript files in a single one to the dist folder.', [], function () {
            var jsTask = new JavascriptLibraryFileAggregationTaskBuilder()
                .withExtension('.js')
                .build();

            var cssTask = new CssLibraryFileAggregationTaskBuilder()
                .withExtension('.css')
                .build();

            return streamqueue({objectMode: true}, jsTask, cssTask)
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('dep-min', 'Merge and minify the library javascript files in a single one to the dist folder.', [], function () {
            var jsTask = new JavascriptLibraryFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.js')
                .build();

            var cssTask = new CssLibraryFileAggregationTaskBuilder()
                .withMinification()
                .withExtension('.min.css')
                .build();

            return streamqueue({objectMode: true}, jsTask, cssTask)
                .pipe(gulp.dest(parameters.distFolderPath));
        });

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
                var jsProcess = gulp.src(getJsBowerDependencies());
                if (self.shouldMinifyJs) {
                    jsProcess = jsProcess.pipe(uglify());
                }
                return jsProcess.pipe(concat(parameters.libraryFileName + self.fileExtension));
            };

            function getJsBowerDependencies() {
                return getBowerDependencies(wiredep().js);
            }
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
                var cssProcess = gulp.src(getCssBowerDependencies());
                if (self.shouldMinifyJs) {
                    cssProcess = cssProcess.pipe(cssmin());
                }
                return cssProcess.pipe(concat(parameters.libraryFileName + self.fileExtension));
            };

            function getCssBowerDependencies() {
                return getBowerDependencies(wiredep().css);
            }
        }

        // ----- Link : Reference the javascript, style and library files in the index.html.
        gulp.task('link', 'Copy the root html file to the dist folder and inject built dependencies.', [], function () {
            return new InjectAggregatedFilesTaskBuilder().build();
        });
        gulp.task('link-min', 'Copy the root html file to the dist folder and inject minified built dependencies.', [], function () {
            return new InjectAggregatedFilesTaskBuilder()
                .withMinifiedFiles()
                .build();
        });

        function InjectAggregatedFilesTaskBuilder() {
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
                    path.join(parameters.distFolderPath, parameters.distFileName + jsExtension),
                    path.join(parameters.distFolderPath, parameters.libraryFileName + cssExtension),
                    path.join(parameters.distFolderPath, parameters.distFileName + cssExtension)
                ];
                var filesToLink = gulp.src(files, {read: false});
                return gulp
                    .src(parameters.indexLocation)
                    .pipe(gulp.dest(parameters.distFolderPath))
                    .pipe(inject(filesToLink, {addRootSlash: false, relative: true}))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        // ----- Clean : Remove all files in the dist folder.
        gulp.task('clean', 'Clean the dist folder.', [], function () {
            return del(parameters.distFolderPath + '/*');
        });

        // ----- Global build
        gulp.task('build', 'Build the entire application in the dist folder.', [], function (callback) {
            runSequence('clean', 'js', 'css', 'dep', 'link', callback);
        });
        gulp.task('build-w', 'Build the entire application in the dist folder and watch changes.', ['build'], function () {
            gulp.watch([parameters.jsFiles], ['js']);
            gulp.watch([parameters.viewFiles], ['js']); // template cache is injected in js bundle.
            gulp.watch([parameters.cssFiles], ['css']);
            gulp.watch([parameters.indexLocation], ['link']);
        });
        gulp.task('build-min', 'Build the entire minified application in the dist folder.', [], function (callback) {
            runSequence('clean', 'js-min', 'css-min', 'dep-min', 'link-min', callback);
        });
        gulp.task('build-min-w', 'Build the entire minified application in the dist folder and watch changes.', ['build-min'], function () {
            gulp.watch([parameters.jsFiles], ['js-min']);
            gulp.watch([parameters.viewFiles], ['js-min']); // template cache is injected in js bundle.
            gulp.watch([parameters.cssFiles], ['css-min']);
            gulp.watch([parameters.indexLocation], ['link-min']);
        });

        // ----- Utils
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
    }

}(module, require));