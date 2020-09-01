function loggedOutUI() {
    //clear menu
    const mainCW = document.querySelector('div.main-content-wrapper')
    mainCW.innerHTML = ''

    //create new UI element
    const infoDiv = document.createElement('div')
    infoDiv.className = 'logged-out-div'
    
    //create nodes and fill with information
    const h3 = document.createElement('h3')
    h3.className = 'logout-text'
    h3.innerHTML = `Sorry, you are not logged in. Please <span>login</span> or <span>register</span>.`

    const image = document.createElement('img')
    image.src = 'https://www.101computing.net/wp/wp-content/uploads/enigma-machine-wwii.png'
    image.alt = 'enigma-machine'

    //append
    mainCW.appendChild(infoDiv)
    infoDiv.append(h3, image)

}