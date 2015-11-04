(function (angular) {
    'use strict';

    angular
        .module('map')
        .directive('mapTitle', directive);

    function directive() {
        return {
            templateUrl: 'map/mapTitle.directive.html',
            restrict: 'E',
            scope: {
                title: '@message'
            }
        };
    }

})(window.angular);