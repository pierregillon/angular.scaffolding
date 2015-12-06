(function (module, require) {
    'use strict';

    var path = require('path');
    var utils = require('./gulp/gulp.utils');
    var parameters = require('./gulp/gulp.configuration.json');

    var files = utils.bower.getJsLibraries({devDependencies: true, dependencies: true})
        .concat(parameters.jsFiles)
        .concat(path.join(parameters.distFolderPath, parameters.templateFileName + '.js'))
        .concat(parameters.jsTestFiles);

    var karmaConfiguration = function (config) {
        config.set({
            basePath: '',
            frameworks: ['jasmine', 'sinon-chai'],
            files: files,
            exclude: [],
            reporters: ['progress'],
            port: 9876,
            colors: true,
            logLevel: config.LOG_DISABLE,
            autoWatch: true,
            browsers: ['PhantomJS'],
            singleRun: false,
            concurrency: Infinity
        });
    };

    module.exports = karmaConfiguration;
})(module, require);