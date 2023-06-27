const generateText = (username, text) => {
    return {
        username,
        text,
        currTime: new Date().getTime()
    }
}

const generateLocation = (username, link) => {
    return {
        username,
        link,
        currTime: new Date().getTime()
    }
}

module.exports = { generateText, generateLocation }