const PORT = `3001`
const url = `http://localhost:${PORT}`

let users = [];
let friends = [];

// import variable from './modules/message.js'

document.addEventListener("DOMContentLoaded", function () {
    // create function (fetch) to check if token is valid

    checkLogStatus()
        .then(userActions())
    //if token valid
    // render login function
    //else token is not valid or undefined or nonexistent  

})

function checkLogStatus() {
    return fetch(`${url}/users/check`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": localStorage.getItem('token')
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            else {
                //    console.log( "bad")
                return "bad"
                // render logged out UI
            }
        })
        .then(data => {
            if (data === 'bad') {

                //handle later
                localStorage.setItem('enig_logged', "")
                loggedOutUI()
            } else {

                localStorage.setItem('enig_logged', true)
                loggedInUI()
                loadData()
            }
            //render logged in UI
        })
}

function renderEditAccount() {
    closeUAMenu();

    // fetch or load user-specific friends
    fetch(`http://localhost:3001/users/${localStorage.getItem('user_id')}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    })
        .then(r => r.json())
        .then(userData => {
            console.log(userData)
            const mainCW = document.querySelector('div.main-content-wrapper');
            mainCW.innerHTML = '';

            //create node for UI rendering
            const editMenu = document.createElement('div');
            editMenu.className = 'edit-menu';

            const editMenuContainer = document.createElement('div');
            editMenuContainer.className = 'edit-menu-container';

            const editMenuImage = document.createElement('div');
            editMenuImage.className = 'edit-menu-image';

            const editTitle = document.createElement('h3');
            editTitle.className = 'edit-title';
            editTitle.innerText = 'Edit your account';


            let firstName = document.createElement('p')
            let lastName = document.createElement('p')
            let uName = document.createElement('p')

            firstName.innerHTML = `First Name: <span>${userData.first_name}</span>`
            lastName.innerHTML = `Last Name: <span>${userData.last_name}</span>`



            uName.innerHTML = `Username: <span>${userData.username}</span>`


            let button = document.createElement('button')
            button.type = 'click'
            button.textContent = 'Edit your account'
            button.className = 'edit-account-btn'

            //append node to document
            editMenuContainer.append(editTitle, firstName, lastName, uName, button);
            editMenu.append(editMenuImage, editMenuContainer)
            mainCW.append(editMenu);

            button.addEventListener('click', () => editUserAccountInformation(userData))

        })
    //selection DOM node

    //append friends to list


}

function editUserAccountInformation(userData) {
    const mainCW = document.querySelector('div.main-content-wrapper');
    mainCW.innerHTML = '';

    //create node for UI rendering
    const editMenuContainer = document.createElement('div');
    editMenuContainer.className = 'edit-menu-container';

    let label = document.createElement('label')
    let label2 = document.createElement('label')
    let label3 = document.createElement('label')
    let label4 = document.createElement('label')
    let br = document.createElement('br')
    let br2 = document.createElement('br')
    let br3 = document.createElement('br')
    let br4 = document.createElement('br')
    let br5 = document.createElement('br')
    

    label.innerText = `First Name: `
    label2.innerText = `Last Name: `
    label3.innerText = 'Username: '
    label4.innerText = 'Password: '


    let form = document.createElement('form')
    let firstNameInput = document.createElement('input')
    firstNameInput.type = 'text'
    firstNameInput.className = 'first-name-input'
    firstNameInput.value = userData.first_name
    label.append(firstNameInput)

    let lastNameInput = document.createElement('input')
    lastNameInput.type = 'text'
    lastNameInput.className = 'last-name-input'
    lastNameInput.value = userData.last_name
    label2.append(lastNameInput)

    let usernameInput = document.createElement('input')
    usernameInput.className = 'username-input'
    usernameInput.type = 'text'
    usernameInput.value = userData.username
    label3.append(usernameInput)

    let passwordInput = document.createElement('input')
    passwordInput.className = 'password-input'
    passwordInput.type = 'password'
    passwordInput.value = userData.password
    label4.append(passwordInput)

    let submitButton = document.createElement('input')
    submitButton.type = 'submit'
    submitButton.textContent = 'Update User Information'
    submitButton.className = 'submit-btn'

    form.append(label, br, label2, br2, label3, br3, label4, br5, br4, submitButton)
    editMenuContainer.append(form)
    mainCW.append(editMenuContainer)

    form.addEventListener('submit', (e) => updateUserAccountInformation(e, userData))

}

function updateUserAccountInformation(e, userData) {
    e.preventDefault()
    fetch(`http://localhost:3001/users/${userData.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            'first_name': e.target.children[0].children[0].value,
            'last_name': e.target.children[2].children[0].value,
            'username': e.target.children[4].children[0].value,
            'password': e.target.children[6].children[0].value
        })
    })
    .then(r => r.json())
    .then(userData => renderEditAccount())

}


