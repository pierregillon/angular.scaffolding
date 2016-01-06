describe('The book list controller', function () {

    var createController : Function;

    beforeEach(angular.mock.module('poc'));
    beforeEach(angular.mock.inject(($rootScope:ng.IRootScopeService, $controller:ng.IControllerService)=> {
        createController = ()=> {
            var scope = $rootScope.$new();
            var controller = $controller('bookListController as controller', {$scope: scope});
            scope.$digest();
            return controller;
        };
    }));

    it('should be defined.', function () {
        var controller = createController();
        chai.expect(controller).to.be.an('object');
    });

    it('should initialized books collection with elements.', function () {
        var controller = createController();

        chai.expect(controller.books).to.be.an('array');
        chai.expect(controller.books).to.have.length(4);
    });
});