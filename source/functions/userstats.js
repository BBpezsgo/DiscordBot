const fs = require('fs')

function userstatsSendMeme(database, user) {
    database.dataUserstats[user.id].memes += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

function userstatsSendMusic(database, user) {
    database.dataUserstats[user.id].musics += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

function userstatsSendYoutube(database, user) {
    database.dataUserstats[user.id].youtubevideos += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

function userstatsSendMessage(database, user) {
    database.dataUserstats[user.id].messages += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

function userstatsSendChars(database, user, text) {
    database.dataUserstats[user.id].chars += text.length
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

function userstatsSendCommand(database, user) {
    database.dataUserstats[user.id].commands += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

function userstatsAddUserToMemory(database, user) {
    if (!database.dataUserstats[user.id]) {
        database.dataUserstats[user.id] = {}
    }
    if (!database.dataUserstats[user.id].name) {
        database.dataUserstats[user.id].name = user.username
    }
    if (!database.dataUserstats[user.id].memes) {
        database.dataUserstats[user.id].memes = 0
    }
    if (!database.dataUserstats[user.id].musics) {
        database.dataUserstats[user.id].musics = 0
    }
    if (!database.dataUserstats[user.id].youtubevideos) {
        database.dataUserstats[user.id].youtubevideos = 0
    }
    if (!database.dataUserstats[user.id].messages) {
        database.dataUserstats[user.id].messages = 0
    }
    if (!database.dataUserstats[user.id].chars) {
        database.dataUserstats[user.id].chars = 0
    }
    if (!database.dataUserstats[user.id].commands) {
        database.dataUserstats[user.id].commands = 0
    }
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

module.exports = {
    userstatsSendMeme,
    userstatsSendMusic,
    userstatsSendYoutube,
    userstatsSendMessage,
    userstatsSendChars,
    userstatsSendCommand,
    userstatsAddUserToMemory
}