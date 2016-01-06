/// <reference path="book.model.ts" />
/// <reference path="book.repository.contract.ts"/>

class BookRepository implements IBookRepository {
    static $inject = ['$q'];

    constructor(private promiseService:ng.IQService) {
    }

    getBooks():ng.IPromise<Array<Book>> {
        return this.promiseService.when([
            new Book('book1'),
            new Book('book2'),
            new Book('book3'),
            new Book('book4')
        ]);
    }
}

angular
    .module('poc')
    .service('BookRepository', BookRepository);