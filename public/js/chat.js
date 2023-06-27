const socket = io()

const messageForm = document.querySelector('#msgForm')
const msgInp = messageForm.querySelector('input')
const userLoc = document.getElementById('loc')
const msgSend = document.getElementById('msgSend')
const messages = document.getElementById('messages')

// template
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate,{
        message: msg.text,
        currTime: moment(msg.currTime).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    msgSend.setAttribute('disabled', 'disabled')

    socket.emit('sendMessage', msgInp.value, (msg) => {
        console.log(msg)
        msgInp.value = ''
        msgSend.removeAttribute('disabled')
    })
})

socket.on('locationMessage', (msg) => {
    // console.log(url)
    const html = Mustache.render(locationTemplate,{
        username: msg.username,
        link: msg.link,
        currTime: moment(msg.currTime).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)})

userLoc.addEventListener('click',() => {
    if(! navigator.geolocation){
        return alert("Geolocation not supported in your browser.")
    }
    userLoc.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location',{ lat: position.coords.latitude, long: position.coords.longitude},() => {
            console.log('Location Shared!')
            userLoc.removeAttribute('disabled')
        })
        // console.log(position)
    })
})

socket.emit('join',{ username, room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
