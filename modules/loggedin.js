
function loggedInUI() {

    const mainCW = document.querySelector('div.main-content-wrapper')
    mainCW.innerHTML = ''

    const leftPane = document.createElement('div')
    leftPane.className = `left-pane`;
    
    const menuWindow = document.createElement('section')
    menuWindow.className = 'menu-window'
    const menuTitle = document.createElement('h1')
    menuTitle.innerText = 'Menu'
    const toggleClass = document.createElement('div')
    toggleClass.className = 'toggle'

      
    const chatForm = document.createElement('form')
    chatForm.className = 'add-chat-form'
    const chatInput = document.createElement('input')
    chatInput.type = 'text'
    chatInput.className = 'add-chatroom-name'
    chatInput.placeholder = ''
    const chatBtn = document.createElement('button')
    chatBtn.setAttribute('id', 'add-chat')
    chatBtn.type = 'submit'
    chatBtn.innerText = 'Add Chatroom'
    
    
    const chatroomListWrapper = document.createElement('div')
    chatroomListWrapper.className = 'chatroom-list-wrapper'
    
    const chatroomList = document.createElement('div')
    chatroomList.className = 'chatroom-list'
    
    
    menuWindow.append(menuTitle, toggleClass)
    toggleClass.append(chatroomListWrapper)
    
    chatroomListWrapper.append(chatForm, chatroomList)
   
    chatForm.append(chatInput, chatBtn)
               
  
    let rightPane = document.createElement('div')
    rightPane.className = 'right-pane'

    let encryptionMenu = document.createElement('section')
    encryptionMenu.className = 'encryption-menu'

    let h1 = document.createElement('h1')
    h1.className = 'h1-encrypt-menu'
    h1.innerText = 'Encryption Menu'

    let messagingWindow = document.createElement('section')
    messagingWindow.className = 'messaging-window'

    encryptionMenu.appendChild(h1)
    leftPane.appendChild(menuWindow)
    rightPane.append(encryptionMenu, messagingWindow)

    mainCW.append(leftPane, rightPane)
}

function renderDropDownLogout(dropDown) {
    
    //clean up menu
    dropDown.innerHTML = ''

    //create nodes
    let logoutBtn = document.createElement('p')
    logoutBtn.className = 'logout-btn dropdown-item'
    logoutBtn.innerText = 'Logout'
    let dropDownChat = document.createElement('p')
    dropDownChat.className = 'dropdown-item'
    dropDownChat.innerText = 'Chats'
    let dropDownFriend = document.createElement('p')
    dropDownFriend.className = 'dropdown-item'
    dropDownFriend.innerText = 'Friends'
    let dropDownEdit = document.createElement('p')
    dropDownEdit.className = 'dropdown-item'
    dropDownEdit.innerText = 'Edit Account'

    //append nodes
    dropDown.append(dropDownEdit, dropDownChat, dropDownFriend, logoutBtn)

    //add event listeners to menu options
    logoutBtn.addEventListener('click', handleLogout)
    dropDownFriend.addEventListener('click', renderFriendsWindow)
    dropDownEdit.addEventListener('click', renderEditAccount)
   
 
}

function handleLogout() {
    closeUAMenu();
    localStorage.removeItem('token');
    localStorage.removeItem('enig_logged');
    loggedOutUI();
    userActions();
}