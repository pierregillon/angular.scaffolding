(function (angular) {
    'use strict';

    angular
        .module('main')
        .controller('bookListController', controller);

    /* @ngInject */
    function controller($scope, BookListViewModel) {
        $scope.viewModel = new BookListViewModel();
        $scope.viewModel.load();
    }

})(window.angular);