function userActions() {
    //select static ui elements which have functionality 
    const homeBtn = document.querySelector(`div.logo`)
    const userImg = document.querySelector(`img#user-avatar`)

    //add eventlisteners
    homeBtn.addEventListener("click", renderHome)
    userImg.addEventListener("click", handleUAClick)
}

function closeUAMenu() {
    let dropDownCont = document.querySelector('div.drop-down-menu');
    dropDownCont.className = 'drop-down-menu';
    dropDownCont.innerHTML = '';
}

function handleUAClick(e) {

    let dropDownCont = e.target.parentElement.nextElementSibling;

    if (dropDownCont.classList.value.split(" ").includes('show')) {
        closeUAMenu();
    } else {
        dropDownCont.className = 'drop-down-menu show';
        localStorage.getItem('enig_logged') ?
            renderDropDownLogout(dropDownCont) :
            renderDropDown(dropDownCont)
    }
}

function renderDropDown(dropDown) {

    let toggleBar = document.createElement('div');
    let registerBtn = document.createElement('div')
    let loginBtn = document.createElement('div')

    registerBtn.innerText = "Register"
    loginBtn.innerText = "Login"

    toggleBar.className = 'toggle-bar'
    registerBtn.className = 'register-button'
    loginBtn.className = 'login-button'
    toggleBar.dataset.formView = '1'
    //     //render the options 'Register / Login' 
    toggleBar.append(registerBtn, loginBtn)
    dropDown.appendChild(toggleBar)

    //     // depending on which is clicked, we can toggle the render function
    //     // callback function changes an attribute (dataset value) in the parent class
    registerBtn.addEventListener("click", () => {
        // debugger
        dropDown.innerHTML = ''
        dropDown.appendChild(toggleBar)
        toggleBar.dataset.formView = '2'
        renderRegisterForm(dropDown)
    })

    loginBtn.addEventListener("click", () => {
        dropDown.innerHTML = ''
        dropDown.appendChild(toggleBar)
        toggleBar.dataset.formView = '1'
        renderLoginForm(dropDown)
    })
}

function renderLoginForm(dropDown) {
    //create nodes

    let loginForm = document.createElement('form')
    loginForm.className = 'ua-form'

    let uname = document.createElement('label')
    let uninput = document.createElement('input')
    let upword = document.createElement('label')
    let upinput = document.createElement('input')
    let button = document.createElement('button')
    let pBreak = document.createElement('br')
    let pBreak2 = document.createElement('br')

    // add attibutes
    uname.className = 'login-label';
    upword.className = 'login-label';
    uninput.className = 'login-input';
    uninput.name = 'username';
    uninput.id = 'login-user';
    uninput.placeholder = 'Enter User Name';
    upinput.className = 'login-input';
    upinput.name = 'password';
    upinput.id = 'login-password';
    upinput.placeholder = 'Enter Password';
    upinput.type = 'password';

    uname.innerText = `User Name: `;
    upword.innerText = `Password: `;
    button.innerText = `Login`;
    button.type = 'submit';
    button.className = 'login-button'
    //append 
    
    loginForm.append(uname, uninput, pBreak, upword, upinput, pBreak2, button)
    dropDown.appendChild(loginForm)
    
    loginForm.addEventListener('submit', handleLoginSubmit)
    
    
}

