'use strict'



function init() {
    createBooks();
    renderBooks();
    createUsers();
    if (!localStorage.currUser) return;
    else renderLogin(loadFromStorage('currUser'))
}


function renderBooks() {
    var books = booksToShow();
    var strHTML = books.map(function (book) {
        return `<tr>
                    <td>${book.id}</td>
                    <td class="td-img"><img src="${book.imgURL}" alt="book image"></td>
                    <td>${book.title}</td>
                    <td>${book.price}</td>
                    <td class="read" onclick="onRead(${book.id})">Read</td>
                    <td class ="update td-${book.id}" onclick="onShowUpdate(this, ${book.id})">Update</td>
                    <td class="update-hidden hidden id-${book.id}"><input class="price-input-${book.id}" type="text" placeholder="New price"/>
                    <div class="hidden-buttons"><button class="add-book" onclick="onUpdateBook(${book.id})">Update</button>
                    <button class="cancel" onclick="onHideUpdate(${book.id})">cancel</button></div></td>
                    <td class="delete" onclick="onRemoveBook(${book.id})">Delete</td>
                </tr>`
    }).join('')
    document.querySelector('.books-to-render').innerHTML = strHTML;
    renderPaging();
}


function onRemoveBook(id) {
    var currUser = loadFromStorage('currUser')
    if (!currUser || !currUser.isAdmin) return
    removeBook(id);
    renderBooks();
}

function onAddBook() {
    var elTitle = document.querySelector('input[name="create-title"]');
    var elPrice = document.querySelector('input[name="create-price"]');
    var currUser = loadFromStorage('currUser')
    var isNums = /\D/.test(elPrice.value)    
    if (!(!currUser || !currUser.isAdmin || !elTitle.value || !elPrice.value || isNums)) {
        addBook(elTitle.value, elPrice.value);
    }
    elTitle.value = '';
    elPrice.value = '';
    renderBooks();
}


function onShowUpdate(elCell, id) {
    var currUser = loadFromStorage('currUser')
    if (!currUser || !currUser.isAdmin) return
    var elPrevShownUpdate = document.querySelector('.update.hidden')
    console.log('elPrevShownUpdate:', elPrevShownUpdate)
    if (elPrevShownUpdate) onHideUpdate(elPrevShownUpdate.id)
    elCell.classList.toggle('hidden');
    var elToShow = document.querySelector(`td.id-${id}`);
    elToShow.classList.toggle('hidden')
    elCell.id = `${id}`;
    document.querySelector(`.id-${id} input`).value = '';
}


function onHideUpdate(id) {
    var elCell = document.getElementById(id)
    elCell.classList.toggle('hidden')
    document.querySelector(`td.id-${id}`).classList.toggle('hidden')
}


function onUpdateBook(id) {
    var newPrice = document.querySelector(`.id-${id} input`).value
    var isNums = /\D/.test(newPrice)    
    if (!newPrice || isNums) return;
    updateBook(id, newPrice);
    renderBooks();
}

function onRead(id) {
    var elModal = document.querySelector('.modal');
    var book = getBook(id);
    document.querySelector('.modal img').src = book.imgURL;
    elModal.classList.toggle('modal-hidden');
    elModal.id = `${id}`
    document.querySelector('.book-name').innerText = book.title;
    document.querySelector('.prev-price').innerText = '$' + book.price;
    document.querySelector('.new-price').innerText = '$' + (parseInt(book.price * .8));
    document.querySelector('.rate span').innerText = book.rate;
}


function onCloseModal() {
    var elModal = document.querySelector('.modal')
    elModal.classList.toggle('modal-hidden')
}


function onChangeRate(ifToUp) {
    var currId = document.querySelector('.modal').id;
    var newRate = changeRate(currId, ifToUp);
    document.querySelector('.rate span').innerText = newRate;
}


function onSort(sortBy) {
    gSortBy = sortBy;
    renderBooks();
}

function onChangePage(diff) {
    if ((gCurrPage === 0 && diff === -1) || (gCurrPage >= parseInt(gBooks.length / 5) && diff === 1)) return
    gCurrPage += diff;
    renderBooks();
}

function onQuickChangePage(page) {
    if (gCurrPage === page) return;
    gCurrPage = page;
    renderBooks();
}

function renderPaging() {
    var pageCount = Math.ceil(gBooks.length / 5);
    var strHTML = '';
    for (var i = 0; i < pageCount; i++) {
        var className = (gCurrPage === i) ? 'paging curr-page' : 'paging';
        var currBtn = `<button class="${className}" onclick="onQuickChangePage(${i})">${i + 1}</button>`
        strHTML += currBtn;
    }
    document.querySelector('.paging-btns').innerHTML = strHTML;
}
