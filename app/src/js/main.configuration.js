(function (angular) {
    'use strict';

    angular
        .module('main')
        .config(configuration);

    /* @ngInject */
    function configuration($stateProvider) {
        $stateProvider
            .state('home', {
                url:'/',
                templateUrl: 'book-list.controller.html',
                controller: 'bookListController'
            });
    }

})(window.angular);