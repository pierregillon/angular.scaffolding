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
            streamqueue = require('streamqueue'),
            addStream = require('add-stream'),
            del = require('del'),
            path = require('path'),
            utils = require('./gulp.utils');

        // ------------------------------------------------------------------------------------------------
        // ----- Clean : Remove all files in the dist folder.
        // ------------------------------------------------------------------------------------------------
        gulp.task('clean', 'Clean the dist folder.', [], function () {
            return del(parameters.distFolderPath + '/*');
        });

        // ------------------------------------------------------------------------------------------------
        // ----- Build : merge all the files of the application and depencies to the dist
        // ------------------------------------------------------------------------------------------------
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

        // ------------------------------------------------------------------------------------------------
        // ----- Javascript : Creation of a single file with all the javascript files of the application.
        // ------------------------------------------------------------------------------------------------
        gulp.task('merge-js-files-to-dist', false, [], function () {
            // Merge javascript application files in a single one to the dist folder.
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withTemplateCache()
                .withExtension('.js')
                .build();
        }, {aliases: ['js']});
        gulp.task('merge-minify-js-files-to-dist', false, [], function () {
            // Merge and minify javascript application files in a single one to the dist folder.
            return new JavascriptFileAggregationTaskBuilder()
                .withSyntaxValidation()
                .withTemplateCache()
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
                    var getTemplateCacheProcess =
                        utils.templateCache.aggregateTemplates(parameters.viewFiles, 'templates', 'templates.module.js');
                    process = process.pipe(addStream.obj(getTemplateCacheProcess));
                }

                process = process.pipe(concat(parameters.distFileName + self.fileExtension));

                if (self.shouldMinifyJs) {
                    process = process.pipe(uglify());
                }

                return process.pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        // ------------------------------------------------------------------------------------------------
        // ----- Styles : Creation of a single file with all the css files of the application.
        // ------------------------------------------------------------------------------------------------
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
                    .pipe(concat(parameters.distFileName + self.fileExtension))
                    .pipe(gulp.dest(parameters.distFolderPath));
            };
        }

        // ------------------------------------------------------------------------------------------------
        // ----- Dependencies : Creation of a single file with all the bower dependencies (js / css).
        // ------------------------------------------------------------------------------------------------
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
        gulp.task('merge-libraries-to-dist', false, ['js-dep', 'css-dep'], null, {aliases: ['dep']});
        gulp.task('merge-minify-libraries-to-dist', false, ['js-dep-min', 'css-dep-min'], null, {aliases: ['dep-min']});

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

        // ------------------------------------------------------------------------------------------------
        // ----- Link : Reference the javascript, style and library files in the index.html.
        // ------------------------------------------------------------------------------------------------
        gulp.task('inject-dist-files-to-index', false, [], function () {
            // Copy the root html file to the dist folder and inject built dependencies.
            return new InjectAggregatedFilesTaskBuilder().build();
        }, {aliases: ['link']});
        gulp.task('inject-minified-dist-files-to-index', false, [], function () {
            // Copy the root html file to the dist folder and inject minified built dependencies.
            return new InjectAggregatedFilesTaskBuilder()
                .withMinifiedFiles()
                .build();
        }, {aliases: ['link-min']});

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