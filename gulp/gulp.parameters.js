(function (module) {
    'use strict';

    var parameters = {
        // js
        jsFiles: [
            './app/js/**/*.module.js',
            './app/js/**/*.configuration.js',
            './app/js/**/*.controller.js',
            './app/js/**/*.directive.js',
            './app/js/**/*.service.js'
        ],
        jsTestFiles: [
            './app/js/**/*.spec.js'
        ],
        karmaFilePath:'./karma.conf.js',

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
        distFileName: 'application',
        viewDistFileName: 'templates',
        libraryFileName: 'libraries'
    };

    module.exports = parameters;
})(module, require);