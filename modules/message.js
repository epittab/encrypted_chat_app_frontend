const webSocketUrl = 'ws://localhost:3001/cable'

//create socket
let socket = new WebSocket(webSocketUrl);

function renderChatroomOnList(chatroom){
    const list = document.querySelector('div.chatroom-list')
    const chatItem = document.createElement('div')
    chatItem.className = 'chatroom-item'
    
    const chatroomTitle = document.createElement('h3')
    // console.log(chatroomTitle, chatroom)
    
    chatroom.chatroom_name === null || chatroom.chatroom_name === '' ? chatroomTitle.innerText = `ID: ${chatroom.id}` : chatroomTitle.innerText = `Name: ${chatroom.chatroom_name}`

    // chatroomTitle.innerText = chatroom.chatroom_name
    
    let button = document.createElement('button')
    button.className='join-chatroom-button'
    button.dataset.chatroomId = chatroom.id
    button.innerText = 'Join'
    
    chatItem.append(chatroomTitle, button)
    
    list.append(chatItem)
    
    
    button.addEventListener('click', getChatroomInfo)
}

function deleteChatroom(e) {
    e.preventDefault()
    let cID = e.target.dataset.chatroomId
    fetch(`http://localhost:3001/chatrooms/${parseInt(cID)}`, {
        method: 'DELETE',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then( data => {
        //select the node
        let deleteNode = document.querySelector(`li#wrapper-${cID}`)
        // remove
        deleteNode.remove()
    })
    

}

function getChatroomInfo(e) {
    //close previous websocket connections, if connection exists
    
    if (socket.readyState === WebSocket.OPEN) {
        console.log('closing...')
        socket.close();
    } 
    
    //join room
    let id = e.target.dataset.chatroomId
    fetch(`${url}/chatrooms/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then( chatroomInstance => {
        console.log(chatroomInstance);
        renderChatroom(chatroomInstance)
    })
    createConnection(id)
}

function renderChatroom(chatroom) {
    const messageWindow = document.querySelector('section.messaging-window')
    messageWindow.innerHTML = ''

    let h3 = document.createElement('h3')
    h3.dataset.chatroomId = chatroom.id;
    chatroom.chatroom_name === null || chatroom.chatroom_name === '' ? h3.innerText = `ID: ${chatroom.id}` : h3.innerText = `Name: ${chatroom.chatroom_name}`

    let messageContainer = document.createElement('div')
    messageContainer.className = 'message-container'

    messageWindow.append(h3, messageContainer)

    chatroom.messages.forEach( message => {
        messageContainer.appendChild(renderMessage(message))
        
    })

    let messageFormWrapper = document.createElement('div');
    let form = document.createElement('form');
    form.className = 'chat-text-form'

    let input1 = document.createElement('input');
    input1.name = 'message';
    input1.id = 'reg-msg';
    input1.placeholder = 'Type your message';
    input1.className= 'chat-text-input';
    
    let encrypt = document.createElement('button');
    encrypt.innerText = 'Encrypt ';
    encrypt.className = 'chatroom-btns'
    
    let input2 = document.createElement('input');
    input2.name = 'encryptedMessage';
    input2.id = 'encrypt-msg';
    input2.placeholder = 'Your encrypted message';
    input2.className= 'chat-text-input';

    let submit = document.createElement('button');
    submit.className = 'chatroom-btns'
    submit.type = 'submit';
    submit.innerText = 'Submit'

    form.append(input1, encrypt, input2, submit)
    messageFormWrapper.append(form)
    messageWindow.append(messageFormWrapper)

    encrypt.addEventListener("click", encryptMessage )
    form.addEventListener("submit", handleMessageSubmit )

}

function renderMessage(message){
    // debugger
    let messageRow = document.createElement('div')
    let messageBody = document.createElement('div')
    let messageBtn = document.createElement('button')
    let column1 = document.createElement('div')
    let column2 = document.createElement('div')

    column1.className = 'message-body-column-1'
    column2.className = 'message-body-column-2'
    messageBody.append(column1, column2)
    
    messageBody.className = 'message-body-wrapper'

    messageRow.dataset.messageId = message.id
    messageRow.className = 'message-row'
    // debugger
    if (parseInt(localStorage.getItem('user_id')) === message.user_id){
        column2.textContent = message.message_text
        column2.style.backgroundColor = 'rgb(152, 231, 210)'
        column2.style.color = 'black'
    } else {
        column1.textContent = message.message_text
        column1.style.backgroundColor = 'rgb(30, 30, 30)'
        column1.style.color = 'lightgrey'
    }

    
    messageBtn.innerText = "Decrypt"
    messageBtn.className = 'chatroom-btns'
    messageBtn.addEventListener("click", decryptMessage )

    messageRow.append(messageBody, messageBtn)
    

    return messageRow;
}


function decryptMessage(e) {
    
    let textField = e.target.previousElementSibling.innerText
    // console.log(e);
    const encryption_type = document.querySelector('select#encrypt-type')
    
    if (encryption_type.value === '1') {
        
        // make the message object { }
        let messageObject = {
            message: textField,
            type: encryption_type.value,
            key: "None"
        } 
        // call getEncryption(message)
        getDecryption(messageObject);
    } else if (encryption_type.value === '2') {
        const encryption_key = document.querySelector('select#key-type')
        let messageObject = {
            message: textField,
            type: encryption_type.value,
            key: encryption_key.value
        } 
        getDecryption(messageObject);
    } else {
        
        let messageObject = {
            message: textField,
            type: encryption_type.value,
            key: generateEngimaKeyString()
        } 
        getDecryption(messageObject);
    }
    
    
}

function getDecryption(message_obj){
    
    // {message: "string", type: "string_of_a_number", key: "whatever"}
    fetch(`${url}/encryptions/decrypt`, {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(message_obj)
    })
    .then(res => res.json())
    .then( data => {
        alert(data.message)
    })
}

function encryptMessage(e) {
    console.log('encrypted!')
    const encryption_type = document.querySelector('select#encrypt-type')
    const textField = document.querySelector('input#reg-msg')
    
    // need the unencrypted text from the first input field
    if (encryption_type.value === '1') {
        // make the message object { }
        let messageObject = {
            message: textField.value,
            type: encryption_type.value,
            key: "None"
        } 
        // call getEncryption(message)
        getEncryption(messageObject);
    } else if (encryption_type.value === '2') {
        const encryption_key = document.querySelector('select#key-type')
        let messageObject = {
            message: textField.value,
            type: encryption_type.value,
            key: encryption_key.value
        } 
        getEncryption(messageObject);
     }  
     else {
        // const encryption_key = document.querySelector('select#key-type')
        let messageObject = {
            message: textField.value,
            type: encryption_type.value,
            key: generateEngimaKeyString()
        } 
        getEncryption(messageObject);
    }
    
}

function getEncryption(message_obj){
        
    // {message: "string", type: "string_of_a_number", key: "whatever"}
    fetch(`${url}/encryptions`, {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(message_obj)
    })
    .then(res => res.json())
    .then( encryption_obj => {
        let encrypt_input = document.querySelector('input#encrypt-msg')
        encrypt_input.value = encryption_obj.message
      
    })
}

function handleMessageSubmit(e) {
  
    e.preventDefault()
    let obj = { 'message': {
        message_text: e.target.encryptedMessage.value,
        chatroom_id: e.target.parentElement.parentElement.firstChild.dataset.chatroomId
    }}
    fetch(`${url}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(obj)
    })
    
    e.target.reset()
}

function createConnection(chatroom_id) {
    
    socket = new WebSocket(webSocketUrl);

    // socket.close()
    // socket.open()


    socket.onopen = function() {
        console.log('WebSocket is connected.');

        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                id: chatroom_id,
                channel: 'ChatroomChannel'
            })
        };

        socket.send(JSON.stringify(msg));
    };

    socket.onclose = function() {
        console.log('WebSocket is closed.');
    }

    socket.onmessage = function(e) {
        const response = e.data;
        const msg = JSON.parse(response)
        
        
        if (msg.type === 'ping') {
            return;
        }

        console.log(e)
        console.log("FROM RAILS: ", msg)
        

        if (msg.message) {
            let messageContainer = document.querySelector('div.message-container')
            messageContainer.appendChild(renderMessage(msg.message))
        }
    };

    socket.onerror = function(err) {
        console.log(`WebSocket Travesty: ${err}`)
    }

}

function newChatroom() {
    const newChatroomForm = document.querySelector('form.add-chat-form')
    newChatroomForm.addEventListener('submit', (e) => {
        // debugger;
        e.preventDefault();
        fetch(`${url}/chatrooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                chatroom_name: e.target.firstElementChild.value
            })
        })
        .then(resp => resp.json())
        .then(newChatroom => renderChatroomOnList(newChatroom))
        e.target.reset()
    })
    // newChatroomForm.reset();
}