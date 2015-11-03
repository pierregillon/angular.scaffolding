(function (angular) {
    'use strict';

    angular
        .module('map')
        .controller('mapController', controller);

    controller.$inject = ['uiGmapGoogleMapApi', 'markerService'];

    function controller(googleMapApi, markerService) {
        var self = this;

        googleMapApi.then(function () {
            self.message = 'Google map is ready';
            self.map = {center: {latitude: 48.854614, longitude: 2.347600}, zoom: 16};

            markerService.getMarkers().then(function (markers) {
                self.markers = markers;
            });
        });
    }

})(window.angular);