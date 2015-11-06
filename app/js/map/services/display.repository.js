(function (angular) {
    'use strict';

    angular
        .module('map')
        .service('displayRepository', service);

    /* @ngInject */
    function service($q) {
        var self = this;

        self.getDisplays = function () {

            var displays = [];

            for(var i= 0; i < 50 ; i++){
                displays.push({id: i, lat: 48.85 + Math.random()/100, long: 2.34 + Math.random()/100});
            }

            return $q.when(displays);
        };
    }

})(window.angular);