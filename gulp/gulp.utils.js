(function(module, require){
    'use strict';

    module.exports = {
        bower : new BowerHelper()
    };

    var gulp = require('gulp-help')(require('gulp')),
        wiredep = require('wiredep');

    function BowerHelper(){
        var self = this;

        self.getJsLibraries = function (wiredepParams) {
            return getBowerDependencies(wiredep(wiredepParams).js);
        };
        self.getCssLibraries = function (wiredepParams) {
            return getBowerDependencies(wiredep(wiredepParams).css);
        };

        function getBowerDependencies(values) {
            var dependencies = [];
            if (values) {
                values.forEach(function (dependency) {
                    var index = dependency.indexOf('bower_components');
                    var wellFormattedDependency = dependency.substr(index, dependency.length - index).split("\\").join('/');
                    dependencies.push(wellFormattedDependency);
                });
            }
            return dependencies;
        }
    }

})(module, require);