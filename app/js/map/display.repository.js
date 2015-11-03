(function (angular) {
    'use strict';

    angular
        .module('map')
        .service('displayRepository', service);

    service.$inject = ['$q'];

    function service($q) {
        var self = this;

        self.getDisplays = function(){
            var displays = [
                {name: 'center', x: '', y:''}
            ];
            return $q.when(displays);
        };
    }

})(window.angular);