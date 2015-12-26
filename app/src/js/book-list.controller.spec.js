(function () {
    'use strict';

    describe('The book list controller', function () {

        var createController;

        beforeEach(angular.mock.module('main'));
        beforeEach(angular.mock.inject(function($rootScope, $controller) {
            createController = function(){
                var scope = $rootScope.$new();
                $controller('bookListController', { $scope: scope });
                scope.$digest();
                return scope;
            };
        }));

        it('should be defined.', function () {
            var scope = createController();
            expect(scope).to.be.an('object');
        });

        it('should have a book list view-model.', function(){
            var scope = createController();
            expect(scope.viewModel).to.be.an('object');
        });
    });

})();