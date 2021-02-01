'use strict'

const USERS_KEY = 'usersDB'

var gUsers;
var gSort;

function chekUser(userName, password) {
    var user = gUsers.find(function (curr) {
        return curr.userName === userName && curr.password === password;
    })
    return user;
}

function setSort(sortBy) {
    gSort = sortBy;
}

function dynamicSort(property) {
    if (property === 'userName') {
        return function (a, b) {
            var res = (a[property].toLowerCase() > b[property.toLowerCase()]) ? -1 : (a[property].toLowerCase() < b[property].toLowerCase()) ? 1 : 0;
            return res * -1;
        }
    } else {
        return function (a, b) {
            var res = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            return res;
        }
    }
}


function getUsersToShow() {
    gUsers = loadFromStorage(USERS_KEY).sort(dynamicSort(gSort));
    return gUsers
}

function updateLoginTime(id, date) {
    var userIdx = gUsers.findIndex(function (curr) {
        return curr.id === id;
    })
    gUsers[userIdx].lastLoginTime = date;
    saveUsersToStorage();
}


function createUser(name, password, isAdmin) {
    var user = {
        id: makeUserId(),
        userName: name,
        password: password,
        lastLoginTime: Date.now(),
        isAdmin: isAdmin
    }
    gUsers.push(user);
    saveUsersToStorage();
    return user
}

function createUsers() {
    var users = loadFromStorage(USERS_KEY);
    if (!users || !users.length) {
        users = [
            {
                id: 'u102',
                userName: 'ben',
                password: '1',
                lastLoginTime: 1601891998864,
                isAdmin: true
            },
            {
                id: 'u103',
                userName: 'tom',
                password: 'secret',
                lastLoginTime: 1601891998864,
                isAdmin: false
            }
        ];
    }
    gUsers = users;
    saveUsersToStorage();
}


function removeUser(id) {
    var idx = gUsers.findIndex(function (user) {
        return user.id === id
    })
    if (gUsers[idx].id === loadFromStorage('currUser').id) return
    gUsers.splice(idx, 1);
    saveUsersToStorage();
}

function saveUsersToStorage() {
    saveToStorage(USERS_KEY, gUsers);
}

function makeUserId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}