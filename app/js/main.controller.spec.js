(function (expect) {
    'use strict';

    describe('The main controller', function () {

        var controller;

        beforeEach(angular.mock.module('main'));
        beforeEach(inject(function ($controller, $rootScope) {
            var scope = $rootScope.$new();
            controller = $controller('mainController', {
                $scope: scope
            });
        }));

        it('should be defined', function () {
            expect(controller).to.be.an('object');
        });
    });
})(chai.expect);