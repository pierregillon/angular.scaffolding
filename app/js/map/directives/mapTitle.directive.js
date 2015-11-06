(function (angular) {
    'use strict';

    angular
        .module('map')
        .directive('mapTitle', directive);

    /* @ngInject */
    function directive() {
        return {
            templateUrl: 'map/directives/mapTitle.directive.html',
            restrict: 'E',
            scope: {
                title: '@message'
            }
        };
    }

})(window.angular);