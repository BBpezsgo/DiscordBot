const Discord = require('discord.js')
const fs = require('fs')

function TryGetUser(id) {
    if (!fs.existsSync('./cache/')) { return undefined }
    if (!fs.existsSync('./cache/users.json')) { return undefined }
    
    /** @type {Discord.User[]} */
    const users = JSON.parse(fs.readFileSync('./cache/users.json', { encoding: 'utf-8' }))
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            return users[i]
        }
    }
    return undefined
}

/** @param {Discord.Client} client */
function GetUsers(client) {
    if (!fs.existsSync('./cache/')) { return [] }
    if (!fs.existsSync('./cache/users.json')) { return [] }

    /** @type {Discord.User[]} */
    const users = JSON.parse(fs.readFileSync('./cache/users.json', { encoding: 'utf-8' }))
    if (client !== undefined) {
        for (let i = 0; i < users.length; i++) {
            users[i] = new Discord.User(client, users[i])        
        }
    }
    return users
}

/** @param {Discord.Client} client */
function SaveUsers(client) {
    if (!fs.existsSync('./cache/')) {
        fs.mkdirSync('./cache/')
    }
    if (!fs.existsSync('./cache/users.json')) {
        fs.writeFileSync('./cache/users.json', '[]', { encoding: 'utf-8' })
    }

    const users = client.users.cache.toJSON()
    /** @type {Discord.User[]} */
    const usersSaved = JSON.parse(fs.readFileSync('./cache/users.json', { encoding: 'utf-8' }))

    for (let i = 0; i < usersSaved.length; i++) {
        var found = false
        for (let j = 0; j < users.length; j++) {
            const user = users[j]
            if (user.id == usersSaved[i].id) {
                found = true
                break
            }
        }
        if (!found) {
            users.push(usersSaved[i])
        }
    }

    fs.writeFileSync('./cache/users.json', JSON.stringify(users, undefined, ' '), { encoding: 'utf-8' })
}

/** @param {Discord.Client} client */
function SaveAll(client) {
    if (!fs.existsSync('./cache/')) {
        fs.mkdirSync('./cache/')
    }
    SaveUsers(client)
}

module.exports = { SaveAll, SaveUsers, TryGetUser, GetUsers }
