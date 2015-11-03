(function (angular, _) {
    'use strict';

    angular
        .module('map')
        .service('markerService', service);

    service.$inject = ['displayRepository'];

    function service(displayRepository) {
        var self = this;

        self.getMarkers = function () {
            return displayRepository
                .getDisplays()
                .then(function (displays) {
                    return _.map(displays, function (element) {
                        return {
                            latitude: element.lat,
                            longitude: element.long
                        };
                    });
                });
        };
    }

})(window.angular, window._);