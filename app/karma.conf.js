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
            concurrency: Infinity,

            preprocessors: {
                './app/src/js/**/*.ts': ['typescript']
            },
            typescriptPreprocessor: {
                // options passed to the typescript compiler
                options: {
                    sourceMap: false, // (optional) Generates corresponding .map file.
                    target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
                    module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
                    noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
                    noResolve: false, // (optional) Skip resolution and preprocessing.
                    removeComments: true, // (optional) Do not emit comments to output.
                    concatenateOutput: true // (optional) Concatenate and emit output to single file. By default true if module option is omited, otherwise false.
                },
                typings: [
                    './app/typings/tsd.d.ts'
                ]
            }
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