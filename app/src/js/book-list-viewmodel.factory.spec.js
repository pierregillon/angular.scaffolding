(function () {
    'use strict';

    describe('A book list view-model', function () {

        var BookListViewModel;
        var bookRepository;
        var $rootScope;

        beforeEach(angular.mock.module('main'));
        beforeEach(angular.mock.inject(function (_BookListViewModel_, _bookRepository_, $q, _$rootScope_) {
            BookListViewModel = _BookListViewModel_;
            $rootScope = _$rootScope_;

            bookRepository = _bookRepository_;
            bookRepository.getBooks = sinon.stub().returns($q.when([]));
        }));

        it('should be a defined class.', function () {
            expect(BookListViewModel).to.be.a('function');
        });

        describe('[behaviours]', function(){
            var viewModel;

            beforeEach(angular.mock.inject(function (_bookRepository_, $q, _$rootScope_) {
                $rootScope = _$rootScope_;

                viewModel = new BookListViewModel();

                bookRepository = _bookRepository_;
                bookRepository.getBooks = sinon.stub().returns($q.when([]));
            }));

            it('should have a load method', function(){
                expect(viewModel.load).to.be.a('function');
            });

            it('should have an empty collection of books by default.', function(){
                expect(viewModel.books).to.be.an('array');
                expect(viewModel.books).to.have.length(0);
            });

            it('should not be in loading state by default.', function(){
                expect(viewModel.isLoading).to.equal(false);
            });

            it('should request first 30 books from repository when loaded.', function(){
                viewModel.load();

                expect(bookRepository.getBooks).to.have.been.calledWith(0, 30);
            });

            it('should be in loading state when processing a load operation.', function(){
                viewModel.load();

                expect(viewModel.isLoading).to.equal(true);
            });

            it('should not be in loading state when load completed.', function(){
                viewModel.load();
                $rootScope.$apply();

                expect(viewModel.isLoading).to.equal(false);
            });

            it('should set book collection from book repository when loaded.', angular.mock.inject(function($q){
                bookRepository.getBooks.returns($q.when([{}, {}]));

                viewModel.load();
                $rootScope.$apply();

                expect(viewModel.books).to.have.length(2);
            }));
        });
    });

})();