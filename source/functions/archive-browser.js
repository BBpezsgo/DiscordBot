const fs = require('fs')
const Types = require('./archive-browser')
const Path = require('path')
const CSV = require('csv')

const ARCHIVE_PATH = 'D:/Mappa/Discord/DiscordOldData/'

function README() { return fs.readFileSync(ARCHIVE_PATH + 'README.txt', 'utf-8') }

function GetFolders(folder) {
    const contents = fs.readdirSync(folder, { withFileTypes: true })
    let result = []
    for (let i = 0; i < contents.length; i++) {
        const item = contents[i]
        if (item.isDirectory()) {
            result.push(item.name)
        }
    }
    return result
}

function Guilds() {
    /** @type {Types.Dictionary<string, string>} */
    const index = JSON.parse(fs.readFileSync(ARCHIVE_PATH + 'servers/index.json'))

    const folders = GetFolders(ARCHIVE_PATH + 'servers/')

    /** @type {Types.Dictionary<Types.ArchivedGuild>} */
    let result = { }

    for (const id in index) {
        result[id] = {
            id: id,
            name: index[id]
        }
    }

    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i]
        result[folder] = {
            ...result[folder],
            id: folder,
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'guild.json'))) {
            const guild = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'guild.json'), 'utf-8'))
            result[folder] = {
                ...result[folder],
                ...guild,
            }
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'audit-log.json'))) {
            result[folder].AuditLog = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'audit-log.json'), 'utf-8'))
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'bans.json'))) {
            result[folder].Bans = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'bans.json'), 'utf-8'))
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'channels.json'))) {
            result[folder].Channels = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'channels.json'), 'utf-8'))
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'emoji.json'))) {
            /** @type {Types.ArchivedEmoji[]} */
            const emojis = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'emoji.json'), 'utf-8'))
            for (let i = 0; i < emojis.length; i++) {
                if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'emoji', emojis[i].id + '.png'))) {
                    emojis[i].image_path = Path.join(ARCHIVE_PATH, 'servers', folder, 'emoji', emojis[i].id + '.png')
                }
            }
            result[folder].Emojis = emojis
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'webhooks.json'))) {
            result[folder].Webhooks = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'webhooks.json'), 'utf-8'))
        }

        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'servers', folder, 'icon.png'))) {
            result[folder].IconPath = Path.join(ARCHIVE_PATH, 'servers', folder, 'icon.png')
        }
    }

    return result
}

/** @returns {Promise<Types.ArchivedMessage[]>} */
function ParseMessages(path) {
    return new Promise((resolve, reject) => {
        const messages = []
        fs.createReadStream(path)
            .pipe(CSV.parse({ delimiter: ",", from_line: 2 }))
            .on('data', function (row) {
                if (row.length > 3) {
                    messages.push({
                        id: row[0],
                        date: row[1],
                        content: row[2],
                        attachment: row[3],
                    })
                } else {
                    messages.push(null)
                }
            })
            .on('end', () => {
                resolve(messages)
            })
            .on('error', reject)
    })
}

async function Messages() {
    /** @type {Types.ArchivedMessageChannel[]} */
    const channels = []

    const folders = GetFolders(Path.join(ARCHIVE_PATH, 'messages'))
    for (const channelId of folders) {
        const channel = JSON.parse(fs.readFileSync(Path.join(ARCHIVE_PATH, 'messages', channelId, 'channel.json')))
        
        /** @type {Types.ArchivedMessage[]} */
        let messages = []
        if (fs.existsSync(Path.join(ARCHIVE_PATH, 'messages', channelId, 'messages.csv'))) {
            messages = await ParseMessages(Path.join(ARCHIVE_PATH, 'messages', channelId, 'messages.csv'))
        }

        channel.messages = messages

        channels.push(channel)
    }
    
    return channels
}

function Account() {
    const accountData = JSON.parse(fs.readFileSync(ARCHIVE_PATH + 'account/user.json', 'utf-8'))
    const avatarImageData = fs.readFileSync(ARCHIVE_PATH + 'account/avatar.png')

    return {
        id: accountData.id,
        username: accountData.username,
        discriminator: accountData.discriminator,
        flags: accountData.flags,
        id: accountData.id,
        avatarData: Buffer.from(avatarImageData).toString('base64'),
    }
}

function Users() {
    const accountData = JSON.parse(fs.readFileSync(ARCHIVE_PATH + 'account/user.json', 'utf-8'))

    const users = []

    for (const relationship of accountData.relationships) {
        users.push(relationship)
    }

    return users
}

async function Servers() {
    const guilds = Guilds()
    const messageChannels = await Messages()

    for (let i = 0; i < messageChannels.length; i++) {
        const messageChannel = messageChannels[i]
        if (messageChannel.guild) {
            if (guilds[messageChannel.guild.id]) {
                if (!guilds[messageChannel.guild.id].Channels)
                { guilds[messageChannel.guild.id].Channels = [] }
                
                let found = false
                for (let i = 0; i < guilds[messageChannel.guild.id].Channels.length; i++) {
                    const channel = guilds[messageChannel.guild.id].Channels[i]
                    if (channel.id != messageChannel.id) { continue }
                    found = true

                    if (!channel.messages)
                    { channel.messages = [] }

                    for (const message of messageChannel.messages)
                    { guilds[messageChannel.guild.id].Channels[i].messages.push(message) }

                    break
                }

                if (!found) guilds[messageChannel.guild.id].Channels.push({
                    id: messageChannel.id,
                    name: messageChannel.name,
                    type: messageChannel.type,
                    permission_overwrites: [],
                    messages: messageChannel.messages
                })
            }
        } else {

        }
    }

    return guilds
}

module.exports = { README, Servers, Messages, Account, Users }