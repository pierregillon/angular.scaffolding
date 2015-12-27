(function () {
    'use strict';

    describe('A book list view-model', function () {

        var BookListViewModel;

        beforeEach(angular.mock.module('main'));
        beforeEach(angular.mock.inject(function (_BookListViewModel_) {
            BookListViewModel = _BookListViewModel_;
        }));

        it('should be a class.', function () {
            expect(BookListViewModel).to.be.a('function');
            expect(BookListViewModel.constructor).to.be.a('function');
        });

        describe('[behaviours]', function () {
            var $rootScope, $q;
            var viewModel;
            var bookRepository, card;
            var SOME_BOOK = {
                id: 1234,
                name: 'lord of the ring, two towers'
            };

            beforeEach(angular.mock.inject(function (_bookRepository_, _card_, _$q_, _$rootScope_) {
                $rootScope = _$rootScope_;
                $q = _$q_;

                viewModel = new BookListViewModel();

                bookRepository = _bookRepository_;
                bookRepository.getBooks = sinon.stub().returns($q.when([]));

                card = _card_;
                card.add = sinon.stub().returns($q.when());
            }));

            it('should have a load method', function () {
                expect(viewModel.load).to.be.a('function');
            });

            it('should have a addBookToCard method', function () {
                expect(viewModel.addBookToCard).to.be.a('function');
            });

            it('should have an empty collection of books by default.', function () {
                expect(viewModel.books).to.be.an('array');
                expect(viewModel.books).to.have.length(0);
            });

            it('should not be in loading state by default.', function () {
                expect(viewModel.isLoading).to.equal(false);
            });

            it('should request first 30 books from repository when loaded.', function () {
                viewModel.load();

                expect(bookRepository.getBooks).to.have.been.calledWith(0, 30);
            });

            it('should be in loading state when processing a load operation.', function () {
                viewModel.load();

                expect(viewModel.isLoading).to.equal(true);
            });

            it('should not be in loading state when load completed.', function () {
                viewModel.load();
                $rootScope.$apply();

                expect(viewModel.isLoading).to.equal(false);
            });

            it('should set book collection from book repository when loaded.', angular.mock.inject(function () {
                bookRepository.getBooks.returns($q.when([{}, {}]));

                viewModel.load();
                $rootScope.$apply();

                expect(viewModel.books).to.have.length(2);
            }));

            it('should add book id to card when adding book.', function () {
                bookRepository.getBooks.returns($q.when([SOME_BOOK]));

                $q.when()
                    .then(viewModel.load)
                    .then(function(){
                        return viewModel.addBookToCard(SOME_BOOK);
                    })
                    .then(function () {
                        expect(card.add).to.have.been.calledWith(SOME_BOOK.id);
                    });

                $rootScope.$apply();
            });

            it('should throw error when trying to add book to card that is not in the current book collection.', function () {
                $q.when()
                    .then(viewModel.load())
                    .then(function(){
                        expect(function () {
                            viewModel.addBookToCard(SOME_BOOK);
                        }).to.throw('Cannot add a book that is not in the current book collection.');
                    });

                $rootScope.$apply();
            });
        });
    });

})();