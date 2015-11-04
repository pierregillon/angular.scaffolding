(function(module, require){
    'use strict';

    module.exports = {
        templateCache : new TemplateCacheHelper()
    };

    var gulp = require('gulp-help')(require('gulp')),
        header = require('gulp-header'),
        footer = require('gulp-footer'),
        concat = require('gulp-concat'),
        beautify = require('gulp-beautify'),
        ngHtml2js = require('gulp-ng-html2js'),
        minifyHtml = require('gulp-minify-html');

    function TemplateCacheHelper(){

        var self = this;

        self.aggregateTemplates = function(htmlFilesPattern, moduleName, fileName){
            var headerStr = '(function(angular){\'use strict\';angular.module(\'${moduleName}\', []).run(processTemplates);processTemplates.$inject = [\'$templateCache\'];function processTemplates($templateCache){';
            var footerStr = '}})(window.angular);\r\n';

            return gulp
                .src(htmlFilesPattern)
                .pipe(minifyHtml({}))
                .pipe(ngHtml2js({
                    moduleName: moduleName,
                    template: '$templateCache.put(\'<%= template.url %>\',\'<%= template.escapedContent %>\');'
                }))
                .pipe(concat(fileName))
                .pipe(header(headerStr, {moduleName: 'templates'}))
                .pipe(footer(footerStr))
                .pipe(beautify());
        }
    }

})(module, require);