(function () {
    'use strict';

    describe('A marker service', function () {

        var $q;
        var $rootScope;
        var markerService;
        var displayRepository = {
            getDisplays: function () {
            }
        };

        beforeEach(angular.mock.module('map'));
        beforeEach(angular.mock.module(function ($provide) {
            $provide.service('displayRepository', function () {
                return displayRepository;
            });
        }));
        beforeEach(angular.mock.inject(function (_markerService_, _$q_, _$rootScope_) {
            markerService = _markerService_
            $q = _$q_;
            $rootScope = _$rootScope_;
        }));

        it('should be defined', function () {
            expect(markerService).to.be.an('object');
        });

        it('should have a "getMarkers" method', function () {
            expect(markerService.getMarkers).to.be.a('function');
        });

        it('should get displays from the display repository when calling getMarkers.', function () {
            displayRepository.getDisplays = sinon.stub();
            displayRepository.getDisplays.returns($q.resolve([]));

            markerService.getMarkers();

            expect(displayRepository.getDisplays).to.have.been.calledOnce;
        });

        it('should build marker from display when calling getMarkers.', function (done) {
            var data = [
                {id: 1, lat: 23, long: 44},
                {id: 2, lat: 34, long: 10},
                {id: 3, lat: 12.3, long: 33.8}
            ];

            displayRepository.getDisplays = sinon.stub();
            displayRepository.getDisplays.returns($q.resolve(data));

            markerService
                .getMarkers()
                .then(function (markers) {
                    expect(markers).to.eql([
                        {id: 1, coords: {latitude: 23, longitude: 44}, options: {}, events:{}},
                        {id: 2, coords: {latitude: 34, longitude: 10}, options: {}, events:{}},
                        {id: 3, coords: {latitude: 12.3, longitude: 33.8}, options: {}, events:{}}
                    ]);
                    done();
                });

            $rootScope.$apply();
        });
    });

})();