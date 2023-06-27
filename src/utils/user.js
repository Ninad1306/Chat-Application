const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "Username and Room are to be entered."
        }
    }

    const existingUser = users.find(user => user.room === room && user.username === username)

    if (existingUser) {
        return {
            error: "Username already taken."
        }
    }

    const user = { id, username, room }

    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}

const getUser = (id) => {
    const user = users.find(user => user.id === id)
    if(!user){
        return {
            error: "No user found."
        }
    }
    
    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const roomUsers = users.filter(user => user.room === room)

    if(!roomUsers){
        return {error: "No users in room."}
    }

    return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

