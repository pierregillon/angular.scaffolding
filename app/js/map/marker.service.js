(function (angular) {
    'use strict';

    angular
        .module('map')
        .service('markerService', service);

    service.$inject = ['displayRepository'];

    function service(displayRepository) {
        var self = this;

        self.getMarkers = function () {
            displayRepository.getDisplays();
        };
    }

})(window.angular);