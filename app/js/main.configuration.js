(function () {
    'use strict';

    angular
        .module('main')
        .config(configuration);

    configuration.$inject = ['uiGmapGoogleMapApiProvider'];

    function configuration(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    }

})();