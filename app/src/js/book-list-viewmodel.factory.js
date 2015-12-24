(function (angular) {
    'use strict';

    angular
        .module('main')
        .factory('BookListViewModel', factory);

    /* @ngInject */
    function factory(bookRepository) {
        return BookListViewModel;

        function BookListViewModel(){
            var self = this;

            self.books = [];
            self.load = function(){
                return bookRepository.getBooks(0, 30).then(function(books){
                    books.forEach(function(book){
                        self.books.push(book);
                    });
                });
            };
        }
    }

})(window.angular);