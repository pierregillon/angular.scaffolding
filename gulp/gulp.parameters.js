(function (module) {
    'use strict';

    var parameters = {
        // js
        jsFiles: [
            './app/js/**/*.module.js',
            './app/js/**/*.configuration.js',
            './app/js/**/*.controller.js',
            './app/js/**/*.directive.js',
            './app/js/**/*.service.js',
            './app/js/**/*.repository.js'
        ],
        jsTestFiles: [
            './app/js/**/*.spec.js'
        ],

        // css
        cssFiles: './app/css/**/*.css',
        minCssFiles: './app/css/**/*.min.css',

        // html
        viewFiles: [
            './app/js/**/*.html'
        ],
        indexLocation : './app/index.html',

        // Dist
        distFolderPath: './dist',
        applicationFileName: 'application',
        templateFileName: 'templates',
        libraryFileName: 'libraries',

        // Others
        karmaFilePath:'./karma.conf.js',
        templateModuleName: 'templates'
    };

    module.exports = parameters;
})(module, require);