const HAR = require('./har')
const fs = require('fs')
const Types = require('./har-discord-browser')
const Path = require('path')
const ImageCache = require('./image-cache')

const RESULT_PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/cache/har/'
const INPUT_PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/hars'
const MANUAL_PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/manual-data/'

/**
 * @param {fs.PathLike} path
 */
function GetJsons(path) {
    /** @type {string[]} */
    const res = []

    if (!fs.existsSync(path)) { return res }

    const files = fs.readdirSync(path, { recursive: false, withFileTypes: true })
    for (const file of files) {
        if (!file.isFile()) { continue }
        if (Path.extname(file.name).toLowerCase() !== '.json') { continue }
        res.push(Path.basename(file.name).toLowerCase().replace('.json', ''))
    }

    return res
}

function GetEntries() {
    const folder = INPUT_PATH
    const files = fs.readdirSync(folder, { withFileTypes: true })

    const entries = []

    for (const file of files) {
        if (!file.isFile()) { continue }

        const es = HAR.Load(Path.join(folder, file.name)).log.entries
        for (const entry of es) {
            entries.push(entry)
        }
    }
    return entries
}

function Load() {
    const entries = GetEntries()

    /** @type {{ [key: string]: import('./har-discord-browser').CollectedChannel }} */
    const channels = { }
    /** @type {import('./har-discord-browser').Invitation[]} */
    const invites = []
    /** @ts-ignore @type {{ "@me": import('./har-discord-browser').CollectedMe, [id: string]: import('./har-discord-browser').CollectedUser2 }} */
    const users = { }
    const guilds = { }

    for (const entry of entries) {
        if (!entry.request.url.startsWith('https://discord.com/api/v9/')) { continue }
        const url = new URL(entry.request.url)
        const apiPath = url.pathname.replace('/api/v9/', '')

        let response = null
        if (entry.response.content.mimeType === 'application/json') {
            try { response = JSON.parse(entry.response.content.text) }
            catch (error)
            { console.error(error) }
        }

        if (apiPath.startsWith('channels')) {
            const channel = apiPath.split('/')[1]
            const method = apiPath.split('/')[2]

            if (!channels[channel]) {
                channels[channel] = {
                    messages: [],
                    id: channel,
                }
            }

            if (method === 'messages') {
                /** @type {Types.Message[]} */
                const messages = JSON.parse(entry.response.content.text)
                if (Array.isArray(messages)) {
                    for (const message of messages) {
                        let found = false
                        for (const otherMessage of channels[channel].messages) {
                            if (otherMessage.id == message.id) {
                                found = true
                                break
                            }
                        }
                        if (!found) {
                            channels[channel].messages.push(message)
                        }
                    }
                }
            } else {
                debugger
            }
        } else if (apiPath.startsWith('invites')) {
            const inviteID = apiPath.replace('invites/', '')
            /** @type {Types.Invitation} */
            const invitation = JSON.parse(entry.response.content.text)
            let found = false
            for (const otherInvitation of invites) {
                if (otherInvitation.code === invitation.code) {
                    found = true
                }
            }
            if (!found) {
                invites.push(invitation)
            }
        } else if (apiPath.startsWith('users')) {
            const userId = apiPath.split('/')[1]
            const userPath = apiPath.substring(userId.length + 'users'.length + 2)
            if (!users[userId]) {
                // @ts-ignore
                users[userId] = { }
            }
            if (!users[userId][userPath]) {
                users[userId][userPath] = { }
            }
            users[userId][userPath] = {
                ...users[userId][userPath],
                ...response,
            }
        } else if (apiPath === 'science') {
        } else if (apiPath === 'auth/login') {
        } else if (apiPath === 'auth/mfa/totp') {
        } else if (apiPath === 'creator-monetization/marketing/nag-activate/eligibility') {
        } else if (apiPath === 'applications/detectable') {
        } else if (apiPath.startsWith('guilds')) {
            const guildId = apiPath.split('/')[1]
            const guildPath = apiPath.substring(guildId.length + 'guilds'.length + 2)
            if (!guilds[guildId]) {
                guilds[guildId] = { }
            }
            if (!guilds[guildId][guildPath]) {
                guilds[guildId][guildPath] = { }
            }
            guilds[guildId][guildPath] = {
                ...guilds[guildId][guildPath],
                ...response,
            }
        } else {
            debugger
        }
    }

    for (const invitation of invites) {
        if (invitation.guild) {
            if (!guilds[invitation.guild.id]) {
                guilds[invitation.guild.id] = { }
            }

            guilds[invitation.guild.id] = {
                ...guilds[invitation.guild.id],
                ...invitation.guild,
                memberCount: invitation.approximate_member_count,
                channels: { },
            }

            if (!guilds[invitation.guild.id].channels[invitation.channel.id]) {
                guilds[invitation.guild.id].channels[invitation.channel.id] = { }
            }

            guilds[invitation.guild.id].channels[invitation.channel.id] = {
                ...guilds[invitation.guild.id].channels[invitation.channel.id],
                ...invitation.channel,
            }
        }

        if (invitation.channel) {
            if (!channels[invitation.channel.id]) {
                channels[invitation.channel.id] = {
                    id: invitation.channel.id,
                    messages: [ ],
                }
            }

            channels[invitation.channel.id] = {
                ...channels[invitation.channel.id],
                ...invitation.channel,
                guild_id: invitation.guild?.id,
            }
        }
    }

    const result = {
        channels: channels,
        invitations: invites,
        users: users,
    }

    for (const channel in channels) {
        if (!channels[channel].id) { channels[channel].id = channel }

        const dirPath = Path.join(RESULT_PATH, 'result', 'channels')
        const filePath = Path.join(dirPath, `${channel}.json`)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(filePath, JSON.stringify(channels[channel], null, ' '), 'utf8')
    }

    for (const user in users) {
        // @ts-ignore
        if (!users[user].id) { users[user].id = user }

        const dirPath = Path.join(RESULT_PATH, 'result', 'users')
        const filePath = Path.join(dirPath, `${user}.json`)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(filePath, JSON.stringify(users[user], null, ' '), 'utf8')
    }

    for (const invitation in invites) {
        // @ts-ignore
        if (!invites[invitation].id) { invites[invitation].id = invitation }

        const dirPath = Path.join(RESULT_PATH, 'result', 'invitations')
        const filePath = Path.join(dirPath, `${invitation}.json`)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(filePath, JSON.stringify(invites[invitation], null, ' '), 'utf8')
    }

    for (const guild in guilds) {
        if (!guilds[guild].id) { guilds[guild].id = guild }

        const dirPath = Path.join(RESULT_PATH, 'result', 'guilds')
        const filePath = Path.join(dirPath, `${guild}.json`)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(filePath, JSON.stringify(guilds[guild], null, ' '), 'utf8')
    }

    return result
}

