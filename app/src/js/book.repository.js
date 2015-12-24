(function (angular) {
    'use strict';

    angular
        .module('main')
        .service('bookRepository', service);

    /* @ngInject */
    function service() {
        var self = this;

        self.getBooks = function(){

        };
    }

})(window.angular);