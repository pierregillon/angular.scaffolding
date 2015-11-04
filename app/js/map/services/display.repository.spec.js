(function () {
    'use strict';

    describe('A display repository', function () {

        var displayRepository;

        beforeEach(angular.mock.module('map'));
        beforeEach(angular.mock.inject(function(_displayRepository_){
            displayRepository = _displayRepository_;
        }));

        it('should be defined', function () {
            expect(displayRepository).to.be.an('object');
        });

        it('should contains a method "getDisplays".', function () {
            expect(displayRepository.getDisplays).to.be.a('function');
        });
    });
})();