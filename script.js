const PORT = `3001`
const url = `http://localhost:${PORT}`

let users = [];

// import variable from './modules/message.js'

document.addEventListener("DOMContentLoaded", function() {
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


function userActions(){
    //select static ui elements which have functionality 
    const homeBtn = document.querySelector(`div.logo`)
    const userImg = document.querySelector(`img#user-avatar`)

    //add eventlisteners
    homeBtn.addEventListener("click", renderHome)
    userImg.addEventListener("click", handleUAClick)
}

function closeUAMenu(){
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
    uninput.className = 'login-input';
    uninput.name = 'username';
    uninput.id = 'login-user';
    uninput.placeholder = 'User Name';
    upinput.className = 'login-input';
    upinput.name = 'password';
    upinput.id = 'login-password';
    upinput.placeholder = 'Password';
    upinput.type = 'password';
    
    uname.innerText = `User Name: `;
    upword.innerText = `Password: `;
    button.innerText = `Login`;
    button.type = 'submit';
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
        body: JSON.stringify({'user': {
            username: uName,
            password: pWord
        }})
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('token', data.token );
        localStorage.setItem('enig_logged', true );
        localStorage.setItem('user_id', data.user_id );
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
    
    //user input
    uninput.className = 'reg-input';
    uninput.name = 'username';
    uninput.id = 'register-user';
    uninput.placeholder = 'User Name';

    //password input
    upinput.className = 'reg-input';
    upinput.name = 'password';
    upinput.id = 'register-password';
    upinput.placeholder = 'Password';
    upinput.type = 'password';

    //first name input
    firstNameInput.className = 'reg-input';
    firstNameInput.name = 'firstname';
    firstNameInput.id = 'register-firstname';
    firstNameInput.placeholder = 'First Name';

    //last name input
    lastNameInput.className = 'reg-input';
    lastNameInput.name = 'lastname';
    lastNameInput.id = 'register-lastname';
    lastNameInput.placeholder = 'Last Name';

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

function handleRegisterSubmit(e){
    e.preventDefault();
    // debugger
    fetch(`${url}/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({"user": {
            first_name: e.target.firstname.value,
            last_name: e.target.lastname.value,
            username: e.target.username.value,
            password: e.target.password.value
        }})
    })
    .then(res => res.json())
    .then( data => {
        localStorage.setItem('token', data.token )
        localStorage.setItem('enig_logged', true )
        loggedInUI()
        loadData()
        userActions()
    })
    e.target.reset();

    const userDiv = document.querySelector(`div.user-details`)
    let dropDown = userDiv.nextElementSibling
    dropDown.style.display = 'none'
    dropDown.innerHTML = ''
}

// render section

function renderFriendsWindow() {
    //close UA drop down menu
    closeUAMenu();

    // fetch or load user-specific friends
    
    //selection DOM node
    const mainCW = document.querySelector('div.main-content-wrapper');
    mainCW.innerHTML = '';
    
    //create node for UI rendering
    const friendsMenuContainer = document.createElement('div');
    friendsMenuContainer.className = 'friends-menu-container';
    
    const userListWrapper = document.createElement('div')
    userListWrapper.className = 'user-list-wrapper'
    const userList = document.createElement('ul')
    userList.className = 'users-list'
    
    const friendsListWrapper = document.createElement('div')
    friendsListWrapper.className = 'friends-list-wrapper'
    const friendsList = document.createElement('ul')
    friendsList.className = 'friends-list'
    
    const friendsTitle = document.createElement('h3');
    friendsTitle.className = 'friends-title';
    friendsTitle.innerText = 'These are your friends';
    
    userListWrapper.appendChild(userList)
    friendsListWrapper.appendChild(friendsList)
    
    //append node to document
    friendsMenuContainer.append(friendsTitle, friendsListWrapper, userListWrapper);
    mainCW.appendChild(friendsMenuContainer);
    //append friends to list
    
    loadFriends();
    loadUsers();
}

function renderHome(){
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
                // console.log(friendsData)
                friendsData.length > 0 ? 
                friendsData.forEach(friend => renderFriend(friend)) :
                renderNoFriends()
            })
            // [{name: "Mary"}, {name: "John"}, {name: "Tyler"}].forEach((friend) => {
            //     renderFriend(friend);
            // })
}

function renderNoFriends(){
    const friendsList = document.querySelector('ul.friends-list')
    //create each node in the list
    let friendItem = document.createElement('li');
    friendItem.className = 'nil-friend-item';
    friendItem.style.listStyle = 'none';
    friendItem.innerText = 'Sorry you have no friends. Go ahead and friend another user';

    //append to container
    friendsList.appendChild(friendItem);
}

function renderFriend(friend){
   
    const friendsList = document.querySelector('ul.friends-list')
    //create each node in the list
    let friendItem = document.createElement('li');
    friendItem.className = 'friend-item';
    friendItem.innerText = friend.username;

    //append to container
    friendsList.appendChild(friendItem);

}

function loadChatrooms(){
    fetch(`${url}/chatrooms`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(res => res.json() )
    .then( chatroomList => {
        chatroomList.forEach((chatroom) => {
            console.log(chatroom)
            renderChatroomOnList(chatroom)
        })
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
    .then(res => res.json() )
    .then( userList => {
        let userId = localStorage.getItem('user_id');
        users = userList;
        userList.forEach(user=>{
            if (user.id !== parseInt(userId)) renderUser(user);
        })
    })
}

function renderUser(user) {
    console.log(user)
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
    const userItemBtn = document.createElement('button');
    userItemBtn.className = "user-item-btn";
    userItemBtn.textContent = "Add";

    userItemWrapper.append(userItemName, userItemJoined, userItemBtn);
    userEl.appendChild(userItemWrapper);
    userMenu.appendChild(userEl);

    userItemBtn.addEventListener("click", handleAddUser);
}

function handleAddUser(e){
    const targetUserItem = e.target.parentElement
    const userId = localStorage.getItem('user_id')

    fetch(`${url}/groups`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({friender_id: userId, friendee_id: targetUserItem.id})
    })
    .then( r => r.json())
    .then( data => {
        //update user and friend list
        targetUserItem.lastChild.remove() 
        //create new node
        const addedElement = document.createElement('p')
        addedElement.className = 'user-friended'
        addedElement.innerText = 'Added'
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

function loadFriendsData(){
    loadFriends();
    loadUsers();
}