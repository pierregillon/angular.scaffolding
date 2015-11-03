(function (angular) {
    'use strict';

    angular
        .module('map')
        .config(configuration);

    configuration.$inject = ['uiGmapGoogleMapApiProvider'];

    function configuration(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    }

})(window.angular);