function handleLoginSubmit(e) {
    e.preventDefault()
    const uName = e.target.username.value;
    const pWord = e.target.password.value;
    e.target.reset();
    
    fetch(`${url}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'user': {
                username: uName,
                password: pWord
            }
        })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('enig_logged', true);
        localStorage.setItem('user_id', data.user_id);
        loggedInUI();
        loadData();
        userActions();
    })
    
    //synchronously handle closing drop down menu
    closeUAMenu();
    
}

function renderRegisterForm(dropDown) {
    //create nodes
    
    let regForm = document.createElement('form')
    regForm.className = 'ua-form'
    
    let uname = document.createElement('label')
    let uninput = document.createElement('input')
    let upword = document.createElement('label')
    let upinput = document.createElement('input')
    let button = document.createElement('button')
    let firstNameLabel = document.createElement('label')
    let firstNameInput = document.createElement('input')
    let lastNameLabel = document.createElement('label')
    let lastNameInput = document.createElement('input')
    let pBreak = document.createElement('br')
    let pBreak2 = document.createElement('br')
    let pBreak3 = document.createElement('br')
    let pBreak4 = document.createElement('br')
    let pBreak5 = document.createElement('br')
    
    // add attibutes
    
    uname.className = 'login-label';
    upword.className = 'login-label';
    firstNameLabel.className = 'login-label';
    lastNameLabel.className = 'login-label';
    
    //user input
    uninput.className = 'login-input';
    uninput.name = 'username';
    uninput.id = 'register-user';
    uninput.placeholder = 'Enter User Name';
    
    //password input
    upinput.className = 'login-input';
    upinput.name = 'password';
    upinput.id = 'register-password';
    upinput.placeholder = 'Enter Password';
    upinput.type = 'password';
    
    //first name input
    firstNameInput.className = 'login-input';
    firstNameInput.name = 'firstname';
    firstNameInput.id = 'register-firstname';
    firstNameInput.placeholder = 'Enter First Name';
    
    //last name input
    lastNameInput.className = 'login-input';
    lastNameInput.name = 'lastname';
    lastNameInput.id = 'register-lastname';
    lastNameInput.placeholder = 'Enter Last Name';

    //button class
    button.className = 'login-button';
    
    //modify nodes
    firstNameLabel.innerText = 'First Name: '
    lastNameLabel.innerText = 'Last Name: '
    uname.innerText = `User Name: `;
    upword.innerText = `Password: `;
    button.innerText = `Register`;
    button.type = 'submit';
    
    //append 
    regForm.append(firstNameLabel, firstNameInput, pBreak,
        lastNameLabel, lastNameInput, pBreak2,
        uname, uninput, pBreak3,
        upword, upinput, pBreak4,
        button)
    dropDown.appendChild(regForm)

    regForm.addEventListener('submit', handleRegisterSubmit)


}

function handleRegisterSubmit(e) {
    e.preventDefault();
    // debugger
    fetch(`${url}/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "user": {
                first_name: e.target.firstname.value,
                last_name: e.target.lastname.value,
                username: e.target.username.value,
                password: e.target.password.value
            }
        })
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('token', data.token)
            localStorage.setItem('enig_logged', true)
            loggedInUI()
            loadData()
            userActions()
            closeUAMenu()
        })
    e.target.reset();

    
}

// render section

function renderChatWindow(){
    //close UA drop down menu
    closeUAMenu();

    // fetch or load user-specific friends

    //selection DOM node
    const mainCW = document.querySelector('div.main-content-wrapper');
    mainCW.innerHTML = '';

    //create node for UI rendering
    const roomsMenuContainer = document.createElement('div');
    roomsMenuContainer.className = 'chatrooms-menu-container';

    //append node to document
    mainCW.append(roomsMenuContainer);
    //append friends to list

    renderChatList();
}

function renderChatList() {
    //select node
    let roomsMenu = document.querySelector('div.chatrooms-menu-container');
    roomsMenu.innerHTML = '';

    const chatsListWrapper = document.createElement('div');
    chatsListWrapper.className = 'chats-list-wrapper';

    const chatsList = document.createElement('ul');
    chatsList.className = 'chats-list';

    const chatsTitle = document.createElement('h3');
    chatsTitle.className = 'chats-title';
    chatsTitle.innerText = 'These are your chatrooms';

    chatsListWrapper.appendChild(chatsList);

    //append node to document
    roomsMenu.append(chatsTitle, chatsListWrapper);

    //append friends to list

    loadChatInfo();
}