function Invitations(cache = false) {
    if (cache && fs.existsSync(RESULT_PATH + 'discord/invites.json')) {
        try {
            const raw = fs.readFileSync(RESULT_PATH + 'discord/invites.json', 'utf-8')
            const parsed = JSON.parse(raw)
            return parsed
        } catch (error) { }
    }

    const entries = GetEntries()

    const invites = []

    for (const entry of entries) {
        if (!entry.request.url.startsWith('https://discord.com/api/v9/')) { continue }
        const url = new URL(entry.request.url)
        const apiPath = url.pathname.replace('/api/v9/', '')

        if (apiPath.startsWith('invites')) {
            const inviteID = apiPath.replace('invites/', '')
            /** @type {Types.Invitation} */
            const invitation = JSON.parse(entry.response.content.text)
            let found = false
            for (const otherInvitation of invites) {
                if (otherInvitation.code === invitation.code) {
                    found = true
                }
            }
            if (!found) {
                invites.push(invitation)
            }
        }
    }

    if (!fs.existsSync(RESULT_PATH + 'discord/invites.json'))
    { fs.mkdirSync(RESULT_PATH + 'discord/', { recursive: true }) }
    fs.writeFileSync(RESULT_PATH + 'discord/invites.json', JSON.stringify(invites, null, ' '), 'utf-8')

    return invites
}

function Guilds() {
    return GetJsons(Path.join(RESULT_PATH, 'result', 'guilds'))
}

/**
 * @param {string} id
 */
function Guild(id) {
    const filePath = Path.join(RESULT_PATH, 'result', 'guilds', `${id}.json`)
    if (!fs.existsSync(filePath)) {
        return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function Channels() {
    return GetJsons(Path.join(RESULT_PATH, 'result', 'channels'))
}

/**
 * @param {string} id
 * @returns {import('./har-discord-browser').CollectedChannel}
 */
function Channel(id) {
    const filePath = Path.join(RESULT_PATH, 'result', 'channels', `${id}.json`)
    if (!fs.existsSync(filePath)) {
        return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/**
 * @param {string} userId
 */
function DMChannel(userId) {
    const channels = Channels()
    for (const channelId of channels) {
        const channel = Channel(channelId)
        if (channel.guild_id) { continue }
        for (const message of channel.messages) {
            if (message.author.id == userId) {
                return channel
            }
        }
    }
    return null
}

function Users() {
    return GetJsons(Path.join(RESULT_PATH, 'result', 'users'))
}

/**
 * @param {string} id
 * @returns {import('./har-discord-browser').CollectedUser2}
 */
function User(id) {
    const filePath = Path.join(RESULT_PATH, 'result', 'users', `${id}.json`)
    if (!fs.existsSync(filePath)) {
        return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

module.exports = { Load, Guilds, Guild, Channels, Channel, Invitations, DMChannel, Users, User }
