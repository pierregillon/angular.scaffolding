(function(module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp-help')(require('gulp')),
            header = require('gulp-header'),
            footer = require('gulp-footer'),
            concat = require('gulp-concat'),
            beautify = require('gulp-beautify'),
            ngHtml2js = require('gulp-ng-html2js'),
            wiredep = require('wiredep'),
            minifyHtml = require('gulp-minify-html'),
            karma = require('karma'),
            runSequence = require('run-sequence'),
            path = require('path');

        // ----- Tasks
        gulp.task('test', 'Start a single run of all unit tests.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'run'
            });
        });
        gulp.task('test-spec', 'Start a single run of all unit tests with the specification view.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'run',
                reporters: ['spec']
            });
        });
        gulp.task('test-debug', 'Start a debug session of all unit tests.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'watch',
                browsers: ['Chrome']
            });
        });
        gulp.task('test-w', 'Start a continuous run of all unit tests.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'watch'
            });
        });
        gulp.task('test-dist', 'Start a single run of all unit tests, based on the full minified built application in the dist folder.', [], function(callback) {
            runSequence('build-min', 'test-current-dist', callback);
        });

        // ----- SubTasks
        gulp.task('generateTemplates', false, [], function () {
            var headerStr = '(function(angular){\'use strict\';angular.module(\'${moduleName}\', []).run(processTemplates);processTemplates.$inject = [\'$templateCache\'];function processTemplates($templateCache){';
            var footerStr = '}})(window.angular);\r\n';

            return gulp
                .src(parameters.viewFiles)
                .pipe(minifyHtml({}))
                .pipe(ngHtml2js({
                    moduleName: 'templates',
                    template: '$templateCache.put(\'<%= template.url %>\',\'<%= template.escapedContent %>\');'
                }))
                .pipe(concat('templates.module.js'))
                .pipe(header(headerStr, {moduleName: 'templates'}))
                .pipe(footer(footerStr))
                .pipe(beautify())
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('test-current-dist', false, [], function () {
            return runKarmaOnDistCode({
                action: 'run'
            });
        });

        // ----- Utils
        function getBowerDependencies() {
            var dependencies = [];
            wiredep({
                devDependencies: true,
                dependencies: true
            }).js.forEach(function(dependency) {
                var index = dependency.indexOf('bower_components');
                var wellFormattedDependency = dependency.substr(index, dependency.length - index).split("\\").join('/');
                dependencies.push('./' + wellFormattedDependency);
            });
            return dependencies;
        }
        function runKarmaOnSourceCode(configuration) {
            var files = getBowerDependencies()
                .concat(parameters.jsFiles)
                .concat('dist/templates.module.js')
                .concat(parameters.jsTestFiles);

            return runKarmaOnCode(files, configuration);
        }
        function runKarmaOnDistCode(configuration) {
            var files = getBowerDependencies()
                .concat(parameters.jsTestFiles)
                .concat(path.join(parameters.distFolderPath, parameters.distFileName + '.min.js'));
            return runKarmaOnCode(files, configuration);
        }
        function runKarmaOnCode(files, configuration) {
            configuration.configFile = path.resolve(parameters.karmaFilePath);
            configuration.singleRun = configuration.action === 'run';
            configuration.files = files;
            configuration.exclude = [];

            var server = new karma.Server(configuration);
            server.start();
        }
    }
}(module, require));