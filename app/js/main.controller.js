(function () {
    'use strict';

    angular
        .module('main')
        .controller('mainController', controller);

    controller.$inject = [];

    function controller() {
        var self = this;

        self.message = "hello world";
    }

})();