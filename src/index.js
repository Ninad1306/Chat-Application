const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateText, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    // console.log("Client connected")

    socket.on('join', ({ username, room },callback) => {
        const {error, user} = addUser({id: socket.id, username, room})

        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit("message", generateText('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('message', generateText('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("message", generateText(user.username, msg))
        callback("Delivered")
    })

    socket.on('location', (coord, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateLocation(user.username,`https://www.google.com/maps?q=${coord.lat},${coord.long}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateText('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log(`app listening on port ${port}...`)
})