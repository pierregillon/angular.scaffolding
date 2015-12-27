(function (angular) {
    'use strict';

    angular
        .module('main')
        .service('card', service);

    /* @ngInject */
    function service() {
        var self = this;

        self.add = function (id) {
            console.log(id);
        };
    }

})(window.angular);