function renderChatInfo(c){

    // input object is {chatroom: cr, msg_count: cr.messages.count, last_msg: cr.messages.last} 

    const chatsList = document.querySelector('ul.chats-list')
    //create each node in the list

    let chatItemWrapper = document.createElement('li');
    chatItemWrapper.className = 'chat-item-wrapper'
    chatItemWrapper.id = `wrapper-${c.chatroom.id}`
    //name of chatroom
    let chatName = document.createElement('p');
    chatName.className = 'chat-item';
    !c.chatroom.chatroom_name ? chatName.innerText = `ID: ${c.chatroom.id}` : chatName.innerText = `Name: ${c.chatroom.chatroom_name}`

    //date created of chatroom
    let d = new Date(c.chatroom.created_at)
    let chatDate = document.createElement('p');
    chatDate.className = 'chat-item';
    chatDate.innerText = `Created: ${d.getUTCMonth()+1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
    
    //date of most recent message of chatroom
    let chatRecent;
    if (c.last_msg) {
        let d2 = new Date(c.last_msg.created_at)
        chatRecent = document.createElement('p');
        chatRecent.className = 'chat-item';
        chatRecent.innerText = `Last Sent: ${d2.getUTCMonth()+1}/${d2.getUTCDate()}/${d2.getUTCFullYear()}`;
    } else {
        chatRecent = document.createElement('p');
        chatRecent.className = 'chat-item';
        chatRecent.innerText = `No Messages Sent`;
    }

    //total number of message
    let chatTotal = document.createElement('p');
    chatTotal.className = 'chat-item';
    chatTotal.innerText = `Msgs: ${c.msg_count}`;

    //delete button
    let deleteButton = document.createElement('button')
    deleteButton.className = 'delete-chatroom-button'
    deleteButton.innerText = 'Delete'
    deleteButton.dataset.chatroomId = c.chatroom.id
    
    
    chatItemWrapper.append(chatName, chatDate, chatRecent, chatTotal, deleteButton)
    //append to container
    chatsList.appendChild(chatItemWrapper);
    
    deleteButton.addEventListener('click', deleteChatroom)

}

function renderNoChats() {
    const chatsList = document.querySelector('ul.chats-list')
    //create each node in the list
    let chatItem = document.createElement('li');
    chatItem.className = 'nil-chat-item';
    chatItem.style.listStyle = 'none';
    chatItem.innerText = 'Sorry you have not created a chatroom.';

    //append to container
    chatsList.appendChild(chatItem);
}

function renderFriendsWindow() {
    //close UA drop down menu
    closeUAMenu();

    //toggle switch

    let label = document.createElement('label');
    let input = document.createElement('input');
    let span = document.createElement('span');

    label.className = 'switch';
    span.className = 'slider round';
    input.type = 'checkbox';

    label.append(input, span);

    // fetch or load user-specific friends

    //selection DOM node
    const mainCW = document.querySelector('div.main-content-wrapper');
    mainCW.innerHTML = '';

    //create node for UI rendering
    const friendsMenuContainer = document.createElement('div');
    friendsMenuContainer.className = 'friends-menu-container';

    //append node to document
    mainCW.append(friendsMenuContainer, label);
    //append friends to list

    input.addEventListener("change", toggleFriends);
    renderUsersList();
}

function renderFriendsList() {
    //select node
    let friendsMenu = document.querySelector('div.friends-menu-container');
    friendsMenu.innerHTML = '';

    const friendsListWrapper = document.createElement('div');
    friendsListWrapper.className = 'friends-list-wrapper';

    const friendsList = document.createElement('ul');
    friendsList.className = 'friends-list';

    const friendsTitle = document.createElement('h3');
    friendsTitle.className = 'friends-title';
    friendsTitle.innerText = 'These are your friends';

    friendsListWrapper.appendChild(friendsList);

    //append node to document
    friendsMenu.append(friendsTitle, friendsListWrapper);

    //append friends to list

    loadFriends();
}

function renderUsersList() {
    let friendsMenu = document.querySelector('div.friends-menu-container');
    friendsMenu.innerHTML = '';

    const usersListWrapper = document.createElement('div');
    usersListWrapper.className = 'users-list-wrapper';

    const usersList = document.createElement('ul');
    usersList.className = 'users-list';

    const usersTitle = document.createElement('h3');
    usersTitle.className = 'users-title';
    usersTitle.innerText = 'User List';

    usersListWrapper.appendChild(usersList);


    //append node to document
    friendsMenu.append(usersTitle, usersListWrapper);

    //append friends to list

    loadUsers();
}

function toggleFriends() {
    if (this.checked) {
        renderFriendsList()
    } else {
        renderUsersList()
    }
}


function renderHome() {
    closeUAMenu();
    checkLogStatus();
}

// load or GET section

function loadFriends() {
    //get friends
    fetch(`${url}/groups`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(r => r.json())
        .then(friendsData => {
            console.log(friendsData)
            friendsData.friends_list.length > 0 ?
                friendsData.friends_list.forEach(friend => {
                    friends.push(friend);
                    renderFriend(friend);
                }) :
                renderNoFriends()
        })
    // [{name: "Mary"}, {name: "John"}, {name: "Tyler"}].forEach((friend) => {
    //     renderFriend(friend);
    // })
}

function renderNoFriends() {
    const friendsList = document.querySelector('ul.friends-list')
    //create each node in the list
    let friendItem = document.createElement('li');
    friendItem.className = 'nil-friend-item';
    friendItem.style.listStyle = 'none';
    friendItem.innerText = 'Sorry you have no friends. Go ahead and friend another user';

    //append to container
    friendsList.appendChild(friendItem);
}

function renderFriend(friend) {
    console.log(friend)
    const friendsList = document.querySelector('ul.friends-list')
    //create each node in the list
    let friendRow = document.createElement('li');
    friendRow.className = 'friend-row';

    let friendItem = document.createElement('div');
    friendItem.className = 'friend-item-wrapper';
    
    let friendItemUN = document.createElement('div');
    friendItemUN.className = 'friend-item';
    friendItemUN.innerHTML = `Username: <span>${friend.username}</span>`
    
    let friendItemFN = document.createElement('div');
    friendItemFN.className = 'friend-item';
    friendItemFN.innerHTML = `Full Name: <span>${friend.first_name} ${friend.last_name}</span>`;
    
    
    //append to list
    friendItem.append(friendItemUN, friendItemFN);
    friendRow.appendChild(friendItem);
    //append to container
    friendsList.appendChild(friendRow);

}

function loadChatrooms() {
    fetch(`${url}/chatrooms`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(chatroomList => {
            chatroomList.forEach((chatroom) => {
                // console.log(chatroom)
                renderChatroomOnList(chatroom)
            })
        })
}

function loadChatInfo() {
    fetch(`${url}/chatrooms-info`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(chatroomList => {
            console.log(chatroomList)
            if (chatroomList.chatrooms.length > 0 ) {
                chatroomList.chatrooms.forEach( c => renderChatInfo(c))
            } else {
                renderNoChats()
            }
        })
}

function loadUsers() {

    fetch(`${url}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(userData => {
            let userId = localStorage.getItem('user_id');
            userList = userData.users;
            users = userList;
            userList.forEach(u => {
                if (u.id !== parseInt(userId)) renderUser(u.user, u.isFriend);
            })
        })
}

