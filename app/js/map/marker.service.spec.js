(function () {
    'use strict';

    describe('A marker service', function () {

        var markerService;
        var displayRepository = {
            getDisplays: function(){}
        };

        beforeEach(angular.mock.module('map'));
        beforeEach(angular.mock.module(function($provide){
            $provide.service('displayRepository', function(){return displayRepository;});
        }));
        beforeEach(angular.mock.inject(function (_markerService_) {
            markerService = _markerService_
        }));

        it('should be defined', function () {
            expect(markerService).to.be.an('object');
        });

        it('should have a "getMarkers" method', function(){
           expect(markerService.getMarkers).to.be.a('function');
        });

        it('should get displays from the display repository when calling getMarkers.', function(){
            displayRepository.getDisplays = sinon.spy();

            markerService.getMarkers();

            expect(displayRepository.getDisplays).to.have.been.calledOnce;
        });
    });

})();