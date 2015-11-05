(function(module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp-help')(require('gulp')),
            karma = require('karma'),
            runSequence = require('run-sequence'),
            path = require('path'),
            utils = require('./gulp.utils');

        /**
         * @description Test tasks : Launch unit tests in karma with different modes.
         */
        gulp.task('test', 'Start a single run of all unit tests.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'run'
            });
        });
        gulp.task('test-w', 'Start a continuous run of all unit tests.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'watch'
            });
        });
        gulp.task('test-debug', 'Start a debug session of all unit tests.', ['generateTemplates'], function() {
            return runKarmaOnSourceCode({
                action: 'watch',
                browsers: ['Chrome']
            });
        });
        gulp.task('test-dist', 'Start a single run of all unit tests, based on the full minified built application in the dist folder.', [], function(callback) {
            runSequence('build-min', 'test-current-dist', callback);
        });

        // ----- SubTasks
        gulp.task('generateTemplates', false, [], function () {
            return utils.templateCache
                .aggregateTemplates(parameters.viewFiles, 'templates', 'templates.module.js')
                .pipe(gulp.dest(parameters.distFolderPath));
        });
        gulp.task('test-current-dist', false, [], function () {
            return runKarmaOnDistCode({
                action: 'run'
            });
        });

        // ----- Utils
        function runKarmaOnSourceCode(configuration) {
            var files = utils.bower.getJsLibraries({devDependencies: true, dependencies: true})
                .concat(parameters.jsFiles)
                .concat('dist/templates.module.js')
                .concat(parameters.jsTestFiles);
            return runKarmaOnCode(files, configuration);
        }
        function runKarmaOnDistCode(configuration) {
            var files = utils.bower.getJsLibraries({devDependencies: true, dependencies: true})
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