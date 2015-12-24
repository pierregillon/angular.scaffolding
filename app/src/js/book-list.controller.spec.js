(function () {
    'use strict';

    describe('The book list controller', function () {

        var createController;

        beforeEach(angular.mock.module('main'));
        beforeEach(angular.mock.inject(function($rootScope, $controller) {
            createController = function(){
                var scope = $rootScope.$new();
                var controller = $controller('bookListController', { $scope: scope });
                scope.$digest();
                return controller;
            };
        }));

        it('should be defined.', function () {
            var controller = createController();
            expect(controller).to.be.an('object');
        });

        it('should have a book list view-model.', function(){
            var controller = createController();
            expect(controller.viewModel).to.be.an('object');
        });
    });

})();