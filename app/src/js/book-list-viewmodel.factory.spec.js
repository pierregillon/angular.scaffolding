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

        it('should have a load method', function(){
            var viewModel = new BookListViewModel();
            expect(viewModel.load).to.be.a('function');
        });

        it('should have an empty collection of books by default.', function(){
            var viewModel = new BookListViewModel();

            expect(viewModel.books).to.be.an('array');
            expect(viewModel.books).to.have.length(0);
        });

        it('should request first 30 books from repository when loaded.', function(){
            var viewModel = new BookListViewModel();

            viewModel.load();

            expect(bookRepository.getBooks).to.have.been.calledWith(0, 30);
        });

        it('should set book collection from book repository when loaded.', angular.mock.inject(function($q){
            bookRepository.getBooks.returns($q.when([{}, {}]));

            var viewModel = new BookListViewModel();

            viewModel.load();
            $rootScope.$apply();

            expect(viewModel.books).to.have.length(2);
        }));
    });

})();