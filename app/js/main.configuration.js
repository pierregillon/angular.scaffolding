(function (angular) {
    'use strict';

    angular
        .module('main')
        .config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

    function configuration($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/map.controller.html',
                controller: 'mapController',
                controllerAs: 'controller'
            });
    }

})(window.angular);