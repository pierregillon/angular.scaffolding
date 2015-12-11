(function (module, require) {
    'use strict';

    var gulp = require('gulp-help')(require('gulp')),
        wiredep = require('wiredep'),
        path = require('path'),
        extend = require('extend');

    function BowerHelper(parameters) {
        var defaultBowerConfiguration = {
            bowerJson: require(path.join(__dirname, '..', parameters.bowerJsonFolderPath, '/bower.json')),
            directory: path.join(__dirname, '..', parameters.bowerJsonFolderPath, '/bower_components/')
        };

        return {
            bower: {
                getJsLibraries: function (wiredepParams) {
                    var parameters = extend(defaultBowerConfiguration, wiredepParams);
                    return wiredep(parameters).js || [];
                },
                getCssLibraries: function (wiredepParams) {
                    var parameters = extend(defaultBowerConfiguration, wiredepParams);
                    return wiredep(parameters).css || [];
                }
            }
        };
    }

    module.exports = BowerHelper;

})(module, require);