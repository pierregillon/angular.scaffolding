(function(module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp-help')(require('gulp')),
            wiredep = require('wiredep'),
            karma = require('karma'),
            runSequence = require('run-sequence'),
            path = require('path');

        // ----- Tasks
        gulp.task('test', 'Start a single run of all unit tests.', [], function() {
            return runKarmaOnSourceCode({
                action: 'run'
            });
        });
        gulp.task('test-spec', 'Start a single run of all unit tests with the specification view.', [], function() {
            return runKarmaOnSourceCode({
                action: 'run',
                reporters: ['spec']
            });
        });
        gulp.task('test-debug', 'Start a debug session of all unit tests.', [], function() {
            return runKarmaOnSourceCode({
                action: 'watch',
                browsers: ['Chrome']
            });
        });
        gulp.task('test-w', 'Start a continuous run of all unit tests.', [], function() {
            return runKarmaOnSourceCode({
                action: 'watch'
            });
        });

        gulp.task('test-current-dist', false, [], function() {
            return runKarmaOnDistCode({
                action: 'run'
            });
        });

        gulp.task('test-dist', 'Start a single run of all unit tests, based on the full minified built application in the dist folder.', [], function(callback) {
            runSequence('build-min', 'test-current-dist', callback);
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
                .concat(parameters.viewFiles)
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