(function () {
    'use strict';

    describe('A book list view-model', function () {

        var BookListViewModel;

        beforeEach(angular.mock.module('main'));
        beforeEach(angular.mock.inject(function (_BookListViewModel_) {
            BookListViewModel = _BookListViewModel_
        }));

        it('should be a defined class.', function () {
            expect(BookListViewModel).to.be.a('function');
        });

        it('should have an empty collection of books by default.', function(){
            var viewModel = new BookListViewModel();

            expect(viewModel.books).to.be.an('array');
            expect(viewModel.books).to.have.length(0);
        });
        
    });

})();