'use strict'



function onInit() {
    createUsers()
    if (!localStorage.currUser) return;
    else renderLogin(loadFromStorage('currUser'))
}

function onPassword(ev) {
    ev.preventDefault();
    onLogin()
}


function onLogin() {
    var ElUserame = document.querySelector('input[name=username]')
    var userName = ElUserame.value;
    var ElPassword = document.querySelector('input[name=password]')
    var password = ElPassword.value;
    ElUserame.value = '';
    ElPassword.value = '';

    var user = chekUser(userName, password)

    if (!user) {
        console.log('Try again!');
    } else {
        updateLoginTime(user.id, Date.now())
        console.log('user:', user)
        renderLogin(user)
        console.log('user.lastLoginTime:', user.lastLoginTime)
        saveToStorage('currUser', user)
    }
}


function renderLogin(user) {
    console.log('Welcome!', user.userName);

    // var elUserName = document.querySelector('.username h3')
    // elUserName.innerText = 'Welcome back, ' + user.userName
    // document.querySelector('.password h3').innerText = ''


    var elUserName = document.querySelector('.logout span')
    elUserName.innerText = user.userName;
    var elLogin = document.querySelector('.login-container')
    elLogin.classList.toggle('hidden')
    var elLogout = document.querySelector('.logout')
    elLogout.classList.toggle('hidden')
    // if (user.isAdmin) {
    //     var elAdminLink = document.querySelector('.admin-link')
    //     elAdminLink.classList.toggle('hidden')
    // }
}


function onLogout() {
    // location = 'index.html'
    localStorage.removeItem('currUser')

    // var elLogout = document.querySelector('.logout')
    // elLogout.classList.toggle('hidden')
    renderLogout()
}


function renderLogout() {
    if (location.pathname === '/admin.html') {
        location = 'index.html'
    }
    var elLogin = document.querySelector('.login-container')
    elLogin.classList.toggle('hidden')

    var elLogout = document.querySelector('.logout')
    elLogout.classList.toggle('hidden')
}

function goBack() {
    location = 'index.html'
}




function renderTable() {
    var currUser = loadFromStorage('currUser')
    if (!currUser || !currUser.isAdmin) location = 'index.html'
    var users = getUsersToShow();

    var strHTML = users.map(function (user) {
        console.log('user:', user)

        return `<tr><td>${user.userName}</td><td>${user.password}</td>
                <td>${timestampToDate(user.lastLoginTime)}</td><td>${user.isAdmin}</td>
                <td><button onclick="onRemoveUser('${user.id}', event)">x</button></td></tr>`
    }).join('')

    var elTable = document.querySelector('.toRender')
    elTable.innerHTML = strHTML;
}

function timestampToDate(timestamp) {
    var year = new Date(timestamp).getFullYear();
    var month = new Date(timestamp).getMonth() + 1
    var date = ('0' + new Date(timestamp).getDate()).slice(-2);
    var hours = ('0' + new Date(timestamp).getHours()).slice(-2);
    var minutes = ('0' + new Date(timestamp).getMinutes()).slice(-2);
    var seconds = ('0' + new Date(timestamp).getSeconds()).slice(-2);
    return year + '/' + month + '/' + date + ' - ' + hours + ':' + minutes + ':' + seconds;
}

function createNewUser() {
    var elCreateName = document.querySelector('input[name=createUser]')
    var elCreatePassword = document.querySelector('input[name=createPassword]')
    var elIsAdmin = document.querySelector('select[name=isAdmin]')
    var newName = elCreateName.value;
    elCreateName.value = ''
    var newPassword = elCreatePassword.value
    elCreatePassword.value = ''
    var isAdmin = (elIsAdmin.value === 'true') ? true : false;
    if (!newName || !newPassword) return;
    createUser(newName, newPassword, isAdmin)
    renderTable();

}



function onSetSort(sortBy) {
    setSort(sortBy)
    renderTable();

}


function onRemoveUser(userId, ev) {
    ev.stopPropagation();
    removeUser(userId);
    renderTable();
}