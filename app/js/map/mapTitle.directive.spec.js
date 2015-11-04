(function () {
    'use strict';

    describe('The map title directive', function () {

        var createDirective;

        beforeEach(angular.mock.module('templates'));
        beforeEach(angular.mock.module('map'));
        beforeEach(inject(function($rootScope, $compile) {
            createDirective = function(html){
                var scope = $rootScope.$new();
                var element = $compile(html)(scope);
                scope.$digest();
                return element;
            };
        }));

        it('should be defined', function () {
            var directive = createDirective('<map-title></map-title>');
            expect(directive).to.be.an('object');
        });

        it('should initialize title in scope from message attribute.', function(){
            var directiveScope = createDirective('<map-title message="hello world"></map-title>').isolateScope();
            expect(directiveScope.title).to.equal('hello world');
        });
    });

})();