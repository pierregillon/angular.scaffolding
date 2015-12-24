(function (angular) {
    'use strict';

    angular
        .module('main')
        .controller('bookListController', controller);

    /* @ngInject */
    function controller(BookListViewModel) {
        var self = this;

        self.viewModel = new BookListViewModel();
    }

})(window.angular);