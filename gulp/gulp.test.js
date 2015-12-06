(function (module, require) {
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
        gulp.task('test', 'Start a single run of all unit tests.', ['merge-template-files-to-dist'], function () {
            return runKarmaOnCode({
                action: 'run'
            });
        });
        gulp.task('test-w', 'Start a continuous run of all unit tests.', ['merge-template-files-to-dist'], function () {
            return runKarmaOnCode({
                action: 'watch'
            });
        });
        gulp.task('test-c', 'Start a single run of all unit tests and build a coverage summary.', ['merge-template-files-to-dist'], function () {
            return runKarmaOnCode({
                preprocessors: {
                    'app/js/**/*.js': 'coverage'
                },
                action: 'run',
                reporters: ['coverage'],
                coverageReporter: {
                    type: 'text-summary'
                }
            });
        });
        gulp.task('test-debug', 'Start a debug session of all unit tests.', ['merge-template-files-to-dist'], function () {
            return runKarmaOnCode({
                action: 'watch',
                browsers: ['Chrome']
            });
        });
        gulp.task('test-dist', 'Start a single run of all unit tests, based on the full minified built application in the dist folder.', [], function (callback) {
            runSequence('build-min', 'test-current-dist', callback);
        });

        // ----- SubTasks
        gulp.task('test-current-dist', false, [], function () {
            return runKarmaOnDistCode({
                action: 'run'
            });
        });

        // ----- Utils
        function runKarmaOnDistCode(configuration) {
            var files = utils.bower.getJsLibraries({devDependencies: true, dependencies: true})
                .concat(parameters.jsTestFiles)
                .concat(path.join(parameters.distFolderPath, parameters.applicationFileName + '*js'))
                .concat(path.join(parameters.distFolderPath, parameters.templateFileName + '*js'));
            return runKarmaOnCode(configuration, files);
        }

        function runKarmaOnCode(configuration, files) {
            configuration.configFile = path.resolve(parameters.karmaFilePath);
            configuration.singleRun = configuration.action === 'run';

            if (files) {
                configuration.files = files;
            }

            var server = new karma.Server(configuration);
            server.start();
        }
    }
}(module, require));