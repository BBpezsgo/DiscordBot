const HAR = require('./har')
const fs = require('fs')
const Types = require('./har-discord-browser')
const Path = require('path')
const ImageCache = require('./image-cache')

const RESULT_PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/cache/har/'
const INPUT_PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/hars'
const MANUAL_PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/manual-data/'

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

    const channels = {}
    const invites = []

    for (const entry of entries) {
        if (!entry.request.url.startsWith('https://discord.com/api/v9/')) { continue }
        const url = new URL(entry.request.url)
        const apiPath = url.pathname.replace('/api/v9/', '')
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
                console.log(apiPath)
            }
        } else if (apiPath === 'science') {

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
            // console.log(JSON.parse(entry.response.content.text))
        }
    }

    for (const invitation of invites) {
        if (invitation.guild && invitation.channel) {
            if (channels[invitation.channel.id]) {
                channels[invitation.channel.id].guild_id = invitation.guild.id
                channels[invitation.channel.id].name = invitation.channel.name
                channels[invitation.channel.id].type = invitation.channel.type
            }
        }
    }

    const result = {
        channels: channels,
        invitations: invites,
    }

    fs.writeFileSync(RESULT_PATH + 'result.json', JSON.stringify(result, null, ' '), 'utf-8')

    return result
}

function Invitations(cache = true) {
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

function Guilds(cache = true) {
    if (cache && fs.existsSync(RESULT_PATH + 'discord/guilds.json')) {
        try {
            const raw = fs.readFileSync(RESULT_PATH + 'discord/guilds.json', 'utf-8')
            const parsed = JSON.parse(raw)
            return parsed
        } catch (error) { }
    }

    const invitations = Invitations()

    const guilds = { }
    
    for (const invitation of invitations) {
        if (!invitation.guild) { continue }
        if (!guilds[invitation.guild.id]) {
            guilds[invitation.guild.id] = {
                ...invitation.guild,
                memberCount: invitation.approximate_member_count,
                channels: { },
            }
        }

        if (!guilds[invitation.guild.id].channels[invitation.channel.id]) {
            guilds[invitation.guild.id].channels[invitation.channel.id] = invitation.channel
        }
    }

    if (fs.existsSync(MANUAL_PATH + 'guilds.json')) {
        const raw = fs.readFileSync(MANUAL_PATH + 'guilds.json', 'utf-8')
        const parsed = JSON.parse(raw)
        for (const id in parsed) {
            if (guilds[id]) continue
            guilds[id] = parsed[id]
        }
    }

    if (!fs.existsSync(RESULT_PATH + 'discord/guilds.json'))
    { fs.mkdirSync(RESULT_PATH + 'discord/', { recursive: true }) }
    fs.writeFileSync(RESULT_PATH + 'discord/guilds.json', JSON.stringify(guilds, null, ' '), 'utf-8')

    return guilds
}

module.exports = { Load, Guilds, Invitations }