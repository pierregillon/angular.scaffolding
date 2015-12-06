module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'sinon-chai'],
        files: [],
        exclude: [],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DISABLE,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    })
};
