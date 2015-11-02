(function (module) {
    'use strict';

    var parameters = {
        // js
        jsFiles: [
            './app/js/**/*.module.js',
            './app/js/**/*.controller.js'
        ],
        jsStartupFiles: [
            './app/js/startup.js'
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
            './app/views/**/*.html'
        ],
        indexLocation : './app/index.html',

        // Dist
        distPath: './dist',
        distFileName: 'application',
        viewDistFileName: 'templates',
        libraryFileName: 'libraries'
    };

    module.exports = parameters;
})(module, require);