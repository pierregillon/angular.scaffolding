(function(module, require){
    'use strict';

    var gulp = require('gulp-help')(require('gulp')),
        wiredep = require('wiredep');

    function BowerHelper(){
        var self = this;

        self.getJsLibraries = function (wiredepParams) {
            return wiredep(wiredepParams).js || [];
        };
        self.getCssLibraries = function (wiredepParams) {
            return wiredep(wiredepParams).css || [];
        };
    }

    module.exports = {
        bower : new BowerHelper()
    };

})(module, require);