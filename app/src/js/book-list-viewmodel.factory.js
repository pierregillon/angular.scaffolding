(function (angular) {
    'use strict';

    angular
        .module('main')
        .factory('BookListViewModel', factory);

    /* @ngInject */
    function factory() {
        return BookListViewModel;

        function BookListViewModel(){
            var self = this;

            self.books = [];
        }
    }

})(window.angular);