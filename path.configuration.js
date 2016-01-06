(function (module) {
    'use strict';

    module.exports = {

        /***********************************
         **** Application configuration ****
         ***********************************/

        // Where javascript files of the application are located.
        'jsFiles': [
            './app/src/js/**/*.model.ts',
            './app/src/js/**/*.module.ts',
            './app/src/js/**/*.configuration.ts',
            './app/src/js/**/*.constant.ts',
            './app/src/js/**/*.controller.ts',
            './app/src/js/**/*.directive.ts',
            './app/src/js/**/*.service.ts',
            './app/src/js/**/*.filter.ts',
            './app/src/js/**/*.factory.ts',
            './app/src/js/**/*.repository.ts'
        ],

        // Where css files of the application are located.
        'cssFiles': [
            './app/src/css/**/*.css',
            '!./app/src/css/**/*.min.css'
        ],

        // Where less files of the application are located.
        'lessFiles': [
            './app/src/css/**/*.less'
        ],

        // Where html files of the application are located.
        'htmlTemplateFiles': [
            './app/src/js/**/*.html'
        ],

        // Where image files of the application are located.
        'imgFiles': [
            './app/src/img/*'
        ],

        // Startup file in which the angular application is hosted.
        'startupFile': './app/src/index.html',

        // Bower json location
        'bowerJsonFolderPath': './app/',

        /*****************************
         **** Tests configuration ****
         *****************************/

        // Javascript files to use for code coverage process.
        'jsFilesToCover': 'app/src/js/**/*.js',

        // Javascript specification files that contains application tests.
        'jsSpecFiles': [
            './app/src/js/**/*.spec.ts'
        ],

        // Javascript files to add in karma that contains test utilities.
        'jsToolTestFiles': [
            './app/test.configuration.js'
        ],

        // Karma file path
        'karmaFilePath': './app/karma.conf.js',

        /**********************************
         **** Gulp build configuration ****
         **********************************/

        // Dist folder that will contains the built application.
        'distFolderPath': './app/dist',

        // File names that would be generated in the dist folder.
        'applicationFileName': 'application',
        'templateFileName': 'templates',
        'libraryFileName': 'libraries',

        // Angular module name that is generated and contains all the application templates
        'templateModuleName': 'templates'
    };

})(module);