const Discord = require('discord.js')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

function TryGetUser(id) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) { return undefined }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/users.json'))) { return undefined }
    
    /** @type {Discord.User[]} */
    const users = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/users.json'), { encoding: 'utf-8' }))
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            return users[i]
        }
    }
    return undefined
}

/** @param {Discord.Client} client */
function GetUsers(client) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) { return [] }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/users.json'))) { return [] }

    /** @type {Discord.User[]} */
    const users = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/users.json'), { encoding: 'utf-8' }))
    if (client !== undefined) {
        for (let i = 0; i < users.length; i++) {
            users[i] = new Discord.User(client, users[i])        
        }
    }
    return users
}

/** @param {Discord.Client} client */
function GetGuilds(client) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) { return [] }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/guilds.json'))) { return [] }

    /** @type {Discord.Guild[]} */
    const guilds = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/guilds.json'), { encoding: 'utf-8' }))
    if (client !== undefined) {
        for (let i = 0; i < guilds.length; i++) {
            guilds[i] = new Discord.Guild(client, guilds[i])        
        }
    }
    return guilds
}

/** @param {Discord.Client} client */
function SaveUsers(client) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) {
        fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/'))
    }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/users.json'))) {
        fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/users.json'), '[]', { encoding: 'utf-8' })
    }

    const users = client.users.cache.toJSON()
    /** @type {Discord.User[]} */
    const usersSaved = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/users.json'), { encoding: 'utf-8' }))

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

    fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/users.json'), JSON.stringify(users, undefined, ' '), { encoding: 'utf-8' })
}

/** @param {Discord.Client} client */
function SaveGuilds(client) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) {
        fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/'))
    }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/guilds.json'))) {
        fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/guilds.json'), '[]', { encoding: 'utf-8' })
    }

    const guilds = client.guilds.cache.toJSON()
    /** @type {Discord.Guild[]} */
    const guildsSaved = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/guilds.json'), { encoding: 'utf-8' }))

    for (let i = 0; i < guildsSaved.length; i++) {
        var found = false
        for (let j = 0; j < guilds.length; j++) {
            const user = guilds[j]
            if (user.id == guildsSaved[i].id) {
                found = true
                break
            }
        }
        if (!found) {
            guilds.push(guildsSaved[i])
        }
    }

    fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/guilds.json'), JSON.stringify(guilds, undefined, ' '), { encoding: 'utf-8' })
}

/** @param {Discord.Client} client @param {string} guildID */
function GetMembers(client, guildID) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) { return [] }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, `./cache/members-${guildID}.json`))) { return [] }

    /**
      @type {{
        id: string
        nickname: nickname
      }[]} */
    const members = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, `./cache/members-${guildID}.json`), { encoding: 'utf-8' }))
    return members
}

/** @param {Discord.Client} client @param {Discord.Guild} guild */
function SaveMembers(client, guild) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) {
        fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/'))
    }
    if (!fs.existsSync(Path.join(CONFIG.paths.base, `./cache/members-${guild.id}.json`))) {
        fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/members-${guild.id}.json`), '[]', { encoding: 'utf-8' })
    }

    /**
      @type {{
        id: string
        nickname: nickname
      }[]} */
    const members = []
    guild.members.cache.forEach(member => {
        members.push({
            id: member.id,
            nickname: member.nickname ?? member.user.username,
        })
    })
    /**
      @type {{
        id: string
        nickname: nickname
      }[]} */
    const membersSaved = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, `./cache/members-${guild.id}.json`), { encoding: 'utf-8' }))

    for (let i = 0; i < membersSaved.length; i++) {
        var found = false
        for (let j = 0; j < members.length; j++) {
            const member = members[j]
            if (member.id == membersSaved[i].id) {
                found = true
                break
            }
        }
        if (!found) {
            members.push(membersSaved[i])
        }
    }

    fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/members-${guild.id}.json`), JSON.stringify(members, undefined, ' '), { encoding: 'utf-8' })
}

/** @param {Discord.Client} client */
function SaveAll(client) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/'))) {
        fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/'))
    }
    SaveUsers(client)
}

module.exports = { SaveAll, SaveUsers, TryGetUser, GetUsers, SaveGuilds, GetGuilds, GetMembers, SaveMembers }