function renderUser(user, isFriend) {

    const userMenu = document.querySelector('ul.users-list');

    const userEl = document.createElement('li');
    userEl.style.listStyle = 'none';

    const userItemWrapper = document.createElement('div');
    userItemWrapper.className = "user-item-wrapper";
    userItemWrapper.id = user.id;
    const userItemName = document.createElement('p');
    userItemName.className = "user-item-name";
    userItemName.innerText = `${user.username}`;
    const userItemJoined = document.createElement('p');
    userItemJoined.className = "user-item-join";
    let d = new Date(user.created_at);
    userItemJoined.innerText = `Joined: ${d.getUTCMonth()}/${d.getUTCDate()}/${d.getUTCFullYear()}`;

    if (isFriend) {
        const addedElement = document.createElement('p')
        addedElement.className = "user-added";
        addedElement.textContent = "Friend";
        userItemWrapper.append(userItemName, userItemJoined, addedElement);
    } else {
        const userItemBtn = document.createElement('button');
        userItemBtn.className = "user-item-btn";
        userItemBtn.textContent = "Add";
        userItemBtn.addEventListener("click", handleAddUser);
        userItemWrapper.append(userItemName, userItemJoined, userItemBtn);
    }

    userEl.appendChild(userItemWrapper);
    userMenu.appendChild(userEl);

}

function handleAddUser(e) {
    const targetUserItem = e.target.parentElement
    const userId = localStorage.getItem('user_id')

    fetch(`${url}/groups`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ friender_id: userId, friendee_id: targetUserItem.id })
    })
        .then(r => r.json())
        .then(data => {
            //update user list
            targetUserItem.lastChild.remove()
            //create new node
            const addedElement = document.createElement('p')
            addedElement.className = 'user-added'
            addedElement.innerText = 'Friend'
            //append
            targetUserItem.appendChild(addedElement)

        })

    //     targetUserItem.lastChild.textContent = 'Added'
    // console.log(targetUserItem.id, userId)
}
// render Encryption features

function loadEncryption() {

    renderTypes();

}

function loadData() {
    loadEncryption();
    loadChatrooms();
    newChatroom();
}

function loadFriendsData() {
    loadFriends();
    loadUsers();
}