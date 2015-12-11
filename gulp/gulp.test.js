(function (module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp-help')(require('gulp')),
            karma = require('karma'),
            runSequence = require('run-sequence'),
            path = require('path'),
            utils = require('./gulp.utils')(parameters);

        /**
         * @description Test tasks : Launch unit tests in karma with different modes.
         */
        gulp.task('test', 'Start a single run of all unit tests.', ['merge-template-files-to-dist'], function (done) {
            runKarmaOnSourceCode({singleRun: true}, done);
        });
        gulp.task('test-w', 'Start a continuous run of all unit tests.', ['merge-template-files-to-dist'], function (done) {
            runKarmaOnSourceCode({singleRun: false}, done);
        });
        gulp.task('test-c', 'Start a single run of all unit tests and build a coverage summary.', ['merge-template-files-to-dist'], function (done) {
            runKarmaOnSourceCode({
                singleRun: true,
                preprocessors: {
                    'app/js/**/*.js': 'coverage'
                },
                reporters: ['coverage'],
                coverageReporter: {
                    type: 'text-summary'
                }
            }, done);
        });
        gulp.task('test-debug', 'Start a debug session of all unit tests.', ['merge-template-files-to-dist'], function (done) {
            runKarmaOnSourceCode({
                singleRun: false,
                browsers: ['Chrome']
            }, done);
        });
        gulp.task('test-dist', 'Start a single run of all unit tests, based on the full minified built application in the dist folder.', [], function (done) {
            runSequence(
                'build-min',
                'test-current-dist',
                done);
        });

        // ----- SubTasks
        gulp.task('test-current-dist', false, [], function (done) {
            runKarmaOnDistCode({singleRun: true}, done);
        });

        // ----- Utils
        function runKarmaOnDistCode(configuration, done) {
            var files = utils.bower.getJsLibraries({devDependencies: true, dependencies: true})
                .concat(parameters.jsTestFiles)
                .concat(path.join(parameters.distFolderPath, parameters.applicationFileName + '*js'))
                .concat(path.join(parameters.distFolderPath, parameters.templateFileName + '*js'));

            configuration.configFile = path.resolve(parameters.karmaFilePath);
            configuration.files = files;

            var server = new karma.Server(configuration, function (exitCode) {
                if (exitCode !== 0) {
                    done('some failed tests on dist folder.');
                }
                else {
                    done();
                }
            });
            server.start();
        }

        function runKarmaOnSourceCode(configuration, done) {
            configuration.configFile = path.resolve(parameters.karmaFilePath);
            var server = new karma.Server(configuration, function () {
                done();
            });
            server.start();
        }
    }
}(module, require));