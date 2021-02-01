'use strict'


const STORAGE_KEY = 'booksDB';
var gBooks = [];
var gSortBy;
var gCurrPage = 0;


function booksToShow() {
    var books = gBooks.slice();
    if (gSortBy === 'title') {
        books.sort(function (a, b) {
            return a.title.localeCompare(b.title)
        })
    } else if (gSortBy === 'price') {
        books.sort(function (a, b) {
            return a.price > b.price ? 1 : -1
        })
    }
    return books.slice(gCurrPage * 5, gCurrPage * 5 + 5);
}

function getBook(id) {
    var book = gBooks.find(function (book) {
        return book.id === id
    })
    return book;
}

function createBooks() {
    var books = loadFromStorage(STORAGE_KEY);
    if (!books || !books.length) {
        books = [];
        for (var i = 1; i < 24; i++) {
            books.push(createBook())
        }
    }
    gBooks = books;
    saveBooksToStorage();  
}


function createBook(title = generateName(), price = getRandomIntInclusive(30, 500)) {
    var book = {
        id: +makeId(),
        title: title,
        price: price,
        rate: 7,
        imgURL: `img/${getRandomIntInclusive(1, 23)}.jpg`
    }
    return book;
}


function saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(id) {
    var idx = gBooks.findIndex(function (book) {
        return book.id === id
    })
    gBooks.splice(idx, 1);
    saveBooksToStorage();
}

function addBook(title, price) {
    var newBook = createBook(title, +price)
    gBooks.unshift(newBook);
    saveBooksToStorage();
}


function updateBook(id, price) {
    var book = gBooks.find(function (book) {
        return book.id === id
    })
    book.price = +price;
    saveBooksToStorage();
}


function changeRate(id, ifToUp) {
    var book = getBook(+id);
    var diff = ifToUp ? 1 : -1;
    if (book.rate + diff < 0 || book.rate + diff > 10) return book.rate;
    book.rate += diff;
    saveBooksToStorage();
    return book.rate;
}