(function (angular, _) {
    'use strict';

    angular
        .module('map')
        .service('markerService', service);

    /* @ngInject */
    function service(displayRepository) {
        var self = this;

        self.getMarkers = function () {
            return displayRepository
                .getDisplays()
                .then(function (displays) {
                    return _.map(displays, function (element) {
                        return {
                            id: element.id,
                            coords: {
                                latitude: element.lat,
                                longitude: element.long
                            },
                            options: {},
                            events: {}
                        };
                    });
                });
        };
    }

})(window.angular, window._);