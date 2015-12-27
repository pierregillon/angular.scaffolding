(function (angular) {
    'use strict';

    angular
        .module('main')
        .service('bookRepository', service);

    /* @ngInject */
    function service($q, $timeout) {
        var self = this;

        self.getBooks = function () {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve([
                    {id: 1, name: 'book1'},
                    {id: 2, name: 'book2'},
                    {id: 3, name: 'book3'}
                ]);
            }, 1000);
            return deferred.promise;
        };
    }

})(window.angular);