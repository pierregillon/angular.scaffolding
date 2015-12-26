(function (angular) {
    'use strict';

    angular
        .module('main')
        .service('bookRepository', service);

    /* @ngInject */
    function service($q) {
        var self = this;

        self.getBooks = function () {
            return $q.when([
                {name: 'book1'},
                {name: 'book2'},
                {name: 'book3'}
            ]);
        };
    }

})(window.angular);