(function(module, require) {
    module.exports = buildDefinition;

    function buildDefinition(parameters) {

        var gulp = require('gulp'),
            wiredep = require('wiredep'),
            karma = require('karma'),
            runSequence = require('run-sequence'),
            path = require('path');

        // ----- Tasks
        gulp.task('test', function() {
            return runKarmaOnSourceCode({
                action: 'run'
            });
        });
        gulp.task('test-spec', function() {
            return runKarmaOnSourceCode({
                action: 'run',
                reporters: ['spec']
            });
        });
        gulp.task('test-debug', function() {
            return runKarmaOnSourceCode({
                action: 'watch',
                browsers: ['Chrome']
            });
        });
        gulp.task('test-w', function() {
            return runKarmaOnSourceCode({
                action: 'watch'
            });
        });

        gulp.task('test-dist', function() {
            return runKarmaOnDistCode({
                action: 'run'
            });
        });

        gulp.task('build-test-dist', function(callback) {
            runSequence('build-min', 'test-dist', callback);
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
                .concat(parameters.jsTestFiles);
            return runKarmaOnCode(files, configuration);
        }

        function runKarmaOnDistCode(configuration) {
            var files = getBowerDependencies()
                .concat(parameters.jsTestFiles)
                .concat('./dist/' + parameters.distFileName + '.min.js');
            return runKarmaOnCode(files, configuration);
        }

        function runKarmaOnCode(files, configuration) {
            configuration.configFile = path.resolve(parameters.karmaFilePath);
            configuration.singleRun = configuration.action === 'run';
            configuration.files = files;
            configuration.exclude = parameters.jsStartupFiles;

            var server = new karma.Server(configuration);
            server.start();
        }
    }
}(module, require));