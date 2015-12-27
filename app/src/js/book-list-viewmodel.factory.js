(function (angular) {
    'use strict';

    angular
        .module('main')
        .factory('BookListViewModel', factory);

    /* @ngInject */
    function factory(bookRepository, card) {
        return BookListViewModel;

        function BookListViewModel() {
            var self = this;

            self.isLoading = false;
            self.books = [];
            self.load = function () {
                self.isLoading = true;
                return bookRepository.getBooks(0, 30).then(function (books) {
                    books.forEach(function (book) {
                        self.books.push(book);
                    });
                    self.isLoading = false;
                });
            };
            self.addBookToCard = function(book){
                if(self.books.indexOf(book) === -1){
                    throw new Error('Cannot add a book that is not in the current book collection.');
                }
                return card.add(book.id);
            };
        }
    }

})(window.angular);