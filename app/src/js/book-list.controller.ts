/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="book.model.ts" />
/// <reference path="book.repository.contract.ts"/>

class HomeController {

    static $inject = ['BookRepository'];

    private books:Array<Book> = [];

    constructor(private bookRepository:IBookRepository) {
        this.load();
    }

    load():void {
        this.bookRepository.getBooks().then((books:Array<Book>) => {
            this.books = books;
        });
    }
}

angular
    .module('poc')
    .controller('bookListController', HomeController);