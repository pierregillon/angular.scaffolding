(function (angular) {
    'use strict';

    angular
        .module('main')
        .controller('mainController', controller);

    controller.$inject = ['uiGmapGoogleMapApi'];

    function controller(uiGmapGoogleMapApi) {
        var self = this;

        uiGmapGoogleMapApi.then(function(){
            self.message = 'Google map is ready';
            self.map = { center: { latitude: 48.8566140, longitude: 2.3522219 }, zoom: 15 };
        });
    }

})(window.angular);