(function (module, require) {
    'use strict';

    var path = require('path');
    var lodash = require('lodash');
    var parameters = require('../path.configuration.js');
    var utils = require('../gulp/gulp.utils')(parameters);

    var karmaConfiguration = function (config) {
        config.set({
            basePath: '..',
            frameworks: ['jasmine'],
            files: getFiles(config.loadProductionCode),
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

    function getFiles(loadProductionCode) {
        var files = [];

        if (loadProductionCode) {
            files = files
                .concat(path.join(parameters.distFolderPath, parameters.libraryFileName + '*js'))
                .concat(path.join(parameters.distFolderPath, parameters.applicationFileName + '*js'))
                .concat(lodash.difference ( // Get only dev dependencies, without prod dependencies
                    utils.bower.getJsLibraries({devDependencies: true, dependencies: false}),
                    utils.bower.getJsLibraries({devDependencies: false, dependencies: true})
                ));
        }

        else {
            files = files
                .concat(utils.bower.getJsLibraries({devDependencies: true, dependencies: true}))
                .concat(parameters.jsFiles);
        }

        files = files
            .concat(path.join(parameters.distFolderPath, parameters.templateFileName + '*js'))
            .concat(parameters.jsToolTestFiles)
            .concat(parameters.jsSpecFiles);

        return files;
    }

    module.exports = karmaConfiguration;
})(module, require);