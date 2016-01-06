///<reference path="book.model.ts"/>

interface IBookRepository{
    getBooks():ng.IPromise<Array<Book>>;
}